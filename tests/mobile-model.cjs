const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const output = process.env.MODEL_TEST_OUTPUT || 'test-results';
fs.mkdirSync(output, {recursive:true});

(async () => {
  const browser = await chromium.launch({headless:true, args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  try {
    for (const width of [360,390,640,1280]) {
      for (const code of ['CT-001','CT-010']) {
        const page = await browser.newPage({viewport:{width,height:900}});
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const modelRequests = [];
        page.on('request', request => { if(request.url().endsWith('.glb')) modelRequests.push(request.url()); });
        await page.goto(`http://127.0.0.1:8765/#product=${code}`);
        const stage = page.locator('#model-stage');
        await stage.waitFor();
        await stage.scrollIntoViewIfNeeded();
        if (width <= 640) {
          assert.equal(modelRequests.length,0,'Mobile must not load GLB before activation');
          await page.locator('.model-start').click();
        }
        const iframe = page.frameLocator('.product-model-frame');
        await iframe.locator('#reset:not([disabled])').waitFor({state:'attached',timeout:30000});
        const canvas = iframe.locator('canvas');
        assert.equal(await canvas.count(),1);
        const capture = await canvas.screenshot();
        const pixels = await page.evaluate(async encoded => {
          const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
          const bitmap = await createImageBitmap(new Blob([bytes], {type:'image/png'}));
          const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
          const context = canvas.getContext('2d');
          context.drawImage(bitmap,0,0);
          const colors = new Set();
          for(let x=1;x<10;x++) for(let y=1;y<10;y++) {
            colors.add([...context.getImageData(Math.floor(canvas.width*x/10),Math.floor(canvas.height*y/10),1,1).data].join(','));
          }
          bitmap.close();
          return colors.size;
        }, capture.toString('base64'));
        assert.ok(pixels>1,`Nonblank model canvas: ${pixels}`);
        const stageBox = await stage.boundingBox();
        const toolbarBox = await page.locator('#product-model .model-toolbar').boundingBox();
        assert.ok(toolbarBox.y >= stageBox.y+stageBox.height-1,'Controls must be below model');
        assert.ok(stageBox.x>=0 && stageBox.x+stageBox.width<=width+1,'Viewer must fit screen');
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth+1),'Page must not overflow horizontally');
        assert.equal(await iframe.locator('aside').count(),0,'No overlay panel may cover the model');
        const explode = page.locator('[data-model-explode]');
        await explode.click();
        assert.equal(await explode.getAttribute('aria-pressed'),'true');
        await explode.click();
        const rotate = page.locator('[data-model-rotate]');
        await rotate.click();
        assert.equal(await rotate.getAttribute('aria-pressed'),'true');
        const before = await canvas.screenshot();
        await canvas.evaluate(() => new Promise(resolve => {
          let frames=0;
          const tick=()=>++frames>=30 ? resolve() : requestAnimationFrame(tick);
          requestAnimationFrame(tick);
        }));
        const after = await canvas.screenshot();
        assert.ok(!before.equals(after),'Auto-rotation must visibly move the model');
        await rotate.click();
        await page.screenshot({path:path.join(output,`model-${code}-${width}.png`)});
        assert.deepEqual(errors,[],'No page JavaScript errors');
        console.log(`${code} at ${width}px: tap loading, canvas (${pixels} colors), layout and controls passed`);
        await page.close();
      }
    }
    const page = await browser.newPage({viewport:{width:390,height:900}});
    await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = () => null; });
    await page.goto('http://127.0.0.1:8765/#product=CT-001');
    await page.locator('.model-start').click();
    const frame = page.frameLocator('.product-model-frame');
    await frame.locator('#status').filter({hasText:'در دسترس نیست'}).waitFor();
    assert.equal(await frame.locator('#poster').isVisible(),true);
    assert.equal(await page.locator('[data-model-reset]').isDisabled(),true);
    console.log('No WebGL: visible poster, error status and disabled controls passed');
    await page.close();
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode=1; });
