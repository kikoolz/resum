import { z } from "zod";

// ---------------------------------------------------------------------------
// AI Resume Extraction Schema (for Recreate feature)
// Maps to ResumeValues shape, omitting visual/editor settings
// ---------------------------------------------------------------------------

export const aiResumeExtractionSchema = z.object({
    firstName: z
        .string()
        .optional()
        .describe("First name — copy exactly from the PDF"),
    lastName: z
        .string()
        .optional()
        .describe("Last name / surname — copy exactly from the PDF"),
    jobTitle: z
        .string()
        .optional()
        .describe("Job title or professional headline — copy exactly from the PDF"),
    email: z.string().optional().describe("Email address — copy exactly from the PDF"),
    phone: z.string().optional().describe("Phone number — copy exactly from the PDF"),
    city: z.string().optional().describe("City — copy exactly from the PDF"),
    country: z
        .string()
        .optional()
        .describe("Country or state — copy exactly from the PDF"),
    linkedin: z
        .string()
        .optional()
        .describe("LinkedIn URL — copy exactly from the PDF, full URL"),
    website: z
        .string()
        .optional()
        .describe("Website or portfolio URL — copy exactly from the PDF"),
    summary: z
        .string()
        .optional()
        .describe("Professional summary or objective — copy VERBATIM from the PDF, do not paraphrase"),
    skills: z
        .array(z.string())
        .optional()
        .describe(
            "Individual skills as separate strings. Copy each skill name exactly from the PDF.",
        ),

    workExperiences: z
        .array(
            z.object({
                position: z
                    .string()
                    .optional()
                    .describe("Job title — copy exactly from the PDF"),
                company: z
                    .string()
                    .optional()
                    .describe("Company name — copy exactly from the PDF"),
                location: z.string().optional().describe("Job location — copy exactly from the PDF"),
                startDate: z
                    .string()
                    .optional()
                    .describe(
                        "Start date normalized to YYYY-MM-DD",
                    ),
                endDate: z
                    .string()
                    .optional()
                    .describe(
                        "End date normalized to YYYY-MM-DD. Null if current/present.",
                    ),
                description: z
                    .string()
                    .optional()
                    .describe(
                        "Responsibilities and achievements — copy VERBATIM, join bullet points with \\n",
                    ),
                subheading: z
                    .string()
                    .optional()
                    .describe(
                        "Subheading like department or team name — copy exactly from the PDF",
                    ),
            }),
        )
        .optional()
        .describe("Work experience entries, preserve original order from the PDF"),

    educations: z
        .array(
            z.object({
                degree: z
                    .string()
                    .optional()
                    .describe(
                        "Degree type — copy exactly from the PDF",
                    ),
                school: z
                    .string()
                    .optional()
                    .describe("School name — copy exactly from the PDF"),
                fieldOfStudy: z
                    .string()
                    .optional()
                    .describe("Field of study — copy exactly from the PDF"),
                gpa: z
                    .string()
                    .optional()
                    .describe("GPA — copy exactly from the PDF, null if not listed"),
                location: z.string().optional().describe("School location — copy exactly from the PDF"),
                startDate: z
                    .string()
                    .optional()
                    .describe("Start date normalized to YYYY-MM-DD"),
                endDate: z
                    .string()
                    .optional()
                    .describe("End date normalized to YYYY-MM-DD"),
                description: z
                    .string()
                    .optional()
                    .describe(
                        "Coursework, honors, activities — copy VERBATIM from the PDF",
                    ),
            }),
        )
        .optional()
        .describe("Education entries, preserve original order from the PDF"),

    projects: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Project name — copy exactly from the PDF"),
                subtitle: z
                    .string()
                    .optional()
                    .describe("Subtitle or tech stack — copy exactly from the PDF"),
                description: z
                    .string()
                    .optional()
                    .describe("Project description — copy VERBATIM from the PDF"),
                link: z.string().optional().describe("Project URL — copy exactly from the PDF"),
                startDate: z
                    .string()
                    .optional()
                    .describe("Start date normalized to YYYY-MM-DD"),
                endDate: z
                    .string()
                    .optional()
                    .describe("End date normalized to YYYY-MM-DD"),
            }),
        )
        .optional()
        .describe("Project entries from the PDF"),

    awards: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Award name — copy exactly from the PDF"),
                issuer: z
                    .string()
                    .optional()
                    .describe("Issuing organization — copy exactly from the PDF"),
                description: z
                    .string()
                    .optional()
                    .describe("Award description — copy VERBATIM from the PDF"),
                date: z
                    .string()
                    .optional()
                    .describe("Date normalized to YYYY-MM-DD"),
            }),
        )
        .optional()
        .describe("Awards and honors from the PDF"),

    publications: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Publication title — copy exactly from the PDF"),
                publisher: z
                    .string()
                    .optional()
                    .describe("Publisher or journal — copy exactly from the PDF"),
                authors: z
                    .string()
                    .optional()
                    .describe("Authors — copy exactly from the PDF, comma-separated"),
                description: z
                    .string()
                    .optional()
                    .describe("Description — copy VERBATIM from the PDF"),
                date: z
                    .string()
                    .optional()
                    .describe("Date normalized to YYYY-MM-DD"),
                link: z
                    .string()
                    .optional()
                    .describe("URL — copy exactly from the PDF"),
            }),
        )
        .optional()
        .describe("Publications from the PDF"),

    certificates: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Certificate name — copy exactly from the PDF"),
                issuer: z
                    .string()
                    .optional()
                    .describe("Issuing organization — copy exactly from the PDF"),
                description: z
                    .string()
                    .optional()
                    .describe("Description — copy VERBATIM from the PDF"),
                date: z
                    .string()
                    .optional()
                    .describe("Date normalized to YYYY-MM-DD"),
                link: z
                    .string()
                    .optional()
                    .describe("URL — copy exactly from the PDF"),
                credentialId: z
                    .string()
                    .optional()
                    .describe("Credential ID — copy exactly from the PDF"),
            }),
        )
        .optional()
        .describe("Certifications from the PDF"),

    languages: z
        .array(
            z.object({
                language: z
                    .string()
                    .optional()
                    .describe("Language name — copy exactly from the PDF"),
                proficiency: z
                    .string()
                    .optional()
                    .describe(
                        "Proficiency level — copy exactly from the PDF",
                    ),
            }),
        )
        .optional()
        .describe("Languages from the PDF"),

    courses: z
        .array(
            z.object({
                name: z.string().optional().describe("Course name — copy exactly from the PDF"),
                institution: z
                    .string()
                    .optional()
                    .describe("Institution — copy exactly from the PDF"),
                description: z
                    .string()
                    .optional()
                    .describe("Description — copy VERBATIM from the PDF"),
                date: z
                    .string()
                    .optional()
                    .describe("Date normalized to YYYY-MM-DD"),
            }),
        )
        .optional()
        .describe("Courses from the PDF"),

    references: z
        .array(
            z.object({
                name: z
                    .string()
                    .optional()
                    .describe("Reference name — copy exactly from the PDF"),
                position: z
                    .string()
                    .optional()
                    .describe("Reference job title — copy exactly from the PDF"),
                company: z
                    .string()
                    .optional()
                    .describe("Reference company — copy exactly from the PDF"),
                email: z
                    .string()
                    .optional()
                    .describe("Reference email — copy exactly from the PDF"),
                phone: z
                    .string()
                    .optional()
                    .describe("Reference phone — copy exactly from the PDF"),
            }),
        )
        .optional()
        .describe("References from the PDF"),

    interests: z
        .array(
            z.object({
                name: z
                    .string()
                    .optional()
                    .describe("Interest or hobby — copy exactly from the PDF"),
            }),
        )
        .optional()
        .describe("Interests from the PDF"),
});

export type AiResumeExtraction = z.infer<typeof aiResumeExtractionSchema>;

// ---------------------------------------------------------------------------
// AI Resume Analysis Schema (for Analyze feature)
// ---------------------------------------------------------------------------

export const aiResumeAnalysisSchema = z.object({
    overallScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Overall resume quality score from 0-100. Most resumes fall in 40-80 range. Only exceptional resumes score above 85.",
        ),

    summaryFeedback: z
        .string()
        .describe(
            "A 2-3 sentence overall summary of the resume quality, key strengths, and most important next steps.",
        ),

    topStrengths: z
        .array(z.string())
        .max(5)
        .describe("Top 3-5 specific strengths of this resume"),

    criticalImprovements: z
        .array(z.string())
        .max(5)
        .describe(
            "Top 3-5 most impactful improvements the candidate should make",
        ),

    sections: z
        .array(
            z.object({
                name: z
                    .string()
                    .describe(
                        "Section name (e.g. Summary, Work Experience, Education, Skills, Projects, Formatting, Overall Impact)",
                    ),
                score: z
                    .number()
                    .min(0)
                    .max(100)
                    .describe("Quality score for this section from 0-100"),
                feedback: z
                    .string()
                    .describe(
                        "Specific, actionable feedback for this section referencing actual content from the resume",
                    ),
                strengths: z
                    .array(z.string())
                    .describe("What is done well in this section"),
                improvements: z
                    .array(z.string())
                    .describe("Specific improvements to make in this section"),
            }),
        )
        .describe("Per-section detailed analysis"),

    atsCompatibility: z.object({
        score: z
            .number()
            .min(0)
            .max(100)
            .describe(
                "ATS (Applicant Tracking System) compatibility score from 0-100",
            ),
        issues: z
            .array(z.string())
            .describe(
                "Specific ATS issues found (e.g. graphics, tables, unusual formatting, missing keywords)",
            ),
    }),
});

export type AiResumeAnalysis = z.infer<typeof aiResumeAnalysisSchema>;
