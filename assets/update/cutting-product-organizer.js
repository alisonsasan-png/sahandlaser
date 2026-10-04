/* Sahand Laser — database-first cutting product organizer — 2026-10-04 v2 */
(function(){
'use strict';
const DB_URL='data/product-site-master-v1.json?v=20261004b';
const I18N_URL='assets/update/i18n-completion.js?v=20261004';
let DB=null;
const FALLBACK={
 'CT-001':['SH3015','current','partial'],'CT-002':['SH3015','current','verified'],
 'CT-003':['SH3015R','current','partial'],'CT-004':['SH6020','current','partial'],
 'CT-005':['SH6020','review','pending'],'CT-006':['SH6020R','review','pending'],
 'CT-007':['SH6020R','review','pending'],'CT-008':['SH6020C','review','pending'],
 'CT-009':['QG-6024DZ','source','pending'],'CT-010':['—','pending','reference']
};
const S={
 fa:{title:'پرونده فنی و رسانه‌ای محصول',photos:'عکس و گالری',specs:'مشخصات فنی',v360:'نمای ۳۶۰ درجه',drawing:'نقشه فنی',three:'مدل سه‌بعدی',exploded:'Exploded View',verified:'تأیید شده',partial:'بخشی تأیید شده',current:'ثبت شده',source:'تأیید شده از منبع فنی',review:'نیازمند تطبیق نهایی',reference:'فقط تصویر مرجع',visual:'بازسازی بصری تعاملی',pending:'در انتظار تأیید',rule:'فقط اطلاعات و فایل‌های تأییدشده به این محصول متصل می‌شوند؛ موارد نامشخص تا زمان تأیید خالی می‌مانند.',db:'منبع: بانک اطلاعاتی v1.5'},
 en:{title:'Product Technical & Media File',photos:'Photos & Gallery',specs:'Technical Specifications',v360:'360° View',drawing:'Technical Drawing',three:'3D Model',exploded:'Exploded View',verified:'Verified',partial:'Partially Verified',current:'Recorded',source:'Verified from Technical Source',review:'Needs Final Verification',reference:'Reference Image Only',visual:'Interactive Visual Reconstruction',pending:'Pending Confirmation',rule:'Only verified information and files are attached to this product; unknown items remain empty until confirmed.',db:'Source: synchronized database v1.5'},
 ar:{title:'الملف الفني والإعلامي للمنتج',photos:'الصور والمعرض',specs:'المواصفات الفنية',v360:'عرض 360°',drawing:'الرسم الفني',three:'نموذج ثلاثي الأبعاد',exploded:'منظور تفجيري',verified:'مؤكد',partial:'مؤكد جزئياً',current:'مسجل',source:'مؤكد من مصدر فني',review:'يحتاج إلى تحقق نهائي',reference:'صورة مرجعية فقط',visual:'إعادة بناء بصرية تفاعلية',pending:'بانتظار التأكيد',rule:'يتم ربط المعلومات والملفات المؤكدة فقط بهذا المنتج، وتبقى العناصر غير المعروفة فارغة حتى التأكيد.',db:'المصدر: قاعدة البيانات المتزامنة v1.5'},
 tr:{title:'Ürün Teknik ve Medya Dosyası',photos:'Fotoğraf ve Galeri',specs:'Teknik Özellikler',v360:'360° Görünüm',drawing:'Teknik Çizim',three:'3D Model',exploded:'Patlatılmış Görünüm',verified:'Doğrulandı',partial:'Kısmen Doğrulandı',current:'Kaydedildi',source:'Teknik Kaynaktan Doğrulandı',review:'Son Doğrulama Gerekli',reference:'Yalnızca Referans Görsel',visual:'Etkileşimli Görsel Rekonstrüksiyon',pending:'Onay Bekleniyor',rule:'Bu ürüne yalnızca doğrulanmış bilgi ve dosyalar bağlanır; belirsiz öğeler onaylanana kadar boş kalır.',db:'Kaynak: senkronize veritabanı v1.5'}
};
function lang(){try{return (typeof currentLang!=='undefined'&&currentLang)||document.documentElement.lang||'fa'}catch(e){return'fa'}}
function s(k){return(S[lang()]||S.fa)[k]||S.fa[k]||k}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function style(){
 if(document.getElementById('sahand-cutting-organizer-style'))return;
 const x=document.createElement('style');x.id='sahand-cutting-organizer-style';x.textContent=`
 .sahand-product-file{margin-top:2rem;border:1px solid #e2e8f0;border-radius:1.25rem;padding:1.25rem;background:linear-gradient(135deg,#fff,#f8fafc)}
 .dark .sahand-product-file{border-color:#334155;background:linear-gradient(135deg,#0f172a,#020617)}
 .sahand-file-head{display:flex;gap:1rem;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;margin-bottom:1rem}
 .sahand-file-title{font-size:1.15rem;font-weight:900;color:rgb(var(--brand))}.dark .sahand-file-title{color:#fff}
 .sahand-file-sub,.sahand-file-db{font-size:.76rem;color:#64748b;margin-top:.3rem}.sahand-file-db{font-size:.68rem}.dark .sahand-file-sub,.dark .sahand-file-db{color:#94a3b8}
 .sahand-file-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.75rem}
 .sahand-file-card{min-height:126px;border:1px solid #e2e8f0;border-radius:1rem;padding:1rem;background:#fff;display:flex;flex-direction:column;justify-content:space-between}
 .dark .sahand-file-card{border-color:#334155;background:#0f172a}.sahand-file-icon{font-size:1.25rem;color:rgb(var(--accent));margin-bottom:.65rem}
 .sahand-file-name{font-weight:850;font-size:.86rem;color:#0f172a}.dark .sahand-file-name{color:#f8fafc}
 .sahand-file-status{font-size:.7rem;font-weight:800;margin-top:.65rem;padding:.28rem .55rem;border-radius:999px;width:max-content;max-width:100%}
 .sahand-file-status.ok{background:#dcfce7;color:#166534}.sahand-file-status.work{background:#fef3c7;color:#92400e}.sahand-file-status.pending{background:#e2e8f0;color:#475569}
 .dark .sahand-file-status.ok{background:#14532d55;color:#86efac}.dark .sahand-file-status.work{background:#78350f55;color:#fde68a}.dark .sahand-file-status.pending{background:#334155;color:#cbd5e1}
 .sahand-no-guess{font-size:.72rem;color:#64748b;margin-top:1rem;line-height:1.9}.dark .sahand-no-guess{color:#94a3b8}
 @media(max-width:1100px){.sahand-file-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
 @media(max-width:700px){.sahand-file-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:480px){.sahand-file-grid{grid-template-columns:1fr}.sahand-file-card{min-height:98px}}
 `;document.head.appendChild(x);
}
async function loadDB(){
 try{const r=await fetch(DB_URL,{cache:'no-store'});if(!r.ok)throw Error(r.status);DB=await r.json();window.SAHAND_PRODUCT_DB=DB}
 catch(e){console.warn('[Sahand] DB load failed; status fallback only',e);DB={products:{},offline_fallback:true}}
}
function loadI18n(){if(document.getElementById('sahand-i18n-completion-script'))return;const x=document.createElement('script');x.id='sahand-i18n-completion-script';x.src=I18N_URL;document.body.appendChild(x)}
function stateOf(v){
 if(v&&typeof v==='object')return v.status||'pending';
 if(typeof v==='string')return v;
 return'pending';
}
function applyDB(){
 if(typeof products==='undefined'||!DB)return;
 for(const[id,r]of Object.entries(DB.products||{})){
  const p=products[id];if(!p)continue;
  p.__sahandDb=r;
  if(r.title)p.title=Object.assign({},p.title||{},r.title);
  const m=r.media||{};
  // Critical rule: normal gallery photos are never treated as 360 frames.
  if(m.main_image&&m.main_image_status==='verified')p.images=[m.main_image];
  if(Array.isArray(m.gallery)&&m.gallery.length&&m.gallery_status==='verified')p.gallery=m.gallery.slice();
  const a=r.assets||{};
  const v360=a.view_360;
  if(v360&&typeof v360==='object'&&v360.status==='verified'&&Array.isArray(v360.frames)&&v360.frames.length>1){p.__sahand360Frames=v360.frames.slice()}
  else p.__sahand360Frames=[];
  if(id==='CT-009'&&Array.isArray(p.specs))p.specs.forEach(x=>{const z=Object.values(x?.label||{}).join(' ');if(/دقت|تلرانس|accuracy|tolerance|دقة|hassas/i.test(z))x.value='≤ 0.05 mm'});
 }
}
function rec(id){return DB?.products?.[id]||null}
function specStatus(r,id){if(!r)return(FALLBACK[id]||[])[1]||'pending';const v=r.specs_status||'';if(v==='current_site_confirmed')return'current';if(v.startsWith('source_file_confirmed'))return'source';if(v==='review')return'review';return'pending'}
function photoStatus(r,id){if(!r)return(FALLBACK[id]||[])[2]||'pending';const m=r.media||{};if(m.gallery_status==='verified')return'verified';if(m.gallery_status==='partial'||m.main_image_status==='verified')return'partial';if(m.main_image_status==='reference_only')return'reference';return'pending'}
function assetStatus(v){const q=stateOf(v);if(q==='verified')return'verified';if(q==='visual_reconstruction')return'visual';if(q==='reference_only')return'reference';return'pending'}
function status(k){const c=['verified','current','source'].includes(k)?'ok':['partial','review','reference','visual'].includes(k)?'work':'pending';return`<span class="sahand-file-status ${c}">${esc(s(k))}</span>`}
function card(icon,n,k){return`<div class="sahand-file-card"><div><i class="fa-solid ${icon} sahand-file-icon"></i><div class="sahand-file-name">${esc(n)}</div></div>${status(k)}</div>`}
function enhance(id){
 if(!id||typeof products==='undefined'||!products[id]||products[id].categoryId!=='cutting')return;
 const v=document.getElementById('view-product');if(!v)return;
 v.querySelector('#sahand-cutting-product-file')?.remove();
 const r=rec(id),p=products[id],f=FALLBACK[id]||['—','pending','pending'],model=r?.model||f[0]||'—',a=r?.assets||{};
 const title=p.title?.[lang()]||p.title?.fa||id,variant=lang()==='fa'?(r?.configuration_fa||''):'';
 const sec=document.createElement('section');sec.id='sahand-cutting-product-file';sec.className='sahand-product-file';
 sec.innerHTML=`<div class="sahand-file-head"><div><div class="sahand-file-title">${esc(s('title'))}</div><div class="sahand-file-sub">${esc(id)} · ${esc(model)}${variant?' · '+esc(variant):''}</div><div class="sahand-file-db"><i class="fa-solid fa-database"></i> ${esc(s('db'))}</div></div><span class="product-code">${esc(id)}</span></div><div class="sahand-file-grid">${card('fa-images',s('photos'),photoStatus(r,id))}${card('fa-list-check',s('specs'),specStatus(r,id))}${card('fa-arrows-rotate',s('v360'),assetStatus(a.view_360))}${card('fa-ruler-combined',s('drawing'),assetStatus(a.technical_drawing))}${card('fa-cube',s('three'),assetStatus(a.three_d))}${card('fa-cubes-stacked',s('exploded'),assetStatus(a.exploded_view))}</div><div class="sahand-no-guess"><i class="fa-solid fa-shield-halved ml-1"></i> ${esc(title)}: ${esc(s('rule'))}</div>`;
 const anchor=document.getElementById('gallery-section')||v.querySelector('.tabs-container')||document.getElementById('comments-list')?.parentElement||v.lastElementChild;
 if(anchor?.parentNode)anchor.parentNode.insertBefore(sec,anchor.nextSibling);else v.appendChild(sec);
 window.SahandI18nCompletion?.apply(lang());
}
function wrap(){
 if(typeof renderProduct!=='function'||renderProduct.__sahandDbOrganizer)return;
 const old=renderProduct;
 renderProduct=function(id){const x=old(id);setTimeout(()=>enhance(id),90);return x};
 renderProduct.__sahandDbOrganizer=true;
}
let tries=0;
async function boot(){
 if(typeof products==='undefined'||typeof renderProduct!=='function'){if(++tries<80)setTimeout(boot,100);return}
 style();await loadDB();applyDB();loadI18n();wrap();
 const id=(typeof currentProductId!=='undefined'&&currentProductId)||decodeURIComponent((location.hash.match(/product=([^&]+)/)||[])[1]||'');
 if(id&&products[id])try{renderProduct(id)}catch(e){setTimeout(()=>enhance(id),120)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
