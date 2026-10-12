// Syntax + simulated DOM tests. These are not browser/GPU visual acceptance.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {JSDOM}=require('C:/Users/Sharif/AppData/Local/SahandLaserBuildTools/dom-tools/node_modules/jsdom');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const catalog=JSON.parse(read('docs/catalog-completion/catalog-draft.json')),articles=JSON.parse(read('docs/catalog-completion/articles.json'));
assert.equal(catalog.products.length,106);assert.equal(new Set(catalog.products.map(p=>p.code)).size,106);
const expected=['تک میز DZ3015S','تک میز DZ3015H','تک میز LD3015','دو میز DZ3015','دو میز LD3015','دو میز کابین‌دار DZ3015','تک میز 3015 + لوله‌بر','دو میز 3015 + لوله‌بر','دو میز کابین‌دار 3015 + لوله‌بر'];
assert.deepEqual(catalog.products.filter(p=>p.family==='3015').map(p=>p.name),expected);
assert.equal(catalog.products.filter(p=>p.family==='6020').length,9);
const studioCount=catalog.products.filter(p=>p.visuals.studio).length;assert(studioCount>=36);
for(const [code,watts] of [['SRC-RAY-C3000S','7500'],['SRC-RAY-C4000S','10000'],['SRC-RAY-C6000S','15000']]){
 assert(catalog.products.find(p=>p.code===code).specs.some(s=>s.label.includes('ظرفیت سرمایشی')&&s.value.includes(watts)&&s.source));
}
const evidence=JSON.parse(read('docs/catalog-completion/manufacturer-evidence-integrity.json'));
const crypto=require('node:crypto');
for(const file of evidence.files){const bytes=fs.readFileSync(path.join(root,file.file));assert.equal(bytes.length,file.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),file.sha256);}
assert(catalog.products.find(p=>p.code==='CP-RAY-BM110').specs.some(s=>s.label==='شیشه‌های محافظ در جدول قطعات V2.0'&&s.value.includes('میانی')));
assert(catalog.products.find(p=>p.code==='CP-RAY-BM110').visuals.opticalReconstruction.src.endsWith('xray-web-v5.jpg'));
for(const code of ['CC001','CC002','CC003']){
  const product=catalog.products.find(p=>p.code===code);
  assert(product.sources.some(source=>source.scope==='manufacturer_web_variant'));
  assert(product.specs.some(spec=>spec.scope==='manufacturer_web'&&spec.source));
}
assert(catalog.products.find(p=>p.code==='CC002').specs.some(spec=>spec.label==='حجم مخزن ANPTY / BNPTY'&&spec.value==='22 L'));
const head114=catalog.products.find(p=>p.code==='CH004');
const bt240s=catalog.products.find(p=>p.code==='CH001');
const bt220=catalog.products.find(p=>p.code==='CP-RAY-BT220');
assert(bt240s.specs.some(s=>s.label==='روش تنظیم فوکوس نسخه دفترچه'&&s.value.includes('دستی')));
assert(bt220.specs.some(s=>s.label==='توان نامی نسخه دفترچه'&&s.value==='2 kW'));
assert(!catalog.products.find(p=>p.code==='CP-RAY-BT240').sources.some(s=>(s.url||'').includes('BT240S')));
const assemblies=JSON.parse(read('docs/catalog-completion/internal-assembly-references.json'));
assert(assemblies.models.every(model=>model.coverWindowCount===2&&model.focusActuation.includes('manual')&&!model.visualComplete));
const head115=catalog.products.find(p=>p.code==='CH005');
assert(head114.specs.some(s=>s.label==='محافظ‌های بالا و میانی V1.0'&&s.value.includes('1.6')));
assert(head115.specs.some(s=>s.label==='محافظ میانی و پایین V1.0'&&s.value.includes('7 mm')));
assert(head114.specs.some(s=>s.value==='D37؛ F150 / F190.5'));
assert(head115.specs.some(s=>s.value==='D38.1'));
for(const code of ['CP-RAY-BM114E','CP-RAY-BM115E'])assert(!catalog.products.find(p=>p.code===code).sources.some(s=>/\/11[45]az-zh\.pdf$/.test(s.url||'')));
for(const p of catalog.products){assert.equal(p.comparable,['cutting','welding','marking','cleaning'].includes(p.category));assert(!p.ready);if(p.visuals.studio)assert(fs.existsSync(path.join(root,p.visuals.studio.src)));}
assert(articles.length>=8);assert.equal(new Set(articles.map(a=>a.id||a.slug)).size,articles.length);for(const article of articles){assert.equal(article.sections.length,3);assert(article.sources.every(source=>source.url.startsWith('https://')));}
for(const filename of ['status/index.html','status/catalog.html']){const html=read(filename);for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1],{filename});}
async function test(){const html=read('status/catalog.html');const errors=[];const dom=new JSDOM(html,{runScripts:'dangerously',url:'https://example.test/status/catalog.html',beforeParse(window){window.fetch=async url=>({ok:true,json:async()=>url.includes('catalog-draft')?catalog:articles});window.addEventListener('error',event=>errors.push(event.error));}});await new Promise(resolve=>setTimeout(resolve,80));const document=dom.window.document;assert.equal(document.querySelectorAll('#catalog details').length,106);assert.equal(document.querySelectorAll('#gallery img').length,studioCount);assert.equal(document.querySelectorAll('#articles details').length,articles.length);const input=document.getElementById('query');input.value='DZ3015S';input.dispatchEvent(new dom.window.Event('input'));assert.equal(document.querySelectorAll('#catalog details').length,1);input.value='';document.getElementById('category').value='welding';document.getElementById('category').dispatchEvent(new dom.window.Event('change'));assert.equal(document.querySelectorAll('#catalog details').length,13);const range=document.getElementById('optical-range');range.value='100';range.dispatchEvent(new dom.window.Event('input'));assert.equal(document.getElementById('optical-layer').style.clipPath,'inset(0 0% 0 0)');range.value='0';range.dispatchEvent(new dom.window.Event('input'));assert.equal(document.getElementById('optical-layer').style.clipPath,'inset(0 100% 0 0)');const mode=document.getElementById('optical-mode');assert(document.getElementById('optical-image').src.endsWith('xray-web-v5.jpg'));mode.click();assert(document.getElementById('optical-image').src.endsWith('optical-schematic.svg'));mode.click();assert(document.getElementById('optical-image').src.endsWith('xray-web-v5.jpg'));for(const code of ['SRC-RAY-C3000S','SRC-RAY-C6000S'])assert.equal(catalog.products.find(p=>p.code===code).visuals.sourceCandidate.identityReview,'rejected_for_exact_model');assert.equal(errors.length,0);dom.window.close();console.log('PASS: JSON, exact family names, studio image references, sourced articles, script syntax, simulated catalog/search/filter and optical slider DOM');}
test().catch(error=>{console.error(error);process.exitCode=1;});

