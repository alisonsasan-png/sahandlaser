# Sahand Laser Project Memory

## Official operating model
SAHAND LASER AI AGENCY is the official development workflow. Work is preservation-first, database-first, evidence-driven, and deploys only after QA + Reality Check.

## Repository baseline — 2026-10-04
- Repository: `alisonsasan-png/sahandlaser`
- Default branch: `main`
- Site entry: `index.html` (large static SPA)
- Product/data layer: `data/`
- Update modules: `assets/update/`
- 3D source: `assets/3d/`
- QA tooling: `tools/site_qa.py` and `.github/workflows/site-qa.yml`
- Media crawler/inventory tooling exists and WordPress Media Library inventory is already generated.
- PR #6 (AI Agency workflow) is merged.

## Authoritative data rules
- `data/README.md` declares `Sahand_Laser_Master_Knowledge_Base_v1_5.json` as current master knowledge base.
- `data/product-site-master-v1.json` is the direct site synchronization layer for CT-001..CT-010.
- Database-first and no-guessing policies are active.
- Original media remains immutable; web derivatives are separate.
- Heavy SEO and migration of real product paths remain frozen until product data is stabilized.
- Ambiguous/conflicting data stays pending/review.

## Current media/data state
- Current working archive indexed: 529 images + 5 PDFs from the files supplied in this project session.
- Duplicate analysis exists: exact and near-duplicate groups are tracked.
- Google Drive archive root exists and is organized by machine/components/sources/chillers/welding/marking/articles/documents/review.
- WordPress Media Library inventory: 789 original attachments and generated sizes are indexed separately.

## Current product state
- CT-001..CT-004: identities confirmed; current-site specs confirmed; media mapping varies.
- CT-005..CT-008: identities exist; specs/media require final mapping/review; do not guess.
- CT-009 QG-6024DZ: source-confirmed specs; accuracy wording conflict must remain safely worded.
- CT-010: commercial model pending; FreeCAD macro is a visual reference master, not manufacturing-certified. The WebGL model is a procedural reconstruction based on that geometry and remains visual-only.

## Protected requirements
Preserve existing navigation, languages, themes, forms, comments, downloads, applications, products, product assets and useful existing imagery. Training and Downloads must remain available. Do not move all products to the homepage. Preserve URLs unless an Architect-approved migration exists. Existing WordPress production site `sahandlaser.com` must not be modified during GitHub Pages development.

## 3D policy
- Current FreeCAD visual master: `assets/3d/SahandLaser_FiberCutter_FINAL.FCMacro`
- Current CT-010 web reconstruction: `assets/update/ct010-3d.js`
- The web model must remain explicitly labeled as a visual reconstruction until exact CAD/GLB output is verified.
- Viewer must support desktop mouse and mobile touch rotation, zoom, reset and responsive operation.
- 360, exploded view and technical drawing assets are product-specific and cannot be guessed or reused as if verified.

## Media policy
- Originals are archived unchanged.
- Site versions may be resized/converted and receive a small Sahand Laser logo when appropriate.
- Old embedded phone numbers/site URLs should not be treated as required content on site images; remove/crop only in derivative versions where needed.
- Never overwrite an original merely to add branding.

## Change policy summary
Small request = small patch. No unrelated redesign/rebuild. Back up or preserve data before migrations. Never replace verified product information with placeholders.

## Approved roadmap — blanket approval 2026-10-04
The user approved continuous execution without intermediate approval for:
1. Agency finalization.
2. Full repository/site audit.
3. Database/product reconciliation.
4. Restore/preserve site structure.
5. Product pages + real media.
6. CT-010 3D first, then repeatable pipeline.
7. Reusable 360 / exploded / technical drawing infrastructure.
8. Responsive/mobile fixes.
9. Performance optimization.
10. QA + Reality Check.
11. Base SEO/AEO after data stabilization, while heavy SEO/path migration stays frozen.
12. Final HTML + GitHub + deployment.

If a decision genuinely requires the user, mark it Pending and continue with unrelated work.
