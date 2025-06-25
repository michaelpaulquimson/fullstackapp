-- Migration: Set default value for user_tags column in users table
ALTER TABLE users ALTER COLUMN user_tags SET DEFAULT '';
