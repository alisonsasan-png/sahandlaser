
// ==================================================
// [HELPERS]
// ==================================================
function escapeHtml(str) { const d = document.createElement('div'); d.textContent = String(str ?? ''); return d.innerHTML; }
const Storage = { get(k, f = null) { try { return localStorage.getItem(k) ?? f; } catch(e) { return f; } }, set(k, v) { try { localStorage.setItem(k, v); return true; } catch(e) { return false; } } };

// ==================================================
// [CONTACTS DATA]
// ==================================================
const contacts = {
  sales: [
    { name: 'آقای ابطحی', label: 'فروش', phone: '989133862673', telegram: '989133862673' },
    { name: 'آقای بلیغ', label: 'فروش', phone: '989125855548', telegram: '989125855548' }
  ],
  support: [
    { name: 'آقای بهرامی و اخلاقی', label: 'خدمات و پشتیبانی دستگاه', phone: '989198023032', telegram: '989198023032' },
    { name: 'آقای شیری', label: 'برش لیزر', phone: '989131863032', telegram: '989131863032' }
  ],
  finance: [
    { name: 'خانم زمانی', label: 'حسابداری', phone: '989137353032', telegram: '989137353032' }
  ]
};

// ==================================================
// [TRANSLATIONS]
// ==================================================
const T = {
  fa: { brand:'سهند لیزر', nav_home:'خانه', nav_about:'درباره ما', nav_products:'محصولات', nav_services:'خدمات', nav_applications:'کاربردها', nav_projects:'نمونه‌کارها', nav_training:'آموزش', nav_downloads:'دانلود', nav_contact:'تماس', cta_inquiry:'استعلام قیمت', cta_call:'تماس',
    hero_badge:'۱۳ سال تجربه • ۴ اختراع ملی • گارانتی محصول طبق مدل', theme_label:'تم رنگی:',
    slide1_tag:'پرفروش‌ترین دستگاه', slide1_title:'دستگاه برش لیزر فایبر CNC', slide1_desc:'خانواده دستگاه‌های برش ورق، روتاری، کابین‌دار و برش لوله با کانفیگ‌های متنوع',
    slide2_tag:'سه‌کاره: جوش، برش، تمیزکاری', slide2_title:'جوشکار لیزری دستی فیبر', slide2_desc:'سبک، پرتابل، با خنک‌کننده هواخنک — مناسب کارهای میدانی',
    slide3_tag:'دانلود رایگان', slide3_title:'دانلود نرم‌افزار CypCut', slide3_desc:'آرشیو نسخه‌های CypCut، EZCad و درایورهای موردنیاز',
    slide4_tag:'پشتیبانی تخصصی همه برندها', slide4_title:'دستگاه را از ما نخریدید؟ مشکلی نیست.', slide4_desc:'تعمیر، سرویس و پشتیبانی همه برندهای لیزر فایبر',
    view_products:'مشاهده محصولات', view_details:'مشاهده جزئیات', go_downloads:'مشاهده و دانلود',
    trust_1:'۴ اختراع ثبت‌شده ملی', trust_2:'همکاری با چین و اروپا', trust_3:'گارانتی محصول طبق مدل', trust_4:'خدمات پس از فروش تخصصی',
    quick_products:'محصولات', quick_services:'خدمات', quick_downloads:'دانلود', quick_contact:'تماس',
    products_tag:'محصولات ما', products_title:'راهکارهای کامل لیزر فایبر', products_full_title:'محصولات و تجهیزات', products_full_desc:'مجموعه کامل دستگاه‌ها، تجهیزات جانبی و قطعات', group_machines:'دستگاه‌های اصلی', group_components:'سورس، هد و قطعات', view_all_products:'مشاهده همه محصولات',
    cat_cutting:'دستگاه‌های برش', cat_cutting_desc:'برش دقیق ورق‌های فلزی. تک‌میز، کابین‌دار، روتاری، ربات.', cat_welding:'دستگاه‌های جوش', cat_welding_desc:'جوش لیزری پرسرعت. دستی، پایه، مینی، هواخنک، نقطه‌ای.', cat_marking:'دستگاه‌های حکاکی', cat_marking_desc:'حکاکی روی فلز و غیرفلز. میزی، پرتابل، UV و MOPA.', cat_cleaning:'دستگاه‌های تمیزکاری', cat_cleaning_desc:'حذف زنگ، رنگ و آلودگی بدون آسیب سطح.', cat_source:'سورس لیزر', cat_source_desc:'سورس‌های فایبر پالسی و پیوسته Raycus، Max، JPT، IPG.', cat_head:'کنترلر و هد لیزر', cat_head_desc:'هدهای برش/جوش اتوفوکوس Raytools، Ospri و کنترلر CNC.', cat_parts:'قطعات دستگاه لیزر', cat_parts_desc:'چیلر، کمپرسور، دوئر، سرووموتور و تجهیزات جانبی.', cat_consumables:'قطعات مصرفی', cat_consumables_desc:'نازل، لنز، گالوانومتر و قطعات مصرفی هد.', view_models:'مشاهده مدل‌ها', coming_soon:'به‌زودی',
    solution_tag:'راهکار هوشمند', solution_title:'راهکار مناسب کسب‌وکار خود را دریافت کنید', solution_desc:'با تکمیل فرم زیر، کارشناسان ما پس از بررسی نیاز فنی، کارشناسان ما راهکار مناسب را با شما مطرح می‌کنند.',
    sol_machine:'نوع دستگاه مورد نیاز', sol_industry:'زمینه کاری شما', sol_budget:'بودجه تقریبی (اختیاری)', sol_contact:'شماره تماس یا ایمیل', sol_requirements:'نیازها و توضیحات شما', sol_submit:'دریافت راهکار رایگان', sol_select:'— انتخاب کنید —', sol_unknown:'نمی‌دانم / مشاوره',
    about_tag:'درباره سهند لیزر', about_title_short:'ما فقط فروشنده دستگاه نیستیم — نگهبان خط تولید شما هستیم.', about_desc_home:'با تکیه بر دانش نخبگان داخلی و همکاری با بزرگ‌ترین سازندگان جهانی در چین و اروپا، راهکارهای دقیق، سریع و مقرون‌به‌صرفه ارائه می‌دهیم.',
    stat_installs:'دستگاه نصب‌شده', stat_years:'سال تجربه', stat_patents:'اختراع ملی', stat_satisfaction:'خدمات پس از فروش',
    timeline_title:'مسیر رشد سهند لیزر', tl_1390_t:'تأسیس شرکت', tl_1390_d:'شروع فعالیت در زمینه لیزر فایبر و CNC', tl_1395_t:'توسعه خط تولید', tl_1395_d:'راه‌اندازی خط مونتاژ داخلی', tl_1400_t:'ثبت ۴ اختراع ملی', tl_1400_d:'تقدیر توسط بنیاد ملی نخبگان', tl_1403_t:'توسعه پروژه‌های صنعتی', tl_1403_d:'گسترش نصب، آموزش و خدمات فنی در پروژه‌های صنعتی',
    projects_tag:'نمونه‌کارها', projects_title:'پروژه‌ها و بازدید مشتریان', projects_desc:'بخشی از افتخارات ما در همکاری با صنایع مختلف', projects_title_full:'پروژه‌ها و بازدید مشتریان', projects_desc_full:'بخشی از افتخارات ما در همکاری با صنایع مختلف و بازدید مشتریان خارجی',
    proj_1_t:'نصب دستگاه برش لیزر در صنعت آسانسور', proj_1_d:'نصب و راه‌اندازی دستگاه برش فایبر ۶ کیلووات برای برش ورق‌های استیل تابلو برق', proj_2_t:'راه‌اندازی خط جوش لیزر دستی', proj_2_d:'راه‌اندازی خط تولید جوش لیزر برای کارگاه قطعه‌سازی خودرو', proj_3_t:'بازدید مشتریان ترکیه از کارخانه', proj_3_d:'بازدید و تست دستگاه‌های برش و جوش لیزر توسط هیئت تجاری ترکیه', proj_4_t:'حکاکی صنعتی در صنعت طلا', proj_4_d:'نصب دستگاه حکاکی فایبر ۵۰ وات با روتاری برای صنعت طلا و جواهر', proj_5_t:'تعمیر سورس لیزر برند دیگر', proj_5_d:'تعمیر تخصصی سورس لیزر ۳۰۰۰ وات از برند رقیب ', proj_6_t:'مشتریان عراقی در کارخانه سهند', proj_6_d:' و  برش لیزر',
    about_title:'درباره فناوران پرتو لیزر سهند', about_subtitle:'فعال از سال ۱۳۹۰ در فناوری‌های لیزر صنعتی و آزمایشگاهی', about_story:'داستان ما', about_story_text:'شرکت فناوران پرتو لیزر سهند، با مسئولیت محدود و شماره ثبت ۴۶۲۵۶، از سال ۱۳۹۰ در زمینه طراحی، تولید و تجاری‌سازی فناوری‌های لیزر فعالیت دارد. حوزه فعالیت شرکت شامل تجهیزات صنعتی برش، جوش، حکاکی/مارکینگ و تمیزکاری لیزر، تجهیزات آزمایشگاهی و همچنین تعمیرات تخصصی سورس، هد و دستگاه است.', about_mission:'مأموریت ما', about_mission_text:'ما معتقدیم یک شرکت لیزر تنها فروشنده دستگاه نیست؛ بلکه باید در تمام مراحل کنار مشتری باشد. از تحلیل رایگان نیاز، طراحی سفارشی، نصب و راه‌اندازی، آموزش کامل و خدمات پس از فروش تخصصی و تأمین قطعات.', about_achievements:'افتخارات ما', about_patents:'اختراع ثبت‌شده ملی', about_installs:'دستگاه نصب‌شده', about_years:'سال تجربه', about_satisfaction:'خدمات پس از فروش', about_contact_cta:'با ما در تماس باشید',
    services_full_title:'خدمات تخصصی سهند لیزر', services_full_desc:'از نصب و راه‌اندازی تا تعمیرات اساسی و آموزش کاربران',
    svc_install:'نصب و راه‌اندازی', svc_install_desc:'نصب حرفه‌ای دستگاه در محل شما، همراه با کالیبراسیون و تست کامل.', svc_source_repair:'تعمیر سورس و هد لیزر', svc_source_repair_desc:'تعمیر تخصصی سورس‌های Raycus، Max، JPT و IPG و هدهای برش/جوش.', svc_machine_repair:'تعمیر دستگاه', svc_machine_repair_desc:'عیب‌یابی و تعمیر کامل دستگاه‌های لیزر فایبر، تعویض قطعات و بازسازی.', svc_training:'آموزش و پشتیبانی', svc_training_desc:'آموزش کاربران تا حد تسلط کامل + پشتیبانی مستمر.', svc_parts:'تأمین قطعات یدکی', svc_parts_desc:'تأمین و ارسال سریع قطعات اصلی برای همه برندها.', svc_consult:'مشاوره تخصصی', svc_consult_desc:'مشاوره رایگان و تحلیل نیاز برای انتخاب بهترین دستگاه.', request_service:'درخواست خدمات',
    apps_title:'کاربردهای لیزر فایبر', apps_desc:'صنایع مختلفی که از لیزر فایبر سهند استفاده می‌کنند',
    app_elevator:'آسانسورسازی', app_elevator_desc:'برش دقیق قطعات آسانسور، تابلوهای برق و درب‌های فلزی', app_kitchen:'آشپزخانه صنعتی', app_kitchen_desc:'تولید سینک، هود، لوازم خانگی استیل', app_auto:'خودروسازی', app_auto_desc:'برش قطعات خودرو، ماشین‌آلات کشاورزی و ساختمانی', app_decor:'دکوراسیون و نما', app_decor_desc:'درب‌های فلزی دکوراتیو، نماهای CNC', app_jewelry:'طلا و جواهرسازی', app_jewelry_desc:'حکاکی داخل و روی حلقه، انگشتر و پلاک', app_medical:'تجهیزات پزشکی', app_medical_desc:'حکاکی روی ابزار جراحی و ایمپلنت', app_industry:'صنایع سنگین', app_industry_desc:'برش ورق‌های ضخیم، تجهیزات نفت و گاز', app_promo:'تبلیغات', app_promo_desc:'حکاکی روی خودکار، فندک، پاوربانک، ماگ', app_lab:'آزمایشگاهی', app_lab_desc:'حکاکی دقیق روی قطعات آزمایشگاهی و الکترونیک',
    training_title:'آموزش تخصصی دستگاه‌های لیزر', training_desc:'دوره‌های آموزشی عملی برای اپراتورها و کارشناسان فنی', training_operator:'دوره اپراتور دستگاه', training_operator_desc:'آموزش کار با نرم‌افزار CypCut، تنظیمات برش، نگهداری روزانه', training_tech:'دوره تعمیرات فنی', training_tech_desc:'عیب‌یابی، تعمیر سورس، هد، چیلر و قطعات الکترونیکی', training_safety:'دوره ایمنی کار', training_safety_desc:'اصول ایمنی کار با لیزر، تجهیزات حفاظت فردی', training_cta_title:'آموزش رایگان با خرید دستگاه', training_cta_desc:'با خرید هر دستگاه از سهند لیزر، آموزش کامل اپراتور و تیم فنی شما رایگان انجام می‌شود.', training_cta_btn:'درخواست دوره آموزشی',
    dl_title:'دانلود نرم‌افزار CypCut', dl_desc:'نرم‌افزارهای تخصصی کنترل دستگاه‌های برش لیزر فایبر فلزات.', dl_btn:'دانلود', dl_note:'همه نرم‌افزارها از Google Drive دانلود می‌شوند.',
    repairs_badge:'پشتیبانی تخصصی همه برندها', repairs_title_1:'دستگاه را از ما نخریدید؟', repairs_title_2:'مشکلی نیست — ما پشتیبانی‌تان می‌کنیم.', repairs_desc_short:'تیم فنی سهند لیزر آماده است تا انواع دستگاه‌های لیزر فایبر را تعمیر، سرویس و پشتیبانی کند.', repairs_cta_call:'تماس فوری با پشتیبانی', repairs_cta_wa:'واتساپ پشتیبانی',
    contact_title:'آماده همکاری با شما هستیم', contact_desc:'شماره‌های تماس واحدهای فروش، پشتیبانی و حسابداری',
    badge_360:'۳۶۰ درجه', spin_hint:'موس را بچرخانید', comment_submit:'ارسال نظر', comment_success:'نظر شما با موفقیت ثبت شد!', comment_error:'لطفاً نام و متن نظر را وارد کنید.', no_comments:'هنوز نظری ثبت نشده.',
    theme_navy:'سرمه‌ای', theme_teal:'فیروزه‌ای', theme_gold:'طلایی', theme_purple:'بنفش', theme_emerald:'زمرد', theme_cyan:'سیان', product_not_found:'این محصول یافت نشد.' },
  en: { brand:'Sahand Laser', nav_home:'Home', nav_about:'About', nav_products:'Products', nav_services:'Services', nav_applications:'Applications', nav_projects:'Projects', nav_training:'Training', nav_downloads:'Downloads', nav_contact:'Contact', cta_inquiry:'Get Quote', cta_call:'Call',
    theme_label:'Color theme:', slide1_tag:'Best Seller', slide1_title:'Fiber Laser Cutting Machine', slide1_desc:'Precise metal sheet cutting with 1-12 kW power',
    slide2_tag:'3-in-1: Welding, Cutting, Cleaning', slide2_title:'Handheld Fiber Laser Welder', slide2_desc:'Light, portable, air-cooled',
    slide3_tag:'Free Download', slide3_title:'Download CypCut', slide3_desc:'4 versions of CypCut for free',
    slide4_tag:'Support for All Brands', slide4_title:"Didn't Buy From Us? No Problem.", slide4_desc:'Repair, service and support for all fiber laser brands',
    view_products:'View Products', view_details:'View Details', go_downloads:'View & Download',
    trust_1:'4 Patents', trust_2:'Partnership with China & EU', trust_3:'Free Installation', trust_4:'7-Day Support',
    quick_products:'Products', quick_services:'Services', quick_downloads:'Downloads', quick_contact:'Contact',
    products_tag:'Our Products', products_title:'Complete Fiber Laser Solutions', products_full_title:'Products & Equipment', products_full_desc:'Complete range of machines, accessories and spare parts', group_machines:'Main Machines', group_components:'Source, Head & Parts', view_all_products:'View All Products',
    cat_cutting:'Cutting Machines', cat_cutting_desc:'Precise metal sheet cutting.', cat_welding:'Welding Machines', cat_welding_desc:'High-speed laser welding.', cat_marking:'Marking Machines', cat_marking_desc:'Marking on metal & non-metal.', cat_cleaning:'Cleaning Machines', cat_cleaning_desc:'Remove rust, paint & contamination.', cat_source:'Laser Source', cat_source_desc:'Fiber sources from Raycus, Max, JPT, IPG.', cat_head:'Controller & Head', cat_head_desc:'Autofocus heads, Raytools, Ospri & CNC controllers.', cat_parts:'Machine Parts', cat_parts_desc:'Chiller, compressor, dewar, servo motor.', cat_consumables:'Consumables', cat_consumables_desc:'Nozzles, lenses, galvanometer.', view_models:'View Models', coming_soon:'Coming Soon',
    solution_tag:'Smart Solution', solution_title:'Get the Right Solution for Your Business', solution_desc:'Fill the form and our experts will contact you within 24 hours.', sol_machine:'Machine Type', sol_industry:'Your Industry', sol_budget:'Approximate Budget (optional)', sol_contact:'Phone or Email', sol_requirements:'Your Requirements', sol_submit:'Get Free Solution', sol_select:'— Select —', sol_unknown:'Not sure / Consult',
    about_tag:'About Sahand Laser', about_title_short:"We're Not Just a Seller — We're Your Production Line Guardians.", about_desc_home:'We offer precise, fast and cost-effective solutions with domestic experts and top global manufacturers.',
    stat_installs:'Installed', stat_years:'Years', stat_patents:'Patents', stat_satisfaction:'Satisfaction',
    timeline_title:'Sahand Laser Growth Journey', tl_1390_t:'Company Founded', tl_1390_d:'Started in fiber laser & CNC', tl_1395_t:'Production Line', tl_1395_d:'Local assembly line launched', tl_1400_t:'4 National Patents', tl_1400_d:'Recognized by National Elites Foundation', tl_1403_t:'+150 Installations', tl_1403_d:'Across Iran industrial workshops',
    projects_tag:'Portfolio', projects_title:'Projects & Customer Visits', projects_desc:'Some of our achievements with various industries', projects_title_full:'Projects & Customer Visits', projects_desc_full:'Some of our achievements with various industries and international customer visits',
    proj_1_t:'Laser Cutting Installation - Elevator Industry', proj_1_d:'Installed 6kW fiber cutting machine for stainless steel sheet cutting', proj_2_t:'Handheld Laser Welding Line', proj_2_d:'Established welding line for auto parts workshop', proj_3_t:'Turkish Customers Visit', proj_3_d:'Turkish trade delegation visited our factory', proj_4_t:'Industrial Marking - Gold Industry', proj_4_d:'Installed 50W fiber marking machine with rotary', proj_5_t:'Competitor Source Repair', proj_5_d:'Repaired 3000W laser source in less than 2 days', proj_6_t:'Iraqi Customers Visit', proj_6_d:'Iraqi trade delegation signed contract for 3 cutting machines',
    about_title:'About Sahand Laser', about_subtitle:'Over 13 years in the Iranian laser industry', about_story:'Our Story', about_story_text:'Sahand Laser Technology began in 2011 in design, manufacturing, import and support of fiber laser & CNC machines.', about_mission:'Our Mission', about_mission_text:'We believe a laser company is not just a machine seller; it must accompany the customer at all stages.', about_achievements:'Our Achievements', about_patents:'Patents', about_installs:'Installed', about_years:'Years', about_satisfaction:'Satisfaction', about_contact_cta:'Contact Us',
    services_full_title:'Sahand Laser Services', services_full_desc:'From installation to major repairs and operator training',
    svc_install:'Installation & Setup', svc_install_desc:'Professional on-site installation with calibration and full testing.', svc_source_repair:'Source & Head Repair', svc_source_repair_desc:'Expert repair of Raycus, Max, JPT & IPG sources and heads.', svc_machine_repair:'Machine Repair', svc_machine_repair_desc:'Full diagnostics and repair of fiber laser machines.', svc_training:'Training & Support', svc_training_desc:'Operator training to full proficiency + ongoing support.', svc_parts:'Spare Parts', svc_parts_desc:'Fast supply of original spare parts for all brands.', svc_consult:'Consultation', svc_consult_desc:'Free consultation to choose the best machine.', request_service:'Request Service',
    apps_title:'Fiber Laser Applications', apps_desc:'Industries using Sahand fiber lasers',
    app_elevator:'Elevator', app_elevator_desc:'Precise cutting of elevator parts', app_kitchen:'Kitchen', app_kitchen_desc:'Production of sinks and stainless appliances', app_auto:'Automotive', app_auto_desc:'Cutting auto and machinery parts', app_decor:'Decoration', app_decor_desc:'Metal doors, CNC facades', app_jewelry:'Jewelry', app_jewelry_desc:'Marking on rings and jewelry', app_medical:'Medical', app_medical_desc:'Marking on surgical tools and implants', app_industry:'Heavy Industry', app_industry_desc:'Thick sheet cutting, oil & gas equipment', app_promo:'Promotional', app_promo_desc:'Marking on pens, lighters, power banks', app_lab:'Laboratory', app_lab_desc:'Precise marking on lab parts and electronics',
    training_title:'Laser Machine Training', training_desc:'Practical training courses for operators and technicians', training_operator:'Operator Course', training_operator_desc:'CypCut software, cutting settings, daily maintenance', training_tech:'Technical Repair Course', training_tech_desc:'Diagnostics, source, head, chiller repair', training_safety:'Safety Course', training_safety_desc:'Laser safety, PPE and accident prevention', training_cta_title:'Free Training with Purchase', training_cta_desc:'With every machine purchased, complete training is free.', training_cta_btn:'Request Training',
    dl_title:'Download CypCut', dl_desc:'Specialized CNC software for fiber laser cutting machines.', dl_btn:'Download', dl_note:'All software downloads from Google Drive.',
    repairs_badge:'Specialized Support for All Brands', repairs_title_1:"Didn't Buy From Us?", repairs_title_2:"No Problem — We've Got You Covered.", repairs_desc_short:"Sahand Laser's team is ready to repair and support all fiber laser machines.", repairs_cta_call:'Call Support Now', repairs_cta_wa:'WhatsApp Support',
    contact_title:'Ready to Work With You', contact_desc:'All numbers with call, WhatsApp & Telegram links',
    badge_360:'360°', spin_hint:'Drag to rotate', comment_submit:'Submit', comment_success:'Submitted!', comment_error:'Please fill name and text.', no_comments:'No reviews yet.',
    theme_navy:'Navy', theme_teal:'Teal', theme_gold:'Gold', theme_purple:'Purple', theme_emerald:'Emerald', theme_cyan:'Cyan', product_not_found:'Product not found.' },
  ar: { brand:'سهند ليزر', nav_home:'الرئيسية', nav_about:'من نحن', nav_products:'المنتجات', nav_services:'الخدمات', nav_applications:'الاستخدامات', nav_projects:'الأعمال', nav_training:'التدريب', nav_downloads:'التحميل', nav_contact:'اتصل بنا', cta_inquiry:'طلب عرض', cta_call:'اتصل',
    theme_label:'السمة:', slide1_tag:'الأكثر مبيعاً', slide1_title:'آلة قطع ليزر الألياف', slide1_desc:'قطع دقيق للصفائح المعدنية',
    slide2_tag:'٣ في ١: لحام، قطع، تنظيف', slide2_title:'لحام ليزر يدوي', slide2_desc:'خفيف، محمول، تبريد هوائي',
    slide3_tag:'تحميل مجاني', slide3_title:'تحميل CypCut', slide3_desc:'٤ نسخ مجانية',
    slide4_tag:'دعم لجميع العلامات', slide4_title:'لم تشترِ منا؟ لا مشكلة.', slide4_desc:'إصلاح ودعم جميع ماركات ليزر الألياف',
    view_products:'عرض المنتجات', view_details:'عرض التفاصيل', go_downloads:'عرض وتحميل',
    trust_1:'٤ براءات اختراع', trust_2:'شراكة مع الصين وأوروبا', trust_3:'تركيب وتدريب مجاني', trust_4:'دعم ٧ أيام',
    quick_products:'المنتجات', quick_services:'الخدمات', quick_downloads:'التحميل', quick_contact:'اتصل',
    products_tag:'منتجاتنا', products_title:'حلول ليزر الألياف', products_full_title:'المنتجات والمعدات', products_full_desc:'مجموعة كاملة', group_machines:'الآلات الرئيسية', group_components:'المصدر والرأس والقطع', view_all_products:'عرض جميع المنتجات',
    cat_cutting:'آلات القطع', cat_cutting_desc:'قطع دقيق للصفائح المعدنية.', cat_welding:'آلات اللحام', cat_welding_desc:'لحام ليزر عالي السرعة.', cat_marking:'آلات النقش', cat_marking_desc:'النقش على المعادن.', cat_cleaning:'آلات التنظيف', cat_cleaning_desc:'إزالة الصدأ والطلاء.', cat_source:'مصدر الليزر', cat_source_desc:'مصادر الألياف.', cat_head:'وحدة التحكم والرأس', cat_head_desc:'رؤوس القطع واللحام.', cat_parts:'قطع الآلة', cat_parts_desc:'المبرد، الضاغط.', cat_consumables:'المواد الاستهلاكية', cat_consumables_desc:'الفوهات، العدسات.', view_models:'عرض الموديلات', coming_soon:'قريباً',
    solution_tag:'حل ذكي', solution_title:'احصل على الحل المناسب لعملك', solution_desc:'سيتصل بك خبراؤنا في غضون ٢٤ ساعة.', sol_machine:'نوع الآلة', sol_industry:'مجالك', sol_budget:'الميزانية (اختياري)', sol_contact:'الهاتف أو البريد', sol_requirements:'متطلباتك', sol_submit:'احصل على حل مجاني', sol_select:'— اختر —', sol_unknown:'لست متأكداً',
    about_tag:'حول سهند ليزر', about_title_short:'نحن لسنا مجرد بائع — نحن حراس خط إنتاجك.', about_desc_home:'نقدم حلولاً دقيقة وسريعة وفعالة.',
    stat_installs:'أجهزة مركبة', stat_years:'سنوات', stat_patents:'براءات', stat_satisfaction:'رضا',
    timeline_title:'رحلة نمو سهند ليزر', tl_1390_t:'تأسيس الشركة', tl_1390_d:'بداية في ليزر الألياف', tl_1395_t:'خط الإنتاج', tl_1395_d:'خط تجميع محلي', tl_1400_t:'٤ براءات اختراع', tl_1400_d:'تقدير من المؤسسة الوطنية', tl_1403_t:'+١٥٠ تركيب', tl_1403_d:'في جميع أنحاء إيران',
    projects_tag:'الأعمال', projects_title:'المشاريع وزيارات العملاء', projects_desc:'بعض إنجازاتنا', projects_title_full:'المشاريع وزيارات العملاء', projects_desc_full:'بعض إنجازاتنا مع العملاء الدوليين',
    proj_1_t:'تركيب قطع الليزر - صناعة المصاعد', proj_1_d:'تركيب آلة قطع فايبر ٦ كيلوواط', proj_2_t:'خط لحام ليزر يدوي', proj_2_d:'إنشاء خط لحام لقطع السيارات', proj_3_t:'زيارة العملاء الأتراك', proj_3_d:'وفد تجاري تركي زار المصنع', proj_4_t:'نقش صناعي - صناعة الذهب', proj_4_d:'تركيب آلة نقش ٥٠ واط', proj_5_t:'إصلاح مصدر منافس', proj_5_d:'إصلاح مصدر ٣٠٠٠ واط في أقل من يومين', proj_6_t:'زيارة العملاء العراقيين', proj_6_d:'وفد عراقي وقع عقد ٣ آلات',
    about_title:'حول سهند ليزر', about_subtitle:'أكثر من ١٣ سنة', about_story:'قصتنا', about_story_text:'بدأت شركة سهند ليزر في عام ٢٠١١.', about_mission:'مهمتنا', about_mission_text:'نؤمن أن شركة الليزر يجب أن تكون مع العميل.', about_achievements:'إنجازاتنا', about_patents:'براءات', about_installs:'أجهزة', about_years:'سنوات', about_satisfaction:'رضا', about_contact_cta:'اتصل بنا',
    services_full_title:'خدمات سهند ليزر', services_full_desc:'من التركيب إلى الإصلاحات',
    svc_install:'التركيب', svc_install_desc:'تركيب احترافي في الموقع.', svc_source_repair:'إصلاح المصدر والرأس', svc_source_repair_desc:'إصلاح متخصص.', svc_machine_repair:'إصلاح الآلة', svc_machine_repair_desc:'تشخيص وإصلاح كامل.', svc_training:'التدريب والدعم', svc_training_desc:'تدريب المشغلين.', svc_parts:'قطع الغيار', svc_parts_desc:'توريد سريع.', svc_consult:'استشارة', svc_consult_desc:'استشارة مجانية.', request_service:'طلب الخدمة',
    apps_title:'تطبيقات ليزر الألياف', apps_desc:'الصناعات',
    app_elevator:'المصاعد', app_elevator_desc:'قطع دقيق.', app_kitchen:'المطابخ', app_kitchen_desc:'إنتاج الأحواض.', app_auto:'السيارات', app_auto_desc:'قطع قطع السيارات.', app_decor:'الديكور', app_decor_desc:'الأبواب المعدنية.', app_jewelry:'المجوهرات', app_jewelry_desc:'النقش على الحلقات.', app_medical:'الطبية', app_medical_desc:'النقش على الأدوات.', app_industry:'الصناعة الثقيلة', app_industry_desc:'قطع الصفائح السميكة.', app_promo:'الدعاية', app_promo_desc:'النقش على الأقلام.', app_lab:'المختبرات', app_lab_desc:'النقش الدقيق.',
    training_title:'تدريب آلات الليزر', training_desc:'دورات تدريبية', training_operator:'دورة المشغل', training_operator_desc:'برنامج CypCut.', training_tech:'دورة الإصلاح', training_tech_desc:'التشخيص والإصلاح.', training_safety:'دورة السلامة', training_safety_desc:'مبادئ سلامة الليزر.', training_cta_title:'تدريب مجاني مع الشراء', training_cta_desc:'التدريب مجاني.', training_cta_btn:'طلب تدريب',
    dl_title:'تحميل CypCut', dl_desc:'برامج CNC.', dl_btn:'تحميل', dl_note:'من Google Drive.',
    repairs_badge:'دعم لجميع العلامات', repairs_title_1:'لم تشترِ منا؟', repairs_title_2:'لا مشكلة.', repairs_desc_short:'فريقنا جاهز.', repairs_cta_call:'اتصل بالدعم', repairs_cta_wa:'واتساب الدعم',
    contact_title:'مستعدون للعمل', contact_desc:'جميع الأرقام',
    badge_360:'٣٦٠°', spin_hint:'اسحب', comment_submit:'إرسال', comment_success:'تم!', comment_error:'يرجى الملء.', no_comments:'لا توجد آراء.',
    theme_navy:'كحلي', theme_teal:'فيروزي', theme_gold:'ذهبي', theme_purple:'أرجواني', theme_emerald:'زمردي', theme_cyan:'سماوي', product_not_found:'غير موجود.' },
  tr: { brand:'Sahand Laser', nav_home:'Anasayfa', nav_about:'Hakkımızda', nav_products:'Ürünler', nav_services:'Hizmetler', nav_applications:'Uygulamalar', nav_projects:'Projeler', nav_training:'Eğitim', nav_downloads:'İndir', nav_contact:'İletişim', cta_inquiry:'Fiyat Al', cta_call:'Ara',
    theme_label:'Renk teması:', slide1_tag:'En Çok Satan', slide1_title:'Fiber Lazer Kesim Makinesi', slide1_desc:'Hassas metal levha kesimi',
    slide2_tag:'3ü 1 arada', slide2_title:'El Tipi Fiber Lazer Kaynak', slide2_desc:'Hafif, taşınabilir, hava soğutmalı',
    slide3_tag:'Ücretsiz İndir', slide3_title:'CypCut İndir', slide3_desc:'4 versiyon ücretsiz',
    slide4_tag:'Tüm Markalar için Destek', slide4_title:'Bizden mi almadınız? Sorun değil.', slide4_desc:'Tüm fiber lazer markaları için onarım ve destek',
    view_products:'Ürünleri Gör', view_details:'Detayları Gör', go_downloads:'Gör ve İndir',
    trust_1:'4 Patent', trust_2:'Çin ve AB Ortaklığı', trust_3:'Ücretsiz Kurulum', trust_4:'7 Gün Destek',
    quick_products:'Ürünler', quick_services:'Hizmetler', quick_downloads:'İndir', quick_contact:'İletişim',
    products_tag:'Ürünlerimiz', products_title:'Komple Fiber Lazer Çözümleri', products_full_title:'Ürünler ve Ekipman', products_full_desc:'Tam aralık', group_machines:'Ana Makineler', group_components:'Kaynak, Kafa ve Parçalar', view_all_products:'Tüm Ürünleri Gör',
    cat_cutting:'Kesim Makineleri', cat_cutting_desc:'Hassas kesim.', cat_welding:'Kaynak Makineleri', cat_welding_desc:'Yüksek hızlı kaynak.', cat_marking:'Markalama', cat_marking_desc:'Metal markalama.', cat_cleaning:'Temizleme', cat_cleaning_desc:'Pas temizliği.', cat_source:'Lazer Kaynağı', cat_source_desc:'Fiber kaynakları.', cat_head:'Kontrolcü ve Kafa', cat_head_desc:'Otomatik odak kafa.', cat_parts:'Makine Parçaları', cat_parts_desc:'Soğutucu, kompresör.', cat_consumables:'Sarf Malzemeleri', cat_consumables_desc:'Nozullar, lensler.', view_models:'Modelleri Gör', coming_soon:'Yakında',
    solution_tag:'Akıllı Çözüm', solution_title:'İşletmeniz için Doğru Çözümü Alın', solution_desc:'Uzmanlarımız 24 saat içinde sizinle iletişime geçecek.', sol_machine:'Makine Tipi', sol_industry:'Sektörünüz', sol_budget:'Bütçe (isteğe bağlı)', sol_contact:'Telefon veya E-posta', sol_requirements:'Gereksinimleriniz', sol_submit:'Ücretsiz Çözüm Al', sol_select:'— Seç —', sol_unknown:'Emin değilim',
    about_tag:'Sahand Laser Hakkında', about_title_short:'Sadece satıcı değiliz — üretim hattınızın koruyucularıyız.', about_desc_home:'Hassas, hızlı ve uygun maliyetli çözümler sunuyoruz.',
    stat_installs:'Kurulu', stat_years:'Yıl', stat_patents:'Patent', stat_satisfaction:'Memnuniyet',
    timeline_title:'Sahand Laser Büyüme Yolculuğu', tl_1390_t:'Şirket Kuruldu', tl_1390_d:'Fiber lazer ile başladı', tl_1395_t:'Üretim Hattı', tl_1395_d:'Yerel montaj hattı', tl_1400_t:'4 Patent', tl_1400_d:'Ulusal Elitler Vakfı tarafından tanındı', tl_1403_t:'+150 Kurulum', tl_1403_d:'İran genelinde',
    projects_tag:'Portföy', projects_title:'Projeler ve Müşteri Ziyaretleri', projects_desc:'Başarılarımız', projects_title_full:'Projeler ve Müşteri Ziyaretleri', projects_desc_full:'Uluslararası müşteri ziyaretleri',
    proj_1_t:'Lazer Kesim Kurulumu - Asansör', proj_1_d:'6kW fiber kesim makinesi kuruldu', proj_2_t:'El Tipi Lazer Kaynak Hattı', proj_2_d:'Otomotiv parçaları için kaynak hattı', proj_3_t:'Türk Müşteriler Ziyareti', proj_3_d:'Türk ticaret heyeti fabrikamızı ziyaret etti', proj_4_t:'Endüstriyel Markalama - Altın', proj_4_d:'50W fiber markalama makinesi kuruldu', proj_5_t:'Rakip Kaynak Onarımı', proj_5_d:'3000W lazer kaynağı 2 günde onarıldı', proj_6_t:'Iraklı Müşteriler Ziyareti', proj_6_d:'Iraklı heyet 3 makine için sözleşme imzaladı',
    about_title:'Sahand Laser Hakkında', about_subtitle:'13 yıldan fazla', about_story:'Hikayemiz', about_story_text:'Sahand Laser Teknoloji, 2011 yılında kuruldu.', about_mission:'Misyonumuz', about_mission_text:'Lazer şirketi müşterinin yanında olmalı.', about_achievements:'Başarılarımız', about_patents:'Patent', about_installs:'Kurulu', about_years:'Yıl', about_satisfaction:'Memnuniyet', about_contact_cta:'Bize Ulaşın',
    services_full_title:'Sahand Laser Hizmetleri', services_full_desc:'Kurulumdan onarıma',
    svc_install:'Kurulum', svc_install_desc:'Profesyonel kurulum.', svc_source_repair:'Kaynak ve Kafa Onarımı', svc_source_repair_desc:'Uzman onarım.', svc_machine_repair:'Makine Onarımı', svc_machine_repair_desc:'Tam onarım.', svc_training:'Eğitim ve Destek', svc_training_desc:'Operatör eğitimi.', svc_parts:'Yedek Parça', svc_parts_desc:'Hızlı tedarik.', svc_consult:'Danışmanlık', svc_consult_desc:'Ücretsiz danışmanlık.', request_service:'Hizmet Talep Et',
    apps_title:'Fiber Lazer Uygulamaları', apps_desc:'Sektörler',
    app_elevator:'Asansör', app_elevator_desc:'Hassas kesim.', app_kitchen:'Mutfak', app_kitchen_desc:'Lavabo üretimi.', app_auto:'Otomotiv', app_auto_desc:'Parça kesimi.', app_decor:'Dekorasyon', app_decor_desc:'Metal kapılar.', app_jewelry:'Mücevher', app_jewelry_desc:'Yüzük markalama.', app_medical:'Tıbbi', app_medical_desc:'Alet markalama.', app_industry:'Ağır Sanayi', app_industry_desc:'Kalın levha kesimi.', app_promo:'Promosyon', app_promo_desc:'Kalem markalama.', app_lab:'Laboratuvar', app_lab_desc:'Hassas markalama.',
    training_title:'Lazer Eğitimi', training_desc:'Eğitim kursları', training_operator:'Operatör Kursu', training_operator_desc:'CypCut yazılımı.', training_tech:'Teknik Onarım', training_tech_desc:'Teşhis ve onarım.', training_safety:'Güvenlik Kursu', training_safety_desc:'Lazer güvenliği.', training_cta_title:'Alımda Ücretsiz Eğitim', training_cta_desc:'Eğitim ücretsizdir.', training_cta_btn:'Eğitim Talep Et',
    dl_title:'CypCut İndir', dl_desc:'CNC yazılımı.', dl_btn:'İndir', dl_note:'Google Drive üzerinden.',
    repairs_badge:'Tüm Markalar için Destek', repairs_title_1:'Bizden mi almadınız?', repairs_title_2:'Sorun değil.', repairs_desc_short:'Ekibimiz hazır.', repairs_cta_call:'Hemen Ara', repairs_cta_wa:'WhatsApp',
    contact_title:'Çalışmaya Hazırız', contact_desc:'Tüm numaralar',
    badge_360:'360°', spin_hint:'Sürükle', comment_submit:'Gönder', comment_success:'Gönderildi!', comment_error:'Lütfen doldurun.', no_comments:'Yorum yok.',
    theme_navy:'Lacivert', theme_teal:'Turkuaz', theme_gold:'Altın', theme_purple:'Mor', theme_emerald:'Zümrüt', theme_cyan:'Camgöbeği', product_not_found:'Ürün bulunamadı.' }
};

// ==================================================
// [PRODUCTS — generated from Master Knowledge Base v1]
// ==================================================
const PRODUCT_PLACEHOLDER = "";
const products = window.SAHAND_PRODUCTS;
for (const p of Object.values(products)) p.images = p.media.images.map(assetUrl);

// ==================================================
// [CATEGORIES]
// ==================================================
const cats = [
  {
    "id": "cutting",
    "icon": "fa-scissors",
    "bg": "gradient-brand",
    "nameKey": "cat_cutting",
    "descKey": "cat_cutting_desc",
    "count": "9",
    "pid": "CT-001"
  },
  {
    "id": "welding",
    "icon": "fa-fire-flame-curved",
    "bg": "bg-gradient-to-br from-red-700 to-red-900",
    "nameKey": "cat_welding",
    "descKey": "cat_welding_desc",
    "count": "13",
    "pid": "WL-001"
  },
  {
    "id": "marking",
    "icon": "fa-pen-nib",
    "bg": "bg-gradient-to-br from-slate-700 to-slate-900",
    "nameKey": "cat_marking",
    "descKey": "cat_marking_desc",
    "count": "9",
    "pid": "ML-001"
  },
  {
    "id": "cleaning",
    "icon": "fa-spray-can-sparkles",
    "bg": "bg-gradient-to-br from-emerald-700 to-emerald-900",
    "nameKey": "cat_cleaning",
    "descKey": "cat_cleaning_desc",
    "count": "5",
    "pid": "CL-001"
  },
  {
    "id": "source",
    "icon": "fa-microchip",
    "bg": "bg-gradient-to-br from-cyan-700 to-cyan-900",
    "nameKey": "cat_source",
    "descKey": "cat_source_desc",
    "count": "12",
    "pid": "FS001"
  },
  {
    "id": "head",
    "icon": "fa-crosshairs",
    "bg": "bg-gradient-to-br from-violet-700 to-violet-900",
    "nameKey": "cat_head",
    "descKey": "cat_head_desc",
    "count": "17",
    "pid": "CH001"
  },
  {
    "id": "parts",
    "icon": "fa-gears",
    "bg": "bg-gradient-to-br from-amber-700 to-amber-900",
    "nameKey": "cat_parts",
    "descKey": "cat_parts_desc",
    "count": "13",
    "pid": "CC001"
  },
  {
    "id": "consumables",
    "icon": "fa-screwdriver",
    "bg": "bg-gradient-to-br from-pink-700 to-pink-900",
    "nameKey": "cat_consumables",
    "descKey": "cat_consumables_desc",
    "count": "15",
    "pid": "CN001"
  }
];

const apps = [
  { id:'elevator', icon:'fa-elevator', color:'yellow', key:'app_elevator' },
  { id:'kitchen', icon:'fa-kitchen-set', color:'orange', key:'app_kitchen' },
  { id:'auto', icon:'fa-car', color:'blue', key:'app_auto' },
  { id:'decor', icon:'fa-door-open', color:'pink', key:'app_decor' },
  { id:'jewelry', icon:'fa-ring', color:'yellow', key:'app_jewelry' },
  { id:'medical', icon:'fa-stethoscope', color:'purple', key:'app_medical' },
  { id:'heavy', icon:'fa-industry', color:'red', key:'app_industry' },
  { id:'promo', icon:'fa-pen-fancy', color:'indigo', key:'app_promo' },
  { id:'lab', icon:'fa-flask', color:'teal', key:'app_lab' }
];


const applicationDetails = {
  elevator: {
    icon:'fa-elevator', color:'yellow', key:'app_elevator',
    title:{fa:'آسانسورسازی',en:'Elevator Manufacturing',ar:'صناعة المصاعد',tr:'Asansör Üretimi'},
    intro:{fa:'در صنعت آسانسور، تکرارپذیری ابعاد، کیفیت لبه و سرعت تحویل قطعات اهمیت زیادی دارد. دستگاه‌های برش لیزر فایبر سهند برای برش ورق‌های استیل، فولاد و گالوانیزه در قطعات کابین، درب، فریم و تابلو برق مناسب‌اند و می‌توانند زمان آماده‌سازی قطعه را نسبت به روش‌های سنتی کاهش دهند.',en:'Fiber laser cutting is well suited to elevator panels, doors, frames and electrical cabinets where repeatability, clean edges and fast production matter.',ar:'يُستخدم القطع بليزر الفايبر في ألواح وأبواب وإطارات المصاعد ولوحات الكهرباء مع دقة وتكرارية عالية.',tr:'Fiber lazer kesim; asansör paneli, kapı, şase ve elektrik panolarında hassas ve tekrarlanabilir üretim sağlar.'},
    benefits:{fa:['برش دقیق ورق استیل و گالوانیزه برای کابین و درب','امکان تولید سری و تکرارپذیر قطعات با فایل CNC','کاهش پلیسه و عملیات تکمیلی در بسیاری از قطعات'],en:['Accurate stainless and galvanized cutting','Repeatable CNC batch production','Cleaner edges and less finishing'],ar:['قطع دقيق للستانلس والجلفنة','إنتاج متكرر بملفات CNC','حواف أنظف وتقليل التشطيب'],tr:['Hassas paslanmaz ve galvaniz kesim','Tekrarlanabilir CNC seri üretim','Daha temiz kenarlar']},
    machines:{fa:'دستگاه برش لیزر فایبر، جوشکار لیزری دستی، تجهیزات جانبی و چیلر',en:'Fiber laser cutter, handheld laser welder and auxiliaries',ar:'ماكينة قطع فايبر ولحام يدوي وتجهيزات مساعدة',tr:'Fiber kesim, el tipi kaynak ve yardımcı ekipmanlar'}
  },
  kitchen: {
    icon:'fa-kitchen-set', color:'orange', key:'app_kitchen',
    title:{fa:'آشپزخانه صنعتی',en:'Industrial Kitchens',ar:'المطابخ الصناعية',tr:'Endüstriyel Mutfak'},
    intro:{fa:'تولید سینک، هود، میز کار، کانتر و تجهیزات استیل نیازمند برش تمیز ورق‌های نازک و متوسط و جوش کم‌اعوجاج است. ترکیب برش فایبر و جوش لیزری سهند می‌تواند سرعت مونتاژ را بالا ببرد و ظاهر نهایی قطعه را تمیزتر نگه دارد.',en:'Fiber cutting and laser welding help produce sinks, hoods, counters and stainless equipment with clean edges and lower distortion.',ar:'يساعد القطع واللحام بالليزر في إنتاج الأحواض والشفاطات ومعدات الستانلس بحواف نظيفة وتشوه أقل.',tr:'Fiber kesim ve lazer kaynak; evye, davlumbaz ve paslanmaz ekipmanlarda temiz kenar ve düşük deformasyon sağlar.'},
    benefits:{fa:['برش تمیز استیل برای سینک، هود و میزکار','جوش سریع با اعوجاج و سنگ‌زنی کمتر','مناسب تولید سفارشی و تیراژ متوسط تا بالا'],en:['Clean stainless cutting','Fast low-distortion welding','Suitable for custom and batch production'],ar:['قطع نظيف للستانلس','لحام سريع بتشوه أقل','مناسب للإنتاج المخصص والمتكرر'],tr:['Temiz paslanmaz kesim','Düşük deformasyonlu hızlı kaynak','Özel ve seri üretime uygun']},
    machines:{fa:'دستگاه برش فایبر، جوشکار لیزری دستی و دستگاه تمیزکاری لیزری',en:'Fiber cutter, handheld welder and laser cleaner',ar:'قطع فايبر ولحام يدوي وتنظيف ليزري',tr:'Fiber kesim, el tipi kaynak ve lazer temizleme'}
  },
  auto: {
    icon:'fa-car', color:'blue', key:'app_auto',
    title:{fa:'خودروسازی و ماشین‌آلات',en:'Automotive & Machinery',ar:'السيارات والآلات',tr:'Otomotiv ve Makine'},
    intro:{fa:'در قطعه‌سازی خودرو، ماشین‌آلات کشاورزی و ساختمانی، سرعت تولید و ثبات ابعادی اهمیت مستقیم دارد. دستگاه‌های برش فایبر برای براکت، شاسی، کاور و قطعات ورقی و جوش لیزری برای اتصال سریع قطعات مناسب هستند.',en:'Laser cutting and welding support repeatable production of brackets, chassis parts, covers and sheet-metal components.',ar:'يدعم القطع واللحام بالليزر إنتاج الحوامل وأجزاء الشاسيه والأغطية وقطع الصفائح بدقة وتكرار.',tr:'Lazer kesim ve kaynak; braket, şase, kapak ve sac parçaların tekrarlanabilir üretimini destekler.'},
    benefits:{fa:['تولید سریع براکت، شاسی و قطعات ورقی','ثبات ابعادی برای مونتاژ سری','قابلیت برش فولاد، استیل و برخی آلیاژهای متداول'],en:['Fast sheet-part production','Repeatable dimensions','Multiple common metals'],ar:['إنتاج سريع للصفائح','أبعاد متكررة','معادن صناعية متعددة'],tr:['Hızlı sac parça üretimi','Tekrarlanabilir ölçüler','Yaygın metallere uygun']},
    machines:{fa:'برش لیزر فایبر، جوش لیزری و در کاربردهای خاص برش رباتیک',en:'Fiber cutter, laser welder and selected robotic solutions',ar:'قطع فايبر ولحام وحلول روبوتية مختارة',tr:'Fiber kesim, lazer kaynak ve seçili robotik çözümler'}
  },
  decor: {
    icon:'fa-door-open', color:'pink', key:'app_decor',
    title:{fa:'دکوراسیون و نما',en:'Decoration & Facades',ar:'الديكور والواجهات',tr:'Dekorasyon ve Cephe'},
    intro:{fa:'برای ساخت درب‌های فلزی دکوراتیو، پارتیشن، پنل نما و طرح‌های CNC، آزادی طراحی و کیفیت لبه مهم است. برش لیزر فایبر امکان اجرای الگوهای پیچیده و تکرارشونده را روی ورق فلزی فراهم می‌کند.',en:'Fiber laser enables detailed patterns for decorative doors, partitions and facade panels.',ar:'يتيح ليزر الفايبر تنفيذ نقوش دقيقة للأبواب والبارتشن وألواح الواجهات.',tr:'Fiber lazer; dekoratif kapı, bölme ve cephe panellerinde detaylı desenler sağlar.'},
    benefits:{fa:['اجرای طرح‌های هندسی و پیچیده با دقت بالا','تکرار دقیق طرح برای پروژه‌های چندپنلی','کاهش نیاز به قالب‌سازی برای طرح‌های متنوع'],en:['Detailed complex patterns','Repeatable panels','Less tooling for design changes'],ar:['نقوش معقدة ودقيقة','تكرار الألواح','تقليل القوالب'],tr:['Detaylı karmaşık desenler','Tekrarlı panel üretimi','Daha az kalıp ihtiyacı']},
    machines:{fa:'دستگاه برش لیزر فایبر و تجهیزات طراحی/کنترل CNC',en:'Fiber cutter and CNC control solutions',ar:'قطع فايبر وحلول تحكم CNC',tr:'Fiber kesim ve CNC kontrol çözümleri'}
  },
  jewelry: {
    icon:'fa-ring', color:'yellow', key:'app_jewelry',
    title:{fa:'طلا و جواهرسازی',en:'Jewelry',ar:'الذهب والمجوهرات',tr:'Takı ve Mücevher'},
    intro:{fa:'حکاکی لیزری برای درج متن، لوگو، سریال و طرح روی حلقه، انگشتر، پلاک و قطعات ظریف مناسب است. با انتخاب سورس و لنز مناسب می‌توان حکاکی ظریف و تکرارپذیر با حداقل تماس مکانیکی انجام داد.',en:'Laser marking enables fine text, logos, serials and patterns on rings, plaques and small jewelry parts.',ar:'يتيح الوسم بالليزر كتابة دقيقة للشعارات والأرقام والنقوش على الحُلي.',tr:'Lazer markalama; yüzük, plaka ve küçük takı parçalarında ince yazı, logo ve seri numarası sağlar.'},
    benefits:{fa:['حکاکی بدون تماس روی قطعات ظریف','امکان استفاده از روتاری برای حلقه و قطعات گرد','تکرارپذیری طرح و شماره سریال'],en:['Non-contact marking','Rotary support for rings','Repeatable logos and serials'],ar:['وسم بدون تلامس','دعم روتاري للحلقات','تكرار الشعارات والأرقام'],tr:['Temassız markalama','Yüzük için rotary desteği','Tekrarlı logo ve seri']},
    machines:{fa:'دستگاه حکاکی فایبر، MOPA یا UV بر اساس جنس و نتیجه مورد انتظار',en:'Fiber, MOPA or UV marking depending on material',ar:'فايبر أو MOPA أو UV حسب المادة',tr:'Malzemeye göre Fiber, MOPA veya UV markalama'}
  },
  medical: {
    icon:'fa-stethoscope', color:'purple', key:'app_medical',
    title:{fa:'تجهیزات پزشکی',en:'Medical Equipment',ar:'المعدات الطبية',tr:'Medikal Ekipman'},
    intro:{fa:'در ابزار پزشکی، خوانایی شناسه و پایداری مارک اهمیت بالایی دارد. حکاکی لیزری می‌تواند برای کد، شماره سریال، لوگو و علائم روی ابزارهای فلزی به‌کار رود؛ انتخاب پارامتر باید متناسب با جنس قطعه و الزامات تولید انجام شود.',en:'Laser marking can create durable IDs, serials and logos on metal medical tools when parameters are selected for the material and production requirement.',ar:'يمكن للوسم بالليزر إنشاء معرفات وأرقام وشعارات ثابتة على الأدوات الطبية المعدنية وفق متطلبات المادة والإنتاج.',tr:'Lazer markalama, metal medikal aletlerde malzeme ve üretim gereksinimine uygun kalıcı kimlik ve seri işaretleri oluşturabilir.'},
    benefits:{fa:['مارک خوانا و تکرارپذیر','بدون تماس مکانیکی با قطعه','قابل استفاده برای کد، سریال و لوگو'],en:['Readable repeatable marks','Non-contact process','Codes, serials and logos'],ar:['وسم واضح ومتكرر','عملية بدون تلامس','أكواد وأرقام وشعارات'],tr:['Okunaklı tekrarlı işaret','Temassız işlem','Kod, seri ve logo']},
    machines:{fa:'دستگاه حکاکی فایبر یا UV؛ انتخاب نهایی پس از بررسی جنس قطعه و نیاز مارکینگ',en:'Fiber or UV marker after material review',ar:'فايبر أو UV بعد مراجعة المادة',tr:'Malzeme incelemesine göre Fiber veya UV'}
  },
  heavy: {
    icon:'fa-industry', color:'red', key:'app_industry',
    title:{fa:'صنایع سنگین',en:'Heavy Industry',ar:'الصناعات الثقيلة',tr:'Ağır Sanayi'},
    intro:{fa:'در سازه‌های صنعتی، تجهیزات نفت و گاز و قطعه‌سازی سنگین، توان برش، پایداری شاسی و خدمات فنی اهمیت ویژه دارد. سهند لیزر می‌تواند بر اساس ضخامت، جنس ورق و ابعاد قطعه، توان سورس و میز مناسب را پیشنهاد دهد.',en:'Heavy fabrication needs suitable laser power, rigid machine structure and dependable technical support based on thickness and sheet size.',ar:'تحتاج الصناعات الثقيلة إلى قدرة ليزر وهيكل ماكينة مناسبين مع دعم فني موثوق حسب السماكة والأبعاد.',tr:'Ağır imalat; kalınlık ve sac ölçüsüne göre uygun lazer gücü, rijit makine ve güvenilir teknik destek gerektirir.'},
    benefits:{fa:['انتخاب توان بر اساس ضخامت و جنس واقعی ورق','مناسب‌سازی ابعاد میز برای قطعات بزرگ‌تر','پشتیبانی نصب، آموزش و تأمین قطعات'],en:['Power matched to thickness','Table size matched to parts','Installation and support'],ar:['قدرة مناسبة للسماكة','طاولة مناسبة للأجزاء','تركيب ودعم'],tr:['Kalınlığa uygun güç','Parçaya uygun tabla','Kurulum ve destek']},
    machines:{fa:'دستگاه‌های برش فایبر توان‌بالا، میزهای بزرگ و تجهیزات جانبی صنعتی',en:'High-power fiber cutters and large-format systems',ar:'ماكينات فايبر عالية القدرة وأنظمة كبيرة',tr:'Yüksek güçlü fiber kesim ve geniş format sistemler'}
  },
  promo: {
    icon:'fa-pen-fancy', color:'indigo', key:'app_promo',
    title:{fa:'تبلیغات و هدایای تبلیغاتی',en:'Promotional Products',ar:'المنتجات الدعائية',tr:'Promosyon Ürünleri'},
    intro:{fa:'برای شخصی‌سازی خودکار، فندک، پاوربانک، ماگ فلزی، پلاک و هدایای سازمانی، حکاکی لیزری روشی سریع و بدون مصرف جوهر است. فایل‌های متغیر مثل نام و شماره نیز قابل اجرا هستند.',en:'Laser marking is a fast ink-free method for pens, lighters, power banks, metal mugs, tags and personalized gifts.',ar:'الوسم بالليزر طريقة سريعة بدون حبر للأقلام والولاعات والباوربانك والأكواب والهدايا المخصصة.',tr:'Lazer markalama; kalem, çakmak, powerbank, metal kupa ve kişisel hediyelerde hızlı ve mürekkepsizdir.'},
    benefits:{fa:['شخصی‌سازی سریع نام، لوگو و شماره','مناسب سفارش‌های تکی و تیراژ','بدون جوهر و کلیشه چاپی'],en:['Fast personalization','Single and batch orders','No ink or print plate'],ar:['تخصيص سريع','للطلبات الفردية والمتكررة','بدون حبر'],tr:['Hızlı kişiselleştirme','Tekli ve seri sipariş','Mürekkepsiz']},
    machines:{fa:'دستگاه حکاکی فایبر رومیزی یا پرتابل؛ برای برخی مواد UV/MOPA',en:'Desktop/portable fiber marker; UV/MOPA for selected materials',ar:'فايبر مكتبي أو محمول وUV/MOPA لبعض المواد',tr:'Masaüstü/portatif Fiber; bazı malzemelerde UV/MOPA'}
  },
  lab: {
    icon:'fa-flask', color:'teal', key:'app_lab',
    title:{fa:'آزمایشگاهی و الکترونیک',en:'Laboratory & Electronics',ar:'المختبر والإلكترونيات',tr:'Laboratuvar ve Elektronik'},
    intro:{fa:'برای قطعات آزمایشگاهی، الکترونیکی، پلاک‌ها، کانکتورها و قطعات کوچک، کنترل نقطه مارک و تکرارپذیری اهمیت دارد. حکاکی لیزری می‌تواند برای شناسه، QR، سریال و علائم فنی استفاده شود.',en:'Laser marking supports IDs, QR codes, serials and technical marks on laboratory and electronic parts.',ar:'يدعم الوسم بالليزر المعرفات وQR والأرقام والعلامات الفنية على القطع المخبرية والإلكترونية.',tr:'Lazer markalama; laboratuvar ve elektronik parçalarda kimlik, QR, seri ve teknik işaretler sağlar.'},
    benefits:{fa:['مناسب قطعات کوچک و حساس','قابلیت حکاکی QR، سریال و متن ریز','تکرارپذیری بالا برای تولید و ردیابی'],en:['Small-part marking','QR/serial/fine text','Repeatability and traceability'],ar:['وسم الأجزاء الصغيرة','QR وأرقام ونص دقيق','تكرارية وتتبع'],tr:['Küçük parça markalama','QR/seri/ince yazı','Tekrarlanabilirlik ve izlenebilirlik']},
    machines:{fa:'حکاکی فایبر، MOPA یا UV بر اساس جنس، رنگ مارک و ظرافت مورد نیاز',en:'Fiber, MOPA or UV depending on material and mark requirement',ar:'فايبر أو MOPA أو UV حسب المادة والنتيجة',tr:'Malzeme ve işaret ihtiyacına göre Fiber, MOPA veya UV'}
  }
};

// ==================================================
// [AUTHENTIC MEDIA + LEGACY PRODUCT REFERENCES]
// Only verified Sahand-owned/public site media is attached here. No competitor images.
// 360° is enabled only when a product has multiple real frames.
// ==================================================
const legacyProductPages = {
  'CT-001':'https://sahandlaser.com/%D9%84%DB%8C%D8%B2%D8%B1-%D8%A8%D8%B1%D8%B4-%D9%81%D9%84%D8%B2%D8%A7%D8%AA-%D9%85%D8%AF%D9%84-%D8%A7%D8%B3%D8%AA%D8%A7%D9%86%D8%AF%D8%A7%D8%B1%D8%AF/',
  'CT-002':'https://sahandlaser.com/%D8%AF%D8%B3%D8%AA%DA%AF%D8%A7%D9%87-%D8%A8%D8%B1%D8%B4-%D9%84%DB%8C%D8%B2%D8%B1-%D9%81%D8%A7%DB%8C%D8%A8%D8%B1-%D8%AF%D9%88%D9%85%DB%8C%D8%B2-3015-%D8%A7%D8%B3%D8%AA%D8%A7%D9%86%D8%AF%D8%A7%D8%B1/',
  'CT-003':'https://sahandlaser.com/%D8%AF%D8%B3%D8%AA%DA%AF%D8%A7%D9%87-%D8%A8%D8%B1%D8%B4-%D9%84%DB%8C%D8%B2%D8%B1-%D8%AF%D9%88%D9%85%DB%8C%D8%B2-%D9%81%D8%A7%DB%8C%D8%A8%D8%B1-3015-%D8%A8%D8%A7-%D8%B1%D9%88%D8%AA%D8%A7%D8%B1%DB%8C/',
  'CT-009':'https://sahandlaser.com/%D9%84%DB%8C%D8%B2%D8%B1-%D9%81%D8%A7%DB%8C%D8%A8%D8%B1-%D8%A8%D8%A7-%D9%85%DB%8C%D8%B2-%D8%AF%D9%88%D9%85-%D9%88-%DA%A9%D8%A7%D9%88%D8%B1-%D8%A8%D8%A7-%D8%B1%D9%88%D8%AA%D8%A7%D8%B1%DB%8C/'
};
// Authentic product image sets recovered from the preserved V4 site build / original Sahand archive.
function isPlaceholderImage(src){ return !src || src === PRODUCT_PLACEHOLDER || String(src).startsWith('data:image/svg+xml;base64,'); }

const services = [{"icon":"fa-truck-fast","color":"blue","title":{"fa":"نصب و راه‌اندازی","en":"Installation & Commissioning","ar":"التركيب والتشغيل","tr":"Kurulum ve Devreye Alma"},"desc":{"fa":"نصب، کالیبراسیون، تست و تحویل دستگاه در محل پروژه.","en":"Installation, calibration, testing and commissioning.","ar":"التركيب والمعايرة والاختبار والتشغيل.","tr":"Kurulum, kalibrasyon, test ve devreye alma."}},{"icon":"fa-microchip","color":"purple","title":{"fa":"تعمیر سورس و هد لیزر","en":"Laser Source & Head Repair","ar":"إصلاح مصدر ورأس الليزر","tr":"Lazer Kaynağı ve Kafa Onarımı"},"desc":{"fa":"عیب‌یابی و تعمیر تخصصی سورس، هد و اجزای مرتبط.","en":"Specialized diagnostics and repair of laser sources and heads.","ar":"فحص وإصلاح متخصص لمصادر ورؤوس الليزر.","tr":"Lazer kaynakları ve kafalarının uzman onarımı."}},{"icon":"fa-screwdriver-wrench","color":"amber","title":{"fa":"تعمیر دستگاه لیزر","en":"Laser Machine Repair","ar":"إصلاح أجهزة الليزر","tr":"Lazer Makinesi Onarımı"},"desc":{"fa":"تعمیر و سرویس دستگاه‌های لیزر، از جمله بسیاری از دستگاه‌های عرضه‌شده توسط مجموعه‌های دیگر.","en":"Repair and service for laser machines, including many third-party supplied systems.","ar":"إصلاح وصيانة أجهزة الليزر بما فيها العديد من الأنظمة الموردة من جهات أخرى.","tr":"Diğer tedarikçilerin birçok sistemi dahil lazer makineleri için servis ve onarım."}},{"icon":"fa-graduation-cap","color":"emerald","title":{"fa":"آموزش اپراتور و فنی","en":"Operator & Technical Training","ar":"تدريب المشغل والفني","tr":"Operatör ve Teknik Eğitim"},"desc":{"fa":"آموزش اپراتوری، تنظیمات برش، نگهداری، عیب‌یابی و ایمنی.","en":"Operator training, cutting settings, maintenance, troubleshooting and safety.","ar":"تدريب التشغيل والإعدادات والصيانة واستكشاف الأعطال والسلامة.","tr":"Operatör eğitimi, kesim ayarları, bakım, arıza tespiti ve güvenlik."}},{"icon":"fa-boxes-packing","color":"pink","title":{"fa":"تأمین قطعات یدکی","en":"Spare Parts Supply","ar":"توريد قطع الغيار","tr":"Yedek Parça Tedariki"},"desc":{"fa":"تأمین سورس، هد، چیلر، نازل و قطعات مصرفی و یدکی.","en":"Supply of sources, heads, chillers, nozzles and spare/consumable parts.","ar":"توريد المصادر والرؤوس والمبردات والفوهات وقطع الغيار.","tr":"Kaynak, kafa, chiller, nozul ve yedek/sarf parça tedariği."}},{"icon":"fa-lightbulb","color":"cyan","title":{"fa":"مشاوره تخصصی","en":"Technical Consulting","ar":"استشارة فنية","tr":"Teknik Danışmanlık"},"desc":{"fa":"تحلیل نیاز، انتخاب توان، ابعاد میز، نوع هد، سورس و کانفیگ مناسب.","en":"Needs analysis and configuration selection.","ar":"تحليل الاحتياج واختيار التجهيز المناسب.","tr":"İhtiyaç analizi ve uygun konfigürasyon seçimi."}},{"icon":"fa-scissors","color":"red","title":{"fa":"خدمات برش لیزر","en":"Laser Cutting Service","ar":"خدمة القطع بالليزر","tr":"Lazer Kesim Hizmeti"},"desc":{"fa":"خدمات برش لیزر قطعات و ورق‌های فلزی بر اساس ظرفیت و برنامه تولید.","en":"Laser cutting services for metal sheets and parts.","ar":"خدمات قطع الليزر للصفائح والقطع المعدنية.","tr":"Metal sac ve parçalar için lazer kesim hizmeti."}},{"icon":"fa-pen-nib","color":"indigo","title":{"fa":"خدمات حکاکی و مارکینگ","en":"Laser Marking & Engraving Service","ar":"خدمة الوسم والحفر بالليزر","tr":"Lazer Markalama ve Gravür"},"desc":{"fa":"حکاکی و مارکینگ متن، لوگو، سریال، QR و علائم فنی روی قطعات مناسب.","en":"Marking and engraving of text, logos, serials, QR codes and technical marks.","ar":"وسم وحفر النصوص والشعارات والأرقام وQR والعلامات الفنية.","tr":"Metin, logo, seri, QR ve teknik işaret markalama/gravür hizmeti."}}];

const projects = [];


const downloadGroups = [{"id":"cypcut","title":"نرم‌افزار CypCut دستگاه برش لیزر","icon":"fa-scissors","items":[{"name":"CypCut","version":"6.3.765.10","size":"100 MB","url":"https://drive.google.com/file/d/1Sdyabvt3Gi5BCkmeU2mPs4ACNniGj-6_/view?usp=sharing","status":null},{"name":"CypCut","version":"6.3.702.8A","size":"26 MB","url":"https://drive.google.com/file/d/1tGIvsV55K227LUYmm3kA2NIBbBdm_8zh/view?usp=sharing","status":null},{"name":"CypCut","version":"6.3.712.9","size":"31 MB","url":"https://drive.google.com/file/d/1tpPdQ1sWxvqiGicOrIOVV9Sr70mKSoiQ/view?usp=sharing","status":null},{"name":"CypCut","version":"6.3.739.7","size":"37 MB","url":"https://drive.google.com/file/d/1vvem8RF3jKZH7lGRllu6LXv-q8XAcGOb/view?usp=sharing","status":null},{"name":"CypCut","version":"6.3.761.4","size":"52 MB","url":"https://drive.google.com/file/d/1TPBZGwfQdmTewdikitezxw4aMV3mqMZ8/view?usp=sharing","status":null},{"name":"CypCut","version":"6.2.436","size":"21 MB","url":"https://drive.google.com/file/d/1rAhng7bvWtSj3ltUFxY2dNi6YDhISJyX/view?usp=drive_link","status":null},{"name":"CypCut","version":"6.3.649.7","size":"22 MB","url":"https://drive.google.com/file/d/1-rY1lFGu-YDlddOEN0A6gvlmxWKnGTyE/view?usp=sharing","status":null},{"name":"CypCut","version":"6.3.658.10","size":"25 MB","url":"https://drive.google.com/file/d/1WL1ZJTt1Acm9gvJkgBO1qKa4sYVyfBWW/view?usp=sharing","status":null},{"name":"CypCut","version":"6.1.712.4","size":"27 MB","url":"https://drive.google.com/file/d/1hLTZfM2jbOK5H0xV-LW8m04Ord_Lc7gZ/view?usp=sharing","status":null},{"name":"CypCut","version":"6.1.723.3","size":"28 MB","url":"https://drive.google.com/file/d/1Bp2mRuhftNxVw6xKuvJEL_Yo9kfyxkNB/view?usp=sharing","status":null},{"name":"CypCut","version":"6.1.724.1","size":"37 MB","url":"https://drive.google.com/file/d/1qGFo3areWwmjiCNdyTEEwTIa4WS-_xYI/view?usp=sharing","status":null},{"name":"CypCut","version":"6.4.940.2","size":"24 MB","url":"https://drive.google.com/file/d/1e187Yrg-DcSVsyGKlZC2AS-K3G57CV3o/view?usp=sharing","status":null},{"name":"CypCut","version":"1.0.391.4-2","size":"20 MB","url":null,"status":"موجود در سایت فعلی؛ لینک مستقیم در این بانک هنوز استخراج نشده"}]},{"id":"ezcad","title":"نرم‌افزار EZCad دستگاه فایبر مارکینگ","icon":"fa-pen-nib","items":[{"name":"EZCad","version":"2.5.3","size":"12 MB","url":"https://drive.google.com/file/d/1AvEGtvqdyctSc2QCg_kG6C-sR7orjlK0/view?usp=sharing"},{"name":"EZCad","version":"2.7.6","size":"2.61 MB","url":"https://drive.google.com/file/d/1pDo3K3aeGDbPnjpYnwb_wgmNlmlajnFl/view?usp=sharing"},{"name":"EZCad","version":"2.14.9","size":"4 MB","url":"https://drive.google.com/file/d/1ZvBdHScAJ8elWiPAPu6mjNBVf_UJ4kev/view?usp=sharing"},{"name":"EZCad","version":"2.14.10","size":"30 MB","url":"https://drive.google.com/file/d/1W8-rcJ8oaNnCwmZGG3sQ6fYQtvKnEmw4/view?usp=sharing"},{"name":"EZCad","version":"2.14.11","size":"2.87 MB","url":"https://drive.google.com/file/d/1K9f-Illdjm4bQs7k_yBk4u0ETkZMaINL/view?usp=sharing"},{"name":"EZCad","version":"2.14.13","size":"29 MB","url":"https://drive.google.com/file/d/1ESZ5pb1F9f5-mMZ-kzSkqIxKcTbQmPRC/view?usp=sharing"},{"name":"EZCad","version":"2.14.16","size":"2.86 MB","url":"https://drive.google.com/file/d/1Q2Q9Hn8X1AD4XXydLsCoVYBHoqzgY0Vj/view?usp=sharing"}]},{"id":"drivers","title":"درایورهای نصب EZCad","icon":"fa-microchip","items":[{"name":"EZCad Driver","version":null,"size":"3.7 MB","url":"https://drive.google.com/file/d/10lpsYJk7Qb1Misjkis_bbVV1nMoBTFS2/view?usp=sharing"},{"name":"EZCad Driver","version":null,"size":"2.81 MB","url":"https://drive.google.com/file/d/14nxx2Ii9yoF16LUlnsnFNbGpGoA6X0DG/view?usp=sharing"},{"name":"EZCad Driver","version":null,"size":"15.7 MB","url":"https://drive.google.com/file/d/1g6CXNfyqmzVroq8-zU2CiwzVT5ju7ODo/view?usp=sharing"},{"name":"EZCad Driver","version":null,"size":"6.68 MB","url":"https://drive.google.com/file/d/1Iv-p0cu9qBSXt6IgiqkKFRzqR8KKGcgQ/view?usp=sharing"}]}];

// ==================================================
// [STATE]
// ==================================================
let currentLang = Storage.get('lang', 'fa');
let currentProductId = null;
let currentApplicationId = null;
let viewerController = null;
let currentSlide = 0;

// ==================================================
// [THEME]
// ==================================================
function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  Storage.set('theme', isDark ? 'dark' : 'light');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
function setColorTheme(name) {
  document.documentElement.setAttribute('data-theme', name);
  Storage.set('colorTheme', name);
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === name));
}
document.addEventListener('click', e => {
  const btn = e.target.closest('.theme-btn');
  if (btn) setColorTheme(btn.dataset.theme);
});

// ==================================================
// [LANG]
// ==================================================
function setLang(lang) {
  currentLang = lang;
  Storage.set('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = (lang === 'en' || lang === 'tr') ? 'ltr' : 'rtl';
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (T[lang] && T[lang][k] !== undefined) el.textContent = T[lang][k];
  });
  // Eitaa/Bale only for Persian
  document.querySelectorAll('.lang-fa-only').forEach(el => {
    el.style.display = (lang === 'fa') ? '' : 'none';
  });
  renderHomeProducts();
  renderProductsGrid();
  renderCatalogFilter();
  renderAllProducts(activeCatalogFilter);
  renderDownloads();
  renderApps();
  renderServices();
  renderProjects();
  renderContacts();
  if (currentProductId) renderProduct(currentProductId);
  if (currentApplicationId) renderApplication(currentApplicationId);
}

function openOfficeMap(event) {
  const lat = '32.740321', lng = '51.586357';
  const label = encodeURIComponent('فناوران پرتو لیزر سهند');
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) { window.location.href = `geo:${lat},${lng}?q=${lat},${lng}(${label})`; return false; }
  if (/iPhone|iPad|iPod/i.test(ua)) { window.location.href = `maps://?q=${label}&ll=${lat},${lng}`; return false; }
  window.open(`https://maps.google.com/?q=${lat},${lng}`, '_blank', 'noopener,noreferrer');
  return false;
}

// ==================================================
// [MOBILE MENU]
// ==================================================
function toggleMobile() {
  const m = document.getElementById('mobile-menu');
  const i = document.getElementById('mobile-icon');
  const h = m.classList.toggle('hidden');
  i.className = h ? 'fa-solid fa-bars' : 'fa-solid fa-xmark';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeInquiry(); closeChatWidget(); }
});

// ==================================================
// [HERO SLIDER]
// ==================================================
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.getElementById('hero-dots');
  if (!slides.length || !dots) return;
  dots.innerHTML = slides.length ? Array.from(slides).map((_,i) => `<span class="hero-dot ${i===0?'active':''}" onclick="goSlide(${i})"></span>`).join('') : '';
  setInterval(() => { slideNav(1); }, 6000);
}
function slideNav(dir) {
  const slides = document.querySelectorAll('.hero-slide');
  if (!slides.length) return;
  currentSlide = (currentSlide + dir + slides.length) % slides.length;
  goSlide(currentSlide);
}
function goSlide(i) {
  currentSlide = i;
  document.querySelectorAll('.hero-slide').forEach((s,idx) => s.classList.toggle('active', idx===i));
  document.querySelectorAll('.hero-dot').forEach((d,idx) => d.classList.toggle('active', idx===i));
}

// ==================================================
// [ROUTING]
// ==================================================
const ROUTES = ['home','about','products','services','applications','projects','training','downloads','contact','product'];
function applyRoute() {
  const hash = window.location.hash || '#home';
  if (hash.startsWith('#application=')) {
    const id = hash.substring(13);
    if (applicationDetails[id]) {
      showView('application'); currentApplicationId = id; currentProductId = null; renderApplication(id);
      updateActiveNav('applications'); window.scrollTo({top:0, behavior:'smooth'}); return;
    }
    window.location.hash = '#applications'; return;
  }
  if (hash.startsWith('#product=')) {
    const id = hash.substring(9);
    if (products[id]) {
      showView('product'); currentProductId = id; currentApplicationId = null; renderProduct(id);
      updateActiveNav('products');
      window.scrollTo({top:0, behavior:'smooth'}); return;
    } else { alert(T[currentLang].product_not_found); window.location.hash = '#products'; return; }
  }
  const route = hash.replace('#','') || 'home';
  if (ROUTES.includes(route)) { showView(route); currentProductId = null; currentApplicationId = null; updateActiveNav(route); }
  else { showView('home'); updateActiveNav('home'); }
  window.scrollTo({top:0, behavior:'smooth'});
}
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const v = document.getElementById('view-' + name);
  if (v) v.classList.add('active');
}
function updateActiveNav(name) {
  document.querySelectorAll('[data-nav]').forEach(n => n.classList.remove('active'));
  const a = document.querySelector(`[data-nav="${name}"]`);
  if (a) a.classList.add('active');
}
function navigateTo(name) { window.location.hash = '#' + name; }
function showProduct(id) { if (products[id]) window.location.hash = 'product=' + id; }
function showApplication(id) { if (applicationDetails[id]) window.location.hash = 'application=' + id; }
function openCategory(id) {
  navigateTo('products');
  setTimeout(() => { filterCatalog(id); document.getElementById('full-catalog-section')?.scrollIntoView({behavior:'smooth', block:'start'}); }, 60);
}
function renderCatalogFilter() {
  const box=document.getElementById('catalog-filter'); if(!box) return;
  const allLabel=currentLang==='fa'?'همه محصولات':currentLang==='ar'?'كل المنتجات':currentLang==='tr'?'Tüm Ürünler':'All Products';
  box.innerHTML=`<button type="button" class="active" data-filter="all" onclick="filterCatalog('all')">${allLabel}</button>`+cats.map(c=>`<button type="button" data-filter="${c.id}" onclick="filterCatalog('${c.id}')">${escapeHtml(T[currentLang][c.nameKey]||c.nameKey)} <span class="opacity-70">(${c.count})</span></button>`).join('');
}
function renderAllProducts(filter='all') {
  const g=document.getElementById('all-products-grid'); if(!g) return;
  const lang=currentLang;
  const items=Object.values(products).filter(p=>filter==='all'||p.categoryId===filter);
  g.innerHTML=items.map(p=>`<article class="product-mini-card bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 card-hover">
    <button type="button" onclick="showProduct('${p.code}')" class="visual w-full" aria-label="${escapeHtml(p.title[lang]||p.title.fa)}"><img src="${escapeHtml(p.images[0]||PRODUCT_PLACEHOLDER)}" alt="${escapeHtml(p.title[lang]||p.title.fa)}" loading="lazy"></button>
    <div class="p-5 flex-1 flex flex-col"><div class="flex items-center justify-between gap-2 mb-2"><span class="product-code">${escapeHtml(p.code)}</span><span class="text-[11px] text-slate-500">${escapeHtml(p.cat[lang]||p.cat.fa)}</span></div><h3 class="font-bold text-brand dark:text-white leading-7 mb-2">${escapeHtml(p.title[lang]||p.title.fa)}</h3><p class="text-xs text-slate-500 leading-6 mb-4">${escapeHtml((p.description[lang]||p.description.fa||[])[0]||'')}</p><button type="button" onclick="showProduct('${p.code}')" class="mt-auto inline-flex items-center gap-2 text-accent font-bold text-sm">${escapeHtml(T[lang].view_details)} <i class="fa-solid fa-arrow-left"></i></button></div>
  </article>`).join('');
}
function filterCatalog(filter='all') {
  document.querySelectorAll('#catalog-filter button').forEach(b=>b.classList.toggle('active',b.dataset.filter===filter));
  renderAllProducts(filter);
}
function renderDownloads() {
  const root=document.getElementById('downloads-dynamic'); if(!root) return;
  root.innerHTML=downloadGroups.map(g=>`<section><h2 class="download-group-title"><i class="fa-solid ${g.icon} text-accent"></i>${escapeHtml(g.title)}</h2><div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">${g.items.map(i=>`<article class="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800"><div class="flex items-start gap-4"><div class="w-12 h-12 rounded-xl gradient-brand text-white flex items-center justify-center shrink-0"><i class="fa-solid fa-download"></i></div><div class="min-w-0 flex-1"><h3 class="font-bold text-brand dark:text-white">${escapeHtml(i.name)}${i.version?' '+escapeHtml(i.version):''}</h3><div class="text-xs text-slate-500 mt-2 mb-3">${i.size?escapeHtml(i.size):''}${i.status?' — '+escapeHtml(i.status):''}</div>${i.url?`<a class="dl-btn" href="${escapeHtml(i.url)}" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-download"></i> دانلود</a>`:`<span class="text-xs px-3 py-2 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">لینک مستقیم هنوز ثبت نشده</span>`}</div></div></article>`).join('')}</div></section>`).join('');
}


// ==================================================
// [RENDER FUNCTIONS]
// ==================================================
function renderHomeProducts() {
  const g = document.getElementById('home-products-grid');
  if (!g) return;
  g.innerHTML = cats.map(c => renderCatCard(c)).join('');
}
function renderProductsGrid() {
  const g1 = document.getElementById('products-grid-1');
  const g2 = document.getElementById('products-grid-2');
  if (g1) g1.innerHTML = cats.slice(0,4).map(c => renderCatCard(c)).join('');
  if (g2) g2.innerHTML = cats.slice(4).map(c => renderCatCard(c)).join('');
}
function renderCatCard(c) {
  const t = T[currentLang];
  return `
    <div onclick="openCategory('${c.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openCategory('${c.id}')}" role="link" tabindex="0" aria-label="${escapeHtml(t[c.title] || '')}" class="card-hover group bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer">
      <div class="h-44 ${c.bg} relative flex items-center justify-center overflow-hidden">
        <i class="fa-solid ${c.icon} text-white/20 text-8xl group-hover:scale-110 transition-transform duration-500"></i>
        <span class="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">${c.count}</span>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-brand dark:text-white mb-2">${escapeHtml(t[c.nameKey] || c.nameKey)}</h3>
        <p class="text-sm text-slate-500 leading-relaxed mb-4">${escapeHtml(t[c.descKey] || '')}</p>
        <div class="flex items-center gap-2 text-accent text-sm font-semibold">
          <span>${escapeHtml(t.view_models)}</span>
          <i class="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
        </div>
      </div>
    </div>`;
}
function renderApps() {
  const g = document.getElementById('apps-grid');
  if (!g) return;
  const t = T[currentLang];
  g.innerHTML = apps.map(a => `
    <article onclick="showApplication('${a.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();showApplication('${a.id}')}" tabindex="0" role="link" class="application-card card-hover cursor-pointer bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <div class="feature-icon-box bg-${a.color}-100 dark:bg-${a.color}-900/30 text-${a.color}-600 dark:text-${a.color}-400"><i class="fa-solid ${a.icon}"></i></div>
      <h3 class="font-bold text-lg text-brand dark:text-white mb-2">${escapeHtml(t[a.key] || '')}</h3>
      <p class="text-sm text-slate-500 mb-4">${escapeHtml(t[a.key+'_desc'] || '')}</p>
      <div class="text-accent text-sm font-bold flex items-center gap-2">مشاهده راهکار این صنعت <i class="fa-solid fa-arrow-left app-arrow"></i></div>
    </article>`).join('');
}
function renderApplication(id) {
  const a = applicationDetails[id];
  if (!a) return;
  const lang = currentLang;
  document.getElementById('application-title').textContent = a.title[lang] || a.title.fa;
  document.getElementById('application-breadcrumb').textContent = a.title[lang] || a.title.fa;
  document.getElementById('application-intro').textContent = a.intro[lang] || a.intro.fa;
  document.getElementById('application-machines').textContent = a.machines[lang] || a.machines.fa;
  const icon = document.getElementById('application-hero-icon');
  if (icon) icon.className = `fa-solid ${a.icon}`;
  const benefits = a.benefits[lang] || a.benefits.fa;
  document.getElementById('application-benefits').innerHTML = benefits.map(x => `<div class="flex gap-3 items-start p-4 rounded-xl bg-slate-50 dark:bg-slate-900"><i class="fa-solid fa-circle-check text-emerald-500 mt-1"></i><span class="text-sm leading-6">${escapeHtml(x)}</span></div>`).join('');
  document.title = `${a.title[lang] || a.title.fa} | سهند لیزر`;
}
function renderServices() {
  const g = document.getElementById('services-grid');
  if (!g) return;
  const lang=currentLang;
  g.innerHTML = services.map(s => `
    <div class="card-hover bg-slate-50 dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
      <div class="feature-icon-box bg-${s.color}-100 dark:bg-${s.color}-900/30 text-${s.color}-600 dark:text-${s.color}-400"><i class="fa-solid ${s.icon}"></i></div>
      <h3 class="font-bold text-lg text-brand dark:text-white mb-2">${escapeHtml(s.title[lang]||s.title.fa)}</h3>
      <p class="text-sm text-slate-500 leading-relaxed mb-4">${escapeHtml(s.desc[lang]||s.desc.fa)}</p>
      <button onclick="openInquiry('', '${escapeHtml(s.title.fa)}')" class="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all"><span>${escapeHtml(T[lang].request_service)}</span><i class="fa-solid fa-arrow-left"></i></button>
    </div>`).join('');
}
function renderProjects() {
  const g = document.getElementById('projects-grid');
  if (!g) return;
  const lang=currentLang;
  const title = lang==='fa'?'پرونده پروژه‌های قابل انتشار در حال تکمیل است':lang==='ar'?'يتم تجهيز ملفات المشاريع القابلة للنشر':lang==='tr'?'Yayınlanabilir proje dosyaları hazırlanıyor':'Publishable project case studies are being prepared';
  const desc = lang==='fa'?'برای جلوگیری از نمایش اطلاعات یا تصاویر غیرواقعی، فقط پروژه‌هایی که عکس، مشخصات فنی و مجوز انتشارشان تأیید شده باشد در این بخش قرار می‌گیرند. در حال حاضر برای مشاهده توان اجرایی سهند لیزر می‌توانید از بخش محصولات، خدمات فنی و آموزش استفاده کنید.':lang==='en'?'To avoid unverified claims or images, this section will only publish projects with confirmed technical data, media and permission.':'';
  g.innerHTML=`<div class="md:col-span-2 lg:col-span-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 md:p-12 text-center"><div class="w-16 h-16 mx-auto rounded-2xl gradient-brand text-white flex items-center justify-center text-2xl mb-5"><i class="fa-solid fa-folder-open"></i></div><h3 class="text-2xl font-extrabold text-brand dark:text-white mb-3">${escapeHtml(title)}</h3><p class="text-slate-500 leading-8 max-w-3xl mx-auto mb-6">${escapeHtml(desc||'Project case studies will be published after technical verification and publication approval.')}</p><button type="button" onclick="openInquiry('', 'نمونه پروژه و توان اجرایی')" class="px-6 py-3 bg-accent text-white rounded-xl font-bold">درخواست نمونه پروژه مرتبط</button></div>`;
}
function renderContacts() {
  const g = document.getElementById('contact-list');
  if (!g) return;
  const all = [...contacts.sales, ...contacts.support, ...contacts.finance];
  const isFa = currentLang === 'fa';
  g.innerHTML = all.map(c => `
    <div class="p-3 flex items-center justify-between gap-3 rounded-lg hover:bg-accent/5 flex-wrap">
      <div><div class="text-xs text-slate-500">${escapeHtml(c.label)} — ${escapeHtml(c.name)}</div><a href="tel:+${escapeHtml(c.phone)}" class="text-sm font-semibold hover:text-accent" dir="ltr">${formatPhone(c.phone)}</a></div>
      <div class="contact-actions">
        <a href="tel:+${c.phone}" class="btn-call" title="تماس"><i class="fa-solid fa-phone"></i></a>
        <a href="https://wa.me/${c.phone}" target="_blank" rel="noopener noreferrer" class="btn-wa" title="واتساپ"><i class="fa-brands fa-whatsapp"></i></a>
        ${c.telegram ? `<a href="https://t.me/+${c.telegram}" target="_blank" rel="noopener noreferrer" class="btn-tg" title="تلگرام"><i class="fa-brands fa-telegram"></i></a>` : ''}
        ${isFa ? `<a href="https://eitaa.com/sahandlaser_sale" target="_blank" rel="noopener noreferrer" class="btn-eitaa" title="ایتا"><svg class="brand-app-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect width="24" height="24" rx="5.2" fill="#F58220"/><path fill="#fff" d="M5.968 23.942a6.624 6.624 0 0 1-2.332-.83c-1.62-.929-2.829-2.593-3.217-4.426-.151-.717-.17-1.623-.15-7.207C.288 5.47.274 5.78.56 4.79c.142-.493.537-1.34.823-1.767C2.438 1.453 3.99.445 5.913.08c.384-.073.94-.08 6.056-.08 6.251 0 6.045-.009 7.066.314a6.807 6.807 0 0 1 4.314 4.184c.33.937.346 1.087.369 3.555l.02 2.23-.391.268c-.558.381-1.29 1.06-2.316 2.15-1.182 1.256-2.376 2.42-2.982 2.907-1.309 1.051-2.508 1.651-3.726 1.864-.634.11-1.682.067-2.302-.095-.553-.144-.517-.168-.726.464a6.355 6.355 0 0 0-.318 1.546l-.031.407-.146-.03c-1.215-.241-2.419-1.285-2.884-2.5a3.583 3.583 0 0 1-.26-1.219l-.016-.34-.309-.284c-.644-.59-1.063-1.312-1.195-2.061-.212-1.193.34-2.542 1.538-3.756 1.264-1.283 3.127-2.29 4.953-2.68.658-.14 1.818-.177 2.403-.075 1.138.198 2.067.773 2.645 1.639.182.271.195.31.177.555a.812.812 0 0 1-.183.493c-.465.651-1.848 1.348-3.336 1.68-2.625.585-4.294-.142-4.033-1.759.026-.163.04-.304.031-.313-.032-.032-.293.104-.575.3-.479.334-.903.984-1.05 1.607-.036.156-.05.406-.034.65.02.331.053.454.192.736.092.186.275.45.408.589l.24.251-.096.122a4.845 4.845 0 0 0-.677 1.217 3.635 3.635 0 0 0-.105 1.815c.103.461.421 1.095.739 1.468.242.285.797.764.886.764.024 0 .044-.048.044-.106.001-.23.184-.973.326-1.327.423-1.058 1.351-1.96 2.82-2.74.245-.13.952-.47 1.572-.757 1.36-.63 2.103-1.015 2.511-1.305 1.176-.833 1.903-2.065 2.14-3.625.086-.57.086-1.634 0-2.207-.368-2.438-2.195-4.096-4.818-4.37-2.925-.307-6.648 1.953-8.942 5.427-1.116 1.69-1.87 3.565-2.187 5.443-.123.728-.169 2.08-.093 2.75.193 1.704.822 3.078 1.903 4.156a6.531 6.531 0 0 0 1.87 1.313c2.368 1.13 4.99 1.155 7.295.071.996-.469 1.974-1.196 3.023-2.25 1.02-1.025 1.71-1.88 3.592-4.458 1.04-1.423 1.864-2.368 2.272-2.605l.15-.086-.019 3.091c-.018 2.993-.022 3.107-.123 3.561-.6 2.678-2.54 4.636-5.195 5.242l-.468.107-5.775.01c-4.734.008-5.85-.002-6.19-.056z" transform="scale(.92) translate(1.05 1.05)"/></svg></a>` : ''}
        ${isFa ? `<a href="https://ble.ir/sahandlaser_sale" target="_blank" rel="noopener noreferrer" class="btn-bale" title="بله"><svg class="brand-app-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><defs><linearGradient id="baleGradient" x1="4" y1="20" x2="20" y2="4" gradientUnits="userSpaceOnUse"><stop stop-color="#302B8C"/><stop offset=".55" stop-color="#168FA0"/><stop offset="1" stop-color="#36D6A4"/></linearGradient></defs><path fill="url(#baleGradient)" d="M12 1.2C5.85 1.2 1.2 5.82 1.2 11.92c0 6.06 4.54 10.88 10.78 10.88 6.12 0 10.82-4.72 10.82-10.82C22.8 5.9 18.16 1.2 12 1.2Z"/><path fill="#fff" d="M6.2 11.7a1.75 1.75 0 0 1 2.47-.04l2.15 2.08 4.68-5.3a1.75 1.75 0 1 1 2.62 2.32l-5.88 6.66a1.75 1.75 0 0 1-2.54.08l-3.46-3.34a1.75 1.75 0 0 1-.04-2.46Z"/></svg></a>` : ''}
      </div>
    </div>`).join('');
}
function formatPhone(p) {
  if (p.startsWith('98') && p.length === 12) return '0' + p.substring(2,5) + '-' + p.substring(5,8) + '-' + p.substring(8);
  return p;
}

// ==================================================
// [RENDER PRODUCT DETAIL]
// ==================================================
function renderProduct(id) {
  const p = products[id];
  if (!p) return;
  const lang = currentLang;
  const title = p.title[lang] || p.title.fa;
  document.title = title + ' | سهند لیزر';
  document.getElementById('breadcrumb-cat').textContent = p.cat[lang] || p.cat.fa;
  document.getElementById('product-code-display').textContent = p.code;
  document.getElementById('product-cat-badge').textContent = p.badge[lang] || p.badge.fa;
  document.getElementById('product-title').textContent = title;
  document.getElementById('product-subtitle').textContent = p.subtitle[lang] || p.subtitle.fa;

  const frames = (p.images && p.images.length ? p.images : [PRODUCT_PLACEHOLDER]);
  const realFrames = frames.filter(src => !isPlaceholderImage(src));
  const has360 = realFrames.length > 1;
  const hasRealImage = realFrames.length > 0;
  const viewer = document.getElementById('spin-viewer');
  viewer.classList.toggle('static-view', !has360);
  viewer.innerHTML = `
    ${has360 ? `<span class="badge-360"><i class="fa-solid fa-rotate"></i> ${escapeHtml(T[lang].badge_360)}</span>` : ''}
    ${has360 ? `<span class="spin-counter" id="spin-counter">1 / ${frames.length}</span>` : ''}
    ${frames.map((src,i) => `<img src="${escapeHtml(src)}" ${i===0?'class="active"':''} alt="${escapeHtml(title + ' - تصویر ' + (i+1))}" loading="${i===0?'eager':'lazy'}">`).join('')}
    <span class="image-status ${hasRealImage?'real':''}"><i class="fa-solid ${hasRealImage?'fa-camera':'fa-image'}"></i> ${hasRealImage?'تصویر واقعی سهند لیزر':'تصویر واقعی در حال تکمیل آرشیو'}</span>
    ${has360 ? `<div class="spin-hint"><i class="fa-solid fa-arrows-left-right"></i><span>${escapeHtml(T[lang].spin_hint)}</span></div><div class="spin-progress"><div class="spin-progress-bar" id="spin-progress"></div></div>` : ''}`;

  const tc = document.getElementById('thumbnails-container');
  if (frames.length > 1) {
    const cols = Math.min(frames.length, 6), colsMap={1:'grid-cols-1',2:'grid-cols-2',3:'grid-cols-3',4:'grid-cols-4',5:'grid-cols-5',6:'grid-cols-6'};
    tc.className = `grid ${colsMap[cols]||'grid-cols-6'} gap-2 mt-3`;
    tc.innerHTML = frames.map((src,i) => `<img src="${escapeHtml(src)}" class="thumb ${i===0?'active':''}" data-index="${i}" alt="${escapeHtml(title + ' - بندانگشتی ' + (i+1))}">`).join('');
  } else { tc.className='hidden'; tc.innerHTML=''; }

  const legacyLink=document.getElementById('legacy-product-link');
  if (legacyLink) {
    const url=legacyProductPages[p.code];
    legacyLink.href=url||'#';
    legacyLink.classList.toggle('hidden',!url);
    legacyLink.classList.toggle('inline-flex',!!url);
  }

  document.getElementById('product-advantages').innerHTML = p.advantages.map(a => `
    <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
      <i class="fa-solid ${escapeHtml(a.icon)} text-accent"></i>
      <div><div class="text-xs text-slate-500">${escapeHtml(a.label[lang]||a.label.fa)}</div><div class="text-sm font-semibold">${escapeHtml(a.value)}</div></div>
    </div>`).join('');
  document.getElementById('specs-list').innerHTML = p.specs.map(s => `
    <div class="spec-item"><span class="spec-label">${escapeHtml(s.label[lang]||s.label.fa)}</span><span class="spec-value">${escapeHtml(typeof s.value === 'object' ? (s.value[lang]||s.value.fa) : s.value)}</span></div>`).join('');
  document.getElementById('usage-list').innerHTML = p.usage.map(u => `
    <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex gap-3">
      <div class="w-10 h-10 rounded-xl bg-${u.color}-100 dark:bg-${u.color}-900/30 text-${u.color}-600 dark:text-${u.color}-400 flex items-center justify-center shrink-0"><i class="fa-solid ${escapeHtml(u.icon)}"></i></div>
      <div><div class="font-semibold mb-1">${escapeHtml(u.title[lang]||u.title.fa)}</div><p class="text-sm text-slate-500">${escapeHtml(u.desc[lang]||u.desc.fa)}</p></div>
    </div>`).join('');
  document.getElementById('models-list').innerHTML = p.models.map(m => `
    <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
      <div class="flex items-center justify-between mb-2"><span class="font-bold">${escapeHtml(m.title[lang]||m.title.fa)}</span><span class="text-xs bg-${m.badgeColor}-100 dark:bg-${m.badgeColor}-900/30 text-${m.badgeColor}-700 dark:text-${m.badgeColor}-400 px-3 py-1 rounded-full">${escapeHtml(m.badge[lang]||m.badge.fa)}</span></div><p class="text-sm text-slate-500">${escapeHtml(m.desc[lang]||m.desc.fa)}</p>
    </div>`).join('');
  const descArr = p.description[lang] || p.description.fa;
  document.getElementById('desc-content').innerHTML = descArr.map(x => `<p>${escapeHtml(x)}</p>`).join('');

  const gallery = Array.isArray(p.gallery) ? p.gallery.filter(Boolean) : [];
  const galleryRoot=document.getElementById('gallery-container');
  if (gallery.length) {
    galleryRoot.className='grid md:grid-cols-3 gap-4';
    galleryRoot.innerHTML=gallery.map((src,i)=>`<figure class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden"><img src="${escapeHtml(src)}" alt="${escapeHtml(title+' - گالری '+(i+1))}" class="w-full h-56 object-contain bg-white" loading="lazy"><figcaption class="p-3 text-xs text-slate-500">تصویر آرشیوی محصول</figcaption></figure>`).join('');
  } else {
    galleryRoot.className='block';
    galleryRoot.innerHTML=`<div class="archive-note text-center"><i class="fa-solid fa-camera text-accent text-2xl mb-3"></i><div class="font-bold text-brand dark:text-white mb-2">گالری واقعی این محصول در حال انتقال از آرشیو قبلی است</div><p class="text-sm text-slate-500 leading-7">برای جلوگیری از نمایش تصویر یا مدل ساختگی، تا زمان تطبیق عکس واقعی با کد محصول هیچ نمای 3D یا تصویر جایگزین به‌عنوان محصول واقعی منتشر نمی‌شود.</p>${legacyProductPages[p.code]?`<a href="${escapeHtml(legacyProductPages[p.code])}" target="_blank" rel="noopener noreferrer" class="inline-flex mt-4 items-center gap-2 text-accent font-bold text-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> مشاهده صفحه آرشیوی این محصول</a>`:''}</div>`;
  }

  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  document.querySelectorAll('.tab-content').forEach((c,i) => c.classList.toggle('active', i===0));
  if (has360) initViewer();
  loadComments();
}

// ==================================================
// [360 VIEWER]
// ==================================================
function initViewer() {
  if (viewerController) viewerController.abort();
  viewerController = new AbortController();
  const { signal } = viewerController;
  const viewer = document.getElementById('spin-viewer');
  if (!viewer) return;
  const images = viewer.querySelectorAll('img');
  const totalFrames = images.length;
  if (!totalFrames) return;
  const pb = document.getElementById('spin-progress');
  const counter = document.getElementById('spin-counter');
  const thumbs = document.querySelectorAll('#thumbnails-container .thumb');
  const state = { currentFrame:0, isDragging:false, startX:0, startFrame:0 };
  function showFrame(i) {
    i = ((i % totalFrames) + totalFrames) % totalFrames;
    state.currentFrame = i;
    images.forEach((img,idx) => img.classList.toggle('active', idx===i));
    if (pb) pb.style.width = (((i+1)/totalFrames)*100)+'%';
    if (counter) counter.textContent = `${i+1} / ${totalFrames}`;
    thumbs.forEach((t,idx) => t.classList.toggle('active', idx===i));
  }
  viewer.addEventListener('mousedown', e => { state.isDragging=true; state.startX=e.clientX; state.startFrame=state.currentFrame; viewer.classList.add('dragging','has-interacted'); e.preventDefault(); }, {signal});
  document.addEventListener('mousemove', e => { if (!state.isDragging) return; showFrame(state.startFrame + Math.round((e.clientX-state.startX)/80)); }, {signal});
  document.addEventListener('mouseup', () => { state.isDragging=false; viewer.classList.remove('dragging'); }, {signal});
  viewer.addEventListener('touchstart', e => { state.isDragging=true; state.startX=e.touches[0].clientX; state.startFrame=state.currentFrame; viewer.classList.add('has-interacted'); }, {passive:true, signal});
  viewer.addEventListener('touchmove', e => { if (!state.isDragging) return; showFrame(state.startFrame + Math.round((e.touches[0].clientX-state.startX)/80)); }, {passive:true, signal});
  viewer.addEventListener('touchend', () => { state.isDragging=false; }, {signal});
  thumbs.forEach(t => t.addEventListener('click', () => showFrame(parseInt(t.dataset.index)), {signal}));
  showFrame(0);
}

// ==================================================
// [TABS]
// ==================================================
function switchTab(event, id) {
  const btn = event.currentTarget;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + id).classList.add('active');
}

// ==================================================
// [INQUIRY MODAL]
// ==================================================
function openInquiry(productCode, productName) {
  currentProductId = productCode || null;
  const modal = document.getElementById('inquiry-modal');
  const info = document.getElementById('modal-product-info');
  if (productCode) info.innerHTML = `<i class="fa-solid fa-tag"></i> ${escapeHtml(productCode)} — ${escapeHtml(productName || '')}`;
  else info.innerHTML = `<i class="fa-solid fa-tag"></i> ${escapeHtml(productName || 'استعلام عمومی')}`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('inq-name').focus(), 200);
}
function closeInquiry() {
  document.getElementById('inquiry-modal').classList.remove('open');
  document.body.style.overflow = '';
}
const WHATSAPP_NUMBER = window.SAHAND_CONFIG.whatsappNumber;
function buildInquiryMessage() {
  const name = document.getElementById('inq-name').value.trim();
  const phone = document.getElementById('inq-phone').value.trim();
  const city = document.getElementById('inq-city').value.trim();
  const email = document.getElementById('inq-email').value.trim();
  const type = (document.querySelector('input[name="inq-type"]:checked') || {}).value || '';
  const notes = document.getElementById('inq-notes').value.trim();
  if (!name || !phone || !city || !type) { alert('لطفاً فیلدهای اجباری را پر کنید.'); return null; }
  const pInfo = document.getElementById('modal-product-info').textContent.trim();
  return `🔹 *درخواست استعلام قیمت — سهند لیزر*

📦 *موضوع:* ${pInfo}

👤 *نام:* ${name}
📞 *تماس:* ${phone}
🏙 *شهر/کشور:* ${city}${email ? `\n📧 *ایمیل:* ${email}` : ''}
🔖 *نوع:* ${type}${notes ? `\n\n📝 *توضیحات:*\n${notes}` : ''}

---
🌐 sahandlaser.com`;
}
function sendInquiry(e) {
  e.preventDefault();
  sendInquiryVia('whatsapp');
}
async function sendInquiryVia(channel) {
  const msg = buildInquiryMessage();
  if (!msg) return;
  if (channel === 'whatsapp') {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    closeInquiry();
    return;
  }
  try {
    await navigator.clipboard.writeText(msg);
  } catch (err) {
    const ta = document.createElement('textarea');
    ta.value = msg; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
  if (channel === 'eitaa') window.open('https://eitaa.com/sahandlaser_sale', '_blank', 'noopener,noreferrer');
  if (channel === 'bale') window.open('https://ble.ir/sahandlaser_sale', '_blank', 'noopener,noreferrer');
  alert('متن پیام کپی شد. بعد از باز شدن برنامه، پیام را Paste و ارسال کنید.');
  closeInquiry();
}

// ==================================================
// [COMMENTS]
// ==================================================
let selectedRating = 5;
function loadComments() {
  if (!currentProductId) return;
  const key = 'comments_' + currentProductId;
  let comments = [];
  try { comments = JSON.parse(Storage.get(key, '[]')); } catch(e) {}
  const list = document.getElementById('comments-list');
  const noC = document.getElementById('no-comments');
  document.getElementById('comments-count').textContent = comments.length;
  if (!comments.length) { list.innerHTML = ''; noC.style.display = 'block'; return; }
  noC.style.display = 'none';
  list.innerHTML = comments.map(c => `
    <div class="comment-card">
      <div class="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-sm">${escapeHtml((c.name||'?').charAt(0))}</div>
          <div><div class="font-semibold text-sm">${escapeHtml(c.name)}</div><div class="text-xs text-slate-500">${escapeHtml(c.date)}</div></div>
        </div>
        <div class="star-rating text-sm">${'★'.repeat(c.rating)}${'☆'.repeat(5-c.rating)}</div>
      </div>
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(c.text)}</p>
    </div>`).join('');
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('star-input')) {
    selectedRating = parseInt(e.target.dataset.star);
    document.querySelectorAll('.star-input').forEach(s => s.classList.toggle('active', parseInt(s.dataset.star) <= selectedRating));
  }
});
document.addEventListener('submit', e => {
  if (e.target.id !== 'comment-form') return;
  e.preventDefault();
  if (!currentProductId) return;
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  const errEl = document.getElementById('comment-error');
  const sucEl = document.getElementById('comment-success');
  if (!name || !text) { errEl.textContent = T[currentLang].comment_error; errEl.classList.add('show'); setTimeout(()=>errEl.classList.remove('show'),3000); return; }
  const key = 'comments_' + currentProductId;
  let comments = [];
  try { comments = JSON.parse(Storage.get(key, '[]')); } catch(e) {}
  const date = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {year:'numeric',month:'long',day:'numeric'}).format(new Date());
  comments.unshift({ name: name.substring(0,100), text: text.substring(0,2000), rating: selectedRating, date });
  Storage.set(key, JSON.stringify(comments));
  e.target.reset();
  sucEl.textContent = T[currentLang].comment_success;
  sucEl.classList.add('show');
  setTimeout(()=>sucEl.classList.remove('show'),3000);
  loadComments();
});

// ==================================================
// [INTERNATIONAL FORM]
// ==================================================
document.addEventListener('submit', e => {
  if (e.target.id !== 'intl-form') return;
  e.preventDefault();
  const country = document.getElementById('intl-country').value;
  const name = document.getElementById('intl-name').value.trim();
  const phone = document.getElementById('intl-phone').value.trim();
  const email = document.getElementById('intl-email').value.trim();
  const desc = document.getElementById('intl-desc').value.trim();
  if (!country || !name || !phone || !desc) { alert('Please fill all required fields.'); return; }
  const msg = `🌍 *International Customer Request — Sahand Laser*

🌐 Country: ${country}
👤 Name: ${name}
📱 WhatsApp: ${phone}${email ? `\n📧 Email: ${email}` : ''}

📝 *Details:*
${desc}

---
Sent from sahandlaser.com`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
});

// ==================================================
// [SOLUTION FORM]
// ==================================================
document.addEventListener('submit', e => {
  if (e.target.id !== 'solution-form') return;
  e.preventDefault();
  const machine = document.getElementById('sol-machine').value;
  const industry = document.getElementById('sol-industry').value;
  const budget = document.getElementById('sol-budget').value || 'نامشخص';
  const contact = document.getElementById('sol-contact').value.trim();
  const req = document.getElementById('sol-requirements').value.trim();
  if (!machine || !industry || !contact || !req) { alert('لطفاً فیلدهای اجباری را پر کنید.'); return; }
  const msg = `💡 *درخواست راهکار هوشمند — سهند لیزر*

🔧 *نوع دستگاه:* ${machine}
🏭 *زمینه کاری:* ${industry}
💰 *بودجه:* ${budget}
📞 *تماس:* ${contact}

📝 *نیازها:*
${req}

---
🌐 sahandlaser.com`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
});

// ==================================================
// [CHAT WIDGET]
// ==================================================
let chatOpened = false;
function openChatWidget() {
  const w = document.getElementById('chat-widget');
  w.style.transform = 'translateY(0)';
  w.style.opacity = '1';
  chatOpened = true;
}
function closeChatWidget() {
  const w = document.getElementById('chat-widget');
  w.style.transform = 'translateY(150%)';
  w.style.opacity = '0';
}
function sendChatToWhatsApp() {
  const msg = document.getElementById('chat-input').value.trim() || 'سلام، از سایت سهند لیزر پیام می‌فرستم.';
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}
function sendChatToEitaa() {
  const msg = document.getElementById('chat-input').value.trim() || 'سلام، از سایت سهند لیزر پیام می‌فرستم.';
  navigator.clipboard?.writeText(msg);
  alert('پیام کپی شد! در ایتا برای ما ارسال کنید.');
  window.open('https://eitaa.com/sahandlaser_sale', '_blank');
}
function sendChatToBale() {
  const msg = document.getElementById('chat-input').value.trim() || 'سلام، از سایت سهند لیزر پیام می‌فرستم.';
  navigator.clipboard?.writeText(msg);
  alert('پیام کپی شد! در بله برای ما ارسال کنید.');
  window.open('https://ble.ir/sahandlaser_sale', '_blank');
}

// ==================================================
// [INIT]
// ==================================================
document.addEventListener('DOMContentLoaded', () => {
  const isDark = document.documentElement.classList.contains('dark');
  const icon = document.getElementById('theme-icon');
  if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  const theme = document.documentElement.getAttribute('data-theme') || 'navy';
  document.querySelectorAll('.theme-btn').forEach(b => b.classList.toggle('active', b.dataset.theme === theme));
  setLang(currentLang);
  renderHomeProducts();
  renderProductsGrid();
  renderApps();
  renderServices();
  renderProjects();
  renderContacts();
  initSlider();
  applyRoute();
  window.addEventListener('hashchange', applyRoute);
});

let activeCatalogFilter = 'all';
let modelDispose = null;
let modelObserver = null;
let modelRevision = 0;
let inquiryProduct = null;
let inquiryFocus = null;
let modelScriptPromise = null;
if (!T[currentLang]) currentLang = 'fa';
T.fa.slide1_title = 'سهند لیزر';
T.en.slide1_title = 'Sahand Laser';
T.ar.slide1_title = 'سهند ليزر';
T.tr.slide1_title = 'Sahand Laser';
T.fa.slide1_tag = 'تجهیزات و خدمات لیزر صنعتی';
T.fa.slide2_tag = 'راهکارهای جوش لیزری';
T.fa.slide2_desc = 'انتخاب دستگاه و تجهیزات بر اساس کاربرد و پیکربندی موردنیاز';
const label = text => escapeHtml(typeof text === 'object' ? (text[currentLang] || text.fa || '') : text);
const productTitle = p => p.title[currentLang] || p.title.fa;

function disposeModel() {
  modelRevision++;
  modelObserver?.disconnect();
  modelObserver = null;
  modelDispose?.();
  modelDispose = null;
}
const preservedShowView = showView;
showView = function(name) {
  disposeModel();
  preservedShowView(name);
  if (name !== 'product') document.title = T[currentLang].brand + ' | تجهیزات و خدمات لیزر';
};

function renderCatCard(category) {
  const p = Object.values(products).find(item => item.categoryId === category.id && item.media.images.length);
  return `<article class="card-hover bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
    <button class="w-full text-start" onclick="openCategory('${category.id}')" aria-label="${label(T[currentLang][category.nameKey])}">
      <div class="h-44 relative flex items-center justify-center overflow-hidden bg-slate-100">
        ${p ? `<img src="${assetUrl(p.media.images[0])}" alt="${label(productTitle(p))}" class="w-full h-full object-contain" loading="lazy">` : `<i class="fa-solid ${category.icon} text-slate-400 text-5xl"></i>`}
        <span class="absolute top-3 right-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full">${category.count}</span>
      </div>
      <div class="p-6"><h3 class="text-xl font-bold text-brand dark:text-white mb-2">${label(T[currentLang][category.nameKey])}</h3>
      <p class="text-sm text-slate-500 leading-relaxed mb-4">${label(T[currentLang][category.descKey])}</p>
      <span class="text-accent text-sm font-semibold">${label(T[currentLang].view_models)} <i class="fa-solid fa-arrow-left"></i></span></div>
    </button></article>`;
}
function renderAllProducts(filter = activeCatalogFilter) {
  activeCatalogFilter = filter;
  const root = document.getElementById('all-products-grid');
  if (!root) return;
  const normalize = s => String(s).replaceAll('ي', 'ی').replaceAll('ك', 'ک').toLowerCase();
  const query = normalize(document.getElementById('catalog-search')?.value || '').trim();
  const items = Object.values(products).filter(p => (filter === 'all' || p.categoryId === filter) && normalize(p.code + ' ' + productTitle(p)).includes(query));
  document.getElementById('catalog-count').textContent = `${items.length} محصول`;
  root.innerHTML = items.length ? items.map(p => `<article class="product-mini-card bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 card-hover">
    <button onclick="showProduct('${p.code}')" class="visual w-full" aria-label="${label(productTitle(p))}">
      ${p.media.images.length ? `<img src="${assetUrl(p.media.images[0])}" alt="${label(productTitle(p))}" loading="lazy">` : '<div class="media-empty"><i class="fa-regular fa-image"></i><span class="text-xs">تصویر اختصاصی در انتظار تطبیق</span></div>'}
    </button><div class="p-5 flex-1 flex flex-col"><div class="flex items-center justify-between gap-2 mb-2"><span class="product-code">${label(p.code)}</span><span class="text-[11px] text-slate-500">${label(p.cat)}</span></div>
    <h3 class="font-bold text-brand dark:text-white leading-7 mb-2">${label(productTitle(p))}</h3>
    <p class="text-xs text-slate-500 leading-6 mb-4">${label((p.description[currentLang] || p.description.fa || [])[0] || '')}</p>
    <button onclick="showProduct('${p.code}')" class="mt-auto inline-flex items-center gap-2 text-accent font-bold text-sm">${label(T[currentLang].view_details)} <i class="fa-solid fa-arrow-left"></i></button></div></article>`).join('') : '<p class="catalog-empty">محصولی پیدا نشد.</p>';
}
function filterCatalog(filter = 'all') {
  activeCatalogFilter = filter;
  document.querySelectorAll('#catalog-filter button').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  renderAllProducts(filter);
}
function renderProduct(id) {
  disposeModel();
  const p = products[id];
  if (!p) return;
  const title = productTitle(p);
  document.title = title + ' | سهند لیزر';
  document.getElementById('breadcrumb-cat').textContent = p.cat[currentLang] || p.cat.fa;
  document.getElementById('product-code-display').textContent = p.code;
  document.getElementById('product-cat-badge').textContent = p.badge[currentLang] || p.badge.fa;
  document.getElementById('product-title').textContent = title;
  document.getElementById('product-subtitle').textContent = p.subtitle[currentLang] || p.subtitle.fa;
  document.getElementById('product-review-note').textContent = p.review || '';
  const spin = Array.isArray(p.media.frames360) && p.media.frames360.length > 1;
  const pictures = spin ? p.media.frames360 : p.media.images;
  const viewer = document.getElementById('spin-viewer');
  viewer.classList.toggle('static-view', !spin);
  viewer.classList.remove('has-interacted');
  viewer.innerHTML = pictures.length ? pictures.map((image, i) => `<img src="${assetUrl(image)}" ${i === 0 ? 'class="active"' : ''} alt="${label(title)} - ${i + 1}" loading="${i ? 'lazy' : 'eager'}">`).join('') : '<div class="media-empty"><i class="fa-regular fa-image"></i><span>تصویر اختصاصی این مدل هنوز تأیید نشده است.</span></div>';
  if (spin) viewer.innerHTML += `<span class="badge-360">360°</span><span class="spin-counter" id="spin-counter">1 / ${pictures.length}</span><div class="spin-progress"><div id="spin-progress"></div></div>`;
  const thumbs = document.getElementById('thumbnails-container');
  thumbs.innerHTML = pictures.length > 1 ? pictures.map((image, i) => `<button type="button" class="thumb ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="تصویر ${i + 1}"><img src="${assetUrl(image)}" alt="" class="w-full h-full object-contain"></button>`).join('') : '';
  document.getElementById('product-media-caption').textContent = spin ? 'نمای ۳۶۰ درجه' : p.media.review ? 'تصویر آرشیوی این پیکربندی؛ تطبیق نهایی در حال بررسی است.' : pictures.length ? 'تصویر مرجع محصول از آرشیو سهند لیزر' : '';
  if (viewerController) viewerController.abort();
  viewerController = new AbortController();
  if (spin) initViewer();
  else thumbs.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    viewer.querySelectorAll('img').forEach((img, index) => img.classList.toggle('active', index === Number(button.dataset.index)));
    thumbs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === button));
  }, { signal: viewerController.signal }));
  document.getElementById('product-advantages').innerHTML = '';
  document.getElementById('specs-list').innerHTML = p.specs.map(s => `<div class="spec-item"><span class="spec-label">${label(s.label)}</span><span class="spec-value">${label(s.value)}</span></div>`).join('') + (p.specs.some(s => s.scope === 'family_reference') ? '<p class="px-4 py-3 text-xs text-slate-500">مشخصات مرجع سری / خانواده؛ پسوند و پیکربندی دقیق هنگام استعلام تطبیق داده می‌شود.</p>' : p.specs.length ? '' : '<p class="spec-reference">مشخصات اختصاصی هنوز ثبت یا تأیید نشده است.</p>');
  document.getElementById('usage-list').innerHTML = p.usage.map(u => `<div class="py-3 border-b border-slate-200"><strong>${label(u.title)}</strong><p class="text-sm text-slate-500 mt-2">${label(u.desc)}</p></div>`).join('') || '<p class="text-sm text-slate-500">کاربرد نهایی بر اساس دستگاه و پیکربندی بررسی می‌شود.</p>';
  const variants = p.categoryId === 'cutting' ? Object.values(products).filter(item => item.categoryId === 'cutting') : [];
  document.getElementById('models-list').innerHTML = variants.length ? variants.map(item => `<button class="block text-start w-full py-3 border-b border-slate-200" onclick="showProduct('${item.code}')">${label(productTitle(item))}</button>`).join('') : p.models.map(m => `<div class="py-3"><strong>${label(m.title)}</strong><p class="text-sm text-slate-500 mt-2">${label(m.desc)}</p></div>`).join('');
  document.getElementById('desc-content').innerHTML = (p.description[currentLang] || p.description.fa).map(text => `<p>${label(text)}</p>`).join('') + (p.family ? `<p>گزینه‌های خانواده دستگاه: ${label(p.family.component_options.laser_source)}؛ ${label(p.family.component_options.cutting_head)}.</p><p>${label(p.family.publication_rule)}</p>` : '');
  const legacy = document.getElementById('legacy-product-link');
  legacy.classList.add('hidden');
  legacy.classList.remove('inline-flex');
  document.querySelectorAll('.tab-btn').forEach((button, i) => button.classList.toggle('active', i === 0));
  document.querySelectorAll('.tab-content').forEach((tab, i) => tab.classList.toggle('active', i === 0));
  renderLargeSections(p);
  loadComments();
}

function jumpProductSection(event, id) {
  event.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function renderLargeSections(p) {
  const sections = document.getElementById('product-large-sections');
  sections.innerHTML = '<nav class="product-jumps">' + [['technical', 'نقشه فنی'], ['exploded', 'نمای انفجاری'], ['model', 'مدل سه‌بعدی'], ['works', 'نمونه‌کارها']].map(([id, text]) => `<a href="#product=${p.code}" onclick="jumpProductSection(event,'product-${id}')">${text}</a>`).join('') + '</nav>';
  for (const [key, title] of [['technical', 'نقشه فنی و ابعادی'], ['exploded', 'نمای انفجاری اجزا']]) {
    sections.innerHTML += `<section class="product-large-section" id="product-${key}"><h2>${title}</h2>${p.media[key] ? `<img src="${assetUrl(p.media[key])}" alt="${title} ${label(productTitle(p))}" loading="lazy">` : '<p class="section-empty">فایل اختصاصی تأییدشده برای این مدل هنوز ثبت نشده است.</p>'}</section>`;
  }
  sections.innerHTML += `<section class="product-large-section" id="product-model"><h2>مدل سه‌بعدی تعاملی</h2>${p.media.model ? '<p class="source-note">مدل نمایشی وب برای بررسی فرم دستگاه؛ نقشهٔ ساخت یا CAD مهندسی نیست.</p><div class="model-toolbar"><button type="button" data-model-reset aria-label="بازنشانی نما" title="بازنشانی نما"><i class="fa-solid fa-rotate-left"></i></button><button type="button" data-model-rotate aria-pressed="false" aria-label="چرخش خودکار" title="چرخش خودکار"><i class="fa-solid fa-rotate"></i></button></div><div class="model-stage" id="model-stage"><div class="model-status">در حال آماده‌سازی مدل...</div></div>' : '<p class="section-empty">مدل قابل تطبیق با این محصول هنوز ثبت نشده است.</p>'}</section>`;
  sections.innerHTML += `<section class="product-large-section" id="product-works"><h2>نمونه‌کارهای این دستگاه</h2>${p.media.works.length ? p.media.works.map(image => `<img src="${assetUrl(image)}" alt="نمونه‌کار ${label(productTitle(p))}" loading="lazy">`).join('') : '<p class="section-empty">نمونه‌کار اختصاصی تأییدشده هنوز ثبت نشده است.</p>'}</section>`;
  if (!p.media.model) return;
  const stage = document.getElementById('model-stage');
  const revision = modelRevision;
  modelObserver = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return;
    modelObserver?.disconnect();
    try {
      if (!window.SahandModelViewer) {
        modelScriptPromise ||= new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = new URL('runtime/model-viewer.js', document.baseURI).href;
          script.onload = resolve;
          script.onerror = () => { modelScriptPromise = null; reject(new Error('Model runtime unavailable')); };
          document.head.append(script);
        });
        await modelScriptPromise;
      }
      if (revision !== modelRevision) return;
      const dispose = await window.SahandModelViewer(stage, assetUrl(p.media.model));
      if (revision !== modelRevision) dispose();
      else modelDispose = dispose;
    } catch (error) {
      if (stage.isConnected) stage.innerHTML = '<p class="model-status">نمایش سه‌بعدی در این مرورگر در دسترس نیست؛ تصاویر محصول در بالای صفحه موجودند.</p>';
    }
  }, { rootMargin: '150px' });
  modelObserver.observe(stage);
}

function openInquiry(code, name) {
  inquiryProduct = { code: code || '', name: name || 'استعلام عمومی' };
  inquiryFocus = document.activeElement;
  const p = products[code];
  const machine = !p || ['cutting', 'welding', 'marking', 'cleaning'].includes(p.categoryId);
  document.getElementById('modal-product-info').textContent = [code, name].filter(Boolean).join(' - ') || 'استعلام عمومی';
  document.getElementById('inquiry-error').textContent = '';
  const fields = document.getElementById('inquiry-product-fields');
  fields.innerHTML = machine ? '<div><label for="inq-material" class="form-label">جنس قطعه</label><input id="inq-material" class="form-input" maxlength="80" placeholder="مثلاً استیل"></div><div><label for="inq-thickness" class="form-label">ضخامت (میلی‌متر)</label><input id="inq-thickness" type="number" min="0.01" step="0.01" class="form-input"></div><div><label for="inq-power" class="form-label">توان موردنیاز (وات)</label><input id="inq-power" type="number" min="1" step="1" class="form-input"></div><div><label for="inq-size" class="form-label">ابعاد کار / قطعه</label><input id="inq-size" class="form-input" maxlength="80"></div>' : '<div><label for="inq-part-number" class="form-label">مدل / شماره فنی دقیق</label><input id="inq-part-number" class="form-input" maxlength="100"></div><div><label for="inq-quantity" class="form-label">تعداد</label><input id="inq-quantity" type="number" min="1" step="1" value="1" class="form-input"></div>';
  const radio = document.querySelector(`input[name="inq-type"][value="${machine ? 'خرید دستگاه' : 'قطعات یدکی'}"]`);
  if (radio) radio.checked = true;
  document.getElementById('inquiry-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('inq-name').focus();
}
function closeInquiry() {
  document.getElementById('inquiry-modal').classList.remove('open');
  document.body.style.overflow = '';
  inquiryFocus?.focus();
}
function normalizeDigits(value) {
  return value.replace(/[۰-۹]/g, digit => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[٠-٩]/g, digit => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)));
}
function buildInquiryMessage() {
  const form = document.getElementById('inquiry-form');
  if (!form.reportValidity()) return null;
  const phone = normalizeDigits(document.getElementById('inq-phone').value).replace(/[\s()-]/g, '');
  if (!/^\+?\d{8,15}$/.test(phone)) {
    document.getElementById('inquiry-error').textContent = 'شماره تماس معتبر وارد کن.';
    document.getElementById('inq-phone').focus();
    return null;
  }
  document.getElementById('inquiry-error').textContent = '';
  const value = id => document.getElementById(id)?.value.trim() || '';
  const details = [
    ['نام', value('inq-name')], ['شماره تماس', phone], ['شهر / کشور', value('inq-city')], ['ایمیل', value('inq-email')],
    ['نوع درخواست', document.querySelector('input[name="inq-type"]:checked')?.value],
    ['جنس قطعه', value('inq-material')], ['ضخامت (mm)', value('inq-thickness')], ['توان (W)', value('inq-power')],
    ['ابعاد کار / قطعه', value('inq-size')], ['شماره فنی دقیق', value('inq-part-number')], ['تعداد', value('inq-quantity')], ['توضیحات', value('inq-notes')]
  ].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
  return `درخواست استعلام قیمت - سهند لیزر\nمحصول: ${inquiryProduct?.code || ''} ${inquiryProduct?.name || ''}\n\n${details.join('\n')}\n\n${window.SAHAND_CONFIG.siteUrl}`;
}
document.addEventListener('keydown', event => {
  if (event.key !== 'Tab' || !document.getElementById('inquiry-modal').classList.contains('open')) return;
  const items = [...document.querySelectorAll('#inquiry-modal button, #inquiry-modal input, #inquiry-modal textarea')].filter(el => !el.disabled && el.getClientRects().length);
  const first = items[0], last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('catalog-search').addEventListener('input', () => renderAllProducts());
  document.querySelectorAll('img[data-icon]').forEach(img => { img.src = assetUrl('icons/' + img.dataset.icon + '.svg'); });
  document.querySelectorAll('[data-hero-image]').forEach(el => {
    const p = products[el.dataset.heroImage];
    if (p?.media.images.length) el.style.backgroundImage = `url('${assetUrl(p.media.images[0])}')`;
  });
  document.querySelectorAll('[data-shared-image]').forEach(el => {
    if (el.tagName === 'IMG') el.src = assetUrl(el.dataset.sharedImage);
    else el.style.backgroundImage = `url('${assetUrl(el.dataset.sharedImage)}')`;
  });
  const menu = document.querySelectorAll('.menu-dropdown-content a');
  menu.forEach((a, i) => { if (cats[i]) a.onclick = event => { event.preventDefault(); openCategory(cats[i].id); }; });
  document.querySelectorAll('.hero-nav').forEach((button, i) => { button.setAttribute('aria-label', i ? 'اسلاید بعدی' : 'اسلاید قبلی'); button.title = button.getAttribute('aria-label'); });
  document.querySelectorAll('.hero-dot').forEach((dot, i) => {
    dot.setAttribute('role', 'button'); dot.tabIndex = 0; dot.setAttribute('aria-label', `اسلاید ${i + 1}`);
    dot.onkeydown = event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); goSlide(i); } };
  });
});
