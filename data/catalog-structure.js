(function () {
  const categories = [
    { id: 'cutting', icon: 'fa-scissors', bg: 'gradient-brand', nameKey: 'cat_cutting', descKey: 'cat_cutting_desc', featuredProduct: 'CT-001', kind: 'machine' },
    { id: 'welding', icon: 'fa-fire-flame-curved', bg: 'bg-gradient-to-br from-red-700 to-red-900', nameKey: 'cat_welding', descKey: 'cat_welding_desc', featuredProduct: 'WL-001', kind: 'machine' },
    { id: 'marking', icon: 'fa-pen-nib', bg: 'bg-gradient-to-br from-slate-700 to-slate-900', nameKey: 'cat_marking', descKey: 'cat_marking_desc', featuredProduct: 'ML-001', kind: 'machine' },
    { id: 'cleaning', icon: 'fa-spray-can-sparkles', bg: 'bg-gradient-to-br from-emerald-700 to-emerald-900', nameKey: 'cat_cleaning', descKey: 'cat_cleaning_desc', featuredProduct: 'CL-001', kind: 'machine' },
    { id: 'source', icon: 'fa-microchip', bg: 'bg-gradient-to-br from-cyan-700 to-cyan-900', nameKey: 'cat_source', descKey: 'cat_source_desc', featuredProduct: 'FS001', kind: 'component' },
    { id: 'head', icon: 'fa-crosshairs', bg: 'bg-gradient-to-br from-violet-700 to-violet-900', nameKey: 'cat_head', descKey: 'cat_head_desc', featuredProduct: 'CH001', kind: 'component' },
    { id: 'parts', icon: 'fa-gears', bg: 'bg-gradient-to-br from-amber-700 to-amber-900', nameKey: 'cat_parts', descKey: 'cat_parts_desc', featuredProduct: 'CC001', kind: 'component' },
    { id: 'consumables', icon: 'fa-screwdriver', bg: 'bg-gradient-to-br from-pink-700 to-pink-900', nameKey: 'cat_consumables', descKey: 'cat_consumables_desc', featuredProduct: 'CN001', kind: 'component' }
  ];

  const menuPresets = {
    current: {
      products: ['cutting', 'welding', 'marking', 'cleaning', 'source', 'head', 'parts', 'consumables']
    },
    requested: {
      products: ['cutting', 'welding', 'cleaning'],
      parts: [
        { id: 'controller', label: 'کنترلر', categories: ['head'], match: ['CTRL-'] },
        { id: 'laser-head', label: 'هد', categories: ['head'], match: ['CH', 'CP-RAY-'] },
        { id: 'laser-source', label: 'سورس لیزر', categories: ['source'] },
        { id: 'other-parts', label: 'سایر قطعات', categories: ['parts', 'consumables'], children: [
          { id: 'cooling', label: 'چیلر و خنک‌کاری', match: ['CH-'] },
          { id: 'optics', label: 'اپتیک و مصرفی', categories: ['consumables'] },
          { id: 'motion-air', label: 'حرکت، برق و پنوماتیک', categories: ['parts'] }
        ] }
      ],
      unplaced: ['marking']
    }
  };

  window.SAHAND_CATALOG = Object.freeze({
    version: 1,
    categories: Object.freeze(categories),
    menuPresets: Object.freeze(menuPresets),
    productRoute: productCode => `product=${encodeURIComponent(productCode)}`
  });
}());
