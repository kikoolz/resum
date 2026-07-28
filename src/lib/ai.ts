import { createGoogleGenerativeAI } from "@ai-sdk/google";

const MODEL_ID = "google-ai-studio/gemini-2.5-flash";

let cachedProvider: ReturnType<typeof createGoogleGenerativeAI> | null = null;

export function getAiModel() {
  if (!cachedProvider) {
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_STUDIO_API_KEY not configured");
    }
    cachedProvider = createGoogleGenerativeAI({ apiKey });
  }
  return cachedProvider(MODEL_ID);
}

export { MODEL_ID };
