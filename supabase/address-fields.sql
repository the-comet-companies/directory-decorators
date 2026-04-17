-- Structured address fields. Existing "address" column is kept as Street Address (Line 1).
-- New columns: address_line2 (apt/suite/unit) and zip.

alter table companies add column if not exists address_line2 text default '';
alter table companies add column if not exists zip text default '';

-- Pending listings (newly submitted businesses) get the same fields.
alter table pending_listings add column if not exists address_line2 text;
alter table pending_listings add column if not exists zip text;
