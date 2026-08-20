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
 * Primary model — GPT-OSS 120B on Groq (successor to llama-3.3-70b-versatile).
 */
export function getAiModel(): LanguageModel {
  return getGroqProvider()("openai/gpt-oss-120b") as unknown as LanguageModel;
}

/**
 * Returns all available models as an ordered fallback list.
 */
export function getAiModelWithFallback(): LanguageModel[] {
  const groq = getGroqProvider();
  return [
    groq("openai/gpt-oss-120b") as unknown as LanguageModel,
    groq("openai/gpt-oss-20b") as unknown as LanguageModel,
  ];
}

export const MODEL_ID = "openai/gpt-oss-120b";
