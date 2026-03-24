import re

SERVICE_KEYWORDS: dict[str, list[str]] = {
    "screen_printing": [
        r"screen[\s\-]*print", r"silk[\s\-]*screen", r"serigraph",
    ],
    "dtg_printing": [
        r"\bdtg\b", r"direct[\s\-]*to[\s\-]*garment", r"digital[\s\-]*garment[\s\-]*print",
    ],
    "dtf_printing": [
        r"\bdtf\b", r"direct[\s\-]*to[\s\-]*film",
    ],
    "embroidery": [
        r"embroider", r"\bstitch(?:ing|ed)?\b", r"monogram",
    ],
    "sublimation": [
        r"sublim", r"dye[\s\-]*sub", r"all[\s\-]*over[\s\-]*print",
    ],
    "heat_transfer": [
        r"heat[\s\-]*transfer", r"heat[\s\-]*press",
    ],
    "vinyl_printing": [
        r"vinyl[\s\-]*(print|cut|letter|wrap|graph|decal)",
        r"\bhtv\b", r"heat[\s\-]*transfer[\s\-]*vinyl",
    ],
    "large_format_printing": [
        r"large[\s\-]*format", r"wide[\s\-]*format", r"banner[\s\-]*print",
        r"vehicle[\s\-]*wrap",
    ],
    "offset_printing": [
        r"offset[\s\-]*print", r"lithograph",
    ],
    "custom_apparel": [
        r"custom[\s\-]*(apparel|cloth|t[\s\-]*shirt|tee|jersey|hoodie|hat|cap|uniform|merch)",
        r"promotional[\s\-]*product", r"promo[\s\-]*item",
    ],
    "signage_printing": [
        r"sign(age)?[\s\-]*(print|mak|shop|design)",
        r"channel[\s\-]*letter", r"yard[\s\-]*sign",
        r"trade[\s\-]*show[\s\-]*display", r"window[\s\-]*graphic",
    ],
}

# Pre-compile patterns
_COMPILED: dict[str, re.Pattern] = {}
for _svc, _patterns in SERVICE_KEYWORDS.items():
    combined = "|".join(f"(?:{p})" for p in _patterns)
    _COMPILED[_svc] = re.compile(combined, re.IGNORECASE)


def match_services(text: str) -> dict[str, bool]:
    """Return a dict of service -> True for each service found in text."""
    results = {}
    for svc, pattern in _COMPILED.items():
        if pattern.search(text):
            results[svc] = True
    return results
