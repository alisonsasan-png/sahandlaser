const menuButton=document.getElementById('menuButton');
const nav=document.querySelector('.main-nav');
menuButton?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open));});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');}));
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduced-motion');
document.querySelectorAll('.product-tile').forEach(tile=>tile.addEventListener('click',e=>{const id=tile.getAttribute('href')?.slice(1);if(id&&id!=='products'){e.preventDefault();document.getElementById('products')?.scrollIntoView({behavior:'smooth'});}}));

