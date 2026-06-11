-- Run this in Supabase Dashboard → SQL Editor
ALTER TABLE change_events ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
