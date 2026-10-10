const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

const products = {window: {SAHAND_PRODUCTS: {}}};
vm.createContext(products);
for (const code of ['CT-001', 'CT-010']) {
  vm.runInContext(fs.readFileSync(`data/products/${code}.js`, 'utf8'), products);
  const frames = products.window.SAHAND_PRODUCTS[code].media.frames360;
  assert.equal(frames.length, 12);
  const hashes = new Set();
  frames.forEach((path, index) => {
    assert.ok(path.endsWith(`frame-${String(index * 30).padStart(3, '0')}.webp`));
    const bytes = fs.readFileSync(path);
    assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
    assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    hashes.add(crypto.createHash('sha256').update(bytes).digest('hex'));
  });
  assert.equal(hashes.size, 12, `${code}: duplicate frames`);
  console.log(`${code}: 12 distinct WebP files, ordered 0 through 330`);
}

class Element extends EventTarget {
  constructor(dataset = {}) {
    super();
    this.dataset = dataset;
    this.style = {};
    const values = new Set();
    this.classList = {
      add: (...items) => items.forEach(item => values.add(item)),
      remove: (...items) => items.forEach(item => values.delete(item)),
      toggle: (item, on) => on ? values.add(item) : values.delete(item),
      contains: item => values.has(item)
    };
  }
}
const images = Array.from({length: 12}, (_, index) => new Element({angle: String(index * 30), src: `frame-${index}.webp`}));
const thumbs = images.map((_, index) => new Element({index: String(index)}));
const viewer = new Element();
viewer.querySelectorAll = () => images;
const counter = new Element();
const progress = new Element();
const document = new Element();
document.getElementById = id => ({'spin-viewer': viewer, 'spin-counter': counter, 'spin-progress': progress})[id];
document.querySelectorAll = () => thumbs;
const context = vm.createContext({document, AbortController, viewerController: null});
const source = fs.readFileSync('runtime/app.js', 'utf8');
const begin = source.indexOf('function initViewer()');
const end = source.indexOf('// [TABS]', begin);
vm.runInContext(source.slice(begin, end), context);
context.initViewer();
const emit = (target, type, data = {}) => target.dispatchEvent(Object.assign(new Event(type), data));
const active = index => {
  assert.equal(images.filter(image => image.classList.contains('active')).length, 1);
  assert.ok(images[index].classList.contains('active'));
  assert.equal(counter.textContent, `${index * 30}° · ${index + 1} / 12`);
};
active(0);
assert.equal(images[0].src, 'frame-0.webp');
assert.equal(images[1].src, 'frame-1.webp');
assert.equal(images[11].src, 'frame-11.webp');
assert.equal(images[5].src, undefined, 'Unselected distant frame must remain deferred');
emit(thumbs[11], 'click');
active(11);
emit(viewer, 'mousedown', {clientX: 0});
emit(document, 'mousemove', {clientX: 80});
active(0);
emit(document, 'mouseup');
emit(viewer, 'touchstart', {touches: [{clientX: 100}]});
emit(viewer, 'touchmove', {touches: [{clientX: 20}]});
active(11);
emit(viewer, 'touchend');
emit(viewer, 'keydown', {key: 'Home'});
active(0);
emit(viewer, 'keydown', {key: 'ArrowLeft'});
active(11);
emit(viewer, 'keydown', {key: 'ArrowRight'});
active(0);
emit(viewer, 'keydown', {key: 'End'});
active(11);
context.viewerController.abort();
emit(thumbs[5], 'click');
active(11);
console.log('Viewer: thumbnail selection, mouse/touch wraparound and listener disposal passed');
