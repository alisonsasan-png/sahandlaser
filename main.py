#!/usr/bin/env python3
"""Local Sahand Laser catalog pipeline.

Scrapes explicitly supplied product pages, records only published dimensions,
optionally generates clearly-labeled conceptual X-ray-style illustrations,
builds Pillow datasheets and catalog.html, and serves a local preview.

AI illustrations are not engineering drawings and must not be treated as a
verified representation of a machine's internal assembly.
"""
from __future__ import annotations

import argparse
import html
import json
import logging
import os
import re
import socket
import subprocess
import sys
import tempfile
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import urljoin, urlparse, urldefrag, unquote
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from PIL import Image, ImageDraw, ImageFont, ImageOps
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


ROOT = Path(__file__).resolve().parent
LINKS_FILE = ROOT / "product_links.txt"
DATA_FILE = ROOT / "products_data.json"
XRAY_DIR = ROOT / "generated_xray"
OUTPUT_DIR = ROOT / "output_catalog"
CATALOG_FILE = OUTPUT_DIR / "catalog.html"
DEFAULT_PRODUCTS_PAGE = "https://sahandlaser.com/laser-cutting-machine/"
USER_AGENT = "SahandLaserCatalogBot/1.0 (+local product-catalog workflow)"
LOG = logging.getLogger("sahand_catalog")

load_dotenv(ROOT / ".env")

PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹"
ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩"
ASCII_DIGITS = "0123456789"
DIGIT_TABLE = str.maketrans(PERSIAN_DIGITS + ARABIC_DIGITS, ASCII_DIGITS * 2)

OVERALL_LABELS = (
    "overall dimensions", "overall dimension", "external dimensions", "machine dimensions",
    "overall size", "ابعاد کلی", "ابعاد دستگاه", "ابعاد خارجی", "ابعاد بدنه",
    "ابعاد کلی دستگاه", "ابعاد کلی ماشین",
)
WORKING_AREA_LABELS = (
    "working area", "work area", "cutting area", "worktable", "table size",
    "محدوده کاری", "منطقه کاری", "سطح کار", "ابعاد میز کار", "ابعاد میزکار",
)

NUMBER = r"\d[\d\s,]*(?:\.\d+)?"
UNIT = r"(?:millimet(?:er|re)s?|mm|cm|m|in(?:ch(?:es)?)?|ميلي ?متر|میلی ?متر|سانتی ?متر|متر)"
DIMENSION_TRIPLE_RE = re.compile(
    rf"(?P<a>{NUMBER})\s*(?P<ua>{UNIT})?\s*(?:×|✕|x|X|\*)\s*"
    rf"(?P<b>{NUMBER})\s*(?P<ub>{UNIT})?\s*(?:×|✕|x|X|\*)\s*"
    rf"(?P<c>{NUMBER})\s*(?P<uc>{UNIT})?",
    re.IGNORECASE,
)
MODEL_RE = re.compile(
    r"(?:\bmodel\b|\bmodel\s*(?:no\.?|number)?|型号|機型|مدل)\s*[:：#\-]?\s*"
    r"([A-Z][A-Z0-9._/\-]{1,30})",
    re.IGNORECASE,
)


@dataclass
class ProductRecord:
    name: str
    model: str | None
    source_url: str
    reference_image_url: str | None
    reference_image_path: str | None
    scraped_at: str
    dimensions_mm: dict[str, int | float] | None
    dimensions_source: str | None
    dimensions_source_excerpt: str | None
    dimensions_unit_note: str | None
    extraction_status: str


def normalize_digits(value: str) -> str:
    """Convert Persian/Arabic numerals to ASCII and normalize separators."""
    return value.translate(DIGIT_TABLE).replace("٫", ".").replace("٬", ",")


def _number_to_decimal(raw: str) -> Decimal:
    cleaned = normalize_digits(raw).replace(",", "").replace(" ", "")
    try:
        value = Decimal(cleaned)
    except InvalidOperation as exc:
        raise ValueError(f"Invalid dimension number: {raw!r}") from exc
    if value <= 0 or value > Decimal("1000000"):
        raise ValueError(f"Dimension outside reasonable range: {raw!r}")
    return value


def _unit_to_mm(unit: str | None, default_unit: str = "mm") -> tuple[Decimal, str]:
    token = (unit or default_unit).strip().lower().replace(" ", "")
    if token in {"mm", "millimeter", "millimeters", "میلیمتر", "ميليمتر"}:
        return Decimal(1), "mm"
    if token in {"cm", "centimeter", "centimeters", "سانتیمتر"}:
        return Decimal(10), "cm"
    if token in {"m", "meter", "meters", "متر"}:
        return Decimal(1000), "m"
    if token in {"in", "inch", "inches"}:
        return Decimal("25.4"), "in"
    raise ValueError(f"Unsupported dimension unit: {unit!r}")


def _as_json_number(value: Decimal) -> int | float:
    rounded = value.quantize(Decimal("0.01"))
    return int(rounded) if rounded == rounded.to_integral_value() else float(rounded)


def extract_overall_dimensions(text: str, default_unit: str = "mm") -> tuple[dict[str, int | float] | None, str | None, str | None, str | None]:
    """Return L/W/H in mm only when an overall-dimensions context is present.

    Working-area/table dimensions are deliberately not treated as machine
    footprint dimensions. If the page omits a unit, ``default_unit`` is used
    and the returned note records that assumption.
    """
    normalized = normalize_digits(text)
    lower = normalized.lower()
    overall_positions = [lower.find(label) for label in OVERALL_LABELS if lower.find(label) >= 0]
    if not overall_positions:
        return None, None, None, None
    for match in DIMENSION_TRIPLE_RE.finditer(normalized):
        lo, hi = max(0, match.start() - 200), min(len(normalized), match.end() + 80)
        context = normalized[lo:hi].lower()
        if not any(label in context for label in OVERALL_LABELS):
            continue
        # Ignore a 3-axis tuple that is explicitly a work envelope, unless an
        # overall-dimension label occurs close to this same tuple.
        near = normalized[max(0, match.start() - 100):match.start()].lower()
        if any(label in near for label in WORKING_AREA_LABELS) and not any(
            label in near for label in OVERALL_LABELS
        ):
            continue
        units = [match.group("ua"), match.group("ub"), match.group("uc")]
        final_unit = next((u for u in reversed(units) if u), None)
        values: list[Decimal] = []
        unit_names: list[str] = []
        try:
            for raw, unit in zip((match.group("a"), match.group("b"), match.group("c")), units):
                factor, used_unit = _unit_to_mm(unit or final_unit, default_unit)
                values.append(_number_to_decimal(raw) * factor)
                unit_names.append(used_unit)
        except ValueError:
            continue
        excerpt = " ".join(normalized[max(0, match.start() - 60):min(len(normalized), match.end() + 40)].split())
        note = "explicit source units converted to mm" if final_unit or any(units) else f"unit omitted; configured default {default_unit} applied"
        return (
            {"length": _as_json_number(values[0]), "width": _as_json_number(values[1]), "height": _as_json_number(values[2])},
            "page text near an overall-dimensions label",
            excerpt,
            note,
        )
    return None, None, None, None


def _safe_hostname(url: str, trusted_hosts: Iterable[str]) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in {"https", "http"} or not parsed.hostname or parsed.username or parsed.password:
        return False
    host = parsed.hostname.lower().rstrip(".")
    if host in {"localhost", "localhost.localdomain"} or host.endswith(".local"):
        return False
    for allowed in trusted_hosts:
        allowed = allowed.strip().lower().lstrip(".")
        if allowed and (host == allowed or host.endswith("." + allowed)):
            return True
    return False


class SafeFetcher:
    def __init__(self, trusted_hosts: list[str], timeout: int = 25, delay: float = 1.0, respect_robots: bool = True):
        self.trusted_hosts = trusted_hosts
        self.timeout = timeout
        self.delay = max(0, delay)
        self.respect_robots = respect_robots
        self.session = requests.Session()
        retry = Retry(total=3, connect=3, read=2, backoff_factor=0.7,
                      status_forcelist=(429, 500, 502, 503, 504),
                      allowed_methods=frozenset({"GET"}), raise_on_status=False)
        adapter = HTTPAdapter(max_retries=retry)
        self.session.mount("https://", adapter)
        self.session.mount("http://", adapter)
        self.session.headers.update({"User-Agent": USER_AGENT, "Accept-Language": "fa,en;q=0.8"})
        self._robots: dict[str, RobotFileParser | None] = {}
        self._last_request = 0.0

    def _can_fetch_robots(self, url: str) -> bool:
        if not self.respect_robots:
            return True
        parsed = urlparse(url)
        origin = f"{parsed.scheme}://{parsed.netloc}"
        if origin not in self._robots:
            robots_url = urljoin(origin, "/robots.txt")
            parser = RobotFileParser()
            try:
                response = self.session.get(robots_url, timeout=self.timeout)
                if response.status_code == 200:
                    parser.parse(response.text.splitlines())
                    self._robots[origin] = parser
                else:
                    self._robots[origin] = None
            except requests.RequestException:
                self._robots[origin] = None
        parser = self._robots[origin]
        return parser.can_fetch(USER_AGENT, url) if parser else True

    def get(self, url: str) -> requests.Response:
        url = urldefrag(url.strip())[0]
        if not _safe_hostname(url, self.trusted_hosts):
            raise ValueError(f"URL host is not trusted: {url}")
        if not self._can_fetch_robots(url):
            raise PermissionError(f"robots.txt disallows scraping: {url}")
        if self.delay:
            wait = self.delay - (time.monotonic() - self._last_request)
            if wait > 0:
                time.sleep(wait)
        current = url
        for _ in range(6):
            response = self.session.get(current, timeout=self.timeout, allow_redirects=False)
            self._last_request = time.monotonic()
            if response.is_redirect or response.is_permanent_redirect:
                target = urljoin(current, response.headers.get("Location", ""))
                if not _safe_hostname(target, self.trusted_hosts):
                    raise ValueError(f"Redirect points outside trusted hosts: {target}")
                current = target
                continue
            response.raise_for_status()
            return response
        raise requests.TooManyRedirects(f"Too many redirects for {url}")


def _iter_jsonld(value: Any) -> Iterable[dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        graph = value.get("@graph")
        if isinstance(graph, list):
            for item in graph:
                yield from _iter_jsonld(item)
    elif isinstance(value, list):
        for item in value:
            yield from _iter_jsonld(item)


def _product_jsonld(soup: BeautifulSoup) -> dict[str, Any]:
    for tag in soup.select('script[type="application/ld+json"]'):
        try:
            payload = json.loads(tag.string or tag.get_text())
        except (json.JSONDecodeError, TypeError):
            continue
        for item in _iter_jsonld(payload):
            kind = item.get("@type", [])
            kinds = kind if isinstance(kind, list) else [kind]
            if any(str(k).lower() == "product" for k in kinds):
                return item
    return {}


def _product_image_url(soup: BeautifulSoup, jsonld: dict[str, Any], page_url: str) -> str | None:
    """Find a product-specific image URL, preferring structured metadata."""
    value = jsonld.get("image")
    candidates: list[str] = []
    if isinstance(value, str):
        candidates.append(value)
    elif isinstance(value, dict):
        for key in ("url", "contentUrl"):
            if isinstance(value.get(key), str):
                candidates.append(value[key])
    elif isinstance(value, list):
        for item in value:
            if isinstance(item, str):
                candidates.append(item)
            elif isinstance(item, dict):
                candidates.extend(str(item[key]) for key in ("url", "contentUrl") if item.get(key))
    # Many WordPress sites use their brand logo as og:image, so product
    # galleries should be checked before generic social preview metadata.
    image_tags = soup.select("main img, article img, .woocommerce-product-gallery img, .wp-post-image")
    image_tags += soup.select("img")
    seen_sources: set[str] = set()
    product_images: list[str] = []
    for tag in image_tags:
        source = (tag.get("src") or tag.get("data-src") or tag.get("data-lazy-src") or "").strip()
        if not source:
            srcset = (tag.get("srcset") or tag.get("data-srcset") or "").strip()
            if srcset:
                source = srcset.split(",")[-1].strip().split(" ")[0]
        absolute = urljoin(page_url, source) if source else ""
        if not absolute or absolute in seen_sources:
            continue
        seen_sources.add(absolute)
        meta = " ".join(str(tag.get(key, "")) for key in ("alt", "class", "width", "height")).lower()
        if any(word in meta or word in urlparse(absolute).path.lower()
               for word in ("logo", "لوگو", "icon", "آیکن", "آیکون", "avatar", "banner", "sprite")):
            continue
        product_images.append(absolute)
    candidates = product_images + candidates
    candidates.extend(filter(None, (_meta(soup, "og:image", "twitter:image"),)))
    for candidate in candidates:
        absolute = urljoin(page_url, candidate.strip())
        if urlparse(absolute).scheme in {"https", "http"}:
            return absolute
    return None


def _meta(soup: BeautifulSoup, *names: str) -> str | None:
    for name in names:
        tag = soup.find("meta", attrs={"property": name}) or soup.find("meta", attrs={"name": name})
        if tag and tag.get("content"):
            return " ".join(tag["content"].split())
    return None


def extract_product_record(url: str, page_html: str, default_unit: str = "mm") -> ProductRecord:
    soup = BeautifulSoup(page_html, "html.parser")
    jsonld = _product_jsonld(soup)
    h1 = soup.find("h1")
    name = (
        str(jsonld.get("name", "")).strip()
        or (h1.get_text(" ", strip=True) if h1 else "")
        or _meta(soup, "og:title", "twitter:title")
        or (soup.title.get_text(" ", strip=True) if soup.title else "")
        or urlparse(url).path.rstrip("/").split("/")[-1]
    )
    model_val = jsonld.get("model") or jsonld.get("mpn") or jsonld.get("sku")
    if isinstance(model_val, dict):
        model_val = model_val.get("name") or model_val.get("value")
    text = soup.get_text(" ", strip=True)
    if not model_val:
        match = MODEL_RE.search(normalize_digits(text))
        model_val = match.group(1) if match else None
    if not model_val:
        # Some manufacturer pages identify a cutting bed size as the model
        # (e.g. "Fiber Laser Cutting Machine 3015") without a SKU label.
        model_match = re.search(r"\b(20\d{2}|30\d{2}|40\d{2}|60\d{2}|80\d{2})\b", normalize_digits(name + " " + text))
        model_val = model_match.group(1) if model_match else None
    dims, source, excerpt, unit_note = extract_overall_dimensions(text, default_unit)
    return ProductRecord(
        name=" ".join(name.split()), model=str(model_val).strip() if model_val else None,
        source_url=url, reference_image_url=_product_image_url(soup, jsonld, url),
        reference_image_path=None, scraped_at=datetime.now(timezone.utc).isoformat(),
        dimensions_mm=dims, dimensions_source=source, dimensions_source_excerpt=excerpt,
        dimensions_unit_note=unit_note,
        extraction_status="dimensions_found" if dims else "dimensions_not_published_or_not_extracted",
    )


def _is_product_link(anchor: Any, href: str) -> bool:
    path = unquote(urlparse(href).path).lower().rstrip("/")
    segments = [part for part in path.split("/") if part]
    text = anchor.get_text(" ", strip=True).lower()
    # WordPress product archives/navigation are not product detail pages.
    archives = {"product", "products", "محصول", "محصولات", "product-category"}
    if len(segments) == 1 and segments[0] in archives:
        return False
    if "product=" in href.lower():
        return True
    if any(term in text for term in (
        "مشاهده محصول", "جزئیات محصول", "مشاهده مشخصات", "view product", "product details"
    )):
        return True
    # Sahand's WordPress product detail URLs are Persian slugs rather than
    # /product/<slug>; identify product cards by their descriptive anchor text.
    product_terms = (
        "دستگاه برش", "دستگاه حکاکی", "دستگاه جوش", "دستگاه تمیزکاری", "دستگاه تمیز کاری",
        "laser cutting machine", "laser marking machine", "laser welding machine", "laser cleaning machine",
    )
    if any(term in text for term in product_terms):
        return path not in {"/laser-cutting-machine", "/products", "/product"}
    return any(part in segments for part in ("product", "products", "محصول", "محصولات")) and len(segments) > 1


def read_product_urls(links_file: Path, explicit_urls: list[str] | None, products_page: str,
                      fetcher: SafeFetcher) -> list[str]:
    if explicit_urls:
        candidates = explicit_urls
    elif links_file.exists():
        candidates = [line.strip() for line in links_file.read_text(encoding="utf-8-sig").splitlines()
                      if line.strip() and not line.lstrip().startswith("#")]
    else:
        candidates = []
    if not candidates:
        response = fetcher.get(products_page)
        soup = BeautifulSoup(response.text, "html.parser")
        candidates = []
        for anchor in soup.select("a[href]"):
            href = urljoin(response.url, anchor.get("href", ""))
            if _safe_hostname(href, fetcher.trusted_hosts) and _is_product_link(anchor, href):
                candidates.append(href)
        if not candidates:
            raise RuntimeError(
                "No product links discovered on the products page. Add one product URL per line to product_links.txt."
            )
    result: list[str] = []
    seen: set[str] = set()
    for candidate in candidates:
        normalized = urldefrag(urljoin(products_page, candidate.strip()))[0]
        if normalized not in seen:
            if not _safe_hostname(normalized, fetcher.trusted_hosts):
                raise ValueError(f"Product URL is outside TRUSTED_HOSTS: {normalized}")
            seen.add(normalized)
            result.append(normalized)
    return result


def scrape_products(urls: list[str], fetcher: SafeFetcher, default_unit: str = "mm") -> list[dict[str, Any]]:
    records: list[dict[str, Any]] = []
    for index, url in enumerate(urls, start=1):
        try:
            response = fetcher.get(url)
            record = extract_product_record(response.url, response.text, default_unit)
            records.append(asdict(record))
            dims = record.dimensions_mm or "not found"
            LOG.info("[%s/%s] %s | model=%s | dimensions_mm=%s", index, len(urls), record.name, record.model or "—", dims)
        except Exception as exc:  # keep other product pages moving
            LOG.exception("[%s/%s] Failed to scrape %s: %s", index, len(urls), url, exc)
            records.append(asdict(ProductRecord(
                name=urlparse(url).path.rstrip("/").split("/")[-1] or url,
                model=None, source_url=url, reference_image_url=None, reference_image_path=None,
                scraped_at=datetime.now(timezone.utc).isoformat(),
                dimensions_mm=None, dimensions_source=None, dimensions_source_excerpt=None,
                dimensions_unit_note=None, extraction_status=f"fetch_error: {type(exc).__name__}",
            )))
    return records


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def download_reference_image(url: str, fetcher: SafeFetcher, directory: Path, slug: str) -> Path:
    """Download and validate a same-trusted-host reference image for API edits."""
    response = fetcher.get(url)
    raw = response.content
    if not raw or len(raw) > 50 * 1024 * 1024:
        raise ValueError(f"Reference image is empty or exceeds 50 MiB: {url}")
    from io import BytesIO
    with Image.open(BytesIO(raw)) as image:
        image_format = (image.format or "").upper()
        if image_format not in {"PNG", "JPEG", "WEBP"}:
            raise ValueError(f"Unsupported reference image format {image_format!r}: {url}")
        image.verify()
    extension = {"PNG": ".png", "JPEG": ".jpg", "WEBP": ".webp"}[image_format]
    directory.mkdir(parents=True, exist_ok=True)
    destination = directory / f"{slug}{extension}"
    destination.write_bytes(raw)
    return destination


def slug_for(record: dict[str, Any]) -> str:
    model = str(record.get("model") or "")
    name = str(record.get("name") or "")
    identity = f"{model}-{name}" if model else (name or "product")
    slug = re.sub(r"[^A-Za-z0-9]+", "-", normalize_digits(identity)).strip("-").lower()
    if not slug:
        slug = re.sub(r"[^A-Za-z0-9]+", "-", normalize_digits(model)).strip("-").lower() or "product"
    # Persian names often normalize to no ASCII characters, and several models
    # share the same bed size (e.g. distinct 3015 variants). A stable digest
    # prevents overwriting their references, generated visuals, or datasheets.
    import hashlib
    suffix = hashlib.sha1(identity.encode("utf-8")).hexdigest()[:8]
    return f"{slug[:70].rstrip('-')}-{suffix}"


def xray_prompt(record: dict[str, Any]) -> str:
    name = record.get("name") or "industrial laser machine"
    model = record.get("model") or "model not specified"
    return f"""Create a polished conceptual X-ray-style cutaway illustration for a product catalog.
Subject: {name}; model label for context only: {model}.
Use the supplied product name and any exterior photo references only to suggest the outer silhouette.
Show a tasteful translucent shell and generic, non-specific industrial machinery forms inside.
CRITICAL ACCURACY LIMIT: the actual internal assembly is not verified. Do not depict identifiable branded parts,
exact motors, laser sources, rails, wiring routes, or precise internal layout as factual. This is a visual concept,
not an engineering drawing. No text, labels, dimensions, brand logos, serial numbers, watermark, people, or sparks.
Single isolated machine, clean isometric three-quarter view, transparent background, high-quality technical illustration.
"""


def generate_xray_image(record: dict[str, Any], output_path: Path, model: str, force: bool = False) -> Path:
    if output_path.exists() and not force:
        LOG.info("Keeping existing generated image: %s", output_path)
        return output_path
    if not os.getenv("OPENAI_API_KEY"):
        raise RuntimeError("OPENAI_API_KEY is not set. Copy .env.example to .env and add your key.")
    from openai import OpenAI

    client = OpenAI()
    reference_path = record.get("reference_image_path")
    if reference_path:
        image_path = ROOT / Path(reference_path)
        if not image_path.is_file():
            raise FileNotFoundError(f"Saved reference image is missing: {image_path}")
        with image_path.open("rb") as reference_image:
            result = client.images.edit(
                model=model, image=reference_image, prompt=xray_prompt(record),
                size="1536x1024", quality="high", background="transparent", output_format="png",
            )
    else:
        LOG.warning("No source photo for %s; generating a text-only conceptual illustration.", record.get("name"))
        result = client.images.generate(
            model=model,
            prompt=xray_prompt(record),
            size="1536x1024",
            quality="high",
            background="transparent",
            output_format="png",
        )
    encoded = result.data[0].b64_json
    if not encoded:
        raise RuntimeError("Image API returned no base64 image data.")
    import base64
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_bytes(base64.b64decode(encoded, validate=True))
    return output_path


def _font_paths() -> list[Path]:
    paths: list[Path] = []
    configured = os.getenv("FONT_PATH")
    if configured:
        paths.append(Path(configured).expanduser())
    if os.name == "nt":
        paths += [Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts" / "tahoma.ttf",
                  Path(os.environ.get("WINDIR", r"C:\Windows")) / "Fonts" / "arial.ttf"]
    paths += [ROOT / "preview-32" / "fonts" / "Yekan.ttf", ROOT / "logo-font.ttf"]
    paths += [Path("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"),
              Path("/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf")]
    return paths


def load_font(size: int) -> ImageFont.ImageFont:
    for path in _font_paths():
        if path.is_file():
            try:
                return ImageFont.truetype(str(path), size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def _draw_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str,
               font: ImageFont.ImageFont, fill: Any, anchor: str | None = None) -> None:
    kwargs: dict[str, Any] = {"font": font, "fill": fill}
    if anchor:
        kwargs["anchor"] = anchor
    try:
        draw.text(xy, text, direction="rtl" if re.search(r"[\u0600-\u06ff]", text) else "ltr", language="fa", **kwargs)
    except (TypeError, ValueError, KeyError):
        try:
            import arabic_reshaper
            from bidi.algorithm import get_display
            draw.text(xy, get_display(arabic_reshaper.reshape(text)), **kwargs)
        except ImportError:
            draw.text(xy, text, **kwargs)


def _draw_wrapped_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str,
                       font: ImageFont.ImageFont, fill: Any, max_width: int,
                       line_height: int, max_lines: int = 2, anchor: str | None = None) -> int:
    """Draw word-wrapped copy within a fixed datasheet panel and return next y."""
    words = str(text).split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        try:
            width = font.getlength(candidate)
        except (AttributeError, ValueError):
            width = len(candidate) * 10
        if current and width > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        lines[-1] = lines[-1].rstrip(" .,؛") + "…"
    x, y = xy
    for line in lines:
        _draw_text(draw, (x, y), line, font, fill, anchor=anchor)
        y += line_height
    return y


def _load_logo(logo_path: Path | None) -> Image.Image | None:
    candidates = [logo_path] if logo_path else [ROOT / "logo.png", ROOT / "assets" / "logo.png"]
    for candidate in candidates:
        if candidate and candidate.is_file():
            with Image.open(candidate) as im:
                return im.convert("RGBA").copy()
    return None


def _draw_arrow(draw: ImageDraw.ImageDraw, start: tuple[int, int], end: tuple[int, int], color: str = "#0879b9") -> None:
    draw.line((start, end), fill=color, width=3)
    import math
    for tip, other in ((start, end), (end, start)):
        angle = math.atan2(tip[1] - other[1], tip[0] - other[0])
        size = 14
        p1 = (tip[0] - size * math.cos(angle - .45), tip[1] - size * math.sin(angle - .45))
        p2 = (tip[0] - size * math.cos(angle + .45), tip[1] - size * math.sin(angle + .45))
        draw.polygon([tip, p1, p2], fill=color)


def create_datasheet(record: dict[str, Any], xray_path: Path, output_path: Path, logo_path: Path | None,
                     image_kind: str = "xray_concept") -> Path:
    canvas = Image.new("RGB", (1920, 1080), "#f5f8fb")
    draw = ImageDraw.Draw(canvas)
    navy, blue, muted = "#122a49", "#0879b9", "#5b6f82"
    draw.rounded_rectangle((28, 28, 1892, 1052), radius=28, fill="white", outline="#d9e4ec", width=3)
    logo = _load_logo(logo_path)
    if logo:
        logo.thumbnail((260, 105), Image.Resampling.LANCZOS)
        canvas.paste(logo, (68, 58), logo if logo.mode == "RGBA" else None)
    else:
        _draw_text(draw, (70, 70), "سهند لیزر · SAHAND LASER", load_font(30), "#bd2833")
        LOG.warning("No logo file found. Place the approved logo at logo.png or set LOGO_PATH in .env.")

    title = record.get("name") or "Laser machine"
    model = record.get("model") or "Not specified"
    _draw_wrapped_text(draw, (1810, 66), title[:64], load_font(34), navy,
                       max_width=1050, line_height=40, max_lines=2, anchor="ra")
    _draw_text(draw, (1810, 145), f"Model: {model}", load_font(22), muted, anchor="ra")
    draw.line((64, 190, 1856, 190), fill="#dce6ee", width=2)

    # The generated cutaway is intentionally presented as a concept, not as
    # verified technical imagery.
    image_box = (82, 220, 1120, 875)
    draw.rounded_rectangle(image_box, radius=22, fill="#fbfdff", outline="#e2eaf0", width=2)
    with Image.open(xray_path) as src:
        subject = src.convert("RGBA")
    subject.thumbnail((930, 590), Image.Resampling.LANCZOS)
    white = Image.new("RGBA", subject.size, "white")
    white.alpha_composite(subject)
    subject_rgb = white.convert("RGB")
    px = image_box[0] + (image_box[2] - image_box[0] - subject_rgb.width) // 2
    py = image_box[1] + 30 + (image_box[3] - image_box[1] - 110 - subject_rgb.height) // 2
    canvas.paste(subject_rgb, (px, py))
    image_caption = ("AI X-RAY CONCEPT · INTERNALS UNVERIFIED" if image_kind == "xray_concept"
                     else "SOURCE PHOTO · NO X-RAY GENERATED")
    _draw_text(draw, (image_box[0] + 22, image_box[1] + 20), image_caption, load_font(13), "#9a5a21")

    dims = record.get("dimensions_mm")
    if isinstance(dims, dict) and all(dims.get(key) is not None for key in ("length", "width", "height")):
        length, width, height = (dims[k] for k in ("length", "width", "height"))
        # Dimension arrows are explicitly schematic and not drawn to scale.
        _draw_arrow(draw, (180, 910), (885, 910))
        _draw_text(draw, (535, 922), f"L  {length} mm", load_font(22), blue, anchor="ma")
        _draw_arrow(draw, (135, 820), (135, 390))
        _draw_text(draw, (117, 605), f"H {height} mm", load_font(19), blue, anchor="mm")
        draw.line((900, 832, 1010, 774), fill=blue, width=3)
        _draw_arrow(draw, (900, 832), (1010, 774))
        _draw_text(draw, (1018, 760), f"W {width} mm", load_font(19), blue)
        _draw_text(draw, (598, 986), "Overall envelope only · illustration not to scale", load_font(17), muted, anchor="ma")
    else:
        _draw_text(draw, (600, 924), "ابعاد کلی مستند در صفحهٔ منبع پیدا نشد؛ اندازه‌گذاری انجام نشده است.", load_font(20), "#9a5a21", anchor="ma")

    # Product facts panel.
    panel = (1160, 220, 1826, 875)
    draw.rounded_rectangle(panel, radius=22, fill="#f8fafc", outline="#dce6ee", width=2)
    _draw_text(draw, (1778, 265), "اطلاعات محصول · PRODUCT INFORMATION", load_font(23), navy, anchor="ra")
    _draw_wrapped_text(draw, (1778, 326), title[:64], load_font(23), navy,
                       max_width=560, line_height=31, max_lines=2, anchor="ra")
    _draw_text(draw, (1778, 397), f"Model: {model}", load_font(20), muted, anchor="ra")
    draw.line((1200, 435, 1780, 435), fill="#d9e4ec", width=2)
    _draw_text(draw, (1778, 474), "ابعاد کلی · OVERALL DIMENSIONS · mm", load_font(20), blue, anchor="ra")
    if isinstance(dims, dict):
        lines = [f"Length  {dims['length']} mm", f"Width   {dims['width']} mm", f"Height  {dims['height']} mm"]
    else:
        lines = ["طول: در منبع منتشر نشده", "عرض: در منبع منتشر نشده", "ارتفاع: در منبع منتشر نشده"]
    for n, line in enumerate(lines):
        _draw_text(draw, (1220, 522 + n * 43), line, load_font(20), navy)
    y = 690
    _draw_text(draw, (1778, y), "منبع", load_font(19), navy, anchor="ra")
    source_url = str(record.get("source_url") or "")
    source_host = urlparse(source_url).hostname or ""
    _draw_text(draw, (1220, y + 35), source_host, load_font(15), muted)
    y += 95
    draw.rounded_rectangle((1190, y, 1796, y + 125), radius=14, fill="#fff3df", outline="#f0d6ae")
    if image_kind == "xray_concept":
        notice = "تصویر X-ray مفهومی است؛ اجزای داخلی تأیید نشده‌اند و برای مهندسی یا ساخت نیست."
        title_notice = "تصویر مفهومی مولد · اجزای داخلی تأییدشده نیستند"
    else:
        notice = "فقط عکس بیرونی محصول است؛ قطعات داخلی نمایش داده نشده و این تصویر X-ray یا نقشهٔ مهندسی نیست."
        title_notice = "عکس مرجع بیرونی · تصویر داخلی تولید نشده است"
    _draw_text(draw, (1768, y + 25), title_notice, load_font(15), "#7b5425", anchor="ra")
    _draw_wrapped_text(draw, (1220, y + 63), notice, load_font(14), "#7b5425",
                       max_width=555, line_height=19, max_lines=3)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(output_path, format="PNG", optimize=True)
    return output_path


def generate_catalog_page(output_dir: Path, records: list[dict[str, Any]], output_path: Path) -> Path:
    by_slug = {slug_for(item): item for item in records}
    cards: list[str] = []
    for image_path in sorted(output_dir.glob("*.png")):
        record = by_slug.get(image_path.stem, {})
        name = html.escape(str(record.get("name") or image_path.stem))
        model = html.escape(str(record.get("model") or "مدل ثبت نشده"))
        image_name = html.escape(image_path.name)
        image_href = html.escape(Path(os.path.relpath(image_path, output_path.parent)).as_posix())
        visual_note = ("تصویر X-ray مفهومیِ مولد؛ اجزای داخلی تأییدشده نیستند."
                       if record.get("catalog_visual_type") == "xray_concept"
                       else "تصویر از عکس مرجع بیرونی ساخته شده؛ X-ray نیست.")
        dims = record.get("dimensions_mm")
        dimension_text = (f"ابعاد کلی (mm): {dims['length']} × {dims['width']} × {dims['height']}"
                          if isinstance(dims, dict) else "ابعاد کلی مستند در منبع پیدا نشد.")
        cards.append(
            f'<article class="card"><a href="{image_href}" target="_blank" rel="noopener">'
            f'<img src="{image_href}" alt="برگهٔ کاتالوگ {name}" loading="lazy"></a>'
            f'<div class="copy"><h2>{name}</h2><p>مدل: {model}</p>'
            f'<p>{html.escape(dimension_text)}</p><p class="note">{html.escape(visual_note)}</p></div></article>'
        )
    empty = '<p class="empty">هنوز برگه‌ای ساخته نشده است. اجرای <code>python main.py build --generate-images</code> را انجام دهید.</p>'
    body = "\n".join(cards) if cards else empty
    page = f'''<!doctype html>
<html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>کاتالوگ تصاویر محصولات سهند لیزر</title>
<style>
*{{box-sizing:border-box}}body{{margin:0;background:#f3f6f9;color:#142c48;font:16px/1.9 Tahoma,Arial,sans-serif}}
header{{background:linear-gradient(120deg,#10243b,#285578);color:#fff;padding:28px max(20px,calc((100vw - 1240px)/2))}}
header h1{{margin:0 0 8px;font-size:clamp(24px,4vw,38px)}}header p{{margin:0;color:#d8e5ee;max-width:850px}}
main{{max-width:1240px;margin:28px auto;padding:0 18px}}.grid{{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr));gap:20px}}
.card{{background:#fff;border:1px solid #dce5ec;border-radius:18px;overflow:hidden;box-shadow:0 8px 24px #1534510b}}
.card img{{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:contain;background:#fff}}.copy{{padding:16px 20px}}.copy h2{{font-size:20px;margin:0}}.copy p{{margin:3px 0;color:#54697d}}.copy .note{{font-size:14px;color:#8a5b23}}.empty{{padding:28px;background:#fff;border-radius:16px}}
</style></head><body><header><h1>کاتالوگ تصاویر محصولات سهند لیزر</h1>
<p>برگه‌های کاتالوگ تولیدشده به‌صورت محلی. تصاویر X-ray مولد، مفهومی‌اند و اجزای داخلی را به‌عنوان اطلاعات تأییدشده معرفی نمی‌کنند.</p></header>
<main><section class="grid">{body}</section></main></body></html>'''
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(page, encoding="utf-8")
    return output_path


def run_server(port: int, directory: Path = ROOT) -> None:
    """Serve the generated catalog directory so isolated builds preview correctly too."""
    serve_directory = directory.resolve()
    handler = lambda *args, **kwargs: SimpleHTTPRequestHandler(
        *args, directory=str(serve_directory), **kwargs
    )
    try:
        server = ThreadingHTTPServer(("127.0.0.1", port), handler)
    except OSError as exc:
        raise RuntimeError(f"Could not start preview server on port {port}: {exc}") from exc
    LOG.info("Preview ready at http://localhost:%s/catalog.html", port)
    LOG.info("Press Ctrl+C to stop the local preview server.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        LOG.info("Preview server stopped.")
    finally:
        server.server_close()


def _git(*args: str, capture: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(["git", *args], cwd=ROOT, text=True, encoding="utf-8",
                          errors="replace", capture_output=capture, check=False)


def deploy_artifacts() -> None:
    """Explicit, allow-listed deployment; never stages the whole worktree."""
    expected = os.getenv("GITHUB_REPO_SLUG", "alisonsasan-png/sahandlaser").lower()
    top = _git("rev-parse", "--show-toplevel")
    if top.returncode:
        raise RuntimeError("This folder is not inside a Git repository.")
    if Path(top.stdout.strip()).resolve() != ROOT.resolve():
        raise RuntimeError("Run deployment from the repository root containing main.py.")
    remote = _git("remote", "get-url", "origin")
    if remote.returncode or expected not in remote.stdout.lower().replace(".git", ""):
        raise RuntimeError(f"origin must point to GitHub repository {expected}; found {remote.stdout.strip()!r}.")
    branch = _git("branch", "--show-current")
    if branch.returncode or branch.stdout.strip() != "main":
        raise RuntimeError("Deployment is restricted to the main branch. Switch to main and review changes first.")
    if (ROOT / ".env").exists():
        # Existence is expected locally, but it must never be staged.
        check = _git("check-ignore", ".env")
        if check.returncode != 0:
            raise RuntimeError(".env is not ignored by Git. Add it to .gitignore before deployment.")
    paths = ["main.py", "requirements.txt", ".env.example", ".gitignore", "AUTOMATION.md", "product_links.txt",
             "products_data.json", "catalog.html", "generated_xray", "output_catalog", "logo.png",
             "assets/product-sheets/dz3015h-dimension.svg",
             "assets/product-sheets/dz3015h-studio.jpg",
             "assets/product-sheets/laser-4020-preliminary.svg",
             "assets/product-sheets/laser-4020-preliminary-studio.jpg"]
    present = [path for path in paths if (ROOT / path).exists()]
    if not present:
        raise RuntimeError("No generated catalog artifacts found. Run the build first.")
    pre_staged = _git("diff", "--cached", "--name-only")
    if pre_staged.returncode:
        raise RuntimeError(pre_staged.stderr or "Could not inspect the Git index.")
    if pre_staged.stdout.strip():
        raise RuntimeError("Deployment stopped to avoid mixing pre-staged work with catalog changes. "
                           "Commit or unstage the existing index, then retry.")
    print("Automatically staging only the catalog allow-list (not unrelated worktree changes):")
    for path in present:
        print(f"  {path}")
    print("Unrelated worktree changes will not be staged; .env is excluded.")
    add = _git("add", "--", *present)
    if add.returncode:
        raise RuntimeError(add.stderr or "git add failed")
    staged = _git("diff", "--cached", "--name-only")
    staged_paths = [line.strip() for line in staged.stdout.splitlines() if line.strip()]
    if not staged_paths:
        print("No staged changes; nothing to commit.")
        return
    if any(Path(path).name == ".env" for path in staged_paths):
        raise RuntimeError("Refusing to deploy: .env appeared in the staged file list.")
    commit = _git("commit", "-m", "Automated Catalog & X-Ray Update")
    if commit.returncode:
        raise RuntimeError(commit.stderr or "git commit failed")
    push = _git("push", "origin", "main")
    if push.returncode:
        raise RuntimeError(push.stderr or "git push failed; local commit remains available for retry")
    print("Catalog artifacts pushed to origin/main.")


def run_self_tests() -> None:
    assert normalize_digits("۴۸۰۰ × ۲۴۰۰ × ۱۷۵۰") == "4800 × 2400 × 1750"
    sample = "ابعاد کلی دستگاه (L×W×H): 4800 × 2400 × 1750 mm"
    dims, _, _, _ = extract_overall_dimensions(sample)
    assert dims == {"length": 4800, "width": 2400, "height": 1750}, dims
    localized = "ابعاد کلی: ۴٫۸ × ۲٫۴ × ۱٫۷۵ متر"
    dims, _, _, _ = extract_overall_dimensions(localized)
    assert dims == {"length": 4800, "width": 2400, "height": 1750}, dims
    work_area_only = "Working area: 3000 × 1500 mm"
    dims, _, _, _ = extract_overall_dimensions(work_area_only)
    assert dims is None, dims
    mixed = "Overall dimensions: 4.8 m × 240 cm × 1750 mm"
    dims, _, _, _ = extract_overall_dimensions(mixed)
    assert dims == {"length": 4800, "width": 2400, "height": 1750}, dims
    assert _safe_hostname("https://sahandlaser.com/products/x", ["sahandlaser.com"])
    assert not _safe_hostname("http://127.0.0.1/admin", ["sahandlaser.com"])
    image_doc = BeautifulSoup(
        '<meta property="og:image" content="https://sahandlaser.com/logo.png">'
        '<main><img alt="لوگوی سهند" src="https://sahandlaser.com/logo.png">'
        '<img alt="Main Product" src="https://sahandlaser.com/machine.webp"></main>',
        "html.parser",
    )
    assert _product_image_url(image_doc, {}, "https://sahandlaser.com/item/") == "https://sahandlaser.com/machine.webp"
    archive_doc = BeautifulSoup('<a href="https://sahandlaser.com/products/">محصولات</a>', "html.parser").a
    product_doc = BeautifulSoup(
        '<a href="https://sahandlaser.com/sample/">دستگاه برش لیزر تک میز استاندارد 3015</a>',
        "html.parser",
    ).a
    assert not _is_product_link(archive_doc, archive_doc["href"])
    assert _is_product_link(product_doc, product_doc["href"])
    assert slug_for({"model": "3015", "name": "مدل استاندارد"}) != slug_for(
        {"model": "3015", "name": "مدل حرفه‌ای"}
    )
    with tempfile.TemporaryDirectory(prefix="sahand-catalog-test-") as temp:
        temp_root = Path(temp)
        generated_dir = temp_root / "output_catalog"
        generated_dir.mkdir()
        (generated_dir / "sample.png").write_bytes(b"test")
        generated_page = generated_dir / "catalog.html"
        generate_catalog_page(generated_dir, [{"name": "Sample", "model": "S1"}], generated_page)
        generated_markup = generated_page.read_text(encoding="utf-8")
        assert 'href="sample.png"' in generated_markup
        assert 'src="sample.png"' in generated_markup
        assert CATALOG_FILE == OUTPUT_DIR / "catalog.html"
    print("Self-tests passed: localized digits, unit conversion, dimension scope, host allowlist, product-link filtering, and isolated preview output.")


def build(args: argparse.Namespace) -> None:
    trusted_hosts = [host for host in os.getenv("TRUSTED_HOSTS", "sahandlaser.com").split(",") if host.strip()]
    delay = float(os.getenv("REQUEST_DELAY_SECONDS", "1.0"))
    fetcher = SafeFetcher(trusted_hosts, timeout=int(os.getenv("REQUEST_TIMEOUT", "25")), delay=delay)
    products_page = args.products_page or os.getenv("PRODUCTS_PAGE_URL", DEFAULT_PRODUCTS_PAGE)
    urls = read_product_urls(args.links_file, args.product_url, products_page, fetcher)
    if args.max_products:
        urls = urls[:args.max_products]
    if not urls:
        raise RuntimeError("No product URLs to process.")
    default_unit = os.getenv("DEFAULT_DIMENSION_UNIT", "mm")
    records = scrape_products(urls, fetcher, default_unit)
    for record in records:
        if not record.get("reference_image_url"):
            continue
        try:
            saved = download_reference_image(record["reference_image_url"], fetcher, args.reference_dir,
                                             slug_for(record))
            try:
                record["reference_image_path"] = saved.resolve().relative_to(ROOT.resolve()).as_posix()
            except ValueError:
                record["reference_image_path"] = saved.resolve().as_posix()
            LOG.info("Saved reference image for %s: %s", record.get("name"), saved)
        except Exception as exc:
            LOG.exception("Could not download reference image for %s: %s", record.get("name"), exc)
    logo_path = args.logo or (Path(os.getenv("LOGO_PATH")).expanduser() if os.getenv("LOGO_PATH") else None)
    successes = 0
    for record in records:
        slug = slug_for(record)
        xray_path = args.xray_dir / f"{slug}.png"
        if args.generate_images:
            try:
                generate_xray_image(record, xray_path, args.image_model, args.force_images)
            except Exception as exc:
                LOG.exception("Image generation failed for %s: %s", record.get("name"), exc)
        visual_path = xray_path if xray_path.is_file() else None
        visual_type = "xray_concept"
        if visual_path is None and record.get("reference_image_path"):
            candidate = Path(record["reference_image_path"])
            visual_path = candidate if candidate.is_absolute() else ROOT / candidate
            visual_type = "reference_photo"
        if visual_path is not None and visual_path.is_file():
            try:
                create_datasheet(record, visual_path, args.output_dir / f"{slug}.png", logo_path, visual_type)
                record["catalog_visual_type"] = visual_type
                successes += 1
            except Exception as exc:
                LOG.exception("Datasheet creation failed for %s: %s", record.get("name"), exc)
                record["catalog_visual_type"] = "failed"
        else:
            LOG.error("No generated or reference image available for product %s (%s)",
                      record.get("name"), record.get("source_url"))
            record["catalog_visual_type"] = "missing"
    generate_catalog_page(args.output_dir, records, args.catalog_file)
    write_json(args.data_file, {"generated_at": datetime.now(timezone.utc).isoformat(),
                                "source_page": products_page, "units": "mm",
                                "records": records})
    LOG.info("Saved %d product records to %s", len(records), args.data_file)
    LOG.info("Catalog page: %s (%d datasheets)", args.catalog_file, successes)
    if args.deploy:
        deploy_artifacts()
    if not args.no_server:
        run_server(args.port, args.catalog_file.parent)


def make_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Build and locally preview the Sahand Laser product catalog.")
    sub = parser.add_subparsers(dest="command")
    build_parser = sub.add_parser("build", help="Scrape, optionally generate images, create datasheets/catalog, and serve preview")
    build_parser.add_argument("--links-file", type=Path, default=LINKS_FILE)
    build_parser.add_argument("--products-page", help="Products listing URL; defaults to PRODUCTS_PAGE_URL or sahandlaser.com")
    build_parser.add_argument("--product-url", action="append", help="Explicit product URL (repeatable)")
    build_parser.add_argument("--max-products", type=int, help="Limit records for a small test run")
    build_parser.add_argument("--data-file", type=Path, default=DATA_FILE)
    build_parser.add_argument("--xray-dir", type=Path, default=XRAY_DIR)
    build_parser.add_argument("--reference-dir", type=Path, default=ROOT / "reference_images")
    build_parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR)
    build_parser.add_argument("--catalog-file", type=Path, default=CATALOG_FILE)
    build_parser.add_argument("--logo", type=Path, help="Logo image; defaults to logo.png or LOGO_PATH")
    build_parser.add_argument("--generate-images", action="store_true", help="Call the paid Image API for missing conceptual images")
    build_parser.add_argument("--force-images", action="store_true", help="Regenerate even when an image already exists")
    build_parser.add_argument("--image-model", default=os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-2.5-sunburst"))
    build_parser.add_argument("--port", type=int, default=int(os.getenv("PREVIEW_PORT", "3333")))
    build_parser.add_argument("--no-server", action="store_true", help="Build artifacts without starting the local server")
    build_parser.add_argument("--deploy", action="store_true", help="After building, automatically commit and push allow-listed files")
    sub.add_parser("deploy", help="Automatically commit and push only catalog allow-listed files to origin/main")
    sub.add_parser("self-test", help="Run offline checks for numeral/unit extraction and URL safety")
    return parser


def main() -> int:
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s",
                        handlers=[logging.StreamHandler(), logging.FileHandler(ROOT / "error_log.txt", encoding="utf-8")])
    parser = make_parser()
    argv = sys.argv[1:]
    if not argv or argv[0] not in {"build", "deploy", "self-test"}:
        argv.insert(0, "build")
    args = parser.parse_args(argv)
    command = args.command or "build"
    try:
        if command == "self-test":
            run_self_tests()
        elif command == "deploy":
            deploy_artifacts()
        elif command == "build":
            build(args)
        else:
            parser.error(f"Unknown command: {command}")
        return 0
    except KeyboardInterrupt:
        LOG.info("Interrupted by user.")
        return 130
    except Exception as exc:
        LOG.error("Pipeline stopped: %s", exc)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

