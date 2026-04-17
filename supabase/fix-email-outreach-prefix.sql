-- One-off cleanup: strip leading "=" from existing email_outreach records.
-- Caused by an n8n Record node bug where the expression-mode prefix leaked
-- into the stored value. New records will be clean once the node is fixed.

update email_outreach
set company_slug = regexp_replace(company_slug, '^=', ''),
    company_name = regexp_replace(company_name, '^=', ''),
    email = regexp_replace(email, '^=', '')
where company_slug like '=%'
   or company_name like '=%'
   or email like '=%';
