# Studio-image prompt set and provenance

Mode: built-in image generation, not CLI/API. Generated images are reconstructions, never engineering evidence. Full PNG masters remain local; website JPEGs are compressed/resized delivery derivatives. Original reference files are preserved.

Common final brief for product extraction: extract only the actual product from the supplied photo/artwork; pure white studio background; full object, generous whitespace, subtle contact shadow; preserve shape, proportions, visible ports, housings, controls, accessories and manufacturer markings; remove surrounding specifications, phone numbers and banner design; no invented internal hardware or replacement branding on third-party parts.

| Saved directory | Reference / individual prompt constraints |
| --- | --- |
| `single-standard` | `دستگاه تک میز استاندارد/20250217_101004.jpg`; remove workshop only, retain gantry, table slats, nozzle, cable chains, drawers, feet, separate console and the original Sahand fascia logo; do not redesign the machine. |
| `single-professional` | `دستگاه تک میز حرفه ای/mmexport1740563647987.jpg`; photoreal render from supplied CAD, retain exact long single-table layout, console, drawers and under-bed fittings; small SAHAND LASER wordmark on front blue panel. |
| `air-cooled` | `دستگاه جوش هوا خنک/Air cooling machine.jpg`; keep larger air-cooled cabinet and smaller separate wire feeder as the supplied two-unit set; never relabel the feeder as a chiller; retain front controls and hanging cable bag. |
| `tube-standard` | `برش لوله سری استاندارد/DZ Machine 7.png`; render supplied CAD layout, retain loading supports, long rail, central red housing, both screens, chucks and support station counts; do not invent an enclosure or hidden mechanism. |
| `WELD-1500` | `Welding Machine/C1500-Welding.jpg`; product extraction only; preserve cabinet, blue slanted top, controls, wheels and hose bundle; do not copy unsupported 4 mm welding-thickness text into the image or product claim. |
| `CC003` | `Chiller/S&A/3000-S&A.jpg`; extract actual CWFL-3000, preserve original S&A brand, grille, gauge, fan, wheels and case; restore normal readable model orientation rather than mirrored promotional lettering. |
| `CP-RAY-BM110` | `Cutting Head/BM---110.jpg` plus the manufacturer's physical-structure reference; remove promotional layout, retain BM110 geometry and side fittings, restore BEAM MOTION/RAYTOOLS text to normal orientation, no new Sahand badge. |
| `CP-SMC-ITV1050` | `Electro-Pneumatic/ITV---1050.jpg`; retain regulator body, display, button arrangement and ports; generated label/serial text is NOT identification evidence. |
| `CTRL-FSCUT2000E` | `Laser System/2000E.jpg`; retain pictured BMC228X board, black heatsink, PCIe contacts and RJ45 bracket; do not infer that the pictured board is specifically BMC228A or BMC228B. |
| `FS004` | `Source/C1500.jpg`; retain RFL-C1500 rack-unit geometry, original Raycus model/brand and front indicators; no source-internal diagram inferred from housing. |
| `CC001` | `عکس های سایت/cwfl1500-lite.png`; extract the pictured chiller onto white, retain cabinet proportions, ventilation, controls and wheels; remove the promotional background without inventing internals. |
| `CC002` | `عکس های سایت/cwfl2000-lite.png`; preserve the supplied chiller's exterior and visible fittings, isolate on white with a restrained contact shadow; generated lettering is not model-identification evidence. |
| `CH002` | `عکس های سایت/BM109-lite.png`; preserve the horizontal green cutting-head assembly and separate driver shown in the reference; no invented optical cutaway or replacement manufacturer badge. |

ML-004, ML-005 and ML-007 use previously generated `commercial-v2.png` masters from the original product asset folders, visually reviewed again in this run. ML-009 is not reused automatically while laser-type/cooling interpretation remains uncertain.

Current delivered set: thirteen newly reconstructed studio images plus three reused and re-reviewed marking-machine images, sixteen in total. These are visual assets, not proof of exact installed components or specifications.

## Rejected cutaway brief

The raster cutaway request required the same frame and silhouette as the BM110 studio image, documented QBH/window/collimation/focus/window/nozzle order, and no invented drive/electronics. The returned image did not reliably satisfy optical-path review. `optical-cutaway-v1.png` is therefore not published. The production report viewer uses original code-native SVG schematics with an explicit functional scope instead.

