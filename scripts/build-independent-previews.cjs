const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'preview-experiments/site.html'),'utf8');
const variants=fs.readFileSync(path.join(root,'preview-experiments/variants.js'),'utf8');
const configs={
 12:{taxonomy:'custom',theme:'emerald'},13:{taxonomy:'custom',theme:'gold'},14:{taxonomy:'custom',theme:'graphite'},15:{taxonomy:'custom',theme:'red'},
 16:{taxonomy:'process',theme:'blue'},17:{taxonomy:'size',theme:'soft'},18:{taxonomy:'industry',theme:'glass'},19:{taxonomy:'structure',theme:'cyan'},
 20:{taxonomy:'brand',theme:'editorial'},21:{taxonomy:'process',theme:'minimal'},22:{taxonomy:'size',theme:'white'},23:{taxonomy:'industry',theme:'gold'},24:{taxonomy:'structure',theme:'emerald'},
 25:{taxonomy:'custom',theme:'navy',layout:'rail'},26:{taxonomy:'process',theme:'editorial',layout:'editorial'},27:{taxonomy:'size',theme:'glass',layout:'split'},28:{taxonomy:'industry',theme:'soft',layout:'immersive'}
};
const layouts={
 rail:`document.body.classList.add('layout-rail');document.querySelectorAll('header nav').forEach(n=>n.classList.add('layout-rail-nav'));`,
 editorial:`document.body.classList.add('layout-editorial');document.querySelectorAll('#view-home .hero-slider').forEach(x=>x.classList.add('layout-editorial-hero'));`,
 split:`document.body.classList.add('layout-split');document.querySelectorAll('#view-products').forEach(x=>x.classList.add('layout-split-products'));`,
 immersive:`document.body.classList.add('layout-immersive');document.addEventListener('pointermove',e=>document.documentElement.style.setProperty('--cursor-x',e.clientX+'px'));`
};
const layoutCss=`<style>
.layout-rail header nav.layout-rail-nav{position:fixed;right:0;top:25%;z-index:60;display:flex!important;flex-direction:column;background:#0b1728ee;padding:10px;border-radius:18px 0 0 18px;box-shadow:0 15px 40px #0004}.layout-rail header nav.layout-rail-nav .nav-link{color:#fff;margin:3px;padding:9px}.layout-rail .hero-slider{padding-right:58px}
.layout-editorial .hero-slider{margin:24px 5vw;border-radius:28px;overflow:hidden}.layout-editorial #all-products-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.layout-editorial h2,.layout-editorial h3{font-family:Georgia,serif;letter-spacing:-.02em}
.layout-split{background:linear-gradient(90deg,#0c2530 0 28%,#f6fbfc 28%)}.layout-split #view-products{padding-right:29%;}.layout-split-products{border-right:1px solid #54d4d588}.layout-split .taxonomy-tree{position:sticky;top:90px;z-index:3}
.layout-immersive{background:#071426;color:#e5f7ff}.layout-immersive header{background:#071426ee!important}.layout-immersive .hero-slider{min-height:620px;box-shadow:0 0 100px #57c5ed22}.layout-immersive:before{content:'';position:fixed;inset:0;pointer-events:none;background:radial-gradient(circle at var(--cursor-x,50%) 35%,#57c5ed1c,transparent 22%);z-index:0}.layout-immersive .view{position:relative;z-index:1}@media(max-width:700px){.layout-editorial #all-products-grid{grid-template-columns:1fr}.layout-split{background:#f6fbfc}.layout-split #view-products{padding-right:0}.layout-rail header nav.layout-rail-nav{display:none!important}}
</style>`;
for(const [number,cfg] of Object.entries(configs)){
 const dir=path.join(root,`preview-${number}`);fs.mkdirSync(dir,{recursive:true});
 let html=source.replace(/<title>[\s\S]*?<\/title>/i,`<title>سهند لیزر | پیش‌نمایش مستقل ${number}</title>`);
 html=html.replace('</head>',`${cfg.layout?layoutCss:''}</head>`);
 html=html.replace('<script src="preview-experiments/variants.js"></script>',`<script>const __previewTaxonomy=${JSON.stringify(cfg.taxonomy)},__previewTheme=${JSON.stringify(cfg.theme)};</script><script>${cfg.layout?(layouts[cfg.layout]||''):''}</script><script>${variants.replace("const params=new URLSearchParams(location.search), taxonomy=params.get('taxonomy')||'', theme=params.get('theme')||'';","const taxonomy=__previewTaxonomy, theme=__previewTheme;")}</script>`);
 fs.writeFileSync(path.join(dir,'index.html'),html,'utf8');
}
console.log(JSON.stringify({built:Object.keys(configs).map(n=>`preview-${n}`),independent:true}));

