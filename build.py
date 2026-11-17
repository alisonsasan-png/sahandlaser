# Builds all static pages from js/data.js-equivalent JSON (/tmp/data.json or js/data.js)
import json, os, html, re
BASE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open('/tmp/data.json'))
WA = '989125855548'
E = lambda s: html.escape(str(s or ''), quote=True)

ICONS = {
 'cutting':'<path d="M4 20 20 4"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="18" r="3"/>',
 'welding':'<path d="M3 18h18"/><path d="M6 18c0-6 12-6 12 0"/><path d="M12 4v6"/>',
 'marking':'<rect x="4" y="4" width="16" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 'cleaning':'<path d="M12 3v5M7 8h10l-2 12H9z"/><path d="M10 12v4M14 12v4"/>',
 'source':'<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 12h10M7 10h2M7 14h2"/>',
 'head':'<circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
 'parts':'<path d="M14 7a4 4 0 1 0 3 5l4 0M3 17h7l2-3"/>',
 'consumables':'<path d="M5 4h14v4H5zM8 8v12h8V8"/>',
}
SVC_ICON = '<path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z"/>'
def svg(p, cls=''): return f'<svg viewBox="0 0 24 24" class="{cls}" aria-hidden="true">{p}</svg>'
BEAM = ('<svg class="beam" viewBox="0 0 560 320" aria-hidden="true"><defs><linearGradient id="g" x1="0" x2="1">'
 '<stop offset="0" stop-color="#06b6d4"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs>'
 '<rect x="60" y="230" width="440" height="22" rx="6" fill="#1e293b" stroke="#334155"/>'
 '<rect x="250" y="60" width="60" height="170" rx="10" fill="#1e293b" stroke="#475569"/>'
 '<circle cx="280" cy="60" r="16" fill="url(#g)"/>'
 '<line x1="280" y1="76" x2="280" y2="230" stroke="#67e8f9" stroke-width="3" stroke-dasharray="6 6"/>'
 '<path d="M280 230 L420 110" stroke="#22d3ee" stroke-width="3"/>'
 '<g stroke="#38bdf8" stroke-opacity=".35" stroke-width="2"><line x1="40" y1="40" x2="520" y2="40"/><line x1="40" y1="90" x2="520" y2="90"/><line x1="40" y1="140" x2="520" y2="140"/></g>'
 '<circle cx="90" cy="60" r="4" fill="#38bdf8"/><circle cx="500" cy="120" r="3" fill="#38bdf8"/><circle cx="470" cy="260" r="5" fill="#06b6d4"/></svg>')
CATS = {k:v for k,v in {'cutting':'ط¯ط³طھع¯ط§ظ‡â€Œظ‡ط§غŒ ط¨ط±ط´','welding':'ط¬ظˆط´ ظ„غŒط²ط±غŒ','marking':'ظ…ط§ط±ع©غŒظ†ع¯ ظˆ ط­ع©ط§ع©غŒ','cleaning':'طھظ…غŒط²ع©ط§ط±غŒ ظ„غŒط²ط±غŒ','source':'ط³ظˆط±ط³ ظ„غŒط²ط±','head':'ظ‡ط¯ ظˆ ع©ظ†طھط±ظ„ط±','parts':'ع†غŒظ„ط± ظˆ ظ‚ط·ط¹ط§طھ','consumables':'ظ†ط§ط²ظ„طŒ ظ„ظ†ط² ظˆ ظ…طµط±ظپغŒ'}.items()}
CAT_ORDER = list(CATS.keys())
ITEMS = D['items']
def cat_label(c): return CATS.get(c, c)

def header(active):
    links = [('index.html','ط®ط§ظ†ظ‡','home'),('products.html','ظ…ط­طµظˆظ„ط§طھ','products'),('services.html','ط®ط¯ظ…ط§طھ','services'),
             ('downloads.html','ط¯ط§ظ†ظ„ظˆط¯','downloads'),('about.html','ط¯ط±ط¨ط§ط±ظ‡ ظ…ط§','about'),('gallery.html','ع¯ط§ظ„ط±غŒ','gallery'),('contact.html','طھظ…ط§ط³','contact')]
    nav = ''.join(f'<a href="{u}" class="{"active" if k==active else ""}">{t}</a>' for u,t,k in links)
    return f'''<header class="top"><div class="wrap">
<a class="logo" href="index.html"><span class="logo-mark">{svg('<path d="M12 2v6M12 22v-6M2 12h6M22 12h-6"/><circle cx="12" cy="12" r="3"/>','').replace('<svg','<svg style="width:22px;height:22px;stroke:#fff;fill:none;stroke-width:2"')}</span><span>ط³ظ‡ظ†ط¯ ظ„غŒط²ط±<small>SAHAND LASER</small></span></a>
<nav class="main" aria-label="ظ…ظ†ظˆغŒ ط§طµظ„غŒ">{nav}</nav></div></header>'''

def footer():
    return f'''<footer class="site"><div class="wrap cols">
<div><h4>ط³ظ‡ظ†ط¯ ظ„غŒط²ط±</h4>ظپظ†ط§ظˆط±ط§ظ† ظ¾ط±طھظˆ ظ„غŒط²ط± ط³ظ‡ظ†ط¯ â€” ط§طµظپظ‡ط§ظ†طŒ ط®غŒط§ط¨ط§ظ† ط®غŒط§ظ…طŒ ط®غŒط§ط¨ط§ظ† ط¹ط·ط§ط،ط§ظ„ظ…ظ„ع©طŒ ط¨ظ„ظˆع© غ²غ´طŒ ظ¾ظ„ط§ع© غ³غ³<br>
طھظ„ظپظ†: <a href="tel:+983131320012" dir="ltr">+98 31 3132 0012</a><br>
<a href="https://www.instagram.com/sahandlaser/" target="_blank" rel="noopener noreferrer">ط§غŒظ†ط³طھط§ع¯ط±ط§ظ…</a> آ· <a href="https://eitaa.com/sahandlaser_sale" target="_blank" rel="noopener noreferrer">ط§غŒطھط§</a> آ· <a href="https://ble.ir/sahandlaser_sale" target="_blank" rel="noopener noreferrer">ط¨ظ„ظ‡</a></div>
<div><h4>ط¯ط³طھط±ط³غŒ ط³ط±غŒط¹</h4><ul><li><a href="products.html">ظ…ط­طµظˆظ„ط§طھ</a></li><li><a href="services.html">ط®ط¯ظ…ط§طھ</a></li><li><a href="downloads.html">ط¯ط§ظ†ظ„ظˆط¯</a></li></ul></div>
<div><h4>ط´ط±ع©طھ</h4><ul><li><a href="about.html">ط¯ط±ط¨ط§ط±ظ‡ ظ…ط§</a></li><li><a href="gallery.html">ع¯ط§ظ„ط±غŒ</a></li><li><a href="contact.html">طھظ…ط§ط³ ظˆ ط§ط³طھط¹ظ„ط§ظ…</a></li></ul></div>
</div><div class="wrap" style="margin-top:20px;font-size:.85rem">آ© غ±غ´غ°غµ ظپظ†ط§ظˆط±ط§ظ† ظ¾ط±طھظˆ ظ„غŒط²ط± ط³ظ‡ظ†ط¯ â€” طھظ…ط§ظ… ط­ظ‚ظˆظ‚ ظ…ط­ظپظˆط¸ ط§ط³طھ.</div></footer>
<a class="fab" href="https://wa.me/{WA}" target="_blank" rel="noopener noreferrer" aria-label="ظˆط§طھط³ط§ظ¾" title="ظˆط§طھط³ط§ظ¾"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9c2.1.8 2.1.6 2.5.5a2.1 2.1 0 0 0 1.4-1 1.7 1.7 0 0 0 .1-1c0-.1-.2-.2-.5-.3z"/></svg></a>
<script src="js/app.js"></script>'''

def page(fname, title, active, body, desc=''):
    doc = f'''<!DOCTYPE html>
<html lang="fa" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)} | ط³ظ‡ظ†ط¯ ظ„غŒط²ط±</title><meta name="description" content="{E(desc or 'ط³ظ‡ظ†ط¯ ظ„غŒط²ط± â€” ط¯ط³طھع¯ط§ظ‡â€Œظ‡ط§غŒ ط¨ط±ط´طŒ ط¬ظˆط´طŒ ظ…ط§ط±ع©غŒظ†ع¯ ظˆ طھظ…غŒط²ع©ط§ط±غŒ ظ„غŒط²ط± ظپط§غŒط¨ط±طŒ ظ‚ط·ط¹ط§طھطŒ ط®ط¯ظ…ط§طھ ظپظ†غŒ ظˆ ط¢ظ…ظˆط²ط´')}">
<meta name="theme-color" content="#0b1220"><link rel="stylesheet" href="{'../' if '/' in fname else ''}css/style.css"></head>
<body>{header(active)}<main>{body}</main>{footer()}</body></html>'''
    if '/' in fname:
        doc = re.sub(r'(href|src)="(?!https?:|tel:|#|\.\./|mailto:)([^"]*)"', r'\1="../\2"', doc)
    path = os.path.join(BASE, fname)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path,'w').write(doc)

def card_product(it, prefix=''):
    return f'''<a class="card pcard" href="{prefix}products/{E(it['code'])}.html" data-cat="{E(it['cat'])}" data-text="{E((it['title']+' '+it.get('sub','')+' '+it['code']+' '+it.get('desc','')).lower())}">
<div class="thumb">{svg(ICONS.get(it['cat'],''),'')}<span class="code">{E(it['code'])}</span></div>
<span class="tag">{E(cat_label(it['cat']))}</span><h3>{E(it['title'])}</h3>
<div class="en">{E(it.get('sub',''))}</div><p>{E(it.get('desc',''))}</p><span class="more" style="color:var(--blue)">ظ…ط´ط§ظ‡ط¯ظ‡ ط¬ط²ط¦غŒط§طھ â†گ</span></a>'''

# ---------- HOME ----------
cat_cards = ''.join(f'''<a class="card" href="products.html?cat={c}"><div class="ico">{svg(ICONS[c])}</div>
<h3>{E(CATS[c])}</h3><div class="en">{sum(1 for i in ITEMS if i['cat']==c)} ظ…ط¯ظ„</div></a>''' for c in CAT_ORDER)
svc_cards = ''.join(f'''<div class="card"><div class="ico">{svg(SVC_ICON)}</div><h3>{E(s['title'])}</h3><div class="en">{E(s.get('en',''))}</div><p>{E(s['desc'])}</p></div>''' for s in D['services'][:6])
home = f'''
<div class="hero"><div class="wrap"><div>
<span class="eyebrow" style="color:#67e8f9">ظپظ†ط§ظˆط±ط§ظ† ظ¾ط±طھظˆ ظ„غŒط²ط± ط³ظ‡ظ†ط¯ آ· ط§ط² غ±غ³غ¹غ°</span>
<h1>ط±ط§ظ‡ع©ط§ط±ظ‡ط§غŒ ع©ط§ظ…ظ„ <span>ظ„غŒط²ط± ظپط§غŒط¨ط±</span> ط¨ط±ط§غŒ طµظ†ط¹طھ</h1>
<p>ط·ط±ط§ط­غŒطŒ طھظˆظ„غŒط¯طŒ طھط£ظ…غŒظ† ظˆ ظ¾ط´طھغŒط¨ط§ظ†غŒ ط¯ط³طھع¯ط§ظ‡â€Œظ‡ط§غŒ ط¨ط±ط´طŒ ط¬ظˆط´طŒ ظ…ط§ط±ع©غŒظ†ع¯ ظˆ طھظ…غŒط²ع©ط§ط±غŒ ظ„غŒط²ط± â€” ظ‡ظ…ط±ط§ظ‡ ط¨ط§ ط³ظˆط±ط³طŒ ظ‡ط¯طŒ ع†غŒظ„ط±طŒ ط¢ظ…ظˆط²ط´ ظˆ طھط¹ظ…غŒط±ط§طھ ظپظ†غŒ.</p>
<div><a class="btn btn-primary" href="contact.html">ط¯ط±ط®ظˆط§ط³طھ ظ…ط´ط§ظˆط±ظ‡</a><a class="btn btn-ghost" href="products.html">ظ…ط´ط§ظ‡ط¯ظ‡ ظ…ط­طµظˆظ„ط§طھ</a></div>
</div><div>{BEAM}</div></div></div>
<div class="wrap"><div class="stats">
<div class="stat"><b>غ±غ³غ¹غ°</b><span>ط³ط§ظ„ طھط£ط³غŒط³</span></div>
<div class="stat"><b>+غ±غµغ°</b><span>ظ†طµط¨ ظˆ ط±ط§ظ‡â€Œط§ظ†ط¯ط§ط²غŒ</span></div>
<div class="stat"><b>غ´</b><span>ط§ط®طھط±ط§ط¹ ظ…ظ„غŒ ط«ط¨طھâ€Œط´ط¯ظ‡</span></div>
<div class="stat"><b>{len(ITEMS)}</b><span>ظ…ط¯ظ„ ظˆ ظ‚ط·ط¹ظ‡ ط¯ط± ع©ط§طھط§ظ„ظˆع¯</span></div>
</div></div>
<section><div class="wrap"><span class="eyebrow">ط¯ط³طھظ‡â€Œط¨ظ†ط¯غŒ</span><h2 class="sec">ظ…ط­طµظˆظ„ط§طھ ط³ظ‡ظ†ط¯ ظ„غŒط²ط±</h2><p class="lead">غŒع© ط¯ط³طھظ‡ ط±ط§ ط§ظ†طھط®ط§ط¨ ع©ظ†غŒط¯.</p>
<div class="grid">{cat_cards}</div></div></section>
<section class="alt"><div class="wrap"><span class="eyebrow">ط®ط¯ظ…ط§طھ</span><h2 class="sec">ط§ط² طھط­ظ„غŒظ„ ظ†غŒط§ط² طھط§ ظ¾ط´طھغŒط¨ط§ظ†غŒ</h2><p class="lead">ظ‡ظ…ط±ط§ظ‡غŒ ع©ط§ظ…ظ„ ط¯ط± طھظ…ط§ظ… ظ…ط±ط§ط­ظ„ ظ¾ط±ظˆعکظ‡.</p>
<div class="grid">{svc_cards}</div><p style="margin-top:24px"><a class="btn btn-dark" href="services.html">ظ‡ظ…ظ‡ ط®ط¯ظ…ط§طھ</a></p></div></section>
<section><div class="wrap"><div class="cta"><div><h2>ط±ط§ظ‡ع©ط§ط± ظ…ظ†ط§ط³ط¨ ع©ط³ط¨â€Œظˆع©ط§ط± ط®ظˆط¯ ط±ط§ ط¨ع¯غŒط±غŒط¯</h2><p>ظ†غŒط§ط² ظپظ†غŒ ط®ظˆط¯ ط±ط§ ط¨ظ†ظˆغŒط³غŒط¯ط› ع©ط§ط±ط´ظ†ط§ط³ط§ظ† ظ…ط§ ط¨ط±ط±ط³غŒ ظˆ ظ¾ط§ط³ط® ظ…غŒâ€Œط¯ظ‡ظ†ط¯.</p></div>
<div><a class="btn btn-primary" href="contact.html">ط´ط±ظˆط¹ ط§ط³طھط¹ظ„ط§ظ…</a> <a class="btn btn-wa" href="https://wa.me/{WA}" target="_blank" rel="noopener noreferrer">ظˆط§طھط³ط§ظ¾</a></div></div></div></section>'''
page('index.html','ط®ط§ظ†ظ‡','home',home,'ط³ظ‡ظ†ط¯ ظ„غŒط²ط± â€” ط¯ط³طھع¯ط§ظ‡â€Œظ‡ط§غŒ ط¨ط±ط´طŒ ط¬ظˆط´طŒ ظ…ط§ط±ع©غŒظ†ع¯ ظˆ طھظ…غŒط²ع©ط§ط±غŒ ظ„غŒط²ط± ظپط§غŒط¨ط±طŒ ظ‚ط·ط¹ط§طھ ظˆ ط®ط¯ظ…ط§طھ ظپظ†غŒ')

# ---------- PRODUCTS LIST ----------
chips = '<button class="chip on" data-cat="all">ظ‡ظ…ظ‡</button>' + ''.join(f'<button class="chip" data-cat="{c}">{E(CATS[c])}</button>' for c in CAT_ORDER)
prod_list = f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">ع©ط§طھط§ظ„ظˆع¯</span><h1 class="sec" style="font-size:2rem">ظ…ط­طµظˆظ„ط§طھ ظˆ طھط¬ظ‡غŒط²ط§طھ</h1>
<p class="lead">ظ…ط´ط®طµط§طھ ط¯ظ‚غŒظ‚ ظ‡ط± ظ¾غŒع©ط±ط¨ظ†ط¯غŒ ظ‡ظ†ع¯ط§ظ… ط§ط³طھط¹ظ„ط§ظ… طھط£غŒغŒط¯ ظ…غŒâ€Œط´ظˆط¯.</p>
<div class="toolbar"><input type="search" id="q" placeholder="ط¬ط³طھط¬ظˆغŒ ظ†ط§ظ… ط¯ط³طھع¯ط§ظ‡طŒ ظ‚ط·ط¹ظ‡ غŒط§ ع©ط¯â€¦" aria-label="ط¬ط³طھط¬ظˆ"></div>
<div class="chips" id="chips">{chips}</div><div class="count" id="count"></div>
<div class="grid" id="plist">{''.join(card_product(i) for i in ITEMS)}</div></div>'''
page('products.html','ظ…ط­طµظˆظ„ط§طھ','products',prod_list+'<div style="height:40px"></div>','ع©ط§طھط§ظ„ظˆع¯ ظ…ط­طµظˆظ„ط§طھ ظ„غŒط²ط± ط³ظ‡ظ†ط¯')

# ---------- PRODUCT DETAILS ----------
for it in ITEMS:
    related = [x for x in ITEMS if x['cat']==it['cat'] and x['code']!=it['code']][:3]
    rel = ''.join(card_product(x,'../') for x in related)
    ICO = svg(ICONS.get(it['cat'],''),'')
    body = f'''<div class="wrap" style="padding-top:20px">
<div class="crumb"><a href="../index.html">ط®ط§ظ†ظ‡</a> / <a href="../products.html">ظ…ط­طµظˆظ„ط§طھ</a> / <a href="../products.html?cat={it['cat']}">{E(cat_label(it['cat']))}</a> / {E(it['code'])}</div>
<div class="detail"><div class="big">{ICO}</div>
<div><span class="tag">{E(cat_label(it['cat']))}</span><h1>{E(it['title'])}</h1><div class="en" style="direction:ltr;text-align:left;color:var(--muted)">{E(it.get('sub',''))}</div>
<p style="margin-top:14px">{E(it.get('desc',''))}</p>
<div class="note">ظ…ط´ط®طµط§طھ ظˆ ظ¾غŒع©ط±ط¨ظ†ط¯غŒ ظ†ظ‡ط§غŒغŒ ط¨ط§ ع©ط§ط±ط´ظ†ط§ط³ط§ظ† ظپظ†غŒ طھط£غŒغŒط¯ ظ…غŒâ€Œط´ظˆط¯.</div>
<p><b>ع©ط¯ ظ…ط­طµظˆظ„:</b> <span dir="ltr">{E(it['code'])}</span></p>
<div class="actions" style="margin-top:18px"><a class="btn btn-primary" href="../contact.html?p={E(it['code'])}">ط§ط³طھط¹ظ„ط§ظ… ط§غŒظ† ظ…ط¯ظ„</a>
<a class="btn btn-wa" href="https://wa.me/{WA}?text={E(it['title'])}" target="_blank" rel="noopener noreferrer">ظˆط§طھط³ط§ظ¾</a></div>
</div></div>
{'<h2 class="sec" style="margin-top:50px">ظ…ط¯ظ„â€Œظ‡ط§غŒ ظ…ط±طھط¨ط·</h2><div class="grid" style="margin-top:18px">'+rel+'</div>' if rel else ''}
</div><div style="height:40px"></div>'''
    page(f"products/{it['code']}.html", it['title'], 'products', body, it.get('desc',''))

# ---------- SERVICES ----------
svc = ''.join(f'''<div class="card"><div class="ico">{svg(SVC_ICON)}</div><h3>{E(s['title'])}</h3><div class="en">{E(s.get('en',''))}</div><p>{E(s['desc'])}</p></div>''' for s in D['services'])
steps = ['ظ…ط´ط§ظˆط±ظ‡ ظˆ طھط­ظ„غŒظ„ ظ†غŒط§ط²','ط·ط±ط§ط­غŒ غŒط§ ط§ظ†طھط®ط§ط¨ ط¯ط³طھع¯ط§ظ‡','ظ†طµط¨طŒ ع©ط§ظ„غŒط¨ط±ط§ط³غŒظˆظ† ظˆ طھط³طھ','ط¢ظ…ظˆط²ط´ ط§ظ¾ط±ط§طھظˆط± ظˆ طھط­ظˆغŒظ„']
page('services.html','ط®ط¯ظ…ط§طھ','services',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">ط®ط¯ظ…ط§طھ</span><h1 class="sec" style="font-size:2rem">ط®ط¯ظ…ط§طھ طھط®طµطµغŒ ط³ظ‡ظ†ط¯ ظ„غŒط²ط±</h1><p class="lead">ط§ط² طھط­ظ„غŒظ„ ظ†غŒط§ط² طھط§ ظ¾ط´طھغŒط¨ط§ظ†غŒ ظ¾ط³ ط§ط² ظپط±ظˆط´.</p>
<div class="grid">{svc}</div>
<h2 class="sec" style="margin-top:50px">ط±ظˆظ†ط¯ ظ‡ظ…ع©ط§ط±غŒ</h2><div class="steps" style="margin-top:24px">{''.join(f'<div class="step">{s}</div>' for s in steps)}</div>
<div class="cta"><div><h2>ظ†غŒط§ط² ط¨ظ‡ ط®ط¯ظ…ط§طھ ظپظ†غŒ ط¯ط§ط±غŒط¯طں</h2><p>ط¯ط³طھع¯ط§ظ‡ ط®ظˆط¯ ط±ط§ ظ…ط¹ط±ظپغŒ ع©ظ†غŒط¯ طھط§ ط¨ط±ط±ط³غŒ ط´ظˆط¯.</p></div><a class="btn btn-primary" href="contact.html">ط«ط¨طھ ط¯ط±ط®ظˆط§ط³طھ</a></div></div><div style="height:30px"></div>''','ط®ط¯ظ…ط§طھ ط³ظ‡ظ†ط¯ ظ„غŒط²ط±')

# ---------- DOWNLOADS ----------
dl = ''
for g in D['downloads']:
    rows = ''
    for it in g['items']:
        link = f'<a class="pill" href="{E(it["url"])}" target="_blank" rel="noopener noreferrer">ط¯ط§ظ†ظ„ظˆط¯</a>' if it.get('url') else '<span class="pill off">ط¨ظ‡â€Œط²ظˆط¯غŒ</span>'
        rows += f'<tr><td>{E(it["name"])}</td><td class="ltr">{E(it.get("version") or "â€”")}</td><td>{E(it.get("size") or "â€”")}</td><td>{link}</td></tr>'
    ic = svg(SVC_ICON,'ds-ico')
    dl += '<h2 class="sec" style="font-size:1.25rem;margin-top:30px">' + ic + E(g['title']) + '</h2>'
    dl += f'<table class="dl"><thead><tr><th>ظ†ط§ظ…</th><th>ظ†ط³ط®ظ‡</th><th>ط­ط¬ظ…</th><th>ط¯ط§ظ†ظ„ظˆط¯</th></tr></thead><tbody>{rows}</tbody></table>'
page('downloads.html','ط¯ط§ظ†ظ„ظˆط¯','downloads',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">ظ…ط±ع©ط² ط¯ط§ظ†ظ„ظˆط¯</span><h1 class="sec" style="font-size:2rem">ظ†ط±ظ…â€Œط§ظپط²ط§ط± ظˆ ط¯ط±ط§غŒظˆط±</h1>
<p class="lead">ظ¾غŒط´ ط§ط² ظ†طµط¨ ظ†ط³ط®ظ‡ ط¬ط¯غŒط¯طŒ ط³ط§ط²ع¯ط§ط±غŒ ط¢ظ† ط¨ط§ ع©ظ†طھط±ظ„ط± ظˆ ط³ط®طھâ€Œط§ظپط²ط§ط± ط¯ط³طھع¯ط§ظ‡ ط±ط§ ط¨ط±ط±ط³غŒ ع©ظ†غŒط¯.</p>{dl}</div><div style="height:30px"></div>''','ط¯ط§ظ†ظ„ظˆط¯ ظ†ط±ظ…â€Œط§ظپط²ط§ط± ط³ظ‡ظ†ط¯ ظ„غŒط²ط±')

# ---------- ABOUT ----------
page('about.html','ط¯ط±ط¨ط§ط±ظ‡ ظ…ط§','about',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">ط¯ط±ط¨ط§ط±ظ‡ ظ…ط§</span><h1 class="sec" style="font-size:2rem">ظپظ†ط§ظˆط±ط§ظ† ظ¾ط±طھظˆ ظ„غŒط²ط± ط³ظ‡ظ†ط¯</h1>
<div class="about-split" style="margin-top:20px"><div>
<p>ط´ط±ع©طھ ظپظ†ط§ظˆط±ط§ظ† ظ¾ط±طھظˆ ظ„غŒط²ط± ط³ظ‡ظ†ط¯طŒ ط¨ط§ ظ…ط³ط¦ظˆظ„غŒطھ ظ…ط­ط¯ظˆط¯ ظˆ ط´ظ…ط§ط±ظ‡ ط«ط¨طھ غ´غ¶غ²غµغ¶طŒ ط§ط² ط³ط§ظ„ غ±غ³غ¹غ° ط¯ط± ط²ظ…غŒظ†ظ‡ ط·ط±ط§ط­غŒطŒ طھظˆظ„غŒط¯ ظˆ طھط¬ط§ط±غŒâ€Œط³ط§ط²غŒ ظپظ†ط§ظˆط±غŒâ€Œظ‡ط§غŒ ظ„غŒط²ط± ظپط¹ط§ظ„غŒطھ ط¯ط§ط±ط¯.</p>
<p>ط­ظˆط²ظ‡ ظپط¹ط§ظ„غŒطھ ط´ط±ع©طھ ط´ط§ظ…ظ„ طھط¬ظ‡غŒط²ط§طھ طµظ†ط¹طھغŒ ط¨ط±ط´طŒ ط¬ظˆط´طŒ ط­ع©ط§ع©غŒ/ظ…ط§ط±ع©غŒظ†ع¯ ظˆ طھظ…غŒط²ع©ط§ط±غŒ ظ„غŒط²ط±طŒ طھط¬ظ‡غŒط²ط§طھ ط¢ط²ظ…ط§غŒط´ع¯ط§ظ‡غŒ ظˆ ظ‡ظ…ع†ظ†غŒظ† طھط¹ظ…غŒط±ط§طھ طھط®طµطµغŒ ط³ظˆط±ط³طŒ ظ‡ط¯ ظˆ ط¯ط³طھع¯ط§ظ‡ ط§ط³طھ.</p>
<p>ظ…ط§ ظ…ط¹طھظ‚ط¯غŒظ… غŒع© ط´ط±ع©طھ ظ„غŒط²ط± طھظ†ظ‡ط§ ظپط±ظˆط´ظ†ط¯ظ‡ ط¯ط³طھع¯ط§ظ‡ ظ†غŒط³طھط› ط¨ط§غŒط¯ ط¯ط± طھظ…ط§ظ… ظ…ط±ط§ط­ظ„ ع©ظ†ط§ط± ظ…ط´طھط±غŒ ط¨ط§ط´ط¯: ط§ط² طھط­ظ„غŒظ„ ط±ط§غŒع¯ط§ظ† ظ†غŒط§ط² طھط§ ط¢ظ…ظˆط²ط´ ظˆ ط®ط¯ظ…ط§طھ ظ¾ط³ ط§ط² ظپط±ظˆط´.</p>
<p><b>ط¢ط¯ط±ط³:</b> ط§طµظپظ‡ط§ظ†طŒ ط®غŒط§ط¨ط§ظ† ط®غŒط§ظ…طŒ ط®غŒط§ط¨ط§ظ† ط¹ط·ط§ط،ط§ظ„ظ…ظ„ع©طŒ ط¨ظ„ظˆع© غ²غ´طŒ ظ¾ظ„ط§ع© غ³غ³</p></div>
<div><h3>ظ…ط³غŒط± ظ…ط§</h3><ul class="timeline">
<li><b>غ±غ³غ¹غ°</b><br>طھط£ط³غŒط³ ط´ط±ع©طھ</li><li><b>غ±غ³غ¹غµ</b><br>طھظˆط³ط¹ظ‡ ط®ط· طھظˆظ„غŒط¯</li><li><b>غ±غ´غ°غ°</b><br>ط«ط¨طھ غ´ ط§ط®طھط±ط§ط¹ ظ…ظ„غŒ</li><li><b>غ±غ´غ°غ³</b><br>طھظˆط³ط¹ظ‡ ظ¾ط±ظˆعکظ‡â€Œظ‡ط§غŒ طµظ†ط¹طھغŒ ظˆ ط¨غŒط´ ط§ط² غ±غµغ° ظ†طµط¨</li></ul></div></div></div>
<div style="height:40px"></div>''','ط¯ط±ط¨ط§ط±ظ‡ ط³ظ‡ظ†ط¯ ظ„غŒط²ط±')

# ---------- GALLERY ----------
page('gallery.html','ع¯ط§ظ„ط±غŒ','gallery',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">ع¯ط§ظ„ط±غŒ</span><h1 class="sec" style="font-size:2rem">طھطµط§ظˆغŒط± ظ¾ط±ظˆعکظ‡â€Œظ‡ط§</h1>
<p class="lead">طھطµط§ظˆغŒط± ظ¾ط±ظˆعکظ‡â€Œظ‡ط§ ظˆ ط¨ط§ط²ط¯غŒط¯ ظ…ط´طھط±غŒط§ظ† ط¯ط± ط§غŒظ† ط¨ط®ط´ ظ†ظ…ط§غŒط´ ط¯ط§ط¯ظ‡ ظ…غŒâ€Œط´ظˆظ†ط¯.</p>
<div class="empty-gallery">{svg('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>','').replace('<svg','<svg style="width:56px;height:56px;stroke:#94a3b8;fill:none;stroke-width:1.5;margin-bottom:10px"')}<br>ط¨ظ‡â€Œط²ظˆط¯غŒ طھطµط§ظˆغŒط± ظ¾ط±ظˆعکظ‡â€Œظ‡ط§ ط§ط¶ط§ظپظ‡ ظ…غŒâ€Œط´ظˆظ†ط¯.<br><small>طھطµط§ظˆغŒط± ط±ط§ ط¯ط± ظ¾ظˆط´ظ‡ <span dir="ltr">assets/gallery/</span> ظ‚ط±ط§ط± ط¯ظ‡غŒط¯.</small></div></div><div style="height:40px"></div>''','ع¯ط§ظ„ط±غŒ ط³ظ‡ظ†ط¯ ظ„غŒط²ط±')

# ---------- CONTACT ----------
def crow(p): return f'<div class="crow"><small>{E(p["label"])} â€” {E(p["name"])}</small><a href="tel:+{p["phone"]}">+{p["phone"]}</a></div>'
C = {'sales':[{'name':'ط¢ظ‚ط§غŒ ط§ط¨ط·ط­غŒ','label':'ظپط±ظˆط´','phone':'989133862673'},{'name':'ط¢ظ‚ط§غŒ ط¨ظ„غŒط؛','label':'ظپط±ظˆط´','phone':'989125855548'}],
 'support':[{'name':'ط¢ظ‚ط§غŒ ط¨ظ‡ط±ط§ظ…غŒ ظˆ ط§ط®ظ„ط§ظ‚غŒ','label':'ط®ط¯ظ…ط§طھ ظˆ ظ¾ط´طھغŒط¨ط§ظ†غŒ ط¯ط³طھع¯ط§ظ‡','phone':'989198023032'},{'name':'ط¢ظ‚ط§غŒ ط´غŒط±غŒ','label':'ط¨ط±ط´ ظ„غŒط²ط±','phone':'989131863032'}],
 'finance':[{'name':'ط®ط§ظ†ظ… ط²ظ…ط§ظ†غŒ','label':'ط­ط³ط§ط¨ط¯ط§ط±غŒ','phone':'989137353032'}]}
page('contact.html','طھظ…ط§ط³','contact',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">طھظ…ط§ط³</span><h1 class="sec" style="font-size:2rem">ط§ط³طھط¹ظ„ط§ظ… ظˆ ظ…ط´ط§ظˆط±ظ‡</h1>
<p class="lead">ظپط±ظ… ط±ط§ طھع©ظ…غŒظ„ ع©ظ†غŒط¯ط› ظ¾غŒط§ظ… ط¨ط§ ظˆط§طھط³ط§ظ¾ ط¨ط±ط§غŒ ع©ط§ط±ط´ظ†ط§ط³ط§ظ† ط§ط±ط³ط§ظ„ ظ…غŒâ€Œط´ظˆط¯.</p>
<form class="inq" id="inq">
<div><label for="n">ظ†ط§ظ… ظˆ ظ†ط§ظ… ط®ط§ظ†ظˆط§ط¯ع¯غŒ</label><input id="n" name="name" required autocomplete="name"></div>
<div><label for="c">ط´ظ…ط§ط±ظ‡ ظ…ظˆط¨ط§غŒظ„ غŒط§ ط§غŒظ…غŒظ„</label><input id="c" name="contact" required dir="ltr" placeholder="09xxxxxxxxx"></div>
<div><label for="t">ظ†ظˆط¹ ظ†غŒط§ط²</label><select id="t" name="type"><option>ط¨ط±ط´ ظ„غŒط²ط±</option><option>ط¬ظˆط´ ظ„غŒط²ط±</option><option>ظ…ط§ط±ع©غŒظ†ع¯ / ط­ع©ط§ع©غŒ</option><option>طھظ…غŒط²ع©ط§ط±غŒ ظ„غŒط²ط±</option><option>ط³ظˆط±ط³طŒ ظ‡ط¯ غŒط§ ظ‚ط·ط¹ط§طھ</option><option>طھط¹ظ…غŒط± ظˆ ظ¾ط´طھغŒط¨ط§ظ†غŒ</option><option>ط¢ظ…ظˆط²ط´</option></select></div>
<div><label for="i">طµظ†ط¹طھ / ع©ط§ط±ط¨ط±ط¯</label><input id="i" name="industry"></div>
<div class="full"><label for="m">طھظˆط¶غŒط­ط§طھ (ط¬ظ†ط³ ظ‚ط·ط¹ظ‡طŒ ط¶ط®ط§ظ…طھطŒ ط§ط¨ط¹ط§ط¯ ظˆط±ظ‚طŒ طھغŒط±ط§عک)</label><textarea id="m" name="message"></textarea></div>
<div class="full actions"><button type="button" class="btn btn-wa" data-ch="wa">ط§ط±ط³ط§ظ„ ط§ط² ط·ط±غŒظ‚ ظˆط§طھط³ط§ظ¾</button><button type="button" class="btn btn-tg" data-ch="copy">ع©ظ¾غŒ ظ…طھظ† ط¨ط±ط§غŒ ط§غŒطھط§ / ط¨ظ„ظ‡</button></div>
</form>
<h2 class="sec" style="margin-top:50px">ط´ظ…ط§ط±ظ‡â€Œظ‡ط§غŒ طھظ…ط§ط³</h2>
<div class="contacts" style="margin-top:18px">
<div class="card cbox"><h3>ظپط±ظˆط´</h3>{''.join(crow(p) for p in C['sales'])}</div>
<div class="card cbox"><h3>ظ¾ط´طھغŒط¨ط§ظ†غŒ</h3>{''.join(crow(p) for p in C['support'])}</div>
<div class="card cbox"><h3>ط­ط³ط§ط¨ط¯ط§ط±غŒ</h3>{''.join(crow(p) for p in C['finance'])}</div></div></div><div style="height:40px"></div>''','طھظ…ط§ط³ ط¨ط§ ط³ظ‡ظ†ط¯ ظ„غŒط²ط±')
print('pages built:', 8 + len(ITEMS))

