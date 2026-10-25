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
window.PREVIEW56_EXISTING_XRAYS={
  "CP-RAY-BM110":"assets/catalog-v2/CP-RAY-BM110/xray-web-v5.jpg",
  "ML-007":"assets/preview-56-xray/ML-007-concept-v1.jpg",
  "CUT-6020-1":"assets/preview-56-xray/CUT-6020-1-concept-v1.jpg"
};
window.PREVIEW56_ORIGINAL_FAMILY_SHEETS={
  "CUT-3015-3":["CUT-3015-1"],
  "CUT-3015-5":["double-3015-pro"],
  "CUT-3015-7":["single-3015-standard-rotary"],
  "CUT-3015-8":["double-3015-standard-rotary"],
  "CUT-6020-3":["CUT-6020-1"],
  "CUT-6020-5":["double-6020-pro"],
  "CUT-6020-7":["single-6020-pro-rotary"],
  "CUT-6020-8":["double-6020-standard-rotary"],
  "CL-003":["cleaning-fiber-pulsed-water","cleaning-fiber-pulsed-air"],
  "CLEAN-GENERIC":["cleaning-fiber-continuous","cleaning-fiber-pulsed-water","cleaning-fiber-pulsed-air"],
  "MK-FIBER-GENERIC":["marking-fiber-desktop","marking-fiber-portable","marking-fiber-flying","marking-fiber-table"],
  "ML-001":["marking-fiber-desktop"],"ML-002":["marking-fiber-desktop"],
  "ML-003":["marking-fiber-desktop"],"ML-008":["marking-fiber-desktop"],
  "WELD-1500":["weld-fiber-base"],"WELD-2000":["weld-fiber-base"],
  "WELD-3000":["weld-fiber-base"],"WL-002":["weld-fiber-base"],
  "WL-004":["weld-fiber-air-cooled"]
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
  const matching=preview56Catalog.find(p=>p.code===item.code&&p.category===item.category);
  const verifiedMatch=matching&&item.number!==1;
  const sizeMatch=item.name.match(/(?:3015|6020|6025|1325|1390|1610|9060|6040)/);
  const knownSize=sizeMatch?sizeMatch[0]:'برای این مدل تأیید نشده';
  const table=/تک.?میز/.test(item.name)?'تک میز':/دو.?میز/.test(item.name)?'دو میز':'در نام مدل مشخص نشده';
  const cabin=/کابین/.test(item.name)?'کابین‌دار':'در نام مدل مشخص نشده';
  const tube=/لوله/.test(item.name)?'در نام مدل ذکر شده':'در نام مدل مشخص نشده';
  const usage={cutting:'برش',marking:'حکاکی و مارکینگ',welding:'جوش',cleaning:'تمیزکاری'}[item.category]||item.category;
  const derivedSpecs=[
    {label:'مدل',value:item.name,scope:'identity'},
    {label:'گروه ابعادی',value:knownSize,scope:sizeMatch?'name_only':'unverified'},
    {label:'کابین',value:cabin,scope:'name_only'},
    {label:'لوله‌بر',value:tube,scope:'name_only'},
    {label:'گروه ابعادی محصول',value:knownSize,scope:sizeMatch?'name_only':'unverified'},
    {label:'ساختار میز',value:table,scope:'name_only'},
    {label:'پیکربندی کابین در نام مدل',value:cabin,scope:'name_only'},
    {label:'گروه کاربرد محصول',value:usage,scope:'identity'}
  ];
  const specByLabel=new Map(derivedSpecs.map(s=>[s.label,s]));
  if(verifiedMatch)for(const s of matching.specs||[])specByLabel.set(s.label,s);
  const mergedSpecs=[...specByLabel.values()];
  preview56Catalog.push({
    code,name:item.name,category:item.category,
    subgroup:'محصولات تصویری پیش‌نمایش ۳۲',
    description:verifiedMatch?matching.description:'تصویر اصلی و X-Ray بازسازی‌شدهٔ این محصول در همین صفحه قرار دارد. ابعاد فقط در صورت وجود نقشهٔ منطبق یا مرجع خانواده نمایش داده می‌شوند.',
    specs:mergedSpecs,
    image:item.image,imageLabel:'تصویر محصول',imageDecision:'use',
    preview56Number:item.number,preview56OriginalCode:item.code,
    ...(sheet?{sheet,sheetId:sheet.id}:{}),
    configuration:{}
  });
}
