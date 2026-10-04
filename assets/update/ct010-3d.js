(function(){
'use strict';
function mount(el){
 if(!el||!window.THREE){ if(el) el.innerHTML='<div style="padding:30px;text-align:center">3D engine loading...</div>'; return; }
 const T=window.THREE;
 el.innerHTML='';
 const scene=new T.Scene(); scene.background=new T.Color(0xeaf1f8);
 const camera=new T.PerspectiveCamera(34,1,1,20000); camera.position.set(5900,3500,4700);
 const renderer=new T.WebGLRenderer({antialias:true,alpha:false});
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2)); renderer.shadowMap.enabled=true; renderer.shadowMap.type=T.PCFSoftShadowMap; renderer.outputColorSpace=T.SRGBColorSpace; el.appendChild(renderer.domElement);
 scene.add(new T.HemisphereLight(0xffffff,0x6b7b8c,2.3));
 const key=new T.DirectionalLight(0xffffff,3.2); key.position.set(3000,6000,3500); key.castShadow=true; scene.add(key);
 const fill=new T.DirectionalLight(0x9fc5ff,1.3); fill.position.set(-3000,2500,-2500); scene.add(fill);
 const root=new T.Group(); scene.add(root);
 const mats={
  blue:new T.MeshStandardMaterial({color:0x0e5592,roughness:.55,metalness:.2}), blue2:new T.MeshStandardMaterial({color:0x1976b9,roughness:.5,metalness:.18}),
  darkblue:new T.MeshStandardMaterial({color:0x092f55,roughness:.6,metalness:.2}), black:new T.MeshStandardMaterial({color:0x111820,roughness:.68,metalness:.25}),
  gray:new T.MeshStandardMaterial({color:0x5d6670,roughness:.55,metalness:.55}), steel:new T.MeshStandardMaterial({color:0xb9c1c9,roughness:.32,metalness:.78}),
  silver:new T.MeshStandardMaterial({color:0xd8dde2,roughness:.28,metalness:.8}), red:new T.MeshStandardMaterial({color:0xb91c1c,roughness:.45,metalness:.2}),
  green:new T.MeshStandardMaterial({color:0x18d66b,emissive:0x06451f,emissiveIntensity:.7}), yellow:new T.MeshStandardMaterial({color:0xe7a91b,roughness:.4,metalness:.25})
 };
 const groups={frame:new T.Group(),bed:new T.Group(),motion:new T.Group(),carriage:new T.Group(),covers:new T.Group(),chains:new T.Group(),control:new T.Group(),details:new T.Group()};
 Object.values(groups).forEach(g=>root.add(g));
 function box(g,x,y,z,dx,dy,dz,mat){const m=new T.Mesh(new T.BoxGeometry(dx,dz,dy),mats[mat]||mats.blue);m.position.set(x+dx/2,z+dz/2,y+dy/2);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
 function cyl(g,x,y,z,r,h,mat,axis){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,20),mats[mat]||mats.steel);m.position.set(x,z,y);if(axis==='x')m.rotation.z=Math.PI/2;else if(axis==='y')m.rotation.x=Math.PI/2;m.castShadow=true;g.add(m);return m;}
 const L=4000,W=2000,BED_X=500,BED_Y=250,BED_Z=440,WORK_L=3000,WORK_W=1500,GX=2100,GZ=735,CY=W/2-255;
 box(groups.frame,60,85,0,L-120,85,70,'black');box(groups.frame,60,W-170,0,L-120,85,70,'black');
 [160,900,1700,2500,3300,3760].forEach(x=>[130,W-210].forEach(y=>{box(groups.frame,x,y,0,105,105,25,'black');cyl(groups.frame,x+52,y+52,25,25,92,'silver','z');}));
 box(groups.frame,125,180,150,L-250,145,190,'darkblue');box(groups.frame,125,W-325,150,L-250,145,190,'darkblue');
 [250,720,1190,1660,2130,2600,3070,3540].forEach(x=>box(groups.frame,x,315,170,105,W-630,145,'darkblue')); [455,730,1005,1280,1555].forEach(y=>box(groups.frame,340,y,330,L-680,68,85,'gray'));
 box(groups.bed,BED_X,BED_Y,BED_Z,WORK_L,WORK_W,70,'darkblue'); box(groups.bed,BED_X,BED_Y,BED_Z+70,WORK_L,55,55,'gray');box(groups.bed,BED_X,BED_Y+WORK_W-55,BED_Z+70,WORK_L,55,55,'gray');
 [BED_Y+145,BED_Y+430,BED_Y+715,BED_Y+1000,BED_Y+1285].forEach(y=>box(groups.bed,BED_X+35,y,BED_Z+70,WORK_L-70,55,35,'gray')); for(let i=0;i<64;i++){const x=BED_X+45+i*((WORK_L-90)/63);box(groups.bed,x,BED_Y+40,BED_Z+105,10,WORK_W-80,120,'black');}
 [['L',145],['R',W-235]].forEach(([s,y])=>{box(groups.motion,200,y,555,L-400,90,62,'blue');box(groups.motion,245,y+28,610,L-490,28,26,'steel');box(groups.motion,265,y+70,590,L-530,18,18,'black');for(let j=0;j<65;j++)box(groups.motion,285+j*49,y+70,608,16,18,9,'black');});
 [175,W-235].forEach(y=>[0,90].forEach(k=>box(groups.motion,GX-50+k,y,630,70,65,38,'steel')));
 box(groups.motion,GX,155,GZ,245,W-310,250,'blue2');box(groups.motion,GX+12,190,GZ+240,221,W-380,38,'blue');box(groups.motion,GX-92,140,GZ-75,92,235,330,'blue');box(groups.motion,GX-92,W-375,GZ-75,92,235,330,'blue');
 box(groups.motion,GX+42,315,GZ+78,150,W-630,44,'steel');box(groups.motion,GX-43,220,GZ+28,43,625,160,'black');box(groups.motion,GX-43,W-845,GZ+28,43,625,160,'black');
 box(groups.carriage,GX-145,CY,525,410,510,690,'blue');box(groups.carriage,GX-132,CY+22,560,30,466,595,'blue2');box(groups.carriage,GX+235,CY+22,560,24,466,595,'blue2');box(groups.carriage,GX+245,W/2-112,655,18,224,335,'black');box(groups.carriage,GX+18,W/2-95,510,95,190,155,'blue2');box(groups.carriage,GX+32,W/2-52,445,68,104,205,'steel');
 cyl(groups.carriage,GX+66,W/2,355,40,105,'silver','z');cyl(groups.carriage,GX+66,W/2,285,32,75,'steel','z');cyl(groups.carriage,GX+66,W/2,225,23,65,'gray','z');cyl(groups.carriage,GX+66,W/2,180,10,48,'red','z');
 box(groups.covers,0,0,190,150,W,455,'blue');box(groups.covers,0,110,645,760,W-220,34,'steel');box(groups.covers,140,0,190,L-280,80,425,'blue');box(groups.covers,140,W-80,190,L-280,80,425,'blue');box(groups.covers,L-190,0,190,130,185,425,'blue');box(groups.covers,L-190,W-185,190,130,185,425,'blue');
 box(groups.covers,L-205,W-155,315,65,80,150,'black');box(groups.covers,L-198,W-145,220,55,60,62,'black');box(groups.covers,270,85,610,430,135,190,'black');box(groups.covers,270,W-220,610,430,135,190,'black');
 for(let i=0;i<20;i++){const x=820+i*68;box(groups.chains,x,295,1040,58,120,42,'black');cyl(groups.chains,x+29,300,1050,5,8,'yellow','z');}
 [[2130,300,1085],[2170,300,1140],[2200,300,1205],[2220,300,1275],[2220,300,1350],[2198,300,1420],[2160,300,1480],[2108,300,1520],[2048,300,1538],[1988,300,1522],[1938,300,1482],[1900,300,1425],[1878,300,1355],[1878,300,1280],[1893,300,1210],[1920,300,1150]].forEach(p=>box(groups.chains,p[0],p[1],p[2],66,118,50,'black')); for(let i=0;i<15;i++)box(groups.chains,1420+i*58,860,1048,50,98,32,'black');
 box(groups.control,L-520,W+260,0,245,245,34,'silver');box(groups.control,L-430,W+350,34,64,64,910,'silver');box(groups.control,L-455,W+332,115,115,100,90,'silver');box(groups.control,L-535,W+282,940,260,70,420,'silver');box(groups.control,L-548,W+270,955,286,18,438,'black');cyl(groups.control,L-258,W+320,1125,22,38,'red','y');
 box(groups.details,18,125,310,10,22,260,'green');box(groups.details,18,W-147,310,10,22,260,'green');box(groups.details,350,120,500,230,165,220,'darkblue');box(groups.details,365,105,525,200,18,165,'black');
 const floor=new T.Mesh(new T.PlaneGeometry(9000,7000),new T.MeshStandardMaterial({color:0xd9e1e8,roughness:.95}));floor.rotation.x=-Math.PI/2;floor.position.y=-2;floor.receiveShadow=true;scene.add(floor);
 root.position.set(-L/2,0,-W/2);
 let yaw=-.55,pitch=.16,dist=7200,drag=false,lx=0,ly=0;
 function updateCam(){const tx=0,ty=550,tz=0;camera.position.set(tx+Math.sin(yaw)*Math.cos(pitch)*dist,ty+Math.sin(pitch)*dist,tz+Math.cos(yaw)*Math.cos(pitch)*dist);camera.lookAt(tx,ty,tz);}
 function resize(){const w=Math.max(1,el.clientWidth),h=Math.max(1,el.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 const ro=new ResizeObserver(resize);ro.observe(el);resize();updateCam();
 renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lx=e.clientX;ly=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId);});
 renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-lx,dy=e.clientY-ly;lx=e.clientX;ly=e.clientY;yaw-=dx*.007;pitch=Math.max(-.05,Math.min(.72,pitch+dy*.004));updateCam();});
 renderer.domElement.addEventListener('pointerup',()=>drag=false);renderer.domElement.addEventListener('pointercancel',()=>drag=false);
 renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(3800,Math.min(10500,dist*(e.deltaY>0?1.08:.92)));updateCam();},{passive:false});
 let raf;function animate(){raf=requestAnimationFrame(animate);renderer.render(scene,camera);}animate();
 el.__sahand3d={left(){yaw-=.35;updateCam();},right(){yaw+=.35;updateCam();},reset(){yaw=-.55;pitch=.16;dist=7200;updateCam();},destroy(){cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();}};
}
window.SahandCT0103D={mount};
})();