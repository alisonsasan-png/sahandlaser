/* Product-specific commercial descriptions built only from catalog identity and supplied series options. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SahandProductContent=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  function cutting(product){
    const numbered=['3015','6020'].includes(product.family);
    if(!numbered)return null;
    const tables=product.name.includes('دو میز')?2:1;
    const cabinet=product.name.includes('کابین');
    const tube=product.name.includes('+ لوله');
    const configuration={sizeFamily:product.family,tableCount:tables,cabinet,tubeAttachment:tube,source:'user_requested_product_names'};
    const description=[
      product.name+' از خانواده برش '+product.family+'، با پیکربندی '+(tables===2?'دو میز':'تک میز')+(cabinet?' و کابین':'')+(tube?' و بخش لوله‌بر':'')+' در فهرست محصولات سهند لیزر قرار دارد.',
      tables===2?'در انتخاب پیکربندی دو میز، زمان بارگذاری و تخلیه را کنار زمان برش بررسی کنید. چیدمان کارگاه باید دسترسی به میز فعال و میز تبادل را فراهم کند.':'در انتخاب پیکربندی تک میز، دسترسی اپراتور برای بارگذاری، تخلیه و جابه‌جایی ورق را در برنامه تولید در نظر بگیرید.',
      tube?'این مدل در گروه ورق‌بر همراه لوله‌بر قرار دارد. علاوه بر مشخصات ورق، مقطع و طول لوله، نوع سه‌نظام و تکیه‌گاه موردنیاز را هنگام انتخاب پیکربندی مشخص کنید.':'این مدل در مسیر انتخاب دستگاه‌های ورق‌بر قرار دارد. جنس، ضخامت متداول قطعه و نیاز به عملیات بعدی را برای انتخاب توان و تجهیزات ثبت کنید.'
    ];
    if(cabinet)description.push('کابین بخشی از پیکربندی معرفی‌شده این مدل است. جزئیات پنجره‌ها، اینترلاک، تهویه و استاندارد حفاظتی باید از مشخصات همان نسخه بررسی شوند؛ وجود کابین به‌تنهایی بیانگر گواهی ایمنی نیست.');
    const specs=[{label:'گروه ابعادی محصول',value:product.family,scope:'user_requested_taxonomy'},{label:'ساختار میز',value:tables===2?'دو میز':'تک میز',scope:'user_requested_taxonomy'},{label:'پیکربندی کابین در نام مدل',value:cabinet?'کابین‌دار':'بدون کابین در نام مدل',scope:'user_requested_taxonomy'},{label:'گروه کاربرد محصول',value:tube?'ورق‌بر + لوله‌بر':'ورق‌بر',scope:'user_requested_taxonomy'}];
    const questions=['جنس و ضخامت متداول ورق و ابعاد قطعه چیست؟',tables===2?'زمان بارگذاری و تخلیه و فضای میز تبادل چقدر است؟':'روش بارگذاری و تخلیه و فضای دسترسی میز چگونه است؟',tube?'مقطع، طول و وزن لوله و نوع سه‌نظام موردنیاز چیست؟':'کیفیت لبه، عملیات بعدی و حجم تولید موردنظر چیست؟'];
    return {configuration,description,specs,questions};
  }
  const roles={
    'WL-001':{topic:'سری Smart / Mini 4-in-1',question:'کدام عملکردهای مجموعه چهارکاره و چه متریالی موردنیاز است؟'},
    'WL-002':{topic:'جوش دستی Handheld',question:'اپراتور با چه شکل اتصال و حجم کاری کار می‌کند؟'},
    'WL-003':{topic:'دستگاه جوش هواخنک',question:'شرایط محیط، چرخه کاری و محدودیت جابه‌جایی چیست؟'},
    'WL-004':{topic:'دستگاه جوش هواخنک پرتابل',question:'دستگاه در چند محل استفاده می‌شود و شرایط برق هر محل چیست؟'},
    'WL-005':{topic:'جوش نقطه‌ای QCW',question:'توان متوسط، توان پیک و انرژی پالس موردنیاز اتصال چیست؟'},
    'WL-006':{topic:'سری جوش HP',question:'مدل کامل سورس و پیکربندی دقیق سری HP کدام است؟'},
    'WL-007':{topic:'سری جوش Modern',question:'شکل اتصال، روش کار و تجهیزات جانبی موردنیاز چیست؟'},
    'WL-008':{topic:'جوش لیزر رباتیک',question:'مسیر حرکت، فیکسچر قطعه و نیاز اتصال به خط تولید چیست؟'},
    'WL-009':{topic:'جوش لیزر زیورآلات',question:'جنس، اندازه قطعه و ناحیه اتصال زیورآلات چیست؟'},
    'WL-010':{topic:'جوش حروف برجسته',question:'جنس و ضخامت حروف و شکل اتصال دیواره به کف چیست؟'}
  };
  function enrich(product){
    const cut=cutting(product);if(cut){product.configuration=cut.configuration;product.description=cut.description;product.specs=product.specs.filter(s=>!cut.specs.some(n=>n.label===s.label)).concat(cut.specs);product.consultationQuestions=cut.questions;}
    if(roles[product.code]){const role=roles[product.code];product.description=[product.name+' در گروه '+role.topic+' سهند لیزر قرار دارد.','انتخاب این خانواده از نوع اتصال و روند تولید شروع می‌شود؛ نام سری به‌تنهایی توان، نوع سورس یا تمام تجهیزات همراه یک دستگاه را تعیین نمی‌کند.'];product.consultationQuestions=[role.question,'جنس و ضخامت قطعه و کیفیت اتصال موردنظر چیست؟','توان، هد، تغذیه سیم و تجهیزات همراه کدام پیکربندی موردنظر است؟'];}
    return product;
  }
  return {enrich,cutting};
});

