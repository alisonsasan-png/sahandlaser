# Evidence log

## Provided files

- `user-product-documents.json`: extracted paragraph-by-paragraph from three supplied DOCX files (standard single table, professional single table, standard tube cutter). SHA-256 retained. Series specifications and selectable brands must remain series specifications; they do not establish each installed component in every DZ/LD variant.
- `local-library-index.json`: relevant product/media folders only; financial receipts excluded. 851 images found in the first completed scan. Hash deduplication does not establish model identity.
- `base-products.json`: 106 products from the independent Preview 5, including 18 exact named 3015/6020 variants and three other cutting groups. Original 95 records remain untouched.

## Manufacturer documents inspected

- BOCI BLT310 Product Manual, V1.0: https://d.fscut.com/wordpress-fscut/2024/03/BLT310-Proudct-Manul-V1.0.pdf — 25 PDF pages. Product interfaces on PDF page 4, product-structure schematic on page 19, variant-specific mechanical drawings on pages 22–25. QBH/EOC and 150/200 versions must not be mixed. This proves the head structure, not the whole-machine internal layout.
- Friendess FSCUT2000E installation manual, V1.0 (230309): https://d.fscut.com/wordpress-fscut/2020/05/FSCUT2000E-Installation-User-ManualV1.0-230309.pdf — 33 PDF pages. BMC228A/BCL4566E variant. The current manufacturer page https://www.bochu.com/pro_ch/fscut2000e/ instead lists BMC228B; preserve revision applicability.
- TEYU CWFL-2000: https://www.teyuchiller.com/water-chiller-cwfl2000-for2kw-fiber-laser-metal-cutter-welder.html — current ANPTY/BNPTY variants. Values for tank, dimensions or refrigerant must not be transferred to older units solely because CWFL-2000 appears in both names.
- SMC IO-Link special version: https://www.smcworld.com/upfiles/pgpdf/SP175X-006E-ITV.pdf — X395-specific four-page document. Not evidence that the supplied ITV1050/2050 are IO-Link variants.

## Leads, not yet usable as exact evidence

- https://en.raycuslaser.com/upload/20230829/1h904sf6b1esb5q3o.pdf — HP-series manual found in official search results; browser fetch timed out. Do not mark contents inspected until successfully retrieved.
- Exact DZ3015S/DZ3015H/DZ6020 and LD variant searches have not yet yielded model-specific assembly drawings. Similar LD3015 results include unrelated CO2 machines and loading equipment; excluded.
- https://www.laserdz.com — Dazhan supplier lead; not retrieved successfully in the browser search tool. Do not infer a working manufacturer CAD download.

## Prepared first image

`assets/catalog-v2/single-standard/studio-v1.png` is an AI-assisted white-background reconstruction of the supplied `20250217_101004.jpg`, not a technical drawing. Original kept as `reference.jpg`. Generated with the built-in image tool; prompt requested unchanged machine geometry, gantry, nozzle, cable chains, table, fascia, drawers, feet, separate console and original branding. Visual inspection completed. Do not attach it to an LD model or a cabinet/dual-table variant without identity evidence.

## Not complete

The catalog/media acceptance gate is not passed. No new independent preview is claimed ready. In particular, technical assemblies, missing model photographs, all per-model parameters, and browser QA remain open.

## Reconciliation and reviewed assets

- Master database v1.6 was read from the connected Drive library, file `Sahand_Laser_Database_v1_6.xlsx`. Only relevant cutting, component and welding-family records were copied into `master-records.json`; the complete private workbook/media listing is not published. Forty-two component/equipment records and ten welding families were found. Historical verification status is retained as evidence history, not treated as a new verification of exact installed variants.
- BM110 official V2.0 was successfully inspected at https://www.empower.cn/uploads/upload/20250208/User%20Manual-BM110_3.3KW%20Auto%20Focus%20Laser%20Cutting%20Head_2023.11.pdf . It confirms automatic focus, unlike the old promotional image's “Manual” line. Physical structure and variant dimensions are on printed page 19 (PDF page 24). The CL100/FL155 reference height is 419 mm. Supplier manual copyright is preserved by linking the original; rendered inspection pages are local only.
- The Hanli PDF calls itself JL-series. It is not automatically an HL-1500/2000/3000 datasheet. The supplied S&A PDF covers CW industrial models on the inspected pages, not proof of CWFL model specifications.
- The Raycus QCW supplied PDF page 11 was parsed and reviewed: 150 W maximum average in CW, 250 W in PULSE, 1500 W maximum peak. These are different quantities; they must never be collapsed into a misleading single “1500 W” average-power claim.
- Ten new studio images were generated with the built-in image tool. Three previously generated, reviewed studio photos (ML-004, ML-005, ML-007) were reused. PNG masters stay in `assets/catalog-v2/<model>/studio-v1.png`; delivery JPEGs are non-destructive derivatives `studio-web.jpg`. Exact configuration cannot be established from generated label text.
- First generated BM110 optical cutaway `optical-cutaway-v1.png` failed review: extra optical elements and incorrect beam behavior were not sufficiently controlled. It stays local as a rejected draft and is NOT linked in the published viewer.
- Instead, `optical-schematic.svg` provides a deliberately functional optical path: upper protective window, collimation compound group, focusing compound group and lower protective window. Post-focus beam converges to the nozzle; unverified drive/electronics are not drawn. This is not a claimed precise internal assembly/CAD.
- `technical-reference.svg` and `exploded-modules.svg` are original code-native introduction diagrams grounded in the manufacturer's reference dimensions and named modules. Hole locations, fine fasteners, placement of all hidden parts and manufacturing certification are not implied. The original manufacturer drawing remains the installation reference.
- Tests in `tests/catalog-completion.cjs` cover exact 3015 names, nine-model 6020 count, machine-only comparison flags, local image references, article source links, JS syntax, simulated DOM search/filter and optical slider endpoints. Browser rendering, actual touch behavior and visual alignment are not yet browser-tested.

