const fs = require('fs');
const path = 'docs/catalog-completion/verified-additions.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
data['CLEAN-GENERIC'] = {
  url: 'assets/catalog-completion/inspection/Cleaning-Machine.jpg',
  title: 'User-supplied Sahand Laser cleaning-machine poster; family-level artwork evidence',
  scope: 'user_supplied_artwork',
  sourceScope: 'user_supplied_artwork_family_reference',
  facts: [
    ['توان‌های درج‌شده در پوستر', '۱٫۵ / ۲ / ۳ کیلووات؛ ادعای پوستر، نه تطبیق هر مدل'],
    ['طول موج درج‌شده در پوستر', '۱۰۸۰ نانومتر؛ ادعای پوستر'],
    ['سرعت درج‌شده در پوستر', '۰ تا ۱۲۰ میلی‌متر بر ثانیه؛ شرایط آزمون مشخص نیست'],
    ['وزن درج‌شده در پوستر', '۲۰۰ کیلوگرم؛ مدل دقیق و شرایط اندازه‌گیری مشخص نیست'],
    ['محدودیت انتقال', 'اطلاعات پوستر به CL-001 تا CL-004 یا هر واحد نصب‌شده به‌صورت خودکار منتقل نمی‌شود']
  ]
};
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');

