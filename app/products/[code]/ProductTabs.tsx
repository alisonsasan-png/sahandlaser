'use client';

import { useState } from 'react';

export default function ProductTabs({ code }: { code: string }) {
  const [tab, setTab] = useState('specs');
  const tabs = [
    ['specs', 'مشخصات فنی'],
    ['usage', 'کاربردها'],
    ['models', 'مدل‌های مرتبط'],
    ['description', 'توضیحات'],
  ];
  return <div className="product-tabs"><div className="tab-buttons">{tabs.map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}</div>{tab==='specs'&&<div className="tab-panel"><div className="spec-row"><span>کد محصول</span><b>{code}</b></div><div className="spec-row"><span>گروه محصول</span><b>تجهیزات لیزری صنعتی</b></div><div className="spec-row"><span>وضعیت اطلاعات</span><b>قابل تکمیل با دیتاشیت نهایی</b></div></div>}{tab==='usage'&&<div className="tab-panel"><p>مناسب برای استفاده در خطوط تولید، کارگاه‌ها و پروژه‌های صنعتی مرتبط با فناوری لیزر.</p><div className="advantage-list"><span>دقت بالا</span><span>کاربری صنعتی</span><span>پشتیبانی تخصصی</span></div></div>}{tab==='models'&&<div className="tab-panel"><p>مدل‌های هم‌خانواده در بخش پایین همین صفحه قابل مشاهده هستند.</p></div>}{tab==='description'&&<div className="tab-panel"><p>اطلاعات تکمیلی این محصول، مشخصات فنی و فایل‌های مرتبط پس از تأیید نهایی به صفحه اضافه خواهد شد.</p></div>}</div>;
}