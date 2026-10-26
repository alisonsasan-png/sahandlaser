/* Shared product engine; each preview has its own category/interaction design. */
(() => {
  'use strict';
  const config=window.PREVIEW_VARIANT;
  const labels={cutting:'برش لیزر',welding:'جوش لیزر',marking:'حکاکی لیزر',cleaning:'تمیزکاری لیزر',source:'سورس لیزر',head:'هد و کنترلر',parts:'قطعات و تجهیزات',consumables:'مصرفی‌ها'};
  const icons={cutting:'scissors',welding:'fire-flame-curved',marking:'crosshairs',cleaning:'wand-sparkles',source:'microchip',head:'bullseye',parts:'gears',consumables:'layer-group'};
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asset=p=>new URL(p,document.baseURI).href;
  const route=hash=>{const url=new URL(location.href);url.searchParams.delete('product');url.hash=hash;return url.pathname+url.search+url.hash;};
  const source=window.PREVIEW29_PRODUCTS||[];
  const sheets=window.PREVIEW_DIMENSIONAL_SHEETS||[];
  const sheetByCode=new Map();
  const records=new Map(source.map(p=>[p.code,{...p}]));
  const structure=p=>{
    if(p.category!=='cutting')return '';
    if(config.categoryMode==='29'){
      if(/ربات|سفارشی|سایز بزرگ/.test(p.name))return 'special';
      if(p.configuration?.tableCount===2||p.group==='double'||/دو.?میز|دو میز|کابین/.test(p.name))return 'double';
      if(p.configuration?.tableCount===1||p.group==='single'||/تک.?میز|تک میز/.test(p.name))return 'single';
      return /لوله|روتاری/.test(p.name)?'tube':'special';
    }
    if(p.group)return p.group;
    if(p.configuration?.tubeAttachment||/لوله.?بر|روتاری/.test(p.name))return 'tube';
    if(p.configuration?.tableCount===2||/دو.?میز|دو میز|کابین/.test(p.name))return 'double';
    if(p.configuration?.tableCount===1||/تک.?میز|تک میز/.test(p.name))return 'single';
    return 'special';
  };
  for(const sheet of sheets){
    const code=sheet.productCode||'SHEET-'+sheet.id;
    const existing=records.get(code);
    const r=existing||{code,name:sheet.title,category:sheet.category,description:sheet.description||'معرفی دستگاه بر اساس تصویر و اطلاعات کاتالوگ سهند لیزر.',specs:[],image:sheet.src};
    if(!existing)records.set(code,r);
    r.sheetId=sheet.id;r.sheet=sheet;r.size=sheet.size||r.configuration?.sizeFamily||'';
    if(sheet.group)r.group=sheet.group;
    // Sheet records retain their own identity; no undocumented LD/DZ equivalence.
    sheetByCode.set(code,sheet);
    if(!existing)r.image=sheet.src;
  }
  const modern=config.categoryMode==='30';
  if(modern){
    for(const row of window.PREVIEW_CUTTING_ROWS||[]){
      const donor=records.get(row.code)||records.get(row.donor);
      if(!donor)continue;
      if(!records.has(row.code))records.set(row.code,{...donor,...row,sheet:undefined,sheetId:undefined});
      else Object.assign(records.get(row.code),{group:row.group,size:row.size});
    }
  }
  const list=[...records.values()];
  const registry=window.SAHAND_PRODUCTS;
  const local=v=>({fa:v,en:v,ar:v,tr:v});
  for(const item of list){
    const old=registry[item.code];
    const dedicated=old?.images?.find(src=>!String(src).includes('product-drawings'));
    const image=dedicated||(item.image&&!String(item.image).includes('product-drawings')?asset(item.image):null);
    registry[item.code]={...(old||{}),code:item.code,categoryId:item.category,cat:local(labels[item.category]||item.category),badge:local(labels[item.category]||''),title:local(item.name),subtitle:local(item.code),images:image?[image]:[],media:{images:image?[image]:[],frames360:[],works:[],notes:{}},advantages:[],specs:(item.specs||[]).map(s=>({label:local(s.label),value:typeof s.value==='object'?JSON.stringify(s.value):s.value})),usage:old?.usage||[],models:[],description:local(Array.isArray(item.description)?item.description:[item.description||item.name]),downloads:old?.downloads||[],editorial:[],gallery:[]};
  }
  const nativeRender=window.renderProduct;
  let lastCategory='all',compare=[];
  const state={category:'all',group:'all',size:'all',cabinet:false,tube:false,query:''};
  const groupLabels={single:'تک‌میز',double:'دومیز و کابین‌دار',tube:'ورق و لوله',special:'سفارشی، لوله‌بر و ربات'};
  function filterItems(){return list.filter(p=>(state.category==='all'||p.category===state.category)&&(state.category!=='cutting'||state.group==='all'||structure(p)===state.group)&&(state.size==='all'||String(p.size||p.configuration?.sizeFamily||'')===state.size)&&(!state.cabinet||/کابین/.test(p.name))&&(!state.tube||p.configuration?.tubeAttachment||/روتاری|لوله/.test(p.name))&&(!state.query||[p.name,p.code,p.subgroup].join(' ').toLocaleLowerCase().includes(state.query.toLocaleLowerCase())));}
  function icon(key){const paths={cutting:'M3 20h26M6 20V8h20v12M10 8V4h12v4M16 8v8m-3-2 3 3 3-3',welding:'m5 5 13 5-5 9-10-5zM16 18l8 8m-1-8 4-4m-1 13 4 2',marking:'M6 28h20M10 28V5h13v9M16 5v14m-4-3 4 4 4-4',cleaning:'m4 6 12 5-4 8-11-4zM15 19l9 7m-2-14 6 2m-5 5 5 2',source:'M7 7h18v18H7zM12 12h8v8h-8zM16 2v5m0 18v5M2 16h5m18 0h5',head:'M12 3h8v7l5 5-5 5v9h-8v-9l-5-5 5-5zM12 10h8m-8 10h8',parts:'M16 3v5m0 16v5M3 16h5m16 0h5M7 7l4 4m10 10 4 4M7 25l4-4m10-10 4-4M16 9a7 7 0 1 0 0 14 7 7 0 0 0 0-14',consumables:'M11 3h10v6l5 6-4 5v9H10v-9l-4-5 5-6zM10 15h12m-12 6h12'};return `<svg class="lab-icon" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="${paths[key]||paths.parts}"/></svg>`;}
  function categoryButtons(){return Object.entries(labels).map(([id,name])=>`<button type="button" data-category="${id}" class="lab-category ${state.category===id?'is-active':''}">${icon(id)}<span>${name}</span><small>${list.filter(p=>p.category===id).length} محصول</small><svg class="laser-trace" viewBox="0 0 240 110" preserveAspectRatio="none" aria-hidden="true"><rect x="2" y="2" width="236" height="106" rx="14"/></svg></button>`).join('');}
  function processScene(){
    const scenes={
      weld:'<path class="machine-rail" d="M70 115h220l15-8 15 8h210M225 20l55 40-17 24-55-40zM263 84l35 28"/><path class="work-line" d="M305 110v25"/><g class="laser-sparks" transform="translate(120 0)"><path d="M181 116l-20-15m20 15 18-19m-18 19 29 4m-29-4-7 17"/></g>',
      galvo:'<path class="machine-rail" d="M245 18h110v30H245zM60 120h480"/><path class="beam-line" d="M300 48l-95 69M300 48l95 69"/><path class="work-line" d="M160 112v-25h20v25h20V87h20v25h20V87h20v25h20V87h20v25h20V87h20v25h20V87h20v25h20"/>',
      clean:'<defs><linearGradient id="lab-clean-gradient"><stop stop-color="#805c38"/><stop offset=".48" stop-color="#805c38"/><stop offset=".5" stop-color="#78ebbb"/><stop offset=".52" stop-color="#b6d4df"/><stop offset="1" stop-color="#d9eff3"/></linearGradient></defs><rect x="65" y="95" width="470" height="28" rx="3" fill="url(#lab-clean-gradient)"/><path class="machine-rail" d="M250 15h100v28H250z"/><path class="beam-line" d="M275 43l-35 51m85-51 35 51M300 43v51"/><path class="work-line" d="M240 95h120"/>',
      cut:'<path class="machine-rail" d="M25 115H575M70 112V25H530V112M170 25V60H192V88H170V60"/><path class="beam-line" d="M181 88V116"/><path class="work-line" d="M90 116H510"/><g class="laser-sparks"><path d="M181 116l-20-15m20 15 18-19m-18 19 29 4m-29-4-7 17"/></g>'
    };
    const scene=document.querySelector('#lab-graphic-menu .lab-menu-scene svg');if(scene)scene.innerHTML=scenes[config.theme]||scenes.cut;
  }
  function draw(){
    const root=document.getElementById('lab-browser');if(!root)return;
    const visible=filterItems();const sizes=[...new Set(list.filter(p=>p.category==='cutting').map(p=>String(p.size||p.configuration?.sizeFamily||'')).filter(Boolean))];
    root.innerHTML=`<div class="lab-topline"><span>سهند لیزر / پیش‌نمایش ${config.number}</span><a href="${asset('preview-lab/index.html')}">مقایسهٔ طرح‌ها ←</a></div><header class="lab-heading"><div><p class="lab-eyebrow">${esc(config.subtitle)}</p><h1>${esc(config.heading)}</h1><p>از خانوادهٔ دستگاه شروع کنید؛ مدل، تصاویر و نقشهٔ ابعادی را در صفحهٔ مخصوصش ببینید.</p></div><button type="button" class="lab-menu-toggle" aria-expanded="false" aria-controls="lab-graphic-menu">${icon('cutting')} منوی گرافیکی محصولات</button></header><div id="lab-graphic-menu" class="lab-graphic-menu" hidden><div class="lab-menu-scene" aria-hidden="true"><svg viewBox="0 0 600 140"><path class="machine-rail" d="M25 115H575M70 112V25H530V112M170 25V60H192V88H170V60"/><path class="beam-line" d="M181 88V116"/><path class="work-line" d="M90 116H510"/><g class="laser-sparks"><path d="M181 116l-20-15m20 15 18-19m-18 19 29 4m-29-4-7 17"/></g></svg><span>${esc(config.sceneLabel)}</span></div><div class="lab-category-menu">${categoryButtons()}</div></div><div class="lab-category-menu lab-primary-menu">${categoryButtons()}</div><div class="lab-layout"><aside class="lab-filters"><h2>مسیر انتخاب</h2><button type="button" data-category="all" class="lab-all">همهٔ محصولات · ${list.length}</button>${state.category==='cutting'?`<h3>ساختار دستگاه</h3>${Object.entries(groupLabels).map(([id,n])=>`<button type="button" data-group="${id}" class="${state.group===id?'is-active':''}">${n}</button>`).join('')}<button type="button" data-group="all">همهٔ ساختارها</button><h3>ابعاد / خانواده</h3><select id="lab-size" aria-label="انتخاب ابعاد"><option value="all">همهٔ ابعاد</option>${sizes.map(s=>`<option ${state.size===s?'selected':''} value="${esc(s)}">${esc(s)}</option>`).join('')}</select><label class="lab-check"><input id="lab-cabinet" type="checkbox" ${state.cabinet?'checked':''}> فقط کابین‌دار</label>`:`<p>نوع دستگاه را از منو انتخاب کنید.</p>`}<button type="button" data-reset class="lab-reset">پاک‌کردن انتخاب‌ها</button><a href="${asset('catalog.html')}">کتابخانهٔ تصاویر و شیت‌ها ↗</a></aside><section class="lab-results" aria-label="مدل‌های محصولات"><div class="lab-search"><input id="lab-search" type="search" value="${esc(state.query)}" placeholder="نام، مدل یا کد محصول…" aria-label="جست‌وجوی محصول"><span role="status">${visible.length} محصول</span></div><div class="lab-cards">${visible.map(p=>`<article class="lab-card"><a class="lab-photo" href="${route('#product='+encodeURIComponent(p.code))}"><img src="${asset(p.image||p.sheet?.src||'logo.png')}" alt="${esc(p.name)}" loading="lazy" decoding="async"></a><div class="lab-card-copy"><span class="lab-card-category">${labels[p.category]}</span><h2><a href="${route('#product='+encodeURIComponent(p.code))}">${esc(p.name)}</a></h2><small dir="ltr">${esc(p.code)}</small><p>${p.sheet?'دارای شیت ابعادی اختصاصی':'مشخصات و تصاویر ثبت‌شدهٔ مدل'}</p><a class="lab-open" href="${route('#product='+encodeURIComponent(p.code))}">صفحهٔ محصول <span>←</span></a></div></article>`).join('')||'<p class="lab-empty">مدلی با این انتخاب پیدا نشد.</p>'}</div></section></div>`;
    root.querySelectorAll('.lab-photo img[src*="product-drawings"]').forEach(img=>{const box=document.createElement('div');box.className='lab-photo-empty';box.setAttribute('role','img');box.setAttribute('aria-label','تصویر اختصاصی این مدل موجود نیست');box.innerHTML='<span>تصویر اختصاصی موجود نیست</span><small>نقشه فقط در صفحهٔ محصول نمایش داده می‌شود</small>';img.replaceWith(box);});
    processScene();
    if(state.category==='cutting'&&modern){const groups=document.createElement('nav');groups.className='lab-structure-menu';groups.setAttribute('aria-label','سه ساختار اصلی برش');groups.innerHTML=['single','double','tube'].map(id=>`<button type="button" data-group="${id}" class="${state.group===id?'is-active':''}">${icon('cutting')}<b>${groupLabels[id]}</b><small>${list.filter(p=>p.category==='cutting'&&structure(p)===id).length} مدل</small></button>`).join('');root.querySelector('.lab-layout').before(groups);}
    if(state.category==='cutting'&&!modern){const label=document.createElement('label');label.className='lab-check';label.innerHTML=`<input type="checkbox" ${state.tube?'checked':''}> فقط ورق و لوله`;label.querySelector('input').onchange=e=>{state.tube=e.target.checked;draw();};root.querySelector('.lab-filters').append(label);}
    root.querySelectorAll('[data-category]').forEach(b=>b.onclick=()=>{lastCategory=b.dataset.category;Object.assign(state,{category:b.dataset.category,group:'all',size:'all',cabinet:false,tube:false});draw();});
    root.querySelectorAll('[data-group]').forEach(b=>b.onclick=()=>{state.group=b.dataset.group;draw();});
    root.querySelector('[data-reset]').onclick=()=>{Object.assign(state,{category:'all',group:'all',size:'all',cabinet:false,tube:false,query:''});lastCategory='all';draw();};
    root.querySelector('#lab-size')?.addEventListener('change',e=>{state.size=e.target.value;draw();});
    root.querySelector('#lab-cabinet')?.addEventListener('change',e=>{state.cabinet=e.target.checked;draw();});
    const search=root.querySelector('#lab-search');search.oninput=e=>{const pos=e.target.selectionStart;state.query=e.target.value;draw();const next=root.querySelector('#lab-search');next.focus();next.setSelectionRange(pos,pos);};
    const toggle=root.querySelector('.lab-menu-toggle'),menu=root.querySelector('#lab-graphic-menu');toggle.onclick=()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)menu.querySelector('button')?.focus();};
    menu.onkeydown=e=>{if(e.key==='Escape'){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();}};
    if(modern&&state.category==='all')root.classList.add('lab-structure-first');
  }
  function comparisons(item){
    const peers=list.filter(p=>p.category===item.category&&p.code!==item.code);
    const random=peers.slice();for(let i=random.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[random[i],random[j]]=[random[j],random[i]];}
    compare=[item.code,...random.slice(0,2).map(p=>p.code)];
    return `<section class="lab-comparison"><h2>مقایسهٔ مدل‌های هم‌گروه</h2><p>دو مدل دیگر برای شروع انتخاب شده‌اند؛ هر تعداد مدل خواستید اضافه یا حذف کنید.</p><div class="lab-compare-picks">${[item,...peers].map(p=>`<label><input type="checkbox" value="${esc(p.code)}" ${compare.includes(p.code)?'checked':''}>${esc(p.name)}</label>`).join('')}</div><div class="lab-compare-table" tabindex="0" aria-label="جدول مقایسه با پیمایش افقی"></div></section>`;
  }
  function drawComparison(){
    const root=document.querySelector('.lab-compare-table');if(!root)return;
    const items=compare.map(c=>records.get(c)).filter(Boolean),rows=new Map();
    for(const p of items)for(const s of p.specs||[]){if(!rows.has(s.label))rows.set(s.label,new Map());rows.get(s.label).set(p.code,s.value);}
    rows.set('ابعاد کلی / میلی‌متر',new Map(items.map(p=>[p.code,p.sheet?p.sheet.dimensions.join(' × '):'در اطلاعات این مدل ثبت نشده'])));
    root.innerHTML=items.length?`<table><thead><tr><th>ویژگی</th>${items.map(p=>`<th>${esc(p.name)}</th>`).join('')}</tr></thead><tbody>${[...rows].map(([label,values])=>`<tr><th>${esc(label)}</th>${items.map(p=>`<td>${esc(values.get(p.code)||'ثبت نشده')}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'<p>مدلی برای مقایسه انتخاب نشده است.</p>';
  }
  window.renderProduct=function(code){
    nativeRender(code);
    const item=records.get(code);if(!item)return;
    const root=document.getElementById('product-large-sections');
    document.querySelectorAll('.lab-product-extra').forEach(n=>n.remove());
    const extra=document.createElement('section');extra.className='lab-product-extra';
    const sheet=item.sheet;
    extra.innerHTML=`<nav class="lab-product-nav"><a href="${route('#products')}">← بازگشت به فهرست محصولات</a><a href="#lab-dimensional-sheet">نقشهٔ ابعادی ↓</a></nav><section id="lab-dimensional-sheet" class="lab-dimensional"><h2>نقشهٔ ابعادی ${esc(item.name)}</h2>${sheet?`<p>${sheet.estimated?'ابعاد تخمینی با روش تأییدشده در پروژه؛ نماها شماتیک‌اند.':'ابعاد از کاتالوگ خانوادهٔ دستگاه؛ نماها شماتیک‌اند.'}</p><a href="${asset(sheet.src)}" target="_blank" rel="noopener"><img src="${asset(sheet.src)}" alt="شیت ابعادی ${esc(sheet.title)}" loading="eager"></a><div class="lab-drawing-actions"><strong dir="ltr">${sheet.dimensions.join(' × ')} mm</strong><a href="${asset(sheet.src)}" target="_blank" rel="noopener">بازکردن و دریافت تصویر کامل ↗</a></div>`:'<p class="lab-no-sheet">برای این مدل شیت ابعادی منطبق در مجموعهٔ فعلی تهیه نشده است. مشخصات ثبت‌شدهٔ محصول در بالای صفحه قابل مشاهده است.</p>'}</section>${['cutting','welding','marking','cleaning'].includes(item.category)?comparisons(item):''}<section class="lab-family"><h2>مدل‌های هم‌خانواده</h2>${list.filter(p=>p.category===item.category&&p.code!==code).slice(0,18).map(p=>`<a href="${route('#product='+encodeURIComponent(p.code))}">${esc(p.name)} ←</a>`).join('')}</section>`;
    root.before(extra);
    extra.querySelector('a[href="#lab-dimensional-sheet"]').onclick=e=>{e.preventDefault();extra.querySelector('#lab-dimensional-sheet').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});};
    const mediaStatus=document.querySelector('#spin-viewer .image-status');if(mediaStatus)mediaStatus.textContent=sheet?'تصویر بازسازی‌شده / شیت کاتالوگی':'تصویر ثبت‌شدهٔ محصول';
    extra.querySelectorAll('.lab-compare-picks input').forEach(i=>i.onchange=()=>{compare=[...extra.querySelectorAll('.lab-compare-picks input:checked')].map(x=>x.value);drawComparison();});drawComparison();
    const modelList=document.getElementById('models-list');if(modelList)modelList.innerHTML=list.filter(p=>p.category===item.category).slice(0,12).map(p=>`<a class="lab-peer" href="${route('#product='+encodeURIComponent(p.code))}">${esc(p.name)}</a>`).join('');
  };
  window.openCategory=id=>{Object.assign(state,{category:id,group:'all',size:'all',cabinet:false,tube:false});lastCategory=id;location.hash='products';draw();};
  window.filterCatalog=id=>window.openCategory(id);
  const priorRoute=window.applyRoute;
  window.applyRoute=function(){priorRoute();if(location.hash==='#products'){state.category=lastCategory;draw();}};
  function init(){
    document.body.dataset.previewTheme=config.theme;
    document.body.dataset.previewNumber=config.number;
    const bars=document.getElementById('mobile-icon');if(bars)bars.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    const bolt=document.querySelector('header .fa-bolt-lightning');if(bolt)bolt.innerHTML='<svg viewBox="0 0 24 24" width="25" height="25" fill="currentColor" aria-hidden="true"><path d="m14 2-10 12h7l-1 8 10-13h-7z"/></svg>';
    const view=document.getElementById('view-products');view.innerHTML='<div id="lab-browser" class="lab-browser"></div>';
    const badge=document.createElement('a');badge.href=asset('preview-lab/index.html');badge.className='lab-preview-badge';badge.textContent='پیش‌نمایش '+config.number+' · '+config.name;document.body.append(badge);
    const direct=new URL(location.href).searchParams.get('product');
    if(direct&&registry[direct])history.replaceState(null,'',location.pathname+location.search+'#product='+encodeURIComponent(direct));
    draw();window.applyRoute();
    if(!location.hash)location.hash=config.homeOnLoad?'home':'products';
    window.PREVIEW_LAB_DIAGNOSTICS={products:list.length,sheets:sheetByCode.size,version:config.number,records:list};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
