# Sahand Laser — Full Repository & Site Audit

Date: 2026-10-04
Branch: `work/full-roadmap-2026-10-04`
Policy: preservation-first / database-first / no guessing

## Executive result
The current repository is **not a destroyed/rebuilt blank site**. The preserved static SPA structure is present and the major requested sections still exist. The safest path is incremental repair rather than another rewrite.

## What is healthy and must be preserved
- `index.html` keeps the original-style multi-section SPA architecture.
- Home shows **product categories**, not every product card; the full catalog is on the Products view.
- Routes exist for Home, About, Products, Services, Applications, Projects, Training, Downloads, Contact and Product.
- Training and Downloads are explicitly linked from Home/quick access and routing.
- Four languages are implemented: Persian, English, Arabic and Turkish; the translation completion patch exists.
- Dark/light + multiple color themes remain.
- Product detail view, inquiry actions, comments UI, contact actions and social links remain.
- Product media inventory and WordPress Media Library inventory exist under `data/`.
- Base SEO metadata, canonical, OG metadata and Organization schema already exist.
- Responsive rules exist for core layout, timeline and product viewer.

## Critical issues found
### 1. Data source drift
`data/product-site-master-v1.json` still names master database v1.3 while the repository already contains v1.5. `data/README.md` and `PROJECT-MEMORY.md` also referenced v1.3 before this roadmap branch.

**Action:** promote v1.5 everywhere and keep the direct site layer synchronized.

### 2. 360° logic can misclassify normal gallery photos
The base `renderProduct()` considers a product to have 360° whenever `p.images` contains more than one real image. CT-002 currently has multiple ordinary product photos in `images`, so unrelated angles can behave like 360 frames.

**Action:** only enable true 360 when explicit verified 360 frame assets are present in the synchronized database. Ordinary gallery images remain a gallery.

### 3. CT-010 3D exists but is hidden by the organizer
`site-update-core.js` can build and mount the CT-010 interactive Three.js visual model, but `cutting-product-organizer.js` removes `#sahand-special-media` and `#sahand-3d-section` for CT-010. The two update modules therefore conflict.

**Action:** keep the 3D visual viewer visible but label it clearly as a **visual reconstruction**, not manufacturing-certified CAD. Remove fake/static 360/exploded claims until verified assets exist.

### 4. 360 / Exploded / Drawing infrastructure is mixed with placeholders
The project has placeholder/static media modules, but no reusable product-specific verified asset contract for 360 frames, exploded images and technical drawings.

**Action:** add a reusable asset-viewer layer that renders only `verified` assets from the database and otherwise shows status only.

### 5. Media mapping is incomplete for CT-005..CT-008
Identity exists, but final photo/spec mapping is still review/pending. This is a data issue, not a UI issue.

**Action:** do not invent; retain review state and continue product-to-media evidence mapping.

## Medium issues
- `index.html` is large (~488 KB) and contains substantial inline CSS/JS.
- Tailwind is loaded via runtime CDN; Font Awesome and Vazirmatn are CDN dependencies.
- Many product images still load from the WordPress domain. They work as preservation references, but production should later use controlled static assets.
- Three.js is loaded dynamically from CDN only when CT-010 viewer is requested, which is acceptable for now but should eventually be pinned/self-hosted for production.
- Downloads include items whose direct URL is still unregistered; the UI already marks these rather than inventing links.
- Static GitHub Pages comments are browser-local unless a backend is later introduced; current UI should not be described as centrally persisted reviews.

## SEO/AEO status
Base SEO is already present and should be preserved. Heavy SEO and conversion from `#product=...` to crawlable product paths remains intentionally frozen until product data and media mapping are stable.

## Release gates for this roadmap
1. v1.5 is authoritative.
2. Product data layer only publishes confirmed fields.
3. True 360 requires explicit verified frame arrays.
4. CT-010 3D is labeled visual-only and gains touch zoom/rotation.
5. 360/exploded/drawing viewer infrastructure renders only verified assets.
6. Training/Downloads/routes/forms/languages remain intact.
7. QA must pass with zero critical errors.
8. Reality Check must confirm no unrelated redesign and no loss of existing sections.

## Protected / do not change in this pass
- Current WordPress production site `sahandlaser.com`.
- Heavy SEO architecture and product URL migration.
- Unverified CT-005..CT-008 specifications/media.
- Any product-specific 360, technical drawing or exploded asset that has not been verified.
