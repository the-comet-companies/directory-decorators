"""Tier 3: Use Claude Haiku via OpenRouter for remaining NULL feature columns."""
import asyncio
import json
import logging
import os

import httpx
from dotenv import dotenv_values

from .feature_keywords import FEATURE_COLUMNS
from .utils import is_filled
from .config import ENV_PATH, OPENROUTER_ENDPOINT, OPENROUTER_MODEL, LLM_BATCH_SIZE

log = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a data classification assistant for printing companies. Given information about a printing business, determine which capabilities and features they likely offer.

Return ONLY a JSON object with these keys set to true or false:

Production features:
- rush_orders: Company offers rush/expedited printing (faster than standard turnaround)
- same_day_printing: Company can print and deliver same day
- bulk_orders: Company handles large volume orders (500+ pieces) with bulk pricing
- small_batch: Company accepts small orders with no or low minimums
- pantone_matching: Company offers exact Pantone/PMS color matching
- eco_friendly: Company uses eco-friendly inks, sustainable materials, or green practices

Service features:
- custom_design: Company has in-house graphic design services
- art_setup: Company offers art/screen setup, pre-press, or digital proofing
- online_ordering: Company has an online store or ordering system
- free_quotes: Company offers free quotes or estimates
- brand_consulting: Company offers branding/identity consulting services
- contract_printing: Company does wholesale/white-label/contract printing for other businesses

Fulfillment features:
- local_pickup: Customers can pick up orders at the shop
- nationwide_shipping: Company ships across the US
- international_shipping: Company ships internationally
- delivery: Company offers local delivery
- dropshipping: Company offers dropship/fulfillment services (ship direct to end customers)
- warehousing: Company offers inventory storage/warehousing/kitting

Rules:
- Only mark true if there is reasonable evidence based on the business name, location, description, or service list.
- Screen printing shops typically offer: free_quotes, local_pickup, custom_design. Mark true for these common ones.
- If company has "promotional products" in services, they likely offer bulk_orders and nationwide_shipping.
- When genuinely unclear, mark false.
- Return valid JSON only."""


def _build_prompt(companies: list[dict]) -> str:
    lines = []
    for i, c in enumerate(companies, 1):
        name = c.get("business_name", "")
        city = c.get("city", "")
        state = c.get("state", "")
        desc = c.get("description", "")
        raw = c.get("raw_service_names", "")
        lines.append(f"{i}. {name} — {city}, {state} | {desc} | Services: {raw}")
    return (
        "Classify the features/capabilities of each printing company below. "
        "Return a JSON array of objects, one per company, in the same order.\n\n"
        + "\n".join(lines)
    )


async def _call_llm(client: httpx.AsyncClient, api_key: str, batch: list[dict]) -> list[dict]:
    prompt = _build_prompt(batch)
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0,
        "max_tokens": 3000,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://print-services-hub.vercel.app",
    }
    try:
        resp = await client.post(OPENROUTER_ENDPOINT, json=payload, headers=headers, timeout=45)
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        parsed = json.loads(content)
        if isinstance(parsed, dict):
            parsed = [parsed]
        return parsed
    except Exception as e:
        log.warning(f"LLM call failed: {e}")
        return []


def _get_unfilled(row: dict) -> list[str]:
    return [col for col in FEATURE_COLUMNS if not is_filled(row, col)]


async def _run_llm(rows: list[dict]) -> int:
    env = dotenv_values(ENV_PATH)
    api_key = env.get("OPENROUTER_API_KEY", "") or os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key:
        log.warning("No OPENROUTER_API_KEY — skipping Feature Tier 3")
        return 0

    targets = [r for r in rows if _get_unfilled(r)]
    if not targets:
        log.info("Feature Tier 3: no rows need LLM enrichment")
        return 0

    log.info(f"Feature Tier 3: sending {len(targets)} companies to Claude Haiku")
    filled = 0

    async with httpx.AsyncClient() as client:
        for i in range(0, len(targets), LLM_BATCH_SIZE):
            batch = targets[i:i + LLM_BATCH_SIZE]
            results = await _call_llm(client, api_key, batch)

            for row, result in zip(batch, results):
                if not isinstance(result, dict):
                    continue
                for feat in FEATURE_COLUMNS:
                    val = result.get(feat)
                    if val is True and not is_filled(row, feat):
                        row[feat] = "1"
                        filled += 1
                        src = row.get("feature_enrichment_source", "")
                        if "tier3" not in src:
                            row["feature_enrichment_source"] = (src + "|tier3_llm").strip("|")

            await asyncio.sleep(1)

    return filled


def run_tier3_features(rows: list[dict]) -> int:
    filled = asyncio.run(_run_llm(rows))
    log.info(f"Feature Tier 3 complete: filled {filled} cells via Claude Haiku")
    return filled
