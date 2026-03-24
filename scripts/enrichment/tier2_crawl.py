"""Tier 2: Crawl company websites and extract services via keyword matching."""
import asyncio
import logging
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup

from .keywords import match_services
from .utils import get_unfilled_services, is_filled
from .config import CRAWL_PATHS, CRAWL_TIMEOUT, CRAWL_CONCURRENCY, CRAWL_RETRIES, SKIP_DOMAINS

log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}


def _should_skip(domain: str) -> bool:
    return any(skip in domain for skip in SKIP_DOMAINS)


def _extract_text(html: str) -> str:
    """Extract visible text from HTML, stripping nav/footer/scripts."""
    soup = BeautifulSoup(html, "html.parser")
    # Remove noise elements
    for tag in soup(["script", "style", "nav", "footer", "header", "noscript", "iframe"]):
        tag.decompose()
    return soup.get_text(separator=" ", strip=True)


async def _crawl_one(client: httpx.AsyncClient, base_url: str, sem: asyncio.Semaphore) -> str:
    """Crawl a single company's website pages and return combined text."""
    texts = []
    parsed = urlparse(base_url)
    base = f"{parsed.scheme}://{parsed.netloc}"

    for path in CRAWL_PATHS:
        url = urljoin(base, path)
        async with sem:
            for attempt in range(CRAWL_RETRIES + 1):
                try:
                    resp = await client.get(url, follow_redirects=True, timeout=CRAWL_TIMEOUT)
                    if resp.status_code == 200 and "text/html" in resp.headers.get("content-type", ""):
                        text = _extract_text(resp.text)
                        if len(text) > 50:  # Skip near-empty pages
                            texts.append(text)
                    break  # Success or non-retryable status
                except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadError):
                    if attempt < CRAWL_RETRIES:
                        await asyncio.sleep(1)
                    continue
                except Exception:
                    break  # Don't retry on unexpected errors

    return " ".join(texts)


async def _crawl_batch(rows: list[dict]) -> int:
    """Crawl all company websites concurrently. Returns cells filled."""
    filled = 0
    sem = asyncio.Semaphore(CRAWL_CONCURRENCY)

    # Filter to rows that have a website and unfilled services
    targets = []
    for row in rows:
        website = row.get("website", "").strip()
        domain = row.get("domain", "").strip()
        if not website or _should_skip(domain or website):
            continue
        unfilled = get_unfilled_services(row)
        if not unfilled:
            continue
        targets.append(row)

    log.info(f"Tier 2: crawling {len(targets)} company websites (concurrency={CRAWL_CONCURRENCY})")

    async with httpx.AsyncClient(headers=HEADERS, verify=False) as client:
        tasks = []
        for row in targets:
            website = row["website"]
            if not website.startswith("http"):
                website = "https://" + website
            tasks.append(_crawl_one(client, website, sem))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for row, result in zip(targets, results):
            if isinstance(result, Exception) or not result:
                continue

            matches = match_services(result)
            for svc, found in matches.items():
                if found and not is_filled(row, svc):
                    row[svc] = "1"
                    filled += 1
                    src = row.get("enrichment_source", "")
                    if "tier2" not in src:
                        row["enrichment_source"] = (src + "|tier2_web_crawl").strip("|")

            # Store crawled text length for debugging
            row["_crawl_chars"] = str(len(result))

    return filled


def run_tier2(rows: list[dict]) -> int:
    """Run the web crawling tier. Returns count of cells filled."""
    filled = asyncio.run(_crawl_batch(rows))
    log.info(f"Tier 2 complete: filled {filled} cells from website crawling")
    return filled
