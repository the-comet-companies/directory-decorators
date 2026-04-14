-- Email Outreach Tracking
-- Run this in Supabase SQL Editor

create table if not exists email_outreach (
  id text primary key,
  company_slug text not null,
  company_name text not null,
  email text not null,
  subject text,
  sent_at timestamptz default now(),
  status text not null default 'sent', -- sent, opened, bounced, claimed
  notes text
);

create index if not exists email_outreach_slug_idx on email_outreach (company_slug);
create index if not exists email_outreach_email_idx on email_outreach (email);
create index if not exists email_outreach_sent_idx on email_outreach (sent_at desc);
