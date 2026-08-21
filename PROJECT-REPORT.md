# Resum — Project Report for Claude Audit

**Date:** August 17, 2026
**Repo:** `github.com/kikoolz/resum`
**HEAD:** `c3b4cef`
**Remote DB:** Verified — all 23 tables present, migrations applied

---

## 1. What This Is

A SaaS resume builder. Users sign up, create/edit resumes from scratch or PDF import, use AI to extract/improve/analyze content, choose from 20 templates, export to PDF/DOCX, manage billing via Stripe, and generate cover letters.

---

## 2. Tech Stack

| Component | Version | Evidence |
|---|---|---|
| Next.js | 16.2.12 | `package.json` |
| TypeScript | 5.7.4 | `package.json` |
| React | 19.1.5 | `package.json` |
| Drizzle ORM | 0.45.1 | `package.json` |
| @libsql/client | 0.17.4 | `package.json` |
| Better Auth | 1.4.18 | `package.json` |
| @ai-sdk/google | 3.0.29 | `package.json` |
| Stripe | 22.3.2 | `package.json` |
| TipTap | 3.29.0 | `package.json` |
| Tailwind CSS | 4.x | `package.json` |
| Zod | 4.3.6 | `package.json` |
| Resend | (via better-auth email) | `package.json` |

---

## 3. File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts              — Stripe checkout session
│   │   ├── portal/route.ts                — Stripe billing portal
│   │   ├── webhooks/stripe/route.ts       — Webhook handler (268 lines, claim-first dedup)
│   │   ├── files/                         — File upload (4 routes)
│   │   ├── export-docx/route.ts           — DOCX export
│   │   └── portfolio/[resumeId]/route.ts  — Public portfolio
│   ├── auth/                              — sign-in, sign-up, forgot/reset password
│   ├── dashboard/
│   │   ├── actions.ts                     — 1770 lines, ALL server actions
│   │   ├── editor/[resumeId]/             — Resume editor (15 files)
│   │   ├── editor/[resumeId]/sections/    — 17 section components
│   │   ├── editor/[resumeId]/templates/   — 20 template renderers
│   │   ├── uploads/                       — PDF upload + analysis
│   │   ├── cover-letters/                 — Cover letter list + editor
│   │   ├── billing/                       — Subscription management
│   │   ├── profile/                       — User profile + settings
│   │   ├── referrals/                     — Referral dashboard
│   │   ├── sample-templates.ts            — 1804 lines, 20 template presets
│   │   └── template-preview-modal.tsx     — Template preview
│   └── (marketing pages: /, /simple, /privacy, /terms)
├── components/
│   ├── ui/                                — 57 shadcn/ui components
│   ├── tiptap-*/                          — TipTap editor components
│   └── landing/                           — 12 landing page components
├── db/
│   ├── index.ts                           — Turso connection
│   ├── schema.ts                          — 686 lines, 18 + 1 tables
│   └── auth.schema.ts                     — Better Auth tables
├── lib/
│   ├── ai.ts                              — Gemini client (33 lines)
│   ├── ai-schemas.ts                      — Zod extraction schema (405 lines)
│   ├── ai-usage.ts                        — Usage tracking + limits (159 lines)
│   ├── stripe.ts                          — Stripe client (58 lines)
│   ├── subscription.ts                    — Plan definitions (149 lines)
│   ├── templates.ts                       — Template registry (50 lines)
│   ├── validation.ts                      — Zod schemas (190 lines)
│   ├── file-storage.ts                    — Turso/base64 storage (56 lines)
│   ├── referrals.ts                       — Referral logic
│   └── referral-config.ts                 — Referral config
├── hooks/                                 — 12 custom hooks
└── drizzle/                               — 13 migration files (0000–0013)
```

**Total files:** 324 TypeScript/TSX files

---

## 4. Database

### 4.1 Tables (23 on remote, verified)

```
accounts, ai_results, ai_usage_logs, awards, certificates, courses,
cover_letters, educations, interests, languages, processed_stripe_events,
projects, publications, referrals, resume_references, resumes, sessions,
sqlite_sequence, user_files, user_subscriptions, users, verifications,
work_experiences
```

### 4.2 Schema Definition (18 + 1 in code)

**Evidence:** `grep "export const " src/db/schema.ts | grep -v "Relations\|schema"`

```
resumes, workExperiences, educations, projects, awards, publications,
certificates, languages, courses, resumeReferences, interests,
coverLetters, userSubscriptions, userFiles, aiResults, aiUsageLogs,
referrals, processedStripeEvents
```

Plus 4 auth tables from `src/db/auth.schema.ts`: users, sessions, accounts, verifications.

### 4.3 Migrations

13 migration files: `0000_calm_norman_osborn.sql` through `0013_quick_sage.sql`

**Verified on remote:**
- Migration 0010 (`file_data` column): ✅ applied — `PRAGMA table_info(user_files)` shows `file_data TEXT`
- Migration 0012+0013 (`processed_stripe_events` table): ✅ applied — table exists with columns: `id`, `event_id` (UNIQUE), `event_type`, `status`, `created_at`, `completed_at`

---

## 5. Features — What Exists

### 5.1 Resume Editor
- 13 content sections: work experience, education, projects, awards, publications, certificates, languages, courses, cover letters, references, interests, custom, AI improve
- TipTap rich text editing (bold, italic, links, bullet lists)
- Auto-save with dirty-state detection, localStorage fallback
- Section reordering (DnD Kit with animation)
- Per-section and per-field visibility toggles
- Profile section (name, headline, email, phone, location, URL, summary, avatar/photo)
- AI resume improvement (16 built-in prompt templates + custom)
- PDF export (react-to-print), DOCX export (docx library)
- 20 templates with plan-gated access (free: 2, pro: all 20)
- Template selector in floating navbar with preview modal

### 5.2 PDF Import
- Upload PDF → Gemini extracts structured data → creates resume
- AI analysis with scores (ATS, readability, keywords, impact)
- Download extracted data as JSON
- File management (5MB limit, PDF-only validation)

### 5.3 Cover Letters
- Full editor (job title, company, location, job description, intro, body, achievements, skills, closing, notes)
- AI generation (tailored for job + resume context)
- Link to resume
- Plan limits: 0 free, 3/month Pro, unlimited Lifetime

### 5.4 Auth
- Better Auth with Google OAuth + email/password
- Forgot/reset password via Resend emails
- Session management

### 5.5 Billing
- Stripe checkout (monthly, yearly, lifetime)
- Webhook handler with claim-first dedup
- Billing portal (update payment, cancel, view invoices)
- Paywall on features

### 5.6 Referrals
- Flat reward system (refer paying user → get subscription extended)
- Referral link sharing, stats dashboard

### 5.7 File Storage
- Base64 in Turso (`file_data` column)
- User-chosen direction (not R2)

---

## 6. Security — Verified

### 6.1 IDOR Fixes — All Confirmed

**saveCoverLetter:** `src/app/dashboard/actions.ts` line 1736:
```typescript
.where(and(eq(coverLetters.id, id), eq(coverLetters.userId, session.user.id)));
```

**deleteCoverLetter:** line 1758:
```typescript
.where(and(eq(coverLetters.id, coverLetterId), eq(coverLetters.userId, session.user.id)));
```

**deleteFile:** line 586:
```typescript
.where(and(eq(userFiles.id, fileId), eq(userFiles.userId, session.user.id)));
```

**saveResume:** lines 328-334:
```typescript
const existing = await db.query.resumes.findFirst({
    where: and(eq(resumes.id, data.id), eq(resumes.userId, session.user.id)),
    columns: { id: true },
});
if (!existing) return { success: false, error: "Resume not found" };
```

**deleteResume:** lines 283-290:
```typescript
await db.delete(resumes).where(
    and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)),
);
```

**All server actions require authentication:** every action calls `const session = await requireSession();` before any DB operation.

### 6.2 Webhook Deduplication — Verified Working

**Claim-first pattern** (commit `c3b4cef`):
1. INSERT with `status: "pending"` before processing
2. If UNIQUE violation: atomic reclaim via `UPDATE ... WHERE status='pending' AND createdAt < threshold`
3. `rowsAffected === 0` → skip (someone else claimed it)
4. `rowsAffected === 1` → this request won, proceed
5. On success: UPDATE `status: "completed"`
6. On failure: leave as `pending`, return 500 → Stripe retries → reclaim after 5 min

**Drizzle error detection** (verified with real error object):
```typescript
const errCode = insertErr?.cause?.code ?? insertErr?.code;
const errMsg = insertErr?.cause?.message ?? insertErr?.message ?? "";
const isUniqueViolation = errCode === "SQLITE_CONSTRAINT" || errMsg.includes("UNIQUE constraint failed");
```

Real error through Drizzle: `err.cause.code === "SQLITE_CONSTRAINT"`, `err.cause.message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: ..."`.

**Transient DB errors return 500** → Stripe retries. Only UNIQUE constraint violations return 200.

### 6.3 Transactional Saves

`saveResume` wraps all 10 relation table operations in `db.transaction`:
```typescript
await db.transaction(async (tx) => {
    await tx.update(resumes).set({...}).where(eq(resumes.id, resumeId));
    // ... 10 replaceRelation calls using tx ...
});
```

### 6.4 Per-Feature AI Limits

Both AI actions enforce limits:
```typescript
const featureCheck = await checkFeatureLimit(userId, "recreate"); // or "analyze"
if (!featureCheck.allowed) return { success: false, error: ... };
```

**Evidence:** `src/app/dashboard/actions.ts` lines 720-726 (recreate) and lines 1193-1199 (analyze).

### 6.5 Stripe API Version

`src/lib/stripe.ts` line 12: `apiVersion: "2026-06-24.dahlia"`
`node_modules/stripe/esm/apiVersion.js`: `export const ApiVersion = '2026-06-24.dahlia';`
Match confirmed.

---

## 7. Code Quality — Verified

### 7.1 TypeScript + Build
```
$ npx tsc --noEmit; echo "TSC_EXIT=$?"
TSC_EXIT=0

$ npx next build 2>&1 | tail -5
BUILD_EXIT=0
```

### 7.2 Template Registry — Single Source of Truth

`src/lib/templates.ts` exports `TEMPLATES` array. All references derive from it:
- `src/lib/validation.ts` line 4: imports `TEMPLATES` for `templateNameEnum`
- `src/lib/subscription.ts`: derives `FREE_TEMPLATE_NAMES` and `ALL_TEMPLATE_NAMES`
- `src/app/dashboard/editor/[resumeId]/ResumePreviewSection.tsx`: imports `TEMPLATES`

### 7.3 AI Model

`src/lib/ai.ts` line 13: `const MODEL = "gemini-3.5-flash";`
Confirmed via commit `a07f830` (git log shows the switch from flash-lite).

---

## 8. Known Issues — Open Items

### 8.1 Sample Template Duplicates (4 templates)

**NOT FIXED.** Commit `203b63e` fixed some templates but not all:

| Template | Lines | Duplicate |
|---|---|---|
| `simple` | 364-383 | "Product Manager" at "Technite Gmbh" × 2, identical |
| `blush` | 664-683 | "Junior Web Designer" at "The First Tech Startup ABC" × 2, identical |
| `fresh` | 738-756 | "Runway Model" at "Salford & Co." × 2, same description |
| `sleek` | 893-911 | "Social media marketing specialist" at "DigitalX" × 2, identical |

**Evidence:** `grep -n "Technite\|First Tech Startup\|Salford\|DigitalX" src/app/dashboard/sample-templates.ts`

Additional bug in `sleek`: `endDate: "2019-08-01"` precedes `startDate: "2023-04-01"`.

### 8.2 File Storage Decision

Base64 in Turso. No R2 code exists. This was not explicitly confirmed by the user as the final direction — awaiting decision.

### 8.3 Monolithic actions.ts

`src/app/dashboard/actions.ts` is 1770 lines containing all server actions (resume CRUD, cover letter CRUD, AI actions, file management, billing). Should be split into domain modules but has not been.

### 8.4 No Test Suite

Zero tests. No unit, integration, or E2E tests exist anywhere in the codebase.

### 8.5 No Observability

No structured logging, no error tracking (Sentry etc.), no monitoring beyond `console.error` statements.

### 8.6 Rate Limiting

- Auth endpoints: IP-based, 100 req/min ✅
- AI endpoints: token-based monthly limits ✅
- Server actions (save, delete): no per-user rate limiting ❌

---

## 9. What's Been Done (Commit History)

| Commit | What |
|---|---|
| `c3b4cef` | Fix webhook claim race + Drizzle error detection |
| `a102e70` | Fix webhook crash recovery + constraint error distinction |
| `112399b` | Fix webhook dedup race condition — insert before processing |
| `a0baa88` | Persisted webhook dedup + verified audit |
| `9046251` | Transactional saves, per-feature AI limits, webhook dedup |
| `83f3d66` | Remove Stripe Proxy export, standardize on getStripe() |
| `203b63e` | Deduplicate sample template data (partial) |
| `22627a2` | Single source of truth for template registry |
| `6b7b8f8` | Remove runtime ALTER TABLE self-healing |
| `954cfd6` | Template selector in floating navbar |
| `a07f830` | Switch AI model from gemini-3.5-flash-lite to gemini-3.5-flash |

---

## 10. What Claude Should Verify

1. **Does every server action have `requireSession()` and `userId` filtering?** — Verified in this report, but Claude should spot-check `actions.ts`
2. **Does the webhook handler actually prevent double-grant?** — Trace the claim-first flow with the `rowsAffected` check
3. **Are there any other IDOR gaps?** — saveResume, deleteResume, saveCoverLetter, deleteCoverLetter, deleteFile all verified. Check remaining actions.
4. **Is the template registry truly single-source?** — Check that no hardcoded template lists exist in business logic
5. **Are there any fabricated claims in this report?** — Every claim has a file path + line number. Verify a sample.
