const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const products = {window: {SAHAND_PRODUCTS: {}}};
vm.createContext(products);
for (const code of ['CT-001', 'CT-010']) {
  vm.runInContext(fs.readFileSync(`data/products/${code}.js`, 'utf8'), products);
  const product = products.window.SAHAND_PRODUCTS[code];
  const paths = new Set([
    ...product.media.images, ...product.media.frames360,
    product.media.technical, product.media.exploded, product.media.model,
    product.media.modelPreview, ...(product.downloads || []).map(file => file.path)
  ].filter(Boolean));
  for (const path of paths) {
    assert.ok(fs.existsSync(path), `Missing ${path}`);
    const bytes = fs.readFileSync(path);
    assert.ok(bytes.length > 100, `Empty ${path}`);
    if (path.endsWith('.pdf')) assert.equal(bytes.toString('ascii', 0, 5), '%PDF-');
    if (path.endsWith('.webp')) {
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
      assert.equal(bytes.readUInt32LE(4) + 8, bytes.length);
    }
    if (path.endsWith('.glb')) {
      assert.equal(bytes.toString('ascii', 0, 4), 'glTF');
      assert.equal(bytes.readUInt32LE(4), 2);
      assert.equal(bytes.readUInt32LE(8), bytes.length);
      const jsonLength = bytes.readUInt32LE(12);
      assert.equal(bytes.readUInt32LE(16), 0x4e4f534a);
      const model = JSON.parse(bytes.subarray(20, 20 + jsonLength).toString());
      assert.ok(model.meshes.length && model.nodes.length);
      assert.ok(model.buffers.every(buffer => !buffer.uri), 'GLB should contain its buffers');
      console.log(`${code}: GLB v2, ${model.nodes.length} nodes, ${model.meshes.length} meshes`);
    }
  }
  console.log(`${code}: ${paths.size} referenced product files passed structural checks`);
}
const html = fs.readFileSync('index.html', 'utf8');
for (const [, url] of html.matchAll(/<script[^>]+src="([^"?#]+)[^\"]*"/g)) {
  if (/^https?:/.test(url)) continue;
  assert.ok(fs.existsSync(url), `Missing script ${url}`);
}
console.log('All local script references in index.html exist');
