-- Per-service MOQ map. Example: {"Screen Printing": 24, "DTG Printing": 1, "Embroidery": 12}
-- Existing moq column stays as "overall lowest MOQ" (used by the filter).

alter table companies add column if not exists moq_by_service jsonb default '{}'::jsonb;
alter table pending_listings add column if not exists moq_by_service jsonb;
