(function () {
  const products = window.SAHAND_PRODUCTS;
  const codes = ['CT-002', 'CT-001', 'ML-004', 'ML-005', 'ML-007', 'ML-009'];
  for (const p of Object.values(products)) {
    if (p.media) { p.media.frames360 = []; p.media.model = null; }
  }
  for (const code of codes) {
    const p = products[code]; if (!p) continue;
    const url = new URL('preview-2/assets/' + code + '-commercial-v2.png', document.baseURI).href;
    p.images = [url]; p.gallery = [];
    p.media = p.media || {}; p.media.images = [url];
    p.media.caption = { fa: '\u062a\u0635\u0648\u06cc\u0631 \u062a\u062c\u0627\u0631\u06cc \u0628\u0627\u0632\u0633\u0627\u0632\u06cc\u200c\u0634\u062f\u0647 \u0627\u0632 \u0639\u06a9\u0633 \u0648\u0627\u0642\u0639\u06cc \u062f\u0633\u062a\u06af\u0627\u0647', en: 'Commercial reconstruction from the actual product photograph.' };
  }
const p=products['CT-001'];
if(p){
p.media.notes=Object.assign({},p.media.notes,{
technical:{fa:"ابعاد بدنه ثبت‌شده: 4260 × 2260 × 700 میلی‌متر. ارتفاع کل و جزئیات هندسی تخمینی‌اند؛ نقشه ساخت نیست."},
exploded:{fa:"بازسازی تصویری اجزا؛ اتصالات و جزئیات پنهان تأیید نشده‌اند. این تصویر نقشه مونتاژ دقیق نیست."}
});
p.specs.push({label:{fa:"سیستم انتقال حرکت (مرجع خانواده)"},value:"Dual Rack & Pinion",scope:"family_reference",source:"https://sahandlaser.com/product-test/"});
p.specs.push({label:{fa:"اجزای برق (گزینه کاتالوگ)"},value:"Schneider",scope:"family_reference",source:"https://sahandlaser.com/product-test/"});
p.specs.push({label:{fa:"اجزای پنوماتیک (گزینه کاتالوگ)"},value:"SMC",scope:"family_reference",source:"https://sahandlaser.com/product-test/"});
}
})();