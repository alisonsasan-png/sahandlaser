import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const params = new URLSearchParams(location.search);
const status = document.getElementById('status');
const poster = document.getElementById('poster');
const buttons = [...document.querySelectorAll('button')];
const messages = {
  fa: ['در حال بارگذاری مدل...', 'نمای ثابت مدل؛ نمایش سه‌بعدی در این مرورگر در دسترس نیست.'],
  en: ['Loading model...', 'Model preview: interactive 3D is unavailable in this browser.'],
  ar: ['جار تحميل النموذج...', 'معاينة النموذج؛ العرض التفاعلي غير متاح في هذا المتصفح.'],
  tr: ['Model yükleniyor...', 'Model önizlemesi: bu tarayıcıda etkileşimli 3B kullanılamıyor.']
}[params.get('lang')] || ['Loading model...', 'Interactive 3D is unavailable.'];
status.textContent = messages[0];
if (params.get('poster')) {
  poster.src = params.get('poster');
  poster.hidden = false;
}
const offsets = {base:[0,0,0],table:[0,.7,0],gantry:[0,1.2,0],carriage:[0,1.65,.2],console:[1,.45,0],cable:[0,1.9,0],light:[-.5,1.1,0],rails:[0,.2,0],fasteners:[0,.12,0],services:[0,1.6,0]};
let renderer;
let visible = true;
let syncRendering = () => {};
addEventListener('message', event => {
  if (event.origin === location.origin && event.source === parent && event.data?.type === 'model-visibility') {
    visible = event.data.visible === true;
    syncRendering();
  }
});
addEventListener('visibilitychange', () => syncRendering());
async function init() {
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth <= 640 ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#edf1f5');
  scene.add(new THREE.HemisphereLight(0xffffff, 0x526271, 2.2));
  for (const [x,y,z,intensity] of [[4,7,5,3.2],[-4,4,1,1.3],[0,5,-5,1.8]]) {
    const light = new THREE.DirectionalLight(0xffffff,intensity);
    light.position.set(x,y,z);
    scene.add(light);
  }
  const camera = new THREE.PerspectiveCamera(35,innerWidth/innerHeight,.01,100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * .49;
  controls.autoRotateSpeed = 1;
  if (!params.get('model')) throw new Error('Missing model');
  const modelUrl = new URL(params.get('model'), location.href);
  if (!['http:', 'https:', 'blob:'].includes(modelUrl.protocol)) throw new Error('Invalid model URL');
  const response = await fetch(modelUrl, {signal: AbortSignal.timeout(45000)});
  if (!response.ok) throw new Error('Model request failed');
  const resourceBase = new URL('.', modelUrl.protocol === 'blob:' ? document.baseURI : modelUrl.href).href;
  const model = (await new GLTFLoader().parseAsync(await response.arrayBuffer(), resourceBase)).scene;
  model.traverse(o => { if(o.isMesh) o.userData.original = o.position.clone(); });
  scene.add(model);
  const explosionOffset = o => {
    const custom = o.userData.explodeOffset;
    return Array.isArray(custom) && custom.length === 3 && custom.every(Number.isFinite) ? custom : offsets[o.name.split('-')[0]];
  };
  let supportsExplode = false;
  model.traverse(o => { if (o.isMesh && explosionOffset(o)?.some(value => value !== 0)) supportsExplode = true; });
  let expanded = false;
  function fit() {
    const sphere = new THREE.Box3().setFromObject(model).getBoundingSphere(new THREE.Sphere());
    const angle = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2)) * Math.min(camera.aspect,1));
    const distance = sphere.radius / Math.sin(angle) * 1.12;
    controls.target.copy(sphere.center);
    camera.position.copy(sphere.center).add(new THREE.Vector3(1,.65,1.2).normalize().multiplyScalar(distance));
    controls.minDistance = sphere.radius * 1.2;
    controls.maxDistance = distance * 3;
    camera.far = distance * 10;
    camera.updateProjectionMatrix();
    controls.update();
  }
  document.getElementById('reset').onclick = fit;
  document.getElementById('rotate').onclick = event => {
    controls.autoRotate = !controls.autoRotate;
    event.currentTarget.setAttribute('aria-pressed', String(controls.autoRotate));
  };
  document.getElementById('explode').onclick = event => {
    expanded = !expanded;
    model.traverse(o => {
      if (!o.isMesh) return;
      o.position.copy(o.userData.original);
      if (expanded) o.position.add(new THREE.Vector3(...(explosionOffset(o) || [0,0,0])));
    });
    event.currentTarget.setAttribute('aria-pressed', String(expanded));
    fit();
  };
  addEventListener('resize', () => {
    camera.aspect = innerWidth/innerHeight;
    renderer.setSize(innerWidth,innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth <= 640 ? 1.5 : 2));
    fit();
  });
  fit();
  document.body.append(renderer.domElement);
  poster.hidden = status.hidden = true;
  buttons.forEach(button => { button.disabled = false; });
  document.getElementById('explode').disabled = !supportsExplode;
  const render = () => {
    controls.update();
    renderer.render(scene,camera);
  };
  syncRendering = () => renderer.setAnimationLoop(visible && !document.hidden ? render : null);
  syncRendering();
  addEventListener('pageshow', () => syncRendering());
  addEventListener('pagehide', event => {
    renderer.setAnimationLoop(null);
    if (event.persisted) return;
    controls.dispose();
    model.traverse(object => {
      object.geometry?.dispose();
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        if (!material) continue;
        for (const value of Object.values(material)) if (value?.isTexture) value.dispose();
        material.dispose();
      }
    });
    renderer.dispose();
  });
}
init().catch(() => {
  renderer?.dispose();
  status.hidden = false;
  status.textContent = messages[1];
});
