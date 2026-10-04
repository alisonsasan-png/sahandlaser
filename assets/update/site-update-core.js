/* Sahand Laser — 2026-10-03 preservation-first content patch
   Loaded only by preview-2026-10-03.html until final approval. */
(function(){
'use strict';
const UPDATE={
  banner:'https://sahandlaser.com/wp-content/uploads/2025/08/first-baner-1_807400.jpg',
  ct001:'https://sahandlaser.com/wp-content/uploads/2025/06/Single-table-laser-cutting-machine-3015-1.png',
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
  three.innerHTML=`<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4"><div><div class="inline-flex items-center gap-2 text-accent font-bold text-sm mb-1"><i class="fa-solid fa-cube"></i><span>3D LIVE</span></div><h3 class="text-xl font-extrabold text-brand dark:text-white">مدل سه‌بعدی تعاملی دستگاه</h3><p class="text-sm text-slate-600 dark:text-slate-300 mt-1">با موس بکشید تا دستگاه بچرخد؛ با چرخ موس زوم کنید.</p></div><div class="shrink-0 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-sm"><i class="fa-solid fa-circle-check ml-2"></i>فعال</div></div>
  <div id="sahand-live3d" class="sahand-live3d" aria-label="Interactive 3D visual model">
    <svg viewBox="0 0 900 520" role="img">
      <ellipse class="m3-shadow" cx="455" cy="430" rx="330" ry="45"/>
      <g id="sahand-model3d">
        <polygon class="m3-dark" points="145,330 625,330 770,270 292,270"/>
        <polygon class="m3-blue" points="145,330 625,330 625,390 145,390"/>
        <polygon class="m3-blue2" points="625,330 770,270 770,330 625,390"/>
        <polygon class="m3-blue2" points="145,330 292,270 770,270 625,330"/>
        <polygon class="m3-dark" points="215,310 605,310 690,278 302,278"/>
        <g id="sahand-slats"></g>
        <polygon class="m3-blue2" points="420,205 485,185 690,235 625,255"/>
        <polygon class="m3-blue" points="420,205 485,185 485,245 420,266"/>
        <polygon class="m3-blue2" points="485,185 690,235 690,294 485,245"/>
        <rect class="m3-dark" x="500" y="205" width="58" height="110" rx="8"/>
        <rect class="m3-metal" x="516" y="250" width="25" height="85" rx="6"/>
        <rect class="m3-head" x="509" y="300" width="40" height="58" rx="8"/>
        <polygon class="m3-nozzle" points="524,358 534,358 531,386 527,386"/>
        <polygon class="m3-metal" points="704,240 748,228 748,370 704,382"/>
        <polygon class="m3-dark" points="718,252 740,247 740,307 718,312"/>
        <text class="m3-label" x="250" y="368">SAHAND LASER</text>
      </g>
    </svg>
  </div>
  <div class="sahand-3d-controls"><button class="sahand-3d-btn" id="m3-left">↺ چرخش چپ</button><button class="sahand-3d-btn" id="m3-reset">نمای اصلی</button><button class="sahand-3d-btn" id="m3-right">چرخش راست ↻</button><span class="text-xs text-slate-500 self-center mr-2">مدل بصری بر اساس فایل FreeCAD فعلی؛ نقشه ساخت تأییدشده نیست.</span></div>`;
  media.parentNode.insertBefore(three,media.nextSibling);
  initLive3D();
}


function initLive3D(){
  const box=document.getElementById('sahand-live3d');
  if(!box) return;
  if(window.SahandCT0103D && window.THREE){
    try{ box.__sahand3d?.destroy?.(); }catch(e){}
    window.SahandCT0103D.mount(box);
    document.getElementById('m3-left')?.addEventListener('click',()=>box.__sahand3d?.left());
    document.getElementById('m3-right')?.addEventListener('click',()=>box.__sahand3d?.right());
    document.getElementById('m3-reset')?.addEventListener('click',()=>box.__sahand3d?.reset());
  }else{
    box.innerHTML='<div class="h-full flex items-center justify-center text-sm font-bold text-slate-500">در حال بارگذاری موتور سه‌بعدی...</div>';
    setTimeout(initLive3D,250);
  }
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
