import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

const GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-2.5-flash",
];

const GROQ_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
];

let cachedGeminiProvider: ReturnType<typeof createGoogleGenerativeAI> | null = null;
let cachedGroqProvider: ReturnType<typeof createGroq> | null = null;

function getGeminiProvider() {
  if (!cachedGeminiProvider) {
    const apiKey = process.env.GOOGLE_AI_STUDIO_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_STUDIO_API_KEY not configured");
    }
    cachedGeminiProvider = createGoogleGenerativeAI({ apiKey });
  }
  return cachedGeminiProvider;
}

function getGroqProvider() {
  if (!cachedGroqProvider) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY not configured");
    }
    cachedGroqProvider = createGroq({ apiKey });
  }
  return cachedGroqProvider;
}

/**
 * Primary model — Gemini 3.5 Flash.
 */
export function getAiModel(): LanguageModel {
  return getGeminiProvider()("gemini-3.5-flash") as unknown as LanguageModel;
}

/**
 * Returns all available models as an ordered fallback list.
 */
export function getAiModelWithFallback(): LanguageModel[] {
  const gemini = getGeminiProvider();
  const models: LanguageModel[] = GEMINI_MODELS.map(
    (id) => gemini(id) as unknown as LanguageModel
  );

  if (process.env.GROQ_API_KEY) {
    const groq = getGroqProvider();
    models.push(
      ...GROQ_MODELS.map((id) => groq(id as any) as unknown as LanguageModel)
    );
  }

  return models;
}

export const MODEL_ID = "gemini-3.5-flash";
export const FALLBACK_MODEL_ID = "llama-3.3-70b-versatile";
