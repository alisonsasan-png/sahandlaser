/* Same animation model as preview-14/rebuilt.js:
 * SVG image clips in source-pixel coordinates; translate(dx,dy) -> translate(0,0).
 * The endpoints are a 2D assembly illustration, not CAD constraints.
 */
(() => {
  'use strict';
  const section = document.querySelector('.assembly');
  const sticky = section.firstElementChild;
  const stage = document.querySelector('.machine-stage');
  const svg = document.querySelector('.assembly-svg');
  const bar = document.querySelector('.assembly-progress');
  const slider = document.querySelector('#assembly-slider');
  const percent = document.querySelector('#assembly-percent');
  const caption = document.querySelector('#assembly-state');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const ns = 'http://www.w3.org/2000/svg';
  const image = 'assets/dz3015h-exploded.png';
  // Hand-traced silhouettes for this image (1536 x 1024), not percentage rectangles.
  // Foreground groups follow the source's physical occlusion order.
  const geometry = [
    {id:'rear-shell', name:'پوشش انتهایی', dx:-42, dy:190, delay:.04,
      points:'1038,25 1099,6 1468,120 1480,127 1486,140 1486,246 1419,270 1393,259 1389,169 1355,155 1374,138 1038,39'},
    {id:'rear-deck', name:'صفحهٔ عقب', dx:-42, dy:190, delay:.15,
      points:'889,59 912,49 913,24 949,10 995,20 1008,31 1050,44 1089,40 1366,127 1374,139 1336,149 1339,177 1318,183 1305,201 1296,200 1286,180 1258,176 1254,166 1210,153 1208,162 1199,160 1199,148 1156,136 1152,144 1141,142 1138,130 1099,119 1097,128 1085,125 1082,112 1048,103 1044,111 1034,108 1030,99 991,88 989,100 977,98 975,83 935,73 931,86 922,83 918,71 889,67'},
    {id:'bed', name:'شبکه و قاب میز کار', dx:0, dy:102, delay:.13,
      points:'243,337 995,148 1272,218 1327,255 1324,297 691,504 651,503 245,370'},
    {id:'gantry', name:'پل، هد برش و زنجیر کابل', dx:0, dy:177, delay:.27,
      points:'244,111 273,96 299,88 325,96 326,110 500,151 545,134 576,142 577,86 588,56 605,32 629,16 654,14 677,23 695,40 705,60 705,117 859,75 889,85 892,155 795,183 815,200 826,222 831,251 802,274 804,325 787,334 744,346 719,350 668,335 661,319 636,326 609,319 608,337 596,337 593,320 557,313 541,301 537,273 272,211 245,203',
      holes:['623,83 629,68 640,56 654,49 662,50 667,59 667,131 623,143'],
      islands:['255,238 360,212 385,217 279,264 258,258']},
    {id:'left-cap', name:'پوشش سمت چپ', dx:140, dy:90, delay:0,
      points:'104,220 112,207 155,195 163,199 163,222 177,216 196,227 201,316 195,330 184,337 157,330 142,334 104,318'},
    {id:'right-cap', name:'پوشش انتهای پنل راست', dx:-40, dy:80, delay:.01,
      points:'1435,302 1450,284 1487,277 1504,290 1505,426 1440,444 1437,371'},
    {id:'right-panel', name:'پنل طولی سمت راست', dx:-40, dy:80, delay:.03,
      points:'984,447 1397,295 1422,295 1435,302 1437,371 1016,520 987,510'}
  ];
  const defs = document.createElementNS(ns, 'defs');
  svg.append(defs);
  const node = (tag, attrs, parent) => {
    const el = document.createElementNS(ns, tag);
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
    parent.append(el);
    return el;
  };
  const picture = (parent, attrs = {}) => node('image', {href:image, width:1536, height:1024, ...attrs}, parent);
  const consoleOutline = '437,428 510,450 502,480 469,592 456,610 455,627 462,638 451,659 467,717 494,710 507,718 507,741 474,755 469,774 456,783 437,777 431,760 430,657 407,644 371,642 337,624 340,612 365,606 389,609 392,601 387,585 422,460';
  const contour = points => 'M' + points.trim().split(/\s+/).join(' L') + ' Z';
  // Even-odd contours preserve openings in the cable loop; they must remain
  // transparent when the gantry crosses the bed during assembly.
  const outline = part => [part.points, ...(part.islands || []), ...(part.holes || [])].map(contour).join(' ');
  const shape = (part, parent, attrs = {}) => node('path', {d:outline(part), 'fill-rule':'evenodd', 'clip-rule':'evenodd', ...attrs}, parent);
  // Base exposes only the chassis beneath the lifted components. Subtract every
  // moving silhouette so no second stationary copy survives underneath it.
  const mask = node('mask', {id:'chassis-mask', maskUnits:'userSpaceOnUse', x:0, y:0, width:1536, height:810}, defs);
  // Chassis, front panel and control pedestal remain a single grounded assembly.
  node('rect', {fill:'white', x:0, y:320, width:1536, height:490}, mask);
  node('rect', {fill:'black', x:0, y:320, width:235, height:70}, mask);
  for (const part of geometry) shape(part, mask, {fill:'black'});
  picture(svg, {mask:'url(#chassis-mask)', class:'machine-base'});
  // A table silhouette intersects the photographed head and console. Exclude
  // those exact outlines so their pixels cannot travel with the moving table.
  const bedMask = node('mask', {id:'bed-occlusion', maskUnits:'userSpaceOnUse', x:0, y:0, width:1536, height:810}, defs);
  node('rect', {fill:'white', x:0, y:0, width:1536, height:810}, bedMask);
  shape(geometry.find(part => part.id === 'gantry'), bedMask, {fill:'black'});
  node('polygon', {fill:'black', points:consoleOutline}, bedMask);
  for (const part of geometry) {
    const clip = node('clipPath', {id:`clip-${part.id}`, clipPathUnits:'userSpaceOnUse'}, defs);
    shape(part, clip);
    const group = node('g', {class:'machine-part', 'data-part':part.id, 'data-dx':part.dx, 'data-dy':part.dy, 'data-delay':part.delay, transform:`translate(${part.dx} ${part.dy})`}, svg);
    node('title', {}, group).textContent = part.name;
    picture(group, {'clip-path':`url(#clip-${part.id})`, ...(part.id === 'bed' ? {mask:'url(#bed-occlusion)'} : {})});
  }
  // The operator pedestal is in front of the bed at every scroll position.
  const consoleClip = node('clipPath', {id:'fixed-console', clipPathUnits:'userSpaceOnUse'}, defs);
  node('polygon', {points:consoleOutline}, consoleClip);
  picture(svg, {'clip-path':'url(#fixed-console)'});
  const parts = [...svg.querySelectorAll('.machine-part')];
  const clamp = x => Math.min(1, Math.max(0, x));
  const number = new Intl.NumberFormat('fa');
  let queued = false, manual = 0;
  function render(p) {
    stage.style.setProperty('--p', p.toFixed(3));
    bar.style.setProperty('--progress', p);
    // This is preview 14's delay + smoothstep + SVG translation algorithm.
    for (const part of parts) {
      const delay = Number(part.dataset.delay);
      const t = clamp((p - delay) / (1 - delay));
      const e = t * t * (3 - 2 * t);
      const x = Number(part.dataset.dx) * (1 - e);
      const y = Number(part.dataset.dy) * (1 - e);
      part.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    }
    slider.value = String(Math.round(p * 100));
    slider.setAttribute('aria-valuetext', `${number.format(Math.round(p * 100))} درصد باز`);
    percent.textContent = `${number.format(Math.round(p * 100))}٪`;
    caption.textContent = p >= .99 ? 'نمای انفجاری — برای جمع‌شدن به بالا برگردید' : p <= .01 ? 'دستگاه جمع‌شده' : 'قطعات در حال بازشدن';
  }
  function paint() {
    queued = false;
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const distance = Math.max(1, section.offsetHeight - sticky.offsetHeight);
    const p = reduced.matches ? manual : clamp((top - section.getBoundingClientRect().top) / distance);
    render(p);
  }
  function queue() { if (!queued) { queued = true; requestAnimationFrame(paint); } }
  slider.addEventListener('input', () => {
    manual = Number(slider.value) / 100;
    if (reduced.matches) { render(manual); return; }
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    scrollTo({top:scrollY + section.getBoundingClientRect().top - top + manual * (section.offsetHeight - sticky.offsetHeight), behavior:'instant'});
    queue();
  });
  addEventListener('scroll', queue, {passive:true});
  addEventListener('resize', queue, {passive:true});
  reduced.addEventListener('change', queue);
  paint();
})();
