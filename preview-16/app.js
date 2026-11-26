const section=document.querySelector('.explore');
const stage=document.getElementById('stage');
const assembled=document.querySelector('.assembled');
const exploded=document.querySelector('.exploded');
const progress=document.getElementById('progress');
const percent=document.getElementById('stagePercent');
const state=document.getElementById('stageState');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let queued=false;
function paint(){
  queued=false;
  const distance=Math.max(1,section.offsetHeight-section.querySelector('.stage-wrap').offsetHeight);
  const p=reduced.matches?0:Math.max(0,Math.min(1,-section.getBoundingClientRect().top/distance));
  const e=p*p*(3-2*p);
  assembled.style.opacity=String(1-e);
  assembled.style.transform=`scale(${1+e*.025})`;
  exploded.style.opacity=String(e);
  exploded.style.transform=`scale(${.94+e*.06})`;
  progress.style.height=`${e*100}%`;
  percent.textContent=`${Math.round(e*100)}٪`;
  state.textContent=e>.55?'نمای انفجاری اجزا':'حالت کامل دستگاه';
}
function queue(){if(!queued){queued=true;requestAnimationFrame(paint)}}
addEventListener('scroll',queue,{passive:true});
addEventListener('resize',queue,{passive:true});
reduced.addEventListener('change',queue);
paint();
