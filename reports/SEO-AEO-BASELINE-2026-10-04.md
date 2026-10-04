# Sahand Laser — SEO/AEO Baseline

Date: 2026-10-04
Scope: safe baseline only. Heavy SEO and real product URL migration remain frozen until product/media data is stable.

## Already present and preserved
- Descriptive Persian homepage `<title>` and meta description.
- `robots=index,follow,max-image-preview:large`.
- Canonical points to `https://sahandlaser.com/`.
- Open Graph site/title/description/image metadata.
- Twitter summary-large-image metadata.
- Organization JSON-LD with company name, website, Isfahan address and sales/support contact points.
- Semantic H1/H2 structure exists across primary views.
- Product images are generated with product-aware `alt` text in the product renderer.
- Internal navigation exists for Products, Services, Applications, Training, Downloads, About and Contact.
- Product renderer updates `document.title` to the selected product title.
- Four-language interface is retained.

## Improvements completed in this roadmap
- Database v1.5 is now the authority, preventing unverified product claims from leaking into SEO text.
- Normal product gallery photos are no longer presented as 360 assets.
- CT-010 3D is explicitly identified as a visual reconstruction, preventing a false CAD/manufacturing claim.
- Responsive/performance module adds lazy loading and async image decoding to non-critical dynamic images.
- Verified-asset contract ensures technical drawings, exploded views and 360 sequences are only exposed when product-specific evidence exists.

## Deliberately deferred
- Converting `#product=CT-xxx` hashes to crawlable product URLs.
- Product-specific canonical URLs.
- Product/Offer JSON-LD per machine.
- Sitemap expansion for individual products.
- hreflang path architecture for FA/EN/AR/TR.
- Large-scale keyword landing pages and long-form SEO content.

These items are deferred because implementing them before product identity/media stabilization would create crawlable duplicate or inaccurate product pages.

## AEO rule
For future AI/search-answer optimization, factual product statements must come from the synchronized product database. Pending/review values must not be converted into confident prose. Primary-source manuals and user-confirmed Sahand product data have priority over generic manufacturer/competitor text.
