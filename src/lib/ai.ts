import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

let cachedGroqProvider: ReturnType<typeof createGroq> | null = null;

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
 * Primary model — Llama 3.3 70B on Groq (free tier).
 */
export function getAiModel(): LanguageModel {
  return getGroqProvider()("llama-3.3-70b-versatile") as unknown as LanguageModel;
}

/**
 * Returns all available models as an ordered fallback list.
 */
export function getAiModelWithFallback(): LanguageModel[] {
  const groq = getGroqProvider();
  return [
    groq("llama-3.3-70b-versatile") as unknown as LanguageModel,
    groq("llama-3.1-8b-instant") as unknown as LanguageModel,
  ];
}

export const MODEL_ID = "llama-3.3-70b-versatile";
