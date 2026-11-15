'use client';

import { FormEvent, useState } from 'react';

export default function InquiryForm({ productCode }: { productCode: string }) {
  const [open, setOpen] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `سلام، برای محصول ${productCode} درخواست استعلام قیمت دارم.
نام و نام خانوادگی: ${data.get('name')}
شماره تماس: ${data.get('phone')}
شهر: ${data.get('city')}
نوع درخواست: ${data.get('requestType')}
توضیحات: ${data.get('message') || '—'}`;
    window.location.href = `https://wa.me/989131320012?text=${encodeURIComponent(text)}`;
  }
  return <div id="inquiry"><button className="primary-button quote-trigger" type="button" onClick={() => setOpen(true)}>استعلام قیمت و مشاوره</button>{open&&<div className="inquiry-overlay" role="dialog" aria-modal="true"><form className="inquiry-form" onSubmit={submit}><button className="inquiry-close" type="button" onClick={() => setOpen(false)} aria-label="بستن">×</button><p className="eyebrow">REQUEST A QUOTE</p><h2>فرم استعلام قیمت</h2><p className="inquiry-help">لطفاً اطلاعات زیر را تکمیل کنید؛ پس از ارسال، درخواست شما در واتساپ ارسال می‌شود.</p><label>نام و نام خانوادگی<input name="name" required /></label><label>شماره تماس<input name="phone" type="tel" required /></label><label>شهر / کشور<input name="city" required /></label><label>نوع درخواست<select name="requestType" required defaultValue="خرید دستگاه"><option>خرید دستگاه</option><option>مشاوره فنی</option><option>خدمات و تعمیرات</option><option>قطعات و لوازم</option></select></label><label>توضیحات<textarea name="message" rows={4} placeholder="مدل، کاربرد یا نیاز خود را بنویسید" /></label><button className="primary-button" type="submit">ارسال درخواست به واتساپ</button></form></div>}</div>;
}