"""Verify actual browser behavior, all local links and Pages base-path resolution."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse,unquote,urljoin
import json,hashlib,urllib.request
from playwright.sync_api import sync_playwright
from dulwich.repo import Repo
from dulwich import porcelain
from PIL import Image,ImageDraw,ImageOps

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
LOCAL='http://127.0.0.1:8751/preview-51/'
PAGES='https://alisonsasan-png.github.io/sahandlaser/preview-51/'
data=json.loads((HERE/'products.json').read_text(encoding='utf-8'))['products']
results={'products':len(data),'localUrl':LOCAL,'pagesPathSimulation':PAGES,'livePreviewDeployed':False}

class Links(HTMLParser):
    def __init__(self):super().__init__();self.links=[]
    def handle_starttag(self,tag,attrs):
        for name,val in attrs:
            if (tag,name) in [('a','href'),('img','src'),('script','src'),('link','href')]:self.links.append(val)
missing=[];escaped=[];local_links=0
for page in HERE.rglob('*.html'):
    parser=Links();parser.feed(page.read_text(encoding='utf-8'))
    for link in parser.links:
        parsed=urlparse(link)
        if parsed.scheme or parsed.netloc or not parsed.path:continue
        target=(page.parent/unquote(parsed.path)).resolve()
        local_links+=1
        if not target.is_relative_to(HERE):escaped.append([str(page),link])
        if not target.is_file():missing.append([str(page),link])
assert not missing,missing
assert not escaped,escaped
results['localLinksChecked']=local_links

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=r'C:\Users\Sharif\AppData\Local\ms-playwright\chromium-1194\chrome-win\chrome.exe',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':1000})
    page=context.new_page();errors=[]
    page.on('pageerror',lambda err:errors.append(str(err)))
    page.goto(LOCAL,wait_until='networkidle')
    page.wait_for_function('window.PREVIEW51')
    assert page.locator('.card').count()==len(data)
    page.locator('#query').fill('CUT-3015-1')
    assert page.locator('.card').count()==1
    page.locator('#query').fill('۳۰۱۵')
    fa=page.locator('.card').count()
    page.locator('#query').fill('3015')
    assert page.locator('.card').count()==fa and fa>0
    page.locator('#query').fill('چيلر')
    assert page.locator('.card').count()>0
    page.locator('#query').fill('no-such-product-8751')
    assert page.locator('.card').count()==0 and page.locator('.empty').count()==1
    page.locator('#clear').click()
    assert page.locator('.card').count()==len(data)
    page.locator('.card .detail').first.click()
    assert '/products/' in page.url
    page.locator('.back').click()
    page.wait_for_function('window.PREVIEW51')
    assert page.locator('.card').count()==len(data)
    groups=sorted({d['category'] for d in data})
    for group in groups:
        page.locator('#category').select_option(group)
        assert page.locator('.card').count()==sum(d['category']==group for d in data)
    page.locator('#query').fill('CUT-3015-1')
    page.locator('#category').select_option('cutting')
    assert page.locator('.card').count()==1
    page.locator('#clear').click()
    page.screenshot(path=str(HERE/'checks/desktop.png'),full_page=False)
    page.set_viewport_size({'width':390,'height':844})
    assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1')
    page.screenshot(path=str(HERE/'checks/mobile.png'),full_page=False)
    image_count=0
    for d in data:
        response=page.goto(LOCAL+'products/'+d['code']+'.html',wait_until='load')
        assert response.status==200
        for img in page.locator('figure img').all():
            assert img.evaluate('(img)=>img.complete&&img.naturalWidth>0'),d['code']
            image_count+=1
        assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+1'),d['code']
    # Same origin/path rules as Pages, fulfilled from the isolated preview only.
    def intercept(route):
        url=route.request.url
        assert url.startswith(PAGES),url
        relative=unquote(url[len(PAGES):].split('?')[0]) or 'index.html'
        path=(HERE/relative).resolve()
        assert path.is_relative_to(HERE) and path.is_file(),relative
        route.fulfill(path=str(path))
    context.route('https://alisonsasan-png.github.io/**',intercept)
    page.goto(PAGES,wait_until='networkidle')
    page.wait_for_function('window.PREVIEW51')
    assert page.locator('.card').count()==len(data)
    # Force every image through browser URL resolution, including lazy cards.
    checks=page.evaluate('''async ()=>Promise.all(window.PREVIEW51.products.flatMap(p=>p.images).map(image=>new Promise(resolve=>{const img=new Image();img.onload=()=>resolve({src:img.src,ok:img.naturalWidth>0});img.onerror=()=>resolve({src:img.src,ok:false});img.src=image.src;})))''')
    assert all(c['ok'] and c['src'].startswith(PAGES+'media/') for c in checks)
    assert not errors,errors
    # An actual failed image request must leave a usable product link.
    failure=context.new_page()
    failure.route('**/media/*',lambda route:route.abort())
    failure.goto(LOCAL,wait_until='networkidle')
    failure.wait_for_function('window.PREVIEW51')
    assert failure.locator('.visual').filter(has_text='تصویر بارگیری نشد').count()>0
    assert failure.locator('.card .detail').count()==len(data)
    failure.close()
    browser.close()
results.update({'browserImagesChecked':image_count,'pagesBaseImageRequests':len(checks),'categoriesChecked':groups,'browserErrors':errors,'mobilePagesChecked':len(data),'searchCases':['exact code','Persian digits','Arabic yeh','empty state','combined filter','clear']})

# Review contact sheets do not alter source images.
matches=json.loads((HERE/'image-matches.json').read_text(encoding='utf-8'))
for batch in range(0,len(matches),20):
    part=matches[batch:batch+20]
    sheet=Image.new('RGB',(1200,((len(part)+3)//4)*245),'#eef3f4')
    draw=ImageDraw.Draw(sheet)
    for n,m in enumerate(part):
        img=Image.open(HERE/m['src']).convert('RGB')
        img.thumbnail((280,205))
        x=(n%4)*300;y=(n//4)*245
        sheet.paste(img,(x+(300-img.width)//2,y))
        draw.text((x+6,y+210),str(batch+n+1)+' '+m['code'],fill='black')
    sheet.save(HERE/f'checks/contact-{batch//20+1}.jpg')

with Repo(str(ROOT)) as repo:
    assert repo.refs.read_ref(b'HEAD')==b'ref: refs/heads/preview-51-catalog'
    status=porcelain.status(repo,untracked_files='all')
    assert not status.unstaged and not any(status.staged.values())
    assert all(s.decode().replace('\\','/').startswith('preview-51/') for s in status.untracked)
    results['trackedFilesUnchanged']=True
    results['localMainHead']=repo.refs[b'refs/heads/main'].decode()
    results['previewBase']=repo.head().decode()
(HERE/'checks/results.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(results,ensure_ascii=False))
