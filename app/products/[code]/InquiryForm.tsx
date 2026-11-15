'use client';

import { FormEvent, useState } from 'react';

export default function InquiryForm({ productCode }: { productCode: string }) {
  const [open, setOpen] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') || '');
    const phone = String(data.get('phone') || '');
    const message = String(data.get('message') || '');
    const text = `سلام، برای محصول ${productCode} درخواست استعلام قیمت دارم.
نام: ${name}
تلفن: ${phone}
توضیحات: ${message}`;
    window.open(`https://wa.me/989131320012?text=${encodeURIComponent(text)}`, '_blank');
  }
  return <><button className="primary-button quote-trigger" type="button" onClick={() => setOpen(true)}>استعلام قیمت و مشاوره</button>{open&&<div className="inquiry-overlay" role="dialog" aria-modal="true"><form className="inquiry-form" onSubmit={submit}><button className="inquiry-close" type="button" onClick={() => setOpen(false)} aria-label="بستن">×</button><p className="eyebrow">REQUEST A QUOTE</p><h2>استعلام قیمت {productCode}</h2><label>نام و نام خانوادگی<input name="name" required /></label><label>شماره تماس<input name="phone" type="tel" required /></label><label>توضیحات شما<textarea name="message" rows={4} /></label><button className="primary-button" type="submit">ارسال در واتساپ</button><a className="secondary-button" href="https://eitaa.com/sahandlaser" target="_blank" rel="noreferrer">ارتباط در ایتا</a></form></div>}</>;
}