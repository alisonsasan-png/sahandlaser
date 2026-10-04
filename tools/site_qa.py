#!/usr/bin/env python3
# -*- coding: utf-8 -*-
from __future__ import annotations
import json,re,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
INDEX=ROOT/'index.html';DB=ROOT/'data/product-site-master-v1.json';ORG=ROOT/'assets/update/cutting-product-organizer.js';I18N=ROOT/'assets/update/i18n-completion.js'
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
for f in [INDEX,DB,ORG,I18N]:check(f.exists(),f'file exists: {f.relative_to(ROOT)}')
if errors:print('\n'.join(errors));sys.exit(1)
html=INDEX.read_text(encoding='utf-8');org=ORG.read_text(encoding='utf-8');i18n=I18N.read_text(encoding='utf-8');db=json.loads(DB.read_text(encoding='utf-8'))
check(db.get('policy',{}).get('database_first') is True,'database-first policy is enabled')
check(db.get('policy',{}).get('no_guessing') is True,'no-guessing policy is enabled')
for code in [f'CT-{i:03d}' for i in range(1,11)]:
    r=db.get('products',{}).get(code);check(isinstance(r,dict),f'{code} exists in database')
    if not isinstance(r,dict):continue
    for l in ['fa','en','ar','tr']:check(bool(str(r.get('title',{}).get(l,'')).strip()),f'{code} has {l} title')
    m=r.get('media',{})
    if m.get('main_image_status')=='verified':check(bool(m.get('main_image')),f'{code} verified image has URL')
check('data/product-site-master-v1.json' in org,'organizer reads synchronized database')
check('i18n-completion.js' in org,'organizer loads translation completion patch')
check('cutting-product-organizer.js' in html,'organizer is wired into index')
for ref in re.findall(r'<script[^>]+src=["\']([^"\']+)["\']',html,re.I)+re.findall(r'<link[^>]+href=["\']([^"\']+)["\']',html,re.I):
    if ref.startswith(('http://','https://','data:','#','//')):continue
    p=ROOT/ref.split('?',1)[0].split('#',1)[0];check(p.exists(),f'local asset exists: {ref}')
views=set(re.findall(r'id=["\']view-([A-Za-z0-9_-]+)["\']',html));targets=set(re.findall(r'navigateTo\(["\']([^"\']+)["\']\)',html))
for t in sorted(targets):check(t in views,f'navigateTo({t}) has matching view')
for fn in ['navigateTo','openInquiry','closeInquiry','sendInquiry','sendInquiryVia','openOfficeMap','closeChatWidget']:
    if re.search(r'\b'+fn+r'\s*\(',html):check(bool(re.search(r'(?:function\s+'+fn+r'\s*\(|(?:const|let|var)\s+'+fn+r'\s*=)',html)),f'handler {fn} is defined')
used=set(re.findall(r'data-i18n=["\']([^"\']+)["\']',html))
for l in ['fa','en','ar','tr']:
    base=lang_keys(html,'const T =',l);missing=sorted(used-base)
    check(not missing,f'data-i18n coverage {l}; missing: {", ".join(missing[:20])}',warn=True)
check(db.get('policy',{}).get('heavy_seo_frozen') is True,'heavy SEO remains frozen')
check(db.get('policy',{}).get('real_product_paths_frozen') is True,'real product route migration remains frozen')
report=['# Sahand Laser Site QA','',f'- Passed: **{len(passed)}**',f'- Warnings: **{len(warnings)}**',f'- Errors: **{len(errors)}**','']
if warnings:report+=['## Warnings']+[f'- {x}' for x in warnings]+['']
if errors:report+=['## Errors']+[f'- {x}' for x in errors]+['']
report+=['## Passed']+[f'- {x}' for x in passed]
out='\n'.join(report)+'\n';Path('/tmp/sahand-site-qa-report.md').write_text(out,encoding='utf-8');print(out);sys.exit(1 if errors else 0)
