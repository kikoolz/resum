# Session Report: PDF Text Extraction Fix

**Date:** 2026-08-20
**Engineer:** OpenCode (mimo-v2.5-free)
**Branch:** main

---

## Problem Statement

The app switched from Gemini to Groq Llama 3.3 70B for AI features. Groq does not support PDF file uploads — only text and images. Two features broke:

1. **AI Resume Extraction** (`recreateResumeFromPdf`) — creates a resume from an uploaded PDF
2. **AI Resume Analysis** (`analyzeResumePdf`) — analyzes a resume PDF for scoring/feedback

Both features tried to send the PDF binary to Groq, which returned:
```
'Non-image file content parts' functionality not supported.
```

The fix required extracting text from the PDF locally before sending to Groq.

---

## What Was Done

### Commit History (in order)

```
b3fb1ea fix: replace pdfjs-dist with unpdf for PDF text extraction     ← FINAL (working)
47a9cd5 docs: PDF extraction bug report for Claude handoff
dd8dde4 fix: extract PDF text with pdfjs-dist, send text to Groq       ← broken on Vercel
71f37ed fix: revert to original PDF-to-AI approach, remove pdf-parse
455c0ed fix: use require() for pdf-parse to avoid broken ESM entrypoint
59d5098 fix: downgrade pdf-parse to v1 for Turbopack compatibility
1045a5b fix: add CanvasFactory to fix DOMMatrix error in pdf-parse v2
1e1df2f fix: correct pdf-parse v2 API usage for text extraction
```

### Failed Attempts (documented in `PDF-BUG-REPORT.md`)

| Attempt | Library | Error | Root Cause |
|---|---|---|---|
| 1 | `pdf-parse` v2.4.5 | `DOMMatrix is not defined` | pdf.js needs browser APIs not in Node.js |
| 2 | `pdf-parse` v2 + CanvasFactory | Turbopack build fails | `@napi-rs/canvas` native binding incompatible |
| 3 | `pdf-parse` v1.1.1 | `ENOENT: ./test/data/05-versions-space.pdf` | `index.js` runs test code when `!module.parent` |
| 4 | `pdf-parse` v1 via `require()` | Same ENOENT error on Vercel | Bundler still sets `module.parent` to undefined |
| 5 | `pdfjs-dist` v4.0.379 direct | `Cannot find module 'pdf.worker.mjs'` | Worker file not at expected path in Vercel serverless |

### Final Solution

Installed `unpdf@1.8.1` — a purpose-built wrapper for serverless/edge environments.

**Modified files:**
- `package.json` — removed `pdfjs-dist`, added `unpdf`
- `src/app/dashboard/actions.ts` — rewrote `getPdfDataForAi` function (lines 636-663)

**Code change:**
```ts
// BEFORE (sent PDF binary to Groq — fails):
const dataUrl = `data:application/pdf;base64,${file.fileData}`;
return { dataUrl, fileName: file.fileName };

// AFTER (extract text with unpdf, send text to Groq):
const { extractText, getDocumentProxy } = await import("unpdf");
const doc = await getDocumentProxy(new Uint8Array(buffer));
const result = await extractText(doc);
const fullText = result.text.join("\n");
return { text: fullText, fileName: file.fileName };
```

Both callers (`recreateResumeFromPdf` and `analyzeResumePdf`) were updated to use the extracted text instead of the PDF binary.

---

## Verification

| Check | Result |
|---|---|
| `rm -rf .next` | Clean |
| `npx tsc --noEmit` | `TSC_EXIT=0` |
| `npx next build` | `BUILD_EXIT=0` |
| Standalone extraction test | Extracted text from valid PDF successfully |
| Native deps check | `npm ls unpdf` — zero native/binary dependencies |

---

## Deployment

Commit `b3fb1ea` pushed to `main`. Awaiting Vercel auto-deploy.

---

## Known Issues / Follow-ups

1. **`saveResume` template-tier enforcement** — `actions.ts` does not check template access on save, only on creation. A free user could bypass template lock via auto-save. (Pre-existing, not introduced by this session.)

2. **Stale Gemini comments** — Two comments in `actions.ts` still reference "Gemini primary, Groq fallback" but the code uses Groq only. Cosmetic, not functional.

3. **`.env.example` leftover** — Still lists `GOOGLE_AI_STUDIO_API_KEY` which is no longer used.
