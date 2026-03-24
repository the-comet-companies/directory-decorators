"""Feature detection keywords — context-aware regex patterns for printing business capabilities."""
import re

# ── Production Features ──

FEATURE_KEYWORDS: dict[str, list[str]] = {
    "rush_orders": [
        r"rush[\s\-]*(order|print|service|turnaround|deliver|availab|option)",
        r"expedit(ed|e)[\s\-]*(order|print|service|turnaround)",
        r"fast[\s\-]*turnaround",
        r"(24|48|72)[\s\-]*hour[\s\-]*(turnaround|service|print)",
        r"quick[\s\-]*turn(around)?",
        r"next[\s\-]*day[\s\-]*(print|service|turnaround|deliver)",
    ],
    "same_day_printing": [
        r"same[\s\-]*day[\s\-]*(print|service|order|turnaround|deliver|pickup)",
        r"while[\s\-]*you[\s\-]*wait",
        r"instant[\s\-]*print",
        r"walk[\s\-]*in[\s\-]*(print|service|order)",
    ],
    "bulk_orders": [
        r"bulk[\s\-]*(order|print|discount|pricing|rate)",
        r"wholesale[\s\-]*(print|order|pricing|rate|account)",
        r"volume[\s\-]*(discount|pricing|order)",
        r"large[\s\-]*(order|quantit|run|volume)[\s\-]*(discount|pricing|available|welcome)?",
        r"(500|1000|5000)\+?\s*(piece|unit|shirt|item)",
    ],
    "small_batch": [
        r"no[\s\-]*minimum",
        r"low[\s\-]*minimum",
        r"small[\s\-]*(order|batch|quantit|run)",
        r"(one|1)[\s\-]*(piece|item|shirt|off)[\s\-]*(order|print|available)?",
        r"single[\s\-]*(item|piece|unit)[\s\-]*(print|order)?",
        r"short[\s\-]*run",
    ],
    "pantone_matching": [
        r"pantone[\s\-]*(match|color|pms|system)",
        r"\bpms[\s\-]*(color|match|ink)",
        r"(exact|precise|spot)[\s\-]*color[\s\-]*match",
    ],
    "eco_friendly": [
        r"eco[\s\-]*friendly",
        r"sustain(able|ability)",
        r"organic[\s\-]*(ink|cotton|material)",
        r"water[\s\-]*based[\s\-]*(ink|print)",
        r"green[\s\-]*(print|business|practice|certif)",
        r"environment(al|ally)[\s\-]*(friendly|conscious|responsible)",
        r"recycl(ed|able)[\s\-]*(material|paper|ink|garment)",
        r"soy[\s\-]*based[\s\-]*ink",
    ],

    # ── Service Features ──

    "custom_design": [
        r"(custom|in[\s\-]*house|free)[\s\-]*(graphic)?[\s\-]*design[\s\-]*(service|team|department|help|assist|support|included)?",
        r"(graphic|art)[\s\-]*(design|department|team|studio|service)",
        r"we[\s\-]*(design|create)[\s\-]*(your|custom|the)",
        r"design[\s\-]*(from[\s\-]*scratch|assistance|consultation|included)",
        r"(free|complimentary)[\s\-]*(art|design|mock[\s\-]*up|proof|artwork)",
    ],
    "art_setup": [
        r"art[\s\-]*(setup|preparation|prep|ready)",
        r"screen[\s\-]*setup",
        r"pre[\s\-]*press[\s\-]*(service|preparation|work)",
        r"artwork[\s\-]*(prep|preparation|review|check)",
        r"(film|plate|stencil)[\s\-]*(setup|preparation|making)",
        r"(free|digital)[\s\-]*proof",
    ],
    "online_ordering": [
        r"order[\s\-]*online",
        r"online[\s\-]*(store|shop|order|portal)",
        r"e[\s\-]*commerce",
        r"(web|online)[\s\-]*(store|shop|ordering)",
        r"shop[\s\-]*now",
        r"(place|submit)[\s\-]*(your)?[\s\-]*order[\s\-]*online",
        r"online[\s\-]*design[\s\-]*tool",
    ],
    "free_quotes": [
        r"free[\s\-]*(quote|estimate|consultation|pricing)",
        r"(get|request|receive)[\s\-]*(a[\s\-]*)?(free[\s\-]*)?(quote|estimate)",
        r"no[\s\-]*(obligation|cost)[\s\-]*(quote|estimate|consultation)",
        r"instant[\s\-]*(quote|pricing|estimate)",
    ],
    "brand_consulting": [
        r"brand(ing)?[\s\-]*(consult|service|strateg|solution|identity|development|package)",
        r"(brand|corporate)[\s\-]*identity[\s\-]*(service|design|package|development)",
        r"(logo|brand)[\s\-]*(design|creation|development)[\s\-]*(service)?",
    ],
    "contract_printing": [
        r"contract[\s\-]*(print|screen|service)",
        r"white[\s\-]*label[\s\-]*(print|service)",
        r"private[\s\-]*label[\s\-]*(print|service|apparel)",
        r"wholesale[\s\-]*(print|screen|service|partner)",
        r"(print|fulfill)[\s\-]*(for|on[\s\-]*behalf[\s\-]*of)[\s\-]*(other|brand|compan|business)",
        r"trade[\s\-]*(print|account|partner|pricing)",
    ],

    # ── Fulfillment Features ──

    "local_pickup": [
        r"(local|in[\s\-]*store|curbside)[\s\-]*(pick[\s\-]*up|pickup)",
        r"pick[\s\-]*up[\s\-]*(availab|option|at[\s\-]*our|from[\s\-]*our)",
        r"walk[\s\-]*in[\s\-]*(welcome|order|service|available)",
        r"visit[\s\-]*(our|the)[\s\-]*(shop|store|location|showroom)",
    ],
    "nationwide_shipping": [
        r"(nationwide|nation[\s\-]*wide)[\s\-]*(ship|deliver|service)",
        r"ship[\s\-]*(anywhere|across|throughout|all[\s\-]*over)[\s\-]*(the[\s\-]*)?(us|usa|united[\s\-]*states|country|nation)",
        r"all[\s\-]*50[\s\-]*states",
        r"(we|free|fast)[\s\-]*ship",
        r"(domestic|us)[\s\-]*(ship|deliver)",
        r"ship[\s\-]*(direct|to[\s\-]*your[\s\-]*(door|location|address))",
    ],
    "international_shipping": [
        r"international[\s\-]*(ship|deliver)",
        r"(worldwide|world[\s\-]*wide|global)[\s\-]*(ship|deliver|service)",
        r"ship[\s\-]*(international|worldwide|global|overseas)",
    ],
    "delivery": [
        r"(local|free|fast)[\s\-]*deliver(y|ies)",
        r"deliver[\s\-]*(to|within|in)[\s\-]*(your|the|local|metro)",
        r"(home|office|door)[\s\-]*deliver(y|ies)?",
        r"(we|will|can)[\s\-]*deliver",
    ],
    "dropshipping": [
        r"drop[\s\-]*ship(ping)?",
        r"(order|print)[\s\-]*fulfillment[\s\-]*(service)?",
        r"direct[\s\-]*to[\s\-]*(customer|consumer|door)[\s\-]*(ship|fulfil|deliver)",
        r"(3pl|third[\s\-]*party[\s\-]*logistic)",
        r"(individual|per[\s\-]*order)[\s\-]*(ship|fulfil|pack)",
    ],
    "warehousing": [
        r"warehouse[\s\-]*(service|storage|solution|space|capabilit)",
        r"inventory[\s\-]*(manage|storage|solution|program)",
        r"(storage|kitting)[\s\-]*(service|solution|available|option)",
        r"(store|hold|keep)[\s\-]*(your)?[\s\-]*(inventory|stock|product|merchandise)",
    ],
}

# Pre-compile patterns
_COMPILED: dict[str, re.Pattern] = {}
for _feat, _patterns in FEATURE_KEYWORDS.items():
    combined = "|".join(f"(?:{p})" for p in _patterns)
    _COMPILED[_feat] = re.compile(combined, re.IGNORECASE)

FEATURE_COLUMNS = list(FEATURE_KEYWORDS.keys())


def match_features(text: str) -> dict[str, bool]:
    """Return a dict of feature -> True for each feature found in text."""
    results = {}
    for feat, pattern in _COMPILED.items():
        if pattern.search(text):
            results[feat] = True
    return results
