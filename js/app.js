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
    count.textContent = shown + ' ظ…ظˆط±ط¯';
  }
  chips.forEach(function(b){ b.addEventListener('click', function(){ cat=b.dataset.cat; apply(); }); });
  q.addEventListener('input', apply); apply();
  // contact form: build message, send to WhatsApp or copy for eitaa/bale
  var f = document.getElementById('inq'); if(!f) return;
  function msg(){
    var d = new FormData(f), p = new URLSearchParams(location.search).get('p');
    return 'ط¯ط±ط®ظˆط§ط³طھ ط§ط³طھط¹ظ„ط§ظ… ط§ط² ط³ط§غŒطھ ط³ظ‡ظ†ط¯ ظ„غŒط²ط±\n' + 'ظ†ط§ظ…: '+d.get('name')+'\nطھظ…ط§ط³: '+d.get('contact')+'\nظ†ظˆط¹ ظ†غŒط§ط²: '+d.get('type')+
      (d.get('industry')?'\nطµظ†ط¹طھ: '+d.get('industry'):'') + (p?'\nظ…ط¯ظ„: '+p:'') + (d.get('message')?'\nطھظˆط¶غŒط­ط§طھ: '+d.get('message'):'');
  }
  f.addEventListener('click', function(e){
    var b = e.target.closest('[data-ch]'); if(!b) return;
    if(!f.reportValidity()) return;
    if(b.dataset.ch==='wa') window.open('https://wa.me/989125855548?text='+encodeURIComponent(msg()),'_blank','noopener');
    else navigator.clipboard && navigator.clipboard.writeText(msg()).then(function(){ alert('ظ…طھظ† ع©ظ¾غŒ ط´ط¯. ط¯ط± ط§غŒطھط§ غŒط§ ط¨ظ„ظ‡ ط¬ط§غŒâ€Œع¯ط°ط§ط±غŒ ع©ظ†غŒط¯.'); });
  });
  var pq = new URLSearchParams(location.search).get('p');
  if(pq) f.querySelector('#m').value = 'ظ…ط¯ظ„ ظ…ظˆط±ط¯ ظ†ط¸ط±: ' + pq + '\n';
})();

