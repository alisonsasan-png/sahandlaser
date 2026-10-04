# SAHAND LASER — Agency Project Board

This file defines the canonical workflow for the Sahand Laser Agency. GitHub Issues are the task records. A GitHub Project board, when enabled for the account/repository, should mirror these stages.

## Workflow
1. **Backlog** — accepted work not started.
2. **Architect Review** — scope, preservation impact and implementation path reviewed.
3. **Database / Data** — product identity, media, specs and evidence verified.
4. **Development** — frontend/integration implementation.
5. **3D / Content** — CAD/WebGL/360/drawing/content asset work.
6. **QA** — automated and manual validation.
7. **Reality Check** — independent evidence check; no guessed claims/assets.
8. **Ready to Deploy** — QA and Reality Check passed.
9. **Done** — merged/deployed and documented.

## Agency ownership
Project Lead → Architect → Product Data/Database → Frontend/UI-UX/Industrial 3D/Technical Content → SEO/AEO & Performance → QA → Visual Evidence → Reality Checker → Git Workflow → Deploy.

## Required issue fields
Every task should record: scope, affected product/page, owner/agent, evidence/source, acceptance criteria, current workflow stage, dependencies, and deploy status.

## Release gate
No task reaches **Ready to Deploy** when it contains guessed technical specifications, unverified product-media mappings, fake 360/drawings/exploded assets, unresolved blocking QA errors, or an unreviewed destructive change.

## Initial board backlog
- CT-005..CT-009: final verified media-to-product mapping.
- CT-010: exact CAD/GLB pipeline after approved source geometry exists.
- Product-specific real 360 frame sets.
- Product-specific verified technical drawings.
- Product-specific verified exploded-view assets.
- Replace Tailwind runtime CDN in the production hardening pass.
- Decide on a durable comments backend if public comments are required.
- Controlled migration from hash product routes to crawlable product URLs after product data is stable.

## Preservation rule
Existing structure, content, assets, URLs and working behavior are protected. Make minimal scoped changes and never rebuild the site merely to satisfy a task-management change.
