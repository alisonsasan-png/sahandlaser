import {build} from 'esbuild';

await build({
  entryPoints: ['runtime/product-viewer-source.js'],
  outfile: 'runtime/product-viewer.bundle.js',
  bundle: true,
  minify: true,
  format: 'iife'
});
