/* Shared presentation runtime for Preview 58–70. It never changes Preview 57. */
(function(){
'use strict';
const meta=document.querySelector('meta[name="preview-variant"]');
const v=Number(meta?.content||document.body?.dataset.variant||58);
const configs={
58:{name:'Minimal Industrial',kicker:'PRECISION / SIMPLICITY',note:'Clean industrial discovery with generous space.',mode:'minimal'},
59:{name:'Premium Corporate',kicker:'ENGINEERED FOR TRUST',note:'A refined B2B manufacturer presentation.',mode:'premium'},
60:{name:'Modern Technology',kicker:'LASER SYSTEMS / NEXT',note:'A contemporary technical interface for modern production.',mode:'tech'},
61:{name:'Engineering Focused',kicker:'TECHNICAL CONTROL ROOM',note:'Specifications and dimensional evidence come first.',mode:'engineering'},
62:{name:'Product First',kicker:'FIND THE RIGHT MACHINE',note:'A product-led path from category to inquiry.',mode:'product'},
63:{name:'Catalog Style',kicker:'INDUSTRIAL CATALOG',note:'A structured taxonomy for technical buyers.',mode:'catalog'},
64:{name:'Clean European Industrial',kicker:'FORM / FUNCTION / SERVICE',note:'Restrained, precise and quietly confident.',mode:'european'},
65:{name:'High-Tech Dark',kicker:'INDUSTRIAL INTELLIGENCE',note:'A serious dark interface for high-performance equipment.',mode:'dark'},
66:{name:'Light Technical',kicker:'CLEAR TECHNICAL DATA',note:'Bright surfaces and readable engineering information.',mode:'lighttech'},
67:{name:'Visual Product Photography',kicker:'SEE THE MACHINE',note:'Product imagery leads the discovery journey.',mode:'visual'},
68:{name:'Conversion Focused',kicker:'FROM MACHINE TO QUOTE',note:'A clear route from product confidence to contact.',mode:'conversion'},
69:{name:'Information-Dense Professional',kicker:'DECISION SUPPORT',note:'Dense, organized information for technical purchasing.',mode:'dense'},
70:{name:'Recommended Final Direction',kicker:'SAHAND LASER / MASTER DIRECTION',note:'Balanced product clarity, technical trust and B2B action.',mode:'best'}
};
const cfg=configs[v]||configs[58];
document.documentElement.dataset.previewVariant=String(v);
document.body.dataset.variant=String(v);
document.body.classList.add('variant-'+cfg.mode);
const style=document.createElement('style');
style.textContent=`
:root{--v-accent:#b42318;--v-ink:#172554;--v-paper:#f8fafc;--v-muted:#64748b;--v-line:#dbe4ef}
body{overflow-x:hidden}
.variant-banner{max-width:1360px;margin:24px auto 0;padding:clamp(20px,4vw,52px);border:1px solid var(--v-line);background:var(--v-paper);position:relative;overflow:hidden}
.variant-banner:before{content:"";position:absolute;inset:0 auto 0 0;width:5px;background:var(--v-accent)}
.variant-banner .v-kicker{display:block;color:var(--v-accent);font:700 11px/1.4 ui-monospace,monospace;letter-spacing:.16em}
.variant-banner h1{margin:10px 0 6px;font-size:clamp(28px,5vw,62px);line-height:1.05;letter-spacing:-.04em}
.variant-banner p{margin:0;color:var(--v-muted);max-width:680px}
.variant-banner .v-index{position:absolute;inset-block-start:20px;inset-inline-end:24px;color:var(--v-accent);font:800 clamp(32px,7vw,90px)/1 ui-monospace,monospace;opacity:.13}
.variant-banner .v-links{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}
.variant-banner a{display:inline-flex;min-height:44px;align-items:center;padding:10px 16px;border-radius:9px;background:var(--v-ink);color:#fff!important;text-decoration:none;font-weight:700}
.variant-banner a.secondary{background:transparent;color:var(--v-ink)!important;border:1px solid var(--v-line)}
.variant-cta{max-width:1360px;margin:26px auto;padding:16px 22px;display:flex;align-items:center;justify-content:space-between;gap:14px;background:var(--v-ink);color:#fff;border-radius:12px}
.variant-cta a{color:#fff!important;background:var(--v-accent);padding:10px 16px;border-radius:8px;white-space:nowrap}
#preview56-catalog{margin-top:32px}
#preview56-catalog .p56-cards{gap:20px}
#preview56-catalog .p56-card,#preview56-catalog .p56-sheet{transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}
#preview56-catalog .p56-card:hover,#preview56-catalog .p56-sheet:hover{transform:translateY(-4px);border-color:var(--v-accent)}
.p56-product-xray{order:3}
.lab-dimensional{order:2}
@media(max-width:700px){.variant-banner{margin:14px 12px 0}.variant-banner .v-index{inset-inline-end:14px}.variant-cta{margin:18px 12px;display:block}.variant-cta a{display:inline-block;margin-top:10px}}
body.variant-minimal{--v-accent:#0f766e;--v-ink:#12343b;--v-paper:#fff}
body.variant-minimal .variant-banner{background:#fff;border-width:0 0 1px;border-radius:0;padding-inline:0}
body.variant-minimal #preview56-catalog{box-shadow:none;border-radius:0;background:#fff}
body.variant-minimal #preview56-catalog .p56-cards{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
body.variant-premium{--v-accent:#b28a45;--v-ink:#1f2937;--v-paper:#fbf8f1}
body.variant-premium .variant-banner{border-radius:2px;background:linear-gradient(120deg,#fbf8f1,#fff)}
body.variant-premium .variant-banner h1{font-family:Georgia,serif;font-weight:500}
body.variant-premium #preview56-catalog{border-radius:2px;box-shadow:0 20px 50px #1f293714}
body.variant-tech{--v-accent:#00a6c7;--v-ink:#082f49;--v-paper:#edfaff}
body.variant-tech .variant-banner{background:#082f49;color:#e6faff;border-color:#0e7490;clip-path:polygon(0 0,98% 0,100% 82%,96% 100%,0 100%)}
body.variant-tech .variant-banner p{color:#b8e5ee}
body.variant-tech #preview56-catalog{background:#f0fbff;border-color:#8ed7e5}
body.variant-tech #preview56-catalog .p56-card{border-radius:4px;box-shadow:0 0 0 1px #00a6c733}
body.variant-engineering{--v-accent:#d97706;--v-ink:#172033;--v-paper:#f2f5f7}
body.variant-engineering .variant-banner{background:#172033;color:#f8fafc;border:0}
body.variant-engineering .variant-banner p{color:#cbd5e1}
body.variant-engineering #preview56-catalog{border-radius:4px}
body.variant-engineering #preview56-catalog .p56-card h3,body.variant-engineering .lab-product-extra h2,body.variant-engineering table{font-family:ui-monospace,monospace}
body.variant-product{--v-accent:#dc2626;--v-ink:#111827;--v-paper:#fff}
body.variant-product .variant-banner{padding-block:26px;background:#fff;border:0}
body.variant-product #preview56-catalog{margin-top:12px}
body.variant-product #preview56-catalog .p56-cards{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
body.variant-product #preview56-catalog .p56-card-pair img{aspect-ratio:1.2}
body.variant-catalog{--v-accent:#2563eb;--v-ink:#172554;--v-paper:#f1f5f9}
body.variant-catalog .variant-banner{border-radius:18px}
body.variant-catalog #preview56-catalog{display:grid;grid-template-columns:180px 1fr;gap:22px}
body.variant-catalog #preview56-catalog .p56-head,body.variant-catalog #preview56-catalog .p56-search,body.variant-catalog #preview56-catalog .p56-cards,body.variant-catalog #preview56-catalog .p56-sheets{grid-column:2}
body.variant-catalog #preview56-catalog:before{content:"CATALOG\A CUTTING\A WELDING\A MARKING\A CLEANING\A SOURCES\A COMPONENTS";white-space:pre;grid-column:1;grid-row:1 / span 4;padding:18px;background:#172554;color:#dbeafe;border-radius:12px;font:700 12px/3 ui-monospace,monospace}
@media(max-width:800px){body.variant-catalog #preview56-catalog{display:block}body.variant-catalog #preview56-catalog:before{display:none}}
body.variant-european{--v-accent:#334155;--v-ink:#0f172a;--v-paper:#fff}
body.variant-european .variant-banner{border-radius:0;background:#fff;border-inline:0;padding-inline:0}
body.variant-european #preview56-catalog{background:#fff;border-radius:0;box-shadow:none}
body.variant-european #preview56-catalog .p56-card{border-radius:0;box-shadow:none}
body.variant-dark{--v-accent:#2dd4bf;--v-ink:#e2e8f0;--v-paper:#0b1220;--v-line:#294154}
body.variant-dark,.variant-dark .variant-banner{background:#080f1b;color:#e2e8f0}
body.variant-dark .variant-banner p{color:#94a3b8}
body.variant-dark #preview56-catalog{background:#0b1220;color:#e2e8f0;border-color:#294154}
body.variant-dark #preview56-catalog .p56-card,body.variant-dark #preview56-catalog .p56-sheet{background:#101b2d;border-color:#294154;color:#e2e8f0}
body.variant-dark #preview56-catalog .p56-card small,body.variant-dark #preview56-catalog p{color:#94a3b8}
body.variant-lighttech{--v-accent:#0284c7;--v-ink:#075985;--v-paper:#eff6ff}
body.variant-lighttech .variant-banner{background:#eff6ff;border-color:#bae6fd}
body.variant-lighttech #preview56-catalog{background:#fff;border-color:#bae6fd}
body.variant-lighttech #preview56-catalog .p56-card{box-shadow:0 6px 20px #0369a115}
body.variant-visual{--v-accent:#be123c;--v-ink:#3f1d2e;--v-paper:#fff1f2}
body.variant-visual .variant-banner{min-height:260px;display:flex;flex-direction:column;justify-content:end;background:linear-gradient(120deg,#fff1f2,#fff)}
body.variant-visual #preview56-catalog .p56-cards{grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
body.variant-visual #preview56-catalog .p56-card-pair{grid-template-columns:1fr}
body.variant-visual #preview56-catalog .p56-card-pair>div:nth-child(2){display:none}
body.variant-visual #preview56-catalog .p56-card-pair img{aspect-ratio:16/10}
body.variant-conversion{--v-accent:#ea580c;--v-ink:#1c1917;--v-paper:#fff7ed}
body.variant-conversion .variant-banner{border:0;border-radius:18px;background:#fff7ed}
body.variant-conversion .variant-cta{position:sticky;bottom:12px;z-index:40;box-shadow:0 10px 30px #0003}
body.variant-conversion #preview56-catalog .p56-open{background:#ea580c}
body.variant-dense{--v-accent:#475569;--v-ink:#0f172a;--v-paper:#f1f5f9}
body.variant-dense .variant-banner{padding:22px 28px;border-radius:6px}
body.variant-dense #preview56-catalog{padding:18px;margin-top:14px}
body.variant-dense #preview56-catalog .p56-cards{grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px}
body.variant-dense #preview56-catalog .p56-card h3{font-size:14px}
body.variant-best{--v-accent:#a61c1c;--v-ink:#172856;--v-paper:#f8fafc}
body.variant-best .variant-banner{border-radius:24px;background:linear-gradient(110deg,#f8fafc,#fff)}
body.variant-best #preview56-catalog{box-shadow:0 14px 45px #17285614}
body.variant-best #preview56-catalog .p56-cards{grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`;
document.head.append(style);
const banner=document.createElement('section');
banner.className='variant-banner';
banner.innerHTML='<span class="v-kicker">'+cfg.kicker+'</span><span class="v-index">0'+v+'</span><h1>'+cfg.name+'</h1><p>'+cfg.note+'</p><div class="v-links"><a href="#preview56-catalog">مشاهده محصولات</a><a class="secondary" href="#contact">تماس با سهند لیزر</a></div>';
const main=document.querySelector('main');
if(main)main.prepend(banner);else document.body.prepend(banner);
if(cfg.mode==='conversion'||cfg.mode==='best'){
 const cta=document.createElement('div');cta.className='variant-cta';cta.innerHTML='<span>برای انتخاب دستگاه مناسب، مشخصات مدل را با کارشناس سهند لیزر بررسی کنید.</span><a href="https://wa.me/989125855548" target="_blank" rel="noopener">دریافت مشاوره در واتساپ</a>';
 const cat=document.querySelector('#preview56-catalog'); if(cat)cat.before(cta);
}
if(cfg.mode==='catalog'){
 const cat=document.querySelector('#preview56-catalog'); if(cat)cat.setAttribute('aria-label','فهرست ساختاریافته محصولات');
}
})();