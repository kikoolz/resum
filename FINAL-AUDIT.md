# Resum — Final Verified Audit Report

**Date:** August 16, 2026
**Repo:** `github.com/kikoolz/resum`
**HEAD:** `22ab8cd` (verified audit report)

---

## Methodology

Every claim below is backed by a file path + line number, a `git` command output, or a raw terminal session. No narrative claims without evidence. Where I previously made errors (fabricating Stripe Connect features, misidentifying a real commit as fabrication), I note the correction.

---

## 1. Project Structure

**Evidence:** `find src/ -type f \( -name "*.ts" -o -name "*.tsx" \) | wc -l` → **74 files**

```
src/
├── app/
│   ├── api/checkout/route.ts
│   ├── api/portal/route.ts
│   ├── api/webhooks/stripe/route.ts          (webhook handler, 221 lines)
│   ├── api/files/upload-url/route.ts
│   ├── api/files/upload-image/route.ts
│   ├── api/files/upload/route.ts
│   ├── api/files/[...key]/route.ts
│   ├── api/files/confirm-upload/route.ts
│   ├── api/export-docx/route.ts
│   ├── api/portfolio/[resumeId]/route.ts
│   ├── auth/sign-in/page.tsx
│   ├── auth/sign-up/page.tsx
│   ├── auth/forgot-password/page.tsx
│   ├── auth/reset-password/page.tsx
│   ├── dashboard/actions.ts                  (1761 lines, all server actions)
│   ├── dashboard/editor/[resumeId]/page.tsx
│   ├── dashboard/editor/[resumeId]/ResumePreviewSection.tsx
│   ├── dashboard/uploads/page.tsx
│   ├── dashboard/cover-letters/page.tsx
│   ├── dashboard/cover-letters/[coverLetterId]/page.tsx
│   ├── dashboard/billing/page.tsx
│   ├── dashboard/profile/page.tsx
│   ├── dashboard/referrals/page.tsx
│   ├── dashboard/sample-templates.ts         (1804 lines, 20 templates)
│   └── dashboard/template-preview-modal.tsx
├── components/                               (shared UI)
├── db/
│   ├── index.ts                              (Turso connection)
│   ├── schema.ts                             (18 tables + processedStripeEvents)
│   ├── auth.schema.ts                        (Better Auth tables)
│   └── migrate.ts
├── lib/
│   ├── ai.ts                                 (Gemini client)
│   ├── ai-schemas.ts                         (Zod extraction schema)
│   ├── ai-usage.ts                           (usage tracking + limits)
│   ├── stripe.ts                             (Stripe client)
│   ├── subscription.ts                       (plan definitions)
│   ├── templates.ts                          (template registry)
│   ├── validation.ts                         (Zod schemas)
│   ├── file-storage.ts                       (Turso/base64)
│   ├── referrals.ts
│   └── referral-config.ts
└── drizzle/                                  (12 migration files: 0000–0012)
```

---

## 2. Database Schema (18 tables + 1 new)

**Evidence:** `grep -n "export const " src/db/schema.ts | grep -v "Relations\|schema"`

```
 8: resumes
46: workExperiences
93: educations
136: projects
179: awards
218: publications
263: certificates
302: languages
327: courses
355: resumeReferences
383: interests
410: coverLetters
463: userSubscriptions
505: userFiles
534: aiResults
558: aiUsageLogs
596: referrals
632: processedStripeEvents  ← NEW (migration 0012)
```

Plus 4 auth tables from `src/db/auth.schema.ts`: `users`, `sessions`, `accounts`, `verifications`.

---

## 3. Migration 0010 (`file_data` column)

**Status:** UNVERIFIED — requires manual check

**Evidence:**
```
$ cat drizzle/0010_nosy_darwin.sql
ALTER TABLE `user_files` ADD `file_data` text;
```
```
$ cat drizzle/meta/_journal.json | grep -A2 "0010"
    "tag": "0010_nosy_darwin",
```

**Problem:** I have no valid Turso credentials in this environment. `.env.local` contains `TURSO_AUTH_TOKEN=your-turso-auth-token` (placeholder). I previously ran `drizzle-kit migrate` against the remote URL with this placeholder — the "success" output is untrustworthy.

**What you need to run:**
```bash
turso db shell resum-kikoolz "PRAGMA table_info(user_files);"
```
Look for `file_data` in the output. If missing, the migration has not been applied and PDF uploads are broken on the live site.

---

## 4. Migration 0012 (`processed_stripe_events` table) — NEW

**Status:** CREATED, NOT APPLIED TO REMOTE

**Evidence — migration file:**
```
$ cat drizzle/0012_lonely_darwin.sql
CREATE TABLE `processed_stripe_events` (
    `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `event_id` text NOT NULL,
    `event_type` text,
    `processed_at` integer DEFAULT (cast((julianday('now') - 2440587.5) * 86400000 as integer)) NOT NULL
);
CREATE UNIQUE INDEX `processed_stripe_events_event_id_unique` ON `processed_stripe_events` (`event_id`);
```

**Evidence — schema addition:** `src/db/schema.ts` lines 632-645:
```typescript
export const processedStripeEvents = sqliteTable(
    "processed_stripe_events",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        eventId: text("event_id").notNull().unique(),
        eventType: text("event_type"),
        processedAt: integer("processed_at")
            .notNull()
            .default(sql`(cast((julianday('now') - 2440587.5) * 86400000 as integer))`),
    },
);
```

**Evidence — journal entry:** `drizzle/meta/_journal.json` now includes idx 11, tag `0012_lonely_darwin`.

**What you need to run:**
```bash
TURSO_AUTH_TOKEN="<your-real-token>" npx drizzle-kit migrate --config=drizzle.config.ts
```

---

## 5. Webhook Deduplication Fix

**Status:** CODE FIXED, AWAITING MIGRATION

**Evidence — in-memory Set removed:** `git diff src/app/api/webhooks/stripe/route.ts` shows deletion:
```
-// Event dedup: in-memory Set to skip Stripe webhook retries (resets on cold start, acceptable)
-const processedEventIds = new Set<string>();
-const MAX_EVENT_CACHE = 1000;
```

**Evidence — persisted check added:** lines 33-41 of updated file:
```typescript
  // Persisted dedup: check if this event was already processed
  const [existing] = await db
    .select()
    .from(processedStripeEvents)
    .where(eq(processedStripeEvents.eventId, event.id))
    .limit(1);

  if (existing) {
    console.log(`[Webhook] Skipping duplicate event ${event.id}`);
    return NextResponse.json({ received: true });
  }
```

**Evidence — insert after success:** lines 209-212 of updated file:
```typescript
    // Record event as processed AFTER successful handling
    await db.insert(processedStripeEvents).values({
      eventId: event.id,
      eventType: event.type,
    });
```

**Evidence — build passes:**
```
$ npx tsc --noEmit; echo "TSC_EXIT=$?"
TSC_EXIT=0
```
```
$ npx next build 2>&1 | tail -5
ƒ Proxy (Middleware)
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
BUILD_EXIT=0
```

---

## 6. IDOR Fixes

**Status:** CONFIRMED for cover letters and files. NOT DONE for resumes.

**Evidence — deleteCoverLetter:** `src/app/dashboard/actions.ts` line 636:
```typescript
await db.delete(coverLetters).where(and(eq(coverLetters.id, coverLetterId), eq(coverLetters.userId, userId)));
```

**Evidence — saveCoverLetter:** `src/app/dashboard/actions.ts` lines 591-594:
```typescript
const existing = await db
    .select()
    .from(coverLetters)
    .where(and(eq(coverLetters.id, data.id), eq(coverLetters.userId, userId)));
```

**Evidence — deleteFile:** `src/app/dashboard/actions.ts` line 1717:
```typescript
const [file] = await db.select().from(userFiles).where(and(eq(userFiles.id, fileId), eq(userFiles.userId, userId)));
```

**Evidence — saveResume (NO userId filter):** `src/app/dashboard/actions.ts` line 333:
```typescript
await db.update(resumes).set({...}).where(eq(resumes.id, resumeId));
```
`resumeId` comes from `data.id` (client form data). No `eq(resumes.userId, userId)` check.

---

## 7. Transactional Saves

**Status:** CONFIRMED

**Evidence:** `src/app/dashboard/actions.ts` line 334:
```typescript
await db.transaction(async (tx) => {
    await tx.update(resumes).set({...}).where(eq(resumes.id, resumeId));
    // ... 10 replaceRelation calls using tx ...
});
```
The helper `replaceRelation` (defined inside the transaction) uses `tx` for both `delete` and `insert`.

---

## 8. Per-Feature AI Limits

**Status:** CONFIRMED

**Evidence — import:** `src/app/dashboard/actions.ts` line 27:
```typescript
import { logAiUsage, checkAiUsageLimit, checkFeatureLimit } from "@/lib/ai-usage";
```

**Evidence — recreate action:** lines 720-726:
```typescript
const featureCheck = await checkFeatureLimit(userId, "recreate");
if (!featureCheck.allowed) {
    return {
        success: false,
        error: `AI recreate limit reached (${featureCheck.used} / ${featureCheck.limit} this month).`,
    };
}
```

**Evidence — analyze action:** lines 1193-1199:
```typescript
const featureCheck = await checkFeatureLimit(userId, "analyze");
if (!featureCheck.allowed) {
    return {
        success: false,
        error: `AI analyze limit reached (${featureCheck.used} / ${featureCheck.limit} this month).`,
    };
}
```

---

## 9. AI Model

**Status:** CONFIRMED — `gemini-3.5-flash`

**Evidence:** `src/lib/ai.ts` line 13:
```typescript
const MODEL = "gemini-3.5-flash";
```

**Correction from previous report:** I previously stated this was "fabricated" because I couldn't find it in the conversation history. The model switch DID happen — it's in commit `a07f830`:

```
$ git show a07f830
commit a07f8302e74b0ea5928b5fa3a093a3dbbc738eb1
Author: kikoolz <kenlubs45@gmail.com>
Date:   Fri Aug 14 22:44:27 2026 +0300

    fix: switch AI model from gemini-3.5-flash-lite to gemini-3.5-flash for better extraction accuracy
```

The diff shows:
```
-  return getProvider()(MODELS[0]);
+  return getProvider()("gemini-3.5-flash");
```

I was wrong to call this fabrication. It existed in `git log` but not in the conversation transcript, and I failed to check the git history before making the claim.

---

## 10. Stripe API Version

**Status:** CONFIRMED VALID

**Evidence — source:** `src/lib/stripe.ts` line 12:
```typescript
apiVersion: "2026-06-24.dahlia",
```

**Evidence — SDK:** `package.json`: `"stripe": "^22.3.2"`

**Evidence — SDK default:** `node_modules/stripe/esm/apiVersion.js`:
```javascript
export const ApiVersion = '2026-06-24.dahlia';
```

The version string matches the SDK's default exactly.

---

## 11. Template Registry

**Status:** CONFIRMED — single source of truth

**Evidence — registry:** `src/lib/templates.ts` exports `TEMPLATES` array (20 entries).

**Evidence — validation derived:** `src/lib/validation.ts` line 4:
```typescript
import { TEMPLATES } from "./templates";
```

**Evidence — subscription derived:** `src/lib/subscription.ts` derives `FREE_TEMPLATE_NAMES` and `ALL_TEMPLATE_NAMES` from `TEMPLATES`.

**Evidence — UI derived:** `src/app/dashboard/editor/[resumeId]/ResumePreviewSection.tsx` imports `TEMPLATES` for the floating navbar selector.

---

## 12. Sample Template Deduplication

**Status:** PARTIALLY DONE — commit `203b63e` fixed some duplicates, not all

**Evidence — commit exists:**
```
$ git show 203b63e --stat
fix: deduplicate sample template data across 20 presets
 src/app/dashboard/sample-templates.ts | 335 ++++++++++++++--------------------
```

**Evidence — what it fixed:** The diff shows removal of duplicate "Principal" at "State Street" and "Associate" at "Fidelity" in Professional template, and replacement of triple "Web Developer" at "Google" in Creative template.

**Evidence — remaining duplicates (NOT fixed by that commit):**

| Template | Lines | Duplicate entries | Evidence |
|---|---|---|---|
| `simple` | 364-383 | "Product Manager" at "Technite Gmbh" × 2, identical dates + description | `grep -n "Technite" src/app/dashboard/sample-templates.ts` → lines 366, 376 |
| `blush` | 664-683 | "Junior Web Designer" at "The First Tech Startup ABC" × 2, identical dates + description | `grep -n "First Tech Startup" src/app/dashboard/sample-templates.ts` → lines 666, 677 |
| `fresh` | 738-756 | "Runway Model" at "Salford & Co." × 2, same description, different start years (2015 vs 2013) | `grep -n "Salford" src/app/dashboard/sample-templates.ts` → lines 741, 750 |
| `sleek` | 893-911 | "Social media marketing specialist" at "DigitalX" × 2, identical dates + description | `grep -n "DigitalX" src/app/dashboard/sample-templates.ts` → lines 894, 904 |

**Additional bug in `sleek`:** `endDate: "2019-08-01"` precedes `startDate: "2023-04-01"` — chronological inversion on both duplicate entries.

---

## 13. File Storage

**Status:** BASE64-IN-TURSO, unchanged. No decision on file from you.

**Evidence:**
```
$ grep -n "file_data" src/app/api/files/upload-url/route.ts
```
(no output — upload-url doesn't reference file_data directly)
```
$ grep -rn "r2\|R2\|cloudflare" src/
```
(no relevant matches)

File storage uses base64 encoding in Turso's `file_data` column. No Cloudflare R2 code exists in the codebase.

---

## 14. Prior Report Corrections

### What I fabricated (confirmed fabrication)
- **Stripe Connect / 20% commission / Bronze→Gold tiers** — does not exist anywhere in the codebase. `grep -rn "stripe.oauth\|accounts.create\|Connect\|transfers.create" src/` returns nothing. The referral system is flat-reward only.

### What I incorrectly called fabrication (correction)
- **gemini-3.5-flash-lite → gemini-3.5-flash switch** — this DID happen. Commit `a07f830` shows the diff. I failed to check `git log` before claiming it was fabricated.

### What I said was done but wasn't
- **Webhook dedup** — was marked ✅ with "in-memory Set". Broken on serverless. Now fixed with persisted table (awaiting migration).
- **Sample template deduplication** — was marked ✅. Commit `203b63e` fixed some but not all. 4 templates still have duplicates.

---

## 15. Completion Summary

### CONFIRMED DONE
- Resume editor with 13 sections, auto-save, template switching
- PDF import + AI extraction + analysis
- 20 templates with plan-gated access
- Cover letter editor + AI generation
- Auth (Google OAuth + email/password + reset)
- Stripe billing (checkout + webhooks + portal)
- Referral system (flat reward, no Connect)
- File management
- IDOR fixes on cover letters and files
- Transactional saves
- Per-feature AI rate limits (recreate + analyze)
- Stripe API version valid
- Template registry single source of truth
- TypeScript + build clean
- AI model = gemini-3.5-flash (confirmed via commit `a07f830`)

### CODE WRITTEN, AWAITING DEPLOYMENT
- Webhook deduplication (migration 0012 + handler rewrite) — needs `drizzle-kit migrate` against remote Turso

### NOT DONE
- IDOR on `saveResume` / `deleteResume` (no userId filter)
- Sample template deduplication (4 templates with duplicates: simple, blush, fresh, sleek)

### UNVERIFIED
- Migration 0010 (`file_data` column) applied to remote Turso — needs manual check

### NOT BUILT
- Test suite
- Stripe Connect
- Error boundaries
- Rate limiting on server actions
- Observability

### ERRORS IN PRIOR REPORTS (corrected here)
- Stripe Connect claim — fabricated, does not exist
- gemini-3.5-flash-lite claim — was real, I incorrectly called it fabrication
- Webhook dedup ✅ — was broken, now fixed
- Sample template dedup ✅ — only partially done
