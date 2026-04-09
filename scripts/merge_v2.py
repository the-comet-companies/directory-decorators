"""
Merge companiesV2.json into the current companies.json format.
- Keep enriched data for overlapping companies (353)
- Add new companies from V2 (15,519)
- Keep current-only companies (243)
"""

import json
import re
from datetime import datetime

STATE_FULL_TO_ABBR = {
    'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
    'Colorado':'CO','Connecticut':'CT','Delaware':'DE','District of Columbia':'DC',
    'Florida':'FL','Georgia':'GA','Hawaii':'HI','Idaho':'ID','Illinois':'IL',
    'Indiana':'IN','Iowa':'IA','Kansas':'KS','Kentucky':'KY','Louisiana':'LA',
    'Maine':'ME','Maryland':'MD','Massachusetts':'MA','Michigan':'MI','Minnesota':'MN',
    'Mississippi':'MS','Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV',
    'New Hampshire':'NH','New Jersey':'NJ','New Mexico':'NM','New York':'NY',
    'North Carolina':'NC','North Dakota':'ND','Ohio':'OH','Oklahoma':'OK',
    'Oregon':'OR','Pennsylvania':'PA','Rhode Island':'RI','South Carolina':'SC',
    'South Dakota':'SD','Tennessee':'TN','Texas':'TX','Utah':'UT','Vermont':'VT',
    'Virginia':'VA','Washington':'WA','West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY',
}

# Map Google categories to our service types
CATEGORY_TO_SERVICES = {
    'screen print': 'Screen Printing',
    'screen printing': 'Screen Printing',
    'embroidery': 'Embroidery',
    'dtg': 'DTG Printing',
    'direct to garment': 'DTG Printing',
    'dtf': 'DTF Printing',
    'direct to film': 'DTF Printing',
    'sublimation': 'Sublimation',
    'heat transfer': 'Heat Transfer',
    'heat press': 'Heat Transfer',
    'custom t-shirt': 'Custom Apparel',
    'custom apparel': 'Custom Apparel',
    't-shirt store': 'Custom Apparel',
    't-shirt shop': 'Custom Apparel',
    'print shop': 'Screen Printing',
    'printing shop': 'Screen Printing',
    'printing': 'Screen Printing',
    'promotional products': 'Promotional Products',
    'sign shop': 'Signage',
    'vinyl sign': 'Signage',
    'banner store': 'Signage',
    'engraver': 'Engraving',
    'trophy shop': 'Awards & Trophies',
    'vehicle wrapping': 'Vehicle Wraps',
}

CATEGORY_TO_PRODUCTS = {
    'custom t-shirt': 'T-Shirts',
    't-shirt store': 'T-Shirts',
    't-shirt shop': 'T-Shirts',
    'custom apparel': 'Custom Apparel',
    'hat shop': 'Hats & Caps',
    'sportswear': 'Sportswear',
    'uniform': 'Uniforms',
    'work clothes': 'Uniforms',
    'banner': 'Banners & Signs',
    'sign shop': 'Banners & Signs',
    'flag store': 'Flags',
    'flag shop': 'Flags',
    'sticker': 'Stickers & Decals',
    'decal': 'Stickers & Decals',
    'promotional': 'Promotional Products',
    'trophy': 'Awards & Trophies',
    'gift': 'Gifts & Novelties',
}

def slugify(text):
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text

def derive_services(categories):
    services = set()
    for cat in categories:
        cat_lower = cat.lower()
        for key, service in CATEGORY_TO_SERVICES.items():
            if key in cat_lower:
                services.add(service)
    if not services:
        services.add('Screen Printing')  # default since most are screen printers
    return sorted(services)

def derive_products(categories):
    products = set()
    for cat in categories:
        cat_lower = cat.lower()
        for key, product in CATEGORY_TO_PRODUCTS.items():
            if key in cat_lower:
                products.add(product)
    if not products:
        products.add('T-Shirts')
        products.add('Custom Apparel')
    return sorted(products)

def derive_printing_methods(services):
    methods = []
    for s in services:
        if s in ['Screen Printing', 'DTG Printing', 'DTF Printing', 'Embroidery', 'Sublimation', 'Heat Transfer']:
            methods.append(s)
    return methods

def convert_v2(company):
    """Convert a V2 company to the current schema."""
    name = company.get('title', '')
    city = company.get('city', '')
    state_full = company.get('state', '')
    state_abbr = STATE_FULL_TO_ABBR.get(state_full, state_full[:2].upper() if state_full else '')

    categories = company.get('categories', [])
    emails = company.get('emails', [])
    email = emails[0] if emails else ''

    services = derive_services(categories)
    products = derive_products(categories)
    printing_methods = derive_printing_methods(services)

    website = company.get('website', '') or ''
    if website and not website.startswith('http'):
        website = 'https://' + website

    description = f"{name} offers {', '.join(services)} services in {city}, {state_abbr}."

    return {
        'id': company.get('placeId', ''),
        'name': name,
        'slug': company.get('placeId', ''),
        'description': description,
        'shortSummary': description,
        'address': company.get('address', ''),
        'neighborhood': city,
        'city': city,
        'serviceArea': [city, state_abbr],
        'coordinates': {
            'lat': company.get('lat', 0),
            'lng': company.get('lng', 0),
        },
        'phone': company.get('phone', ''),
        'email': email,
        'website': website,
        'servicesOffered': services,
        'productCategories': products,
        'printingMethods': printing_methods,
        'moq': 1,
        'turnaroundDays': 7,
        'rushAvailable': False,
        'startingPrice': None,
        'pricingTiers': [],
        'pickup': True,
        'delivery': False,
        'sustainabilityTags': [],
        'galleryImages': [],
        'coverImage': '',
        'logoImage': '',
        'featured': False,
        'rating': company.get('rating', 0),
        'reviewCount': company.get('reviewCount', 0),
        'reviews': [],
        'faqs': [],
        'seoTitle': f"{name} — Custom Printing Services in {city}, {state_abbr}",
        'seoDescription': description,
        'createdAt': datetime.now().isoformat() + 'Z',
        'customizationMethods': services,
        'ecoFriendly': False,
        'finishingOptions': [],
        'sameDayPrinting': False,
        'bulkOrders': False,
        'smallBatch': False,
        'customDesign': False,
        'onlineOrdering': False,
        'freeQuotes': True,
        'nationwideShipping': False,
        'contractPrinting': False,
        'dropshipping': False,
        # New fields from V2
        'facebook': (company.get('facebook') or [None])[0],
        'instagram': (company.get('instagram') or [None])[0],
        'googleMapsUrl': company.get('googleMapsUrl', ''),
    }

def main():
    # Load current dataset
    with open('src/lib/companies.json', 'r', encoding='utf-8') as f:
        current = json.load(f)
    print(f"Current dataset: {len(current)} companies")

    # Load V2 dataset
    with open('companies/companiesV2.json', 'r', encoding='utf-8') as f:
        v2 = json.load(f)
    print(f"V2 dataset: {len(v2)} companies")

    # Index current by ID
    current_by_id = {c['id']: c for c in current}

    # Index V2 by placeId
    v2_by_id = {c['placeId']: c for c in v2}

    merged = []

    # 1. Process overlapping companies: keep current enriched data, update with V2 extras
    overlap_count = 0
    for cid, company in current_by_id.items():
        if cid in v2_by_id:
            overlap_count += 1
            v2_data = v2_by_id[cid]
            # Keep current enriched data but add new V2 fields
            company['facebook'] = (v2_data.get('facebook') or [None])[0]
            company['instagram'] = (v2_data.get('instagram') or [None])[0]
            company['googleMapsUrl'] = v2_data.get('googleMapsUrl', '')
            # Update coordinates if current has 0,0
            if company.get('coordinates', {}).get('lat', 0) == 0:
                company['coordinates'] = {'lat': v2_data.get('lat', 0), 'lng': v2_data.get('lng', 0)}
            # Update email if current is empty
            if not company.get('email'):
                emails = v2_data.get('emails', [])
                if emails:
                    company['email'] = emails[0]
            # Update rating/reviews if V2 has newer data
            if v2_data.get('reviewCount', 0) > company.get('reviewCount', 0):
                company['rating'] = v2_data['rating']
                company['reviewCount'] = v2_data['reviewCount']
            merged.append(company)
        else:
            # Only in current, keep as is
            merged.append(company)

    # 2. Add new V2 companies
    new_count = 0
    for pid, v2_company in v2_by_id.items():
        if pid not in current_by_id:
            new_count += 1
            merged.append(convert_v2(v2_company))

    print(f"\nOverlapping (enriched kept): {overlap_count}")
    print(f"Current only (kept): {len(current) - overlap_count}")
    print(f"New from V2 (added): {new_count}")
    print(f"Total merged: {len(merged)}")

    # Sort by state, then city, then name
    merged.sort(key=lambda x: (
        (x.get('serviceArea') or ['', ''])[1] if len(x.get('serviceArea') or []) > 1 else '',
        x.get('city') or '',
        x.get('name') or '',
    ))

    # Write merged dataset
    with open('src/lib/companies.json', 'w', encoding='utf-8') as f:
        json.dump(merged, f, indent=2, ensure_ascii=False)

    print(f"\nWrote {len(merged)} companies to src/lib/companies.json")

if __name__ == '__main__':
    main()
