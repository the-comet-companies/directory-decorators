#!/usr/bin/env python3
"""
Data Enrichment Pipeline — Printing Service Classification

Tier 1: CSV text field keyword matching (free, instant)
Tier 2: Website crawling + keyword matching (free, ~5-10 min)
Tier 3: Claude Haiku via OpenRouter for remaining NULLs (~$0.80)

Usage: python scripts/enrich_services.py
"""
import os
import sys
from datetime import date

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from enrichment.config import INPUT_CSV, INPUT_CSV_ALT, OUTPUT_CSV, SERVICE_COLUMNS
from enrichment.utils import setup_logging, load_csv, save_csv, count_filled
from enrichment.tier1_parse import run_tier1
from enrichment.tier2_crawl import run_tier2
from enrichment.tier3_llm import run_tier3

import logging

log = logging.getLogger(__name__)


def print_summary(label: str, counts: dict[str, int], total: int):
    log.info(f"\n{'='*60}")
    log.info(f"  {label} ({total} companies)")
    log.info(f"{'='*60}")
    for svc in SERVICE_COLUMNS:
        pct = (counts[svc] / total * 100) if total else 0
        bar = "█" * int(pct / 2) + "░" * (50 - int(pct / 2))
        log.info(f"  {svc:<25} {counts[svc]:>4}/{total}  {pct:5.1f}%  {bar}")
    log.info(f"{'='*60}\n")


def main():
    setup_logging()

    # Find input CSV
    csv_path = INPUT_CSV
    if not os.path.exists(csv_path):
        csv_path = INPUT_CSV_ALT
    if not os.path.exists(csv_path):
        log.error(f"Input CSV not found at {INPUT_CSV} or {INPUT_CSV_ALT}")
        sys.exit(1)

    log.info(f"Loading CSV from: {csv_path}")
    rows = load_csv(csv_path)
    total = len(rows)
    log.info(f"Loaded {total} companies")

    # Initialize enrichment columns
    for row in rows:
        row.setdefault("enrichment_source", "")
        row.setdefault("enrichment_date", "")

    # Baseline
    baseline = count_filled(rows)
    print_summary("BASELINE (before enrichment)", baseline, total)

    # ── Tier 1: CSV keyword parsing ──
    log.info("Starting Tier 1: CSV text field parsing...")
    t1_filled = run_tier1(rows)
    after_t1 = count_filled(rows)
    print_summary("AFTER TIER 1 (CSV parsing)", after_t1, total)

    # ── Tier 2: Web crawling ──
    log.info("Starting Tier 2: Website crawling...")
    t2_filled = run_tier2(rows)
    after_t2 = count_filled(rows)
    print_summary("AFTER TIER 2 (web crawling)", after_t2, total)

    # ── Tier 3: LLM enrichment ──
    log.info("Starting Tier 3: Claude Haiku LLM enrichment...")
    t3_filled = run_tier3(rows)
    after_t3 = count_filled(rows)
    print_summary("AFTER TIER 3 (LLM enrichment)", after_t3, total)

    # Set enrichment date
    today = date.today().isoformat()
    for row in rows:
        if row.get("enrichment_source"):
            row["enrichment_date"] = today

    # Remove internal debug columns
    for row in rows:
        row.pop("_crawl_chars", None)

    # Save
    save_csv(rows, OUTPUT_CSV)
    log.info(f"Saved enriched dataset to: {OUTPUT_CSV}")

    # Final summary
    log.info(f"\nTotal cells filled: Tier1={t1_filled}, Tier2={t2_filled}, Tier3={t3_filled}")
    log.info("Done!")


if __name__ == "__main__":
    main()
