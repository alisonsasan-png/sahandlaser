(() => {
  'use strict';
  const STORE='sahand-preview18-review-v1';
  const frame=document.querySelector('#site-preview'),select=document.querySelector('#page-select');
  const list=document.querySelector('#section-list'),note=document.querySelector('#note'),styleSelect=document.querySelector('#style-select');
  let pages=[],sections=[],activeIndex=0,activeUrl='index.html',observerTimer;
  const fa=new Intl.NumberFormat('fa-IR');
  const pageNames={
    'index.html':'صفحهٔ اصلی','products.html':'فهرست محصولات','services.html':'خدمات','articles.html':'مقالات و راهنماها',
    'about.html':'دربارهٔ ما','contact.html':'تماس و مسیر دسترسی','downloads.html':'دانلودها','chooser.html':'راهنمای انتخاب دستگاه',
    'compare.html':'مقایسهٔ محصولات','brands.html':'برندها و همکاران','gallery.html':'نمونه‌کارها','showroom.html':'نمایشگاه محصولات',
    'films.html':'فیلم‌ها','atlas.html':'اطلس اجزا','applications.html':'کاربردها','application.html':'جزئیات کاربرد',
    'media.html':'رسانه','basket.html':'سبد درخواست','product.html':'جزئیات محصول','article.html':'جزئیات مقاله','service.html':'جزئیات خدمت'
  };
  function addOption(group,label,value){let optgroup=select.querySelector(`optgroup[label="${group}"]`);if(!optgroup){optgroup=document.createElement('optgroup');optgroup.label=group;select.append(optgroup);}const o=document.createElement('option');o.value=value;o.textContent=label;optgroup.append(o);}
  function loadPageCatalog(){
    const staticPages=Object.entries(pageNames);
    pages=staticPages.map(([href,title])=>({href,title}));
    const data=window.SAHAND_DATA||{};
    for(const p of data.products||[])pages.push({href:`products/${encodeURIComponent(p.code)}.html`,title:`${p.code} · ${p.name}`,group:'محصولات'});
    for(const p of data.articles||[])pages.push({href:`article.html?id=${encodeURIComponent(p.id)}`,title:p.title,group:'مقالات'});
    for(const item of ['consulting','installation','laser-cutting','machine-repair','marking-engraving','source-head-repair','spare-parts','training'])pages.push({href:`services/${item}.html`,title:new URL(item+'.html','https://local/').pathname.split('/').pop().replace('.html','').replaceAll('-',' '),group:'خدمات'});
    for(const p of pages){
      const group=p.group||(p.href.startsWith('products/')?'محصولات':p.href.startsWith('services/')?'خدمات':p.href.startsWith('article.html?id=')?'مقالات':'صفحات');
      addOption(group,p.title,p.href);
    }
  }
  function currentUrl(){try{const u=new URL(frame.contentWindow.location.href);return u.pathname.replace(/^.*\/preview-18\//,'')+u.search;}catch{return activeUrl;}}
  function pageTitle(url){return pages.find(p=>p.href===url)?.title||url;}
  function readStore(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}}
  function writeStore(data){localStorage.setItem(STORE,JSON.stringify(data));document.querySelector('#saved-state').textContent='ذخیره شد · همین مرورگر';}
  function recordKey(i){return activeUrl+'::'+i;}
  function scanPage(){
    clearTimeout(observerTimer);
    try{
      const doc=frame.contentDocument,main=doc.querySelector('main');
      if(!main)throw Error('صفحه هنوز آماده نشده');
      activeUrl=currentUrl();
      const direct=[...main.children].filter(e=>e.matches('section,article,[data-review-section]'));
      let candidates=direct.length?direct:[...main.querySelectorAll('section,article')].filter(e=>!e.parentElement.closest('section,article'));
      if(!candidates.length)candidates=[main];
      sections=candidates.map((el,i)=>{
        const h=el.querySelector('h1,h2,h3,h4');
        const heading=h?.innerText?.trim().replace(/\s+/g,' ');
        const first=el.innerText?.trim().replace(/\s+/g,' ').slice(0,74);
        return {el,index:i,title:heading||first||`بخش ${fa.format(i+1)}`};
      });
      const prior=doc.querySelector('#client-review-highlight');if(prior)prior.remove();
      const css=doc.createElement('style');css.id='client-review-highlight';css.textContent='.client-review-active{outline:3px solid #e5a728!important;outline-offset:4px!important;box-shadow:0 0 0 7px #e5a72825!important;scroll-margin-top:90px!important}.client-review-target{cursor:pointer!important}';doc.head.append(css);
      sections.forEach(s=>s.el.classList.add('client-review-target'));
      main.addEventListener('click',onFrameClick,true);
      const selected=pages.find(p=>p.href===activeUrl);if(selected)select.value=selected.href;
      document.querySelector('#preview-title').textContent=pageTitle(activeUrl);
      document.querySelector('#open-page').href=activeUrl;
      activeIndex=Math.min(activeIndex,Math.max(0,sections.length-1));
      renderSections();focusSection(activeIndex,false);
    }catch(e){list.innerHTML=`<li class="loading">${e.message}</li>`;}
  }
  function onFrameClick(event){
    const link=event.target.closest('a[href]');
    if(link){setTimeout(()=>{activeUrl=currentUrl();syncNavigation();},100);return;}
    const hit=event.target.closest('section,article,[data-review-section]');
    if(hit){const i=sections.findIndex(s=>s.el===hit||s.el.contains(hit));if(i>=0)focusSection(i,false);}
  }
  function syncNavigation(){const found=pages.find(p=>p.href===activeUrl);if(found)select.value=found.href;document.querySelector('#preview-title').textContent=pageTitle(activeUrl);document.querySelector('#open-page').href=activeUrl;scanPage();}
  function renderSections(){
    const saved=readStore();
    const done=sections.filter(s=>['approved','revision','redesign'].includes(saved[recordKey(s.index)]?.status)).length;
    document.querySelector('#progress-count').textContent=`${fa.format(done)} از ${fa.format(sections.length)}`;
    document.querySelector('#section-count').textContent=`${fa.format(sections.length)} بخش`;
    document.querySelector('#progress-bar').style.width=(sections.length?done/sections.length*100:0)+'%';
    list.replaceChildren();
    sections.forEach((s,i)=>{
      const rec=saved[recordKey(i)],li=document.createElement('li'),button=document.createElement('button');
      button.type='button';button.setAttribute('aria-current',String(i===activeIndex));
      const number=document.createElement('span');number.className='item-number';number.textContent=fa.format(i+1);
      const title=document.createElement('span');title.className='item-name';title.textContent=s.title;
      const status=document.createElement('span');status.className='status-pill '+(rec?.status||'');
      status.textContent=rec?.status==='approved'?'تأیید':rec?.status==='revision'?'اصلاح':rec?.status==='redesign'?'تغییر مدل':rec?.status==='draft'?'پیش‌نویس':'بازبینی';
      button.append(number,title,status);button.addEventListener('click',()=>focusSection(i,true));li.append(button);list.append(li);
    });
  }
  function finalPageStep(i){const pageIndex=pages.findIndex(p=>p.href===activeUrl);return i===sections.length-1&&(pageIndex<0||pageIndex===pages.length-1);}
  function focusSection(i,scroll=true){
    if(!sections[i])return;
    activeIndex=i;sections.forEach(s=>s.el.classList.remove('client-review-active'));
    const s=sections[i];s.el.classList.add('client-review-active');
    if(scroll)s.el.scrollIntoView({behavior:'smooth',block:'center'});
    document.querySelector('#current-number').textContent=fa.format(i+1);
    document.querySelector('#current-section-name').textContent=s.title;
    const last=i===sections.length-1, final=finalPageStep(i);
    document.querySelector('#approve').textContent=final?'تأیید نهایی و پایان بازبینی':last?'تأیید و رفتن به صفحهٔ بعد':'تأیید و رفتن به مرحلهٔ بعد';
    document.querySelector('#finish-review').classList.toggle('is-visible',final);
    const rec=readStore()[recordKey(i)];note.value=rec?.note||'';styleSelect.value=rec?.style||'';
    renderSections();
  }
  function persistCurrentDraft(){
    if(!sections[activeIndex])return;
    const all=readStore(),key=recordKey(activeIndex),old=all[key]||{};
    if(!note.value.trim()&&!styleSelect.value&&!old.status)return;
    all[key]={...old,status:old.status||'draft',note:note.value.trim(),style:styleSelect.value,section:sections[activeIndex].title,page:activeUrl,updatedAt:new Date().toISOString()};
    writeStore(all);
  }
  function advanceAfterSave(){
    if(activeIndex<sections.length-1){focusSection(activeIndex+1,true);return;}
    const pageIndex=pages.findIndex(p=>p.href===activeUrl);
    if(pageIndex>=0&&pageIndex<pages.length-1){
      const next=pages[pageIndex+1];activeUrl=next.href;activeIndex=0;select.value=next.href;
      document.querySelector('#saved-state').textContent='بخش ثبت شد؛ صفحهٔ بعد در حال بارگذاری است';
      frame.src=next.href;return;
    }
    document.querySelector('#finish-review').classList.add('is-visible');
    document.querySelector('#saved-state').textContent='بازبینی صفحهٔ آخر تمام شد؛ گزارش را دریافت یا در ایتا آماده کنید';
  }
  function saveDecision(status,advance=true){
    if(status!=='approved'&&!note.value.trim()&&!styleSelect.value){
      note.focus();note.setCustomValidity('برای ثبت اصلاح یا تغییر مدل، توضیح بنویسید یا یک سبک انتخاب کنید.');
      note.reportValidity();note.addEventListener('input',()=>note.setCustomValidity(''),{once:true});return false;
    }
    if(!sections[activeIndex]){document.querySelector('#saved-state').textContent='صفحه هنوز آماده نشده؛ چند لحظه صبر کنید';return false;}
    const all=readStore();all[recordKey(activeIndex)]={status,note:note.value.trim(),style:styleSelect.value,section:sections[activeIndex].title,page:activeUrl,updatedAt:new Date().toISOString()};writeStore(all);
    const labels={approved:'تأیید شد',revision:'اصلاح ثبت شد',redesign:'تغییر مدل ثبت شد'};
    document.querySelector('#saved-state').textContent=labels[status]+' · ذخیره شد';
    renderSections();if(advance)advanceAfterSave();return true;
  }
  function copyText(text){
    if(navigator.clipboard&&window.isSecureContext)return navigator.clipboard.writeText(text);
    return new Promise((resolve,reject)=>{const box=document.createElement('textarea');box.value=text;box.setAttribute('readonly','');box.style.position='fixed';box.style.opacity='0';document.body.append(box);box.select();const ok=document.execCommand('copy');box.remove();ok?resolve():reject(new Error('copy failed'));});
  }
  function prepareEitaa(){
    persistCurrentDraft();
    const report=readableReport();
    const recipient='https://eitaa.com/Seyed7091';
    const share='https://eitaa.com/share/url?url='+encodeURIComponent(recipient)+'&text='+encodeURIComponent(report);
    window.open(share.length<6000?share:recipient,'_blank','noopener,noreferrer');
    copyText(report).then(()=>{document.querySelector('#saved-state').textContent='گزارش کپی شد؛ در ایتا گفت‌وگوی @Seyed7091 را انتخاب و ارسال را تأیید کنید';})
      .catch(()=>{document.querySelector('#saved-state').textContent='ایتا باز شد؛ اگر متن آماده نبود گزارش را دانلود و در گفت‌وگوی @Seyed7091 پیوست کنید';});
  }
  function readableReport(){
    const saved=readStore(),rows=[];
    for(const value of Object.values(saved)){
      if(!value?.page)continue;
      const status=value.status==='approved'?'تأیید شد':value.status==='revision'?'نیاز به اصلاح دارد':value.status==='redesign'?'تغییر مدل طراحی خواسته شده':'پیش‌نویس ذخیره‌شده';
      rows.push(`صفحه: ${pageTitle(value.page)}\nبخش: ${value.section||'نامشخص'}\nوضعیت: ${status}\nمدل دلخواه: ${value.style||'انتخاب نشده'}\nتوضیح: ${value.note||'بدون توضیح'}`);
    }
    const count=rows.length;
    return `گزارش بازبینی سایت سهند لیزر\nمخاطب ایتا: @Seyed7091\nتاریخ: ${new Date().toLocaleString('fa-IR')}\nبخش‌های ثبت‌شده: ${fa.format(count)}\n\n${count?rows.join('\n\n--------------------\n\n'):'هنوز نظری ثبت نشده است.'}`;
  }
  function downloadReport(){
    persistCurrentDraft();
    const blob=new Blob([readableReport()],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download='sahand-laser-review-report.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
    document.querySelector('#saved-state').textContent='گزارش متنی دانلود شد';
  }
  select.addEventListener('change',()=>{activeUrl=select.value;activeIndex=0;frame.src=activeUrl;});
  frame.addEventListener('load',()=>{observerTimer=setTimeout(scanPage,180);});
  note.addEventListener('input',persistCurrentDraft);
  styleSelect.addEventListener('change',persistCurrentDraft);
  document.querySelector('#approve').addEventListener('click',()=>saveDecision('approved'));
  document.querySelector('#revise').addEventListener('click',()=>saveDecision('revision'));
  document.querySelector('#redesign').addEventListener('click',()=>saveDecision('redesign'));
  document.querySelector('#finish-review').addEventListener('click',()=>{if(saveDecision('approved',false))prepareEitaa();});
  document.querySelector('#export').addEventListener('click',downloadReport);
  document.querySelector('#send-eitaa').addEventListener('click',prepareEitaa);
  loadPageCatalog();
})();
