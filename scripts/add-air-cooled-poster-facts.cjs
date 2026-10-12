const fs = require('fs');
const path = 'docs/catalog-completion/verified-additions.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
data['WL-003'] = {
  url: 'assets/catalog-completion/inspection/Air-cooled-welding-machine.jpg',
  title: 'User-supplied air-cooled laser welding poster; WL-003 family artwork evidence',
  scope: 'user_supplied_artwork',
  sourceScope: 'user_supplied_artwork_family_reference',
  facts: [
    ['نوع محصول درج‌شده در پوستر', 'جوش لیزر هواخنک'],
    ['توان‌های درج‌شده در پوستر', '۸۰۰ تا ۱۵۰۰ وات؛ مدل و شرایط دقیق تفکیک نشده است'],
    ['محدودیت انتقال', 'این ادعاها به WL-004 یا دیگر مدل‌های جوش منتقل نمی‌شوند']
  ]
};
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');

