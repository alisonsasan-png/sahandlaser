#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import csv, json, re, time
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
import requests
from bs4 import BeautifulSoup

BASE='https://sahandlaser.com/'
HOST=urlparse(BASE).netloc
OUT=Path('data'); OUT.mkdir(exist_ok=True)
UA={'User-Agent':'SahandLaser-MediaInventory/1.0'}
IMG_EXT=re.compile(r'\.(?:jpe?g|png|webp|gif|svg|avif|bmp|tiff?)(?:$|\?)',re.I)
UPLOAD_RE=re.compile(r'https?://[^\s\"\'<>]+/wp-content/uploads/[^\s\"\'<>]+',re.I)
RESIZE_RE=re.compile(r'-\d{2,5}x\d{2,5}(?=\.[A-Za-z0-9]+$)')
MAX_PAGES=1800


def get(url):
    try:
        r=requests.get(url,headers=UA,timeout=18,allow_redirects=True)
        if r.ok:return r
    except Exception:pass
    return None


def page_url(u,base):
    if not u or u.startswith(('data:','blob:','javascript:','#','mailto:','tel:')):return None
    u=urljoin(base,u.strip())
    p=urlparse(u)
    if p.scheme not in ('http','https') or p.netloc.lower()!=HOST:return None
    return urlunparse((p.scheme,p.netloc.lower(),p.path,'','',''))


def media_url(u,base):
    if not u or u.startswith(('data:','blob:','javascript:')):return None
    u=urljoin(base,u.strip().strip('\"\''))
    p=urlparse(u)
    if p.scheme not in ('http','https'):return None
    clean=urlunparse((p.scheme,p.netloc.lower(),p.path,'','',''))
    return clean if IMG_EXT.search(p.path) else None


def is_page(u):
    p=urlparse(u); low=p.path.lower()
    return p.netloc==HOST and not any(low.endswith(x) for x in ('.jpg','.jpeg','.png','.webp','.gif','.svg','.avif','.pdf','.zip','.rar','.mp4','.webm','.mp3','.doc','.docx','.xls','.xlsx')) and '/wp-admin' not in low and '/wp-login' not in low and '/feed' not in low


def sitemap_seeds():
    urls=[]; todo=deque([urljoin(BASE,'wp-sitemap.xml'),urljoin(BASE,'sitemap_index.xml'),urljoin(BASE,'sitemap.xml')]); seen=set()
    while todo and len(seen)<100:
        u=todo.popleft()
        if u in seen:continue
        seen.add(u); r=get(u)
        if not r:continue
        locs=re.findall(r'<loc>\s*(.*?)\s*</loc>',r.text,re.I)
        if '<sitemapindex' in r.text.lower(): todo.extend(locs)
        else: urls.extend(x for x in locs if page_url(x,BASE) and is_page(page_url(x,BASE)))
    return list(dict.fromkeys(urls))


def classify(url):
    name=urlparse(url).path.rsplit('/',1)[-1]
    if '/elementor/thumbs/' in url:return name,name.rsplit('.',1)[-1].lower() if '.' in name else '',True,'elementor_thumbnail'
    if RESIZE_RE.search(name):return name,name.rsplit('.',1)[-1].lower() if '.' in name else '',True,'wordpress_resized'
    return name,name.rsplit('.',1)[-1].lower() if '.' in name else '',False,''


def main():
    records={}; scanned=set(); failed=[]
    seeds=sitemap_seeds()+[BASE,urljoin(BASE,'laser-cutting-machine/'),urljoin(BASE,'laser-welding-services/'),urljoin(BASE,'fiber-laser-marking-machine-services/'),urljoin(BASE,'services/'),urljoin(BASE,'services-2/'),urljoin(BASE,'about-us/'),urljoin(BASE,'contact-us/'),urljoin(BASE,'designing/'),urljoin(BASE,'softwares/'),urljoin(BASE,'laser-repair-technical-services/')]
    q=deque(dict.fromkeys(seeds)); queued=set(q)
    while q and len(scanned)<MAX_PAGES:
        page=q.popleft()
        if page in scanned:continue
        r=get(page)
        if not r or 'html' not in r.headers.get('content-type','').lower(): failed.append(page);continue
        scanned.add(page); html=r.text; soup=BeautifulSoup(html,'html.parser')
        found=[]
        for tag in soup.find_all(['img','source']):
            alt=(tag.get('alt') or '').strip()
            for a in ('src','data-src','data-lazy-src','data-original','data-bg'):
                if tag.get(a):found.append((tag.get(a),alt,'tag:'+a))
            for a in ('srcset','data-srcset','data-lazy-srcset'):
                if tag.get(a):
                    found += [(x.strip().split(' ')[0],alt,'tag:'+a) for x in tag.get(a).split(',') if x.strip()]
        for m in soup.find_all('meta'):
            k=(m.get('property') or m.get('name') or '').lower()
            if 'image' in k and m.get('content'):found.append((m.get('content'),'','meta:'+k))
        for raw,alt,via in found:
            u=media_url(raw,r.url)
            if not u:continue
            if u not in records:
                name,ext,deriv,reason=classify(u); records[u]={'url':u,'filename':name,'extension':ext,'is_derivative':deriv,'derivative_reason':reason,'alt_texts':set(),'source_pages':set(),'discovered_via':set()}
            if alt:records[u]['alt_texts'].add(alt)
            records[u]['source_pages'].add(r.url); records[u]['discovered_via'].add(via)
        for raw in UPLOAD_RE.findall(html.replace('\\/','/')):
            u=media_url(raw.replace('&amp;','&'),r.url)
            if not u:continue
            if u not in records:
                name,ext,deriv,reason=classify(u); records[u]={'url':u,'filename':name,'extension':ext,'is_derivative':deriv,'derivative_reason':reason,'alt_texts':set(),'source_pages':set(),'discovered_via':set()}
            records[u]['source_pages'].add(r.url); records[u]['discovered_via'].add('html-regex')
        for a in soup.find_all('a',href=True):
            u=page_url(a.get('href'),r.url)
            if u and is_page(u) and u not in scanned and u not in queued and len(queued)<MAX_PAGES*4:q.append(u);queued.add(u)
        time.sleep(.04)
    rows=[]
    for u in sorted(records):
        x=records[u]; rows.append({**{k:x[k] for k in ('url','filename','extension','is_derivative','derivative_reason')},'alt_texts':sorted(x['alt_texts']),'source_pages':sorted(x['source_pages']),'discovered_via':sorted(x['discovered_via'])})
    originals=sum(not x['is_derivative'] for x in rows); deriv=len(rows)-originals
    exts=defaultdict(int); years=defaultdict(int)
    for x in rows:
        exts[x['extension'] or 'unknown']+=1
        m=re.search(r'/uploads/(20\d{2})/',x['url'])
        if m:years[m.group(1)]+=1
    data={'generated_at_utc':datetime.now(timezone.utc).isoformat(),'source_site':BASE,'note':'Read-only public media inventory; source WordPress site was not changed.','pages_scanned':len(scanned),'pages_failed':len(failed),'unique_image_urls':len(rows),'likely_originals':originals,'generated_or_resized_derivatives':deriv,'by_extension':dict(sorted(exts.items())),'by_upload_year':dict(sorted(years.items())),'failed_pages':failed[:250],'images':rows}
    (OUT/'sahandlaser-media-full.json').write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
    with (OUT/'sahandlaser-media-full.csv').open('w',newline='',encoding='utf-8-sig') as f:
        w=csv.writer(f);w.writerow(['url','filename','extension','is_derivative','derivative_reason','alt_texts','source_pages','discovered_via'])
        for x in rows:w.writerow([x['url'],x['filename'],x['extension'],x['is_derivative'],x['derivative_reason'],' | '.join(x['alt_texts']),' | '.join(x['source_pages']),' | '.join(x['discovered_via'])])
    report=['# SahandLaser current-site media inventory','',f'- Pages scanned: **{len(scanned)}**',f'- Unique image URLs: **{len(rows)}**',f'- Likely originals: **{originals}**',f'- Generated/resized derivatives: **{deriv}**','', '## By extension','']+[f'- {k}: {v}' for k,v in sorted(exts.items(),key=lambda x:-x[1])]+['','## By upload year','']+[f'- {k}: {v}' for k,v in sorted(years.items())]
    (OUT/'sahandlaser-media-report.md').write_text('\n'.join(report)+'\n',encoding='utf-8')
    print(json.dumps({'pages_scanned':len(scanned),'unique_images':len(rows),'originals':originals,'derivatives':deriv,'failed':len(failed)},ensure_ascii=False))
if __name__=='__main__':main()
