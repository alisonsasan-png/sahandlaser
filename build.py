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
CATS = {k:v for k,v in {'cutting':'دستگاه‌های برش','welding':'جوش لیزری','marking':'مارکینگ و حکاکی','cleaning':'تمیزکاری لیزری','source':'سورس لیزر','head':'هد و کنترلر','parts':'چیلر و قطعات','consumables':'نازل، لنز و مصرفی'}.items()}
CAT_ORDER = list(CATS.keys())
ITEMS = D['items']
def cat_label(c): return CATS.get(c, c)

def header(active):
    links = [('index.html','خانه','home'),('products.html','محصولات','products'),('services.html','خدمات','services'),
             ('downloads.html','دانلود','downloads'),('about.html','درباره ما','about'),('gallery.html','گالری','gallery'),('contact.html','تماس','contact')]
    nav = ''.join(f'<a href="{u}" class="{"active" if k==active else ""}">{t}</a>' for u,t,k in links)
    return f'''<header class="top"><div class="wrap">
<a class="logo" href="index.html"><span class="logo-mark">{svg('<path d="M12 2v6M12 22v-6M2 12h6M22 12h-6"/><circle cx="12" cy="12" r="3"/>','').replace('<svg','<svg style="width:22px;height:22px;stroke:#fff;fill:none;stroke-width:2"')}</span><span>سهند لیزر<small>SAHAND LASER</small></span></a>
<nav class="main" aria-label="منوی اصلی">{nav}</nav></div></header>'''

def footer():
    return f'''<footer class="site"><div class="wrap cols">
<div><h4>سهند لیزر</h4>فناوران پرتو لیزر سهند — اصفهان، خیابان خیام، خیابان عطاءالملک، بلوک ۲۴، پلاک ۳۳<br>
تلفن: <a href="tel:+983131320012" dir="ltr">+98 31 3132 0012</a><br>
<a href="https://www.instagram.com/sahandlaser/" target="_blank" rel="noopener noreferrer">اینستاگرام</a> · <a href="https://eitaa.com/sahandlaser_sale" target="_blank" rel="noopener noreferrer">ایتا</a> · <a href="https://ble.ir/sahandlaser_sale" target="_blank" rel="noopener noreferrer">بله</a></div>
<div><h4>دسترسی سریع</h4><ul><li><a href="products.html">محصولات</a></li><li><a href="services.html">خدمات</a></li><li><a href="downloads.html">دانلود</a></li></ul></div>
<div><h4>شرکت</h4><ul><li><a href="about.html">درباره ما</a></li><li><a href="gallery.html">گالری</a></li><li><a href="contact.html">تماس و استعلام</a></li></ul></div>
</div><div class="wrap" style="margin-top:20px;font-size:.85rem">© ۱۴۰۵ فناوران پرتو لیزر سهند — تمام حقوق محفوظ است.</div></footer>
<a class="fab" href="https://wa.me/{WA}" target="_blank" rel="noopener noreferrer" aria-label="واتساپ" title="واتساپ"><svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8.9-.3.2-.5.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2.1-.2 0-.3 0-.4l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1 2.7 11.4 11.4 0 0 0 4.4 3.9c2.1.8 2.1.6 2.5.5a2.1 2.1 0 0 0 1.4-1 1.7 1.7 0 0 0 .1-1c0-.1-.2-.2-.5-.3z"/></svg></a>
<script src="js/app.js"></script>'''

def page(fname, title, active, body, desc=''):
    doc = f'''<!DOCTYPE html>
<html lang="fa" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{E(title)} | سهند لیزر</title><meta name="description" content="{E(desc or 'سهند لیزر — دستگاه‌های برش، جوش، مارکینگ و تمیزکاری لیزر فایبر، قطعات، خدمات فنی و آموزش')}">
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
<div class="en">{E(it.get('sub',''))}</div><p>{E(it.get('desc',''))}</p><span class="more" style="color:var(--blue)">مشاهده جزئیات ←</span></a>'''

# ---------- HOME ----------
cat_cards = ''.join(f'''<a class="card" href="products.html?cat={c}"><div class="ico">{svg(ICONS[c])}</div>
<h3>{E(CATS[c])}</h3><div class="en">{sum(1 for i in ITEMS if i['cat']==c)} مدل</div></a>''' for c in CAT_ORDER)
svc_cards = ''.join(f'''<div class="card"><div class="ico">{svg(SVC_ICON)}</div><h3>{E(s['title'])}</h3><div class="en">{E(s.get('en',''))}</div><p>{E(s['desc'])}</p></div>''' for s in D['services'][:6])
home = f'''
<div class="hero"><div class="wrap"><div>
<span class="eyebrow" style="color:#67e8f9">فناوران پرتو لیزر سهند · از ۱۳۹۰</span>
<h1>راهکارهای کامل <span>لیزر فایبر</span> برای صنعت</h1>
<p>طراحی، تولید، تأمین و پشتیبانی دستگاه‌های برش، جوش، مارکینگ و تمیزکاری لیزر — همراه با سورس، هد، چیلر، آموزش و تعمیرات فنی.</p>
<div><a class="btn btn-primary" href="contact.html">درخواست مشاوره</a><a class="btn btn-ghost" href="products.html">مشاهده محصولات</a></div>
</div><div>{BEAM}</div></div></div>
<div class="wrap"><div class="stats">
<div class="stat"><b>۱۳۹۰</b><span>سال تأسیس</span></div>
<div class="stat"><b>+۱۵۰</b><span>نصب و راه‌اندازی</span></div>
<div class="stat"><b>۴</b><span>اختراع ملی ثبت‌شده</span></div>
<div class="stat"><b>{len(ITEMS)}</b><span>مدل و قطعه در کاتالوگ</span></div>
</div></div>
<section><div class="wrap"><span class="eyebrow">دسته‌بندی</span><h2 class="sec">محصولات سهند لیزر</h2><p class="lead">یک دسته را انتخاب کنید.</p>
<div class="grid">{cat_cards}</div></div></section>
<section class="alt"><div class="wrap"><span class="eyebrow">خدمات</span><h2 class="sec">از تحلیل نیاز تا پشتیبانی</h2><p class="lead">همراهی کامل در تمام مراحل پروژه.</p>
<div class="grid">{svc_cards}</div><p style="margin-top:24px"><a class="btn btn-dark" href="services.html">همه خدمات</a></p></div></section>
<section><div class="wrap"><div class="cta"><div><h2>راهکار مناسب کسب‌وکار خود را بگیرید</h2><p>نیاز فنی خود را بنویسید؛ کارشناسان ما بررسی و پاسخ می‌دهند.</p></div>
<div><a class="btn btn-primary" href="contact.html">شروع استعلام</a> <a class="btn btn-wa" href="https://wa.me/{WA}" target="_blank" rel="noopener noreferrer">واتساپ</a></div></div></div></section>'''
page('index.html','خانه','home',home,'سهند لیزر — دستگاه‌های برش، جوش، مارکینگ و تمیزکاری لیزر فایبر، قطعات و خدمات فنی')

# ---------- PRODUCTS LIST ----------
chips = '<button class="chip on" data-cat="all">همه</button>' + ''.join(f'<button class="chip" data-cat="{c}">{E(CATS[c])}</button>' for c in CAT_ORDER)
prod_list = f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">کاتالوگ</span><h1 class="sec" style="font-size:2rem">محصولات و تجهیزات</h1>
<p class="lead">مشخصات دقیق هر پیکربندی هنگام استعلام تأیید می‌شود.</p>
<div class="toolbar"><input type="search" id="q" placeholder="جستجوی نام دستگاه، قطعه یا کد…" aria-label="جستجو"></div>
<div class="chips" id="chips">{chips}</div><div class="count" id="count"></div>
<div class="grid" id="plist">{''.join(card_product(i) for i in ITEMS)}</div></div>'''
page('products.html','محصولات','products',prod_list+'<div style="height:40px"></div>','کاتالوگ محصولات لیزر سهند')

# ---------- PRODUCT DETAILS ----------
for it in ITEMS:
    related = [x for x in ITEMS if x['cat']==it['cat'] and x['code']!=it['code']][:3]
    rel = ''.join(card_product(x,'../') for x in related)
    ICO = svg(ICONS.get(it['cat'],''),'')
    body = f'''<div class="wrap" style="padding-top:20px">
<div class="crumb"><a href="../index.html">خانه</a> / <a href="../products.html">محصولات</a> / <a href="../products.html?cat={it['cat']}">{E(cat_label(it['cat']))}</a> / {E(it['code'])}</div>
<div class="detail"><div class="big">{ICO}</div>
<div><span class="tag">{E(cat_label(it['cat']))}</span><h1>{E(it['title'])}</h1><div class="en" style="direction:ltr;text-align:left;color:var(--muted)">{E(it.get('sub',''))}</div>
<p style="margin-top:14px">{E(it.get('desc',''))}</p>
<div class="note">مشخصات و پیکربندی نهایی با کارشناسان فنی تأیید می‌شود.</div>
<p><b>کد محصول:</b> <span dir="ltr">{E(it['code'])}</span></p>
<div class="actions" style="margin-top:18px"><a class="btn btn-primary" href="../contact.html?p={E(it['code'])}">استعلام این مدل</a>
<a class="btn btn-wa" href="https://wa.me/{WA}?text={E(it['title'])}" target="_blank" rel="noopener noreferrer">واتساپ</a></div>
</div></div>
{'<h2 class="sec" style="margin-top:50px">مدل‌های مرتبط</h2><div class="grid" style="margin-top:18px">'+rel+'</div>' if rel else ''}
</div><div style="height:40px"></div>'''
    page(f"products/{it['code']}.html", it['title'], 'products', body, it.get('desc',''))

# ---------- SERVICES ----------
svc = ''.join(f'''<div class="card"><div class="ico">{svg(SVC_ICON)}</div><h3>{E(s['title'])}</h3><div class="en">{E(s.get('en',''))}</div><p>{E(s['desc'])}</p></div>''' for s in D['services'])
steps = ['مشاوره و تحلیل نیاز','طراحی یا انتخاب دستگاه','نصب، کالیبراسیون و تست','آموزش اپراتور و تحویل']
page('services.html','خدمات','services',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">خدمات</span><h1 class="sec" style="font-size:2rem">خدمات تخصصی سهند لیزر</h1><p class="lead">از تحلیل نیاز تا پشتیبانی پس از فروش.</p>
<div class="grid">{svc}</div>
<h2 class="sec" style="margin-top:50px">روند همکاری</h2><div class="steps" style="margin-top:24px">{''.join(f'<div class="step">{s}</div>' for s in steps)}</div>
<div class="cta"><div><h2>نیاز به خدمات فنی دارید؟</h2><p>دستگاه خود را معرفی کنید تا بررسی شود.</p></div><a class="btn btn-primary" href="contact.html">ثبت درخواست</a></div></div><div style="height:30px"></div>''','خدمات سهند لیزر')

# ---------- DOWNLOADS ----------
dl = ''
for g in D['downloads']:
    rows = ''
    for it in g['items']:
        link = f'<a class="pill" href="{E(it["url"])}" target="_blank" rel="noopener noreferrer">دانلود</a>' if it.get('url') else '<span class="pill off">به‌زودی</span>'
        rows += f'<tr><td>{E(it["name"])}</td><td class="ltr">{E(it.get("version") or "—")}</td><td>{E(it.get("size") or "—")}</td><td>{link}</td></tr>'
    ic = svg(SVC_ICON,'ds-ico')
    dl += '<h2 class="sec" style="font-size:1.25rem;margin-top:30px">' + ic + E(g['title']) + '</h2>'
    dl += f'<table class="dl"><thead><tr><th>نام</th><th>نسخه</th><th>حجم</th><th>دانلود</th></tr></thead><tbody>{rows}</tbody></table>'
page('downloads.html','دانلود','downloads',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">مرکز دانلود</span><h1 class="sec" style="font-size:2rem">نرم‌افزار و درایور</h1>
<p class="lead">پیش از نصب نسخه جدید، سازگاری آن با کنترلر و سخت‌افزار دستگاه را بررسی کنید.</p>{dl}</div><div style="height:30px"></div>''','دانلود نرم‌افزار سهند لیزر')

# ---------- ABOUT ----------
page('about.html','درباره ما','about',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">درباره ما</span><h1 class="sec" style="font-size:2rem">فناوران پرتو لیزر سهند</h1>
<div class="about-split" style="margin-top:20px"><div>
<p>شرکت فناوران پرتو لیزر سهند، با مسئولیت محدود و شماره ثبت ۴۶۲۵۶، از سال ۱۳۹۰ در زمینه طراحی، تولید و تجاری‌سازی فناوری‌های لیزر فعالیت دارد.</p>
<p>حوزه فعالیت شرکت شامل تجهیزات صنعتی برش، جوش، حکاکی/مارکینگ و تمیزکاری لیزر، تجهیزات آزمایشگاهی و همچنین تعمیرات تخصصی سورس، هد و دستگاه است.</p>
<p>ما معتقدیم یک شرکت لیزر تنها فروشنده دستگاه نیست؛ باید در تمام مراحل کنار مشتری باشد: از تحلیل رایگان نیاز تا آموزش و خدمات پس از فروش.</p>
<p><b>آدرس:</b> اصفهان، خیابان خیام، خیابان عطاءالملک، بلوک ۲۴، پلاک ۳۳</p></div>
<div><h3>مسیر ما</h3><ul class="timeline">
<li><b>۱۳۹۰</b><br>تأسیس شرکت</li><li><b>۱۳۹۵</b><br>توسعه خط تولید</li><li><b>۱۴۰۰</b><br>ثبت ۴ اختراع ملی</li><li><b>۱۴۰۳</b><br>توسعه پروژه‌های صنعتی و بیش از ۱۵۰ نصب</li></ul></div></div></div>
<div style="height:40px"></div>''','درباره سهند لیزر')

# ---------- GALLERY ----------
page('gallery.html','گالری','gallery',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">گالری</span><h1 class="sec" style="font-size:2rem">تصاویر پروژه‌ها</h1>
<p class="lead">تصاویر پروژه‌ها و بازدید مشتریان در این بخش نمایش داده می‌شوند.</p>
<div class="empty-gallery">{svg('<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>','').replace('<svg','<svg style="width:56px;height:56px;stroke:#94a3b8;fill:none;stroke-width:1.5;margin-bottom:10px"')}<br>به‌زودی تصاویر پروژه‌ها اضافه می‌شوند.<br><small>تصاویر را در پوشه <span dir="ltr">assets/gallery/</span> قرار دهید.</small></div></div><div style="height:40px"></div>''','گالری سهند لیزر')

# ---------- CONTACT ----------
def crow(p): return f'<div class="crow"><small>{E(p["label"])} — {E(p["name"])}</small><a href="tel:+{p["phone"]}">+{p["phone"]}</a></div>'
C = {'sales':[{'name':'آقای ابطحی','label':'فروش','phone':'989133862673'},{'name':'آقای بلیغ','label':'فروش','phone':'989125855548'}],
 'support':[{'name':'آقای بهرامی و اخلاقی','label':'خدمات و پشتیبانی دستگاه','phone':'989198023032'},{'name':'آقای شیری','label':'برش لیزر','phone':'989131863032'}],
 'finance':[{'name':'خانم زمانی','label':'حسابداری','phone':'989137353032'}]}
page('contact.html','تماس','contact',f'''<div class="wrap" style="padding-top:40px"><span class="eyebrow">تماس</span><h1 class="sec" style="font-size:2rem">استعلام و مشاوره</h1>
<p class="lead">فرم را تکمیل کنید؛ پیام با واتساپ برای کارشناسان ارسال می‌شود.</p>
<form class="inq" id="inq">
<div><label for="n">نام و نام خانوادگی</label><input id="n" name="name" required autocomplete="name"></div>
<div><label for="c">شماره موبایل یا ایمیل</label><input id="c" name="contact" required dir="ltr" placeholder="09xxxxxxxxx"></div>
<div><label for="t">نوع نیاز</label><select id="t" name="type"><option>برش لیزر</option><option>جوش لیزر</option><option>مارکینگ / حکاکی</option><option>تمیزکاری لیزر</option><option>سورس، هد یا قطعات</option><option>تعمیر و پشتیبانی</option><option>آموزش</option></select></div>
<div><label for="i">صنعت / کاربرد</label><input id="i" name="industry"></div>
<div class="full"><label for="m">توضیحات (جنس قطعه، ضخامت، ابعاد ورق، تیراژ)</label><textarea id="m" name="message"></textarea></div>
<div class="full actions"><button type="button" class="btn btn-wa" data-ch="wa">ارسال از طریق واتساپ</button><button type="button" class="btn btn-tg" data-ch="copy">کپی متن برای ایتا / بله</button></div>
</form>
<h2 class="sec" style="margin-top:50px">شماره‌های تماس</h2>
<div class="contacts" style="margin-top:18px">
<div class="card cbox"><h3>فروش</h3>{''.join(crow(p) for p in C['sales'])}</div>
<div class="card cbox"><h3>پشتیبانی</h3>{''.join(crow(p) for p in C['support'])}</div>
<div class="card cbox"><h3>حسابداری</h3>{''.join(crow(p) for p in C['finance'])}</div></div></div><div style="height:40px"></div>''','تماس با سهند لیزر')
print('pages built:', 8 + len(ITEMS))
