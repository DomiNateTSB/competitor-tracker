-- Run this in Supabase Dashboard → SQL Editor

ALTER TABLE competitors ADD COLUMN IF NOT EXISTS alert_enabled     BOOLEAN DEFAULT true;
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS alert_min_severity TEXT    DEFAULT 'all';
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS last_scrape_error  TEXT;
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS share_token        TEXT UNIQUE;
