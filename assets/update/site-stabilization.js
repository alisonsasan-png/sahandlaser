/* Sahand Laser — responsive/performance stabilization — 2026-10-04 */
(function(){
'use strict';
function addStyle(){if(document.getElementById('sahand-stabilization-style'))return;const s=document.createElement('style');s.id='sahand-stabilization-style';s.textContent=`
img{max-width:100%;height:auto}.tab-content,.spec-item{min-width:0}.sahand-responsive-scroll{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}.sahand-live3d canvas{width:100%!important;height:100%!important;display:block}.sahand-live3d{min-height:320px}.product-mini-card,.application-card{contain:layout paint style}@media(max-width:640px){.spec-item{align-items:flex-start;flex-direction:column;gap:.3rem}.spec-value{text-align:right!important}.sahand-live3d{height:350px!important}.hero-nav{width:40px;height:40px}.hero-nav.prev{left:.35rem}.hero-nav.next{right:.35rem}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto!important}*,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`;document.head.appendChild(s)}
function optimizeImages(root=document){root.querySelectorAll('img').forEach((img,i)=>{if(!img.hasAttribute('decoding'))img.decoding='async';const inHero=!!img.closest('.hero-slide');const activeProduct=!!img.closest('#spin-viewer')&&img.classList.contains('active');if(!inHero&&!activeProduct&&!img.hasAttribute('loading'))img.loading='lazy'})}
function secureLinks(root=document){root.querySelectorAll('a[target="_blank"]').forEach(a=>{const parts=new Set((a.getAttribute('rel')||'').split(/\s+/).filter(Boolean));parts.add('noopener');parts.add('noreferrer');a.setAttribute('rel',[...parts].join(' '))})}
function wrapWideContent(root=document){root.querySelectorAll('table').forEach(t=>{if(t.parentElement?.classList.contains('sahand-responsive-scroll'))return;const w=document.createElement('div');w.className='sahand-responsive-scroll';t.parentNode.insertBefore(w,t);w.appendChild(t)})}
function closeMobileAfterNav(){document.addEventListener('click',e=>{const a=e.target.closest('#mobile-menu a,[data-nav]');if(!a)return;const m=document.getElementById('mobile-menu');if(m&&!m.classList.contains('hidden')&&typeof toggleMobile==='function')toggleMobile()})}
function observeChanges(){const mo=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType!==1)continue;optimizeImages(n);secureLinks(n);wrapWideContent(n)}});mo.observe(document.body,{childList:true,subtree:true})}
function boot(){addStyle();optimizeImages();secureLinks();wrapWideContent();closeMobileAfterNav();observeChanges()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
