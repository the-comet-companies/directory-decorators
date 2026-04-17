-- Standard turnaround as a range (min-max) and per-service overrides.
-- Existing turnaround_days column stays as the MAX end of the range (used by
-- the "turnaround" filter where it checks turnaround_days <= N).

alter table companies add column if not exists turnaround_min_days int;
alter table companies add column if not exists turnaround_by_service jsonb default '{}'::jsonb;

alter table pending_listings add column if not exists turnaround_min_days int;
alter table pending_listings add column if not exists turnaround_by_service jsonb;
