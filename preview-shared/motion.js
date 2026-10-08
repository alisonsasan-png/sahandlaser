const bar=document.querySelector('.bar'),visual=document.querySelector('.visual img');
addEventListener('scroll',()=>{bar?.classList.toggle('compact',scrollY>40);if(visual&&document.body.classList.contains('v8')){const p=Math.min(1,scrollY/900);visual.style.setProperty('--shift',`${p*18}px`);visual.style.setProperty('--turn',`${p*-5}deg`)}} ,{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('seen')),{threshold:.14});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
