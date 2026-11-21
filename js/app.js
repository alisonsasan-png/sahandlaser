(function(){
  // Inline quote modal for product pages.
  document.querySelectorAll('a.btn-primary[href*="contact.html?p="]').forEach(function(trigger){
    trigger.addEventListener('click', function(e){
      e.preventDefault();
      var product = new URL(trigger.href, location.href).searchParams.get('p') || '';
      var modal = document.getElementById('quote-modal');
      if(!modal){
        modal = document.createElement('div'); modal.id='quote-modal'; modal.className='quote-modal';
        modal.innerHTML='<div class="quote-dialog" role="dialog" aria-modal="true" aria-labelledby="quote-title"><button class="quote-close" type="button" aria-label="بستن">×</button><h2 id="quote-title">استعلام قیمت و مشاوره</h2><p class="quote-product"></p><form class="quote-form"><div><label>نام و نام خانوادگی<input name="name" required></label></div><div><label>شماره تلفن<input name="phone" required dir="ltr" placeholder="09xxxxxxxxx"></label></div><div><label>شهر<input name="city" required></label></div><div class="full"><label>آدرس<input name="address" required></label></div><div><label>نوع محصول یا خدمات<select name="type"><option>خرید محصول</option><option>خدمات برش لیزر</option><option>خدمات جوش لیزر</option><option>تعمیر و پشتیبانی</option><option>سایر</option></select></label></div><div class="full"><label>توضیحات<textarea name="message"></textarea></label></div><div class="full quote-actions"><button type="button" class="quote-send whatsapp" data-send="wa"><img class="brand-icon" src="https://cdn.simpleicons.org/whatsapp/ffffff" alt=""> واتساپ</button><button type="button" class="quote-send eitaa" data-send="eitaa"><img class="brand-icon" src="https://images.seeklogo.com/logo-png/50/1/eitaa-logo-png_seeklogo-503264.png" alt=""> ایتا</button><button type="button" class="quote-send bale" data-send="bale"><img class="brand-icon" src="https://cdn.brandfetch.io/idxBa2AFCH/w/400/h/400/theme/dark/icon.jpeg?c=1bxid64Mup7aczewSAYMX&t=1781766660483" alt=""> بله</button></div></form></div>';
        document.body.appendChild(modal);
        modal.querySelector('.quote-close').onclick=function(){modal.classList.remove('open');};
        modal.addEventListener('click',function(ev){if(ev.target===modal) modal.classList.remove('open');});
      }
      modal.querySelector('.quote-product').textContent='محصول: '+product;
      modal.dataset.product=product; modal.classList.add('open'); modal.querySelector('input[name="name"]').focus();
    });
  });
  var quoteModal=document.getElementById('quote-modal');
  document.addEventListener('click',function(e){
    var send=e.target.closest('[data-send]'); if(!send) return;
    var m=document.getElementById('quote-modal'), form=m&&m.querySelector('.quote-form'); if(!m||!form||!form.reportValidity()) return;
    var d=new FormData(form), text='درخواست استعلام از سایت سهند لیزر\nمحصول: '+m.dataset.product+'\nنام: '+d.get('name')+'\nتلفن: '+d.get('phone')+'\nشهر: '+d.get('city')+'\nآدرس: '+d.get('address')+'\nنوع درخواست: '+d.get('type')+'\nتوضیحات: '+(d.get('message')||'');
    if(send.dataset.send==='wa') window.open('https://wa.me/989125855548?text='+encodeURIComponent(text),'_blank','noopener');
    else navigator.clipboard.writeText(text).then(function(){window.open(send.dataset.send==='eitaa'?'https://eitaa.com/sahandlaser_sale':'https://ble.ir/sahandlaser_sale','_blank','noopener');});
  });
  // Standardized product technical summary for every detail page.
  var specBox=document.querySelector('.detail');
  if(specBox && !document.querySelector('.technical-summary')){
    var sc=detailCode||decodeURIComponent(location.pathname.split('/').pop().replace(/\\.html$/,''));
    var kind=sc.indexOf('CT-')===0?'برش لیزر فایبر':sc.indexOf('WL-')===0||sc.indexOf('WELD-')===0?'جوش لیزر':sc.indexOf('ML-')===0||sc.indexOf('MK-')===0?'حکاکی و مارکینگ':sc.indexOf('CL-')===0||sc.indexOf('CLEAN-')===0?'تمیزکاری لیزری':(sc.indexOf('FS')===0||sc.indexOf('SRC-')===0)?'سورس لیزر':(sc.indexOf('CH')===0||sc.indexOf('CP-')===0||sc.indexOf('CTRL-')===0)?'هد، کنترلر و قطعات':'محصولات و تجهیزات لیزر';
    var tech=document.createElement('section'); tech.className='technical-summary card';
    tech.innerHTML='<h2 class="sec">مشخصات فنی و کاربرد</h2><div class="spec-grid"><div><b>کد محصول</b><span dir="ltr">'+sc+'</span></div><div><b>خانواده</b><span>'+kind+'</span></div><div><b>کاربرد</b><span>انتخاب توان، ابعاد و قطعات بر اساس جنس متریال و ظرفیت تولید</span></div><div><b>پیکربندی</b><span>قابل تنظیم بر اساس نیاز پروژه و تأیید کارشناس فنی</span></div></div><p class="note">توان، ابعاد میز، نوع سورس، هد، چیلر و سایر جزئیات عددی باید برای همین مدل و سفارش نهایی از سوی کارشناس سهند لیزر تأیید شود.</p>';
    specBox.parentNode.insertBefore(tech,specBox.nextSibling);
  }
  // Product thumbnails: use the uploaded product image when one exists.
  var productImages = {
    'CT-001':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-002':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-003':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-004':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-005':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-006':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-007':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-008':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CC001':'assets/images/catalog/S&A CWFL-1500 - CC001.jpg','CC002':'assets/images/catalog/S&A CWFL-2000 - CC002.jpg','CC003':'assets/images/catalog/S&A CWFL-3000 - CC003.jpg',
    'CC004':'assets/images/catalog/Hanli HL-1500 - CC004.jpg','CC005':'assets/images/catalog/Hanli HL-2000 - CC005.jpg','CC006':'assets/images/catalog/Hanli HL-3000 - CC006.jpg',
    'CH001':'assets/images/catalog/RayTools BT240S - CH001.jpg','CH002':'assets/images/catalog/RayTools BM109 - CH002.jpg','CH003':'assets/images/catalog/RayTools BM111 - CH003.jpg','CH004':'assets/images/catalog/RayTools BM114 - CH004.jpg','CH005':'assets/images/catalog/RayTools BM115 - CH005.jpg',
    'FS002':'assets/images/catalog/سورس لیزر 50 وات پالسی فایبر Q-Switched - FS002.jpg','FS003':'assets/images/catalog/Raycus RFL-C1000 - FS003.jpg','FS004':'assets/images/catalog/Raycus RFL-C1500 - FS004.jpg','FS005':'assets/images/catalog/سورس لیزر Raycus RFL-C2000 - FS005.jpg','FS006':'assets/images/catalog/Raycus 3000 وات - FS006.jpg','FS007':'assets/images/catalog/Raycus 4000 وات - FS007.jpg','FS008':'assets/images/catalog/Raycus 6000 وات - FS008.jpg',
    'CN003':'assets/images/catalog/نازل RayTools تک‌لایه - CN003.jpg','CN001':'https://sahandlaser.com/wp-content/uploads/2022/04/CN001-8.jpg','CN006':'assets/images/catalog/نازل RayTools دولایه پرسرعت - CN006.jpg','CN007':'assets/images/catalog/نازل RayTools دولایه فول‌پاور - CN007.jpg','CN008':'assets/images/catalog/نازل RayTools تک‌لایه BT210-BT210S - CN008.jpg','CN009':'assets/images/catalog/نازل RayTools TRA برای BM111 - CN009.jpg','CN011':'assets/images/catalog/نازل RayTools دولایه - CN011.jpg','CN012':'assets/images/catalog/نازل RayTools دولایه Full Power - CN012.jpg','CN013':'assets/images/catalog/نازل RayTools TRA برای FL200-FL1501 - CN013.jpg',
    'CP-CERAMIC':'assets/images/catalog/سرامیک هد برش فایبر - CP-CERAMIC.jpg','ML-004':'assets/images/catalog/مارکینگ UV میزدار - ML-004.jpg','WL-003':'assets/images/catalog/دستگاه جوش لیزر Air-Cooled - WL-003.jpg','WELD-1500':'assets/images/catalog/دستگاه جوش فایبر 1500 وات - WELD-1500.jpg','WELD-2000':'assets/images/catalog/دستگاه جوش فایبر 2000 وات - WELD-2000.jpg','WELD-3000':'assets/images/catalog/دستگاه جوش فایبر 3000 وات - WELD-3000.jpg','WL-001':'assets/images/catalog/WL-001_0055-white.png?v=wl001-final-20261121','WL-002':'WL-002.png','WL-004':'WL-004.png','WL-005':'WL-005.png','CL-001':'CL-001.png','CL-002':'assets/images/catalog/تمیزکاری لیزری پالسی 300 وات - CLEAN-300W.jpg','CL-004':'assets/images/catalog/تمیزکاری لیزری پیوسته 2000 وات - CLEAN-2000W.jpg','ML-001':'assets/images/catalog/مارکینگ فایبر رومیزی - MARK-DESKTOP-FIBER.jpg','ML-002':'assets/images/catalog/مارکینگ فایبر میزدار - MARK-TABLE-FIBER.jpg','ML-005':'assets/images/catalog/مارکینگ فایبر پرتابل آبی - MARK-PORTABLE-BLUE.jpg',
    'CH-HANLI-12000':'assets/images/catalog/Hanli HL-12000 - CH-HANLI-12000.jpg',
    'CH-HANLI-6000':'assets/images/catalog/Hanli HL-6000 - CH-HANLI-6000.jpg',
    'CT-009':'assets/images/catalog/تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-010':'https://sahandlaser.com/wp-content/uploads/2022/03/back1.png',
    'CT-011':'https://sahandlaser.com/wp-content/uploads/2022/03/back1.png',
    'CT-012':'https://sahandlaser.com/wp-content/uploads/2022/03/back1.png',
    'CT-013':'https://sahandlaser.com/wp-content/uploads/2022/03/back1.png',


    'CH-S&A-6000':'CH-S&A-6000.png',
    'CH-S&A-12000':'CH-S&A-12000.png',
    'CH-S&A-20000':'CH-S&A-20000.png',
    'CP-LENS-BLT':'CP-LENS-BLT.png',
    'CP-RAY-BM110':'CP-RAY-BM110.png',
    'CP-RAY-BM114E':'CP-RAY-BM114E.png',
    'CP-RAY-BM115':'CP-RAY-BM115.png',
    'CP-RAY-BM115E':'CP-RAY-BM115E.png',
    'CP-RAY-BM116E':'CP-RAY-BM116E.png',
    'CP-RAY-BT220':'CP-RAY-BT220.png',
    'CP-RAY-BT240':'CP-RAY-BT240.png',
    'CP-SMC-ITV1050':'CP-SMC-ITV1050.png',
    'CP-SMC-ITV2050':'CP-SMC-ITV2050.png',
    'CP-TRA':'CP-TRA.png',
    'CTRL-FSCUT2000C':'CTRL-FSCUT2000C.png',
    'CTRL-FSCUT2000E':'CTRL-FSCUT2000E.png',
    'CTRL-FSCUT4000E':'CTRL-FSCUT4000E.png',
    'SRC-RAY-C3000S':'SRC-RAY-C3000S.png',
    'SRC-RAY-C4000S':'SRC-RAY-C4000S.png',
    'SRC-RAY-C6000S':'SRC-RAY-C6000S.png',
    'SRC-RAY-QCW150':'SRC-RAY-QCW150.png',
    'CL-003':'assets/images/catalog/CL-001_0001.jpg',
    'CLEAN-GENERIC':'assets/images/catalog/CLEAN-GENERIC.jpg',
    'CN002':'assets/images/catalog/CN002.jpg',
    'CN004':'assets/images/catalog/CN004.jpg',
    'CN010':'assets/images/catalog/CN010.jpg',
    'CP-LENS-RAY':'assets/images/catalog/CP-LENS-RAY.jpg',
    'CP-LENS-WSX':'assets/images/catalog/CP-LENS-WSX.jpg',
    'FS001':'assets/images/catalog/سورس لیزر 50 وات پالسی فایبر Q-Switched - FS002.jpg',
    'MK-FIBER-GENERIC':'assets/images/catalog/MARK-PORTABLE-BLUE_0034.png',
    'ML-003':'assets/images/catalog/مارکینگ فایبر رومیزی - MARK-DESKTOP-FIBER.jpg',
    'ML-006':'assets/images/catalog/مارکینگ فایبر میزدار - MARK-TABLE-FIBER.jpg',
    'ML-007':'assets/images/catalog/مارکینگ فایبر رومیزی - MARK-DESKTOP-FIBER.jpg',
    'ML-008':'assets/images/catalog/مارکینگ فایبر پرتابل آبی - MARK-PORTABLE-BLUE.jpg',
    'WL-006':'assets/images/catalog/WL-002_0057.jpg',
    'WL-007':'assets/images/catalog/WL-002_0057.jpg',
    'WL-008':'assets/images/catalog/WL-002_0057.jpg',
    'WL-009':'assets/images/catalog/WL-002_0057.jpg',
    'WL-010':'assets/images/catalog/WL-002_0057.jpg',
  };
  var prefix = location.pathname.indexOf('/products/') >= 0 ? '../' : '';
  document.querySelectorAll('.pcard .thumb').forEach(function(t){
    var code = t.querySelector('.code'); if(!code) return;
    var img = new Image();
    img.onload = function(){ t.innerHTML=''; img.alt=''; t.appendChild(img); };
    var file = productImages[code.textContent.trim()]; if(!file) return;
    img.src = prefix + file;
  });
  // Product detail hero image: detail pages use .detail .big instead of .pcard .thumb.
  var detailBox = document.querySelector('.detail .big');
  if (detailBox) {
    var detailCode = decodeURIComponent(location.pathname.split('/').pop().replace(/\.html$/, ''));
    var codeNode = document.querySelector('.detail p b + span');
    if (codeNode) detailCode = codeNode.textContent.trim();
    var detailFile = productImages[detailCode];
    if (detailFile) {
      var detailImg = new Image();
      detailImg.alt = detailCode;
      detailImg.onload = function(){ detailBox.innerHTML=''; detailBox.appendChild(detailImg); };
      detailImg.src = prefix + detailFile;
    }
  }
  // product list: search + category filter
  var list = document.getElementById('plist'); if(list){
  var q = document.getElementById('q'), chips = document.querySelectorAll('#chips .chip'), count = document.getElementById('count');
  var cat = new URLSearchParams(location.search).get('cat') || 'all';
  function apply(){
    var term = (q.value||'').trim().toLowerCase(), shown = 0;
    list.querySelectorAll('.pcard').forEach(function(c){
      var ok = (cat==='all' || c.dataset.cat===cat) && (!term || c.dataset.text.indexOf(term)>=0);
      c.style.display = ok ? '' : 'none'; if(ok) shown++;
    });
    chips.forEach(function(b){ b.classList.toggle('on', b.dataset.cat===cat); });
    count.textContent = shown + ' مورد';
  }
  chips.forEach(function(b){ b.addEventListener('click', function(){ cat=b.dataset.cat; apply(); }); });
  q.addEventListener('input', apply); apply();
  }
  // Contact form: build one message and send it through the selected messenger.
  var f = document.getElementById('inq'); if(!f) return;
  function msg(){
    var d = new FormData(f), p = new URLSearchParams(location.search).get('p');
    return 'درخواست استعلام از سایت سهند لیزر\n' + 'نام: '+d.get('name')+'\nتلفن/ایمیل: '+d.get('contact')+'\nشهر: '+d.get('city')+'\nآدرس: '+d.get('address')+'\nنوع نیاز: '+d.get('type')+
      (d.get('industry')?'\nصنعت/کاربرد: '+d.get('industry'):'') + (p?'\nمدل: '+p:'') + (d.get('message')?'\nتوضیحات: '+d.get('message'):'');
  }
  f.addEventListener('click', function(e){
    var b = e.target.closest('[data-ch]'); if(!b) return;
    if(!f.reportValidity()) return;
    var text = msg();
    if(b.dataset.ch==='wa') window.open('https://wa.me/989125855548?text='+encodeURIComponent(text),'_blank','noopener');
    else {
      var openChannel=function(){window.open(b.dataset.ch==='eitaa'?'https://eitaa.com/sahandlaser_sale':'https://ble.ir/sahandlaser_sale','_blank','noopener');};
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(openChannel).catch(function(){openChannel();});
      else openChannel();
    };
  });
  var pq = new URLSearchParams(location.search).get('p');
  if(pq) f.querySelector('#m').value = 'مدل مورد نظر: ' + pq + '\n';
})();
