const fs=require('node:fs'),path=require('node:path');const root=path.resolve(__dirname,'..');
const [mode,query]=process.argv.slice(2);
if(mode==='pdfpage'){const [filename,page]=query.split(':');const docs=JSON.parse(fs.readFileSync(path.join(root,'docs/catalog-completion/pdf-extracts.json'),'utf8'));const doc=docs.find(d=>d.filename===filename);console.log(doc?.text.find(p=>p.page===Number(page))?.text||'Page not found');}
else if(mode==='pdf'){const docs=JSON.parse(fs.readFileSync(path.join(root,'docs/catalog-completion/pdf-extracts.json'),'utf8'));const matches=docs.flatMap(d=>d.text.filter(p=>p.text.toLowerCase().includes(query.toLowerCase())).map(p=>({file:d.filename,page:p.page,text:p.text.slice(0,2400)})));console.log(JSON.stringify(matches.slice(0,8),null,2));}
else{const data=JSON.parse(fs.readFileSync(path.join(root,'docs/catalog-completion/catalog-draft.json'),'utf8'));console.log(JSON.stringify(data.products.filter(p=>p.code===query||p.category===query).map(p=>({code:p.code,name:p.name,specs:p.specs,series:p.seriesReference})),null,2));}

