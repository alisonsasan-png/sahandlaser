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
staging=json.loads((ROOT/'data/Sahand_Site_Import_Staging_2026-10-04.json').read_text(encoding='utf-8'))
review=(ROOT/'assets/update/site-review-v16.js').read_text(encoding='utf-8')
stable=(ROOT/'assets/update/site-stabilization.js').read_text(encoding='utf-8')
errors=[];passed=[]
def ck(c,m):(passed if c else errors).append(m)
# Preserve original site structure and protected sections.
for v in ['home','about','products','services','applications','projects','training','downloads','contact','product']:
    ck(f'id="view-{v}"' in html or f"id='view-{v}'" in html,f'protected view: {v}')
ck("g.innerHTML = cats.map" in html or "g.innerHTML=cats.map" in html,'home remains category-led, not all-products dump')
ck("navigateTo('training')" in html,'Training remains linked')
ck("navigateTo('downloads')" in html,'Downloads remains linked')
# v1.6 truth contract.
ck(db.get('source_master')=='Sahand_Laser_Master_Knowledge_Base_v1_6.json','site layer follows master v1.6')
ck(db.get('review_tag')=='REV-2026-10-04-V16','review return marker retained')
ck(db.get('policy',{}).get('no_guessing') is True,'site no-guessing rule active')
ck(db.get('policy',{}).get('verified_assets_only') is True,'verified-assets-only rule active')
ck(staging.get('rules',{}).get('no_guessing') is True,'staging no-guessing rule active')
ck(staging.get('rules',{}).get('family_shared_specs_not_exact_BOM') is True,'family component options are not promoted to exact BOM')
ck(staging.get('rules',{}).get('3d_models_visual_not_manufacturing_certified') is True,'3D reconstruction safety rule active')
# Only explicitly verified media may be promoted as verified.
for code,r in db.get('products',{}).items():
    a=r.get('assets',{})
    v=a.get('view_360') if isinstance(a.get('view_360'),dict) else {}
    if v.get('status')=='verified': ck(len(v.get('frames') or [])>1,f'{code}: real verified 360 sequence')
    for key in ['technical_drawing','exploded_view']:
        q=a.get(key) if isinstance(a.get(key),dict) else {}
        if q.get('status')=='verified': ck(bool(q.get('url')),f'{code}: {key} verified asset URL')
# CT001–009 may be visual website reconstructions only, never manufacturing CAD.
for code in [f'CT-{i:03d}' for i in range(1,10)]:
    r=db.get('products',{}).get(code,{})
    t3=r.get('assets',{}).get('three_d',{})
    ck(t3.get('status')=='visual_reconstruction',f'{code}: 3D truth label is visual reconstruction')
    ck(t3.get('manufacturing_certified') is False,f'{code}: 3D not falsely manufacturing-certified')
    ck(bool(t3.get('reference')),f'{code}: 3D has a source reference')
# CT010 remains intentionally held until commercial identity/reference is confirmed.
ct10=db.get('products',{}).get('CT-010',{});t10=ct10.get('assets',{}).get('three_d',{})
ck(ct10.get('identity_status')=='separate_record_model_pending','CT-010 identity remains pending')
ck(t10.get('status')=='hold','CT-010 3D remains on hold')
ck(t10.get('manufacturing_certified') is False,'CT-010 not falsely manufacturing-certified')
ck(not t10.get('runtime'),'CT-010 does not activate legacy 3D runtime')
ck(ct10.get('media',{}).get('gallery_status')!='verified','CT-010 unverified gallery not promoted')
# Review mode and runtime layer must be present without changing protected HTML structure.
ck("q.get('review')==='1'" in review,'review=1 marker mode exists')
ck('REV-2026-10-04-V16' in review,'visible review marker tag exists')
ck('site-review-v16.js' in stable,'v1.6 review/runtime layer is loaded by stabilization layer')
ck('manufacturing-certified' in review or 'manufacturing_certified' in review or 'CAD تأییدشده' in review,'3D visual-only disclosure is rendered')
# Freeze risky migrations.
ck(db.get('policy',{}).get('heavy_seo_frozen') is True,'heavy SEO frozen')
ck(db.get('policy',{}).get('real_product_paths_frozen') is True,'product path migration frozen')
# Ordinary Drive share URLs must not be used as image CDN sources.
drive_image_refs=re.findall(r'<img[^>]+src=["\']([^"\']*drive\.google\.com/file/d/[^"\']*)["\']',html,re.I)
ck(not drive_image_refs,'no ordinary Google Drive share URL is used as an <img> source')
print('# Sahand Laser Reality Check')
print(f'Passed: {len(passed)}  Errors: {len(errors)}')
for x in errors: print('ERROR:',x)
for x in passed: print('OK:',x)
sys.exit(1 if errors else 0)
