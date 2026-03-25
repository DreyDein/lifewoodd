-- Run this in Supabase SQL Editor to add photo column
ALTER TABLE admins ADD COLUMN IF NOT EXISTS photo TEXT;
