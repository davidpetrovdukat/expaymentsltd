-- Migration: Allow multiple applications per user
-- Removes the UNIQUE constraint on user_id so a user can have
-- one DRAFT and N submitted (PENDING/SIGNED) applications.
--
-- Run this in Supabase SQL Editor BEFORE testing multi-app flows.

-- 1. Drop the column-level UNIQUE constraint
ALTER TABLE public.merchant_applications
    DROP CONSTRAINT IF EXISTS merchant_applications_user_id_key;

-- 2. Drop the unique index (created separately in 01_backend_mvp_schema.sql)
DROP INDEX IF EXISTS public.idx_applications_user_id;

-- 3. Non-unique index for general user_id lookups (dashboard list)
CREATE INDEX IF NOT EXISTS idx_applications_user_id
    ON public.merchant_applications (user_id);

-- 4. Composite index for the DRAFT-lookup query used by getApplicationRow
CREATE INDEX IF NOT EXISTS idx_applications_user_status
    ON public.merchant_applications (user_id, status);
