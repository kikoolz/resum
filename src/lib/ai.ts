import { createGoogleGenerativeAI } from "@ai-sdk/google";

const MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

let cachedProvider: ReturnType<typeof createGoogleGenerativeAI> | null = null;

function getProvider() {
  if (!cachedProvider) {
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_STUDIO_API_KEY not configured");
    }
    cachedProvider = createGoogleGenerativeAI({ apiKey });
  }
  return cachedProvider;
}

export function getAiModel() {
  return getProvider()(MODELS[0]);
}

export function getAiModelWithFallback() {
  const provider = getProvider();
  return MODELS.map((id) => provider(id));
}

export const MODEL_ID = MODELS[0];
