const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('runtime/app.js','utf8');const begin=source.indexOf('const ROUTES ='),end=source.indexOf('function showView(',begin);const views=[];const c={window:{location:{hash:'#product'},scrollTo(){}},products:{'CT-001':{}},applicationDetails:{sample:{}},T:{fa:{product_not_found:'missing'}},currentLang:'fa',showView:x=>views.push(x),renderProduct(){},renderApplication(){},updateActiveNav(){},alert(){}};vm.createContext(c);vm.runInContext(source.slice(begin,end),c);
c.applyRoute();assert.equal(c.window.location.hash,'#products');assert.equal(views.length,0);
for(const route of ['home','about','products','services','applications','projects','training','downloads','contact']){c.window.location.hash='#'+route;c.applyRoute();assert.equal(views.at(-1),route);}
c.window.location.hash='#product=CT-001';c.applyRoute();assert.equal(views.at(-1),'product');
c.window.location.hash='#product=missing';c.applyRoute();assert.equal(c.window.location.hash,'#products');
c.window.location.hash='#application=sample';c.applyRoute();assert.equal(views.at(-1),'application');
c.window.location.hash='#unknown';c.applyRoute();assert.equal(views.at(-1),'home');console.log('Routes: all main views, valid detail routes, missing IDs, bare product and unknown route passed');
