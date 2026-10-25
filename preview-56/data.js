/* Preview 56: product-number identity takes priority over duplicate catalog codes.
   Only exact model matches are marked exact. Other sheets are clearly family references. */
window.PREVIEW56_SHEET_MATCHES={23:"marking-fiber-portable",27:"CUT-3015-1"};
window.PREVIEW56_FAMILY_SHEETS={
  1:["CUT-3015-1"],
  4:["single-3015-standard-rotary"],
  8:["weld-fiber-base"],
  17:["marking-fiber-desktop"],18:["marking-fiber-desktop"],
  19:["marking-fiber-desktop"],20:["marking-fiber-desktop"],
  24:["marking-fiber-table"],25:["weld-fiber-base"],
  28:["cabin-3015-pro"],29:["single-3015-standard-rotary"],
  30:["single-6020-pro-rotary"],32:["cleaning-fiber-continuous"]
};
window.PREVIEW56_CATEGORY_LABELS={cutting:"برش",marking:"حکاکی و مارکینگ",welding:"جوش",cleaning:"تمیزکاری"};

/* Register all 32 illustrated items as genuine product routes in the Preview 56 site.
   Stable preview-specific route IDs avoid the two duplicate source codes. */
window.PREVIEW56_ROUTE_CODE=number=>'P56-'+String(number).padStart(2,'0');
const preview56SheetRegistry=window.PREVIEW_DIMENSIONAL_SHEETS||[];
const preview56Catalog=window.PREVIEW29_PRODUCTS||[];
for(const item of window.PREVIEW32_IMAGES||[]){
  const code=window.PREVIEW56_ROUTE_CODE(item.number);
  if(preview56Catalog.some(p=>p.code===code))continue;
  const sheetId=window.PREVIEW56_SHEET_MATCHES[item.number];
  const sheet=sheetId?preview56SheetRegistry.find(s=>s.id===sheetId):undefined;
  preview56Catalog.push({
    code,name:item.name,category:item.category,
    subgroup:'محصولات تصویری پیش‌نمایش ۳۲',
    description:'تصویر اصلی و X-Ray بازسازی‌شدهٔ این محصول در همین صفحه قرار دارد. ابعاد فقط در صورت وجود نقشهٔ منطبق یا مرجع خانواده نمایش داده می‌شوند.',
    specs:[{label:'شناسه محصول',value:item.code,scope:'identity'}],
    image:item.image,imageLabel:'تصویر محصول',imageDecision:'use',
    preview56Number:item.number,preview56OriginalCode:item.code,
    ...(sheet?{sheet,sheetId:sheet.id}:{}),
    configuration:{}
  });
}
