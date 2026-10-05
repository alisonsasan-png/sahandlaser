# Sahand Laser — clean rebuild

نسخه جدید و مستقل سایت سهند لیزر.

## معماری فعال

`Database -> Build -> Quick Check -> Deploy`

- دیتابیس مرجع: `data/Sahand_Laser_Master_Knowledge_Base_v1_6.json`
- داده اجرایی محصولات: `data/product-site-master-v1.json`
- الگوی صفحه محصول: `data/product-page-layout-revisions.json`
- سیاست پروژه: `data/project-runtime-policy-v2.json`
- نسخه قبل از پاک‌سازی: شاخه `archive/pre-clean-rebuild-2026-10-05`

## قواعد نسخه جدید

- `sahandlaser.com` وابستگی اجرایی این سایت نیست و بدون دستور صریح کاربر بررسی نمی‌شود.
- URLهای قدیمی رسانه‌ای که در بانک آرشیوی وجود دارند در Runtime بارگذاری نمی‌شوند.
- اطلاعات review/pending حدس زده یا به‌عنوان مشخصات قطعی نمایش داده نمی‌شوند.
- ساختار ۱۴-Agent، Reality Checker زنجیره‌ای و workflowهای سنگین نسخه قبلی فعال نیستند.
- صفحات محصول ساختار ثابت دارند: 360 درجه، مشخصات تأییدشده، نقشه فنی، نمای انفجاری، مدل سه‌بعدی و نمونه‌کار واقعی.

برای Quick Check رابط، آدرس سایت را با `?debug=1` باز کنید.
