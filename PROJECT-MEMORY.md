# Sahand Laser Project Memory

## Official operating model
SAHAND LASER AI AGENCY is the official development workflow. Work is preservation-first, database-first, evidence-driven, and deploys only after QA + Reality Check.

## Repository baseline — 2026-10-05
- Repository: `alisonsasan-png/sahandlaser`
- Default branch: `main`
- Site entry: `index.html` (large static SPA)
- Product/data layer: `data/`
- Update modules: `assets/update/`
- 3D source: `assets/3d/`
- QA tooling: `tools/site_qa.py` and `.github/workflows/site-qa.yml`
- Media crawler/inventory tooling exists and WordPress Media Library inventory is already generated.
- AI Agency workflow is active.

## Authoritative data rules
- `data/README.md` declares `Sahand_Laser_Master_Knowledge_Base_v1_6.json` as current master knowledge base.
- `data/product-site-master-v1.json` is the direct site synchronization layer for CT-001..CT-010.
- Database-first and no-guessing policies are active.
- Original media remains immutable; web derivatives are separate.
- Heavy SEO and migration of real product paths remain frozen until product data is stabilized.
- Ambiguous/conflicting data stays pending/review.

## Current media/data state
- Current working archive indexed: 529 images + 5 PDFs from the files supplied in this project session.
- Duplicate analysis exists: exact and near-duplicate groups are tracked.
- Google Drive archive root exists and is organized by machine/components/sources/chillers/welding/marking/articles/documents/review/database/3D.
- WordPress Media Library inventory: 789 original attachments and generated sizes are indexed separately.

## Current product state
- CT-001..CT-004: identities confirmed; current-site specs confirmed; media mapping varies.
- CT-005..CT-008: identities exist; specs/media require final mapping/review; do not guess.
- CT-009 QG-6024DZ: source-confirmed specs; accuracy wording conflict must remain safely worded.
- CT-010: commercial model pending; keep on hold until identity is confirmed.

## 3D state
- Generated visual-web GLB/OBJ packages exist for CT-001..CT-009 and nine provisional variants in the Drive archive.
- These are visual reconstructions, not manufacturing-certified CAD.
- Current site runtime still uses procedural Three.js reconstructions; migration to the generated GLB assets is a planned site-sync step and must only activate verified canonical mappings.
- CT-010 remains held.

## Protected requirements
Preserve existing navigation, languages, themes, forms, comments, downloads, applications, products, product assets and useful existing imagery. Training and Downloads must remain available. Do not move all products to the homepage. Preserve URLs unless an Architect-approved migration exists. Existing WordPress production site `sahandlaser.com` must not be modified during GitHub Pages development.

## 3D policy
- Current FreeCAD visual master: `assets/3d/SahandLaser_FiberCutter_FINAL.FCMacro`
- Legacy CT-010 web reconstruction: `assets/update/ct010-3d.js`
- All current web 3D models must remain explicitly labeled as visual reconstructions until exact CAD/GLB output is verified for engineering use.
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
6. Canonical product 3D pipeline with visual-only disclosure.
7. Reusable 360 / exploded / technical drawing infrastructure.
8. Responsive/mobile fixes.
9. Performance optimization.
10. QA + Reality Check.
11. Base SEO/AEO after data stabilization, while heavy SEO/path migration stays frozen.
12. Final HTML + GitHub + deployment.

## Current checkpoint — 2026-10-05
Work is continuing on branch `work/site-sync-v16-2026-10-05`. A formal checkpoint exists at `checkpoints/2026-10-05-site-sync-v16.md`. The live `main` site must remain unchanged until the branch passes QA + Reality Check and the resulting diff is reviewed.

### Continuation status — repaired v1.6
- The originally committed v1.6 master was not merely mis-encoded; it was truncated near the first component record and contained a corrupted Persian character.
- Recovery was performed conservatively from the complete UTF-8 v1.5 master plus only the already-recorded v1.6 deltas: CT-001..CT-010 media mappings, 3D metadata, schema version and the site-update policy flag.
- The recovery workflow verifies that verification state, Drive archive, component catalog, welding families, media summary, source URLs and open issues remain byte-for-byte equivalent at the parsed JSON data level to v1.5.
- Rebuilt v1.6 JSON validation, semantic reconstruction checks, scoped runtime patching and JavaScript syntax checks passed in the repair workflow.
- Full repository QA + independent Reality Check is the next release gate before any PR or merge to `main`.
