#!/usr/bin/env python3
"""
Convert enriched-dataset.csv to the companies.json format the Next.js app expects.

Usage: python scripts/csv_to_json.py
"""
import csv
import json
import os
import re
import sys

INPUT_CSV = os.path.join(os.path.dirname(__file__), "..", "companies", "enriched-dataset.csv")
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "..", "src", "lib", "companies.json")

SERVICE_MAP = {
    "screen_printing": "Screen Printing",
    "dtg_printing": "DTG Printing",
    "dtf_printing": "DTF Printing",
    "embroidery": "Embroidery",
    "sublimation": "Sublimation",
    "heat_transfer": "Heat Transfer",
    "vinyl_printing": "Vinyl Printing",
    "large_format_printing": "Large Format Printing",
    "offset_printing": "Offset Printing",
    "custom_apparel": "Custom Apparel",
    "signage_printing": "Signage Printing",
}

# Map CSV product categories to display names
PRODUCT_CATEGORIES = {
    "caps": "Caps",
    "custom apparel": "Custom Apparel",
    "polos": "Polos",
    "t-shirts": "T-Shirts",
    "hoodies": "Hoodies & Sweatshirts",
    "jackets": "Jackets",
    "bags": "Bags & Totes",
    "uniforms": "Uniforms",
    "hats": "Hats",
    "promotional products": "Promotional Products",
}


def slugify(text: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')


def is_true(val: str) -> bool:
    return val in ("1", "TRUE", "True", "true", True)


def parse_float(val: str, default=0.0) -> float:
    try:
        return float(val) if val else default
    except (ValueError, TypeError):
        return default


def parse_int(val: str, default=0) -> int:
    try:
        return int(float(val)) if val else default
    except (ValueError, TypeError):
        return default


def parse_services(row: dict) -> list[str]:
    """Build servicesOffered from binary service columns."""
    services = []
    for col, label in SERVICE_MAP.items():
        if is_true(row.get(col, "")):
            services.append(label)
    return services


def parse_product_categories(row: dict) -> list[str]:
    """Extract product categories from raw_service_names or description."""
    raw = (row.get("raw_service_names", "") or "").lower()
    cats = []
    for key, label in PRODUCT_CATEGORIES.items():
        if key in raw:
            cats.append(label)
    # If they do custom apparel, add T-Shirts as default category
    if is_true(row.get("custom_apparel", "")) and not cats:
        cats.append("T-Shirts")
        cats.append("Custom Apparel")
    return cats


def parse_gallery_images(row: dict) -> list[str]:
    """Parse pipe-delimited image_urls into a list."""
    urls = row.get("image_urls", "") or ""
    if not urls:
        return []
    return [u.strip() for u in urls.split("|") if u.strip()]


def build_description(row: dict) -> str:
    """Build a better description from available data."""
    desc = row.get("description", "") or ""
    name = row.get("business_name", "") or ""
    city = row.get("city", "") or ""
    state = row.get("state", "") or ""

    # If description is just the generic boilerplate, build a better one
    if desc.startswith("Professional printing services in") or not desc:
        services = parse_services(row)
        if services:
            svc_text = ", ".join(services[:4])
            desc = f"{name} offers {svc_text} services in {city}, {state}."
        else:
            desc = f"{name} provides professional printing services in {city}, {state}."

    return desc


def convert_row(row: dict) -> dict:
    name = row.get("business_name", "") or ""
    city = row.get("city", "") or ""
    state = row.get("state", "") or ""
    source_id = row.get("source_id", "") or ""

    slug = source_id if source_id else slugify(f"{name}-{city}-{state}")
    description = build_description(row)
    services = parse_services(row)
    gallery = parse_gallery_images(row)
    cover = row.get("coverImage", "") or row.get("cover_image", "") or ""

    # Use first gallery image as cover if no cover exists
    if not cover and gallery:
        cover = gallery[0]

    logo = row.get("logo_url", "") or ""

    lat = parse_float(row.get("latitude", ""), 0)
    lng = parse_float(row.get("longitude", ""), 0)

    return {
        "id": source_id or slugify(name),
        "name": name,
        "slug": slug,
        "description": description,
        "shortSummary": description[:120],
        "address": row.get("street", "") or "",
        "neighborhood": city,
        "city": city,
        "serviceArea": [city, state] if city and state else [],
        "coordinates": {"lat": lat, "lng": lng},
        "phone": row.get("phone", "") or "",
        "email": (row.get("emails", "") or "").split(",")[0].strip(),
        "website": row.get("website", "") or "",
        "servicesOffered": services,
        "productCategories": parse_product_categories(row),
        "printingMethods": services,  # Same as servicesOffered for this dataset
        "moq": parse_int(row.get("moq", ""), 1),
        "turnaroundDays": parse_int(row.get("turnaround_days", ""), 7),
        "rushAvailable": is_true(row.get("rush_orders", "")),
        "startingPrice": parse_float(row.get("starting_price", ""), 0) or None,
        "pricingTiers": [],
        "pickup": is_true(row.get("local_pickup", "")),
        "delivery": is_true(row.get("delivery", "")),
        "sustainabilityTags": ["Eco-Friendly"] if is_true(row.get("eco_friendly", "")) else [],
        "galleryImages": gallery,
        "coverImage": cover,
        "logoImage": logo,
        "featured": is_true(row.get("featured", "")),
        "rating": parse_float(row.get("rating", ""), 0),
        "reviewCount": parse_int(row.get("review_count", ""), 0),
        "reviews": [],
        "faqs": [],
        "seoTitle": f"{name} — Custom Printing Services in {city}, {state}",
        "seoDescription": description[:160],
        "createdAt": row.get("scraped_at", "") or "2025-09-01",
        "customizationMethods": services,
        "ecoFriendly": is_true(row.get("eco_friendly", "")),
        "finishingOptions": [],
        # New feature fields for filtering
        "sameDayPrinting": is_true(row.get("same_day_printing", "")),
        "bulkOrders": is_true(row.get("bulk_orders", "")),
        "smallBatch": is_true(row.get("small_batch", "")),
        "customDesign": is_true(row.get("custom_design", "")),
        "onlineOrdering": is_true(row.get("online_ordering", "")),
        "freeQuotes": is_true(row.get("free_quotes", "")),
        "nationwideShipping": is_true(row.get("nationwide_shipping", "")),
        "contractPrinting": is_true(row.get("contract_printing", "")),
        "dropshipping": is_true(row.get("dropshipping", "")),
    }


def main():
    if not os.path.exists(INPUT_CSV):
        print(f"ERROR: Input not found: {INPUT_CSV}")
        sys.exit(1)

    with open(INPUT_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    print(f"Loaded {len(rows)} companies from CSV")

    # Convert and filter out companies with no coordinates
    companies = []
    skipped = 0
    for row in rows:
        lat = parse_float(row.get("latitude", ""), 0)
        lng = parse_float(row.get("longitude", ""), 0)
        if lat == 0 and lng == 0:
            skipped += 1
            continue
        companies.append(convert_row(row))

    print(f"Converted {len(companies)} companies (skipped {skipped} with no coordinates)")

    # Stats
    with_cover = sum(1 for c in companies if c["coverImage"])
    with_gallery = sum(1 for c in companies if c["galleryImages"])
    with_logo = sum(1 for c in companies if c.get("logoImage"))
    with_rating = sum(1 for c in companies if c["rating"] > 0)
    print(f"  With cover image: {with_cover}")
    print(f"  With gallery images: {with_gallery}")
    print(f"  With logo: {with_logo}")
    print(f"  With rating: {with_rating}")

    # Write JSON
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(companies, f, indent=2, ensure_ascii=False)

    print(f"Written to: {OUTPUT_JSON}")
    print("Done!")


if __name__ == "__main__":
    main()
