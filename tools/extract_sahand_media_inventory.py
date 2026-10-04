#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv,json,re
from collections import defaultdict
from datetime import datetime,timezone
from pathlib import Path
from urllib.parse import urlparse,urlunparse
import requests
BASE='https://sahandlaser.com/'
OUT=Path('data');OUT.mkdir(exist_ok=True)
S=requests.Session();S.headers.update({'User-Agent':'SahandLaser-MediaInventory/3.0'})
RESIZE=re.compile(r'-\d{2,5}x\d{2,5}(?=\.[A-Za-z0-9]+$)')

def clean(u):
    if not u:return None
    p=urlparse(u)
    return urlunparse((p.scheme,p.netloc.lower(),p.path,'','',''))

def classify(u):
    n=urlparse(u).path.rsplit('/',1)[-1];ext=n.rsplit('.',1)[-1].lower() if '.' in n else ''
    if '/elementor/thumbs/' in u:return n,ext,True,'elementor_thumbnail'
    if RESIZE.search(n):return n,ext,True,'wordpress_resized'
    return n,ext,False,''

def main():
    rows={};page=1;total_pages=1;attachments=0
    while page<=total_pages:
        r=S.get(f'{BASE}wp-json/wp/v2/media',params={'media_type':'image','per_page':100,'page':page},timeout=20)
        r.raise_for_status()
        if page==1: total_pages=int(r.headers.get('X-WP-TotalPages','1') or 1)
        items=r.json()
        for m in items:
            attachments+=1
            source=clean(m.get('source_url'))
            alt=(m.get('alt_text') or '').strip();title=((m.get('title') or {}).get('rendered') or '').strip();link=m.get('link') or ''
            candidates=[('original',source)]
            for size_name,size in (((m.get('media_details') or {}).get('sizes') or {}).items()):candidates.append((size_name,clean(size.get('source_url'))))
            for size_name,u in candidates:
                if not u:continue
                n,e,d,reason=classify(u)
                x=rows.setdefault(u,{'url':u,'filename':n,'extension':e,'is_derivative':d,'derivative_reason':reason,'wp_attachment_ids':set(),'sizes':set(),'alt_texts':set(),'titles':set(),'attachment_pages':set()})
                x['wp_attachment_ids'].add(m.get('id'));x['sizes'].add(size_name)
                if alt:x['alt_texts'].add(alt)
                if title:x['titles'].add(title)
                if link:x['attachment_pages'].add(link)
        print(f'page {page}/{total_pages} attachments={attachments} urls={len(rows)}',flush=True)
        page+=1
    out=[]
    for u in sorted(rows):
        x=rows[u];out.append({**{k:x[k] for k in ('url','filename','extension','is_derivative','derivative_reason')},'wp_attachment_ids':sorted(i for i in x['wp_attachment_ids'] if i is not None),'sizes':sorted(x['sizes']),'alt_texts':sorted(x['alt_texts']),'titles':sorted(x['titles']),'attachment_pages':sorted(x['attachment_pages'])})
    originals=sum(not x['is_derivative'] for x in out);derivatives=len(out)-originals;exts=defaultdict(int);years=defaultdict(int)
    for x in out:
        exts[x['extension'] or 'unknown']+=1
        m=re.search(r'/uploads/(20\d{2})/',x['url'])
        if m:years[m.group(1)]+=1
    data={'generated_at_utc':datetime.now(timezone.utc).isoformat(),'source_site':BASE,'method':'WordPress REST Media API — read only','wordpress_image_attachments':attachments,'api_pages':total_pages,'unique_image_urls_including_generated_sizes':len(out),'likely_original_image_urls':originals,'generated_resized_image_urls':derivatives,'by_extension':dict(sorted(exts.items())),'by_upload_year':dict(sorted(years.items())),'images':out}
    (OUT/'sahandlaser-media-full.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    with (OUT/'sahandlaser-media-full.csv').open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.writer(f);w.writerow(['url','filename','extension','is_derivative','derivative_reason','wp_attachment_ids','sizes','alt_texts','titles','attachment_pages'])
        for x in out:w.writerow([x['url'],x['filename'],x['extension'],x['is_derivative'],x['derivative_reason'],','.join(map(str,x['wp_attachment_ids'])),' | '.join(x['sizes']),' | '.join(x['alt_texts']),' | '.join(x['titles']),' | '.join(x['attachment_pages'])])
    rep=['# SahandLaser complete WordPress image inventory','',f'- WordPress image attachments: **{attachments}**',f'- REST API pages: **{total_pages}**',f'- Unique image URLs including generated sizes: **{len(out)}**',f'- Likely original image URLs: **{originals}**',f'- Generated/resized URLs: **{derivatives}**','','## By extension','']+[f'- {k}: {v}' for k,v in sorted(exts.items(),key=lambda z:-z[1])]+['','## By upload year','']+[f'- {k}: {v}' for k,v in sorted(years.items())]
    (OUT/'sahandlaser-media-report.md').write_text('\n'.join(rep)+'\n',encoding='utf-8')
    print(json.dumps({'attachments':attachments,'api_pages':total_pages,'unique_urls':len(out),'originals':originals,'derivatives':derivatives},ensure_ascii=False),flush=True)
if __name__=='__main__':main()
