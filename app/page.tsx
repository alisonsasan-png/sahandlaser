import { categories } from '../lib/catalog';

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="سهند لیزر، صفحه اصلی"><span className="brand-mark">SL</span><span><b>سهند لیزر</b><small>SAHAND LASER</small></span></a>
        <nav aria-label="منوی اصلی"><a href="/about">درباره ما</a><a href="/products">محصولات</a><a href="/services">خدمات</a><a href="/downloads">نرم‌افزار</a><a href="/contact">تماس</a></nav>
        <div className="header-actions"><button className="theme-button" type="button" aria-label="تغییر تم">◐</button><a className="quote-button" href="#contact">استعلام قیمت</a></div>
      </header>

      <section id="top" className="hero"><div className="hero-copy"><p className="eyebrow">SAHAND LASER / INDUSTRIAL SYSTEMS</p><h1>دقت صنعتی،<br /><em>ساخته‌شده برای تولید.</em></h1><p className="hero-text">راهکارهای مهندسی‌شدهٔ سهند لیزر برای برش، جوش، حکاکی و تمیزکاری دقیق در خطوط تولید.</p><div className="hero-actions"><a className="primary-button" href="#products">مشاهده محصولات</a><a className="text-link" href="#about">آشنایی با سهند لیزر ←</a></div></div><div className="hero-machine" aria-label="نمای مفهومی دستگاه لیزر صنعتی"><div className="machine-bed" /><div className="machine-gantry" /><div className="machine-head" /><span className="machine-label">PRECISION / 01</span></div></section>

      <section id="about" className="trust-strip"><span>راهکار کامل از مشاوره تا نصب</span><span>تأمین قطعات و خدمات تخصصی</span><span>پشتیبانی مهندسی برای تولید</span></section>

      <section id="products" className="section"><div className="section-heading"><div><p className="eyebrow">PRODUCT SYSTEM</p><h2>محصولات بر اساس نیاز تولید</h2></div><a className="text-link" href="/products">مشاهده همه محصولات ←</a></div><div className="category-grid">{categories.map((item) => <a className="category-card" href={`/products?category=${item.slug}`} key={item.slug}><span className="category-index">{item.index}</span><h3>{item.title}</h3><p>{item.description}</p><span className="card-link">مشاهده مدل‌ها ↗</span></a>)}</div></section>

      <section id="services" className="feature-section"><div><p className="eyebrow">ENGINEERING SUPPORT</p><h2>از انتخاب دستگاه تا تولید پایدار، کنار شما هستیم.</h2><p>مشاورهٔ فنی، نصب، آموزش، تأمین قطعات و خدمات پس از فروش در یک مسیر یکپارچه.</p></div><a className="primary-button" href="#contact">گفت‌وگو با کارشناس</a></section>

      <section id="downloads" className="section compact-section"><p className="eyebrow">RESOURCES</p><h2>دانلود نرم‌افزار و منابع فنی</h2><div className="download-row"><span>نرم‌افزارهای کنترل و طراحی دستگاه</span><a className="secondary-button" href="/downloads">ورود به مرکز دانلود</a></div></section>

      <section id="contact" className="contact-section"><div><p className="eyebrow">CONTACT SAHAND LASER</p><h2>برای انتخاب راهکار مناسب، با ما صحبت کنید.</h2></div><div className="contact-card"><p>اصفهان، خیابان خیام، خیابان عطاءالملک</p><a href="tel:+983131320012">۰۳۱-۳۱۳۲۰۰۱۲</a><a href="mailto:info@sahandlaser.com">info@sahandlaser.com</a></div></section>
      <footer className="footer"><span>© سهند لیزر</span><span>تجهیزات و ماشین‌آلات لیزری صنعتی</span></footer>
    </main>
  );
}
