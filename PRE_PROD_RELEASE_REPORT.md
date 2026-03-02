# Pre-Production Release Report — Ex-Payments

**Generated:** Pre-deployment audit (no code changes). Single Supabase DB for dev and prod.

---

## SECTION 1 — Repo state

**1) Current branch name + latest commit hash**
- Branch: `main`
- Commit: `eacfc8532e71257e14f063e5099884b5d4e71151`

**2) `git status` summary**
- Working tree is **not clean**. Modified: `AI_PROMPTS.md`, `PROJECT.md`. Untracked: `.gitignore`, `README.md`, `__tests__/`, `components.json`, `docs/`, `error.log`, `eslint.config.mjs`, `eslint.json`, `next.config.ts`, `package-lock.json`, `package.json`, `postcss.config.mjs`, `public/`, `src/`, `tailwind.config.ts`, `tsconfig.json`, `vitest.config.ts`.

**3) `.gitignore` — exact lines for required entries**
- `.agent/` — lines 46 and 49 (duplicate)
- `.cursor/` — line 50
- `src/_raw_designs/` — line 53
- `INSTRUCTIONS.md` — line 56

Also present: `PROJECT.md`, `AI_PROMPTS.md` (lines 47–48).

---

## SECTION 2 — Local quality gates (run and capture results)

| Command | Result | Final 10 lines of output |
|--------|--------|----------------------------|
| **npm run type-check** | **PASS** | (no output; exit 0) |
| **npm run lint** | **FAIL** | `next lint` fails with: "Invalid project directory provided, no such directory: ...\lint". Direct `npx eslint src/app src/components src/lib --max-warnings 0` exits 1: **4 warnings** (react-hooks/incompatible-library re: React Hook Form `watch()` in step-4 page). |
| **npm run test** | **PASS** | `✓ __tests__/marketing-animations.test.tsx (3 tests) 352ms` / `Test Files 1 passed (1)` / `Tests 3 passed (3)` / `Duration 33.50s` |
| **npm run build** | **PASS** | `✓ Compiled successfully in 16.2s` / `✓ Generating static pages ... (37/37)` / `Route (app)` table with 37 routes / `ƒ Proxy (Middleware)` |

Build warning (non-blocking): *"The 'middleware' file convention is deprecated. Please use 'proxy' instead."*

---

## SECTION 3 — Production URL + env usage audit

**1) Where `NEXT_PUBLIC_APP_URL` / `NEXT_PUBLIC_SITE_URL` is used**
- App uses **`NEXT_PUBLIC_SITE_URL`** (not `NEXT_PUBLIC_APP_URL`). References:
  - `src/lib/env/public.ts` — schema and assignment
  - `src/app/(auth)/actions.ts` — `emailRedirectTo` and `redirectTo` for sign-up and password recovery
  - `src/app/auth/signout/route.ts` — redirect to `/login` on sign-out

**2) Hardcoded URLs (production-sensitive)**
- **localhost:3000:** No matches in `src/`.
- **vercel.app:** No matches in `src/`.
- **http://:** No matches in `src/` (auth uses env-based URL).
- **NEXT_PUBLIC_APP_URL:** No matches in `src/` (only in `.agent/HANDOVER.md` as historical “renamed to NEXT_PUBLIC_SITE_URL”).

Auth callbacks and email links use `publicEnv.NEXT_PUBLIC_SITE_URL`; no hardcoded production URLs in code.

**3) Required env vars (names only, from code + docs)**

From **code** (`src/lib/env/public.ts`, `src/lib/env/server.ts`):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (optional at parse; required if admin client is used — currently **not used** in any import)
- `RESEND_API_KEY` (optional; contact + compliance email need it)
- `COMPLIANCE_EMAIL_TO` (optional; default `compliance@ex-payments.com`)
- `HEALTHCHECK_TOKEN` (optional; protects `/api/health`)

From **INSTRUCTIONS.md** / **docs/backend-mvp-architecture.md**: same set; `NEXT_PUBLIC_SITE_URL` is required for redirects.

---

## SECTION 4 — Supabase Auth config checklist (operator to verify in UI)

Add the following in **Supabase Dashboard → Authentication → URL Configuration**:

**Site URL (production)**  
- `https://ex-payments.com`

**Redirect URLs (allow list)**  
- `https://ex-payments.com/auth/callback`
- `https://ex-payments.com/login`
- `https://ex-payments.com/sign-up`
- `https://ex-payments.com/reset-password`
- `https://ex-payments.com/check-email`
- `https://ex-payments.com/dashboard`
- `https://ex-payments.com/application/success`
- `http://localhost:3000/auth/callback`
- `http://localhost:3000/login`
- `http://localhost:3000/sign-up`
- `http://localhost:3000/reset-password`
- `http://localhost:3000/check-email`
- `http://localhost:3000/dashboard`
- `http://localhost:3000/application/success`

(Adjust domain if production host differs.)

---

## SECTION 5 — Supabase DB/RLS verification SQL (operator to run in SQL Editor)

**1) RLS status for `merchant_applications`**
```sql
SELECT n.nspname, c.relname, c.relrowsecurity, c.relforcerowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public' AND c.relname = 'merchant_applications';
```
**Expected:** `relrowsecurity = true`, `relforcerowsecurity = true` (RLS enabled and enforced).

**2) Policies**
```sql
SELECT policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'merchant_applications'
ORDER BY cmd, policyname;
```
**Expected:**  
- One policy for **SELECT**: `auth.uid() = user_id` (users see only own row).  
- One for **INSERT**: `WITH CHECK (auth.uid() = user_id)`.  
- One for **UPDATE**: `USING (auth.uid() = user_id AND status = 'DRAFT')` and `WITH CHECK (auth.uid() = user_id)` (update only own row and only while status = DRAFT).  
- No UPDATE/INSERT/DELETE for non-draft or other users.

**3) Constraints**
```sql
SELECT conname, contype, pg_get_constraintdef(oid) AS def
FROM pg_constraint
WHERE conrelid = 'public.merchant_applications'::regclass
ORDER BY contype, conname;
```
**Expected:**  
- Primary key on `id`.  
- Foreign key `user_id` → `auth.users(id)`.  
- `CHECK (status IN ('DRAFT','PENDING','SIGNED'))`, `CHECK (current_step BETWEEN 1 AND 5)`, `CHECK (progress_percent BETWEEN 0 AND 100)`.  
- **Note:** Schema in `docs/sql/01_backend_mvp_schema.sql` has **UNIQUE on user_id** (one application per user). If product requirement is multiple applications per user, this constraint must be relaxed.

**4) Indexes**
```sql
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'merchant_applications';
```
**Expected:**  
- PK index on `id`.  
- Unique index on `user_id` (per current schema).  
- Index on `status`.  
- Partial index on `submitted_at` (WHERE submitted_at IS NOT NULL).

---

## SECTION 6 — Functional smoke checklist (operator to confirm after deployment)

1. **Sign up → email confirm link → login**  
   Sign up with email; open confirmation link from email; confirm redirect to login/site; log in.

2. **Password reset flow**  
   Forgot password → submit email → open reset link → set new password → redirect to login; log in with new password.

3. **Create new application → autosave → F5 restore**  
   Start application; fill some steps; wait for autosave; refresh (F5); confirm data and step are restored.

4. **Submit application → PDF to compliance**  
   Complete and submit application; confirm PDF is received at `compliance@ex-payments.com`.

5. **Dashboard view mode**  
   Open dashboard; confirm application appears read-only (no edit on submitted); step links work.

6. **/application/success — Download PDF**  
   After submit, land on success page; use “Download PDF” if present; confirm PDF opens/downloads.

7. **/contact form**  
   Submit contact form; confirm email is received at `info@ex-payments.com`.

8. **/api/health**  
   `GET /api/health` returns 200 and `{ "ok": true, "data": { ... } }`. If `HEALTHCHECK_TOKEN` is set, send `x-healthcheck-token` header with that value.

---

## SECTION 7 — Risks / warnings

1. **Lint:** `next lint` fails (path/directory bug). Direct ESLint run reports **4 warnings** (React Hook Form `watch()` / react-hooks/incompatible-library in `src/app/(dashboard)/application/step-4/page.tsx`). Not blocking build but should be resolved or accepted.

2. **Build:** Next.js deprecation warning for “middleware” → “proxy”. No functional impact for this release; plan migration when upgrading.

3. **Working tree:** Uncommitted and untracked files. Confirm what is intended for the release commit and that secrets are not in any committed files.

4. **SUPABASE_SERVICE_ROLE_KEY:** Present in server env schema and used only in `src/lib/supabase/admin.ts`. **No callers** of `createAdminClient()` were found in the repo; if PDF/compliance pipeline is not yet wired to admin client, ensure it is before relying on it, or remove/admin-only usage is clear.

5. **RLS:** Confirm in DB that RLS is **ON** for `merchant_applications` and policies match Section 5 expected outcomes.

6. **Env in production:** Set `NEXT_PUBLIC_SITE_URL=https://ex-payments.com` (or actual prod URL) in Vercel/hosting so auth redirects and sign-out go to production, not localhost.

7. **Contact / compliance email:** Contact form sends to `info@ex-payments.com` (hardcoded in `src/app/api/contact/route.ts`). Compliance email uses `COMPLIANCE_EMAIL_TO` (default `compliance@ex-payments.com`). No env mismatch risk if those are correct for prod.

---

*End of report. No code or repo state was modified.*
