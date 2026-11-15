import Link from 'next/link';
import { products } from '../../lib/products';

export default function ProductsPage() {
  return <main><header className="site-header"><Link className="brand" href="/"><span className="brand-mark">SL</span><span><b>سهند لیزر</b><small>SAHAND LASER</small></span></Link><Link className="text-link" href="/">بازگشت به صفحه اصلی ←</Link></header><section className="section"><p className="eyebrow">PRODUCT CATALOG</p><h1>کاتالوگ محصولات</h1><p className="hero-text">محصولات دارای تصویر اصلی، دسته‌بندی‌شده برای انتخاب و بررسی دقیق.</p><div className="product-grid">{products.map((p)=><Link className="product-card" href={`/products/${p.code}`} key={p.code}><div className="product-placeholder"><span>SL</span><small>PRODUCT PROFILE</small></div><span className="eyebrow">{p.code}</span><h2 dir="auto">{p.title}</h2><p dir="auto">{p.category}</p><span className="card-link">مشاهده صفحه محصول ↗</span></Link>)}</div></section></main>;
}