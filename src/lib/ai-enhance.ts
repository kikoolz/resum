"use server";

import { generateText } from "ai";
import { getAiModel } from "@/lib/ai";
import { requireSession } from "@/lib/auth-server";
import { logAiUsage, checkAiUsageLimit } from "@/lib/ai-usage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EnhanceFieldType =
    | "profile"
    | "experience"
    | "education"
    | "project"
    | "award"
    | "publication"
    | "certificate"
    | "course";

export interface EnhanceFieldInput {
    fieldType: EnhanceFieldType;
    currentText: string;
    context: Record<string, string>;
    maxLength?: number;
}

export interface EnhanceFieldResult {
    success: boolean;
    enhancedText?: string;
    error?: string;
}

// ---------------------------------------------------------------------------
// Section-specific system prompts
// ---------------------------------------------------------------------------

const SECTION_PROMPTS: Record<EnhanceFieldType, string> = {
    profile: `You are an expert resume writer specializing in professional summaries. Write a compelling, concise professional summary that:
- Opens with the candidate's professional identity and years of experience (if inferable from context)
- Highlights 2-3 key areas of expertise or signature strengths
- Ends with what value they bring to an employer
- Uses first person implicitly (no "I" — e.g., "Results-driven engineer with..." not "I am a results-driven engineer")
- Stays within 3-5 sentences
- Avoids cliches like "passionate", "team player", "hard-working" unless genuinely distinctive
Return ONLY the summary text. No preamble, no quotes, no explanations.`,

    experience: `You are an expert resume writer specializing in work experience descriptions. Rewrite the description using achievement-oriented bullet points that:
- Start each bullet with a strong action verb (Architected, Spearheaded, Optimized, Delivered, etc.)
- Follow the PAR format: Problem/context → Action taken → Result/impact
- Include specific metrics, numbers, or percentages where plausible from the original text
- Separate bullet points with newline characters (one bullet per line)
- Keep each bullet to 1-2 lines
- Prioritize impact and outcomes over duties and responsibilities
- Limit to 4-6 bullet points for readability
Return ONLY the bullet points. No preamble, no quotes, no explanations.`,

    education: `You are an expert resume writer specializing in education sections. Enhance the education description to:
- Highlight relevant coursework, honors, or academic achievements
- Mention notable activities, clubs, or leadership roles if referenced
- Keep it concise (2-4 bullet points or a short paragraph)
- Use newlines to separate distinct items
- Focus on what's relevant to a professional audience
Return ONLY the description text. No preamble, no quotes, no explanations.`,

    project: `You are an expert resume writer specializing in project descriptions. Rewrite the project description to:
- Open with 1 sentence explaining what the project does and its purpose
- Highlight the tech stack and architecture decisions
- Emphasize measurable outcomes (users, performance metrics, scale)
- Use bullet points separated by newlines
- Keep to 3-5 bullet points
- Show both technical depth and business/user impact
Return ONLY the description text. No preamble, no quotes, no explanations.`,

    award: `You are an expert resume writer. Enhance the award description to:
- Explain the significance and selectivity of the award
- Mention the scope (e.g., out of how many candidates/submissions)
- Briefly describe what was recognized
- Keep to 1-3 sentences
Return ONLY the description text. No preamble, no quotes, no explanations.`,

    publication: `You are an expert resume writer. Enhance the publication description to:
- Provide a clear, accessible abstract of the work
- Highlight the key contribution or finding
- Mention the methodology briefly if relevant
- Note the impact (citations, adoption, practical applications) if inferable
- Keep to 2-4 sentences
Return ONLY the description text. No preamble, no quotes, no explanations.`,

    certificate: `You are an expert resume writer. Enhance the certificate description to:
- Explain what the certification validates
- Mention key competencies or domains covered
- Note the rigor or recognition of the certifying body if notable
- Keep to 1-3 sentences
Return ONLY the description text. No preamble, no quotes, no explanations.`,

    course: `You are an expert resume writer. Enhance the course description to:
- Describe the key topics and skills covered
- Mention any capstone project or practical component
- Note the relevance to the candidate's career goals if inferable
- Keep to 1-3 sentences
Return ONLY the description text. No preamble, no quotes, no explanations.`,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUserMessage(input: EnhanceFieldInput): string {
    const contextLines = Object.entries(input.context)
        .filter(([, v]) => v?.trim())
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n");

    const hasText = !!input.currentText?.trim();

    if (hasText) {
        return [
            contextLines ? `Context:\n${contextLines}\n` : "",
            `Current text:\n${input.currentText}\n`,
            `Please enhance and improve the text above. Preserve the core meaning but make it more professional, impactful, and polished. Return ONLY the improved text.`,
        ]
            .filter(Boolean)
            .join("\n");
    }

    // Generate mode (empty field)
    if (contextLines) {
        return `Context:\n${contextLines}\n\nThe description field is currently empty. Based on the context above, generate a professional description. Return ONLY the description text.`;
    }

    return `The description field is currently empty and no additional context is available. Generate a brief, professional placeholder description that the user can customize. Return ONLY the text.`;
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

export async function enhanceResumeField(
    input: EnhanceFieldInput,
): Promise<EnhanceFieldResult> {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        // Check AI usage limit
        const usageCheck = await checkAiUsageLimit(userId);
        if (!usageCheck.allowed) {
            return {
                success: false,
                error: `AI usage limit reached (${usageCheck.used.toLocaleString()} / ${usageCheck.limit.toLocaleString()} tokens this month). Upgrade to premium for unlimited access.`,
            };
        }

        const systemPrompt = SECTION_PROMPTS[input.fieldType];
        if (!systemPrompt) {
            return { success: false, error: "Unknown section type." };
        }

        const userMessage = buildUserMessage(input);
        const model = await getAiModel();

        const { text, usage } = await generateText({
            model,
            system: systemPrompt,
            messages: [{ role: "user", content: userMessage }],
            maxRetries: 1,
        });

        // Log token usage
        await logAiUsage(userId, usage, "enhance");

        const trimmed = text.trim();
        if (!trimmed) {
            return { success: false, error: "AI returned empty text. Please try again." };
        }

        const maxLen = input.maxLength ?? 2000;
        const result = trimmed.length > maxLen ? trimmed.slice(0, maxLen) : trimmed;

        return { success: true, enhancedText: result };
    } catch (err) {
        console.error("[enhanceResumeField] error:", err);
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : "AI enhancement failed. Please try again.",
        };
    }
}
