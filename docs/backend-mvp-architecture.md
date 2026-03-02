# Backend MVP Architecture Contract

> Implementation-ready backend specification for the Ex-Payments merchant application platform.
> References: [APPLICATION DATA CONTRACT](./application-data-contract.md) · [PROJECT.md](../PROJECT.md)

---

## A. Supabase Setup & Environment

### Required Environment Variables

```bash
# .env.local (Git-ignored, required for local dev AND Vercel production)
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                              # public, safe for client
SUPABASE_SERVICE_ROLE_KEY=eyJ...                                  # server-only, NEVER exposed to client
RESEND_API_KEY=re_...                                             # server-only
NEXT_PUBLIC_SITE_URL=http://localhost:3000                         # canonical base URL for redirects
```

### Env Validation (runtime)

Create `src/lib/env.ts` using Zod to validate at startup:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith('re_'),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

### Supabase Auth Settings (Dashboard configuration)

| Setting | Value |
|---------|-------|
| Auth provider | Email + Password (only) |
| Confirm email | **ON** (Confirmation Link, not OTP) |
| Email template | Custom "Confirm your email" with `{{ .ConfirmationURL }}` |
| Password recovery | **ON** (Recovery Link) |
| Recovery template | Custom "Reset your password" with `{{ .ConfirmationURL }}` |
| Min password length | 8 |
| Redirect URLs (allowed) | `http://localhost:3000/**`, `https://<vercel-domain>/**`, `https://ex-payments.com/**` |
| Site URL | `https://ex-payments.com` (production) or `http://localhost:3000` (dev) |

### Service Role Key Decision

**Decision: YES for MVP, strictly server-only.**

Justification: The PDF generation + Resend email pipeline runs in a Server Action after final submit. While it *could* use the anon key with RLS, the service role key is needed for:
1. Sending the compliance email (the user doesn't have a Resend permission row — this is a system action).
2. Future-proofing for admin queries (viewing all applications by status).

**Constraint:** The service role key MUST only be imported in `src/lib/supabase/server.ts` and used exclusively in Server Actions under `src/server/actions/`. It MUST NEVER appear in a Client Component import chain.

### Supabase Client Files

| File | Client Type | Usage |
|------|-------------|-------|
| `src/lib/supabase/client.ts` | Browser client | `createBrowserClient()` — for client components, auth state |
| `src/lib/supabase/server.ts` | Server client | `createServerClient()` — for Server Actions, middleware |
| `src/lib/supabase/admin.ts` | Service role | `createClient(url, serviceKey)` — for PDF/email pipeline only |

---

## B. Database Schema

### Table: `merchant_applications`

```sql
-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.merchant_applications (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'DRAFT'
                CHECK (status IN ('DRAFT', 'PENDING', 'SIGNED')),
  current_step  smallint NOT NULL DEFAULT 1
                CHECK (current_step BETWEEN 1 AND 5),
  progress_percent smallint NOT NULL DEFAULT 0
                CHECK (progress_percent BETWEEN 0 AND 100),
  form_data     jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE UNIQUE INDEX idx_applications_user_id ON public.merchant_applications(user_id);
CREATE INDEX idx_applications_status ON public.merchant_applications(status);
CREATE INDEX idx_applications_submitted_at ON public.merchant_applications(submitted_at)
  WHERE submitted_at IS NOT NULL;

-- Auto-update updated_at on any row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_updated
  BEFORE UPDATE ON public.merchant_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### Enum Strategy: `text` with `CHECK` constraint

**Decision: Use `text` with `CHECK`, not a PostgreSQL `CREATE TYPE` enum.**

Rationale:
- Adding new status values (e.g., `APPROVED`, `REJECTED`) requires only an `ALTER TABLE ... DROP CONSTRAINT / ADD CONSTRAINT` — no type migration.
- JSONB already handles dynamic schema; keeping `status` as text is consistent.
- `CHECK` constraint provides the same data integrity guarantees at the DB level.

### Denormalized Columns

| Column | Purpose | Updated by |
|--------|---------|-----------|
| `current_step` | Dashboard: "Continue application" button links to `/application/step-{n}` | Server Action on draft save |
| `progress_percent` | Dashboard: progress bar | Computed: `Math.round((current_step - 1) / 5 * 100)` on save |
| `submitted_at` | Dashboard: "Submitted on" display; PDF timestamp | Server Action on final submit |
| `pdf_sent_at` | Tracks PDF generation and send compliance | Added during Phase 2 for observability |
| `email_message_id` | Tracks Resend email message ID for debugging | Added during Phase 2 for observability |
| `submit_attempts` | Number of submission attempts by user | Added during Phase 2 for observability |
| `last_submit_error` | Most recent submission pipeline error message | Added during Phase 2 for observability |

---

## C. RLS Policies

```sql
-- Enable RLS
ALTER TABLE public.merchant_applications ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can SELECT only their own row
CREATE POLICY "Users can view own application"
  ON public.merchant_applications
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can INSERT only with their own user_id (one row per user)
CREATE POLICY "Users can create own application"
  ON public.merchant_applications
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can UPDATE only their own row, and ONLY while status = 'DRAFT'
CREATE POLICY "Users can update own draft application"
  ON public.merchant_applications
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'DRAFT')
  WITH CHECK (auth.uid() = user_id);
```

### RLS Interaction with Server Actions

- **Draft save (autosave):** Uses the *server Supabase client* (anon key + user session cookies). RLS applies — user can only update their own `DRAFT` row.
- **Final submit:** Same as draft save. The Server Action updates `status` to `'PENDING'` in a single UPDATE. After that, the row becomes immutable via RLS (UPDATE policy requires `status = 'DRAFT'`).
- **PDF + Email pipeline:** Uses the *admin Supabase client* (service role key). RLS is bypassed. This allows the system to read the finalized `form_data` for PDF generation even after status changes.

> **Important:** The UPDATE policy's `status = 'DRAFT'` check means that once submitted, the user CANNOT modify their application through the normal API. This is the idempotency/immutability guard.

---

## D. Auth Integration Plan

### Route Protection Map

```
(marketing)/*     → Public (no auth check)
(auth)/*          → Public (redirect to /dashboard if already logged in)
(dashboard)/*     → Protected (redirect to /login if not authenticated)
```

### Middleware Strategy

Create `src/middleware.ts`:

```typescript
// Pseudocode — exact implementation uses @supabase/ssr
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* cookies */);
  const { data: { user } } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')
    || request.nextUrl.pathname.startsWith('/sign-up')
    || request.nextUrl.pathname.startsWith('/check-email')
    || request.nextUrl.pathname.startsWith('/forgot-password')
    || request.nextUrl.pathname.startsWith('/reset-password');

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/dashboard')
    || request.nextUrl.pathname.startsWith('/application');

  // Logged-in user on auth pages → redirect to dashboard
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in on dashboard pages → redirect to login
  if (!user && isDashboardRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login', '/sign-up', '/check-email', '/forgot-password', '/reset-password',
    '/dashboard/:path*', '/application/:path*',
  ],
};
```

### Auth Flow Sequences

#### Sign Up
```
/sign-up → supabase.auth.signUp({ email, password })
         → redirect to /check-email
         → user clicks confirmation link in email
         → Supabase redirects to /auth/callback (Route Handler)
         → callback exchanges code → redirect to /dashboard
```

#### Login
```
/login → supabase.auth.signInWithPassword({ email, password })
       → if email not confirmed: show inline error "Please verify your email first"
       → if success: redirect to /dashboard
```

#### Forgot Password
```
/forgot-password → supabase.auth.resetPasswordForEmail(email, { redirectTo: SITE_URL/reset-password })
                 → redirect to /check-email (with type=recovery context)
                 → user clicks recovery link in email
                 → lands on /reset-password with access token in URL hash
```

#### Reset Password
```
/reset-password → supabase.auth.updateUser({ password: newPassword })
                → redirect to /login with success toast
```

### Auth Callback Route Handler

```
src/app/auth/callback/route.ts
```

This Route Handler (NOT a Server Action) exchanges the `code` query parameter for a session:

```typescript
// GET /auth/callback?code=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createServerClient(/* cookies */);
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
```

### Unverified User Behavior

If a user tries to log in without having verified their email:
- Supabase returns an error: `"Email not confirmed"`.
- The login page shows an inline error with the message: *"Please check your email for a confirmation link before logging in."*
- No redirect. The user stays on `/login`.

---

## E. Draft Autosave & Restore Contract

### When to Create the Application Row

**Decision: On first navigation to `/application/step-1`, NOT on signup.**

Rationale:
- Not every user who signs up will start an application immediately.
- Creating the row lazily avoids orphan rows from users who sign up but never enter the application flow.
- The Server Action `getOrCreateApplication()` handles this with an upsert pattern:

```typescript
// Pseudocode
async function getOrCreateApplication(userId: string) {
  const { data } = await supabase
    .from('merchant_applications')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (data) return data;

  // First visit — create with empty defaults
  const { data: newApp } = await supabase
    .from('merchant_applications')
    .insert({
      user_id: userId,
      status: 'DRAFT',
      current_step: 1,
      progress_percent: 0,
      form_data: DEFAULT_FORM_DATA, // from application-data-contract §E
    })
    .select()
    .single();

  return newApp;
}
```

### Debounce Strategy

| Trigger | Debounce | What is saved |
|---------|----------|---------------|
| Any field `onChange` / `onBlur` | **3 seconds** from last change | Entire current step's form data object |
| "Next Step" click | Immediate (no debounce) | Current step object + `current_step` increment |
| "Back" click | Immediate | Current step object (save progress before navigating back) |
| "Save Draft" button | Immediate | Current step object |
| Window `beforeunload` | None (fire-and-forget via `navigator.sendBeacon`) | Current step object — best-effort, no user feedback |

### Partial Update Strategy

**Decision: Replace the entire step sub-object on each save, not individual keys.**

Rationale:
- JSONB partial updates (`jsonb_set`) for deeply nested keys are complex and error-prone.
- Each step's data is small (~2KB max). Replacing `form_data->'step2'` atomically is safe.
- The Server Action uses:

```sql
UPDATE merchant_applications
SET form_data = jsonb_set(form_data, '{step2}', $1::jsonb),
    current_step = $2,
    progress_percent = $3,
    updated_at = now()
WHERE user_id = auth.uid() AND status = 'DRAFT';
```

### Computing `current_step` and `progress_percent`

```typescript
// Computed on the client, sent with save payload
function computeProgress(stepNumber: number): { current_step: number; progress_percent: number } {
  return {
    current_step: stepNumber,
    progress_percent: Math.round(((stepNumber - 1) / 5) * 100),
    // Step 1 entering = 0%, Step 2 = 20%, ..., Step 5 entering = 80%
    // 100% is set only on final submit
  };
}
```

### Restore Flow on Revisit

1. **Dashboard page** loads `merchant_applications` for the current user.
2. "Continue Application" button links to `/application/step-{current_step}`.
3. **Application layout** calls `getOrCreateApplication()` and stores the result in a React context (or Zustand).
4. Each step page reads `form_data.step{N}` and passes it as `defaultValues` to `useForm()`.
5. **Deep merge** the stored data over `DEFAULT_FORM_DATA` to handle:
   - Schema migrations (new fields added since the draft was saved).
   - Missing keys from partial saves.
6. **Toggle reset enforcement:** After restoring, iterate over toggle keys. If a toggle is `false`, ensure all dependent fields are set to their default values (per application-data-contract §C). This prevents stale data from a previous session where a user toggled something ON, filled fields, toggled OFF, saved, then returns.

---

## F. Final Submit Contract

### Validation Strategy

```
"Sign and Finish" clicked on Step 5
  → Step 5 Zod validation (signatory fields)
  → Full Zod validation (applicationSchema — all 5 steps combined)
  → If invalid: show toast "Please complete all required fields" + scroll to first error
  → If valid: call submitApplication Server Action
```

### Server Action: `submitApplication`

```typescript
// src/server/actions/submit-application.ts
'use server';

export async function submitApplication(formData: ApplicationFormData) {
  // 1. Re-validate on server (never trust client)
  const parsed = applicationSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: 'Validation failed', details: parsed.error.flatten() };
  }

  // 2. Get current user
  const supabase = createServerClient(cookies());
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // 3. Update application: status DRAFT → PENDING
  const { data: app, error } = await supabase
    .from('merchant_applications')
    .update({
      form_data: parsed.data,
      status: 'PENDING',
      current_step: 5,
      progress_percent: 100,
      submitted_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('status', 'DRAFT')        // ← Idempotency guard
    .select()
    .single();

  if (error || !app) {
    return { success: false, error: 'Application already submitted or not found' };
  }

  // 4. Generate PDF (async, non-blocking for user)
  // 5. Send email via Resend
  // These are fire-and-forget — user gets redirected immediately
  // Errors are logged server-side, not shown to user

  await generateAndEmailPdf(app);

  return { success: true };
}
```

### Transition Rules

| From | To | Conditions |
|------|----|-----------|
| `DRAFT` | `PENDING` | Full Zod validation passes; `submitted_at` set to `now()` |
| `PENDING` | `SIGNED` | Future: admin-only action (not in MVP scope) |

### Idempotency (Double-Submit Prevention)

Three layers of protection:

1. **Client-side:** Disable the "Sign and Finish" button after first click. Use `useTransition()` or a loading state.
2. **Server-side:** The `UPDATE ... WHERE status = 'DRAFT'` clause ensures that if the row is already `PENDING`, the update returns 0 rows (no match), and the Server Action returns an error.
3. **RLS:** The UPDATE policy only allows updates where `status = 'DRAFT'`. Even with a crafted request, a second submit is blocked at the DB level.

### Post-Submit Actions

```
submitApplication() success
  → client receives { success: true }
  → redirect to /application/success
  → /application/success shows "Application Submitted" confirmation
```

---

## G. PDF Generation Contract

### Technology

`@react-pdf/renderer` — runs server-side in the Server Action.

### Input

The canonical `form_data` JSONB object as defined in [application-data-contract.md §E](./application-data-contract.md).

### Output

A `Buffer` (PDF binary) that is attached to the Resend email. **Not stored** in Supabase Storage for MVP.

### PDF Section Mapping

| PDF Section | Data Source | Notes |
|-------------|-----------|-------|
| Header | Company name + submission date | `step1.company_name` + `submitted_at` |
| 1. Company Information | `step1.company_name` → `step1.incorporation_date` | — |
| 2. Legal Address & Contact | `step1.corporate_phone` → `step1.post_code` | — |
| 3. Contact Person | `step1.contact_*` | — |
| 4. General Information | `step2.base_activity` → `step2.terminal_types` | Join array as comma-separated |
| 5. Classification | `step2.mcc_code` → `step2.goods_description` | — |
| 6. Compliance & Operations | Toggle fields from Step 2 | **Omit section if toggle is `false`** |
| 7. Suppliers | `step2.suppliers[]` + `step2.shipping_terms` | One row per supplier |
| 8. Target Market & Currencies | `step3.target_market` etc. | Join arrays as comma-separated |
| 9. Processing History | `step3.lowest_price` → `step3.avg_chargeback_ratio` | — |
| 10. Forecast | `step3.forecast` | Render as table grid |
| 11. Directors / UBO | `step4.persons[]` | One page/section per person |
| 12. Declaration & Signature | `step5.signatory_*` + `submitted_at` | — |

### File & Attachment Naming

```
Filename pattern:  ExPayments_Application_{company_name}_{YYYY-MM-DD}.pdf
Example:           ExPayments_Application_Acme_Corp_2026-02-27.pdf
```

Sanitize `company_name`: replace non-alphanumeric chars with `_`, truncate to 50 chars.

### PDF Builder File

```
src/server/pdf/application-pdf.tsx
```

Uses `@react-pdf/renderer` `Document`, `Page`, `View`, `Text`, `StyleSheet` components. A single function:

```typescript
export async function generateApplicationPdf(formData: ApplicationFormData, submittedAt: string): Promise<Buffer>
```

---

## H. Observability & Safety

### Server-Side Logging Points

| Event | Level | What to log |
|-------|-------|------------|
| Draft saved | `info` | `userId`, `currentStep`, `updatedAt` |
| Draft save failed | `error` | `userId`, `currentStep`, error message |
| Submit started | `info` | `userId`, `applicationId` |
| Submit validation failed | `warn` | `userId`, Zod error paths (not values — PII!) |
| Submit succeeded | `info` | `userId`, `applicationId`, `submittedAt` |
| PDF generated | `info` | `applicationId`, PDF size in bytes |
| Email sent | `info` | `applicationId`, Resend message ID |
| Email failed | `error` | `applicationId`, Resend error (no PII in error) |

**MVP logger:** `console.log` / `console.error` with structured JSON. No external logging service for MVP.

### Error Handling UX

| Scenario | UX |
|----------|----|
| Draft save fails (network) | Silent retry after 5s. No toast (autosave should be invisible). |
| Draft save fails (3 consecutive) | Show subtle banner: "Changes not saved. Check your connection." |
| Step validation fails | Inline errors under each field (RHF `formState.errors`). No toast. |
| Submit validation fails | Toast: "Please complete all required fields." + scroll to first error. |
| Submit server error | Toast: "Something went wrong. Please try again." |
| Already submitted | Toast: "Application already submitted." + redirect to `/application/success`. |

### Rate Limiting / Turnstile (Future-Ready)

| Endpoint | Protection | MVP Status |
|----------|-----------|-----------|
| Sign up | Turnstile widget | **Deferred** (add `<div id="turnstile-widget">` placeholder) |
| Login | Supabase built-in rate limit (5 attempts/15min) | **Active** (default Supabase) |
| Draft save | None needed (autosave, RLS-protected) | N/A |
| Final submit | Client disable + DB idempotency | **Active** |
| Contact form | Turnstile widget | **Deferred** |

---

## I. Implementation Phasing for Gemini

Execute in this exact order. Each phase must pass quality gates before proceeding.

### Phase 1: Supabase Clients + Env Validation
- [ ] Create `.env.local` with all 5 env vars
- [ ] Create `src/lib/env.ts` (Zod env validation)
- [ ] Create `src/lib/supabase/client.ts` (browser client using `@supabase/ssr`)
- [ ] Create `src/lib/supabase/server.ts` (server client for Server Actions + middleware)
- [ ] Create `src/lib/supabase/admin.ts` (service role client, server-only)
- [ ] Install: `@supabase/supabase-js @supabase/ssr`
- [ ] Quality gate: `npm run type-check && npm run build`

### Phase 2: Database Table + Indexes + RLS
- [ ] Run table creation SQL in Supabase SQL Editor (§B)
- [ ] Run RLS policy SQL (§C)
- [ ] Run `updated_at` trigger SQL (§B)
- [ ] Verify in Supabase dashboard: table exists, RLS enabled, 3 policies active

### Phase 3: Auth Flows Wiring
- [ ] Create `src/middleware.ts` (route protection per §D)
- [ ] Create `src/app/auth/callback/route.ts` (code exchange handler)
- [ ] Wire `/sign-up` page: `supabase.auth.signUp()` → redirect to `/check-email`
- [ ] Wire `/login` page: `supabase.auth.signInWithPassword()` → redirect to `/dashboard`
- [ ] Wire `/forgot-password`: `supabase.auth.resetPasswordForEmail()` → redirect to `/check-email`
- [ ] Wire `/reset-password`: `supabase.auth.updateUser()` → redirect to `/login`
- [ ] Quality gate: `npm run type-check && npm run build`
- [ ] Manual test: full signup → confirm → login → logout → forgot → reset cycle

### Phase 4: TypeScript Types + Zod Schemas
- [ ] Create `src/types/application.ts` (interfaces from data contract §D)
- [ ] Create `src/lib/form/default-values.ts` (DEFAULT_FORM_DATA from §E)
- [ ] Create `src/lib/validators/step1.ts` through `step5.ts` + `full.ts`
- [ ] Quality gate: `npm run type-check`

### Phase 5: Draft Autosave + Restore
- [ ] Create Server Action: `src/server/actions/get-or-create-application.ts`
- [ ] Create Server Action: `src/server/actions/save-draft.ts`
- [ ] Create `src/hooks/use-autosave.ts` (debounced onChange watcher)
- [ ] Wire application layout to load draft on mount
- [ ] Wire each step page to restore `defaultValues` from loaded draft
- [ ] Quality gate: `npm run type-check && npm run build`
- [ ] Manual test: fill Step 1 → navigate away → return → data persists

### Phase 6: Submit Pipeline
- [ ] Create Server Action: `src/server/actions/submit-application.ts`
- [ ] Wire Step 5 "Sign and Finish" button to submit action
- [ ] Add client-side disable after click (double-submit prevention)
- [ ] Wire redirect to `/application/success` on success
- [ ] Quality gate: `npm run type-check && npm run build`
- [ ] Manual test: complete all 5 steps → submit → verify status = PENDING in Supabase

### Phase 7: PDF + Email
- [ ] Install: `@react-pdf/renderer resend`
- [ ] Create `src/server/pdf/application-pdf.tsx` (PDF builder component)
- [ ] Create `src/server/actions/generate-and-email-pdf.ts`
- [ ] Wire into `submitApplication` action (fire-and-forget after status update)
- [ ] Quality gate: `npm run type-check && npm run build`
- [ ] Manual test: submit → check compliance inbox for PDF attachment

### Phase 8: Dashboard Status Wiring
- [ ] Wire `/dashboard` page to load `merchant_applications` for current user
- [ ] Show correct status (Draft / Pending / Signed)
- [ ] "Continue Application" button links to `/application/step-{current_step}`
- [ ] Disable application entry if status is `PENDING` or `SIGNED`
- [ ] Quality gate: full `npm run verify`
