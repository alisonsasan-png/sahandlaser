const DB_URL='data/product-site-master-v1.json';
const LAYOUT_URL='data/product-page-layout-revisions.json';
let state={db:null,layout:null};

const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const faStatus=s=>({confirmed:'تأییدشده',current_site_confirmed:'تأییدشده',ready_for_review:'آماده بررسی',review:'نیازمند بررسی',pending:'در انتظار تکمیل',visual_reconstruction:'بازسازی بصری',mapped_source_available:'منبع نگاشت‌شده موجود',partial:'ناقص'}[s]||s||'نامشخص');
const statusClass=s=>String(s||'').includes('confirmed')?'good':(String(s||'').includes('pending')||String(s||'').includes('review')?'warn':'');

async function loadData(){
  const [dbRes,layoutRes]=await Promise.all([fetch(DB_URL,{cache:'no-store'}),fetch(LAYOUT_URL,{cache:'no-store'})]);
  if(!dbRes.ok) throw new Error('فایل اصلی محصولات خوانده نشد.');
  if(!layoutRes.ok) throw new Error('فایل چیدمان صفحه محصول خوانده نشد.');
  state.db=await dbRes.json();
  state.layout=await layoutRes.json();
  renderProducts();
  $('#db-status').textContent=`دیتابیس بارگذاری شد — نسخه منبع: ${state.db.source_master||'ثبت نشده'} — سیاست: بدون حدس و فقط داده ثبت‌شده.`;
  route();
}

function renderProducts(){
  const products=state.db?.products||{};
  const entries=Object.entries(products);
  $('#product-count').textContent=`${entries.length} رکورد محصول در دیتابیس`;
  $('#product-grid').innerHTML=entries.map(([id,p])=>`
    <article class="product-card">
      <span class="eyebrow">${esc(id)}</span>
      <h3>${esc(p.title?.fa||p.model||id)}</h3>
      <p>${esc(p.configuration_fa||'')}</p>
      <div class="meta">
        <span class="tag ${statusClass(p.identity_status)}">هویت: ${esc(faStatus(p.identity_status))}</span>
        <span class="tag ${statusClass(p.specs_status)}">مشخصات: ${esc(faStatus(p.specs_status))}</span>
      </div>
      <a href="#product=${encodeURIComponent(id)}">مشاهده صفحه محصول ←</a>
    </article>`).join('');
}

function sectionState(title,status,extra=''){
  return `<section class="detail-section"><span class="eyebrow">PRODUCT ASSET</span><h3>${esc(title)}</h3><p class="state-note">وضعیت دیتابیس: <strong>${esc(faStatus(status))}</strong>${extra?` — ${esc(extra)}`:''}</p></section>`;
}

function renderDetail(id){
  const p=state.db?.products?.[id];
  if(!p){
    $('#detail-root').innerHTML='<div class="error">این شناسه محصول در دیتابیس پیدا نشد.</div>';
    return;
  }
  const a=p.assets||{};
  const layout=state.layout?.records?.[0]?.layout;
  const frameCount=layout?.top_section?.frame_count||12;
  const galleryStatus=p.media?.gallery_status||'pending';
  $('#detail-root').innerHTML=`
    <div class="detail-hero">
      <div class="visual-box">
        <div class="visual-placeholder">
          <span class="eyebrow">INTERACTIVE 360</span>
          <strong>${esc(frameCount)} فریم / کنترل با ماوس و لمس</strong>
          <p class="muted">این ساختار صفحه از نسخه اصلاح‌شده ثبت‌شده در دیتابیس آمده است. فایل‌های 360 فقط وقتی به این محصول متصل می‌شوند که نگاشت محصول قطعی باشد.</p>
          <span class="tag ${statusClass(a.view_360?.status)}">وضعیت: ${esc(faStatus(a.view_360?.status))}</span>
        </div>
      </div>
      <aside class="info-box">
        <span class="eyebrow">${esc(id)}</span>
        <h2>${esc(p.title?.fa||p.model||id)}</h2>
        <p class="muted">${esc(p.configuration_fa||'')}</p>
        <div class="spec-list">
          <div class="spec-row"><span>مدل</span><strong>${esc(p.model||'در انتظار تأیید')}</strong></div>
          <div class="spec-row"><span>هویت</span><strong>${esc(faStatus(p.identity_status))}</strong></div>
          <div class="spec-row"><span>مشخصات</span><strong>${esc(faStatus(p.specs_status))}</strong></div>
          <div class="spec-row"><span>وضعیت ورود</span><strong>${esc(faStatus(p.site_import_status))}</strong></div>
        </div>
      </aside>
    </div>
    <div class="detail-stack">
      ${sectionState('نقشه فنی و ابعادی',a.technical_drawing?.status,'نمایش بزرگ و مستقل')}
      ${sectionState('نمای انفجاری',a.exploded_view?.status,'نمایش بزرگ و مستقل')}
      ${sectionState('مدل سه‌بعدی تعاملی',a.three_d?.status,'بازسازی بصری به‌معنای CAD تأییدشده نیست')}
      ${sectionState('نمونه‌کارهای این دستگاه',galleryStatus,'فقط مدیای تأییدشده؛ بدون گالری تکراری')}
    </div>`;
}

function route(){
  const hash=location.hash.replace(/^#/,'');
  if(hash.startsWith('product=')){
    const id=decodeURIComponent(hash.slice(8));
    $('#product-detail').hidden=false;
    renderDetail(id);
    $('#product-detail').scrollIntoView({behavior:'smooth',block:'start'});
  }else{
    $('#product-detail').hidden=true;
  }
}

$('#back-to-products').addEventListener('click',()=>{location.hash='products';$('#products').scrollIntoView({behavior:'smooth'});});
window.addEventListener('hashchange',route);
loadData().catch(err=>{
  $('#product-grid').innerHTML=`<div class="error">${esc(err.message)}</div>`;
  $('#db-status').textContent='خطا در خواندن دیتابیس';
});
