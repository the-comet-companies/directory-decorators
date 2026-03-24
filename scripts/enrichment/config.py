import os

INPUT_CSV = os.path.join(os.path.dirname(__file__), "..", "..", "cleaned_dataset.csv")
# Also check Downloads folder
INPUT_CSV_ALT = os.path.expanduser("~/Downloads/cleaned_dataset.csv")
OUTPUT_CSV = os.path.join(os.path.dirname(__file__), "..", "..", "companies", "enriched-dataset.csv")
ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env.local")

SERVICE_COLUMNS = [
    "screen_printing", "dtg_printing", "dtf_printing", "embroidery",
    "sublimation", "heat_transfer", "vinyl_printing", "large_format_printing",
    "offset_printing", "custom_apparel", "signage_printing",
]

CRAWL_PATHS = ["/", "/services", "/about", "/products", "/our-services", "/what-we-do"]
CRAWL_TIMEOUT = 15
CRAWL_CONCURRENCY = 10
CRAWL_RETRIES = 2

OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_MODEL = "anthropic/claude-3.5-haiku"
LLM_BATCH_SIZE = 10

# Social media domains to skip in Tier 2
SKIP_DOMAINS = {"facebook.com", "instagram.com", "yelp.com", "twitter.com", "tiktok.com"}
