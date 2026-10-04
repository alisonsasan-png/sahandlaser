#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sahand Laser release reality checker.
Fails only on violations of explicit project truth/preservation rules.
"""
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text(encoding='utf-8')
db=json.loads((ROOT/'data/product-site-master-v1.json').read_text(encoding='utf-8'))
master=json.loads((ROOT/'data/Sahand_Laser_Master_Knowledge_Base_v1_5.json').read_text(encoding='utf-8'))
errors=[];passed=[]
def ck(c,m):(passed if c else errors).append(m)
# Preserve structure
for v in ['home','about','products','services','applications','projects','training','downloads','contact','product']:
    ck(f'id="view-{v}"' in html or f"id='view-{v}'" in html,f'protected view: {v}')
ck("g.innerHTML = cats.map" in html or "g.innerHTML=cats.map" in html,'home remains category-led, not all-products dump')
ck("navigateTo('training')" in html,'Training remains linked')
ck("navigateTo('downloads')" in html,'Downloads remains linked')
# DB truth
ck(db.get('source_master')=='Sahand_Laser_Master_Knowledge_Base_v1_5.json','site layer follows master v1.5')
ck(master.get('policy',{}).get('no_guessing') is True,'master no-guessing rule active')
ck(db.get('policy',{}).get('verified_assets_only') is True,'verified-assets-only rule active')
for code,r in db.get('products',{}).items():
    a=r.get('assets',{})
    v=a.get('view_360') if isinstance(a.get('view_360'),dict) else {}
    if v.get('status')=='verified': ck(len(v.get('frames') or [])>1,f'{code}: real verified 360 sequence')
    for key in ['technical_drawing','exploded_view']:
        q=a.get(key) if isinstance(a.get(key),dict) else {}
        if q.get('status')=='verified': ck(bool(q.get('url')),f'{code}: {key} verified asset URL')
# CT010 truth
ct=db['products']['CT-010'];t3=ct['assets']['three_d']
ck(t3.get('status')=='visual_reconstruction','CT-010 3D truth label retained')
ck(t3.get('manufacturing_certified') is False,'CT-010 not falsely manufacturing-certified')
ck(ct.get('media',{}).get('gallery_status')!='verified','CT-010 fake/static gallery not promoted to verified')
# freeze risky migrations
ck(db['policy'].get('heavy_seo_frozen') is True,'heavy SEO frozen')
ck(db['policy'].get('real_product_paths_frozen') is True,'product path migration frozen')
# Google Drive may legitimately be used for downloadable documents. It must not be used as an ordinary image CDN.
drive_image_refs=re.findall(r'<img[^>]+src=["\']([^"\']*drive\.google\.com/file/d/[^"\']*)["\']',html,re.I)
ck(not drive_image_refs,'no ordinary Google Drive share URL is used as an <img> source')
print('# Sahand Laser Reality Check')
print(f'Passed: {len(passed)}  Errors: {len(errors)}')
for x in errors: print('ERROR:',x)
for x in passed: print('OK:',x)
sys.exit(1 if errors else 0)
