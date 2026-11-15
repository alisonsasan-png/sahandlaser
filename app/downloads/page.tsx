import Link from 'next/link';

const cypcut = [
['CypCut 2000C — نسخه 6.3.765.10','https://drive.google.com/file/d/1Sdyabvt3Gi5BCkmeU2mPs4ACNniGj-6_/view'],
['CypCut — نسخه 6.3.702.8A','https://drive.google.com/file/d/1tGIvsV55K227LUYmm3kA2NIBbBdm_8zh/view'],
['CypCut — نسخه 6.3.712.9','https://drive.google.com/file/d/1tpPdQ1sWxvqiGicOrIOVV9Sr70mKSoiQ/view'],
['CypCut — نسخه 6.3.739.7','https://drive.google.com/file/d/1vvem8RF3jKZH7lGRllu6LXv-q8XAcGOb/view'],
['CypCut — نسخه 6.3.761.4','https://drive.google.com/file/d/1TPBZGwfQdmTewdikitezxw4aMV3mqMZ8/view'],
['CypCut — نسخه 6.2.436','https://drive.google.com/file/d/1rAhng7bvWtSj3ltUFxY2dNi6YDhISJyX/view'],
['CypCut — نسخه 6.3.649.7','https://drive.google.com/file/d/1-rY1lFGu-YDlddOEN0A6gvlmxWKnGTyE/view'],
['CypCut — نسخه 6.3.658.10','https://drive.google.com/file/d/1WL1ZJTt1Acm9gvJkgBO1qKa4sYVyfBWW/view'],
['CypCut — نسخه 6.1.712.4','https://drive.google.com/file/d/1hLTZfM2jbOK5H0xV-LW8m04Ord_Lc7gZ/view'],
['CypCut — نسخه 6.1.723.3','https://drive.google.com/file/d/1Bp2mRuhftNxVw6xKuvJEL_Yo9kfyxkNB/view'],
['CypCut — نسخه 6.1.724.1','https://drive.google.com/file/d/1qGFo3areWwmjiCNdyTEEwTIa4WS-_xYI/view'],
['CypCut — نسخه 6.4.940.2','https://drive.google.com/file/d/1e187Yrg-DcSVsyGKlZC2AS-K3G57CV3o/view'],
['CypCut — نسخه 1.0.391.4-2','https://drive.google.com/file/d/1_k2NvXg9CfnKYu6kefxvHJxZZO45nW0e/view'],
];
const ezcad = [
['EZCad — نسخه 2.5.3','https://drive.google.com/file/d/1AvEGtvqdyctSc2QCg_kG6C-sR7orjlK0/view'],
['EZCad — نسخه 2.7.6','https://drive.google.com/file/d/1pDo3K3aeGDbPnjpYnwb_wgmNlmlajnFl/view'],
['EZCad — نسخه 2.14.9','https://drive.google.com/file/d/1ZvBdHScAJ8elWiPAPu6mjNBVf_UJ4kev/view'],
['EZCad — نسخه 2.14.10','https://drive.google.com/file/d/1W8-rcJ8oaNnCwmZGG3sQ6fYQtvKnEmw4/view'],
['EZCad — نسخه 2.14.11','https://drive.google.com/file/d/1K9f-Illdjm4bQs7k_yBk4u0ETkZMaINL/view'],
['EZCad — نسخه 2.14.13','https://drive.google.com/file/d/1ESZ5pb1F9f5-mMZ-kzSkqIxKcTbQmPRC/view'],
['EZCad — نسخه 2.14.16','https://drive.google.com/file/d/1Q2Q9Hn8X1AD4XXydLsCoVYBHoqzgY0Vj/view'],
];
const drivers = [
['درایور نصب نرم‌افزار — ۳.۷ مگابایت','https://drive.google.com/file/d/10lpsYJk7Qb1Misjkis_bbVV1nMoBTFS2/view'],
['درایور نصب نرم‌افزار — ۲.۸۱ مگابایت','https://drive.google.com/file/d/14nxx2Ii9yoF16LUlnsnFNbGpGoA6X0DG/view'],
['درایور نصب نرم‌افزار — ۳.۷ مگابایت','https://drive.google.com/file/d/10lpsYJk7Qb1Misjkis_bbVV1nMoBTFS2/view'],
['درایور نصب نرم‌افزار — ۱۵.۷ مگابایت','https://drive.google.com/file/d/1g6CXNfyqmzVroq8-zU2CiwzVT5ju7ODo/view'],
['درایور نصب نرم‌افزار — ۶.۶۸ مگابایت','https://drive.google.com/file/d/1Iv-p0cu9qBSXt6IgiqkKFRzqR8KKGcgQ/view'],
];

function DownloadGroup({title,items}:{title:string;items:string[][]}){return <section className="download-group"><h2>{title}</h2><div className="download-list">{items.map(([name,url])=><a className="download-item" href={url} target="_blank" rel="noreferrer" key={url+name}><span>{name}</span><b>دانلود ↗</b></a>)}</div></section>}

export default function DownloadsPage(){return <main><header className="site-header"><Link className="brand" href="/"><span className="brand-mark">SL</span><span><b>سهند لیزر</b><small>SAHAND LASER</small></span></Link><Link className="text-link" href="/">بازگشت به صفحه اصلی ←</Link></header><section className="section"><p className="eyebrow">SOFTWARE & RESOURCES</p><h1>مرکز دانلود نرم‌افزار</h1><p className="hero-text">لینک‌های دانلود از سایت اصلی سهند لیزر؛ فایل‌ها در سایت جدید میزبانی نمی‌شوند.</p><DownloadGroup title="نرم‌افزارهای CypCut" items={cypcut}/><DownloadGroup title="نرم‌افزارهای EZCad" items={ezcad}/><DownloadGroup title="درایورها" items={drivers}/><section className="design-link"><h2>طرح‌های آماده لیزر</h2><p>طرح‌ها در سایت اصلی قرار دارند و از همان‌جا باز می‌شوند.</p><a className="primary-button" href="https://sahandlaser.com/designing/" target="_blank" rel="noreferrer">مشاهده طرح‌های آماده ↗</a></section></section></main>}