# Bug Report: PDF Text Extraction Broken in Production

## Problem

We switched from Gemini to Groq Llama 3.3 70B for AI resume analysis. Groq **does not support PDF file uploads** — only text and images. We need to extract text from PDFs locally before sending to Groq.

Every PDF library we've tried fails on Vercel. The error in production is:

```
Setting up fake worker failed: "Cannot find module '/var/task/.next/server/chunks/ssr/pdf.worker.mjs' imported from /var/task/.next/server/chunks/ssr/node_modules_pdfjs-dist_legacy_build_pdf_mjs_1p6i-7y__.js".
```

## Environment

- **Runtime**: Next.js 16.2.12 with Turbopack
- **Node**: 20 (`.nvmrc` says `20`)
- **Deploy**: Vercel serverless
- **AI Provider**: Groq via `@ai-sdk/groq` v3 + `ai` v6

## What We've Tried (All Failed)

### 1. `pdf-parse` v2.4.5
- **Error**: `DOMMatrix is not defined` in Node.js
- **Fix attempt**: Import `CanvasFactory` from `pdf-parse/worker`
- **Result**: `@napi-rs/canvas` native binding breaks Turbopack build: `non-ecmascript placeable asset`

### 2. `pdf-parse` v1.1.1
- **Error**: `ENOENT: no such file or directory, open './test/data/05-versions-space.pdf'`
- **Root cause**: `index.js` has `let isDebugMode = !module.parent` which runs test code when bundled by webpack/turbopack (module.parent is undefined)
- **Fix attempt**: `require("pdf-parse/lib/pdf-parse.js")` to skip broken entrypoint
- **Result**: Same ENOENT error at runtime on Vercel

### 3. `pdfjs-dist` v4.0.379 directly
- **Error in production**: `Setting up fake worker failed: Cannot find module 'pdf.worker.mjs'`
- **Root cause**: pdfjs-dist tries to load a Web Worker file. In Node.js serverless, it falls back to a "fake worker" that it can't find in the bundled output.
- **Code in `src/app/dashboard/actions.ts:658`**:
  ```ts
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  ```

## The Code That Needs Fixing

**File**: `src/app/dashboard/actions.ts`, function `getPdfDataForAi` (line 636-671)

This function:
1. Loads a PDF from the database (stored as base64)
2. Needs to extract plain text from it
3. Returns `{ text: string, fileName: string }`

The extracted text is then sent to Groq in two places:
- `recreateResumeFromPdf` (line ~758) — creates a resume from a PDF upload
- `analyzeResumePdf` (line ~1206) — analyzes a resume PDF

Both now send `content: string` (plain text) instead of `content: [{ type: "file", ... }]` (PDF binary).

## Constraints

1. **Must work on Vercel serverless** — no native dependencies (`@napi-rs/canvas`, etc.)
2. **Must work with Turbopack** — no CommonJS-only packages with ESM-incompatible exports
3. **Must not import browser-only APIs** — no `DOMMatrix`, no Web Workers, no Canvas
4. **Must be pure JS** — Vercel Node.js runtime can't compile native addons
5. **Must handle the buffer from base64** — the PDF is stored as `fileData` in Turso DB

## Possible Solutions

1. **Configure pdfjs-dist worker correctly** — set `GlobalWorkerOptions.workerSrc` to null or use the `getDocument({ useWorkerFetch: false, isEvalSupported: false, ... })` options to disable worker. Check if `pdfjs-dist/legacy/build/pdf.mjs` has a way to run without a worker file.

2. **Use a different lightweight PDF text library** — something like `unpdf` or `pdf-parse` with the correct entry point.

3. **Use the `@ai-sdk/google` provider instead of Groq for PDF analysis** — Gemini supports PDF file uploads natively, so keep Groq for text-only features but route PDF analysis through Gemini.

4. **Run text extraction at upload time** — when the user uploads a PDF, extract text immediately using a client-side library (e.g., `pdfjs-dist` in the browser) and store both the PDF binary and the extracted text in the database. Then `getPdfDataForAi` just reads the pre-extracted text.

## Recommendation

**Option 4 is the most robust** — extract text client-side at upload time. The browser has full PDF support, no worker issues. Store `extractedText` as a new column in the `userFiles` table. This way the server action never needs to parse PDFs at all.

If you go with Option 1, the key is to configure pdfjs-dist to not use a worker:
```ts
const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
pdfjsLib.GlobalWorkerOptions.workerSrc = ""; // disable worker
// or pass to getDocument:
const doc = await pdfjsLib.getDocument({
  data: new Uint8Array(buffer),
  useWorkerFetch: false,
  isEvalSupported: false,
  useSystemFonts: true,
}).promise;
```

## Git History

```
dd8dde4 fix: extract PDF text with pdfjs-dist, send text to Groq   <-- CURRENT (broken)
71f37ed fix: revert to original PDF-to-AI approach, remove pdf-parse
455c0ed fix: use require() for pdf-parse to avoid broken ESM entrypoint
59d5098 fix: downgrade pdf-parse to v1 for Turbopack compatibility
1045a5b fix: add CanvasFactory to fix DOMMatrix error in pdf-parse v2
1e1df2f fix: correct pdf-parse v2 API usage for text extraction
7df0568 fix: downgrade @ai-sdk/groq to v3 for AI SDK v6 compatibility  <-- WORKING (but sends PDF to Groq which fails)
6be2305 feat: switch from Gemini to Groq Llama 3.3 70B
```
