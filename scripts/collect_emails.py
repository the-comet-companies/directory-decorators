#!/usr/bin/env python3
"""
Email Collection Pipeline — Extract contact emails from company websites.

Usage: python scripts/collect_emails.py
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from enrichment.utils import setup_logging, load_csv, save_csv
from enrichment.email_collector import run_email_collection

import logging

log = logging.getLogger(__name__)

INPUT_CSV = os.path.join(os.path.dirname(__file__), "..", "companies", "enriched-dataset.csv")
OUTPUT_CSV = INPUT_CSV


def main():
    setup_logging()

    if not os.path.exists(INPUT_CSV):
        log.error(f"Input not found: {INPUT_CSV}")
        sys.exit(1)

    log.info(f"Loading from: {INPUT_CSV}")
    rows = load_csv(INPUT_CSV)
    total = len(rows)
    log.info(f"Loaded {total} companies")

    existing = sum(1 for r in rows if r.get("emails", "").strip())
    log.info(f"Existing emails: {existing}/{total}")

    found = run_email_collection(rows)

    final = sum(1 for r in rows if r.get("emails", "").strip())
    log.info(f"\n{'='*50}")
    log.info(f"  EMAIL COLLECTION RESULTS")
    log.info(f"{'='*50}")
    log.info(f"  Companies with email: {final}/{total}")
    log.info(f"  New emails found:     {found}")
    log.info(f"{'='*50}")

    # Show some examples
    samples = [r for r in rows if r.get("emails", "").strip()][:10]
    for s in samples:
        log.info(f"  {s['business_name']}: {s['emails']}")

    save_csv(rows, OUTPUT_CSV)
    log.info(f"\nSaved to: {OUTPUT_CSV}")

    # Also regenerate companies.json
    log.info("Regenerating companies.json...")
    os.system(f'python "{os.path.join(os.path.dirname(__file__), "csv_to_json.py")}"')
    log.info("Done!")


if __name__ == "__main__":
    main()
