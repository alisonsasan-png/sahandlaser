# Data — Active Clean Rebuild

Active factual source: `Sahand_Laser_Master_Knowledge_Base_v1_6.json`.
Website projection: `product-site-master-v1.json`.
Approved product-page design reference: `product-page-layout-revisions.json`.
Current project behavior is defined by `project-runtime-policy-v2.json`.

Rules:
- `sahandlaser.com` is out of scope unless the user explicitly asks to inspect a specific part.
- Legacy URLs inside historical records are reference-only, never runtime dependencies.
- Do not guess pending/review records.
- No mandatory 14-agent pipeline, Reality Checker chain, or Heretic benchmark gate.
- Default flow: Database -> Build -> Quick Check -> Deploy.

The complete pre-clean repository is recoverable from `archive/pre-clean-rebuild-2026-10-05`.
