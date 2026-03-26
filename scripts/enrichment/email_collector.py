"""Email extraction pipeline: Crawl company websites to find contact emails."""
import asyncio
import logging
import re
from urllib.parse import urlparse, urljoin

import httpx
from bs4 import BeautifulSoup

from .config import CRAWL_TIMEOUT, CRAWL_RETRIES, SKIP_DOMAINS

log = logging.getLogger(__name__)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

EMAIL_PAGES = [
    "/contact", "/contact-us", "/about", "/about-us", "/",
    "/get-in-touch", "/reach-us", "/info", "/support",
    "/pages/contact", "/pages/about", "/footer",
    "/connect", "/location", "/locations", "/find-us",
    "/get-a-quote", "/request-a-quote", "/quote",
]

# Regex to find emails in page content
EMAIL_REGEX = re.compile(
    r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}",
    re.IGNORECASE,
)

# Emails to skip — generic/junk/platform emails
SKIP_EMAILS = re.compile(
    r"(noreply|no-reply|donotreply|example\.com|test@|admin@wordpress|"
    r"wix\.com|squarespace\.com|godaddy\.com|shopify\.com|weebly\.com|"
    r"sentry\.io|gravatar\.com|schema\.org|googleusercontent|"
    r"support@wordpress|changeme@|email@example|your@email|"
    r"user@|sample@|placeholder@|demo@|info@change|"
    r"\.png$|\.jpg$|\.gif$|\.svg$|\.css$|\.js$)",
    re.IGNORECASE,
)

# Prefer business-relevant emails in this order
EMAIL_PRIORITY = [
    re.compile(r"^(info|hello|contact|sales|orders|print|quotes?)@", re.I),  # Best
    re.compile(r"^[a-z]+@", re.I),  # Named person emails (e.g. john@company.com)
]


def _should_skip_domain(domain: str) -> bool:
    return any(skip in domain for skip in SKIP_DOMAINS)


def _extract_emails_from_html(html: str, company_domain: str) -> list[str]:
    """Extract emails from HTML, including mailto: links and visible text."""
    emails = set()

    soup = BeautifulSoup(html, "html.parser")

    # 1. Extract from mailto: links (most reliable)
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("mailto:"):
            email = href.replace("mailto:", "").split("?")[0].strip().lower()
            if email and "@" in email:
                emails.add(email)

    # 2. Extract from page text
    text = soup.get_text(separator=" ", strip=True)
    for match in EMAIL_REGEX.findall(text):
        emails.add(match.lower())

    # 3. Extract from raw HTML (catches obfuscated emails in attributes)
    for match in EMAIL_REGEX.findall(html):
        emails.add(match.lower())

    # Filter out junk
    valid = []
    for email in emails:
        if SKIP_EMAILS.search(email):
            continue
        # Must have a valid TLD
        domain_part = email.split("@")[1]
        if "." not in domain_part:
            continue
        if len(domain_part) < 4:
            continue
        valid.append(email)

    # Sort by priority — prefer emails matching company domain, then by type
    def score(email: str) -> int:
        s = 0
        # Prefer emails from company's own domain
        if company_domain and company_domain in email:
            s += 100
        for i, pattern in enumerate(EMAIL_PRIORITY):
            if pattern.search(email):
                s += (10 - i)
                break
        return s

    valid.sort(key=lambda e: -score(e))
    return valid


async def _crawl_emails_for_company(
    client: httpx.AsyncClient, website: str, domain: str, sem: asyncio.Semaphore
) -> list[str]:
    """Crawl a company's website and return found emails."""
    parsed = urlparse(website if website.startswith("http") else f"https://{website}")
    base = f"{parsed.scheme}://{parsed.netloc}"
    all_emails: list[str] = []
    seen = set()

    for path in EMAIL_PAGES:
        url = urljoin(base, path)
        async with sem:
            for attempt in range(CRAWL_RETRIES + 1):
                try:
                    resp = await client.get(url, follow_redirects=True, timeout=CRAWL_TIMEOUT)
                    if resp.status_code == 200 and "text/html" in resp.headers.get("content-type", ""):
                        found = _extract_emails_from_html(resp.text, domain)
                        for e in found:
                            if e not in seen:
                                seen.add(e)
                                all_emails.append(e)
                    break
                except (httpx.TimeoutException, httpx.ConnectError, httpx.ReadError):
                    if attempt < CRAWL_RETRIES:
                        await asyncio.sleep(1)
                    continue
                except Exception:
                    break

    return all_emails


async def _run_email_collection(rows: list[dict], concurrency: int = 10) -> int:
    """Crawl all companies for emails. Returns count of companies with emails found."""
    sem = asyncio.Semaphore(concurrency)

    targets = []
    for row in rows:
        website = row.get("website", "").strip()
        domain = row.get("domain", "").strip()
        if not website or _should_skip_domain(domain or website):
            continue
        # Skip if already has email
        if row.get("emails", "").strip():
            continue
        targets.append(row)

    log.info(f"Crawling {len(targets)} company websites for emails...")
    found_count = 0

    async with httpx.AsyncClient(headers=HEADERS, verify=False) as client:
        tasks = []
        for row in targets:
            website = row["website"]
            if not website.startswith("http"):
                website = "https://" + website
            domain = row.get("domain", "")
            tasks.append(_crawl_emails_for_company(client, website, domain, sem))

        results = await asyncio.gather(*tasks, return_exceptions=True)

        for row, result in zip(targets, results):
            if isinstance(result, Exception) or not result:
                continue
            # Store the best email (first one, already sorted by priority)
            row["emails"] = result[0]
            found_count += 1

    return found_count


def run_email_collection(rows: list[dict]) -> int:
    """Run the email collection pipeline. Returns count of companies with emails found."""
    return asyncio.run(_run_email_collection(rows))
