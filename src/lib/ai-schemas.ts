import { z } from "zod";

// ---------------------------------------------------------------------------
// AI Resume Extraction Schema (for Recreate feature)
// Maps to ResumeValues shape, omitting visual/editor settings
// ---------------------------------------------------------------------------

export const aiResumeExtractionSchema = z.object({
    firstName: z
        .string()
        .optional()
        .describe("First name of the candidate"),
    lastName: z
        .string()
        .optional()
        .describe("Last name / surname of the candidate"),
    jobTitle: z
        .string()
        .optional()
        .describe("Current or target job title / professional headline"),
    email: z.string().optional().describe("Email address"),
    phone: z.string().optional().describe("Phone number"),
    city: z.string().optional().describe("City of residence"),
    country: z
        .string()
        .optional()
        .describe("Country or state of residence"),
    linkedin: z
        .string()
        .optional()
        .describe("LinkedIn profile URL (full URL)"),
    website: z
        .string()
        .optional()
        .describe("Personal website or portfolio URL"),
    summary: z
        .string()
        .optional()
        .describe(
            "Professional summary, objective statement, or profile section",
        ),
    skills: z
        .array(z.string())
        .optional()
        .describe(
            "List of individual skills, technologies, and tools. Extract each skill separately, not grouped.",
        ),

    workExperiences: z
        .array(
            z.object({
                position: z
                    .string()
                    .optional()
                    .describe("Job title / position"),
                company: z
                    .string()
                    .optional()
                    .describe("Company or organization name"),
                location: z.string().optional().describe("Job location"),
                startDate: z
                    .string()
                    .optional()
                    .describe(
                        "Start date in YYYY-MM-DD format. If only year, use YYYY-01-01. If month and year, use YYYY-MM-01.",
                    ),
                endDate: z
                    .string()
                    .optional()
                    .describe(
                        "End date in YYYY-MM-DD format. Leave empty if current/present position.",
                    ),
                description: z
                    .string()
                    .optional()
                    .describe(
                        "Responsibilities and achievements. Preserve bullet points as newline-separated items.",
                    ),
                subheading: z
                    .string()
                    .optional()
                    .describe(
                        "Additional subheading like department or team name",
                    ),
            }),
        )
        .optional()
        .describe("Work experience entries, ordered from most recent first"),

    educations: z
        .array(
            z.object({
                degree: z
                    .string()
                    .optional()
                    .describe(
                        "Degree type (e.g. Bachelor of Science, Master of Arts, PhD)",
                    ),
                school: z
                    .string()
                    .optional()
                    .describe("University or institution name"),
                fieldOfStudy: z
                    .string()
                    .optional()
                    .describe("Major, field of study, or concentration"),
                gpa: z
                    .string()
                    .optional()
                    .describe("GPA or grade if listed"),
                location: z.string().optional().describe("School location"),
                startDate: z
                    .string()
                    .optional()
                    .describe("Start date in YYYY-MM-DD format"),
                endDate: z
                    .string()
                    .optional()
                    .describe("End date or expected graduation in YYYY-MM-DD"),
                description: z
                    .string()
                    .optional()
                    .describe(
                        "Relevant coursework, honors, activities, or thesis",
                    ),
            }),
        )
        .optional()
        .describe("Education entries, ordered from most recent first"),

    projects: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Project name or title"),
                subtitle: z
                    .string()
                    .optional()
                    .describe("Brief subtitle, tagline, or tech stack used"),
                description: z
                    .string()
                    .optional()
                    .describe("Project description and key outcomes"),
                link: z.string().optional().describe("Project URL if listed"),
                startDate: z
                    .string()
                    .optional()
                    .describe("Start date in YYYY-MM-DD format"),
                endDate: z
                    .string()
                    .optional()
                    .describe("End date in YYYY-MM-DD format"),
            }),
        )
        .optional()
        .describe("Projects section entries"),

    awards: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Award or honor name"),
                issuer: z
                    .string()
                    .optional()
                    .describe("Organization that issued the award"),
                description: z
                    .string()
                    .optional()
                    .describe("Award description or reason"),
                date: z
                    .string()
                    .optional()
                    .describe("Date received in YYYY-MM-DD format"),
            }),
        )
        .optional()
        .describe("Awards, honors, and achievements"),

    publications: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Publication title"),
                publisher: z
                    .string()
                    .optional()
                    .describe("Journal, conference, or publisher name"),
                authors: z
                    .string()
                    .optional()
                    .describe("Author names as a comma-separated string"),
                description: z
                    .string()
                    .optional()
                    .describe("Abstract or brief description"),
                date: z
                    .string()
                    .optional()
                    .describe("Publication date in YYYY-MM-DD format"),
                link: z
                    .string()
                    .optional()
                    .describe("URL to the publication"),
            }),
        )
        .optional()
        .describe("Publications, papers, or articles"),

    certificates: z
        .array(
            z.object({
                title: z
                    .string()
                    .optional()
                    .describe("Certificate or certification name"),
                issuer: z
                    .string()
                    .optional()
                    .describe("Issuing organization"),
                description: z
                    .string()
                    .optional()
                    .describe("Certificate description"),
                date: z
                    .string()
                    .optional()
                    .describe("Date issued in YYYY-MM-DD format"),
                link: z
                    .string()
                    .optional()
                    .describe("Verification URL"),
                credentialId: z
                    .string()
                    .optional()
                    .describe("Credential or certificate ID"),
            }),
        )
        .optional()
        .describe("Certifications and professional credentials"),

    languages: z
        .array(
            z.object({
                language: z
                    .string()
                    .optional()
                    .describe("Language name (e.g. English, Spanish)"),
                proficiency: z
                    .string()
                    .optional()
                    .describe(
                        "Proficiency level (e.g. Native, Fluent, Advanced, Intermediate, Basic)",
                    ),
            }),
        )
        .optional()
        .describe("Languages spoken"),

    courses: z
        .array(
            z.object({
                name: z.string().optional().describe("Course name"),
                institution: z
                    .string()
                    .optional()
                    .describe("Institution or platform"),
                description: z
                    .string()
                    .optional()
                    .describe("Course description or key topics"),
                date: z
                    .string()
                    .optional()
                    .describe("Completion date in YYYY-MM-DD format"),
            }),
        )
        .optional()
        .describe("Courses and training"),

    references: z
        .array(
            z.object({
                name: z
                    .string()
                    .optional()
                    .describe("Reference person full name"),
                position: z
                    .string()
                    .optional()
                    .describe("Reference person's job title"),
                company: z
                    .string()
                    .optional()
                    .describe("Reference person's company"),
                email: z
                    .string()
                    .optional()
                    .describe("Reference email address"),
                phone: z
                    .string()
                    .optional()
                    .describe("Reference phone number"),
            }),
        )
        .optional()
        .describe("Professional references"),

    interests: z
        .array(
            z.object({
                name: z
                    .string()
                    .optional()
                    .describe("Interest, hobby, or activity"),
            }),
        )
        .optional()
        .describe("Personal interests and hobbies"),
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
