-- Speeds up ILIKE searches on the homepage.
-- Without these indexes, Postgres scans all 8k rows for every search query.
-- With pg_trgm + GIN, searches become near-instant.

create extension if not exists pg_trgm;

create index if not exists companies_name_trgm_idx on companies using gin (name gin_trgm_ops);
create index if not exists companies_city_trgm_idx on companies using gin (city gin_trgm_ops);
create index if not exists companies_description_trgm_idx on companies using gin (description gin_trgm_ops);

-- Index on review_count (used by the 20+ review quality filter on every homepage query)
create index if not exists companies_review_count_idx on companies (review_count);

-- Index on rating (used by sort)
create index if not exists companies_rating_idx on companies (rating desc);

-- Composite index for the most common query pattern: review_count >= 20 ordered by rating
create index if not exists companies_quality_rating_idx on companies (review_count, rating desc) where review_count >= 20;
