/* Illustration-based component motion for DZT6020T; no image crossfade. */
(() => {
  'use strict';
  const section = document.querySelector('#assembly');
  const sticky = section.querySelector('.assembly-sticky');
  const svg = document.querySelector('#machine'), stage = document.querySelector('#stage');
  const input = document.querySelector('#progress'), percent = document.querySelector('#percent');
  const state = document.querySelector('#state'), line = document.querySelector('#progress-line');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const src = new URL('assets-dzt-exploded.webp?v=20261126-2', document.baseURI).href;
  const node = (tag, attrs, parent) => {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    parent.append(el); return el;
  };
  const defs = node('defs', {}, svg);
  const path = points => 'M' + points.trim().split(/\s+/).join(' L') + ' Z';
  const parts = [
    {id:'bed',name:'شاسی و بستر دستگاه',dx:0,dy:0,delay:0,points:'20,392 91,381 236,401 782,500 783,548 771,558 769,600 751,610 742,640 730,651 713,648 624,628 631,647 632,655 622,664 608,664 604,655 610,645 608,622 394,574 393,592 401,598 399,604 383,609 373,603 373,597 379,590 379,572 211,533 211,549 219,553 217,559 204,560 196,555 199,549 199,531 65,502 65,514 71,520 67,526 51,528 45,521 51,515 52,500 24,479'},
    {id:'head-support',name:'پایهٔ واحد برش',dx:-100,dy:85,delay:.08,points:'899,385 968,379 1049,387 1055,414 1128,436 1135,456 1130,481 1059,500 1042,506 1029,495 1028,487 923,468 918,485 901,484',holes:['918,410 962,406 1028,417 1028,437 1011,435 1005,414 995,411 986,418 984,440 972,443 963,443 964,430 957,415 946,416 936,426 936,438 919,438','1066,434 1093,440 1108,442 1102,458 1065,468']},
    {id:'rails',name:'ریل و مسیر حرکت',dx:0,dy:55,delay:.14,points:'201,359 211,355 691,437 694,450 685,461 202,379'},
    {id:'tube-supports',name:'لوله و تکیه‌گاه‌های غلتکی',dx:0,dy:103,delay:.22,points:'209,311 212,296 219,284 232,284 244,294 266,295 281,292 389,309 395,315 642,345 653,345 657,352 671,352 682,360 687,371 683,382 675,385 676,398 689,400 687,410 676,416 620,404 616,395 620,387 382,349 380,364 395,368 394,376 367,374 353,366 352,344 234,326 233,338 256,341 254,349 208,342',holes:['251,321 352,337 352,343 251,328','396,344 619,379 618,386 396,353']},
    {id:'chuck',name:'واحد چرخان و سه‌نظام',dx:20,dy:147,delay:.05,points:'15,311 48,306 51,266 54,253 64,247 139,237 156,242 179,244 182,255 184,278 189,287 190,303 182,312 183,329 160,334 142,343 121,346 101,341 44,353 18,360'},
    {id:'head',name:'محفظهٔ واحد برش',dx:-100,dy:170,delay:.3,points:'828,126 857,119 856,107 853,105 855,51 869,50 872,61 871,96 867,105 865,118 963,117 967,99 979,84 993,77 1013,76 1032,82 1045,96 1053,116 1226,123 1227,353 1216,361 1180,369 1177,360 1090,383 1057,392 1018,383 1012,376 909,371 910,376 894,375 873,370 873,254 848,253 829,250',holes:['979,119 985,103 996,94 1009,93 1022,100 1030,115','1090,291 1172,278 1173,351 1092,348']},
    {id:'outfeed',name:'بخش خروجی و تکیه‌گاه قطعه',dx:-135,dy:-25,delay:.1,points:'984,558 1024,547 1027,532 1099,546 1168,480 1524,532 1524,722 1505,733 1507,744 1514,751 1510,763 1493,768 1484,761 1487,750 1493,744 1491,738 1393,782 1394,794 1403,803 1400,813 1380,818 1370,812 1370,803 1380,794 1379,782 1065,707 1065,719 1074,723 1076,731 1066,738 1052,736 1046,731 1050,720 1055,715 1053,704 1008,695 1007,707 1015,713 1013,722 998,725 988,720 990,712 998,705 999,688 982,682 980,673 993,670 993,608 984,604'},
    {id:'console',name:'کنسول و پایهٔ کنترل',dx:-55,dy:80,delay:.2,points:'718,426 744,418 769,307 798,309 846,308 859,316 867,327 841,443 821,451 818,492 822,496 863,498 884,506 887,615 878,624 854,621 853,568 850,532 810,541 792,537 788,532 788,454 720,442'}
  ];
  for (const part of parts) {
    const clip = node('clipPath', {id:'tube-'+part.id,clipPathUnits:'userSpaceOnUse'}, defs);
    node('path',{d:path(part.points)+(part.holes||[]).map(path).join(' '),'clip-rule':'evenodd'},clip);
    part.element = node('g', {'data-part':part.id},svg);
    node('title',{},part.element).textContent=part.name;
    node('image',{href:src,width:1536,height:1024,'clip-path':'url(#tube-'+part.id+')',preserveAspectRatio:'none'},part.element);
  }
  const clamp = value => Math.max(0,Math.min(1,value));
  const fa = new Intl.NumberFormat('fa-IR');
  let pending=false, manual=0, start=0, distance=1, visible=true;
  function render(progress) {
    for (const part of parts) {
      const t=clamp((progress-part.delay)/(1-part.delay));
      const remaining=1-t*t*(3-2*t);
      part.element.setAttribute('transform',`translate(${(part.dx*remaining).toFixed(2)} ${(part.dy*remaining).toFixed(2)})`);
    }
    const value=Math.round(progress*100);
    input.value=value;
    input.setAttribute('aria-valuetext',fa.format(value)+' درصد بازشدن دستگاه');
    percent.textContent=fa.format(value)+'٪';
    state.textContent=value===0?'دستگاه جمع‌شده':value===100?'نمای انفجاری کامل':'بازشدن تدریجی اجزا';
    line.style.transform=`scaleX(${progress})`;
    stage.dataset.progress=progress.toFixed(3);
  }
  function paint(){pending=false;render(reduced.matches?manual:clamp((scrollY-start)/distance));}
  function queue(){if(!pending){pending=true;requestAnimationFrame(paint);}}
  function measure(){start=scrollY+section.getBoundingClientRect().top-parseFloat(getComputedStyle(sticky).top||0);distance=Math.max(1,section.offsetHeight-sticky.offsetHeight);queue();}
  function setProgress(value){manual=value;if(reduced.matches){render(value);return;}measure();scrollTo({top:start+distance*value,behavior:'instant'});queue();}
  input.addEventListener('input',()=>setProgress(Number(input.value)/100));
  document.querySelector('#close-parts').addEventListener('click',()=>setProgress(0));
  document.querySelector('#open-parts').addEventListener('click',()=>setProgress(1));
  addEventListener('scroll',()=>{if(visible&&!reduced.matches)queue();},{passive:true});
  addEventListener('resize',measure,{passive:true});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)queue();},{rootMargin:'150px'}).observe(section);
  new ResizeObserver(measure).observe(sticky);
  function motionPreference(){document.querySelector('#scroll-hint').textContent=reduced.matches?'با دکمه‌ها یا نوار زیر تصویر، اجزای دستگاه را باز و بسته کنید.':'آرام به پایین اسکرول کنید؛ اجزای دستگاه به‌تدریج از هم جدا می‌شوند. با اسکرول به بالا دوباره جمع می‌شوند.';measure();}
  reduced.addEventListener('change',motionPreference);
  const image=new Image();
  image.onload=()=>{stage.dataset.ready='true';stage.setAttribute('aria-busy','false');measure();};
  image.onerror=()=>{document.querySelector('#image-error').hidden=false;stage.setAttribute('aria-busy','false');};
  image.src=src;
  document.fonts.ready.then(measure);
  addEventListener('load',measure,{once:true});
  motionPreference();render(0);
})();
