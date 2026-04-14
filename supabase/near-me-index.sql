-- Speed up Near Me bounds queries
-- Run this in Supabase SQL Editor

create index if not exists companies_coords_idx on companies (lat, lng);
