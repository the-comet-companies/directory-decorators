#!/usr/bin/env python3
"""
Feature Enrichment Pipeline — Business Capabilities & Features

Tier 1: CSV text field keyword matching (free, instant)
Tier 2: Website crawling + keyword matching (free, ~10 min)
Tier 3: Claude Haiku via OpenRouter (~$0.50)

Usage: python scripts/enrich_features.py
"""
import os
import sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from enrichment.utils import setup_logging, load_csv, save_csv, is_filled
from enrichment.feature_keywords import FEATURE_COLUMNS
from enrichment.tier1_features import run_tier1_features
from enrichment.tier2_features import run_tier2_features
from enrichment.tier3_features import run_tier3_features

import logging

log = logging.getLogger(__name__)

INPUT_CSV = os.path.join(os.path.dirname(__file__), "..", "companies", "enriched-dataset.csv")
OUTPUT_CSV = INPUT_CSV  # Update in place


def count_features(rows: list[dict]) -> dict[str, int]:
    return {col: sum(1 for r in rows if is_filled(r, col)) for col in FEATURE_COLUMNS}


def print_summary(label: str, counts: dict[str, int], total: int):
    log.info(f"\n{'='*65}")
    log.info(f"  {label} ({total} companies)")
    log.info(f"{'='*65}")

    groups = {
        "PRODUCTION": ["rush_orders", "same_day_printing", "bulk_orders", "small_batch", "pantone_matching", "eco_friendly"],
        "SERVICE": ["custom_design", "art_setup", "online_ordering", "free_quotes", "brand_consulting", "contract_printing"],
        "FULFILLMENT": ["local_pickup", "nationwide_shipping", "international_shipping", "delivery", "dropshipping", "warehousing"],
    }

    for group_name, cols in groups.items():
        log.info(f"\n  {group_name}:")
        for col in cols:
            c = counts.get(col, 0)
            pct = (c / total * 100) if total else 0
            bar = "#" * int(pct / 2) + "." * (50 - int(pct / 2))
            log.info(f"    {col:<25} {c:>4}/{total}  {pct:5.1f}%  {bar}")

    log.info(f"\n{'='*65}")


def main():
    setup_logging()

    if not os.path.exists(INPUT_CSV):
        log.error(f"Input not found: {INPUT_CSV}")
        sys.exit(1)

    log.info(f"Loading from: {INPUT_CSV}")
    rows = load_csv(INPUT_CSV)
    total = len(rows)
    log.info(f"Loaded {total} companies")

    # Initialize columns
    for row in rows:
        for col in FEATURE_COLUMNS:
            row.setdefault(col, "")
        row.setdefault("feature_enrichment_source", "")

    # Baseline
    baseline = count_features(rows)
    print_summary("BASELINE", baseline, total)

    # Tier 1
    log.info("Starting Feature Tier 1: CSV text parsing...")
    t1 = run_tier1_features(rows)
    print_summary("AFTER TIER 1 (CSV parsing)", count_features(rows), total)

    # Tier 2
    log.info("Starting Feature Tier 2: Website crawling...")
    t2 = run_tier2_features(rows)
    print_summary("AFTER TIER 2 (web crawling)", count_features(rows), total)

    # Tier 3
    log.info("Starting Feature Tier 3: Claude Haiku LLM...")
    t3 = run_tier3_features(rows)
    print_summary("AFTER TIER 3 (LLM)", count_features(rows), total)

    # Save
    save_csv(rows, OUTPUT_CSV)
    log.info(f"\nSaved to: {OUTPUT_CSV}")
    log.info(f"Total cells filled: Tier1={t1}, Tier2={t2}, Tier3={t3}, Grand total={t1+t2+t3}")
    log.info("Done!")


if __name__ == "__main__":
    main()
