const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),http=require('node:http');
const {chromium}=require('C:/Users/Sharif/AppData/Local/SahandLaserBuildTools/browser-tools/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const decisions=require('../docs/catalog-completion/image-decisions.json');
const approved=Object.entries(decisions).filter(([,d])=>d.decision==='use');
const live=process.argv.includes('--live');
const server=http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));
 if(!file.startsWith(root+path.sep)&&file!==root){res.writeHead(403).end();return;}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){res.writeHead(404).end();return;}
 res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.jpg':'image/jpeg','.css':'text/css; charset=utf-8'})[path.extname(file)]||'application/octet-stream');
 fs.createReadStream(file).pipe(res);
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=live?'https://alisonsasan-png.github.io/sahandlaser':`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true});const results=[];
 try{
 for(const n of [3,4,5,...Array.from({length:17},(_,i)=>i+12)]){
  const page=await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`${base}/preview-${n}/?media-check=${Date.now()}`,{waitUntil:'load',timeout:60000});
  for(const [code,d] of approved){
   const actual=await page.evaluate(code=>{
    if(window.SAHAND_PRODUCTS?.[code])return window.SAHAND_PRODUCTS[code].media.images[0];
    const embedded=document.getElementById('product-data');return embedded&&JSON.parse(embedded.textContent).find(p=>p.code===code)?.images[0];
   },code);
   assert.ok(actual?.endsWith(d.src),`preview ${n}: ${code} primary image not mapped: ${actual}`);
   const decoded=await page.evaluate(async src=>{const i=new Image();i.src=src;try{await i.decode();return i.naturalWidth>500;}catch{return false;}},actual);
   assert.ok(decoded,`preview ${n}: ${code} failed image decode`);
  }
  if(n!==5){
   await page.evaluate(()=>window.showProduct('WELD-2000'));
   const img=page.locator('img[src*="catalog-v2/WELD-2000/studio-web.jpg"]').filter({visible:true}).first();
   await img.waitFor({state:'visible',timeout:15000});
  }
  assert.deepEqual(errors,[],`preview ${n} JavaScript errors`);
  results.push({preview:n,primaryImages:approved.length,decoded:true});
  if(n===12){await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(root,'status/image-mobile-check.png')});}
  await page.close();
 }
 console.log(JSON.stringify({live,passed:true,results}));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});