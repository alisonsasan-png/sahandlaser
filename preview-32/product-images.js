/* Numbered, model-labelled preview images supplied for Preview 32. These are
   reconstructed visuals; the labels do not establish technical specifications. */
window.PREVIEW32_IMAGES = [
  [1,'CUT-3015-1','برش فایبر تک‌میز 3015','cutting'],
  [2,'LF6020T','برش لوله فایبر LF6020T','cutting'],
  [3,'LF6025T','برش لوله فایبر LF6025T','cutting'],
  [4,'LF3015ET','برش ورق و لوله LF3015ET','cutting'],
  [5,'LF6016E','برش لوله فایبر LF6016E','cutting'],
  [6,'LF12025GH','برش فایبر سایز بزرگ LF12025GH','cutting'],
  [7,'SHOWCASE-32-07','نمای مجموعه دستگاه‌های لیزر','cutting'],
  [8,'LF20-30-50','دستگاه دستی فایبر LF20/30/50','welding'],
  [9,'LC1390','برش لیزر CO₂ مدل LC1390','cutting'],
  [10,'LC1610','برش لیزر CO₂ مدل LC1610','cutting'],
  [11,'LC1325','برش لیزر CO₂ مدل LC1325','cutting'],
  [12,'LC9060','برش لیزر CO₂ مدل LC9060','cutting'],
  [13,'LC6040','برش لیزر CO₂ مدل LC6040','cutting'],
  [14,'LC1390-PRO','برش لیزر CO₂ مدل LC1390 Pro','cutting'],
  [15,'LC1610-PRO','برش لیزر CO₂ مدل LC1610 Pro','cutting'],
  [16,'LC6040','برش لیزر CO₂ مدل LC6040 ـ نمای کارگاهی','cutting'],
  [17,'LF20-MARK','مارکینگ فایبر LF20','marking'],
  [18,'ML-001','مارکینگ فایبر LF30','marking'],
  [19,'ML-002','مارکینگ فایبر LF50','marking'],
  [20,'ML-008','مارکینگ فایبر MOPA مدل LF100','marking'],
  [21,'UV-MARK-3W5W','مارکینگ UV مدل UV3W/5W','marking'],
  [22,'CO2-MARK','مارکینگ لیزر CO₂','marking'],
  [23,'ML-005','مارکینگ فایبر پرتابل','marking'],
  [24,'SPLIT-MARK','مارکینگ فایبر دو تکه','marking'],
  [25,'LR30','جوش لیزر دستی LR30','welding'],
  [26,'LG60','جوش لیزر اتوماتیک LG60','welding'],
  [27,'CUT-3015-1','برش فایبر DZ3015S','cutting'],
  [28,'DZ3015E','برش فایبر کابین‌دار DZ3015E','cutting'],
  [29,'DZT3015T','برش ورق و لوله DZT3015T','cutting'],
  [30,'DZT6020T','برش ورق و لوله DZT6020T','cutting'],
  [31,'DW3015','جوش لیزر ورق DW3015','welding'],
  [32,'DC3000','تمیزکاری لیزر فایبر DC3000','cleaning']
].map(([number,code,name,category])=>({
  number,code,name,category,
  image:`assets/preview-32-products/${String(number).padStart(2,'0')}.jpg`
}));
