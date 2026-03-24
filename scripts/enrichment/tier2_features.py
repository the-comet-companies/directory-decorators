"""Tier 2: Crawl company websites and extract features via keyword matching."""
import asyncio
import logging
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup

from .feature_keywords import match_features, FEATURE_COLUMNS
from .utils import is_filled
from .config import CRAWL_TIMEOUT, CRAWL_RETRIES, SKIP_DOMAINS

log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# Pages most likely to contain feature/capability info
FEATURE_PAGES = ["/", "/about", "/services", "/faq", "/shipping", "/our-services", "/why-us", "/contact"]


def _should_skip(domain: str) -> bool:
    return any(skip in domain for skip in SKIP_DOMAINS)


def _extract_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "nav", "noscript", "iframe"]):
        tag.decompose()
    return soup.get_text(separator=" ", strip=True)


def _get_unfilled_features(row: dict) -> list[str]:
    return [col for col in FEATURE_COLUMNS if not is_filled(row, col)]


async def _crawl_features_for_company(
    client: httpx.AsyncClient, website: str, sem: asyncio.Semaphore
) -> str:
    """Crawl a company's website and return combined text from relevant pages."""
    parsed = urlparse(website if website.startswith("http") else f"https://{website}")
    base = f"{parsed.scheme}://{parsed.netloc}"
    texts = []

    for path in FEATURE_PAGES:
        url = urljoin(base, path)
        async with sem:
            for attempt in range(CRAWL_RETRIES + 1):
                try:
                    resp = await client.get(url, follow_redirects=True, timeout=CRAWL_TIMEOUT)
                    if resp.status_code == 200 and "text/html" in resp.headers.get("content-type", ""):
                        text = _extract_text(resp.text)
                        if len(text) > 50:
                            texts.append(text)
                    break
                except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadError):
                    if attempt < CRAWL_RETRIES:
                        await asyncio.sleep(1)
                    continue
                except Exception:
                    break

    return " ".join(texts)


async def _crawl_batch(rows: list[dict], concurrency: int = 10) -> int:
    filled = 0
    sem = asyncio.Semaphore(concurrency)

    targets = []
    for row in rows:
        website = row.get("website", "").strip()
        domain = row.get("domain", "").strip()
        if not website or _should_skip(domain or website):
            continue
        if not _get_unfilled_features(row):
            continue
        targets.append(row)

    log.info(f"Feature Tier 2: crawling {len(targets)} websites (concurrency={concurrency})")

    async with httpx.AsyncClient(headers=HEADERS, verify=False) as client:
        tasks = []
        for row in targets:
            website = row["website"]
            if not website.startswith("http"):
                website = "https://" + website
            tasks.append(_crawl_features_for_company(client, website, sem))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for row, result in zip(targets, results):
            if isinstance(result, Exception) or not result:
                continue

            matches = match_features(result)
            for feat, found in matches.items():
                if found and not is_filled(row, feat):
                    row[feat] = "1"
                    filled += 1
                    src = row.get("feature_enrichment_source", "")
                    if "tier2" not in src:
                        row["feature_enrichment_source"] = (src + "|tier2_web").strip("|")

    return filled


def run_tier2_features(rows: list[dict]) -> int:
    filled = asyncio.run(_crawl_batch(rows))
    log.info(f"Feature Tier 2 complete: filled {filled} cells from website crawling")
    return filled
