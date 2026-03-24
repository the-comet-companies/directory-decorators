#!/usr/bin/env python3
"""
Fetch gallery images for companies missing images.
Tries WordPress media API first, then scrapes homepage/gallery.
"""
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

JSON_PATH = "c:/Users/Rogelio/Documents/DTLA/src/lib/companies.json"
MAX_WORKERS = 10
REQUEST_TIMEOUT = 8
MAX_IMAGES = 5

SKIP_EXTENSIONS = {'.svg', '.gif', '.ico', '.bmp', '.webm', '.mp4'}
SKIP_URL_PATTERNS = [
    'logo', 'favicon', 'icon', 'avatar', 'badge', 'button', 'banner-ad',
    'pixel', 'tracking', 'analytics', 'font', 'sprite', 'placeholder',
    'loading', 'spinner', 'star', 'rating', 'social', 'share', 'arrow',
    'bg-', 'background', 'header-logo', 'footer-logo',
]
GOOD_URL_PATTERNS = [
    'gallery', 'portfolio', 'print', 'shirt', 'apparel', 'custom',
    'screen', 'embroid', 'product', 'photo', 'work', 'sample', 'shop',
    'upload', 'img', 'image',
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
}

session = requests.Session()
session.headers.update(HEADERS)


def is_good_image(url: str) -> bool:
    url_lower = url.lower()
    parsed = urlparse(url_lower)
    path = parsed.path

    # Skip bad extensions
    for ext in SKIP_EXTENSIONS:
        if path.endswith(ext):
            return False

    # Must end with image extension
    if not re.search(r'\.(jpe?g|png|webp)(\?.*)?$', url_lower):
        return False

    # Skip obvious non-photo patterns
    for pattern in SKIP_URL_PATTERNS:
        if pattern in url_lower:
            return False

    return True


def score_image(url: str) -> int:
    url_lower = url.lower()
    score = 0
    for pattern in GOOD_URL_PATTERNS:
        if pattern in url_lower:
            score += 1
    return score


def get_images_from_html(html: str, base_url: str) -> list[str]:
    soup = BeautifulSoup(html, 'html.parser')
    found = []

    for img in soup.find_all('img'):
        # Try multiple src attributes (lazy loading)
        for attr in ('src', 'data-src', 'data-lazy-src', 'data-original', 'data-full-url'):
            src = img.get(attr, '')
            if src and src.startswith('http'):
                found.append(src)
                break
            elif src and src.startswith('/'):
                found.append(urljoin(base_url, src))
                break

    # Also check srcset
    for img in soup.find_all(['img', 'source']):
        srcset = img.get('srcset', '') or img.get('data-srcset', '')
        if srcset:
            for part in srcset.split(','):
                url = part.strip().split(' ')[0]
                if url.startswith('http'):
                    found.append(url)
                elif url.startswith('/'):
                    found.append(urljoin(base_url, url))

    # Filter and deduplicate
    seen = set()
    good = []
    for url in found:
        if url not in seen and is_good_image(url):
            seen.add(url)
            good.append(url)

    # Sort by score (prefer gallery/product images)
    good.sort(key=score_image, reverse=True)
    return good


def try_wordpress_api(base_url: str) -> list[str]:
    """Try WordPress REST API to get media images."""
    api_url = base_url.rstrip('/') + '/wp-json/wp/v2/media?per_page=10&mime_type=image'
    try:
        r = session.get(api_url, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, list) and data:
                images = []
                for item in data:
                    src = item.get('source_url', '')
                    if src and is_good_image(src):
                        images.append(src)
                return images[:MAX_IMAGES]
    except Exception:
        pass
    return []


def fetch_images_for_company(company: dict) -> tuple[str, list[str]]:
    """Returns (slug, list_of_image_urls)."""
    slug = company['slug']
    website = company.get('website', '').strip()

    if not website:
        return slug, []

    # Normalize website URL
    if not website.startswith('http'):
        website = 'https://' + website

    # Parse base URL
    parsed = urlparse(website)
    base_url = f"{parsed.scheme}://{parsed.netloc}"

    # Skip Facebook / social media pages - no direct images available
    if any(domain in parsed.netloc for domain in ['facebook.com', 'instagram.com', 'twitter.com', 'yelp.com']):
        return slug, []

    images = []

    # 1. Try WordPress media API
    wp_images = try_wordpress_api(base_url)
    if wp_images:
        return slug, wp_images[:MAX_IMAGES]

    # 2. Scrape homepage
    try:
        r = session.get(website, timeout=REQUEST_TIMEOUT, allow_redirects=True)
        if r.status_code == 200:
            images = get_images_from_html(r.text, base_url)
    except Exception:
        pass

    if len(images) >= MAX_IMAGES:
        return slug, images[:MAX_IMAGES]

    # 3. Try gallery/portfolio page
    for path in ['/gallery', '/portfolio', '/work', '/gallery/', '/portfolio/']:
        try:
            r = session.get(base_url + path, timeout=REQUEST_TIMEOUT, allow_redirects=True)
            if r.status_code == 200 and 'text/html' in r.headers.get('content-type', ''):
                extra = get_images_from_html(r.text, base_url)
                seen = set(images)
                for img in extra:
                    if img not in seen:
                        images.append(img)
                        seen.add(img)
                if len(images) >= MAX_IMAGES:
                    break
        except Exception:
            pass

    return slug, images[:MAX_IMAGES]


def main():
    with open(JSON_PATH, encoding='utf-8') as f:
        data = json.load(f)

    # Find companies with empty images
    to_update = [
        p for p in data
        if not p.get('galleryImages') and not p.get('coverImage')
        and p.get('website', '').strip()
        and 'facebook.com' not in p.get('website', '')
        and 'instagram.com' not in p.get('website', '')
    ]

    print(f"Processing {len(to_update)} companies...", flush=True)

    # Build slug -> index map for fast updates
    slug_to_idx = {p['slug']: i for i, p in enumerate(data)}

    updated_count = 0
    failed_count = 0
    done = 0

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(fetch_images_for_company, c): c for c in to_update}

        for future in as_completed(futures):
            done += 1
            company = futures[future]
            try:
                slug, images = future.result()
                if images:
                    idx = slug_to_idx.get(slug)
                    if idx is not None:
                        data[idx]['galleryImages'] = images
                        data[idx]['coverImage'] = images[0]
                        updated_count += 1
                else:
                    failed_count += 1
            except Exception as e:
                failed_count += 1

            if done % 25 == 0 or done == len(to_update):
                print(f"  {done}/{len(to_update)} done — {updated_count} updated, {failed_count} no images", flush=True)

    # Save
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"\nDone! Updated {updated_count} companies. {failed_count} had no images available.")


if __name__ == '__main__':
    main()
