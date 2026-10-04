#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv,json,re,time
from collections import defaultdict,deque
from datetime import datetime,timezone
from pathlib import Path
from urllib.parse import urljoin,urlparse,urlunparse
import requests
from bs4 import BeautifulSoup
BASE='https://sahandlaser.com/'; HOST=urlparse(BASE).netloc; OUT=Path('data'); OUT.mkdir(exist_ok=True)
S=requests.Session(); S.headers.update({'User-Agent':'SahandLaser-MediaInventory/2.0'})
IMG=re.compile(r'\.(?:jpe?g|png|webp|gif|svg|avif|bmp|tiff?)$',re.I); RESIZE=re.compile(r'-\d{2,5}x\d{2,5}(?=\.[A-Za-z0-9]+$)')

def req(u,t=10):
    try:
        r=S.get(u,timeout=t,allow_redirects=True)
        return r if r.ok else None
    except Exception:return None

def clean(u,base=BASE):
    if not u:return None
    u=urljoin(base,str(u).strip()); p=urlparse(u)
    if p.scheme not in ('http','https'):return None
    return urlunparse((p.scheme,p.netloc.lower(),p.path,'','',''))

def classify(u):
    n=urlparse(u).path.rsplit('/',1)[-1]; e=n.rsplit('.',1)[-1].lower() if '.' in n else ''
    if '/elementor/thumbs/' in u:return n,e,True,'elementor_thumbnail'
    if RESIZE.search(n):return n,e,True,'wordpress_resized'
    return n,e,False,''

def add(rec,u,source='',alt='',via=''):
    u=clean(u)
    if not u or not IMG.search(urlparse(u).path):return
    if u not in rec:
        n,e,d,reason=classify(u); rec[u]={'url':u,'filename':n,'extension':e,'is_derivative':d,'derivative_reason':reason,'alt_texts':set(),'source_pages':set(),'discovered_via':set()}
    if source:rec[u]['source_pages'].add(source)
    if alt:rec[u]['alt_texts'].add(alt.strip())
    if via:rec[u]['discovered_via'].add(via)

def media_api(rec):
    page=1; total_pages=None; attachments=0
    while total_pages is None or page<=total_pages:
        u=f'{BASE}wp-json/wp/v2/media?media_type=image&per_page=100&page={page}'
        r=req(u,12)
        if not r:break
        if total_pages is None: total_pages=int(r.headers.get('X-WP-TotalPages','1') or 1)
        try:items=r.json()
        except Exception:break
        if not isinstance(items,list):break
        for m in items:
            attachments+=1; alt=m.get('alt_text') or ''; link=m.get('link') or ''
            add(rec,m.get('source_url'),link,alt,'wp-rest:source_url')
            sizes=((m.get('media_details') or {}).get('sizes') or {})
            for name,s in sizes.items(): add(rec,s.get('source_url'),link,alt,'wp-rest:size:'+name)
        page+=1
    return attachments,total_pages or 0

def sitemap_pages():
    pages=[]; todo=deque([urljoin(BASE,'wp-sitemap.xml'),urljoin(BASE,'sitemap_index.xml'),urljoin(BASE,'sitemap.xml')]);seen=set()
    while todo and len(seen)<80:
        u=todo.popleft()
        if u in seen:continue
        seen.add(u);r=req(u,8)
        if not r:continue
        locs=re.findall(r'<loc>\s*(.*?)\s*</loc>',r.text,re.I)
        if '<sitemapindex' in r.text.lower():todo.extend(locs)
        else:
            for x in locs:
                c=clean(x)
                if c and urlparse(c).netloc==HOST and not IMG.search(urlparse(c).path):pages.append(c)
    return list(dict.fromkeys(pages))

def map_pages(rec,pages):
    scanned=0;failed=0
    attrs=('src','data-src','data-lazy-src','data-original','data-bg')
    srcsets=('srcset','data-srcset','data-lazy-srcset')
    for page in pages[:500]:
        r=req(page,8)
        if not r or 'html' not in r.headers.get('content-type','').lower():failed+=1;continue
        scanned+=1;soup=BeautifulSoup(r.text,'html.parser')
        for tag in soup.find_all(['img','source']):
            alt=tag.get('alt') or ''
            for a in attrs:
                if tag.get(a):add(rec,tag.get(a),r.url,alt,'page:'+a)
            for a in srcsets:
                if tag.get(a):
                    for part in tag.get(a).split(','):add(rec,part.strip().split(' ')[0],r.url,alt,'page:'+a)
        for meta in soup.find_all('meta'):
            k=(meta.get('property') or meta.get('name') or '').lower()
            if 'image' in k and meta.get('content'):add(rec,meta.get('content'),r.url,'','page-meta:'+k)
        for raw in re.findall(r'https?://[^\s\"\'<>]+/wp-content/uploads/[^\s\"\'<>]+',r.text.replace('\\/','/'),re.I):add(rec,raw.replace('&amp;','&'),r.url,'','page-regex')
        time.sleep(.02)
    return scanned,failed

def main():
    rec={};attachments,api_pages=media_api(rec); pages=sitemap_pages()
    if not pages:pages=[BASE,urljoin(BASE,'laser-cutting-machine/'),urljoin(BASE,'laser-welding-services/'),urljoin(BASE,'fiber-laser-marking-machine-services/'),urljoin(BASE,'about-us/'),urljoin(BASE,'services-2/'),urljoin(BASE,'designing/')]
    scanned,failed=map_pages(rec,pages)
    rows=[]
    for u in sorted(rec):
        x=rec[u];rows.append({'url':x['url'],'filename':x['filename'],'extension':x['extension'],'is_derivative':x['is_derivative'],'derivative_reason':x['derivative_reason'],'alt_texts':sorted(x['alt_texts']),'source_pages':sorted(x['source_pages']),'discovered_via':sorted(x['discovered_via'])})
    originals=sum(not x['is_derivative'] for x in rows);deriv=len(rows)-originals;exts=defaultdict(int);years=defaultdict(int)
    for x in rows:
        exts[x['extension'] or 'unknown']+=1;m=re.search(r'/uploads/(20\d{2})/',x['url']);
        if m:years[m.group(1)]+=1
    data={'generated_at_utc':datetime.now(timezone.utc).isoformat(),'source_site':BASE,'wordpress_media_attachments':attachments,'wp_rest_pages':api_pages,'pages_from_sitemap':len(pages),'pages_scanned_for_mapping':scanned,'pages_failed':failed,'unique_image_urls':len(rows),'likely_originals':originals,'generated_or_resized_derivatives':deriv,'by_extension':dict(sorted(exts.items())),'by_upload_year':dict(sorted(years.items())),'images':rows}
    (OUT/'sahandlaser-media-full.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    with (OUT/'sahandlaser-media-full.csv').open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.writer(f);w.writerow(['url','filename','extension','is_derivative','derivative_reason','alt_texts','source_pages','discovered_via'])
        for x in rows:w.writerow([x['url'],x['filename'],x['extension'],x['is_derivative'],x['derivative_reason'],' | '.join(x['alt_texts']),' | '.join(x['source_pages']),' | '.join(x['discovered_via'])])
    report=['# SahandLaser current-site media inventory','',f'- WordPress image attachments: **{attachments}**',f'- Sitemap pages found: **{len(pages)}**',f'- Pages scanned for mapping: **{scanned}**',f'- Unique image URLs (original + generated sizes): **{len(rows)}**',f'- Likely originals: **{originals}**',f'- Generated/resized derivatives: **{deriv}**','','## By extension','']+[f'- {k}: {v}' for k,v in sorted(exts.items(),key=lambda z:-z[1])]+['','## By upload year','']+[f'- {k}: {v}' for k,v in sorted(years.items())]
    (OUT/'sahandlaser-media-report.md').write_text('\n'.join(report)+'\n',encoding='utf-8')
    print(json.dumps({'attachments':attachments,'sitemap_pages':len(pages),'scanned':scanned,'unique_images':len(rows),'originals':originals,'derivatives':deriv},ensure_ascii=False))
if __name__=='__main__':main()
