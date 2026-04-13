-- Companies table
-- Run this in Supabase SQL Editor

create table if not exists companies (
  id text primary key,
  name text not null,
  slug text unique not null,
  description text,
  short_summary text,
  address text,
  neighborhood text,
  city text,
  state text,
  service_area jsonb default '[]'::jsonb,
  lat double precision default 0,
  lng double precision default 0,
  phone text,
  email text,
  website text,
  services_offered jsonb default '[]'::jsonb,
  product_categories jsonb default '[]'::jsonb,
  printing_methods jsonb default '[]'::jsonb,
  moq int default 1,
  turnaround_days int default 7,
  rush_available boolean default false,
  starting_price double precision,
  pricing_tiers jsonb default '[]'::jsonb,
  pickup boolean default false,
  delivery boolean default false,
  sustainability_tags jsonb default '[]'::jsonb,
  gallery_images jsonb default '[]'::jsonb,
  cover_image text,
  logo_image text,
  featured boolean default false,
  rating double precision default 0,
  review_count int default 0,
  reviews jsonb default '[]'::jsonb,
  faqs jsonb default '[]'::jsonb,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  customization_methods jsonb default '[]'::jsonb,
  eco_friendly boolean default false,
  finishing_options jsonb default '[]'::jsonb,
  same_day_printing boolean default false,
  bulk_orders boolean default false,
  small_batch boolean default false,
  custom_design boolean default false,
  online_ordering boolean default false,
  free_quotes boolean default false,
  nationwide_shipping boolean default false,
  contract_printing boolean default false,
  dropshipping boolean default false,
  facebook text,
  instagram text,
  google_maps_url text
);

-- Indexes for fast queries
create index if not exists companies_slug_idx on companies (slug);
create index if not exists companies_state_idx on companies (state);
create index if not exists companies_city_idx on companies (city);
create index if not exists companies_name_idx on companies (lower(name));
create index if not exists companies_rating_idx on companies (rating desc);
create index if not exists companies_featured_idx on companies (featured) where featured = true;
