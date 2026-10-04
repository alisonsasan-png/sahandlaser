# Sahand Laser Project Memory

## Official operating model
SAHAND LASER AI AGENCY is the official development workflow. Work is preservation-first, database-first, evidence-driven, and deploys only after QA + Reality Check.

## Repository baseline — 2026-10-04
- Repository: alisonsasan-png/sahandlaser
- Default branch: main
- Site entry: index.html (large static HTML)
- Product/data layer: data/
- Update modules: assets/update/
- 3D source: assets/3d/
- QA tooling: tools/site_qa.py and .github/workflows/site-qa.yml
- Media crawler/inventory tooling already exists.

## Authoritative data rules
- data/README.md declares Sahand_Laser_Master_Knowledge_Base_v1_3.json as master knowledge base.
- data/product-site-master-v1.json is the direct site synchronization layer for CT-001..CT-010.
- Database-first and no-guessing policies are active.
- Heavy SEO and migration of real product paths remain frozen until product data is stabilized.
- Ambiguous/conflicting data stays pending/review.

## Current product state
- CT-001..CT-004: identities confirmed; current-site specs confirmed; media mapping varies.
- CT-005..CT-008: identities exist; specs/media need review/final mapping.
- CT-009 QG-6024DZ: source-confirmed specs; accuracy wording conflict must remain safely worded.
- CT-010: commercial model pending; current WebGL reconstruction is visual only and requires revision. It is not manufacturing-certified.

## Protected requirements
Preserve existing navigation, languages, themes, forms, comments, downloads, applications, products, product assets and useful existing imagery. Training and Downloads must remain available. Do not move all products to the homepage. Preserve URLs unless an Architect-approved migration exists.

## 3D policy
- Current FreeCAD visual master: assets/3d/SahandLaser_FiberCutter_FINAL.FCMacro
- Current CT-010 web reconstruction: assets/update/ct010-3d.js
- Web model must match the approved real/CAD reference closely before publication.
- Viewer must support desktop mouse and mobile touch rotation, zoom, reset and responsive operation.
- 360, exploded view and technical drawing assets are product-specific and cannot be guessed or reused as if verified.

## Change policy summary
Small request = small patch. No unrelated redesign/rebuild. Back up or preserve data before migrations. Never replace verified product information with placeholders.

## Current priorities
1. Stabilize/preserve original site structure.
2. Verify products, old images, Training and Downloads.
3. Complete product-to-media mapping.
4. Repair/upgrade CT-010 3D pipeline and viewer.
5. Add verified 360 / exploded / technical drawings product by product.
6. Mobile/performance QA.
7. Resume SEO/AEO only after product/data stabilization.
8. Deploy only after QA + Reality Check.
