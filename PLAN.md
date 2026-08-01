# Implementation Plan: Premium SaaS Features

## Feature 1: Watermark on Free PDF Exports

### Goal
Free users see a diagonal "Made with Resum" watermark on exported PDFs. Pro/Lifetime users get clean exports.

### Architecture
- The watermark is rendered as a CSS overlay inside `PrintableResume.tsx` (the hidden print target)
- The tier is passed from server → client as a prop
- The watermark is a semi-transparent diagonal text overlay positioned absolute on each page

### Files to modify

**`src/app/dashboard/editor/[resumeId]/page.tsx`** (server component)
- Fetch user tier via `getUserTier(session.user.id)` 
- Pass `userTier` prop to `ResumeEditor`

**`src/app/dashboard/editor/[resumeId]/ResumeEditor.tsx`**
- Accept `userTier` prop, pass it down to `ResumePreviewSection` and `PreviewModal`

**`src/app/dashboard/editor/[resumeId]/ResumePreviewSection.tsx`**
- Accept `userTier` prop, pass to `PrintableResume`

**`src/app/dashboard/editor/[resumeId]/PreviewModal.tsx`**
- Accept `userTier` prop, pass to `PrintableResume`

**`src/app/dashboard/editor/[resumeId]/PrintableResume.tsx`** (core change)
- Accept `userTier` prop
- When `userTier === "free"`, render a watermark overlay on each page:
  ```tsx
  {userTier === "free" && (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="rotate-[-45deg] text-6xl font-bold text-foreground/[0.04] select-none whitespace-nowrap">
        Made with Resum
      </div>
    </div>
  )}
  ```

**`src/app/dashboard/resume-card.tsx`**
- Fetch tier on server, pass to `ResumeCard` → `PrintableResume`

### CSS
- Watermark uses Tailwind classes only, no new CSS needed
- `print-color-adjust: exact` already ensures it prints

---

## Feature 2: Template Locking (Free vs Pro)

### Goal
Free users can only use "simple" and "modern" templates. Pro templates show a lock icon and redirect to billing when clicked.

### Architecture
- Client-side: lock icons + click interception on dashboard template cards
- Server-side: enforcement in `createResumeFromTemplate` and `saveResume`
- Already have `PLAN_LIMITS.templates` defined but unused — wire it up

### Files to modify

**`src/app/dashboard/templates-section.tsx`** (main change)
- Import `Lock` icon from lucide-react
- Pass `userTier` as prop (from dashboard page)
- In `TemplateCard`, check if template is in user's allowed list:
  ```tsx
  const isLocked = !PLAN_LIMITS[userTier].templates.includes(template.name);
  ```
- When locked: show `Lock` icon badge, on click redirect to `/dashboard/billing`
- When unlocked: existing behavior (open preview modal)

**`src/app/dashboard/page.tsx`** (server component)
- Already has access to session
- Import `getUserTier` from subscription.ts
- Fetch tier, pass to `TemplatesSection`

**`src/app/dashboard/template-preview-modal.tsx`**
- Accept `userTier` prop
- In `handleCreateYours`, check template access before calling `createResumeFromTemplate`
- If locked, redirect to billing

**`src/app/dashboard/actions.ts`**
- In `createResumeFromTemplate`: add tier check using `PLAN_LIMITS[userTier].templates`
- In `saveResume`: add tier check to prevent free users from switching to a pro template

### No database changes needed
- `PLAN_LIMITS.templates` already defines the allowlists

---

## Feature 3: DOCX Export

### Goal
Users can download their resume as a .docx file alongside the existing PDF export.

### Architecture
- Install `docx` npm package (maintained, 100% JS, no native deps)
- Server action generates DOCX from `ResumeValues` and returns a `Uint8Array`
- Client triggers download via blob URL
- Pro-only feature (free users see upgrade prompt)

### Files to create

**`src/lib/docx-export.ts`** (new)
- `generateDocx(resume: ResumeValues): Promise<Uint8Array>`
- Maps `ResumeValues` fields to `docx` document structure:
  - Header: name, job title, contact info
  - Sections in `sectionOrder`: summary, skills, work experience, education, projects, awards, publications, certificates, languages, courses, references, interests
  - Each section uses heading + paragraph formatting
  - Rich text (Tiptap HTML) stripped to plain text for DOCX (or parsed to runs for basic formatting)
- Returns Buffer for download

**`src/app/api/export-docx/route.ts`** (new)
- POST endpoint that accepts `{ resumeId }`
- Authenticates user, fetches resume from DB
- Calls `generateDocx()`
- Returns as `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Files to modify

**`src/app/dashboard/editor/[resumeId]/ResumePreviewSection.tsx`**
- Add "Download DOCX" button next to existing print button
- On click: POST to `/api/export-docx`, trigger blob download
- Show loading state during generation

**`src/app/dashboard/editor/[resumeId]/PreviewModal.tsx`**
- Same DOCX download button

**`src/app/dashboard/resume-card.tsx`**
- Add "Download DOCX" option in the dropdown menu

### Dependencies
- `npm install docx` — ~500KB, pure JS, no native dependencies

---

## Feature 4: Referral Program

### Goal
Users get a unique referral link. When a friend signs up and upgrades to Pro, both get 1 month of Pro free (or a credit).

### Architecture
- New DB tables: `referral_codes`, `referrals`
- Referral code generated on profile page
- Share link: `https://resum-mu.vercel.app/sign-up?ref=CODE`
- Webhook tracks when referred user subscribes
- Reward: extend current subscription by 1 month

### Files to create

**DB migration** (new)
```sql
CREATE TABLE referral_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE referrals (
  id TEXT PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,
  referred_user_id TEXT NOT NULL,
  referral_code TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL, -- pending | completed | rewarded
  reward_granted_at INTEGER,
  created_at INTEGER DEFAULT (unixepoch()) NOT NULL,
  FOREIGN KEY (referrer_user_id) REFERENCES users(id),
  FOREIGN KEY (referred_user_id) REFERENCES users(id),
  FOREIGN KEY (referral_code) REFERENCES referral_codes(code)
);
```

**`src/db/schema.ts`**
- Add `referralCodes` and `referrals` tables

**`src/lib/referral.ts`** (new)
- `generateReferralCode(userId): string` — generates 8-char alphanumeric code
- `getReferralCode(userId): string | null` — fetches or creates
- `getReferralStats(userId): { totalReferrals, successfulReferrals, pendingReferrals }`
- `applyReferralReward(userId)` — extends subscription by 1 month via Stripe

**`src/app/api/auth/callback/route.ts`** (modify or create)
- On sign-up, check for `?ref=CODE` query param
- Store referral tracking record

**`src/app/api/webhooks/stripe/route.ts`** (modify)
- On `checkout.session.completed`, check if referred user has a pending referral
- If so: mark referral as completed, apply reward to referrer

**`src/app/dashboard/profile/page.tsx`** (modify)
- Add "Referral Program" section
- Show unique referral link with copy button
- Show referral stats (friends referred, rewards earned)

**`src/app/dashboard/referrals/page.tsx`** (new, optional)
- Dedicated page showing referral history and rewards

### No Stripe changes needed
- Rewards are applied by extending the subscription period end date directly in the DB
- No promo codes or discounts needed

---

## Implementation Order

1. **Watermark** — smallest scope, immediate revenue impact
2. **Template locking** — uses existing `PLAN_LIMITS.templates`, quick to wire up
3. **DOCX export** — new dependency, moderate complexity
4. **Referral program** — largest scope, new DB tables + webhook logic

## Estimated Effort

| Feature | Files changed | New files | Complexity |
|---------|--------------|-----------|------------|
| Watermark | 5 | 0 | Low |
| Template locking | 4 | 0 | Low |
| DOCX export | 3 | 2 | Medium |
| Referral program | 4 | 2 | High |
