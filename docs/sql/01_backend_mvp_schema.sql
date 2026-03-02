-- Table: merchant_applications
CREATE TABLE IF NOT EXISTS public.merchant_applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'DRAFT'
                CHECK (status IN ('DRAFT', 'PENDING', 'SIGNED')),
  current_step  smallint NOT NULL DEFAULT 1
                CHECK (current_step BETWEEN 1 AND 5),
  progress_percent smallint NOT NULL DEFAULT 0
                CHECK (progress_percent BETWEEN 0 AND 100),
  form_data     jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at  timestamptz,
  pdf_sent_at   timestamptz,
  email_message_id text,
  submit_attempts integer NOT NULL DEFAULT 0,
  last_submit_error text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_user_id ON public.merchant_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.merchant_applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON public.merchant_applications(submitted_at)
  WHERE submitted_at IS NOT NULL;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_application_updated ON public.merchant_applications;
CREATE TRIGGER on_application_updated
  BEFORE UPDATE ON public.merchant_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.merchant_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Note: Ensure old policies are dropped if rebuilding
DROP POLICY IF EXISTS "Users can view own application" ON public.merchant_applications;
CREATE POLICY "Users can view own application"
  ON public.merchant_applications
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own application" ON public.merchant_applications;
CREATE POLICY "Users can create own application"
  ON public.merchant_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own draft application" ON public.merchant_applications;
CREATE POLICY "Users can update own draft application"
  ON public.merchant_applications
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'DRAFT')
  WITH CHECK (auth.uid() = user_id);

-- Healthcheck RPC
CREATE OR REPLACE FUNCTION public.health()
RETURNS jsonb
LANGUAGE sql
SECURITY INVOKER
AS $$
  SELECT jsonb_build_object(
    'ok', true,
    'timestamp', now()
  );
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.health() TO anon, authenticated;
