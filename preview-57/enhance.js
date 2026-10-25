/* Preview 56: full site additions, using Preview 29 categories, Preview 33 sheets, Preview 50 X-rays. */
(function(){'use strict';
const products=window.PREVIEW32_IMAGES||[],sheets=window.PREVIEW_DIMENSIONAL_SHEETS||[];\nconst PREVIEW57_FULL3_CATEGORIES=new Set(['cutting','welding','marking','source']);\nconst isFull3=p=>PREVIEW57_FULL3_CATEGORIES.has(p?.category);
const labels=window.PREVIEW57_CATEGORY_LABELS||{},root=document.createElement('section');
root.id='preview56-catalog';root.className='p56-wrap';
root.innerHTML='<div class="p56-head"><span>۳۲ محصول با نمای X-Ray</span><h2>محصولات تصویری سهند لیزر</h2><p>هر محصول صفحه‌ی اختصاصی دارد؛ تصویر اصلی و X-Ray با اسلایدر لمسی مقایسه می‌شوند و نقشه‌های ابعادی موجود نیز نمایش داده می‌شوند.</p></div><div id="p56-categories" class="p56-categories"></div><div class="p56-search"><input id="p56-search" type="search" placeholder="جست‌وجوی نام یا مدل" aria-label="جست‌وجوی محصول"><span id="p56-count"></span></div><div id="p56-cards" class="p56-cards"></div><div id="preview56-sheets" class="p56-sheets"><h2>نقشه‌های ابعادی Preview 33</h2><p>تمام شیت‌های ساخته‌شده در این مجموعه در دسترس هستند. نقشه‌های تخمینی با برچسب مشخص شده‌اند.</p><div id="p56-sheet-cards" class="p56-sheet-cards"></div></div>';
const footer=document.querySelector('footer');if(footer)footer.before(root);else document.body.append(root);
const nav=document.querySelector('header nav');if(nav){const link=document.createElement('a');link.href='#preview56-catalog';link.textContent='محصولات X-Ray';nav.append(link);const link2=document.createElement('a');link2.href='#preview56-sheets';link2.textContent='نقشه‌های ابعادی';nav.append(link2)}
let active='all',search='';
const cats=[['all','همه'],['cutting','برش'],['welding','جوش'],['marking','حکاکی و مارکینگ'],['cleaning','تمیزکاری']];
const catEl=root.querySelector('#p56-categories'),cards=root.querySelector('#p56-cards');
for(const [key,title] of cats){const b=document.createElement('button');b.type='button';b.textContent=title;b.dataset.category=key;b.onclick=()=>{active=key;draw()};catEl.append(b)}
function draw(){catEl.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b.dataset.category===active));const list=products.filter(p=>(active==='all'||p.category===active)&&(!search||(p.code+' '+p.name).toLocaleLowerCase().includes(search)));root.querySelector('#p56-count').textContent=list.length+' محصول';cards.replaceChildren();for(const p of list){const article=document.createElement('article');article.className='p56-card';const link=document.createElement('a');link.href=location.pathname+location.search+'#product='+window.PREVIEW57_ROUTE_CODE(p.number);const img=document.createElement('img');img.src=p.image;img.alt=p.name;img.loading='lazy';const pair=document.createElement('div');pair.className='p56-card-pair';const original=document.createElement('div');const xr=document.createElement('div');const ximg=document.createElement('img');ximg.src='assets/preview-50-xray/'+String(p.number).padStart(2,'0')+'.jpg';ximg.alt='نمای X-Ray '+p.name;ximg.loading='lazy';const firstLabel=document.createElement('span');firstLabel.textContent='تصویر اصلی';const secondLabel=document.createElement('span');secondLabel.textContent='X-Ray';original.append(img,firstLabel);xr.append(ximg,secondLabel);pair.append(original,xr);link.append(pair);article.append(link);const box=document.createElement('div');const small=document.createElement('small');small.textContent=(labels[p.category]||p.category)+' · '+p.code;const h=document.createElement('h3');h.textContent=p.name;const open=document.createElement('a');open.className='p56-open';open.href=link.href;open.textContent='تصویر، X-Ray و نقشه ←';box.append(small,h,open);article.append(box);cards.append(article)}}
root.querySelector('#p56-search').oninput=e=>{search=e.target.value.toLocaleLowerCase().trim();draw()};draw();
const sheetCards=root.querySelector('#p56-sheet-cards');
for(const s of sheets){const article=document.createElement('article');article.className='p56-sheet';const a=document.createElement('a');a.href=s.src;a.target='_blank';a.rel='noopener';const img=document.createElement('img');img.src=s.src;img.alt='نقشه ابعادی '+s.title;img.loading='lazy';const h=document.createElement('h3');h.textContent=s.title;const small=document.createElement('small');small.textContent=s.dimensions.join(' × ')+' mm'+(s.estimated?' · تخمینی':'');a.append(img,h,small);article.append(a);sheetCards.append(article)}
/* The main site's own product route now contains the image, drawing and X-Ray. */
const baseRender=window.renderProduct;
if(typeof baseRender==='function')window.renderProduct=function(code){
  baseRender(code);
  document.querySelectorAll('.p56-product-xray').forEach(n=>n.remove());
  let p=products.find(x=>window.PREVIEW57_ROUTE_CODE(x.number)===code);
  if(!p){
    const same=products.filter(x=>x.code===code);
    p=code==='CUT-3015-1'?same.find(x=>x.number===27):(same.length===1?same[0]:null);
  }
  const familyIds=p?(window.PREVIEW57_FAMILY_SHEETS[p.number]||[]):(window.PREVIEW57_ORIGINAL_FAMILY_SHEETS[code]||[]);
  const existingXray=window.PREVIEW57_EXISTING_XRAYS[code];
  if(!p&&!familyIds.length&&!existingXray)return;
  const target=document.querySelector('.lab-product-extra');
  if(!target)return;
  const drawing=target.querySelector('.lab-dimensional');
  if(drawing&&familyIds.length){
    const empty=drawing.querySelector('.lab-no-sheet');if(empty)empty.remove();
    const heading=document.createElement('h3');heading.textContent='نقشه‌های مرجع هم‌خانواده';drawing.append(heading);
    const warning=document.createElement('p');warning.textContent='این نقشه‌ها متعلق به خانوادهٔ مشابه‌اند؛ ابعاد نسخهٔ دقیق این محصول تأیید نشده است.';drawing.append(warning);
    for(const id of familyIds){
      const s=sheets.find(x=>x.id===id);if(!s)continue;
      const link=document.createElement('a');link.href=s.src;link.target='_blank';link.rel='noopener';
      const img=document.createElement('img');img.src=s.src;img.alt='نقشه مرجع '+s.title;img.loading='lazy';
      const caption=document.createElement('span');caption.textContent=s.title+' · '+s.dimensions.join(' × ')+' mm'+(s.estimated?' · تخمینی':'');
      link.append(img,caption);drawing.append(link);
    }
  }
  if(!p&&!existingXray)return;\n  if(!needsThree&&!existingXray)return;
  const catalogItem=!p?(window.PREVIEW29_PRODUCTS||[]).find(x=>x.code===code):null;
  const displayName=p?p.name:(catalogItem?.name||code);
  const section=document.createElement('section');section.className='p56-product-xray';
  const title=document.createElement('h2');title.textContent='تصویر اصلی و X-Ray '+displayName;
  const stage=document.createElement('div');stage.className='p56-compare';stage.style.setProperty('--reveal','50%');
  const n=p?String(p.number).padStart(2,'0'):null;
  const photo=document.createElement('img');photo.src=p?'assets/preview-32-products/'+n+'.jpg':catalogItem.image;photo.alt='تصویر اصلی '+displayName;
  const xray=document.createElement('img');xray.src=p?'assets/preview-50-xray/'+n+'.jpg':existingXray;xray.alt='نمای X-Ray '+displayName;xray.className='p56-xray';
  const line=document.createElement('span');line.className='p56-line';
  stage.append(photo,xray,line);
  const range=document.createElement('input');range.type='range';range.min='0';range.max='100';range.value='50';range.setAttribute('aria-label','میزان آشکارشدن X-Ray');
  const note=document.createElement('p');note.textContent='با موس یا انگشت روی تصویر بکشید؛ این نمای داخلی بازسازی مفهومی است.';
  section.append(title,stage,range,note);
  if(drawing)drawing.after(section);else target.append(section);
  let drag=false;
  function move(e){const rect=stage.getBoundingClientRect(),v=Math.max(0,Math.min(100,(e.clientX-rect.left)/rect.width*100));stage.style.setProperty('--reveal',v+'%');range.value=v}
  stage.addEventListener('pointerdown',e=>{drag=true;stage.setPointerCapture(e.pointerId);move(e)});
  stage.addEventListener('pointermove',e=>{if(drag)move(e)});
  stage.addEventListener('pointerup',()=>drag=false);
  stage.addEventListener('pointercancel',()=>drag=false);
  range.oninput=()=>stage.style.setProperty('--reveal',range.value+'%');
};
})();
