# Sahand Laser catalog automation

## Setup (PowerShell)

```powershell
py -3 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
```

Put the OpenAI API key in `.env` as `OPENAI_API_KEY=...`. The `.env` file is ignored by Git; never paste the key into `product_links.txt` or commit it. GPT Image model access may require organization verification and API billing.

## Choose product pages

Add one product URL per line to `product_links.txt`. If the file contains no URLs, the scraper discovers product links from `PRODUCTS_PAGE_URL` (default `https://sahandlaser.com/laser-cutting-machine/`). It skips archive/navigation links, observes `robots.txt`, uses a delay, follows only allow-listed hosts, and logs per-product failures to `error_log.txt` while continuing. Dimensions are saved only when an overall-dimensions label and a three-value tuple are found; work-area values are not substituted for overall size. Persian and Arabic numerals are normalized, and explicit units are converted to millimeters.

## Build and preview

```powershell
python main.py self-test
python main.py build --generate-images
```

The build writes `products_data.json`, downloaded reference photos in the ignored `reference_images/` folder, conceptual X-ray images in `generated_xray/`, and datasheets plus a generated preview page in `output_catalog/`. The generated page is `output_catalog/catalog.html`; the server serves that directory at `http://localhost:3333/catalog.html`. It does not overwrite the repository-root `catalog.html`, which is the curated public 106-product image catalog. Press Ctrl+C in the terminal to stop the server. Generated X-ray-style internals are explicitly conceptual, not verified machine assemblies. If an API call fails, the build logs the error and uses a source exterior photo as a clearly labeled fallback when available.

To build from the curated 106-product catalog and its already prepared image files instead of scraping the live source, use:

```powershell
python main.py build --catalog-draft docs/catalog-completion/catalog-draft.json --no-server
```

This mode preserves each record's identity scope, specifications, sources, provenance, and image path. SVG images are rasterized locally for the Pillow datasheets. Without `--generate-images`, no X-ray API calls are made; existing catalog visuals are labeled as catalog visuals, not as X-rays. This build still writes only to `output_catalog/` and `products_data.json`; it does not replace the curated root `catalog.html`.

To run with a different port, use `python main.py build --generate-images --port 3334`. Use `--no-server` for a non-interactive build. Image generation is a paid API call and runs only when `--generate-images` is supplied.

## Publish

From the root of a clone of `alisonsasan-png/sahandlaser` on branch `main`, after checking the generated catalog and ensuring the Git index has no unrelated staged work:

```powershell
python main.py deploy
```

Or use `python main.py build --generate-images --deploy` to build and then deploy the allow-listed catalog artifacts automatically. Deployment checks the repository remote and branch, excludes `.env`, stages only known catalog files (never `git add .`), commits with `Automated Catalog & X-Ray Update`, then pushes `origin main`. Existing unrelated staged changes cause deployment to stop rather than being mixed into the release.

The repository-root `catalog.html` is the public image catalog. Each product card should point to a real image file in the repository; verify capitalization and live image responses after Pages finishes deploying. The generated preview page and image assets remain under `output_catalog/` and are separately staged by the allow-listed deploy command.
