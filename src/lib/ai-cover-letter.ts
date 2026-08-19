"use server";

import { generateText } from "ai";
import { getAiModelWithFallback } from "@/lib/ai";
import { requireSession } from "@/lib/auth-server";
import { logAiUsage } from "@/lib/ai-usage";
import { isPremiumUser } from "@/lib/subscription";
import { log } from "@/lib/logger";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface GenerateCoverLetterInput {
    resumeId: string;
    resumeData: {
        firstName?: string | null;
        lastName?: string | null;
        jobTitle?: string | null;
        email?: string | null;
        phone?: string | null;
        city?: string | null;
        country?: string | null;
        summary?: string | null;
        skills?: string[];
        workExperiences?: {
            position?: string | null;
            company?: string | null;
            description?: string | null;
            location?: string | null;
            startDate?: Date | null;
            endDate?: Date | null;
        }[];
        educations?: {
            degree?: string | null;
            school?: string | null;
            fieldOfStudy?: string | null;
            description?: string | null;
        }[];
        projects?: {
            title?: string | null;
            description?: string | null;
        }[];
    };
    companyName?: string;
    jobTitle?: string;
    jobDescription?: string;
    tone?: "professional" | "casual" | "enthusiastic" | "formal";
}

export interface GenerateCoverLetterResult {
    success: boolean;
    content?: string;
    error?: string;
}

// ---------------------------------------------------------------------------
// System prompt
// ---------------------------------------------------------------------------

const TONE_INSTRUCTIONS: Record<string, string> = {
    professional:
        "Write in a professional, polished tone. Use formal language and structure.",
    casual:
        "Write in a friendly, approachable tone. Be conversational but still professional.",
    enthusiastic:
        "Write with energy and genuine excitement. Show passion while remaining credible.",
    formal:
        "Write in a highly formal, traditional tone. Use complete sentences and formal address.",
};

function buildSystemPrompt(tone: string): string {
    return `You are an expert cover letter writer. Write a compelling, tailored cover letter for a job application.

${TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional}

Structure the cover letter as follows:
1. **Opening paragraph**: Address the hiring manager (use "Dear Hiring Manager" if no name is provided). State the position being applied for and where it was found. Include a brief, compelling hook.
2. **Body paragraph(s)**: Highlight 2-3 most relevant experiences or skills that match the job requirements. Use specific examples and achievements from the resume. Connect the candidate's background to what the company needs.
3. **Closing paragraph**: Express enthusiasm for the opportunity, mention wanting to discuss further, and include a professional sign-off.

Guidelines:
- Keep it to 3-5 paragraphs (roughly 250-400 words)
- Do NOT use generic phrases like "I am writing to express my interest" or "I believe I would be a great fit"
- Be specific and tailored to the company and role
- Use the candidate's actual experience and skills from the resume
- Write in first person
- Do NOT include the candidate's contact information at the top (that will be added separately)
- Do NOT include a date
- Return ONLY the cover letter text, no explanations or preamble`;
}

function buildUserMessage(input: GenerateCoverLetterInput): string {
    const parts: string[] = [];

    // Resume context
    const name = [input.resumeData.firstName, input.resumeData.lastName]
        .filter(Boolean)
        .join(" ");
    if (name) parts.push(`Candidate: ${name}`);
    if (input.resumeData.jobTitle) parts.push(`Current title: ${input.resumeData.jobTitle}`);
    if (input.resumeData.summary) parts.push(`Professional summary:\n${input.resumeData.summary}`);
    if (input.resumeData.skills?.length) parts.push(`Key skills: ${input.resumeData.skills.join(", ")}`);

    if (input.resumeData.workExperiences?.length) {
        const exp = input.resumeData.workExperiences
            .map(
                (w) =>
                    `- ${w.position || "Role"} at ${w.company || "Company"}${w.location ? ` (${w.location})` : ""}: ${w.description || "No description"}`,
            )
            .join("\n");
        parts.push(`Work experience:\n${exp}`);
    }

    if (input.resumeData.educations?.length) {
        const edu = input.resumeData.educations
            .map(
                (e) =>
                    `- ${e.degree || ""}${e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ""} from ${e.school || "University"}`,
            )
            .join("\n");
        parts.push(`Education:\n${edu}`);
    }

    if (input.resumeData.projects?.length) {
        const proj = input.resumeData.projects
            .map((p) => `- ${p.title || "Project"}: ${p.description || "No description"}`)
            .join("\n");
        parts.push(`Projects:\n${proj}`);
    }

    // Job context
    if (input.companyName) parts.push(`Company: ${input.companyName}`);
    if (input.jobTitle) parts.push(`Position: ${input.jobTitle}`);
    if (input.jobDescription) {
        const maxLen = 2000;
        const desc = input.jobDescription.length > maxLen
            ? input.jobDescription.slice(0, maxLen) + "..."
            : input.jobDescription;
        parts.push(`Job description:\n${desc}`);
    }

    return parts.join("\n\n");
}

// ---------------------------------------------------------------------------
// Server Action
// ---------------------------------------------------------------------------

export async function generateCoverLetter(
    input: GenerateCoverLetterInput,
): Promise<GenerateCoverLetterResult> {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        // Pro-only feature
        const premium = await isPremiumUser(userId);
        if (!premium) {
            return {
                success: false,
                error: "Cover letter generation is a Pro feature. Upgrade to access AI-powered cover letters.",
            };
        }

        const tone = input.tone || "professional";
        const systemPrompt = buildSystemPrompt(tone);
        const userMessage = buildUserMessage(input);
        const models = getAiModelWithFallback();
        let lastError: Error | null = null;
        let text = "";
        let usage;

        for (const model of models) {
            try {
                const result = await generateText({
                    model,
                    system: systemPrompt,
                    messages: [{ role: "user", content: userMessage }],
                    maxRetries: 2,
                });
                text = result.text;
                usage = result.usage;
                break;
            } catch (err: any) {
                lastError = err;
                const isRateLimit =
                    err?.statusCode === 429 ||
                    err?.message?.includes("RESOURCE_EXHAUSTED") ||
                    err?.message?.includes("rate limit");
                if (!isRateLimit) throw err;
                log.warn("Model rate-limited, trying fallback", { error: err?.message });
            }
        }

        if (!text && lastError) throw lastError;

        // Log token usage
        if (usage) {
            await logAiUsage(userId, usage, "cover_letter");
        }

        const trimmed = text.trim();
        if (!trimmed) {
            return { success: false, error: "AI returned empty text. Please try again." };
        }

        return { success: true, content: trimmed };
    } catch (err) {
        console.error("[generateCoverLetter] error:", err);
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : "Cover letter generation failed. Please try again.",
        };
    }
}
