const section=document.querySelector('.explore');
const stage=document.getElementById('stage');
const assembled=document.querySelector('.assembled');
const parts=[...document.querySelectorAll('.machine-part')];
const progress=document.getElementById('progress');
const percent=document.getElementById('stagePercent');
const state=document.getElementById('stageState');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const paths=[{x:-7,y:10,s:.98},{x:4,y:-12,s:1.02},{x:12,y:-19,s:1.05},{x:-15,y:1,s:1.01},{x:3,y:-4,s:1.04},{x:-5,y:13,s:1.02}];
let queued=false;
function paint(){
 queued=false;
 const distance=Math.max(1,section.offsetHeight-section.querySelector('.stage-wrap').offsetHeight);
 const p=reduced.matches?0:Math.max(0,Math.min(1,-section.getBoundingClientRect().top/distance));
 const e=p*p*(3-2*p);
 assembled.style.opacity=String(1-e);
 assembled.style.transform=`scale(${1+e*.018})`;
 parts.forEach((part,i)=>{const q=paths[i];part.style.opacity=String(e);part.style.transform=`translate(${q.x*(1-e)}%,${q.y*(1-e)}%) scale(${1+(q.s-1)*(1-e)})`;});
 progress.style.height=`${e*100}%`;
 percent.textContent=`${Math.round(e*100)}٪`;
 state.textContent=e>.55?'نمای انفجاری؛ قطعات جداشده':'حالت کامل دستگاه';
}
function queue(){if(!queued){queued=true;requestAnimationFrame(paint)}}
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue,{passive:true});reduced.addEventListener('change',queue);paint();
