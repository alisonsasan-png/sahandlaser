(() => {
const params=new URLSearchParams(location.search), taxonomy=params.get('taxonomy')||'', theme=params.get('theme')||'';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const labels={cutting:'برش لیزر',welding:'جوش لیزر',marking:'حکاکی و مارکینگ',cleaning:'تمیزکاری لیزر',source:'سورس لیزر',head:'هد و کنترلر',parts:'قطعات دستگاه',consumables:'قطعات مصرفی'};
const designs={
custom:[['دستگاه‌های برش لیزر',[['برش 3015','size3015'],['برش 6020','size6020'],['برش سایز بزرگ','large'],['برش لوله‌بر','tube'],['برش ربات','robot']]],['سایر دستگاه‌ها',[['جوش لیزر','welding'],['حکاکی و مارکینگ','marking'],['تمیزکاری لیزر','cleaning']]],['قطعات و تجهیزات',[['سورس لیزر','source'],['هد و کنترلر','head'],['قطعات دستگاه','parts'],['قطعات مصرفی','consumables']]]],
process:[['فرایند تولید',[['برش ورق','sheet'],['برش لوله','tube'],['جوش','welding'],['حکاکی','marking'],['پاک‌سازی سطح','cleaning']]],['تجهیزات فرایند',[['تولید پرتو','source'],['هدایت و کنترل پرتو','head'],['تجهیزات جانبی','parts'],['مصرفی‌ها','consumables']]]],
size:[['ابعاد و کارگیر',[['کارگیر 3015','size3015'],['کارگیر 6020','size6020'],['کارگیر بزرگ و سایر ابعاد','large'],['لوله و پروفیل','tube']]],['دستگاه‌های بدون کارگیر ورقی',[['جوش','welding'],['مارکینگ','marking'],['تمیزکاری','cleaning']]],['تجهیزات',[['سورس','source'],['هد و کنترلر','head'],['قطعات','parts'],['مصرفی','consumables']]]],
industry:[['نیاز تولید',[['ورق‌کاری و ساخت بدنه','sheet'],['لوله و سازه فلزی','tube'],['اتصال قطعات','welding'],['شناسه و ردیابی قطعات','marking'],['پاک‌سازی سطوح','cleaning']]],['تأمین تجهیزات',[['سورس','source'],['هد و کنترلر','head'],['قطعات یدکی','parts'],['مصرفی‌ها','consumables']]]],
structure:[['ساختار دستگاه برش',[['تک‌میز','single'],['دو‌میز تبادلی','exchange'],['کابین‌دار','enclosed'],['ورق و لوله ترکیبی','rotary'],['لوله‌بر مستقل','tube-only']]],['دستگاه‌های دیگر',[['جوش','welding'],['مارکینگ','marking'],['تمیزکاری','cleaning']]],['اجزای دستگاه',[['سورس','source'],['هد و کنترلر','head'],['قطعات','parts'],['مصرفی‌ها','consumables']]]],
brand:[['خانواده دستگاه‌ها',[['خانواده برش سهند','cutting'],['خانواده جوش','welding'],['خانواده مارکینگ','marking'],['خانواده تمیزکاری','cleaning']]],['برندهای قطعات ثبت‌شده',[['Raycus','brand-raycus'],['RayTools','brand-raytools'],['S&A / TEYU','brand-teyu'],['Hanli','brand-hanli'],['SMC','brand-smc'],['FSCUT / BOCHU','brand-bochu']]],['سایر اقلام',[['همه قطعات','components'],['مصرفی‌ها','consumables']]]]
};
const productMap=window.SAHAND_PRODUCTS;
const text=p=>Object.values(p.title||{}).join(' ')+' '+p.code+' '+(p.specs||[]).map(s=>typeof s.value==='string'?s.value:JSON.stringify(s.value)).join(' ');
function match(p,k){
 const t=text(p).toLowerCase(),cut=p.categoryId==='cutting';
 if(labels[k])return p.categoryId===k;
 if(k==='size3015')return cut&&/3015/.test(t);
 if(k==='size6020')return cut&&/6020/.test(t);
 if(k==='large')return cut&&!/3015|6020|tube|لوله/.test(t);
 if(k==='sheet')return cut&&!/tube|لوله/.test(t);
 if(k==='tube')return cut&&/tube|rotary|لوله|روتاری/.test(t);
 if(k==='tube-only')return cut&&/tube|لوله/.test(t)&&!/rotary|روتاری/.test(t);
 if(k==='rotary')return cut&&/rotary|روتاری/.test(t);
 if(k==='robot')return cut&&/robot|ربات/.test(t);
 if(k==='single')return cut&&/single|تک/.test(t);
 if(k==='exchange')return cut&&/dual|exchange|دو.?میز/.test(t);
 if(k==='enclosed')return cut&&/enclosed|cabin|کابین/.test(t);
 if(k==='components')return !['cutting','welding','marking','cleaning'].includes(p.categoryId);
 const brands={'brand-raycus':/raycus|ریکاس/,'brand-raytools':/raytools|ریتولز/,'brand-teyu':/s&a|teyu|cwfl/,'brand-hanli':/hanli/,'brand-smc':/smc/,'brand-bochu':/fscut|bochu/};
 return brands[k]?.test(t)||false;
}
let selected='all';
const originals={grid:window.renderProductsGrid,filter:window.renderCatalogFilter,catalog:window.renderAllProducts};
function drawTree(){
 const first=document.getElementById('products-grid-1'),second=document.getElementById('products-grid-2');
 if(!first)return;
 first.className='taxonomy-tree';
 first.innerHTML=(designs[taxonomy]||designs.custom).map(([group,children])=>'<section class="taxonomy-group"><h3>'+escape(group)+'</h3><div class="taxonomy-options">'+children.map(([name,key])=>{const count=Object.values(productMap).filter(p=>match(p,key)).length;return '<button type="button" data-tax="'+key+'" class="'+(selected===key?'selected':'')+'">'+escape(name)+' <span>'+count+'</span></button>';}).join('')+'</div></section>').join('');
 first.querySelectorAll('button').forEach(b=>b.onclick=()=>select(b.dataset.tax));
 if(second){second.innerHTML='';second.hidden=true;second.previousElementSibling.hidden=true;}
}
function select(k){
 selected=k;window.filterCatalog('all');applySelection();drawTree();
 document.getElementById('full-catalog-section')?.scrollIntoView({behavior:'smooth'});
}
function applySelection(){
 let count=0;
 document.querySelectorAll('#all-products-grid article').forEach(card=>{
 const code=card.querySelector('.product-code')?.textContent.trim(),p=productMap[code],show=selected==='all'||(p&&match(p,selected));card.hidden=!show;if(show)count++;
 });
 const n=document.getElementById('catalog-count');if(n)n.textContent=count+' محصول';
 let options=document.getElementById('requested3015');
 if(!options){options=document.createElement('section');options.id='requested3015';options.className='requested-models';document.getElementById('all-products-grid').before(options);}
 options.hidden=!(taxonomy==='custom'&&selected==='size3015');
 options.innerHTML='<h3>مدل‌های درخواستی برش 3015</h3><div>'+['تک میز DZ3015S','تک میز DZ3015H','تک میز LD3015','دومیز DZ3015','دومیز LD3015','تک میز 3015 + لوله‌بر','دومیز 3015 + لوله‌بر'].map(name=>'<span>'+escape(name)+'</span>').join('')+'</div><p>این مدل‌ها برای ساختار جدید معرفی شده‌اند؛ تطبیق با کدهای فعلی و مشخصات هر مدل هنوز ثبت نشده است.</p>';
}
if(taxonomy){
 window.renderProductsGrid=drawTree;
 window.renderCatalogFilter=function(){const box=document.getElementById('catalog-filter');if(box){box.innerHTML='<button type="button">نمایش همه محصولات</button>';box.firstChild.onclick=()=>select('all');}};
 window.renderAllProducts=function(...args){originals.catalog(...args);applySelection();};
 drawTree();window.renderCatalogFilter();window.renderAllProducts('all');
 const home=document.getElementById('home-products-grid');
 if(home){const link=document.createElement('button');link.className='btn-taxonomy';link.textContent='مشاهده دسته‌بندی محصولات';link.onclick=()=>window.navigateTo('products');home.before(link);}
}
if(theme){
 document.body.dataset.previewTheme=theme;
 const dark=['blue','graphite','emerald','gold','red','glass','soft'].includes(theme);
 document.documentElement.classList.toggle('dark',dark);
 document.querySelectorAll('#view-home .hero-slide').forEach(hero=>{hero.classList.add('preview-hero');const light=document.createElement('div');light.className='preview-light';hero.prepend(light);});
}
})();