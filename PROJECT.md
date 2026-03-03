# 🚀 Project Blueprint: Ex-Payments

## 1. 🎯 Executive Summary & PRD (Product Requirements)
- **Mission:** A premium fintech merchant acquiring platform designed to maximize conversion from visitor to submitted application via a highly optimized, multi-step onboarding flow.
- **Target Audience:** E-commerce (Low-risk) and complex verticals (High-risk: iGaming, Crypto, Forex).
- **Core User Flow:**
  1. User explores the Marketing Site (SEO-optimized, Stripe-aesthetic).
  2. User signs up/logs in via **Email + Password**.
  3. On signup, user verifies email via **Confirmation Link** (no OTP for MVP).
  4. User enters the 5-step Onboarding Engine (100+ fields with conditional logic).
  5. User can drop off and return later (**draft autosave**).
  6. User submits the final application → status becomes **PENDING**.
  7. On submit, the system generates a **PDF** of the submitted application and emails it to **compliance@ex-payments.com**.

## 2. 🏗 Architecture & Tech Stack (Strict)
- **Core Framework:** Next.js 16 (pinned 16.1.6, App Router strictly)
- **Language:** TypeScript (Strict mode enabled)
- **Styling & UI:** Tailwind CSS + Shadcn/UI (Base)
- **Animation:** Framer Motion + inline SVG micro-interactions (code-generated).
- **Database & Auth:** Supabase (PostgreSQL + Email/Password Auth + Confirmation Link + Password Recovery)
- **Forms:** React Hook Form + Zod (schema splitting per step)
- **Client State (UI-only):** Zustand for non-sensitive UI state (current step, progress, applicationId cache)
- **Draft Storage (Sensitive):** Supabase-first (debounced autosave). **Do NOT store sensitive form data in localStorage.**
- **Email Provider:** Resend
- **PDF Generation:** @react-pdf/renderer (server-side)
- **Security Baseline:** Supabase RLS ON from MVP; Cloudflare DNS (+ optional Turnstile for forms/auth)

## 3. 🗄️ Core Data Schema (Supabase PostgreSQL)
> Keep the 100+ form fields in JSONB for flexible partial saves, but also store a few indexed columns for status/progress.

**Table: `merchant_applications`**
- `id` uuid (pk)
- `user_id` uuid (unique, fk to auth.users)
- `status` text enum: `DRAFT | PENDING | SIGNED`
- `current_step` smallint (1..5)
- `progress_percent` smallint (0..100)
- `form_data` jsonb default `{}`
- `submitted_at` timestamptz null
- `created_at` timestamptz default now()
- `updated_at` timestamptz default now()

**Indexes**
- unique index on `user_id`
- index on `status`
- index on `submitted_at`

## 4. 📂 Enforced Directory Structure
```text
src/
├── _raw_designs/        # Google Stitch HTML exports (source of truth for UI migration)
├── app/
│   ├── (marketing)/     # Public pages (Solutions, About, FAQ, Contact, Industries)
│   ├── (auth)/          # Login, Sign Up, Check Email, Reset Password
│   └── (dashboard)/     # Client Dashboard & Onboarding Engine
├── components/
│   ├── ui/              # Shadcn/Tailwind base components
│   ├── layout/          # shells, headers, footers
│   └── forms/           # multi-step form components
├── emails/              # React Email templates (transactional)
├── lib/
│   ├── supabase/        # server/client supabase helpers
│   ├── validators/      # zod schemas per step
│   └── utils/
├── server/
│   ├── actions/         # server actions: draft save, submit, etc.
│   └── pdf/             # PDF document builders
└── types/

## 5. 📜 Architectural Decision Records (ADRs)

### ADR-01: Auth Strategy
- Auth is **Email + Password**.
- Signup requires email verification via **Confirmation Link**.
- Password reset uses **Recovery Link** → user lands on **Reset Password** page and sets a new password.

### ADR-02: Draft Persistence (Security First)
- **Sensitive form data** must be stored in Supabase (DB) only.
- Browser storage may contain only minimal non-sensitive UI state:
  - `applicationId`, `currentStep`, `progressPercent`, `lastSavedAt` (prefer sessionStorage).
- No localStorage persistence for full `form_data`.

### ADR-03: Supabase RLS (Required from MVP)
- Enable RLS on `merchant_applications`.
- Minimal policies:
  - `SELECT/UPDATE/INSERT` allowed only where `user_id = auth.uid()`.
- No service-role bypass for normal app flows.

### ADR-04: Final Submission → PDF → Compliance Email
- On final submit:
  1) Validate full payload (Zod).
  2) Persist `form_data` + set `status=PENDING`, `submitted_at`.
  3) Generate PDF server-side using `@react-pdf/renderer`.
  4) Send email via Resend to `compliance@ex-payments.com` with PDF attachment.
- PDF storage is optional; MVP: do not store PDF unless size/traceability requires it later.

### ADR-05: UI Migration Quality Gates (Mandatory)
- Raw HTML from `/src/_raw_designs` is migrated into App Router pages/components.
- Quality gates required for each batch:
  - `npm run type-check`
  - `npm run lint`
  - `npm test`
  - `npm run build`

## 6. 🗺️ Roadmap & Task Tracker

### Phase 1: MVP Scope
- [x] Repo created + Vercel project created
- [x] Supabase project created
- [ ] Update PROJECT.md to reflect approved decisions (this file)
- [ ] Add migration workflow for Raw HTML → Next.js pages
- [ ] Mass migrate all Stitch HTML pages into Next.js structure
- [ ] Implement Auth: Sign up, Login, Check Email, Reset Password
- [ ] Implement Onboarding Engine: 5 steps + conditional fields
- [ ] Draft autosave to Supabase (debounced) + restore draft
- [ ] Final submit pipeline: validate → save → PDF → Resend email
- [ ] Client Dashboard: minimal status + continue/resume application
- [ ] Hardening: RLS policies + basic rate limiting/Turnstile where needed

### 🚧 Current Active Task
**Focus:** Mass migration of all pages from `/src/_raw_designs` into the Next.js App Router architecture with strict quality gates.
**Known Blockers/Bugs:** None (Step 1 HTML confirmed).