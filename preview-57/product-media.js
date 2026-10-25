/* Preview 57 — deterministic product/media registry.
   Sources: Preview 29 product data, Preview 32 identities, Preview 33 sheets, Preview 50 X-rays. */
(function(){
'use strict';
var products=window.PREVIEW29_PRODUCTS||[];
var visual=window.PREVIEW32_IMAGES||[];
var sheets=window.PREVIEW_DIMENSIONAL_SHEETS||[];
var bySheet={};sheets.forEach(function(s){bySheet[s.id]=s});
var machine={cutting:1,welding:1,marking:1,source:1,cleaning:1};
var exact={
 'CUT-3015-1':'CUT-3015-1','CUT-3015-2':'CUT-3015-2',
 'CUT-6020-1':'CUT-6020-1','CUT-6020-2':'CUT-6020-2',
 'CL-001':'cleaning-fiber-pulsed-air','CL-002':'cleaning-fiber-pulsed-water','CL-004':'cleaning-fiber-continuous',
 'ML-005':'marking-fiber-portable','ML-006':'marking-fiber-flying','ML-007':'marking-fiber-desktop','ML-009':'marking-fiber-table',
 'WL-001':'weld-fiber-mini','WL-003':'weld-fiber-air-cooled','WL-005':'weld-fiber-spot'
};
var reference={
 'CUT-3015-3':['CUT-3015-1','reference'],'CUT-3015-5':['double-3015-pro','reference'],
 'CUT-3015-7':['single-3015-standard-rotary','estimated-reference'],'CUT-3015-8':['double-3015-standard-rotary','estimated-reference'],
 'CUT-6020-3':['CUT-6020-1','reference'],'CUT-6020-5':['double-6020-pro','reference'],
 'CUT-6020-7':['single-6020-pro-rotary','estimated-reference'],'CUT-6020-8':['double-6020-standard-rotary','estimated-reference'],
 'CL-003':['cleaning-fiber-pulsed-water','reference'],'CLEAN-GENERIC':['cleaning-fiber-continuous','reference'],
 'MK-FIBER-GENERIC':['marking-fiber-desktop','reference'],'ML-001':['marking-fiber-desktop','reference'],
 'ML-002':['marking-fiber-desktop','reference'],'ML-003':['marking-fiber-desktop','reference'],'ML-008':['marking-fiber-desktop','reference'],
 'WELD-1500':['weld-fiber-base','reference'],'WELD-2000':['weld-fiber-base','reference'],'WELD-3000':['weld-fiber-base','reference'],
 'WL-002':['weld-fiber-base','reference'],'WL-004':['weld-fiber-air-cooled','reference']
};
var visualRef={
 1:['CUT-3015-1','reference'],2:['CUT-6020-1','reference'],3:['CUT-6020-1','reference'],4:['single-3015-standard-rotary','estimated-reference'],
 5:['CUT-6020-1','reference'],6:['CUT-6020-1','reference'],7:['CUT-3015-1','reference'],8:['weld-fiber-base','reference'],
 9:['CUT-3015-1','reference'],10:['CUT-6020-1','reference'],11:['CUT-3015-1','reference'],12:['CUT-3015-1','reference'],
 13:['CUT-3015-1','reference'],14:['single-3015-pro-rotary','estimated-reference'],15:['single-6020-pro-rotary','estimated-reference'],
 16:['CUT-3015-1','reference'],17:['marking-fiber-desktop','reference'],18:['marking-fiber-desktop','reference'],
 19:['marking-fiber-desktop','reference'],20:['marking-fiber-desktop','reference'],21:['marking-fiber-desktop','reference'],
 22:['marking-fiber-desktop','reference'],23:['marking-fiber-portable','verified'],24:['marking-fiber-table','reference'],
 25:['weld-fiber-base','reference'],26:['weld-fiber-base','reference'],27:['CUT-3015-1','verified'],
 28:['cabin-3015-pro','estimated-reference'],29:['single-3015-standard-rotary','estimated-reference'],
 30:['single-6020-pro-rotary','estimated-reference'],31:['weld-fiber-base','reference'],32:['cleaning-fiber-continuous','reference']
};
function route(p){return p.visual?'P57-'+String(p.number).padStart(2,'0'):p.code}
function drawing(id,status){var s=bySheet[id];if(!s)return null;return {src:s.src,title:s.title,dimensions:s.dimensions,estimated:!!s.estimated,status:status|| (s.estimated?'estimated':'verified')}}
function add(p,visualItem){
 var routeId=route(p),d=null,ref=visualItem?visualRef[visualItem.number]:null;
 if(!visualItem&&exact[p.code])d=drawing(exact[p.code],'verified');
 else if(!visualItem&&reference[p.code])d=drawing(reference[p.code][0],reference[p.code][1]);
 else if(visualItem&&ref)d=drawing(ref[0],ref[1]);
 var xr=visualItem?'assets/preview-50-xray/'+String(visualItem.number).padStart(2,'0')+'.jpg':(p.code==='ML-004'?'preview-6/assets/sahand-ml004-xray-branded.jpg':'');
 var isMachine=!!machine[p.category];
 window.PREVIEW57_MEDIA_MAP[routeId]={
   route:routeId,code:p.code,name:p.name,category:p.category,product:p,
   main:p.image||'',drawing:d,xray:xr,required:isMachine,
   mainStatus:p.image?'FOUND':'NOT FOUND',
   drawingStatus:isMachine?(d?(d.status==='verified'?'FOUND': 'UNRESOLVED'):'NOT FOUND'):'NOT REQUIRED',
   xrayStatus:isMachine?(xr?'FOUND':'NOT FOUND'):'NOT REQUIRED',
   notes:d&&d.status!=='verified'?'این نقشه به‌عنوان مرجع خانوادگی/تخمینی نمایش داده می‌شود و نقشهٔ دقیق این مدل تأیید نشده است.':''
 };
}
window.PREVIEW57_MEDIA_MAP={};
products.forEach(function(p){add(p,null)});
visual.forEach(function(v){add({visual:true,number:v.number,code:v.code,name:v.name,category:v.category,image:v.image,description:'محصول تصویری ثبت‌شده در Preview 32'},v)});
window.PREVIEW57_MEDIA_LIST=Object.keys(window.PREVIEW57_MEDIA_MAP).map(function(k){return window.PREVIEW57_MEDIA_MAP[k]});
})();