(() => {
  const supported=['fa','en','ar','tr'];
  const saved=()=>{try{return localStorage.getItem('sahand11-language')}catch{return null}};
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
  const automatic=/Istanbul/.test(tz)?'tr':/Dubai|Riyadh|Baghdad|Qatar|Kuwait|Bahrain|Muscat|Beirut|Damascus|Amman|Cairo|Casablanca|Algiers|Tunis|Tripoli/.test(tz)?'ar':/Europe\/|America\//.test(tz)?'en':'fa';
  let lang=new URLSearchParams(location.search).get('lang')||saved()||automatic;if(!supported.includes(lang))lang='fa';
  let dictionary={},busy=false;
  const translate=()=>{if(lang==='fa'||busy)return;busy=true;const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=walker.nextNode()){if(n.parentElement.closest('script,style,textarea,[translate=no]'))continue;const raw=n.nodeValue,trim=raw.trim();if(dictionary[trim])n.nodeValue=raw.replace(trim,dictionary[trim]);}document.querySelectorAll('[placeholder],[aria-label],[title]').forEach(e=>{for(const k of ['placeholder','aria-label','title']){const v=e.getAttribute(k);if(dictionary[v])e.setAttribute(k,dictionary[v]);}});busy=false;};
  document.documentElement.lang=lang;document.documentElement.dir=['fa','ar'].includes(lang)?'rtl':'ltr';document.querySelector('#active-flag').src='assets/flag-'+lang+'.svg';
  document.querySelectorAll('[data-language]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.language===lang)));
  if(lang!=='fa')fetch('translations/'+lang+'.json').then(r=>r.json()).then(d=>{dictionary=d;translate();new MutationObserver(()=>translate()).observe(document.querySelector('#site'),{childList:true,subtree:true});}).catch(()=>{});
  document.addEventListener('click',e=>{const b=e.target.closest('[data-language]');if(!b)return;try{localStorage.setItem('sahand11-language',b.dataset.language)}catch{}const u=new URL(location.href);u.searchParams.set('lang',b.dataset.language);location.href=u.href});
})();
