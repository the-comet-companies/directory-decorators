"""Tier 1: Enrich service columns from existing CSV text fields."""
import logging
from .keywords import match_services
from .utils import is_filled
from .config import SERVICE_COLUMNS

log = logging.getLogger(__name__)

TEXT_FIELDS = ["raw_service_types", "raw_service_names", "specialties", "description"]


def run_tier1(rows: list[dict]) -> int:
    """Parse CSV text columns with keyword matching. Returns count of cells filled."""
    filled = 0
    for row in rows:
        # Combine all text fields into one blob
        blob = " ".join(row.get(f, "") or "" for f in TEXT_FIELDS)
        if not blob.strip():
            continue

        matches = match_services(blob)
        for svc, found in matches.items():
            if found and not is_filled(row, svc):
                row[svc] = "1"
                filled += 1
                # Track enrichment source
                src = row.get("enrichment_source", "")
                if "tier1" not in src:
                    row["enrichment_source"] = (src + "|tier1_csv_parse").strip("|")

    log.info(f"Tier 1 complete: filled {filled} cells from CSV text fields")
    return filled
