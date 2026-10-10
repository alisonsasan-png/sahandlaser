(function(){
const frame=document.querySelector('iframe');
function install(){
const win=frame.contentWindow,doc=frame.contentDocument;
if(!doc||!win)return;
function apply(){
const products=win.SAHAND_PRODUCTS;
if(products){Object.values(products).forEach(p=>{if(p.media)p.media.frames360=[];});
const p=products['ML-004'];if(p){const url=new URL('assets/ML-004-commercial-v2.png',location.href).href;
p.images=[url];p.gallery=[];p.media=p.media||{};p.media.images=[url];p.media.frames360=[];}}
doc.querySelectorAll('img').forEach(img=>{
const src=img.getAttribute('src')||'';
if(/ML-004\/(commercial-v1|_MG_435[0347])/.test(src)){
img.src=new URL('assets/ML-004-commercial-v2.png',location.href).href;
img.style.transform='none';img.style.objectFit='contain';img.style.background='#fff';
}
});
}
apply();new win.MutationObserver(apply).observe(doc.body,{childList:true,subtree:true});
}
frame.addEventListener('load',install);if(frame.contentDocument?.readyState==='complete')install();
})();