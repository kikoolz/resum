*This is a submission for the [GitHub Copilot CLI Challenge](https://dev.to/challenges/github-2026-01-21)*

## What I Built

I built **AI Resume** — a full-stack, AI-powered resume builder that takes you from zero to a polished, ATS-friendly PDF resume in under 2 minutes. This isn't just another form-to-PDF tool. It's a complete resume intelligence platform with three distinct AI capabilities:

1. **AI Resume Recreator** — Upload any existing PDF resume, and Gemini AI extracts every data point into a fully structured, editable resume across 13 sections. No retyping. No copy-paste. Your old resume is instantly alive in a modern editor.

2. **AI Resume Analyzer** — Get a detailed, multi-perspective score on your resume. The AI evaluates it from three lenses — Recruiter, Hiring Manager, and ATS Parser — delivering section-by-section breakdowns, strengths, weaknesses, and actionable improvement suggestions with a visual score ring.

3. **AI Content Enhancer** — Stuck on bullet points? Hit the inline AI button on any description field and Gemini rewrites your content with stronger action verbs, quantified achievements, and industry-relevant keywords. Each section type (experience, education, projects, awards, etc.) gets its own specialized prompt for maximum relevance. Undo with a single click if you don't like it.

**The editor itself is a beast:**
- Split-panel layout: forms on the left, pixel-perfect live A4 preview on the right
- Drag-and-drop section reordering via Framer Motion
- 13 fully customizable resume sections (9 core + 4 optional)
- 4 distinct resume layout templates (Professional, Creative, Modern, Simple)
- Circular photo crop & upload with R2 storage
- Auto-save with 2.5s debounce — never lose your work
- Multi-page overflow detection and pagination
- One-click PDF export with print-perfect A4 formatting
- Customizable colors, fonts, and field visibility toggles
- Neobrutalist landing page with dark/light mode

**Tech stack:** Next.js 16 (App Router, RSC, Server Actions) + Cloudflare Workers (D1 database, R2 object storage, KV sessions) + Better Auth (Google OAuth) + Drizzle ORM + Vercel AI SDK 6 + Cloudflare AI Gateway + Google Gemini Flash + Tailwind CSS 4 + shadcn/ui + Framer Motion + Zod v4 validation.

**The entire application — 21,700+ lines of TypeScript across 132 files, 18 database tables, 3 AI features, 4 resume templates, presigned URL file uploads, and a full landing page — was built from scratch in under 1.5 days using GitHub Copilot.**

This project means a lot to me because job seekers deserve better tools. Most resume builders are either too basic (no AI, limited sections) or overpriced with paywalls on every feature. AI Resume is free, fast, and genuinely intelligent — it doesn't just format your resume, it understands it.

## Demo

**GitHub Repository:** https://github.com/ishaangupta-YB/ai-resume

### Screenshots

<!-- Add your screenshots/video here -->

**Landing Page (Neobrutalist design, dark/light mode)**
![Landing Page](screenshots/landing.png)

**Dashboard (Resume cards with template previews)**
![Dashboard](screenshots/dashboard.png)

**Resume Editor (Split-panel: form editing + live A4 preview)**
![Editor](screenshots/editor.png)

**4 Resume Templates (Professional, Creative, Modern, Simple)**
![Templates](screenshots/templates.png)

**AI Resume Recreator (PDF upload → fully editable resume)**
![AI Recreate](screenshots/ai-recreate.png)

**AI Resume Analyzer (Score ring, section-by-section breakdown)**
![AI Analysis](screenshots/ai-analysis.png)

**AI Content Enhancer (Inline enhancement with undo)**
![AI Enhance](screenshots/ai-enhance.png)

**Circular Photo Crop & Upload**
![Photo Crop](screenshots/photo-crop.png)

## My Experience with GitHub Copilot CLI

GitHub Copilot wasn't just an assistant on this project — it was my co-pilot (pun intended) in building a production-grade, full-stack application in a timeframe that would normally take a week or more. Here's the real timeline from my git history:

**Day 1 (Feb 13, evening):**
- 6:09 PM — Scaffolded the project with `create-cloudflare` CLI
- 6:15 PM — First commit (project structure)
- 6:25 PM — Theme system (dark/light mode) with `next-themes`
- 7:44 PM — Full Google OAuth authentication with Better Auth
- 9:11 PM — Landing page with neobrutalist design + animations
- 10:52 PM — Basic resume editor coded (split-panel, form sections, live preview)
- 11:43 PM — R2 file storage integration + presigned URL upload flow

**Day 2 (Feb 14, overnight + afternoon):**
- 2:49 AM — Resume editor nearly complete (13 sections, drag-and-drop, 4 layouts)
- 2:59 AM — Cloudflare Workers deployment fixed
- 3:50 AM — Print/export to PDF, UI polish
- 4:33 AM — Circular photo crop + upload feature
- 3:15 PM — All 3 AI features (recreate, analyze, enhance) implemented

**That's a full-stack app with AI, auth, file storage, 18 DB tables, and 4 resume templates — from `npm init` to deployed — in roughly 33 hours.**

### How Copilot Supercharged Development

**1. Architecture & Scaffolding at Lightning Speed**
Copilot helped me rapidly scaffold the entire Cloudflare Workers + Next.js 16 + D1 architecture. Setting up Drizzle ORM schemas with 18 interlinked tables (cascading deletes, JSON columns, proper foreign keys) — Copilot suggested the table structures and relations as I described what I needed. What would've been hours of boilerplate was done in minutes.

**2. Complex UI Components Without the Grind**
The resume editor's split-panel layout with `react-resizable-panels`, the Framer Motion drag-and-drop section reordering, the circular photo cropper with `ReactCrop` + canvas processing, the A4 preview with zoom controls — Copilot generated the bulk of these complex, interconnected UI patterns. I described the behavior I wanted, and Copilot delivered working implementations that I refined.

**3. AI Integration Done Right**
Integrating the Vercel AI SDK 6 with `ai-gateway-provider` through Cloudflare AI Gateway to Google Gemini — this is a 4-layer provider chain that's not well-documented. Copilot helped me wire up `createUnified()` with the right configuration, structure the Zod schemas for AI extraction (13 resume sections with nested arrays), and handle edge cases like `NoObjectGeneratedError` for malformed PDFs. The 8 section-specific AI enhancement prompts were iterated on rapidly with Copilot's suggestions.

**4. Presigned URL Upload Flow**
The R2 presigned URL pattern (generate URL → client PUT → server HEAD verify → DB record) using `aws4fetch` is non-trivial. Copilot understood the pattern and helped implement the 3-step upload flow with proper auth validation, MIME checking, and size limits without me having to reference the aws4fetch docs repeatedly.

**5. Print-Perfect PDF Export**
Getting `react-to-print` to produce pixel-perfect A4 PDFs with proper `@page` rules, content-aware multi-page pagination, and consistent rendering across browsers — Copilot helped me nail the CSS `@page` rules, the hidden `PrintableResume` component pattern, and the overflow detection logic.

**6. Bug Fixes and Edge Cases**
When things broke (deployment issues on Cloudflare, upload bugs, print layout problems), Copilot was invaluable for debugging. It suggested fixes for Cloudflare-specific quirks, helped resolve module resolution issues, and caught edge cases in the auto-save debounce logic.

### The Bottom Line

Without GitHub Copilot, this project would have taken me 5-7 days of focused development. With Copilot, I shipped a production-ready, AI-powered, full-stack application with 21,700+ lines of code in under 1.5 days. It didn't write the app for me — I designed the architecture, made every product decision, and debugged the hard problems — but it eliminated the mechanical overhead of translating ideas into code. Copilot turned me from a solo developer into a two-person team, and that made all the difference.

<!-- Don't forget to add a cover image (if you want). -->

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->

<!-- Thanks for participating! -->
