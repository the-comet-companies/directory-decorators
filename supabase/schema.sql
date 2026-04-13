-- DTLA Directory Database Schema
-- Run this in Supabase SQL Editor: Dashboard → SQL Editor → New query → paste → Run

-- ─── Users ──────────────────────────────────────────────────────────────────
create table if not exists users (
  id text primary key,
  email text unique not null,
  name text not null,
  password_hash text not null,
  role text not null default 'owner',
  claimed_business_slug text,
  reset_token text,
  reset_token_expires timestamptz,
  created_at timestamptz default now()
);

create index if not exists users_email_idx on users (lower(email));

-- ─── Claims ─────────────────────────────────────────────────────────────────
create table if not exists claims (
  id text primary key,
  business_slug text not null,
  business_name text not null,
  user_email text not null,
  user_name text not null,
  verification_code text,
  code_expires_at timestamptz,
  verified boolean default false,
  status text not null default 'pending',
  proof_image text,
  message text,
  created_at timestamptz default now()
);

create index if not exists claims_slug_idx on claims (business_slug);
create index if not exists claims_status_idx on claims (status);

-- ─── Pending Listings ───────────────────────────────────────────────────────
create table if not exists pending_listings (
  id text primary key,
  user_id text not null,
  user_email text not null,
  user_name text not null,
  business_name text not null,
  description text,
  address text,
  city text,
  state text,
  phone text,
  email text,
  website text,
  services_offered jsonb default '[]'::jsonb,
  product_categories jsonb default '[]'::jsonb,
  printing_methods jsonb default '[]'::jsonb,
  moq int default 0,
  turnaround_days int default 0,
  rush_available boolean default false,
  pickup boolean default false,
  delivery boolean default false,
  eco_friendly boolean default false,
  gallery_images jsonb default '[]'::jsonb,
  cover_image text,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create index if not exists pending_listings_status_idx on pending_listings (status);

-- ─── Quote Leads ────────────────────────────────────────────────────────────
create table if not exists quote_leads (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  service_type text,
  quantity text,
  deadline text,
  description text,
  providers jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create index if not exists quote_leads_created_idx on quote_leads (created_at desc);
