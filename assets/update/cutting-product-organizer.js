/* Sahand Laser — cutting products asset/status organizer — 2026-10-04 */
(function(){
'use strict';

const META={
 'CT-001':{model:'SH3015',variant:'تک‌میز',photo:'verified',gallery:'partial',specs:'current',v360:'pending',drawing:'pending',three:'pending'},
 'CT-002':{model:'SH3015',variant:'دومیز',photo:'verified',gallery:'verified',specs:'current',v360:'pending',drawing:'pending',three:'pending'},
 'CT-003':{model:'SH3015R',variant:'دومیز + روتاری',photo:'verified',gallery:'pending',specs:'current',v360:'pending',drawing:'pending',three:'pending'},
 'CT-004':{model:'SH6020',variant:'تک‌میز حرفه‌ای',photo:'verified',gallery:'pending',specs:'current',v360:'pending',drawing:'pending',three:'pending'},
 'CT-005':{model:'SH6020',variant:'تک‌میز استاندارد',photo:'pending',gallery:'pending',specs:'review',v360:'pending',drawing:'pending',three:'pending'},
 'CT-006':{model:'SH6020R',variant:'دومیز + روتاری',photo:'pending',gallery:'pending',specs:'review',v360:'pending',drawing:'pending',three:'pending'},
 'CT-007':{model:'SH6020R',variant:'تک‌میز + روتاری',photo:'pending',gallery:'pending',specs:'review',v360:'pending',drawing:'pending',three:'pending'},
 'CT-008':{model:'SH6020C',variant:'کابین‌دار حرفه‌ای',photo:'pending',gallery:'pending',specs:'review',v360:'pending',drawing:'pending',three:'pending'},
 'CT-009':{model:'QG-6024DZ',variant:'لوله‌بر افقی سری استاندارد',photo:'pending',gallery:'pending',specs:'source',v360:'pending',drawing:'pending',three:'pending'},
 'CT-010':{model:'مدل در حال تأیید',variant:'محصول جدید',photo:'reference',gallery:'pending',specs:'pending',v360:'pending',drawing:'pending',three:'revision'}
};

const labels={
 verified:['تأیید شده','ok'], partial:['بخشی تأیید شده','work'], current:['ثبت شده','ok'], source:['تأیید شده از منبع فنی','ok'],
 review:['نیازمند تطبیق نهایی','work'], reference:['فقط تصویر مرجع','work'], revision:['در انتظار اصلاح طراحی','work'], pending:['در انتظار تأیید','pending']
};

function addStyle(){
 if(document.getElementById('sahand-cutting-organizer-style'))return;
 const s=document.createElement('style');s.id='sahand-cutting-organizer-style';
 s.textContent=`
 .sahand-product-file{margin-top:2rem;border:1px solid #e2e8f0;border-radius:1.25rem;padding:1.25rem;background:linear-gradient(135deg,#fff,#f8fafc)}
 .dark .sahand-product-file{border-color:#334155;background:linear-gradient(135deg,#0f172a,#020617)}
 .sahand-file-head{display:flex;gap:1rem;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;margin-bottom:1rem}
 .sahand-file-title{font-size:1.15rem;font-weight:900;color:rgb(var(--brand))}.dark .sahand-file-title{color:#fff}
 .sahand-file-sub{font-size:.78rem;color:#64748b;margin-top:.3rem}.dark .sahand-file-sub{color:#94a3b8}
 .sahand-file-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:.75rem}
 .sahand-file-card{min-height:132px;border:1px solid #e2e8f0;border-radius:1rem;padding:1rem;background:#fff;display:flex;flex-direction:column;justify-content:space-between}
 .dark .sahand-file-card{border-color:#334155;background:#0f172a}
 .sahand-file-icon{font-size:1.25rem;color:rgb(var(--accent));margin-bottom:.65rem}
 .sahand-file-name{font-weight:850;font-size:.86rem;color:#0f172a}.dark .sahand-file-name{color:#f8fafc}
 .sahand-file-status{font-size:.7rem;font-weight:800;margin-top:.65rem;padding:.28rem .55rem;border-radius:999px;width:max-content;max-width:100%}
 .sahand-file-status.ok{background:#dcfce7;color:#166534}.dark .sahand-file-status.ok{background:#14532d55;color:#86efac}
 .sahand-file-status.work{background:#fef3c7;color:#92400e}.dark .sahand-file-status.work{background:#78350f55;color:#fde68a}
 .sahand-file-status.pending{background:#e2e8f0;color:#475569}.dark .sahand-file-status.pending{background:#334155;color:#cbd5e1}
 .sahand-no-guess{font-size:.72rem;color:#64748b;margin-top:1rem;line-height:1.9}.dark .sahand-no-guess{color:#94a3b8}
 @media(max-width:950px){.sahand-file-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:560px){.sahand-file-grid{grid-template-columns:1fr}.sahand-file-card{min-height:105px}}
 `;
 document.head.appendChild(s);
}

function status(v){const x=labels[v]||labels.pending;return `<span class="sahand-file-status ${x[1]}">${x[0]}</span>`}
function card(icon,name,val){return `<div class="sahand-file-card"><div><i class="fa-solid ${icon} sahand-file-icon"></i><div class="sahand-file-name">${name}</div></div>${status(val)}</div>`}

function normalizeData(){
 if(typeof products==='undefined')return;
 const p=products['CT-009'];
 if(p&&Array.isArray(p.specs)){
   p.specs.forEach(x=>{const fa=x&&x.label&&x.label.fa;if(fa&&/دقت|تلرانس/.test(fa)&&String(x.value||'').includes('0.05'))x.value='< 0.05 mm';});
 }
}

function enhance(id){
 if(!id||!META[id]||typeof products==='undefined'||!products[id]||products[id].categoryId!=='cutting')return;
 const view=document.getElementById('view-product');if(!view)return;
 view.querySelector('#sahand-cutting-product-file')?.remove();
 if(id==='CT-010'){
   view.querySelector('#sahand-special-media')?.remove();
   view.querySelector('#sahand-3d-section')?.remove();
 }
 const m=META[id],p=products[id];
 const sec=document.createElement('section');sec.id='sahand-cutting-product-file';sec.className='sahand-product-file';
 const title=(p.title&&p.title.fa)||id;
 sec.innerHTML=`<div class="sahand-file-head"><div><div class="sahand-file-title">پرونده فنی و رسانه‌ای محصول</div><div class="sahand-file-sub">${id} · ${m.model} · ${m.variant}</div></div><span class="product-code">${id}</span></div><div class="sahand-file-grid">${card('fa-images','عکس و گالری',m.gallery==='verified'?'verified':m.gallery==='partial'?'partial':m.photo==='verified'?'partial':m.photo)}${card('fa-list-check','مشخصات فنی',m.specs)}${card('fa-arrows-rotate','نمای ۳۶۰ درجه',m.v360)}${card('fa-ruler-combined','نقشه فنی',m.drawing)}${card('fa-cube','مدل سه‌بعدی / Exploded',m.three)}</div><div class="sahand-no-guess"><i class="fa-solid fa-shield-halved ml-1"></i> ${title}: فقط اطلاعات و فایل‌های تأییدشده به این محصول متصل می‌شوند؛ موارد نامشخص تا زمان تأیید خالی می‌مانند.</div>`;
 const anchor=document.getElementById('gallery-section')||view.querySelector('.tabs-container')||document.getElementById('comments-list')?.parentElement||view.lastElementChild;
 if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(sec,anchor.nextSibling);else view.appendChild(sec);
}

function wrap(){
 if(typeof renderProduct!=='function'||renderProduct.__sahandCuttingOrganizer)return false;
 const old=renderProduct;
 renderProduct=function(id){old(id);setTimeout(()=>enhance(id),80)};
 renderProduct.__sahandCuttingOrganizer=true;
 return true;
}

let tries=0;
function boot(){
 tries++;
 if(typeof products==='undefined'||typeof renderProduct!=='function'){
   if(tries<60)setTimeout(boot,100);return;
 }
 addStyle();normalizeData();wrap();
 const id=(typeof currentProductId!=='undefined'&&currentProductId)||((location.hash.match(/product=([^&]+)/)||[])[1]);
 if(id)setTimeout(()=>enhance(id),120);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
