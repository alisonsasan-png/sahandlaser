import Link from 'next/link';
import { Suspense } from 'react';
import ProductCatalog from '../../components/ProductCatalog';

export default function ProductsPage() {
  return <main><header className="site-header"><Link className="brand" href="/"><span className="brand-mark">SL</span><span><b>سهند لیزر</b><small>SAHAND LASER</small></span></Link><Link className="text-link" href="/">بازگشت به صفحه اصلی ←</Link></header><section className="section"><p className="eyebrow">PRODUCT CATALOG</p><h1>کاتالوگ محصولات</h1><p className="hero-text">محصولات دارای تصویر اصلی، دسته‌بندی‌شده برای انتخاب و بررسی دقیق.</p><Suspense fallback={<p className="catalog-count">در حال آماده‌سازی کاتالوگ…</p>}><ProductCatalog /></Suspense></section></main>;
}