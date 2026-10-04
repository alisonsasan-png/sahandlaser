/* Sahand Laser — 2026-10-03 preservation-first content patch
   Loaded only by preview-2026-10-03.html until final approval. */
(function(){
'use strict';
const UPDATE={
  banner:'https://sahandlaser.com/wp-content/uploads/2025/08/first-baner-1_807400.jpg',
  ct001:'https://sahandlaser.com/wp-content/uploads/2025/06/Single-table-laser-cutting-machine-3015-1.png',
  ct003:'https://sahandlaser.com/wp-content/uploads/2025/08/laser-cutting-machine-3015-with-rotary-exchange-1-scaled.png',
  ct004:'https://sahandlaser.com/wp-content/uploads/2025/05/%D9%85%D8%B9%D8%B1%D9%81%DB%8C%D9%85%D8%AD%D8%B5%D9%88%D9%84_915904.jpg',
  ct002:[
    'https://sahandlaser.com/wp-content/uploads/2025/05/%D8%AF%D8%B3%D8%AA%DA%AF%D8%A7%D9%87%D8%A8%D8%B1%D8%B4%D9%84%DB%8C%D8%B2%D8%B1%D9%81%D8%A7%DB%8C%D8%A8%D8%B1%D8%AF%D9%88%D9%85%DB%8C%D8%B23015%D8%A7%D8%B3%D8%AA%D8%A7%D9%86%D8%AF%D8%A7%D8%B1%D8%AF_852719.jpg',
    'https://sahandlaser.com/wp-content/uploads/2022/10/S6-2.jpg',
    'https://sahandlaser.com/wp-content/uploads/2022/09/S4-OK.jpg',
    'https://sahandlaser.com/wp-content/uploads/2022/10/S10.jpg',
    'https://sahandlaser.com/wp-content/uploads/2022/10/S3.jpg'
  ],
  ct002Samples:[
    'https://sahandlaser.com/wp-content/uploads/2022/09/SA1-3.jpg',
    'https://sahandlaser.com/wp-content/uploads/2022/09/SA1-4.jpg',
    'https://sahandlaser.com/wp-content/uploads/2022/10/SA1-6.jpg',
    'https://sahandlaser.com/wp-content/uploads/2022/10/SA1-5.jpg',
    'https://sahandlaser.com/wp-content/uploads/2025/06/factory.png-1.jpg'
  ],
  heroImg:window.SAHAND_MEDIA_HERO || "",
  view360:window.SAHAND_MEDIA_360 || "",
  exploded:window.SAHAND_MEDIA_EXPLODED || ""
};

function addStyle(){
  const st=document.createElement('style');
  st.id='sahand-update-2026-10-03-style';
  st.textContent=`
    /* Strong horizontal company timeline */
    @media (min-width:769px){
      .timeline{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:1rem!important;overflow:visible!important;padding:3.4rem .25rem 1rem!important}
      .timeline::before{top:2rem!important;right:5%!important;left:5%!important}
      .timeline-item{min-width:0!important;flex:none!important;width:auto!important}
      .timeline-content{min-height:170px!important}
    }
    @media (max-width:768px){
      .timeline{display:flex!important;overflow-x:auto!important;scroll-snap-type:x mandatory!important}
      .timeline-item{flex:0 0 78vw!important;scroll-snap-align:center!important}
    }
    .sahand-3d-card{border:1px solid rgba(var(--accent),.25);background:linear-gradient(135deg,rgba(var(--accent),.08),rgba(var(--brand),.08));border-radius:1.25rem;padding:1.25rem}
    .sahand-live3d{height:520px;border-radius:1rem;overflow:hidden;background:radial-gradient(circle at 50% 35%,#eef5ff,#dce7f5);position:relative;touch-action:none;cursor:grab}
    .dark .sahand-live3d{background:radial-gradient(circle at 50% 35%,#172554,#020617)}
    .sahand-live3d:active{cursor:grabbing}
    .sahand-live3d svg{width:100%;height:100%;display:block}
    .sahand-live3d .m3-shadow{fill:#000;opacity:.16}
    .sahand-live3d .m3-blue{fill:#1261a0;stroke:#073b66;stroke-width:2}
    .sahand-live3d .m3-blue2{fill:#1976b9;stroke:#073b66;stroke-width:2}
    .sahand-live3d .m3-dark{fill:#17212b;stroke:#07111b;stroke-width:2}
    .sahand-live3d .m3-metal{fill:#b8c2cc;stroke:#52606d;stroke-width:1.5}
    .sahand-live3d .m3-slat{stroke:#263746;stroke-width:2}
    .sahand-live3d .m3-head{fill:#d6dee5;stroke:#34495e;stroke-width:2}
    .sahand-live3d .m3-nozzle{fill:#b91c1c}
    .sahand-live3d .m3-label{fill:#fff;font:bold 22px Arial,sans-serif;letter-spacing:1px}
    .sahand-3d-controls{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem}
    .sahand-3d-btn{border:1px solid #cbd5e1;border-radius:.7rem;padding:.45rem .75rem;font-weight:800;font-size:.78rem;background:#fff;color:#1e293b}
    .dark .sahand-3d-btn{background:#0f172a;color:#fff;border-color:#334155}
    @media(max-width:768px){.sahand-live3d{height:380px}}
    .sahand-media-card{border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;background:#fff}
    .dark .sahand-media-card{border-color:#334155;background:#0f172a}
    .sahand-media-card img{display:block;width:100%;height:230px;object-fit:contain;background:#f8fafc}
    .dark .sahand-media-card img{background:#020617}
    .sahand-media-label{padding:.75rem 1rem;font-size:.82rem;font-weight:800;color:rgb(var(--brand))}
    .dark .sahand-media-label{color:#fff}
    .hero-slide:first-child .sahand-current-banner-overlay{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.24;pointer-events:none}
  `;
  document.head.appendChild(st);
}

function applyBanner(){
  const slide=document.querySelector('#view-home .hero-slide');
  if(!slide || slide.querySelector('.sahand-current-banner-overlay')) return;
  const bg=document.createElement('div');
  bg.className='sahand-current-banner-overlay';
  bg.style.backgroundImage=`url("${UPDATE.banner}")`;
  slide.insertBefore(bg,slide.firstChild);
}

function patchData(){
  if(typeof products==='undefined' || typeof cats==='undefined') return false;
  if(products['CT-001']) products['CT-001'].images=[UPDATE.ct001];
  if(products['CT-003']) products['CT-003'].images=[UPDATE.ct003];
  if(products['CT-004']) products['CT-004'].images=[UPDATE.ct004];
  if(products['CT-002']){
    products['CT-002'].images=UPDATE.ct002.slice();
    products['CT-002'].gallery=UPDATE.ct002Samples.slice();
  }
  if(!products['CT-010']){
    const base=JSON.parse(JSON.stringify(products['CT-001']||{}));
    base.code='CT-010'; base.categoryId='cutting';
    base.cat={fa:'دستگاه‌های برش',en:'Laser Cutting',ar:'آلات القطع بالليزر',tr:'Lazer Kesim'};
    base.badge={fa:'محصول جدید — مدل در حال تأیید',en:'New product — model pending',ar:'منتج جديد — الموديل قيد التأكيد',tr:'Yeni ürün — model onayı bekleniyor'};
    base.title={fa:'دستگاه برش لیزر فایبر سهند — مدل در حال تأیید',en:'Sahand Fiber Laser Cutting Machine — Model Pending Confirmation',ar:'ماكينة قطع فايبر ليزر سهند — الموديل قيد التأكيد',tr:'Sahand Fiber Lazer Kesim Makinesi — Model Onayı Bekleniyor'};
    base.subtitle={fa:'CNC Fiber Laser Cutting — صفحه محصول در حال تکمیل',en:'CNC Fiber Laser Cutting — product page in progress',ar:'CNC Fiber Laser Cutting — صفحة المنتج قيد الاستكمال',tr:'CNC Fiber Laser Cutting — ürün sayfası hazırlanıyor'};
    base.images=[UPDATE.heroImg];
    base.gallery=[UPDATE.view360,UPDATE.exploded];
    base.advantages=[
      {icon:'fa-image',label:{fa:'تصویر اصلی',en:'Hero image',ar:'الصورة الرئيسية',tr:'Ana görsel'},value:'Commercial render'},
      {icon:'fa-arrows-rotate',label:{fa:'نمای ۳۶۰ درجه',en:'360° view',ar:'عرض 360°',tr:'360° görünüm'},value:'Visual 360°'},
      {icon:'fa-cubes-stacked',label:{fa:'نمای انفجاری',en:'Exploded view',ar:'منظور تفجيري',tr:'Patlatılmış görünüm'},value:'Exploded view'}
    ];
    base.specs=[
      {label:{fa:'دسته محصول',en:'Product category',ar:'فئة المنتج',tr:'Ürün kategorisi'},value:'Fiber Laser Cutting'},
      {label:{fa:'برند روی دستگاه',en:'Machine branding',ar:'العلامة على الجهاز',tr:'Makine markalaması'},value:'SAHAND LASER'},
      {label:{fa:'مدل تجاری',en:'Commercial model',ar:'الموديل التجاري',tr:'Ticari model'},value:'نیازمند تأیید / Pending confirmation'},
      {label:{fa:'وضعیت مشخصات',en:'Specification status',ar:'حالة المواصفات',tr:'Teknik özellik durumu'},value:'مشخصات فنی نهایی پس از تأیید مدل ثبت می‌شود'}
    ];
    base.usage=[
      {icon:'fa-industry',color:'blue',title:{fa:'برش صنعتی فلزات',en:'Industrial metal cutting',ar:'قطع المعادن الصناعي',tr:'Endüstriyel metal kesim'},desc:{fa:'کاربرد دقیق بر اساس کانفیگ نهایی دستگاه ثبت خواهد شد.',en:'Final applications depend on the confirmed configuration.',ar:'يعتمد الاستخدام النهائي على التجهيز المؤكد.',tr:'Nihai kullanım doğrulanmış konfigürasyona bağlıdır.'}}
    ];
    base.models=[];
    base.description={
      fa:['این محصول بر اساس تصاویر واقعی دستگاه سهند لیزر به بانک محصولات اضافه شده است.','برای جلوگیری از ثبت اطلاعات اشتباه، مدل تجاری، توان سورس و مشخصات فنی تا زمان تأیید نهایی با حدس تکمیل نمی‌شوند.'],
      en:['This product was added from real Sahand Laser machine references.','Commercial model and technical specifications remain pending confirmation rather than being guessed.'],
      ar:['تمت إضافة هذا المنتج بالاعتماد على صور حقيقية لجهاز سهند ليزر.','لن يتم تخمين الموديل أو المواصفات الفنية قبل التأكيد النهائي.'],
      tr:['Bu ürün gerçek Sahand Laser makine görsellerine dayanarak eklendi.','Ticari model ve teknik özellikler doğrulanmadan tahmin edilmeyecektir.']
    };
    products['CT-010']=base;
  }
  const cutting=cats.find(c=>c.id==='cutting');
  if(cutting) cutting.count=String(Object.values(products).filter(p=>p.categoryId==='cutting').length);
  return true;
}

function mediaLabel(key){
  const L=(typeof currentLang!=='undefined'?currentLang:'fa');
  const d={commercial:{fa:'تصویر تجاری اصلی',en:'Primary commercial image',ar:'الصورة التجارية الرئيسية',tr:'Ana ticari görsel'},v360:{fa:'نمای ۳۶۰ درجه',en:'360° presentation',ar:'عرض 360°',tr:'360° görünüm'},exploded:{fa:'نمای انفجاری دستگاه',en:'Exploded view',ar:'المنظور التفجيري',tr:'Patlatılmış görünüm'}};
  return (d[key]&&d[key][L])||d[key].fa;
}

function enhanceNewProduct(){
  if(typeof currentProductId==='undefined' || currentProductId!=='CT-010') return;
  const view=document.getElementById('view-product');
  if(!view) return;
  view.querySelector('#sahand-special-media')?.remove();
  view.querySelector('#sahand-3d-section')?.remove();
  const anchor=document.getElementById('gallery-section') || document.getElementById('comments-list')?.parentElement || view.querySelector('main');
  const media=document.createElement('section'); media.id='sahand-special-media'; media.className='mt-8';
  media.innerHTML=`<h3 class="text-xl font-extrabold text-brand dark:text-white mb-4">${mediaLabel('commercial')} / 360° / Exploded View</h3><div class="grid md:grid-cols-3 gap-4"><div class="sahand-media-card"><img src="${UPDATE.heroImg}" alt="Sahand Laser commercial product view"><div class="sahand-media-label">${mediaLabel('commercial')}</div></div><div class="sahand-media-card"><img src="${UPDATE.view360}" alt="Sahand Laser 360 degree presentation"><div class="sahand-media-label">${mediaLabel('v360')}</div></div><div class="sahand-media-card"><img src="${UPDATE.exploded}" alt="Sahand Laser exploded view"><div class="sahand-media-label">${mediaLabel('exploded')}</div></div></div>`;
  if(anchor?.parentNode) anchor.parentNode.insertBefore(media,anchor.nextSibling);
  const three=document.createElement('section'); three.id='sahand-3d-section'; three.className='mt-6 sahand-3d-card';
  three.innerHTML=`<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"><div><div class="inline-flex items-center gap-2 text-accent font-bold text-sm mb-2"><i class="fa-solid fa-cube"></i><span>3D</span></div><h3 class="text-xl font-extrabold text-brand dark:text-white mb-2">مدل سه‌بعدی دستگاه</h3><p class="text-sm text-slate-600 dark:text-slate-300 leading-7">جایگاه نمایش مدل سه‌بعدی این محصول آماده است. بعد از نهایی شدن طراحی دستگاه، مدل تأییدشده با قابلیت چرخش، زوم و نمایش تعاملی در همین قسمت قرار می‌گیرد.</p></div><div class="shrink-0 px-4 py-2 rounded-xl bg-slate-500/10 text-slate-600 dark:text-slate-300 font-bold text-sm"><i class="fa-solid fa-cube ml-2"></i>مدل سه‌بعدی — به‌زودی</div></div><div class="mt-4 min-h-[220px] rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-center p-6 bg-white/40 dark:bg-slate-950/20"><i class="fa-solid fa-cube text-5xl text-slate-300 dark:text-slate-600 mb-4"></i><div class="font-extrabold text-brand dark:text-white">محل نمایش سه‌بعدی محصول</div><div class="text-xs text-slate-500 mt-2">3D / 360° / Zoom / Exploded View</div></div>`;
  media.parentNode.insertBefore(three,media.nextSibling);
}


function wrapRenderer(){
  if(typeof renderProduct!=='function' || renderProduct.__sahandWrapped) return;
  const original=renderProduct;
  renderProduct=function(id){original(id);setTimeout(enhanceNewProduct,0);};
  renderProduct.__sahandWrapped=true;
}

function refresh(){
  try{ if(typeof renderHomeProducts==='function') renderHomeProducts(); }catch(e){}
  try{ if(typeof renderProductsGrid==='function') renderProductsGrid(); }catch(e){}
  try{ if(typeof renderCatalogFilter==='function') renderCatalogFilter(); }catch(e){}
  try{ if(typeof renderAllProducts==='function') renderAllProducts(); }catch(e){}
  try{ if(typeof currentProductId!=='undefined' && currentProductId && typeof renderProduct==='function') renderProduct(currentProductId); }catch(e){}
}

addStyle(); applyBanner();
if(patchData()){wrapRenderer();refresh();}
else setTimeout(()=>{if(patchData()){wrapRenderer();refresh();}},300);
window.addEventListener('hashchange',()=>setTimeout(()=>{applyBanner();enhanceNewProduct();},50));
})();
