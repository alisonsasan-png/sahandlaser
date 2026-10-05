# Sahand Laser Overnight Status - 2026-10-06

## GitHub Pages repair

Result: fixed and verified.

What changed:

- Removed the redundant `.github/workflows/pages.yml` workflow that was conflicting with the normal GitHub Pages branch deployment.
- Kept the standard GitHub Pages deployment from `main` / repository root.
- Kept `.nojekyll` in place.
- Added this report and README for project traceability.

Verification:

- GitHub Pages workflow run after the fix completed successfully.
- Build job: success.
- Deploy job: success.
- Report-build-status job: success.
- Public URL returned `HTTP/2 200`:
  - https://alisonsasan-png.github.io/sahandlaser/
- Core published files returned `HTTP/2 200`:
  - `/index.html`
  - `/styles/site.css`
  - `/runtime/app.js`
  - `/site-config.js`
- Browser render check opened the page successfully and showed the live Sahand Laser preview with navigation, hero, products, training, downloads, and contact sections.

## Repository snapshot

Current visible project structure:

- `index.html`
- `site-config.js`
- `robots.txt`
- `styles/site.css`
- `runtime/app.js`
- `runtime/model-viewer.js`
- `data/products/*.js`
- `.nojekyll`
- `README.md`

No production domain was changed. The current live `sahandlaser.com` website was not modified.

## Product data audit

Current catalog count: 93 products.

Products by category:

| Category | Count |
|---|---:|
| Cutting | 9 |
| Welding | 13 |
| Marking | 9 |
| Cleaning | 5 |
| Sources | 12 |
| Controllers / Heads | 17 |
| Chillers / Parts | 13 |
| Consumables | 15 |

Asset coverage from current product files:

| Asset type | Products with asset | Products missing asset |
|---|---:|---:|
| Product image | 33 | 60 |
| 3D model | 9 | 84 |
| 360 frames | 0 | 93 |
| Technical drawing | 0 | 93 |
| Exploded view | 0 | 93 |
| Work/sample images | 0 | 93 |

3D models currently registered:

| Product | Model file |
|---|---|
| CT-001 | `products/CT-001/models/9bac35231846.glb` |
| CT-002 | `products/CT-002/models/ec02215f28f4.glb` |
| CT-003 | `products/CT-003/models/098d8d35e383.glb` |
| CT-004 | `products/CT-004/models/7aa768622513.glb` |
| CT-005 | `products/CT-005/models/75a8ef234e5b.glb` |
| CT-006 | `products/CT-006/models/09c599e85368.glb` |
| CT-007 | `products/CT-007/models/99abdf4f3251.glb` |
| CT-008 | `products/CT-008/models/9dd2c4a8bc79.glb` |
| CT-009 | `products/CT-009/models/e80b3a7d83a6.glb` |

Important limitation: the current registered 3D models cover the cutting-machine family only. Per the user's instruction, future 3D files must be product-specific and visually matched to the actual product photos; generic or repeated models should not be treated as final.

## Required asset package per product

For each product with enough visual references, the final package should include:

- High-quality product image.
- Clean banner using only the product/device image and Sahand Laser branding.
- 12 separate 360-degree frames: 0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330.
- Technical drawing image with dimensions and view labels.
- Exploded view image.
- Accurate product-specific 3D model.
- Product-page text for contact info, technical specs, dimensions, features, and CTA. These must not be baked into banner images.

## Priority order for next work

1. Keep GitHub Pages as the evaluation target and verify it after every meaningful commit.
2. Do not delete old/user files until explicit morning confirmation.
3. Start asset completion with products that already have images and/or 3D models, especially `CT-001` through `CT-009`.
4. For the user-provided chiller examples, create the product-page asset plan first: clean banner, technical drawing, 12-frame 360 split, exploded view, and accurate 3D model target.
5. Add assets only when they are product-specific and clearly traceable to reference images.
6. Keep contact info/specs/features as HTML/product data, not inside banner images.

## GitHub commits from this repair run

- `aeacf11` - removed redundant Pages workflow blocking preview.
- `7400dca` - added README with preview/status.
- This report commit adds the overnight status and asset audit.
