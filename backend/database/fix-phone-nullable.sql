-- Migration: Make phone field nullable in users table
-- Run this if you're getting "null value in column phone violates not-null constraint"

ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;

-- Verify the change
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'phone';
