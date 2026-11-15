import Link from 'next/link';
import { notFound } from 'next/navigation';
import { products } from '../../../lib/products';
import InquiryForm from './InquiryForm';
import ProductTabs from './ProductTabs';

export function generateStaticParams(){ return products.map((p)=>({code:p.code})); }
export default async function ProductPage({params}:{params:Promise<{code:string}>}){
  const {code}=await params; const product=products.find((p)=>p.code.toLowerCase()===decodeURIComponent(code).toLowerCase()); if(!product) notFound();
  const related=products.filter((p)=>p.category===product.category&&p.code!==product.code).slice(0,4);
  const categoryInfo:Record<string,{description:string;uses:string[]}>={
    'دستگاه‌های برش لیزر فایبر':{description:'راهکار برش دقیق و سریع انواع فلزات برای خطوط تولید و کارگاه‌های صنعتی.',uses:['برش ورق و قطعات فلزی','تولید قطعات صنعتی','کارگاه‌های ساخت و تولید']},
    'دستگاه‌های جوش لیزر فایبر':{description:'جوشکاری دقیق فلزات نازک و حساس با تمرکز حرارتی بالا و حداقل اعوجاج.',uses:['جوش قطعات فلزی','تولید تجهیزات','تعمیر و اتصال قطعات']},
    'دستگاه‌های حکاکی لیزر':{description:'حکاکی و نشانه‌گذاری دائمی روی فلزات و مواد صنعتی با سرعت و جزئیات بالا.',uses:['حکاکی لوگو و نوشته','شماره‌گذاری قطعات','صنایع تبلیغاتی و هدایا']},
    'دستگاه‌های تمیزکاری لیزر':{description:'حذف زنگ‌زدگی، رنگ، روغن و آلودگی‌های سطحی بدون مواد شیمیایی یا ساینده.',uses:['تمیزکاری قطعات','آماده‌سازی سطح','تعمیر و نگهداری صنعتی']},
    'دستگاه‌های حکاکی UV':{description:'راهکار حکاکی دقیق برای کاربردهای حساس و مواد متنوع صنعتی.',uses:['نشانه‌گذاری دقیق','قطعات حساس','محصولات تبلیغاتی']},
    'سورس لیزر':{description:'منبع لیزر برای استفاده در سامانه‌های برش و حکاکی صنعتی.',uses:['دستگاه‌های برش','دستگاه‌های حکاکی','تعویض و تعمیر تجهیزات']},
    'قطعات و تجهیزات جانبی':{description:'قطعات و تجهیزات مورد نیاز برای نگهداری، تعمیر و عملکرد صحیح دستگاه‌های لیزری.',uses:['تعمیرات','سرویس دوره‌ای','تکمیل تجهیزات']}
  };
  const info=categoryInfo[product.category]||{description:'تجهیزات و راهکارهای لیزری صنعتی سهند لیزر برای نیازهای متنوع تولید.',uses:['تولید صنعتی','کارگاه‌ها','پروژه‌های سفارشی']};
  return <main><header className="v8-header"><Link className="v8-brand" href="/"><span className="v8-logo">✦</span><span><b>سهند لیزر</b><small>SAHAND LASER</small></span></Link><nav className="v8-nav"><Link href="/">خانه</Link><Link href="/products">محصولات</Link><Link href="/">خدمات</Link><Link href="/">درباره ما</Link><Link href="/">تماس</Link></nav><Link className="v8-quote" href="#inquiry">استعلام قیمت</Link></header><section className="product-detail"><div className="product-gallery product-visual"><div className="visual-grid"></div><div className="visual-machine"><span></span><i></i><b>SAHAND LASER</b></div><div className="visual-caption">PRODUCT PROFILE · {product.code}</div></div><div className="product-copy"><p className="eyebrow" dir="auto">{product.category}</p><h1 dir="auto">{product.title}</h1><p className="model-code">مدل / {product.code}</p><p>معرفی تخصصی محصول، مشخصات فنی، کاربردها و خدمات مرتبط با تجهیزات لیزری سهند لیزر.</p><div className="product-advantages">{info.uses.map((use)=><span key={use}>{use}</span>)}</div><InquiryForm productCode={product.code} /></div></section><section className="section product-info-section"><ProductTabs code={product.code} /></section><section className="section"><div className="section-heading"><div><p className="eyebrow">RELATED PRODUCTS</p><h2>محصولات هم‌خانواده</h2></div><Link className="text-link" href="/products">مشاهده همه ←</Link></div><div className="related-links">{related.map((p)=><Link className="related-link" href={`/products/${p.code}`} key={p.code}><span dir="auto">{p.title}</span><b>مشاهده محصول ←</b></Link>)}</div></section><section id="contact" className="contact-section"><div><p className="eyebrow">CONTACT SAHAND LASER</p><h2>برای دریافت اطلاعات کامل این محصول با ما تماس بگیرید.</h2></div><div className="contact-card"><a href="tel:+983131320012">۰۳۱-۳۱۳۲۰۰۱۲</a><a href="mailto:info@sahandlaser.com">info@sahandlaser.com</a></div></section></main>;
}