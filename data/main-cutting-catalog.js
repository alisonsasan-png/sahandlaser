/* Main-site cutting catalog: preserve the original site shell and replace only its cutting taxonomy. */
(() => {
  'use strict';
  const source = window.PREVIEW29_PRODUCTS || [];
  const byCode = new Map(source.map(product => [product.code, product]));
  const rows = [
    {code:'CUT-3015-1',name:'تک میز DZ3015S',group:'single',size:'3015'},
    {code:'CUT-3015-2',name:'تک میز DZ3015H',group:'single',size:'3015'},
    {code:'CUT-3015-3',name:'تک میز LD3015',group:'single',size:'3015'},
    {code:'CUT-6020-1',name:'تک میز DZ6020S',group:'single',size:'6020'},
    {code:'CUT-4020H-single',donor:'CUT-6020-2',name:'تک میز DZ4020h',group:'single',size:'4020',approx:true},
    {code:'CUT-6020-2',name:'تک میز DZ6020H',group:'single',size:'6020'},
    {code:'CUT-4020-LD-single',donor:'CUT-6020-3',name:'تک میز LD4020',group:'single',size:'4020',approx:true},
    {code:'CUT-6020-3',name:'تک میز LD6020',group:'single',size:'6020'},
    {code:'CUT-LARGE-single',donor:'CUT-6020-2',name:'تک میز سایز بزرگ',group:'single',size:'بزرگ',approx:true},
    {code:'CUT-3015-4',name:'دو میز DZ3015',group:'double',size:'3015'},
    {code:'CUT-3015-5',name:'دو میز LD3015',group:'double',size:'3015'},
    {code:'CUT-3015-6',name:'دو میز کابین‌دار DZ3015',group:'double',size:'3015',cabinet:true},
    {code:'CUT-6020-4',name:'دو میز DZ6020',group:'double',size:'6020'},
    {code:'CUT-6020-5',name:'دو میز LD6020',group:'double',size:'6020'},
    {code:'CUT-6020-6',name:'دو میز کابین‌دار DZ6020',group:'double',size:'6020',cabinet:true},
    {code:'CUT-LARGE-double',donor:'CUT-6020-4',name:'دو میز سایز بزرگ',group:'double',size:'بزرگ',approx:true},
    {code:'CUT-LARGE-cabin-double',donor:'CUT-6020-6',name:'دو میز کابین‌دار سایز بزرگ',group:'double',size:'بزرگ',cabinet:true,approx:true},
    {code:'CUT-3015-7',name:'تک میز 3015 + لوله‌بر',group:'tube',size:'3015'},
    {code:'CUT-3015-8',name:'دو میز 3015 + لوله‌بر',group:'tube',size:'3015'},
    {code:'CUT-3015-9',name:'دو میز کابین‌دار 3015 + لوله‌بر',group:'tube',size:'3015',cabinet:true},
    {code:'CUT-6020-7',name:'تک میز 6020 + لوله‌بر',group:'tube',size:'6020'},
    {code:'CUT-6020-8',name:'دو میز 6020 + لوله‌بر',group:'tube',size:'6020'},
    {code:'CUT-6020-9',name:'دو میز کابین‌دار 6020 + لوله‌بر',group:'tube',size:'6020',cabinet:true}
  ];
  const groups = {single:'برش تک میز',double:'برش دو میز',tube:'برش ورق و لوله'};
  const products = rows.map(row => ({...(byCode.get(row.code) || byCode.get(row.donor)),...row})).filter(product => product.image);
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  let activeGroup = 'all';

  window.renderHomeProducts = function renderHomeProductsByCuttingGroup() {
    const root = document.getElementById('home-products-grid');
    if (!root) return;
    root.innerHTML = Object.entries(groups).map(([key,title]) => {
      const product = products.find(item => item.group === key && !item.approx) || products.find(item => item.group === key);
      if (!product) return '';
      const image = new URL(product.image, location.href).href;
      const total = products.filter(item => item.group === key).length;
      return `<button type="button" onclick="navigateTo('products');setTimeout(()=>filterCatalog('${key}'),80)" class="card-hover text-right bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"><div class="h-48 bg-white flex items-center justify-center"><img src="${escape(image)}" alt="${escape(title)}" class="w-full h-full object-contain p-3" loading="lazy"></div><div class="p-5"><span class="text-xs text-accent font-semibold">دستگاه‌های برش لیزر</span><h3 class="text-lg font-bold text-brand dark:text-white mt-1">${title}</h3><span class="text-sm text-slate-500">${total} مدل · مشاهده محصولات ←</span></div></button>`;
    }).join('');
  };

  window.renderCatalogFilter = function renderMainCuttingFilters() {
    const root = document.getElementById('catalog-filter');
    if (!root) return;
    root.innerHTML = `<div class="mb-7"><span class="text-accent font-semibold text-sm">دسته‌بندی دستگاه‌های برش لیزر</span><div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">${Object.entries(groups).map(([key,title]) => `<button type="button" onclick="filterCatalog('${key}')" class="card-hover text-right rounded-2xl p-5 border ${activeGroup===key?'border-accent bg-accent/5':'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'}"><span class="text-accent text-2xl ml-2">${key==='single'?'▤':key==='double'?'▥':'↔'}</span><strong class="text-brand dark:text-white">${title}</strong><span class="block text-xs text-slate-500 mt-2">${products.filter(product=>product.group===key).length} مدل</span></button>`).join('')}</div><button type="button" onclick="filterCatalog('all')" class="mt-3 text-sm text-accent font-semibold">نمایش همهٔ مدل‌های برش</button></div>`;
  };

  window.filterCatalog = function filterMainCuttingCatalog(group='all') {
    activeGroup = group;
    window.activeCatalogFilter = group;
    window.renderCatalogFilter();
    window.renderAllProducts(group);
  };

  window.renderAllProducts = function renderMainCuttingProducts(group) {
    if (group) activeGroup = group;
    const root = document.getElementById('all-products-grid');
    if (!root) return;
    const query = (document.getElementById('catalog-search')?.value || '').trim().toLocaleLowerCase();
    const visible = products.filter(product => (activeGroup==='all' || product.group===activeGroup) && `${product.name} ${product.code} ${product.size}`.toLocaleLowerCase().includes(query));
    root.innerHTML = visible.map(product => {
      const image = new URL(product.image, location.href).href;
      const note = product.approx ? 'تصویر مرجع نزدیک از همان خانواده؛ تصویر اختصاصی این مدل در کتابخانه موجود نیست.' : 'تصویر متصل از کتابخانهٔ محصولات سهند لیزر.';
      return `<article class="product-mini-card bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 card-hover"><div class="visual w-full"><img src="${escape(image)}" alt="${escape(product.name)}" loading="lazy" class="object-contain"></div><div class="p-5 flex-1 flex flex-col"><div class="flex items-center justify-between gap-2 mb-2"><span class="product-code">${escape(product.code)}</span><span class="text-[11px] text-slate-500">${groups[product.group]} · ${product.size==='بزرگ'?'سایز بزرگ':product.size}</span></div><h3 class="font-bold text-brand dark:text-white leading-7 mb-2">${escape(product.name)}</h3><p class="text-xs text-slate-500 leading-6 mb-4">${note}</p><button onclick="openInquiry('${escape(product.code)}','${escape(product.name)}')" class="mt-auto inline-flex items-center gap-2 text-accent font-bold text-sm">استعلام دربارهٔ این مدل <i class="fa-solid fa-arrow-left"></i></button></div></article>`;
    }).join('') || '<p class="catalog-empty">مدلی با این جست‌وجو پیدا نشد.</p>';
    const count = document.getElementById('catalog-count');
    if (count) count.textContent = `${visible.length} مدل`;
  };

  document.getElementById('catalog-search')?.addEventListener('input', () => window.renderAllProducts());
  window.renderCatalogFilter();
  window.renderHomeProducts();
  window.renderAllProducts('all');
})();
