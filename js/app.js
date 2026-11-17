(function(){
  // product thumbnails: try assets/products/{code}.webp, else keep icon
  var prefix = location.pathname.indexOf('/products/') >= 0 ? '../' : '';
  document.querySelectorAll('.pcard .thumb').forEach(function(t){
    var code = t.querySelector('.code'); if(!code) return;
    var img = new Image();
    img.onload = function(){ t.innerHTML=''; img.alt=''; t.appendChild(img); };
    img.src = prefix + 'assets/products/' + code.textContent.trim() + '.webp';
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
  // contact form: build message, send to WhatsApp or copy for eitaa/bale
  var f = document.getElementById('inq'); if(!f) return;
  function msg(){
    var d = new FormData(f), p = new URLSearchParams(location.search).get('p');
    return 'درخواست استعلام از سایت سهند لیزر\n' + 'نام: '+d.get('name')+'\nتماس: '+d.get('contact')+'\nنوع نیاز: '+d.get('type')+
      (d.get('industry')?'\nصنعت: '+d.get('industry'):'') + (p?'\nمدل: '+p:'') + (d.get('message')?'\nتوضیحات: '+d.get('message'):'');
  }
  f.addEventListener('click', function(e){
    var b = e.target.closest('[data-ch]'); if(!b) return;
    if(!f.reportValidity()) return;
    if(b.dataset.ch==='wa') window.open('https://wa.me/989125855548?text='+encodeURIComponent(msg()),'_blank','noopener');
    else navigator.clipboard && navigator.clipboard.writeText(msg()).then(function(){ alert('متن کپی شد. در ایتا یا بله جای‌گذاری کنید.'); });
  });
  var pq = new URLSearchParams(location.search).get('p');
  if(pq) f.querySelector('#m').value = 'مدل مورد نظر: ' + pq + '\n';
})();
