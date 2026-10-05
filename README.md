# Sahand Laser — New Website

This branch is the clean rebuild of the new Sahand Laser website.

## Scope
- `sahandlaser.com` is not a runtime dependency and is out of scope unless the user explicitly asks to inspect a specific part.
- The future production site will run on a different domain.
- The `data/` directory is the source of truth.

## Default workflow
`Database -> Build -> Quick Check -> Deploy`

No mandatory multi-agent pipeline, no mandatory Reality Checker chain, and no heavy QA workflow for small changes.

## Recovery
The complete pre-clean repository is preserved on:
`archive/pre-clean-rebuild-2026-10-05`

Pre-clean main commit:
`d7ded4a8d012649b1ac06dcf7d977bc9a9beb10f`
