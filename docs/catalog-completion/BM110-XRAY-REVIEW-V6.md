# BM110 interactive cutaway — source review V6

## What changed

The public review widget now uses `assets/catalog-v2/CP-RAY-BM110/xray-source-v6.svg`, a source-backed functional cutaway over the actual BM110 exterior reference. It replaces the generic AI cutaway as the default interactive layer. The former raster remains preserved as an earlier visual candidate and is no longer presented as the primary view.

## Manufacturer evidence

RayTools BM110 Series 3.3 kW Auto Focus Laser Cutting Head User Manual V2.0, official Empower/RayTools-hosted PDF:

- PDF page 6, sections 1.1–1.2: 3.3 kW maximum fiber input, D30 compound lens, QBH interface, collimation and focus modules, focus drive, cover-glass module, and nozzle module.
- PDF page 6: external servo motor and internal drive units; automatic focus-lens movement within 22 mm.
- PDF pages 19–20, sections 5.2.2–5.2.4: middle cover-glass, collimation lens assembly, and focus lens assembly service diagrams.
- PDF page 26, section 6.3.4: upper cover glass D24.9 × 1.5 mm, part 211LCG0020; middle and bottom cover glasses D27.9 × 4.1 mm, part 211LCG0037.

Source: <https://www.empower.cn/uploads/upload/20250208/User%20Manual-BM110_3.3KW%20Auto%20Focus%20Laser%20Cutting%20Head_2023.11.pdf>

## Accuracy boundary

The shown component order and cover-glass specifications are documented. The optical module placement, spacing, lens silhouettes, exact drive mechanism, retaining-barrel geometry, cooling passages, and installed factory revision are not established by this illustration. The visual is explicitly marked “not to scale” and “not an assembly drawing”; `visualComplete` remains false until those model/version-specific details are documented.

## Interaction and verification

The status catalog compares the real exterior photo with the source-based cutaway using pointer, touch, and range input; a button switches to the simplified optical schematic. SVG XML and linked relative asset paths are checked locally. No real-browser test is claimed because no browser runtime is installed in this workspace.

