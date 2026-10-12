// Real headless Chromium integration checks, not proof of product hardware accuracy.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Sharif/AppData/Local/SahandLaserBuildTools/browser-tools/node_modules/playwright');
const root=path.resolve(__dirname,'..');
const output=path.join(root,'docs/catalog-completion/inspection/browser');
const types={'.html':'text/html; charset=utf-8','.json':'application/json; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
async function run(){
 const server=http.createServer((req,res)=>{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   const filename=path.resolve(root,'.'+pathname);
   if(!filename.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
   if(!fs.existsSync(filename)||!fs.statSync(filename).isFile()){res.writeHead(404);res.end();return;}
   res.writeHead(200,{'Content-Type':types[path.extname(filename)]||'application/octet-stream'});fs.createReadStream(filename).pipe(res);
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const local='http://127.0.0.1:'+server.address().port+'/status/catalog.html';
 const url=process.argv.includes('--live')?'https://alisonsasan-png.github.io/sahandlaser/status/catalog.html':local;
 fs.mkdirSync(output,{recursive:true});
 let browser;const results=[];
 try{
  browser=await chromium.launch({headless:true,channel:'chromium'});
  for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1366,height:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1});
   const page=await context.newPage(),errors=[],badResponses=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',response=>{if(response.status()>=400&&!response.url().endsWith('/favicon.ico'))badResponses.push({url:response.url(),status:response.status()});});
   await page.goto(url,{waitUntil:'networkidle'});
   await page.waitForFunction(()=>document.querySelectorAll('#catalog details').length===106);
   const catalogCount=await page.locator('#catalog details').count();
   const sourcedSpecRecords=await page.evaluate(()=>products.filter(p=>p.specs.some(s=>s.source)).length);
   assert(sourcedSpecRecords>=25,'published source records are behind the tested catalog');
   const pictures=page.locator('#gallery img'),imageCount=await pictures.count();
   for(let i=0;i<imageCount;i++){await pictures.nth(i).scrollIntoViewIfNeeded();await pictures.nth(i).evaluate(img=>img.decode());}
   assert(imageCount>=38);
   await page.locator('#query').fill('DZ3015S');assert.equal(await page.locator('#catalog details').count(),1);
   await page.locator('#query').fill('');await page.locator('#category').selectOption('welding');assert.equal(await page.locator('#catalog details').count(),13);
   await page.locator('#category').selectOption('');
   const stage=page.locator('#optical-stage');await stage.scrollIntoViewIfNeeded();
   await page.locator('#optical-image').evaluate(img=>img.decode());
   const box=await stage.boundingBox();assert(box&&box.width>100);
   if(mobile){
    const session=await context.newCDPSession(page);
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width*.2,y:box.y+box.height*.45}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width*.8,y:box.y+box.height*.45}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await session.detach();
   }else await page.mouse.move(box.x+box.width*.8,box.y+box.height*.45);
   const amount=Number(await page.locator('#optical-range').inputValue());assert(amount>=75&&amount<=85,'pointer reveal should follow movement, got '+amount);
   await stage.screenshot({path:path.join(output,(process.argv.includes('--live')?'live-':'local-')+(mobile?'optical-mobile.png':'optical-desktop.png'))});
   await page.locator('#optical-range').focus();await page.keyboard.press('Home');assert.equal(await page.locator('#optical-range').inputValue(),'0');
   await page.keyboard.press('End');assert.equal(await page.locator('#optical-range').inputValue(),'100');
   await page.locator('#optical-mode').click();assert.equal(await page.locator('#optical-mode').getAttribute('aria-pressed'),'true');
   assert((await page.locator('#optical-image').getAttribute('src')).endsWith('optical-schematic.svg'));
   await page.locator('#optical-image').evaluate(img=>img.decode());await page.locator('#optical-mode').click();
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true,'horizontal page overflow');
   assert.equal(errors.length,0);assert.equal(badResponses.length,0);
   results.push({viewport:mobile?'390x844 touch emulation':'1366x900 desktop',catalogCount,sourcedSpecRecords,imageCount,articleCount:await page.locator('#articles details').count(),pointerReveal:amount,keyboardRange:true,imageDecode:true,pageErrors:errors,badResponses});
   await context.close();
  }
  const report={at:new Date().toISOString(),engine:await browser.version(),url,scope:'Actual Chromium headless; mobile is emulation, not a physical handset. UI functionality only, not internal hardware geometry approval.',passed:true,results};
  fs.writeFileSync(path.join(output,process.argv.includes('--live')?'live-results.json':'local-results.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
 }finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
}
run().catch(error=>{console.error(error);process.exitCode=1;});

