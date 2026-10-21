"""Read-only verification of the separate immutable CDN preview, not main Pages."""
from pathlib import Path
from urllib.parse import quote
import json,concurrent.futures,urllib.request,time
from playwright.sync_api import sync_playwright
HERE=Path(__file__).resolve().parent
COMMIT='e2dbc50dd24adbdabf1defa67523604c193ed71d'
BASE=f'https://rawcdn.githack.com/alisonsasan-png/sahandlaser/{COMMIT}/preview-51/'
data=json.loads((HERE/'products.json').read_text(encoding='utf-8'))['products']
results={'commit':COMMIT,'url':BASE+'index.html','hosting':'Independent read-only CDN view of preview branch commit; not main GitHub Pages','localTestResults':'checks/results.json'}
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Users\Sharif\AppData\Local\ms-playwright\chromium-1194\chrome-win\chrome.exe',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    context.add_cookies([{'name':'__Http-phish','value':'1','domain':'rawcdn.githack.com','path':'/','secure':True,'httpOnly':True}])
    page=context.new_page();errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    response=page.goto(BASE+'index.html',wait_until='domcontentloaded',timeout=120000)
    print('index HTTP '+str(response.status),flush=True)
    page.wait_for_function('window.PREVIEW51',timeout=120000)
    assert page.locator('.card').count()==len(data)
    page.locator('#query').fill('CUT-3015-1')
    assert page.locator('.card').count()==1
    page.locator('.detail').first.click()
    page.wait_for_load_state('load',timeout=120000)
    assert 'CUT-3015-1.html' in page.url
    assert page.locator('figure img').first.evaluate('(i)=>i.complete&&i.naturalWidth>0')
    page.locator('.back').click()
    page.wait_for_function('window.PREVIEW51',timeout=120000)
    for group in sorted({d['category'] for d in data}):
        page.locator('#category').select_option(group)
        assert page.locator('.card').count()==sum(d['category']==group for d in data)
    page.locator('#clear').click()
    images=page.evaluate('''async ()=>Promise.all(window.PREVIEW51.products.flatMap(p=>p.images).map(image=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src:img.src,ok:img.naturalWidth>0});img.onerror=()=>resolve({src:img.src,ok:false});img.src=image.src;})))''')
    assert len(images)==53 and all(i['ok'] for i in images),[i for i in images if not i['ok']]
    page.screenshot(path=str(HERE/'checks/live-desktop.png'),full_page=False)
    page.set_viewport_size({'width':390,'height':844})
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
    page.screenshot(path=str(HERE/'checks/live-mobile.png'),full_page=False)
    assert not errors,errors
    results.update({'browserImagesLoaded':len(images),'productCount':len(data),'searchPassed':True,'categoryFiltersPassed':8,'productNavigationPassed':True,'mobileOverflow':False,'browserErrors':errors})
    print('browser checks passed',flush=True)
    # Fetch in the real browser context with the same CDN confirmation cookie;
    # generic Python HTTP requests can be rejected by the CDN with 403.
    pages=page.evaluate('''async products=>{
      const results=[];let next=0;
      async function worker(){while(next<products.length){const p=products[next++];const response=await fetch('products/'+encodeURIComponent(p.code)+'.html');const text=await response.text();const parsed=new DOMParser().parseFromString(text,'text/html');results.push({code:p.code,status:response.status,titleFound:parsed.body.textContent.includes(p.name)});}}
      await Promise.all(Array.from({length:4},worker));return results;
    }''',[{'code':p['code'],'name':p['name']} for p in data])
    browser.close()
results['pages']=pages
(HERE/'checks/live-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
assert len(pages)==len(data) and all(p['status']==200 and p['titleFound'] for p in pages),[p for p in pages if p['status']!=200 or not p['titleFound']]
results['liveProductPagesChecked']=len(pages)
results['pages']=pages
(HERE/'checks/live-results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v for k,v in results.items() if k!='pages'},ensure_ascii=False),flush=True)
