// Merge authored article additions and create a truthful per-product work queue.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'docs/catalog-completion');
const read=name=>JSON.parse(fs.readFileSync(path.join(folder,name),'utf8').replace(/^\uFEFF/,''));
const articles=new Map(read('articles.json').map(article=>[article.id||article.slug,article]));
for(const article of read('articles-additions.json'))articles.set(article.id||article.slug,{...article,id:article.id||article.slug});
fs.writeFileSync(path.join(folder,'articles.json'),JSON.stringify([...articles.values()],null,2)+'\n');
const catalog=read('catalog-draft.json');
const isReviewable=product=>(product.category==='cutting'&&!['CUT-custom','CUT-tube','CUT-robot'].includes(product.code))||(product.category==='head'&&(/^CH\d+$/.test(product.code)||/^CP-RAY-/.test(product.code)));
const isTaxonomyNode=product=>['CUT-custom','CUT-tube','CUT-robot','MK-FIBER-GENERIC'].includes(product.code);
const work=catalog.products.map(product=>({code:product.code,name:product.name,category:product.category,
  studioImage:Boolean(product.visuals.studio),
  sourcedSpecifications:product.specs.filter(spec=>Boolean(spec.source)).length,
  suppliedSeriesDocument:Boolean(product.seriesReference),
  mediaIdentityIssue:product.visuals.sourceCandidate?.identityReview?.includes('rejected')||product.visuals.sourceCandidate?.identityReview==='insufficient_model_identity' ? product.visuals.sourceCandidate : null,
  remaining:[...(!product.visuals.studio?['prepare product-specific studio image']:[]),...(!isTaxonomyNode(product)&&!product.specs.some(spec=>spec.source)&&!product.seriesReference?['reconcile exact-model specifications']:[]),...(isReviewable(product)&&!product.visuals.technicalDrawing&&!product.visuals.technicalReview?['review technical drawing/internal-assembly applicability']:[])]}));
const summary={date:catalog.date,products:work.length,studioImages:work.filter(p=>p.studioImage).length,
  recordsWithSourcedSpecifications:work.filter(p=>p.sourcedSpecifications>0).length,
  recordsWithManufacturerReferenceSpecifications:catalog.products.filter(p=>p.specs.some(s=>s.source&&/^manufacturer_/.test(s.scope))).length,
  recordsWithUserSeriesSpecifications:catalog.products.filter(p=>p.specs.some(s=>s.source&&s.scope==='user_supplied_series_options')).length,
  recordsWithUserArtworkSpecifications:catalog.products.filter(p=>p.specs.some(s=>s.source&&s.scope==='user_supplied_artwork')).length,
  suppliedSeriesDocuments:work.filter(p=>p.suppliedSeriesDocument).length,
  rejectedOrAmbiguousImages:work.filter(p=>p.mediaIdentityIssue).length,articles:articles.size,
  releaseGate:catalog.releaseGate,productsWorkQueue:work};
fs.writeFileSync(path.join(folder,'completion-progress.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify({...summary,productsWorkQueue:undefined},null,2));

