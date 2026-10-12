// Hashes prove file integrity, not installed-product identity.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),folder=path.join(root,'docs/catalog-completion'),manuals=path.join(folder,'manufacturer-manuals');
const rows=fs.readdirSync(manuals).filter(name=>name.endsWith('.pdf')).map(name=>{
 const bytes=fs.readFileSync(path.join(manuals,name));
 if(bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Invalid PDF: '+name);
 return {file:'docs/catalog-completion/manufacturer-manuals/'+name,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')};
});
fs.writeFileSync(path.join(folder,'manufacturer-evidence-integrity.json'),JSON.stringify({note:'Preserved references; integrity is not proof of stock identity or internal geometry.',files:rows},null,2)+'\n');
console.log(JSON.stringify({validLocalPdfs:rows.length,totalBytes:rows.reduce((sum,row)=>sum+row.bytes,0)}));

