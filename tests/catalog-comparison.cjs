const assert=require('node:assert/strict');
const catalog=require('../docs/catalog-completion/catalog-draft.json').products;
const compare=require('../assets/catalog-v2/catalog-comparison.js');
for(const product of catalog){
  const codes=compare.initial(catalog,product.code,()=>0.5);
  if(!product.comparable){assert.deepEqual(codes,[]);continue;}
  assert.equal(codes.length,3);assert.equal(codes[0],product.code);assert.equal(new Set(codes).size,3);
  assert(codes.every(code=>catalog.find(p=>p.code===code).category===product.category));
  assert.deepEqual(Object.keys(compare.values(product)),product.comparisonFields);
}
let codes=compare.initial(catalog,'WELD-1500',()=>0);
for(const p of catalog.filter(p=>p.category==='welding'))codes=compare.add(catalog,codes,p.code);
assert.equal(codes.length,13);assert.equal(compare.add(catalog,codes,codes[0]).length,13);
assert.deepEqual(compare.add(catalog,codes,'CC001'),codes);
assert.deepEqual(compare.add(catalog,codes,'CUT-3015-1'),codes);
const selections=new Set();for(const random of [()=>0,()=>0.5,()=>0.99])selections.add(compare.initial(catalog,'WELD-1500',random).join(','));assert(selections.size>1);
assert.equal(compare.values(catalog.find(p=>p.code==='CUT-3015-1'))['توان'].scope,'supplied_series_options');
assert.equal(compare.values(catalog.find(p=>p.code==='WELD-2000'))['برق ورودی'],null);
console.log('PASS: selected + two distinct random same-category peers, unlimited additions, no component comparisons, and scoped comparison values');

