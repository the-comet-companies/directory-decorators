"""Tier 3: Use Claude Haiku via OpenRouter for remaining NULL service columns."""
import asyncio
import json
import logging
import os

import httpx
from dotenv import dotenv_values

from .utils import get_unfilled_services, is_filled
from .config import (
    ENV_PATH, OPENROUTER_ENDPOINT, OPENROUTER_MODEL,
    LLM_BATCH_SIZE, SERVICE_COLUMNS,
)

log = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are a data classification assistant. Given information about a printing company, determine which printing services they offer.

Return ONLY a JSON object with these keys set to true or false:
screen_printing, dtg_printing, dtf_printing, embroidery, sublimation, heat_transfer, vinyl_printing, large_format_printing, offset_printing, custom_apparel, signage_printing

Rules:
- Only mark true if there is strong evidence the company offers that service.
- Screen printing companies very often also do custom_apparel — mark true if they print on clothing/shirts/apparel.
- If the company name contains "screen print" → screen_printing=true
- If the company name contains "embroid" or "stitch" → embroidery=true
- When in doubt, mark false. Do NOT guess.
- Return valid JSON only, no explanation."""


def _build_prompt(companies: list[dict]) -> str:
    lines = []
    for i, c in enumerate(companies, 1):
        name = c.get("business_name", "")
        city = c.get("city", "")
        state = c.get("state", "")
        desc = c.get("description", "")
        raw_services = c.get("raw_service_names", "")
        lines.append(f"{i}. {name} — {city}, {state} | {desc} | Services: {raw_services}")

    return (
        "Classify the printing services offered by each company below. "
        "Return a JSON array of objects, one per company, in the same order.\n\n"
        + "\n".join(lines)
    )


async def _call_llm(client: httpx.AsyncClient, api_key: str, batch: list[dict]) -> list[dict]:
    """Call OpenRouter with a batch of companies. Returns list of service dicts."""
    prompt = _build_prompt(batch)
    payload = {
        "model": OPENROUTER_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0,
        "max_tokens": 2000,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://print-services-hub.vercel.app",
    }

    try:
        resp = await client.post(OPENROUTER_ENDPOINT, json=payload, headers=headers, timeout=30)
        data = resp.json()
        content = data["choices"][0]["message"]["content"]
        # Extract JSON from response (handle markdown code blocks)
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


async def _run_llm_batch(rows: list[dict]) -> int:
    """Process all remaining NULLs via LLM. Returns cells filled."""
    env = dotenv_values(ENV_PATH)
    api_key = env.get("OPENROUTER_API_KEY", "")
    if not api_key:
        api_key = os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key:
        log.warning("No OPENROUTER_API_KEY found — skipping Tier 3")
        return 0

    # Filter to rows with unfilled services
    targets = [r for r in rows if get_unfilled_services(r)]
    if not targets:
        log.info("Tier 3: no rows need LLM enrichment")
        return 0

    log.info(f"Tier 3: sending {len(targets)} companies to Claude Haiku via OpenRouter")
    filled = 0

    async with httpx.AsyncClient() as client:
        for i in range(0, len(targets), LLM_BATCH_SIZE):
            batch = targets[i:i + LLM_BATCH_SIZE]
            results = await _call_llm(client, api_key, batch)

            for row, result in zip(batch, results):
                if not isinstance(result, dict):
                    continue
                for svc in SERVICE_COLUMNS:
                    val = result.get(svc)
                    if val is True and not is_filled(row, svc):
                        row[svc] = "1"
                        filled += 1
                        src = row.get("enrichment_source", "")
                        if "tier3" not in src:
                            row["enrichment_source"] = (src + "|tier3_llm").strip("|")

            # Rate limit
            await asyncio.sleep(1)

    return filled


def run_tier3(rows: list[dict]) -> int:
    """Run the LLM enrichment tier. Returns count of cells filled."""
    filled = asyncio.run(_run_llm_batch(rows))
    log.info(f"Tier 3 complete: filled {filled} cells via Claude Haiku")
    return filled
