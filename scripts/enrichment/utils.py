import csv
import logging
import os
from .config import SERVICE_COLUMNS


def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%H:%M:%S",
    )


def load_csv(path: str) -> list[dict]:
    with open(path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        return list(reader)


def save_csv(rows: list[dict], path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not rows:
        return
    fieldnames = list(rows[0].keys())
    with open(path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def get_unfilled_services(row: dict) -> list[str]:
    """Return service columns that are still empty/falsy for this row."""
    return [col for col in SERVICE_COLUMNS if not row.get(col)]


def is_filled(row: dict, col: str) -> bool:
    val = row.get(col, "")
    return val in ("1", "TRUE", "True", "true", True)


def count_filled(rows: list[dict]) -> dict[str, int]:
    """Count how many rows have each service filled."""
    counts = {}
    for col in SERVICE_COLUMNS:
        counts[col] = sum(1 for r in rows if is_filled(r, col))
    return counts
