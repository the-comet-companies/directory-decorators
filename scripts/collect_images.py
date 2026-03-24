#!/usr/bin/env python3
"""
Image Collection Pipeline — Find logos and service images for printing companies.

Crawls company websites to extract:
- 1 logo_url per company
- 2-4 image_urls (service/product/shop photos)

Usage: python scripts/collect_images.py
"""
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from enrichment.utils import setup_logging, load_csv, save_csv
from enrichment.image_collector import run_image_collection

import logging

log = logging.getLogger(__name__)

INPUT_CSV = os.path.join(os.path.dirname(__file__), "..", "companies", "enriched-dataset.csv")
OUTPUT_CSV = os.path.join(os.path.dirname(__file__), "..", "companies", "enriched-dataset.csv")  # Update in place


def main():
    setup_logging()

    if not os.path.exists(INPUT_CSV):
        log.error(f"Input not found: {INPUT_CSV}")
        sys.exit(1)

    log.info(f"Loading from: {INPUT_CSV}")
    rows = load_csv(INPUT_CSV)
    log.info(f"Loaded {len(rows)} companies")

    # Initialize columns
    for row in rows:
        row.setdefault("logo_url", row.get("logo_url", ""))
        row.setdefault("image_urls", "")

    # Count existing
    existing_logos = sum(1 for r in rows if r.get("logo_url"))
    existing_images = sum(1 for r in rows if r.get("image_urls"))
    log.info(f"Existing: {existing_logos} logos, {existing_images} companies with images")

    # Run collection
    logos_found, images_found = run_image_collection(rows)

    # Summary
    final_logos = sum(1 for r in rows if r.get("logo_url"))
    final_with_images = sum(1 for r in rows if r.get("image_urls"))
    total_images = sum(len(r.get("image_urls", "").split("|")) for r in rows if r.get("image_urls"))

    log.info(f"\n{'='*60}")
    log.info(f"  IMAGE COLLECTION RESULTS")
    log.info(f"{'='*60}")
    log.info(f"  Companies with logo:    {final_logos}/{len(rows)}")
    log.info(f"  Companies with images:  {final_with_images}/{len(rows)}")
    log.info(f"  Total service images:   {total_images}")
    log.info(f"  New logos found:        {logos_found}")
    log.info(f"  New images found:       {images_found}")
    log.info(f"{'='*60}")

    # Image count distribution
    dist = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0}
    for r in rows:
        urls = r.get("image_urls", "")
        count = len(urls.split("|")) if urls else 0
        dist[min(count, 4)] = dist.get(min(count, 4), 0) + 1
    log.info(f"  Distribution: 0 imgs={dist[0]}, 1={dist[1]}, 2={dist[2]}, 3={dist[3]}, 4+={dist[4]}")

    # Save
    save_csv(rows, OUTPUT_CSV)
    log.info(f"Saved to: {OUTPUT_CSV}")
    log.info("Done!")


if __name__ == "__main__":
    main()
