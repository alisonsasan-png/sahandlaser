"""Generate only preview-51; never writes shared catalog/data or older previews."""
from pathlib import Path
import json, hashlib, shutil, html, re

HERE=Path(__file__).resolve().parent
ROOT=HERE.parent
e=html.escape
BASE='1f597a8de835bd43e65d1efe136e161056202129'
GITHUB=f'https://github.com/alisonsasan-png/sahandlaser/blob/{BASE}/'
LOCAL=Path(r'F:\تصاویر فشرده\برش')
EXT={'.jpg','.jpeg','.png','.webp','.jfif','.svg','.gif'}
def read(path): return json.loads(path.read_text(encoding='utf-8-sig'))
def output(path, content):
    dest=(HERE/path).resolve()
    assert dest.is_relative_to(HERE)
    dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(content,encoding='utf-8')
def dump(path,obj): output(Path(path),json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def source_link(path): return GITHUB+path
def shell(title,body,prefix='../'):
    return '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>'+e(title)+' | پیش‌نمایش ۵۱</title><link rel="stylesheet" href="'+prefix+'catalog.css"></head><body><header><div class="wrap"><p>سهند لیزر · پیش‌نمایش ۵۱</p><h1>'+e(title)+'</h1></div></header><main class="wrap product"><a class="back" href="'+prefix+'index.html">بازگشت به کاتالوگ</a>'+body+'</main></body></html>'

raw=read(HERE/'evidence/catalog-draft.json')['products']
decisions=read(HERE/'evidence/image-decisions.json')
rejections=read(HERE/'evidence/media-review-findings.json')
rejections.update({
 'CH002':{'reason':'Current contact-sheet review: pictured green multi-axis/scan-style assembly does not establish the BM109 cutting-head identity. Historical visualReview flag is insufficient.'},
 'CP-SMC-ITV1050':{'reason':'Current contact-sheet review: generated product lettering cannot establish SMC ITV1050 identity; exact supplied-model outline comparison is missing.'},
 'CTRL-FSCUT2000E':{'reason':'Current contact-sheet review: pictured red PCIe-style board has no verified BMC228 revision identity; exact manufacturer-board comparison is missing.'},
})
catalog_source=source_link('docs/catalog-completion/catalog-draft.json')
matches=[]; unresolved=[]; inventory=[]; omitted=[]; products=[]
used={}
def add_image(product,src,caption,evidence,scope):
    src=Path(src)
    assert src.is_file(),str(src)
    sha=digest(src)
    target=Path('media')/(sha[:20]+src.suffix.lower())
    (HERE/target).parent.mkdir(exist_ok=True)
    if not (HERE/target).exists(): shutil.copy2(src,HERE/target)
    img={'src':target.as_posix(),'caption':caption,'sha256':sha,'evidence':evidence,'scope':scope,'origin':src.relative_to(ROOT).as_posix() if src.is_relative_to(ROOT) else 'workspace/'+src.relative_to(LOCAL).as_posix()}
    if not any(i['sha256']==sha for i in product['images']): product['images'].append(img)
    used.setdefault(str(src.resolve()),[]).append(product['code'])
    matches.append({'code':product['code'],'name':product['name'],**img})

# Explicit local mapping is established by the earlier sheet register, not by an
# assumption that an S/H or LD suffix means standard/professional.
local_map={
 'CUT-3015-1':('تک میز/دستگاه برش لیزر تک میز استاندارد 3015','دستگاه برش لیزر تک میز استاندارد 3015.jpg'),
 'CUT-3015-2':('تک میز/دستگاه برش لیزر تک میز حرفه ای 3015','دستگاه برش لیزر تک میز حرفه ای 3015.jpg'),
 'CUT-6020-1':('تک میز/دستگاه برش لیزر تک میز استاندارد 6020','دستگاه برش لیزر فایبر تک میز استاندارد 6020.jpg'),
 'CUT-6020-2':('تک میز/دستگاه برش لیزر تک میز حزفه ای 6020','Professional single table laser cutting machine 6020.jpg'),
}
register=read(ROOT/'docs/product-drawings/sheets-2026-10-21.json')['sheets']
register_codes={s.get('code') for s in register}
for original in raw:
    code=original['code']
    p={'code':code,'name':original['name'],'category':original['category'],'images':[],'aliases':[],'sources':original.get('sources',[]),'specs':[]}
    if code in local_map:
        assert code in register_codes
        folder,filename=local_map[code]
        local=LOCAL/folder/filename
        if local.is_file():
            add_image(p,local,'تصویر ارسالیِ نام‌گذاری‌شده؛ تطبیق نام خانواده با فهرست شیت‌های ثبت‌شده',source_link('docs/product-drawings/sheets-2026-10-21.json'),'نام فایل و کد ثبت‌شده در فهرست شیت‌ها؛ اثبات‌کنندهٔ پیکربندی نصب‌شده نیست')
            p['aliases'].append(local.stem)
    d=decisions.get(code,{})
    visual=original.get('visuals',{}).get('studio',{}) or {}
    if code in rejections or d.get('decision')=='hold':
        unresolved.append({'code':code,'image':visual.get('src'),'reason':rejections.get(code,d).get('reason'),'status':'held'})
    elif d.get('decision')=='use':
        add_image(p,ROOT/d['src'],'بازسازی نمای بیرونی؛ تطبیق مستند با مرجع نام‌گذاری‌شده',source_link('docs/catalog-completion/image-decisions.json'),d['reason'])
    elif visual.get('src'):
        scope=visual.get('identityScope','')
        # Recorded family artwork is usable only when it is not explicitly
        # generic, conceptual, another rating or an unverified installed model.
        if scope in ('supplied series photograph or CAD','named product artwork'):
            add_image(p,ROOT/visual['src'],'بازسازی تصویر مرجعِ ثبت‌شده برای این خانواده',catalog_source,scope)
        else:
            unresolved.append({'code':code,'image':visual['src'],'reason':scope or 'No identity scope recorded','status':'not_attached'})
    # Retain original wording and source scopes. Unsupported installation,
    # conflicting dimensions and unsourced performance figures stay out.
    for spec in original.get('specs',[]):
        scope=spec.get('scope','')
        if ('ابعاد' in spec.get('label','') and code.startswith('CUT-')) or not scope:
            omitted.append({'code':code,'spec':spec,'reason':'Conflicting cutting dimensions or no field-level scope; not reasserted'})
            continue
        if scope in ('identity','user_requested_taxonomy'):
            p['specs'].append({**spec,'provenance':catalog_source})
        elif spec.get('source'):
            p['specs'].append({**spec,'provenance':catalog_source})
        else: omitted.append({'code':code,'spec':spec,'reason':'No field-level source; historical draft not independently sufficient'})
    # Explicit current manufacturer facts for CC001 are separated from supplied-unit facts.
    p['research']=[]
    if code=='CC001':
        p['research']=[{'text':'سازنده در صفحهٔ CWFL-1500 دو مدار مستقل برای سورس فایبر و هد معرفی می‌کند. این توضیح مربوط به نسخهٔ صفحهٔ سازنده است؛ به‌تنهایی تجهیزات نصب‌شده روی دستگاه سهند را تعیین نمی‌کند.','source':'https://www.teyuchiller.com/water-chiller-units-cwfl-1500-with-environmental-refrigerant-for-fiber-lasers_p16.html'}]
    products.append(p)

# Inventory every repository image and every original image in the five scoped
# local roots. Existing output contains derived work and is inventoried separately.
root_names=['تک میز','تک میز با روتاری','دو میز','دو میز با روتاری','کابین دار']
repo_images=[p for p in ROOT.rglob('*') if p.is_file() and p.suffix.lower() in EXT and '.git' not in p.parts and not p.is_relative_to(HERE)]
local_images=[p for name in root_names for p in (LOCAL/name).rglob('*') if p.is_file() and p.suffix.lower() in EXT and 'output' not in p.relative_to(LOCAL/name).parts]
# Named Sahand product artwork that has no proven legacy-code equivalence gets
# its own named page. workspace-* is a page identifier, never a product code.
def title_key(value):
    return re.sub(r'\s+',' ',value.replace('+',' ').replace('\u200c',' ')).strip()
named_records={}
for path in local_images:
    if not path.name.startswith('دستگاه') or '+' in path.name: continue
    if 'حرفه ای' in str(path.parent) and 'استاندارد' in path.name: continue
    if '6025' in path.name and '6020' in str(path.parent): continue
    known=next((code for code,(folder,filename) in local_map.items() if path.parent==LOCAL/folder),None)
    if known:
        product=next(p for p in products if p['code']==known)
    else:
        title=path.stem
        if title not in named_records:
            page_id='workspace-'+hashlib.sha256(title.encode()).hexdigest()[:12]
            product={'code':page_id,'displayCode':'کد محصول ثبت نشده؛ شناسهٔ صفحه: '+page_id,'name':title,'category':'cutting','images':[],'aliases':[],'specs':[],'sources':[],'research':[],'identitySource':'نام فایل تصویر ارسالی و نشان سهند روی تصویر؛ برابری با کدهای DZ یا LD تأیید نشده است.'}
            named_records[title]=product
            products.append(product)
        product=named_records[title]
    if not any(i['sha256']==digest(path) for i in product['images']):
        add_image(product,path,'تصویر نام‌گذاری‌شده در مجموعهٔ ارسالی؛ بدون انتساب کد فنی یا مشخصات نصب‌شده','../image-matches.json','نام محصول از نام فایل ارسالی حفظ شده است؛ تصویر تبلیغاتی/رندر است، نه تأیید مشخصات فنی')
# Plus-separated download filenames are additional views only when their full
# normalized title matches an already established named source image.
for path in local_images:
    if not path.name.startswith('دستگاه+'):
        continue
    title=title_key(re.sub(r'_\d+$','',path.stem))
    product=next((p for p in products if title_key(p['name'])==title or any(title_key(a)==title for a in p['aliases'])),None)
    if product and not any(i['sha256']==digest(path) for i in product['images']):
        add_image(product,path,'نسخهٔ نام‌گذاری‌شدهٔ همان محصول در مجموعهٔ ارسالی','../image-matches.json','تطبیق کامل نام فایل پس از تبدیل + به فاصله؛ بدون حدس دربارهٔ کد مدل')
known_hashes={m['sha256']:set() for m in matches}
for m in matches: known_hashes[m['sha256']].add(m['code'])
for path in repo_images+local_images:
    sha=digest(path)
    assigned=sorted(known_hashes.get(sha,set()))
    candidates=sorted({p['code'] for p in raw if path.as_posix().find('/'+p['code']+'/')>=0 or p.get('visuals',{}).get('studio',{}).get('src')==path.relative_to(ROOT).as_posix()}) if path.is_relative_to(ROOT) else []
    origin=path.relative_to(ROOT).as_posix() if path.is_relative_to(ROOT) else 'workspace/'+path.relative_to(LOCAL).as_posix()
    if assigned: status='confirmed_content_hash'
    elif candidates: status='candidate_only'
    else: status='unassigned'
    reason='No exact product identity established from filename/path; derived drawings and promotional graphics are not exact product photographs.'
    if '6025' in path.name and '6020' in str(path.parent): reason='6025 filename conflicts with 6020 folder.'
    if 'حرفه ای' in str(path.parent) and 'استاندارد' in path.name: reason='Professional folder conflicts with standard filename.'
    inventory.append({'path':origin,'sha256':sha,'codes':assigned,'candidateCodes':candidates,'status':status,'reason':None if assigned else reason})

for p in products:
    body='<p class="code">'+e(p.get('displayCode',p['code']))+'</p><p class="scope">'+e(p.get('identitySource','نام و هویت محصول از فهرست ثبت‌شدهٔ سهند لیزر نقل شده است.'))+' اطلاعات سازنده، گزینه‌های خانواده و تصویر مرجع به معنی تأیید موجودی یا پیکربندی نصب‌شده نیست.</p>'
    body+='<div class="gallery">'
    for img in p['images']:
        body+='<figure><a href="../'+e(img['src'],quote=True)+'"><img src="../'+e(img['src'],quote=True)+'" alt="'+e(p['name'],quote=True)+'"></a><figcaption>'+e(img['caption'])+'<br>'+e(img['scope'])+'<br><a href="'+e(img['evidence'],quote=True)+'">سند تطبیق</a></figcaption></figure>'
    if not p['images']: body+='<p>تصویر دقیق و قابل تطبیق برای این رکورد در این بررسی تأیید نشد.</p>'
    body+='</div>'
    if p['specs']:
        body+='<h2>اطلاعات ثبت‌شده و دامنهٔ آن</h2><table><tbody>'
        for s in p['specs']:
            source=s.get('source') or s['provenance']
            if not str(source).startswith(('http://','https://')): source=source_link(str(source).replace('\\','/')) if (ROOT/str(source)).is_file() else s['provenance']
            body+='<tr><th>'+e(str(s['label']))+'</th><td>'+e(str(s['value']))+'<br><small>دامنهٔ ثبت: '+e(s.get('scope',''))+' · <a href="'+e(source,quote=True)+'">منبع</a></small></td></tr>'
        body+='</tbody></table>'
    for r in p['research']: body+='<h2>اطلاعات سازنده؛ مستقل از دستگاه نصب‌شده</h2><p>'+e(r['text'])+' <a href="'+e(r['source'],quote=True)+'">منبع سازنده</a></p>'
    record_source='../image-matches.json' if p.get('identitySource') else catalog_source
    body+='<h2>منابع رکورد</h2><ul class="source-list"><li><a href="'+record_source+'">سند هویت و تطبیق رکورد</a></li>'
    for s in p['sources']:
        if s.get('url','').startswith(('http://','https://')): body+='<li><a href="'+e(s['url'],quote=True)+'">'+e(s.get('title') or s['url'])+'</a> — '+e(s.get('scope',''))+'</li>'
    body+='</ul><p><a href="../education.html">راهنمای عمومی انتخاب و بررسی منابع</a></p>'
    output(Path('products')/(p['code']+'.html'),shell(p['name'],body))

output(Path('products/index.html'),shell('فهرست صفحات محصولات','<ul>'+''.join('<li><a href="'+e(p['code'],quote=True)+'.html">'+e(p['name'])+'</a></li>' for p in products)+'</ul>'))
dump('products.json',{'base':BASE,'products':products})
dump('image-matches.json',matches)
dump('image-inventory.json',inventory)
dump('unresolved.json',{'images':unresolved,'omittedSpecifications':omitted,'localUnassigned':[i for i in inventory if i['path'].startswith('workspace/') and not i['codes']]})
dump('build-summary.json',{'base':BASE,'products':len(products),'pages':len(products),'imageAssignments':len(matches),'uniqueAttachedImages':len(known_hashes),'repositoryImages':len(repo_images),'localOriginalImages':len(local_images),'unresolvedRecordImages':len(unresolved),'omittedSpecs':len(omitted)})
print(json.dumps(read(HERE/'build-summary.json'),ensure_ascii=False))
