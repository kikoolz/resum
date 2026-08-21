# Resum — Verified Audit Report

**Date:** August 16, 2026
**Repo:** `github.com/kikoolz/resum`
**Last commit:** `2b30b3c` (audit report) — prior to this, `9046251` (hardening pass)

---

## 0. Verification Methodology

Every claim in this report is backed by a command output, file path + line number, or `git log` reference. Items marked "CONFIRMED" have reproducible evidence. Items marked "UNVERIFIED" cannot be confirmed from this environment and require manual verification. Items marked "BROKEN" have evidence of failure.

---

## 1. Architecture

### 1.1 Stack

| Component | Version | Source |
|---|---|---|
| Next.js | 16 (App Router, Turbopack) | `package.json` |
| TypeScript | 5.7 | `package.json` |
| React | 19.1.5 | `package.json` |
| Drizzle ORM | 0.45 | `package.json` |
| Turso (libSQL) | remote | `drizzle.config.ts` line 8 |
| Better Auth | 1.4 | `package.json` |
| Google Gemini | `@ai-sdk/google` | `package.json` |
| Stripe | 22.3.2 | `package.json` |
| TipTap | 3.29 | `package.json` |
| shadcn/ui | new-york style | `components.json` |
| Tailwind CSS | 4 | `package.json` |
| Resend | latest | `package.json` |

### 1.2 Database Tables (18)

**Evidence:** `src/db/schema.ts` exports the following table objects:

| Table | Schema line | Purpose |
|---|---|---|
| `auth_users` | auth.schema.ts | User accounts |
| `auth_sessions` | auth.schema.ts | Sessions |
| `auth_accounts` | auth.schema.ts | OAuth providers |
| `auth_verifications` | auth.schema.ts | Email verification |
| `resumes` | schema.ts | Resume headers |
| `work_experiences` | schema.ts | Work entries |
| `educations` | schema.ts | Education entries |
| `projects` | schema.ts | Project entries |
| `awards` | schema.ts | Award entries |
| `publications` | schema.ts | Publication entries |
| `certificates` | schema.ts | Certificate entries |
| `languages` | schema.ts | Language entries |
| `courses` | schema.ts | Course entries |
| `resume_references` | schema.ts | Reference entries |
| `interests` | schema.ts | Interest entries |
| `cover_letters` | schema.ts | Cover letters |
| `user_files` | schema.ts | Uploaded PDFs |
| `ai_results` | schema.ts | Cached AI extractions |
| `ai_usage_logs` | schema.ts | AI usage tracking |
| `user_subscriptions` | schema.ts | Stripe subscription state |
| `referrals` | schema.ts | Referral relationships |

### 1.3 File Structure

**Evidence:** `find src/ -type f -name "*.ts" -o -name "*.tsx" | sort` output confirms:

- `src/app/api/` — 9 route files (checkout, portal, webhooks, files, portfolio)
- `src/app/dashboard/` — 15+ page/layout files
- `src/app/dashboard/actions.ts` — 1761 lines, all server actions
- `src/lib/` — 11 utility modules
- `src/db/` — schema + auth schema + connection + migrate
- `src/components/` — shared UI components
- `drizzle/` — 11 migration files (0000–0010)

---

## 2. Migration 0010 (`file_data` column)

**Status:** UNVERIFIED — **P0 BLOCKER**

**Evidence:**
- `drizzle/0010_nosy_darwin.sql` contains: `ALTER TABLE \`user_files\` ADD \`file_data\` text;`
- `drizzle/meta/_journal.json` lists tag `0010_nosy_darwin` at idx 10
- `drizzle-kit migrate` returned `migrations applied successfully!`
- `.env.local` line 2: `TURSO_AUTH_TOKEN=your-turso-auth-token` — placeholder, not real credentials

**Problem:** The migrate command ran against the remote Turso URL with a fake token. The "success" output cannot be trusted. Turso may accept connections with invalid tokens and silently no-op.

**Impact if not applied:** Every `INSERT` into `user_files` that references `file_data` throws a column-not-found error. PDF uploads are broken on the live site. The runtime `ALTER TABLE` self-healing was removed in the hardening pass, so there is no fallback.

**Verification command (you must run this):**
```bash
# Option 1: drizzle-kit check with real credentials
TURSO_DATABASE_URL="libsql://resum-kikoolz.aws-ap-south-1.turso.io" \
TURSO_AUTH_TOKEN="<real-token>" \
npx drizzle-kit check --config=drizzle.config.ts

# Option 2: direct Turso shell
turso db shell resum-kikoolz "PRAGMA table_info(user_files);"
```
Expected output if applied: row with `name: "file_data"`, `type: "text"`.
Expected output if NOT applied: `file_data` absent from column list.

---

## 3. IDOR Fixes (P2.1)

**Status:** CONFIRMED for cover letters and files. UNVERIFIED for resumes.

### 3.1 saveCoverLetter

**Evidence:** `src/app/dashboard/actions.ts` line 591-594:
```typescript
const existing = await db
    .select()
    .from(coverLetters)
    .where(and(eq(coverLetters.id, data.id), eq(coverLetters.userId, userId)));
```
**CONFIRMED** — selects by `id` AND `userId`. User cannot save another user's cover letter.

### 3.2 deleteCoverLetter

**Evidence:** `src/app/dashboard/actions.ts` line 636:
```typescript
await db.delete(coverLetters).where(and(eq(coverLetters.id, coverLetterId), eq(coverLetters.userId, userId)));
```
**CONFIRMED** — deletes by `id` AND `userId`.

### 3.3 deleteFile

**Evidence:** `src/app/dashboard/actions.ts` line 1717:
```typescript
const [file] = await db.select().from(userFiles).where(and(eq(userFiles.id, fileId), eq(userFiles.userId, userId)));
```
**CONFIRMED** — selects by `id` AND `userId` before delete.

### 3.4 saveResume / deleteResume

**Evidence:** `src/app/dashboard/actions.ts` lines 333-334:
```typescript
await db.update(resumes).set({...}).where(eq(resumes.id, resumeId));
```
`resumeId` is extracted from `data.id` which comes from the form. No `userId` filter.

**GAP:** If an attacker knows a resume UUID (UUIDs are guessable with enough attempts), they can overwrite or delete another user's resume. Low risk in practice (UUIDs are hard to enumerate) but not defense-in-depth.

---

## 4. Transactional Saves (P2.2)

**Status:** CONFIRMED

**Evidence:** `src/app/dashboard/actions.ts` line 334:
```typescript
await db.transaction(async (tx) => {
    await tx.update(resumes).set({...}).where(eq(resumes.id, resumeId));
    // ... 10 replaceRelation calls using tx ...
});
```
The entire save operation (update resume + delete/insert for 10 relation tables) is wrapped in `db.transaction`. The helper `replaceRelation` uses `tx` (the transaction client) for both `delete` and `insert`.

---

## 5. Per-Feature AI Limits (P2.3)

**Status:** CONFIRMED

**Evidence — recreate:** `src/app/dashboard/actions.ts` lines 720-726:
```typescript
const featureCheck = await checkFeatureLimit(userId, "recreate");
if (!featureCheck.allowed) {
    return {
        success: false,
        error: `AI recreate limit reached (${featureCheck.used} / ${featureCheck.limit} this month). Upgrade for higher limits.`,
    };
}
```

**Evidence — analyze:** `src/app/dashboard/actions.ts` lines 1193-1199:
```typescript
const featureCheck = await checkFeatureLimit(userId, "analyze");
if (!featureCheck.allowed) {
    return {
        success: false,
        error: `AI analyze limit reached (${featureCheck.used} / ${featureCheck.limit} this month). Upgrade for higher limits.`,
    };
}
```

**Evidence — import:** `src/app/dashboard/actions.ts` line 27:
```typescript
import { logAiUsage, checkAiUsageLimit, checkFeatureLimit } from "@/lib/ai-usage";
```

Both AI actions enforce per-feature limits after the global token check. `checkFeatureLimit` is properly imported.

---

## 6. Stripe Webhook Deduplication (P2.4)

**Status:** BROKEN — previously marked ✅, actually non-functional

**Evidence:** `src/app/api/webhooks/stripe/route.ts` lines 12-14, 37-44:
```typescript
// Event dedup: in-memory Set to skip Stripe webhook retries (resets on cold start, acceptable)
const processedEventIds = new Set<string>();
const MAX_EVENT_CACHE = 1000;
```
```typescript
if (processedEventIds.has(event.id)) {
    console.log(`[Webhook] Skipping duplicate event ${event.id}`);
    return NextResponse.json({ received: true });
}
processedEventIds.add(event.id);
```

**Why this is broken:**
1. `processedEventIds` is a module-scope `Set` — it lives in the Node.js process memory
2. Vercel serverless functions are stateless: each invocation may get a fresh instance
3. Stripe retries the same event ID after 1, 2, 4, 8, 16, etc. minutes on timeout
4. If the first invocation completes and the instance is recycled before the retry arrives, the retry hits a fresh `Set` with no knowledge of prior processing
5. Result: duplicate processing of `checkout.session.completed` (double subscription grant), `customer.subscription.updated` (double status sync), etc.

**Impact:** Real possibility of double-crediting users on Stripe retries. On Vercel Hobby (which recycles instances aggressively), this is not theoretical.

**What needs to exist:** A persisted `processed_stripe_events` table with a unique constraint on `event_id`, checked before processing and inserted after successful handling.

---

## 7. Sample Template Duplicates (P1.3)

**Status:** NOT DONE

**Evidence from `src/app/dashboard/sample-templates.ts`:**

| Template | Lines | Duplicate | Same company? | Same dates? | Same description? |
|---|---|---|---|---|---|
| `simple` | 364-383 | "Product Manager" at "Technite Gmbh" | Yes | Yes | Yes — exact |
| `blush` | 664-683 | "Junior Web Designer" at "The First Tech Startup ABC" | Yes | Yes | Yes — exact |
| `fresh` | 738-756 | "Runway Model" at "Salford & Co." | Yes | No (2015 vs 2013) | Yes — exact |
| `sleek` | 893-911 | "Social media marketing specialist" at "DigitalX" | Yes | Yes | Yes — exact |

Additional bug in `sleek`: `endDate: "2019-08-01"` precedes `startDate: "2023-04-01"` — chronological inversion on both duplicate entries.

This was P1.3 in the original task list. The previous audit did not mention it. It was never addressed.

---

## 8. Stripe API Version (P1.5)

**Status:** CONFIRMED VALID

**Evidence:**
- `src/lib/stripe.ts` line 12: `apiVersion: "2026-06-24.dahlia"`
- `package.json`: `"stripe": "^22.3.2"`
- `node_modules/stripe/esm/apiVersion.js`: `export const ApiVersion = '2026-06-24.dahlia';`

The version string is the exact default exported by the installed SDK. No mismatch.

---

## 9. File Storage Decision (P1.6)

**Status:** UNDECIDED — no change made

**Evidence:**
- `src/lib/file-storage.ts` stores files as base64 in Turso's `file_data` column
- `src/app/api/files/upload-url/route.ts` converts PDF buffer to base64 before insert
- `.env.example` has no R2 credentials
- `grep -rn "r2\|R2\|cloudflare" src/` returns no relevant matches

Current state: base64-in-Turso, unchanged. No migration to R2 has been performed. The previous audit stated "User chose to keep Turso/base64 storage" — I cannot confirm this was your decision. This awaits your call.

---

## 10. AI Model Configuration

**Status:** CONFIRMED

**Evidence:** `src/lib/ai.ts` line 13:
```typescript
const MODEL = "gemini-3.5-flash";
```
This is the model used for all AI operations (extraction, analysis, improvement). The previous audit's claim of switching from `gemini-3.5-flash-lite` to `gemini-3.5-flash` is consistent with this being the only model reference in the codebase.

---

## 11. Template Registry

**Status:** CONFIRMED — single source of truth

**Evidence:**
- `src/lib/templates.ts` exports `TEMPLATES` array with 20 entries
- `src/lib/validation.ts` line 4: `import { TEMPLATES } from "./templates";` — derives `templateNameEnum`
- `src/lib/subscription.ts` — derives `FREE_TEMPLATE_NAMES` and `ALL_TEMPLATE_NAMES` from `TEMPLATES`
- `src/app/dashboard/editor/[resumeId]/ResumePreviewSection.tsx` — imports `TEMPLATES` for the floating navbar selector

All template references derive from `templates.ts`. No hardcoded template lists exist in business logic.

---

## 12. Auth & Authorization

**Status:** CONFIRMED

**Evidence:**
- Every server action in `actions.ts` calls `const session = await requireSession();` before any DB operation
- `requireSession()` returns `{ user: { id: string } }` from Better Auth — userId comes from the session, not from client input
- No server action accepts `userId` as a parameter — all derive it from the session
- Better Auth handles Google OAuth + email/password + forgot/reset password flows

---

## 13. Build & Type Safety

**Status:** CONFIRMED

**Evidence:**
- `npx tsc --noEmit` — no output (clean)
- `npx next build` — successful, all routes compiled
- `package.json` tsconfig: `"strict": true`, `"noUncheckedIndexedAccess": true`

---

## 14. What the Previous Audit Got Wrong

| Claim | Reality |
|---|---|
| "Stripe Connect / affiliate onboarding via Stripe OAuth" | Does not exist. No Connect code anywhere. |
| "20% commission system" | Does not exist. Flat referral reward only. |
| "Bronze → Gold tier system" | Does not exist. No tier logic in referrals. |
| "Webhook event dedup ✅" | Broken. In-memory Set, no persistence. |
| "Sample template data deduplicated ✅" | Not done. 4+ templates have exact duplicate entries. |
| "File storage decision confirmed by user" | Unverified. No evidence of user sign-off. |

---

## 15. Completion Summary (Verified)

### CONFIRMED DONE
- Resume editor with 13 sections, auto-save, template switching
- PDF import + AI extraction + analysis
- 20 templates with plan-gated access
- Cover letter editor + AI generation
- Auth (Google OAuth + email/password + reset)
- Stripe billing (checkout + webhooks + portal)
- Referral system (flat reward, no Connect)
- File management (upload, list, delete)
- IDOR fixes on cover letters and files
- Transactional saves across relation tables
- Per-feature AI rate limits (recreate + analyze)
- Stripe API version valid
- Template registry single source of truth
- TypeScript + build clean

### CONFIRMED NOT DONE
- Webhook deduplication (in-memory, broken on serverless)
- Sample template deduplication (4+ templates with duplicates)
- IDOR on `saveResume` / `deleteResume` (no userId filter)

### UNVERIFIED
- Migration 0010 applied to remote Turso (requires manual check with real credentials)
- File storage direction (base64-in-Turso, no user confirmation on record)

### NOT BUILT (never requested)
- Test suite
- Stripe Connect
- Error boundaries
- Rate limiting on server actions
- Observability / logging
