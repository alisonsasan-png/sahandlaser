#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
INDEX=ROOT/'index.html'
DB=ROOT/'data/product-site-master-v1.json'
MASTER=ROOT/'data/Sahand_Laser_Master_Knowledge_Base_v1_5.json'
ORG=ROOT/'assets/update/cutting-product-organizer.js'
ASSETS=ROOT/'assets/update/product-asset-viewers.js'
STABLE=ROOT/'assets/update/site-stabilization.js'
I18N=ROOT/'assets/update/i18n-completion.js'
THREED=ROOT/'assets/update/ct010-3d.js'
MEMORY=ROOT/'PROJECT-MEMORY.md'
POLICY=ROOT/'CHANGE-POLICY.md'
errors=[];warnings=[];passed=[]
def check(cond,msg,warn=False):
    (passed if cond else warnings if warn else errors).append(msg)
def balanced(text,start):
    i=text.find('{',start)
    if i<0:return''
    d=0;q=None;esc=False
    for j in range(i,len(text)):
        c=text[j]
        if q:
            if esc:esc=False
            elif c=='\\':esc=True
            elif c==q:q=None
            continue
        if c in "'\"`":q=c;continue
        if c=='{':d+=1
        elif c=='}':
            d-=1
            if d==0:return text[i:j+1]
    return''
def lang_keys(text,marker,lang):
    p=text.find(marker)
    if p<0:return set()
    root=balanced(text,p);m=re.search(r'\b'+re.escape(lang)+r'\s*:\s*\{',root)
    if not m:return set()
    block=balanced(root,m.start())
    return set(re.findall(r'(?:^|[{,\n]\s*)["\']?([A-Za-z0-9_]+)["\']?\s*:',block,re.M))
files=[INDEX,DB,MASTER,ORG,ASSETS,STABLE,I18N,THREED,MEMORY,POLICY]
for f in files:check(f.exists(),f'file exists: {f.relative_to(ROOT)}')
if errors:print('\n'.join(errors));sys.exit(1)
html=INDEX.read_text(encoding='utf-8');org=ORG.read_text(encoding='utf-8');assets=ASSETS.read_text(encoding='utf-8');stable=STABLE.read_text(encoding='utf-8');i18n=I18N.read_text(encoding='utf-8');threed=THREED.read_text(encoding='utf-8');memory=MEMORY.read_text(encoding='utf-8');db=json.loads(DB.read_text(encoding='utf-8'));master=json.loads(MASTER.read_text(encoding='utf-8'))
# Database gates
check(db.get('source_master')=='Sahand_Laser_Master_Knowledge_Base_v1_5.json','site DB points to master v1.5')
check(db.get('policy',{}).get('database_first') is True,'database-first policy is enabled')
check(db.get('policy',{}).get('no_guessing') is True,'no-guessing policy is enabled')
check(db.get('policy',{}).get('verified_assets_only') is True,'verified-assets-only policy is enabled')
check(master.get('schema_version')=='1.5','master knowledge base schema is v1.5')
check('v1_5' in memory or 'v1.5' in memory,'PROJECT-MEMORY references v1.5')
for code in [f'CT-{i:03d}' for i in range(1,11)]:
    r=db.get('products',{}).get(code);check(isinstance(r,dict),f'{code} exists in site database')
    if not isinstance(r,dict):continue
    for l in ['fa','en','ar','tr']:check(bool(str(r.get('title',{}).get(l,'')).strip()),f'{code} has {l} title')
    m=r.get('media',{})
    if m.get('main_image_status')=='verified':check(bool(m.get('main_image')),f'{code} verified main image has URL')
    a=r.get('assets',{})
    v360=a.get('view_360',{}) if isinstance(a.get('view_360'),dict) else {'status':a.get('view_360')}
    if v360.get('status')=='verified':check(len(v360.get('frames') or [])>1,f'{code} verified 360 has multiple frames')
    for k in ['technical_drawing','exploded_view']:
        q=a.get(k,{}) if isinstance(a.get(k),dict) else {'status':a.get(k)}
        if q.get('status')=='verified':check(bool(q.get('url')),f'{code} verified {k} has URL')
# CT010 3D safety
ct10=db['products']['CT-010'];a10=ct10.get('assets',{});t3=a10.get('three_d',{})
check(isinstance(t3,dict) and t3.get('status')=='visual_reconstruction','CT-010 3D is explicitly visual reconstruction')
check(t3.get('manufacturing_certified') is False,'CT-010 3D is not marked manufacturing-certified')
check(t3.get('runtime')=='assets/update/ct010-3d.js','CT-010 3D runtime is registered')
check("querySelector('#sahand-3d-section')?.remove" not in org,'organizer no longer removes CT-010 3D')
check('visual_reconstruction' in assets,'asset viewer supports visual reconstruction labeling')
check('pointerdown' in threed and 'pdist' in threed,'CT-010 3D supports pointer drag and pinch zoom')
check('IntersectionObserver' in threed,'CT-010 3D pauses rendering when offscreen')
# Routing/structure preservation
views=set(re.findall(r'id=["\']view-([A-Za-z0-9_-]+)["\']',html))
required_views={'home','about','products','services','applications','projects','training','downloads','contact','product'}
for v in sorted(required_views):check(v in views,f'protected view exists: {v}')
check("const ROUTES = ['home','about','products','services','applications','projects','training','downloads','contact','product']" in html,'protected route list retained')
check("g.innerHTML = cats.map" in html or "g.innerHTML=cats.map" in html,'homepage renders product categories rather than all products')
check("renderDownloads()" in html,'downloads renderer retained')
check("navigateTo('training')" in html,'training navigation retained')
check("navigateTo('downloads')" in html,'downloads navigation retained')
# Local references
refs=re.findall(r'<script[^>]+src=["\']([^"\']+)["\']',html,re.I)+re.findall(r'<link[^>]+href=["\']([^"\']+)["\']',html,re.I)
for ref in refs:
    if ref.startswith(('http://','https://','data:','#','//')):continue
    p=ROOT/ref.split('?',1)[0].split('#',1)[0];check(p.exists(),f'local asset exists: {ref}')
check('cutting-product-organizer.js' in html,'database organizer is wired into index')
check('product-asset-viewers.js' in html,'verified asset viewer is wired into index')
check('site-stabilization.js' in html,'responsive/performance stabilization is wired into index')
# Handlers and navigation targets
targets=set(re.findall(r'navigateTo\(["\']([^"\']+)["\']\)',html))
for t in sorted(targets):check(t in views,f'navigateTo({t}) has matching view')
for fn in ['navigateTo','openInquiry','closeInquiry','sendInquiry','sendInquiryVia','openOfficeMap','closeChatWidget']:
    if re.search(r'\b'+fn+r'\s*\(',html):check(bool(re.search(r'(?:function\s+'+fn+r'\s*\(|(?:const|let|var)\s+'+fn+r'\s*=)',html)),f'handler {fn} is defined')
# Translations
used=set(re.findall(r'data-i18n=["\']([^"\']+)["\']',html))
for l in ['fa','en','ar','tr']:
    base=lang_keys(html,'const T =',l);missing=sorted(used-base)
    check(not missing,f'data-i18n coverage {l}; missing: {", ".join(missing[:20])}',warn=True)
# Performance/responsive safety
check('loading' in stable and 'decoding' in stable,'image lazy-loading/decoding stabilization present')
check('prefers-reduced-motion' in stable,'reduced-motion accessibility rule present')
check('max-width:640px' in stable,'mobile stabilization rules present')
# Freeze gates
check(db.get('policy',{}).get('heavy_seo_frozen') is True,'heavy SEO remains frozen')
check(db.get('policy',{}).get('real_product_paths_frozen') is True,'real product route migration remains frozen')
# Known non-blocking limitations
if 'comments_' in html and 'localStorage' in html: warnings.append('Product comments are browser-local on the static site; they are not centrally persisted.')
if 'https://cdn.tailwindcss.com' in html: warnings.append('Tailwind runtime CDN remains a production performance dependency; defer self-host/build migration until architecture freeze is lifted.')
report=['# Sahand Laser Site QA','',f'- Passed: **{len(passed)}**',f'- Warnings: **{len(warnings)}**',f'- Errors: **{len(errors)}**','']
if warnings:report+=['## Warnings']+[f'- {x}' for x in warnings]+['']
if errors:report+=['## Errors']+[f'- {x}' for x in errors]+['']
report+=['## Passed']+[f'- {x}' for x in passed]
out='\n'.join(report)+'\n';Path('/tmp/sahand-site-qa-report.md').write_text(out,encoding='utf-8');print(out);sys.exit(1 if errors else 0)
