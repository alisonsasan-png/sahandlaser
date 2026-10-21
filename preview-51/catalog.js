'use strict';
(() => {
  const labels={cutting:'دستگاه‌های برش لیزر',welding:'دستگاه‌های جوش لیزر',marking:'دستگاه‌های حکاکی لیزر',cleaning:'دستگاه‌های تمیزکاری',parts:'قطعات و تجهیزات',consumables:'مواد و قطعات مصرفی',head:'هدهای لیزر',source:'سورس‌های لیزر'};
  const q=document.querySelector('#query'),category=document.querySelector('#category'),grid=document.querySelector('#catalog'),count=document.querySelector('#count');
  const normalize=value=>String(value||'').normalize('NFKC').replace(/[يى]/g,'ی').replace(/ك/g,'ک').replace(/[۰-۹]/g,c=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).replace(/[٠-٩]/g,c=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(c))).replace(/[\u200c\s]+/g,' ').trim().toLocaleLowerCase('fa');
  const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
  fetch('products.json').then(r=>{if(!r.ok)throw Error(String(r.status));return r.json();}).then(({products})=>{
    for(const group of [...new Set(products.map(p=>p.category))]){const o=el('option','',labels[group]||group);o.value=group;category.append(o);}
    function render(){const term=normalize(q.value),group=category.value,visible=products.filter(p=>(!group||group===p.category)&&normalize(p.name+' '+p.code+' '+(p.aliases||[]).join(' ')).includes(term));grid.replaceChildren();count.textContent=`${visible.length} از ${products.length} محصول`;
      if(!visible.length){grid.append(el('p','empty','محصولی با این جست‌وجو پیدا نشد.'));return;}
      for(const [i,p] of visible.entries()){const card=el('article','card'),visual=el('a','visual');visual.href='products/'+encodeURIComponent(p.code)+'.html';visual.setAttribute('aria-label','مشاهدهٔ '+p.name);
        if(p.images.length){const img=el('img');img.src=p.images[0].src;img.alt=p.name;img.loading=i<8?'eager':'lazy';img.decoding='async';img.onerror=()=>visual.replaceChildren(el('span','muted','تصویر بارگیری نشد؛ اطلاعات محصول را ببینید.'));visual.append(img);}else visual.append(el('span','muted','تصویر قابل تطبیق برای این رکورد ثبت نشده است.'));
        const copy=el('div','copy');copy.append(el('span','tag',labels[p.category]||p.category),el('h2','',p.name),el('div','code',p.displayCode||p.code));if(p.images.length)copy.append(el('p','caption',p.images[0].caption));const a=el('a','detail','اطلاعات، تصاویر و منابع');a.href=visual.href;copy.append(a);card.append(visual,copy);grid.append(card);}
    }
    q.addEventListener('input',render);category.addEventListener('change',render);document.querySelector('#clear').onclick=()=>{q.value='';category.value='';render();q.focus();};render();window.PREVIEW51={products,normalize};
  }).catch(e=>{count.textContent='دریافت فهرست ناموفق بود';grid.replaceChildren(el('p','empty','فهرست محصولات بارگیری نشد ('+e.message+'). صفحه را دوباره بارگیری کنید.'));});
})();
