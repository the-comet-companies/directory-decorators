"""Image collection pipeline: Crawl company websites to find logos and service images."""
import asyncio
import logging
import re
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup

from .config import CRAWL_TIMEOUT, CRAWL_RETRIES, SKIP_DOMAINS, SERVICE_COLUMNS

log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

IMAGE_PAGES = ["/", "/gallery", "/portfolio", "/our-work", "/projects", "/services", "/about", "/products"]

# ── Filtering constants ──

FAVICON_PATTERNS = re.compile(r"favicon|apple-touch-icon|icon-\d+|icon\.png|icon\.ico", re.I)
STOCK_DOMAINS = {"shutterstock.com", "istockphoto.com", "unsplash.com", "gettyimages.com",
                 "stock.adobe.com", "depositphotos.com", "pexels.com", "pixabay.com"}
TRACKING_DOMAINS = {"facebook.com/tr", "google-analytics.com", "doubleclick.net", "googletagmanager.com",
                    "pixel", "analytics", "tracking"}
SKIP_EXTENSIONS = {".svg", ".gif", ".ico"}
SKIP_FILENAMES = re.compile(
    r"(payment|visa|mastercard|paypal|amex|discover|ssl|badge|widget|"
    r"social|facebook|twitter|instagram|youtube|linkedin|pinterest|tiktok|"
    r"arrow|chevron|close|menu|hamburger|search|cart|play|pause|"
    r"spinner|loading|placeholder|spacer|blank|pixel|transparent|"
    r"star|rating|review|check|tick|bullet|dot)", re.I
)

LOGO_SIGNALS = re.compile(r"logo|brand|header.*img|site.*img|company.*img", re.I)
LOGO_ALT_SIGNALS = re.compile(r"logo|brand|company", re.I)

SERVICE_IMAGE_KEYWORDS = {
    "screen_printing": re.compile(r"screen\s*print|silk\s*screen|squeegee|plastisol|ink\s*on\s*shirt", re.I),
    "dtg_printing": re.compile(r"dtg|direct.to.garment|digital\s*print.*shirt", re.I),
    "dtf_printing": re.compile(r"dtf|direct.to.film|film\s*transfer", re.I),
    "embroidery": re.compile(r"embroider|stitch|thread|needle|monogram|cap\s*embr", re.I),
    "sublimation": re.compile(r"sublim|dye.sub|all.over.print|mug\s*print", re.I),
    "heat_transfer": re.compile(r"heat\s*transfer|heat\s*press|iron.on|vinyl\s*press", re.I),
    "vinyl_printing": re.compile(r"vinyl|decal|vehicle\s*wrap|car\s*wrap|lettering", re.I),
    "large_format_printing": re.compile(r"large\s*format|wide\s*format|banner|poster|trade\s*show|backdrop", re.I),
    "offset_printing": re.compile(r"offset|lithograph|cmyk|press\s*run", re.I),
    "custom_apparel": re.compile(r"custom\s*(t.?shirt|apparel|hoodie|jersey|hat|cap|uniform)|merch", re.I),
    "signage_printing": re.compile(r"sign(age)?|channel\s*letter|yard\s*sign|window\s*graph|storefront", re.I),
}

# General printing relevance
PRINTING_RELEVANCE = re.compile(
    r"print|shirt|apparel|embroid|stitch|garment|hoodie|jersey|hat|cap|"
    r"banner|sign|poster|vinyl|wrap|sublim|dtg|dtf|screen|press|ink|"
    r"product|portfolio|gallery|work|project|shop|store|facility|equipment|"
    r"production|machine|output|sample|order|custom|design|logo.*print", re.I
)


def _should_skip_domain(domain: str) -> bool:
    return any(skip in domain for skip in SKIP_DOMAINS)


def _is_valid_image_url(url: str) -> bool:
    """Check if URL looks like a real, relevant image."""
    if not url:
        return False
    parsed = urlparse(url)
    path = parsed.path.lower()

    # Skip non-image extensions
    for ext in SKIP_EXTENSIONS:
        if path.endswith(ext):
            return False

    # Must have image-like extension or be from a CDN
    has_img_ext = any(path.endswith(e) for e in [".jpg", ".jpeg", ".png", ".webp", ".avif"])
    has_img_param = "image" in url.lower() or "photo" in url.lower() or "img" in url.lower()
    if not has_img_ext and not has_img_param and "/wp-content/" not in url:
        return False

    # Skip favicons
    if FAVICON_PATTERNS.search(url):
        return False

    # Skip stock photo domains
    if any(d in parsed.netloc for d in STOCK_DOMAINS):
        return False

    # Skip tracking
    if any(d in url for d in TRACKING_DOMAINS):
        return False

    # Skip common UI element filenames
    filename = path.split("/")[-1]
    if SKIP_FILENAMES.search(filename):
        return False

    return True


def _classify_image(url: str, alt: str, context: str, parent_tag: str, company_services: set[str]) -> dict:
    """Classify an image as logo, service_image, or irrelevant."""
    combined = f"{alt} {url} {context}"

    # ── Logo detection ──
    is_logo = False
    if LOGO_ALT_SIGNALS.search(alt):
        is_logo = True
    if LOGO_SIGNALS.search(url):
        is_logo = True
    if parent_tag in ("header", "nav"):
        if "logo" in url.lower() or "logo" in alt.lower() or "brand" in alt.lower():
            is_logo = True

    if is_logo:
        return {"type": "logo", "url": url, "alt": alt, "score": 10}

    # ── Service image scoring ──
    score = 0

    # Check if image matches company's actual services
    for svc, pattern in SERVICE_IMAGE_KEYWORDS.items():
        if svc in company_services and pattern.search(combined):
            score += 5  # Strong match: image matches a service they actually offer

    # General printing relevance
    if PRINTING_RELEVANCE.search(combined):
        score += 2

    # Gallery/portfolio pages get a boost
    if any(kw in url.lower() for kw in ["gallery", "portfolio", "our-work", "project", "sample"]):
        score += 3

    # Alt text with meaningful content (not empty, not just "image")
    if alt and len(alt) > 5 and alt.lower() not in ("image", "photo", "picture", "img"):
        score += 1

    if score >= 2:
        return {"type": "service_image", "url": url, "alt": alt, "score": score}

    return {"type": "irrelevant", "url": url, "alt": alt, "score": score}


def _extract_images_from_html(html: str, base_url: str, company_services: set[str]) -> list[dict]:
    """Extract and classify all images from an HTML page."""
    soup = BeautifulSoup(html, "html.parser")
    images = []
    seen_urls = set()

    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-lazy-src") or ""
        if not src:
            continue

        # Resolve relative URLs
        url = urljoin(base_url, src)
        if url in seen_urls:
            continue
        seen_urls.add(url)

        if not _is_valid_image_url(url):
            continue

        alt = img.get("alt", "")
        # Get surrounding context
        parent = img.find_parent()
        context = ""
        if parent:
            context = parent.get_text(separator=" ", strip=True)[:200]
        parent_tag = ""
        for ancestor in img.parents:
            if ancestor.name in ("header", "nav", "footer", "aside"):
                parent_tag = ancestor.name
                break

        # Skip footer/aside images (usually junk)
        if parent_tag in ("footer", "aside"):
            continue

        classified = _classify_image(url, alt, context, parent_tag, company_services)
        if classified["type"] != "irrelevant":
            images.append(classified)

    return images


async def _crawl_images_for_company(
    client: httpx.AsyncClient, website: str, company_services: set[str], sem: asyncio.Semaphore
) -> tuple[str | None, list[str]]:
    """Crawl a company website and return (logo_url, [image_urls])."""
    parsed = urlparse(website if website.startswith("http") else f"https://{website}")
    base = f"{parsed.scheme}://{parsed.netloc}"

    all_images: list[dict] = []

    for path in IMAGE_PAGES:
        url = urljoin(base, path)
        async with sem:
            for attempt in range(CRAWL_RETRIES + 1):
                try:
                    resp = await client.get(url, follow_redirects=True, timeout=CRAWL_TIMEOUT)
                    if resp.status_code == 200 and "text/html" in resp.headers.get("content-type", ""):
                        page_images = _extract_images_from_html(resp.text, url, company_services)
                        all_images.extend(page_images)
                    break
                except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadError):
                    if attempt < CRAWL_RETRIES:
                        await asyncio.sleep(1)
                    continue
                except Exception:
                    break

    # Deduplicate by URL
    seen = set()
    unique_images = []
    for img in all_images:
        if img["url"] not in seen:
            seen.add(img["url"])
            unique_images.append(img)

    # Separate logos and service images
    logos = sorted([i for i in unique_images if i["type"] == "logo"], key=lambda x: -x["score"])
    service_imgs = sorted([i for i in unique_images if i["type"] == "service_image"], key=lambda x: -x["score"])

    logo_url = logos[0]["url"] if logos else None
    image_urls = [i["url"] for i in service_imgs[:4]]  # Top 4 by score

    return logo_url, image_urls


async def _check_image_accessible(client: httpx.AsyncClient, url: str, sem: asyncio.Semaphore) -> bool:
    """Quick HEAD check to verify image is accessible and has reasonable size."""
    async with sem:
        try:
            resp = await client.head(url, follow_redirects=True, timeout=8)
            if resp.status_code != 200:
                return False
            content_type = resp.headers.get("content-type", "")
            if "image" not in content_type and "octet-stream" not in content_type:
                return False
            # Check minimum size (skip tiny images)
            content_length = resp.headers.get("content-length", "0")
            if int(content_length) < 5000:  # < 5KB likely icon/placeholder
                return False
            return True
        except Exception:
            return False


async def _run_image_collection(rows: list[dict], concurrency: int = 10) -> tuple[int, int]:
    """Crawl all companies for images. Returns (logos_found, images_found)."""
    sem = asyncio.Semaphore(concurrency)
    check_sem = asyncio.Semaphore(20)

    targets = []
    for row in rows:
        website = row.get("website", "").strip()
        domain = row.get("domain", "").strip()
        if not website or _should_skip_domain(domain or website):
            continue
        targets.append(row)

    log.info(f"Crawling {len(targets)} company websites for images...")

    logos_found = 0
    images_found = 0

    async with httpx.AsyncClient(headers=HEADERS, verify=False) as client:
        # Phase 1: Crawl for images
        tasks = []
        for row in targets:
            website = row["website"]
            if not website.startswith("http"):
                website = "https://" + website

            # Get this company's services for relevance matching
            services = {col for col in SERVICE_COLUMNS if row.get(col) in ("1", "TRUE", "true", True)}
            tasks.append(_crawl_images_for_company(client, website, services, sem))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Phase 2: Verify images are accessible
        for row, result in zip(targets, results):
            if isinstance(result, Exception):
                continue

            logo_url, image_urls = result

            # Verify logo
            if logo_url:
                if await _check_image_accessible(client, logo_url, check_sem):
                    row["logo_url"] = logo_url
                    logos_found += 1

            # Verify service images
            verified_images = []
            for img_url in image_urls:
                if await _check_image_accessible(client, img_url, check_sem):
                    verified_images.append(img_url)
                if len(verified_images) >= 4:
                    break

            if verified_images:
                row["image_urls"] = "|".join(verified_images)
                images_found += len(verified_images)

        # Progress
        total_with_logo = sum(1 for r in rows if r.get("logo_url"))
        total_with_images = sum(1 for r in rows if r.get("image_urls"))
        log.info(f"Companies with logo: {total_with_logo}/{len(rows)}")
        log.info(f"Companies with service images: {total_with_images}/{len(rows)}")

    return logos_found, images_found


def run_image_collection(rows: list[dict]) -> tuple[int, int]:
    """Run the image collection pipeline. Returns (logos_found, total_images_found)."""
    return asyncio.run(_run_image_collection(rows))
