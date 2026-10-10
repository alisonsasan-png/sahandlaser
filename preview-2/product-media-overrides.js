(function () {
  const products = window.SAHAND_PRODUCTS;
  const codes = ['CT-003', 'CT-006', 'CT-009', 'CT-002', 'CT-001', 'ML-004', 'ML-005', 'ML-007', 'ML-009'];
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
(function(){const p=window.SAHAND_PRODUCTS['CT-002'];if(!p)return;p.specs=[{"label":{"fa":"برند"},"value":"DZ LASER","scope":"identity","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"مدل"},"value":"SH3015","scope":"identity","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"ساختار"},"value":"دو میز تبادلی، سری استاندارد","scope":"identity","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"کنترلرهای معرفی‌شدهٔ خانواده"},"value":"CypCut 4000 / 8000","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"سورس‌های معرفی‌شدهٔ خانواده"},"value":"IPG / RAYCUS / MAX؛ 6–30 kW","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"سیستم انتقال حرکت"},"value":"Dual Rack & Pinion","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"ریل معرفی‌شده"},"value":"HIWIN","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"سروو معرفی‌شده"},"value":"Yaskawa","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"برق خانواده"},"value":"سه‌فاز 380 V","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"دقت موقعیت‌یابی اعلام‌شدهٔ خانواده"},"value":"±0.02 mm","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"سرعت جابه‌جایی خانواده"},"value":"120–150 m/min","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"شتاب خانواده"},"value":"1.5–5 G","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"},{"label":{"fa":"رطوبت کاری اعلام‌شده"},"value":"5–55%","scope":"family_reference","source":"https://sahandlaser.com/دستگاه-برش-لیزر-فایبر-دومیز-3015-استاندار/"}];p.description.fa=["دستگاه دو میز SH3015 برای برش ورق فلزی معرفی شده است؛ میز دوم امکان آماده‌سازی ورق در کنار فرایند برش را فراهم می‌کند.","مشخصات عددی منتشرشده در منبع به خانواده دستگاه مربوط‌اند. توان نصب‌شده، وزن، ابعاد کلی و مدل دقیق اجزای این پیکربندی هنوز تأیید نشده‌اند."];p.review="مشخصات خانواده از صفحه رسمی وارد شده؛ ابعاد اختصاصی، وزن دقیق و نقشه مونتاژ همچنان نیازمند مدرک‌اند.";})();