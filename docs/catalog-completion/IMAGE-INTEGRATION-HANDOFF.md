# Image integration reconciliation

This is partial work, not catalog completion. Read `image-decisions.json` and
`status/image-reconciliation.json` for current counts. Do not trust inherited
`visualReview: true` flags without checking the source and generated image.

## Implemented

- A shared, synchronous media adapter runs before the existing product runtime.
- It also reapplies after preview-specific records are created, preserving old galleries.
- Exact reviewed cutting records are supplied where the old preview omitted them.
- Legacy cutting placeholders are replaced only when an explicitly reviewed image exists.
- Exact-model taxonomy buttons use the reviewed record, not the conflicting legacy alias.
- Preview 5's embedded catalog is updated before parsing; previews 3, 4 and 12–28
  use the runtime adapter. Main uses the adapter; preview 2 embeds main.
- Animation/X-ray demonstration previews 6–11 were not replaced with unrelated photos.
- No X-ray accuracy claim is made by this exterior-image work.

## Important discrepancies

- Local files and deployed files differ materially. Local product text contains
  mojibake where the corresponding deployed file can be correct. Never republish
  the entire local tree blindly. Published preview changes in this work were
  applied to freshly fetched remote contents, preserving remote-only functionality.
- Local full-browser test exposed a pre-existing catalog initialization failure.
  Do not report a local full regression pass.
- Five initial images passed the live browser test. The seven-image revision
  passed the staged browser test on all 20 catalog previews. Staged means the
  newest adapter was intercepted from disk; this does NOT prove Pages deployment.
- Subsequently, Pages run 38358554728 completed successfully and the full
  seven-image test passed with `--live` and `staged:false` across previews
  3, 4, 5 and 12–28. The image report also loaded 106 records with UTF-8.
- Generated CC003 reverses front control placement relative to supplied artwork.
- Several welding subtypes were assigned the same handheld cabinet despite
  being robotic, jewelry, channel-letter, or QCW models; those are held.
- CT-006 is named SH6020R with rotary in the legacy data, so it must not be used
  as an unquestioned alias for plain two-table DZ6020.

## Reproduction

Run `scripts/reconcile-product-images.cjs` after making explicit review decisions.
It writes the adapter and audit report and adds a script reference to known consumers.
Run `tests/reviewed-images.cjs --live` for actual deployed checks;
`--live --staged` validates a local adapter against current live pages only.
Publication must preserve UTF-8, remote changes, and actual report timestamps.

## Remaining

Continue source-by-source review, resolve held mismatches, and integrate the remaining
product photos. Then perform the user's requested separate configuration-first
taxonomy preview, annotated preview index, report timestamp audit and encoding audit.
Do not mark the wider project complete based on seven matched images.