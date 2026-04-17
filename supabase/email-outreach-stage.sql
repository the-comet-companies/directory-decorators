-- Adds a stage column to email_outreach so we can run a drip campaign.
-- stage=1 = initial outreach, stage=2 = 7-day follow-up, stage=3 = later follow-up, etc.
-- A company can have multiple rows (one per stage).

alter table email_outreach add column if not exists stage int not null default 1;

-- Backfill existing records as stage 1 (they were all initial sends)
update email_outreach set stage = 1 where stage is null or stage = 0;

-- Index for looking up "did we already send stage=X to this slug?"
create index if not exists email_outreach_slug_stage_idx on email_outreach (company_slug, stage);
