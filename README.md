# Resum

AI-powered resume builder SaaS. Build, enhance, analyze, and export professional resumes with AI assistance.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** Turso (libSQL) via Drizzle ORM
- **Auth:** Better Auth (Google OAuth + Email/Password)
- **AI:** Google AI Studio (Gemini) via Vercel AI SDK
- **Payments:** Stripe (Pro/Lifetime tiers)
- **Storage:** Vercel Blob (photos, PDFs)
- **UI:** shadcn/ui + Tailwind CSS 4 + Framer Motion
- **Editor:** TipTap rich text editor
- **Fonts:** Bricolage Grotesque (headings) + Inter (body)

## Features

### Resume Builder
- 20 professionally designed templates (Simple, Modern, Professional, Creative, Executive, and more)
- 13 editable sections: Personal Info, Profile, Experience, Education, Skills, Projects, Awards, Publications, Certificates, Languages, Courses, References, Interests
- Drag-and-drop section ordering and visibility toggles
- Field-level visibility controls
- Auto-save with `useAutoSaveResume` hook
- Rich text editing with 17 TipTap extensions
- Dark/light mode support

### AI Features
- **Resume Recreation:** Upload a PDF resume and AI extracts all structured data into an editable resume
- **Resume Analysis:** AI scores your resume from Recruiter, Hiring Manager, and ATS perspectives with actionable feedback
- **Field Enhancement:** Section-specific AI prompts to improve summaries, experience bullets, project descriptions, and more
- **Cover Letter Generation:** AI-generated cover letters with 4 tone options (professional, casual, enthusiastic, formal)
- Token-level usage tracking with monthly limits per tier

### Export
- **PDF:** Print-ready via `react-to-print` (free tier includes watermark)
- **DOCX:** Server-side generation via `docx` library at `/api/export-docx`

### Monetization
- **Free:** 1 resume, 2 templates, 50K AI tokens/month, watermark on PDF exports
- **Pro (Monthly/Yearly):** Unlimited resumes & cover letters, 20 templates, 500K AI tokens/month, no watermark
- **Lifetime:** One-time payment, same as Pro benefits

### Other
- Referral program with reward tracking (extend subscription by 30 days per referral)
- Public portfolio endpoint at `/api/portfolio/[resumeId]`
- SEO: robots.txt, sitemap.xml, OpenGraph meta tags
- Photo cropping with circular cropper for profile photos

## Getting Started

### Prerequisites

- Node.js 18+
- A [Turso](https://turso.tech) account
- A [Stripe](https://stripe.com) account (for billing)
- A [Google AI Studio](https://aistudio.google.com) API key
- A [Google Cloud](https://console.cloud.google.com) project (for OAuth)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
# Auth
BETTER_AUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BETTER_AUTH_URL=http://localhost:3000
BASE_URL=http://localhost:3000

# Turso Database
TURSO_DATABASE_URL=libsql://your-db-name-your-org.turso.io
TURSO_AUTH_TOKEN=your_turso_auth_token

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# Google AI Studio
GOOGLE_AI_STUDIO_API_KEY=your_api_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_PRO_PRICE_ID_MONTHLY=price_...
STRIPE_PRO_PRICE_ID_YEARLY=price_...
STRIPE_LIFETIME_PRICE_ID=price_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Local DB for auth CLI
DATABASE=sqlite:./dev.db
```

### Installation

```bash
# Install dependencies
npm install

# Generate database migrations
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run auth:update` | Regenerate Better Auth schema |
| `npm run format` | Format codebase with Prettier |
| `npm run clean` | Remove `.next` and `node_modules` |

## Database Schema

21 tables across auth and application data:

**Auth:** `users`, `sessions`, `accounts`, `verifications`

**Application:** `resumes`, `work_experiences`, `educations`, `projects`, `awards`, `publications`, `certificates`, `languages`, `courses`, `resume_references`, `interests`, `cover_letters`, `user_subscriptions`, `user_files`, `ai_results`, `ai_usage_logs`, `referrals`

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Sign-in, sign-up pages
│   ├── api/                 # API routes (auth, checkout, files, export, webhooks)
│   ├── dashboard/           # Authenticated dashboard
│   │   ├── billing/         # Subscription management
│   │   ├── cover-letters/   # Cover letter editor
│   │   ├── editor/          # Resume editor with templates
│   │   ├── uploads/         # PDF upload & AI extraction
│   │   ├── profile/         # User profile
│   │   └── referrals/       # Referral program
│   ├── privacy/             # Privacy policy
│   └── terms/               # Terms of service
├── auth/                    # Better Auth configuration
├── components/
│   ├── landing/             # Landing page sections
│   ├── tiptap-*/            # TipTap editor components
│   └── ui/                  # shadcn/ui components (57)
├── db/
│   ├── index.ts             # Turso database client
│   ├── schema.ts            # Application schema (17 tables)
│   └── auth.schema.ts       # Auth schema (4 tables)
├── hooks/                   # 12 custom React hooks
├── lib/                     # Utilities (AI, auth, stripe, storage, etc.)
└── middleware.ts            # Route protection
```

## License

Private project.
