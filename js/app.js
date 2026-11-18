(function(){
  // Inline quote modal for product pages.
  document.querySelectorAll('a.btn-primary[href*="contact.html?p="]').forEach(function(trigger){
    trigger.addEventListener('click', function(e){
      e.preventDefault();
      var product = new URL(trigger.href, location.href).searchParams.get('p') || '';
      var modal = document.getElementById('quote-modal');
      if(!modal){
        modal = document.createElement('div'); modal.id='quote-modal'; modal.className='quote-modal';
        modal.innerHTML='<div class="quote-dialog" role="dialog" aria-modal="true" aria-labelledby="quote-title"><button class="quote-close" type="button" aria-label="بستن">×</button><h2 id="quote-title">استعلام قیمت و مشاوره</h2><p class="quote-product"></p><form class="quote-form"><div><label>نام و نام خانوادگی<input name="name" required></label></div><div><label>شماره تلفن<input name="phone" required dir="ltr" placeholder="09xxxxxxxxx"></label></div><div><label>شهر<input name="city" required></label></div><div class="full"><label>آدرس<input name="address" required></label></div><div><label>نوع محصول یا خدمات<select name="type"><option>خرید محصول</option><option>خدمات برش لیزر</option><option>خدمات جوش لیزر</option><option>تعمیر و پشتیبانی</option><option>سایر</option></select></label></div><div class="full"><label>توضیحات<textarea name="message"></textarea></label></div><div class="full quote-actions"><button type="button" class="quote-send whatsapp" data-send="wa"><span class="brand-icon wa-icon">◔</span> واتساپ</button><button type="button" class="quote-send eitaa" data-send="eitaa"><span class="brand-icon">✈</span> ایتا</button><button type="button" class="quote-send bale" data-send="bale"><span class="brand-icon">●</span> بله</button></div></form></div>';
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
  // Product thumbnails: use the uploaded product image when one exists.
  var productImages = {
    'CT-001':'تک‌میز استاندارد 3015 - CUT-3015-STD.jpg',
    'CT-002':'DZ3015H - CUT-3015-2.jpg',
    'CT-003':'دومیز استاندارد 3015 با روتاری - CUT-3015-STD-DOUBLE-ROTARY.jpg',
    'CT-004':'تک‌میز حرفه‌ای 3015 - CUT-3015-PRO.jpg',
    'CT-005':'تک‌میز استاندارد 6020 - CUT-6020-STD.jpg',
    'CT-006':'دومیز استاندارد 6020 - CUT-6020-STD-DOUBLE.jpg',
    'CT-007':'دومیز حرفه‌ای 6020 با روتاری - CUT-6020-PRO-DOUBLE-ROTARY.jpg',
    'CT-008':'کابین‌دار حرفه‌ای 6020 - CUT-6020-CABIN-DOUBLE.jpg',
    'CC001':'S&A CWFL-1500 - CC001.jpg','CC002':'S&A CWFL-2000 - CC002.jpg','CC003':'S&A CWFL-3000 - CC003.jpg',
    'CC004':'Hanli HL-1500 - CC004.jpg','CC005':'Hanli HL-2000 - CC005.jpg','CC006':'Hanli HL-3000 - CC006.jpg',
    'CH001':'RayTools BT240S - CH001.jpg','CH002':'RayTools BM109 - CH002.jpg','CH003':'RayTools BM111 - CH003.jpg','CH004':'RayTools BM114 - CH004.jpg','CH005':'RayTools BM115 - CH005.jpg',
    'FS002':'سورس لیزر 50 وات پالسی فایبر Q-Switched - FS002.jpg','FS003':'Raycus RFL-C1000 - FS003.jpg','FS004':'Raycus RFL-C1500 - FS004.jpg','FS005':'سورس لیزر Raycus RFL-C2000 - FS005.jpg','FS006':'Raycus 3000 وات - FS006.jpg','FS007':'Raycus 4000 وات - FS007.jpg','FS008':'Raycus 6000 وات - FS008.jpg',
    'CN003':'نازل RayTools تک‌لایه - CN003.jpg','CN006':'نازل RayTools دولایه پرسرعت - CN006.jpg','CN007':'نازل RayTools دولایه فول‌پاور - CN007.jpg','CN008':'نازل RayTools تک‌لایه BT210-BT210S - CN008.jpg','CN009':'نازل RayTools TRA برای BM111 - CN009.jpg','CN011':'نازل RayTools دولایه - CN011.jpg','CN012':'نازل RayTools دولایه Full Power - CN012.jpg','CN013':'نازل RayTools TRA برای FL200-FL1501 - CN013.jpg',
    'CP-CERAMIC':'سرامیک هد برش فایبر - CP-CERAMIC.jpg','ML-004':'مارکینگ UV میزدار - ML-004.jpg','WL-003':'دستگاه جوش لیزر Air-Cooled - WL-003.jpg','WELD-1500':'دستگاه جوش فایبر 1500 وات - WELD-1500.jpg','WELD-2000':'دستگاه جوش فایبر 2000 وات - WELD-2000.jpg','WELD-3000':'دستگاه جوش فایبر 3000 وات - WELD-3000.jpg','WL-001':'دستگاه جوش فایبر 800 وات - WELD-800W.jpg','CL-002':'تمیزکاری لیزری پالسی 300 وات - CLEAN-300W.jpg','CL-004':'تمیزکاری لیزری پیوسته 2000 وات - CLEAN-2000W.jpg','ML-001':'مارکینگ فایبر رومیزی - MARK-DESKTOP-FIBER.jpg','ML-002':'مارکینگ فایبر میزدار - MARK-TABLE-FIBER.jpg','ML-005':'مارکینگ فایبر پرتابل آبی - MARK-PORTABLE-BLUE.jpg'
  };
  var prefix = location.pathname.indexOf('/products/') >= 0 ? '../' : '';
  document.querySelectorAll('.pcard .thumb').forEach(function(t){
    var code = t.querySelector('.code'); if(!code) return;
    var img = new Image();
    img.onload = function(){ t.innerHTML=''; img.alt=''; t.appendChild(img); };
    var file = productImages[code.textContent.trim()]; if(!file) return;
    img.src = prefix + file;
  });
  // product list: search + category filter
  var list = document.getElementById('plist'); if(!list) return;
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
    else navigator.clipboard.writeText(text).then(function(){
      window.open(b.dataset.ch==='eitaa'?'https://eitaa.com/sahandlaser_sale':'https://ble.ir/sahandlaser_sale','_blank','noopener');
    });
  });
  var pq = new URLSearchParams(location.search).get('p');
  if(pq) f.querySelector('#m').value = 'مدل مورد نظر: ' + pq + '\n';
})();
