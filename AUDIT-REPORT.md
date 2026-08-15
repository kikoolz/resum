# Resum — Project Audit Report

**Date:** August 15, 2026
**Repo:** `github.com/kikoolz/resum`
**Stack:** Next.js 16 (App Router, Turbopack), TypeScript 5.7, Turso (libSQL) via Drizzle ORM 0.45, Better Auth 1.4, Google Gemini, Stripe, TipTap 3.29, shadcn/ui, Tailwind CSS 4, React 19.1.5, Resend

---

## 1. Project Scope

A SaaS resume builder with AI-powered extraction, improvement, and analysis. Supports 20 resume templates, PDF import/export, DOCX export, cover letter generation, Stripe billing (subscriptions + lifetime), and a referral/affiliate system.

---

## 2. Architecture

### 2.1 File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts          — Stripe checkout session
│   │   ├── portal/route.ts            — Stripe billing portal
│   │   ├── webhooks/stripe/route.ts   — Stripe webhook handler
│   │   ├── files/                     — File upload (upload, upload-url, upload-image)
│   │   └── portfolio/[resumeId]/      — Public portfolio endpoint
│   ├── auth/                          — sign-in, sign-up, forgot/reset password
│   ├── dashboard/
│   │   ├── actions.ts                 — 1761 lines, ALL server actions
│   │   ├── editor/[resumeId]/         — Main resume editor
│   │   ├── uploads/                   — PDF upload + analysis
│   │   ├── cover-letters/             — Cover letter list + editor
│   │   ├── billing/                   — Subscription management
│   │   ├── profile/                   — User profile + settings
│   │   ├── referrals/                 — Referral dashboard
│   │   ├── sample-templates.ts        — 20 template presets
│   │   └── ...
│   └── (marketing pages)
├── components/                        — Shared UI components
├── db/
│   ├── index.ts                       — DB connection
│   ├── schema.ts                      — 18 tables, Drizzle schema
│   └── migrate.ts                     — Migration runner
├── lib/
│   ├── ai.ts                          — Gemini client + prompts
│   ├── ai-schemas.ts                  — Zod schemas for AI extraction
│   ├── ai-usage.ts                    — Usage tracking + limit enforcement
│   ├── stripe.ts                      — Stripe client
│   ├── subscription.ts                — Plan definitions + limits
│   ├── templates.ts                   — Template registry (single source of truth)
│   ├── validation.ts                  — Zod schemas (derived from templates.ts)
│   ├── file-storage.ts                — Turso/base64 file storage
│   ├── referrals.ts                   — Referral code generation + rewards
│   ├── referral-config.ts             — Referral program config
│   └── utils.ts                       — Utility functions
└── drizzle/                           — Migration SQL files
```

### 2.2 Database Schema (18 tables)

| Table | Purpose |
|---|---|
| `auth_users` | User accounts |
| `auth_sessions` | Better Auth sessions |
| `auth_accounts` | OAuth providers |
| `auth_verifications` | Email verification tokens |
| `resumes` | Resume headers (JSON fields for skills, sectionOrder, visibility) |
| `work_experiences` | Work experience entries |
| `educations` | Education entries |
| `projects` | Project entries |
| `awards` | Award entries |
| `publications` | Publication entries |
| `certificates` | Certificate entries |
| `languages` | Language entries |
| `courses` | Course entries |
| `resume_references` | Reference entries |
| `interests` | Interest entries |
| `cover_letters` | Cover letter content |
| `user_files` | Uploaded PDFs (base64 in `file_data`) |
| `ai_results` | Cached AI extractions |
| `ai_usage_logs` | Per-request AI usage tracking |
| `user_subscriptions` | Stripe subscription state |
| `referrals` | Referral relationships + rewards |

### 2.3 Environment Variables (14 required)

```
BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,
TURSO_DATABASE_URL, TURSO_AUTH_TOKEN,
GOOGLE_AI_STUDIO_API_KEY,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
STRIPE_PRO_PRICE_ID_MONTHLY, STRIPE_PRO_PRICE_ID_YEARLY, STRIPE_LIFETIME_PRICE_ID,
NEXT_PUBLIC_BASE_URL, RESEND_API_KEY
```

---

## 3. Feature Completeness

### 3.1 Resume Editor — ✅ Complete

| Feature | Status | Notes |
|---|---|---|
| 13 content sections | ✅ | Work, education, projects, awards, publications, certificates, languages, courses, cover letters, references, interests, custom, AI improve |
| Rich text editing | ✅ | TipTap with bold, italic, links, bullet lists |
| Auto-save | ✅ | Debounced, dirty-state detection, localStorage fallback |
| Section reordering | ✅ | DnD Kit with animation |
| Section visibility toggles | ✅ | Per-section on/off |
| Field visibility toggles | ✅ | Per-field on/off within sections |
| Profile section | ✅ | Name, headline, email, phone, location, URL, summary, avatar/photo |
| AI resume improvement | ✅ | 16 prompt templates + custom prompt, context-aware |
| PDF export | ✅ | react-to-print |
| DOCX export | ✅ | `docx` library |
| Template switching | ✅ | 20 templates, preview modal, plan-gated |
| Template selector in navbar | ✅ | Floating toolbar with live template switching |

### 3.2 PDF Import — ✅ Complete

| Feature | Status | Notes |
|---|---|---|
| PDF upload | ✅ | 5MB limit, PDF-only validation |
| AI extraction | ✅ | Gemini via Vercel AI SDK, structured output |
| Extracted data review | ✅ | Resume preview + raw JSON download |
| Analysis tab | ✅ | Scores (ATS, readability, keywords, impact), strengths, improvements |
| Cache | ✅ | `ai_results` table, keyed by fileId + resultType |
| Auto-create resume | ✅ | "Create Resume" button on upload |

### 3.3 Cover Letters — ✅ Complete

| Feature | Status | Notes |
|---|---|---|
| Full editor | ✅ | 7 sections (intro, body, achievements, skills, closing, notes) |
| AI generation | ✅ | Tailored for job + resume context |
| Link to resume | ✅ | Optional resume association |
| Export | ✅ | PDF export |
| CRUD | ✅ | Create, list, edit, delete |
| Plan limits | ✅ | 0 free, 3/month Pro, unlimited Lifetime |

### 3.4 Auth — ✅ Complete

| Feature | Status | Notes |
|---|---|---|
| Google OAuth | ✅ | Better Auth provider |
| Email/password | ✅ | Better Auth credentials |
| Forgot password | ✅ | Resend email + token flow |
| Reset password | ✅ | Token validation + password update |
| Session management | ✅ | Better Auth sessions |
| Account deletion | ✅ | Cascading delete of all user data |

### 3.5 Billing — ✅ Complete

| Feature | Status | Notes |
|---|---|---|
| Stripe checkout | ✅ | Monthly, yearly, lifetime |
| Webhook handling | ✅ | checkout.session.completed, customer.subscription.updated/deleted, invoice.payment_failed |
| Billing portal | ✅ | Update payment, cancel, view invoices |
| Paywall | ✅ | Template limits, cover letter limits, AI limits, feature gating |
| Subscription status | ✅ | Real-time from Stripe API |
| Event dedup | ✅ | In-memory Set prevents duplicate webhook processing |

### 3.6 Referrals — ✅ Complete

| Feature | Status | Notes |
|---|---|---|
| Referral codes | ✅ | Unique code generation |
| Share links | ✅ | URL-based tracking |
| 20% commission | ✅ | Stripe Connect payouts |
| Affiliate onboarding | ✅ | Stripe OAuth flow |
| Stats dashboard | ✅ | Clicks, conversions, earnings |
| Tier system | ✅ | Bronze → Gold based on referrals |

### 3.7 File Management — ✅ Complete

| Feature | Status | Notes |
|---|---|---|
| Upload | ✅ | PDF only, 5MB limit |
| Storage | ✅ | Base64 in Turso (`file_data` column) |
| List/delete | ✅ | User can view and delete files |
| IDOR protection | ✅ | userId verified on delete |

---

## 4. Security Audit

### 4.1 Authentication & Authorization

| Check | Status | Notes |
|---|---|---|
| Session required on all actions | ✅ | `requireSession()` called in every server action |
| userId from session, not client | ✅ | All queries filter by `session.user.id` |
| No client-passed userId | ✅ | `deleteCoverLetter` uses session user, not param |
| Auth middleware on dashboard | ✅ | Next.js middleware redirects unauthenticated users |

### 4.2 IDOR Prevention

| Check | Status | Notes |
|---|---|---|
| `saveCoverLetter` | ✅ | Selects by id + userId |
| `deleteCoverLetter` | ✅ | Deletes by id + userId |
| `deleteFile` | ✅ | Deletes by id + userId |
| `saveResume` | ⚠️ | No explicit userId check (resume ID is UUID, hard to guess) |
| `deleteResume` | ⚠️ | Same as above |
| `saveAnalysis` | ⚠️ | Same as above |

**Recommendation:** Add explicit `userId` filter to `saveResume`, `deleteResume`, and `saveAnalysis` for defense-in-depth.

### 4.3 Input Validation

| Check | Status | Notes |
|---|---|---|
| Zod schemas | ✅ | All form inputs validated |
| File type enforcement | ✅ | PDF-only checked server-side |
| File size enforcement | ✅ | 5MB limit checked server-side |
| SQL injection | ✅ | Drizzle ORM parameterizes all queries |
| XSS | ✅ | React escapes by default; TipTap sanitizes rich text |

### 4.4 Secrets Management

| Check | Status | Notes |
|---|---|---|
| No secrets in client bundle | ✅ | All API keys server-side only |
| `NEXT_PUBLIC_` prefix only for publishable keys | ✅ | Stripe publishable key + base URL |
| `.env.local` gitignored | ✅ | Standard Next.js behavior |
| `.env.example` documented | ✅ | All 14 vars listed with descriptions |

### 4.5 Rate Limiting

| Check | Status | Notes |
|---|---|---|
| Auth endpoints | ✅ | IP-based, 100 req/min |
| AI endpoints | ✅ | Token-based monthly limits |
| Per-feature AI limits | ✅ | `checkFeatureLimit` enforced on recreate + analyze |
| Server actions (save, delete) | ❌ | No per-user rate limiting |
| File uploads | ❌ | No rate limiting beyond file size |

**Recommendation:** Add per-user rate limiting to `saveResume` and `saveCoverLetter` to prevent abuse.

---

## 5. Code Quality

### 5.1 Architecture Decisions

| Decision | Assessment |
|---|---|
| Single `actions.ts` file (1761 lines) | ⚠️ Works but should be split into domain-specific action files |
| Turso + base64 file storage | ✅ Simple, works for MVP; R2 would be better at scale |
| Template registry in `templates.ts` | ✅ Single source of truth, derived in validation/subscription |
| Drizzle ORM | ✅ Type-safe, good Turso support |
| Better Auth | ✅ Lightweight, good Google OAuth support |

### 5.2 Type Safety

| Check | Status | Notes |
|---|---|---|
| TypeScript strict mode | ✅ | `noUncheckedIndexedAccess: true` |
| No `any` types in business logic | ✅ | Only in schema casting (`as any` for Drizzle table refs) |
| Zod runtime validation | ✅ | All user inputs validated |
| AI schema validation | ✅ | `Output.object({ schema })` with Zod |

### 5.3 Error Handling

| Check | Status | Notes |
|---|---|---|
| Server actions return `{ success, error }` | ✅ | Consistent pattern |
| AI failures caught | ✅ | try/catch with error messages |
| Stripe webhook errors logged | ✅ | Console.error + 500 response |
| Missing env vars | ⚠️ | No startup assertion; fails at runtime |

### 5.4 Testing

| Check | Status | Notes |
|---|---|---|
| Unit tests | ❌ | None |
| Integration tests | ❌ | None |
| E2E tests | ❌ | None |

**This is the biggest gap.** No test suite exists.

---

## 6. Deployment

| Check | Status | Notes |
|---|---|---|
| Vercel deployment | ✅ | Auto-deploys from `main` |
| Build passes | ✅ | `next build` clean |
| TypeScript compiles | ✅ | `tsc --noEmit` clean |
| Environment variables | ✅ | All 14 set on Vercel |
| Database migrations | ⚠️ | Must be applied via Vercel CLI or local with real credentials |
| Cold start performance | ⚠️ | Turso connection established per request (no connection pooling) |

---

## 7. Completion Summary

### ✅ Fully Complete (95%+)
- Resume editor with all 13 sections
- PDF import + AI extraction
- AI analysis with scoring
- 20 templates with plan-gated access
- Cover letter editor + AI generation
- Auth (Google OAuth + email/password + reset)
- Stripe billing (checkout + webhooks + portal)
- Referral system with Stripe Connect
- File management
- Profile + settings
- IDOR fixes on cover letters and files
- Transactional saves
- Per-feature AI rate limiting
- Webhook event deduplication

### ⚠️ Mostly Complete (needs polish)
- IDOR on `saveResume`/`deleteResume` (UUID makes exploitation unlikely, but defense-in-depth missing)
- Rate limiting on server actions (no per-user throttle)
- Migration 0010 (`file_data` column) may not be applied to remote DB
- No env var presence assertions at startup

### ❌ Not Started
- Test suite (unit, integration, E2E)
- Error boundaries on file uploads
- Stripe client caching
- DB-based rate limiting
- `actions.ts` split into domain modules
- Observability (logging, monitoring, error tracking)

---

## 8. Recommended Next Steps

### Critical (P0)
1. **Verify migration 0010 is applied** to remote Turso DB
2. **Add userId filter** to `saveResume`, `deleteResume`, `saveAnalysis`
3. **Write at least smoke tests** for core flows (auth, save resume, AI extract)

### High (P1)
4. **Split `actions.ts`** into `resume-actions.ts`, `cover-letter-actions.ts`, `ai-actions.ts`, `file-actions.ts`
5. **Add env var assertions** at startup (fail fast if missing)
6. **Add error boundaries** around file upload components
7. **Add retry logic** for Gemini API calls (transient failures)

### Medium (P2)
8. **Add per-user rate limiting** to save/update actions
9. **Add Stripe client caching** (avoid re-instantiating per request)
10. **Add structured logging** (replace console.error with a logger)
11. **Add Sentry or similar** for error tracking in production

### Low (P3)
12. **Migrate file storage to Cloudflare R2** (base64 in DB won't scale past ~4.5MB)
13. **Add connection pooling** for Turso (currently per-request)
14. **Add monitoring dashboards** (Vercel Analytics, Stripe dashboard)

---

## 9. Overall Assessment

**The project is approximately 85-90% production-ready.** The core product is fully functional: users can sign up, create resumes from scratch or PDF import, use AI features, manage billing, and generate cover letters. The hardening pass has addressed the most critical security and data integrity issues.

The primary gaps are:
1. **No tests** — the biggest risk for regressions
2. **Monolithic actions.ts** — maintenance burden as features grow
3. **IDOR gaps on resume operations** — low risk (UUID) but should be closed
4. **No observability** — hard to debug production issues

For an MVP launch, the current state is acceptable. For a production SaaS with paying customers, the test suite and observability gaps need to be addressed.
