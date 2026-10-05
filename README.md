# Sahand Laser Preview

This repository contains the GitHub Pages preview build for the new Sahand Laser website.

## Live preview

- GitHub Pages: https://alisonsasan-png.github.io/sahandlaser/
- Repository: https://github.com/alisonsasan-png/sahandlaser

## Current status

- GitHub Pages is configured from `main` / repository root.
- `index.html`, `styles/site.css`, `runtime/app.js`, and `site-config.js` are published from the root build.
- This preview is separate from the current production website and must not be treated as production.
- The current live Sahand Laser website remains unchanged.

## Asset rules

Product pages are structured for:

- product images
- 12-frame 360 views
- technical drawings
- exploded views
- product-specific 3D models

Banner-style images must not contain phone numbers, website addresses, contact info, technical specs, or feature bullet lists. Those details belong in the product page content, not baked into images.

## Latest repair

GitHub Pages was returning 404 because a redundant Pages workflow conflicted with the standard branch-based Pages deployment. The redundant workflow was removed, and the standard GitHub Pages deployment completed successfully.
