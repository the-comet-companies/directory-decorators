"""Tier 1: Enrich feature columns from existing CSV text fields."""
import logging
from .feature_keywords import match_features
from .utils import is_filled

log = logging.getLogger(__name__)

TEXT_FIELDS = ["raw_service_types", "raw_service_names", "specialties", "description"]


def run_tier1_features(rows: list[dict]) -> int:
    """Parse CSV text columns with keyword matching for features. Returns count of cells filled."""
    filled = 0
    for row in rows:
        blob = " ".join(row.get(f, "") or "" for f in TEXT_FIELDS)
        if not blob.strip():
            continue

        matches = match_features(blob)
        for feat, found in matches.items():
            if found and not is_filled(row, feat):
                row[feat] = "1"
                filled += 1
                src = row.get("feature_enrichment_source", "")
                if "tier1" not in src:
                    row["feature_enrichment_source"] = (src + "|tier1_csv").strip("|")

    log.info(f"Feature Tier 1 complete: filled {filled} cells from CSV text fields")
    return filled
