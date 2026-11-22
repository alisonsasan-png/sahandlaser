(()=>{
  const main=document.querySelector('main');
  if(!main)return;
  const route=location.pathname.split('/').pop()||'index.html';
  if(route==='index.html'){
    const section=document.createElement('section');section.className='preview10-hub';
    section.innerHTML='<div class="shell"><span class="eyebrow">SAHAND / ENGINEERING & SUPPORT</span><h2>از انتخاب دستگاه تا پشتیبانی تولید</h2><p>مدل مناسب را بررسی کنید، مشخصات فنی را ببینید و برای راه‌اندازی و نگهداری با ما در تماس باشید.</p><div class="preview10-hub-grid"><a href="chooser.html"><b>راهنمای انتخاب</b><span>بر اساس نوع کار و قطعه</span></a><a href="products.html"><b>کاتالوگ تجهیزات</b><span>دستگاه‌ها و قطعات</span></a><a href="catalog-data.html"><b>اطلاعات فنی کاتالوگ</b><span>مدل‌ها و ابعاد درج‌شده</span></a><a href="services.html"><b>خدمات و پشتیبانی</b><span>نصب، آموزش و تعمیر</span></a><a href="media.html"><b>ویدیوهای دستگاه‌ها</b><span>نگاهی به فرایندهای صنعتی</span></a><a href="articles.html"><b>دانش لیزر</b><span>مقالات و راهنماها</span></a></div></div>';
    main.append(section);
  }
  if(route==='product.html'){
    const info=main.querySelector('.product-information');
    if(info){const box=document.createElement('aside');box.className='preview10-note';box.innerHTML='<strong>راهنمای کاتالوگ و ابعاد</strong><p>برای مرور اطلاعات خانواده‌های دستگاه و داده‌های ابعادی، <a href="catalog-data.html">اطلاعات فنی کاتالوگ</a> را ببینید.</p>';info.append(box);}
  }
})();
