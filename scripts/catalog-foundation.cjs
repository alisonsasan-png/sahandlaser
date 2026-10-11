// Non-destructive catalog audit: original data and images are never rewritten.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'preview-5/index.html'),'utf8');
const match=html.match(/<script id="product-data" type="application\/json">([\s\S]*?)<\/script>/);
if(!match)throw Error('Embedded product catalog missing');
const products=JSON.parse(match[1]);
const relative=p=>p.replace(/^\.\.\//,'').replace(/^\.\//,'');
const present=p=>typeof p==='string'&&!/^https?:/.test(p)&&fs.existsSync(path.join(root,relative(p)));
const originals=fs.readdirSync(path.join(root,'data/products')).filter(p=>p.endsWith('.js'));
const rows=products.map(p=>{const images=(p.images||[]).map(image=>typeof image==='string'?image:image.src).filter(Boolean);return {code:p.code,name:p.name,category:p.category,family:p.family||'',specCount:(p.specs||[]).length,images:images.map(src=>({src,exists:present(src)})),hasExistingImage:images.some(present),missingFields:['power','source','head','controller','accuracy','speed','dimensions','weight'].filter(key=>!p[key]),researchStatus:'not_model_verified',internalViewStatus:'not_model_verified'};});
const allImages=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const location=path.join(dir,entry.name);if(entry.isDirectory())walk(location);else if(/\.(png|jpe?g|webp)$/i.test(entry.name))allImages.push(path.relative(root,location).replaceAll('\\','/'));}}walk(path.join(root,'assets/products'));
const audit={version:1,date:'2026-10-11',source:'preview-5 embedded catalog + local original files',originalRecordCount:originals.length,productCount:products.length,categories:Object.fromEntries([...new Set(products.map(p=>p.category))].map(cat=>[cat,products.filter(p=>p.category===cat).length])),withExistingImage:rows.filter(r=>r.hasExistingImage).length,withoutExistingImage:rows.filter(r=>!r.hasExistingImage).length,originalImages:allImages,products:rows};
fs.mkdirSync(path.join(root,'docs/catalog-completion'),{recursive:true});
fs.writeFileSync(path.join(root,'docs/catalog-completion/inventory.json'),JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(path.join(root,'docs/catalog-completion/base-products.json'),JSON.stringify(products,null,2)+'\n');
console.log(JSON.stringify({originalRecords:originals.length,products:products.length,categories:audit.categories,existingImages:audit.withExistingImage,missingImages:audit.withoutExistingImage,localImageFiles:allImages.length},null,2));

