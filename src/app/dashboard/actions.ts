"use server";

import { getDb } from "@/db";
import {
    resumes,
    workExperiences,
    educations,
    projects,
    awards,
    publications,
    certificates,
    languages,
    courses,
    resumeReferences,
    interests,
    userFiles,
    aiResults,
    coverLetters,
} from "@/db/schema";
import { requireSession } from "@/lib/auth-server";
import { resumeSchema, coverLetterSchema, type ResumeValues, type CoverLetterValues } from "@/lib/validation";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { generateText, Output, NoObjectGeneratedError } from "ai";
import { getAiModel, MODEL_ID } from "@/lib/ai";
import { logAiUsage, checkAiUsageLimit, checkFeatureLimit } from "@/lib/ai-usage";
import { canCreateResume, PLAN_LIMITS, getUserTier } from "@/lib/subscription";
import {
    aiResumeExtractionSchema,
    aiResumeAnalysisSchema,
    type AiResumeExtraction,
    type AiResumeAnalysis,
} from "@/lib/ai-schemas";

// ---------------------------------------------------------------------------
// Create a new resume and redirect to the editor
// ---------------------------------------------------------------------------
export async function createResume() {
    const session = await requireSession();
    const db = await getDb();

    // Enforce free-plan resume limit
    const check = await canCreateResume(session.user.id);
    if (!check.allowed) {
        redirect("/dashboard?limit=true");
    }

    const [resume] = await db
        .insert(resumes)
        .values({ userId: session.user.id, title: "Untitled Resume" })
        .returning();

    redirect(`/dashboard/editor/${resume.id}`);
}

// ---------------------------------------------------------------------------
// Create a new resume pre-filled with template data and redirect to editor
// ---------------------------------------------------------------------------
export async function createResumeFromTemplate(
    templateData: ResumeValues,
): Promise<void> {
    const session = await requireSession();
    const db = await getDb();

    // Enforce free-plan resume limit
    const check = await canCreateResume(session.user.id);
    if (!check.allowed) {
        redirect("/dashboard?limit=true");
    }

    // Enforce template access
    const userTier = await getUserTier(session.user.id);
    const allowedTemplates = PLAN_LIMITS[userTier].templates;
    const requestedTemplate = (templateData.templateName || "professional") as string;
    if (!(allowedTemplates as readonly string[]).includes(requestedTemplate)) {
        redirect("/dashboard/billing");
    }

    // 1. Insert the resume row with template fields
    const [resume] = await db
        .insert(resumes)
        .values({
            userId: session.user.id,
            title: templateData.title || "From Template",
            photoUrl: templateData.photoUrl || null,
            firstName: templateData.firstName || null,
            lastName: templateData.lastName || null,
            jobTitle: templateData.jobTitle || null,
            email: templateData.email || null,
            phone: templateData.phone || null,
            city: templateData.city || null,
            country: templateData.country || null,
            linkedin: templateData.linkedin || null,
            website: templateData.website || null,
            summary: templateData.summary || null,
            colorHex: templateData.colorHex || "#000000",
            borderStyle: templateData.borderStyle || "squircle",
            layout: templateData.layout || "single-column",
            templateName: templateData.templateName || "professional",
            skills: templateData.skills ?? [],
            sectionOrder: templateData.sectionOrder ?? [],
            sectionVisibility: templateData.sectionVisibility ?? {},
            fieldVisibility: templateData.fieldVisibility ?? {},
            fontSize: templateData.fontSize ?? 10,
            fontFamily: templateData.fontFamily ?? "serif",
        })
        .returning();

    const resumeId = resume.id;

    // 2. Insert related rows
    if (templateData.workExperiences && templateData.workExperiences.length > 0) {
        await db.insert(workExperiences).values(
            templateData.workExperiences.map((exp, idx) => ({
                resumeId,
                position: exp.position || null,
                company: exp.company || null,
                startDate: exp.startDate ? new Date(exp.startDate) : null,
                endDate: exp.endDate ? new Date(exp.endDate) : null,
                description: exp.description || null,
                location: exp.location || null,
                subheading: exp.subheading || null,
                visible: exp.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.educations && templateData.educations.length > 0) {
        await db.insert(educations).values(
            templateData.educations.map((edu, idx) => ({
                resumeId,
                degree: edu.degree || null,
                school: edu.school || null,
                fieldOfStudy: edu.fieldOfStudy || null,
                gpa: edu.gpa || null,
                description: edu.description || null,
                location: edu.location || null,
                startDate: edu.startDate ? new Date(edu.startDate) : null,
                endDate: edu.endDate ? new Date(edu.endDate) : null,
                visible: edu.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.projects && templateData.projects.length > 0) {
        await db.insert(projects).values(
            templateData.projects.map((p, idx) => ({
                resumeId,
                title: p.title || null,
                subtitle: p.subtitle || null,
                description: p.description || null,
                link: p.link || null,
                startDate: p.startDate ? new Date(p.startDate) : null,
                endDate: p.endDate ? new Date(p.endDate) : null,
                visible: p.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.awards && templateData.awards.length > 0) {
        await db.insert(awards).values(
            templateData.awards.map((a, idx) => ({
                resumeId,
                title: a.title || null,
                issuer: a.issuer || null,
                description: a.description || null,
                date: a.date ? new Date(a.date) : null,
                visible: a.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.publications && templateData.publications.length > 0) {
        await db.insert(publications).values(
            templateData.publications.map((p, idx) => ({
                resumeId,
                title: p.title || null,
                publisher: p.publisher || null,
                authors: p.authors || null,
                description: p.description || null,
                date: p.date ? new Date(p.date) : null,
                link: p.link || null,
                visible: p.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.certificates && templateData.certificates.length > 0) {
        await db.insert(certificates).values(
            templateData.certificates.map((c, idx) => ({
                resumeId,
                title: c.title || null,
                issuer: c.issuer || null,
                description: c.description || null,
                date: c.date ? new Date(c.date) : null,
                link: c.link || null,
                credentialId: c.credentialId || null,
                visible: c.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.languages && templateData.languages.length > 0) {
        await db.insert(languages).values(
            templateData.languages.map((l, idx) => ({
                resumeId,
                language: l.language || null,
                proficiency: l.proficiency || null,
                visible: l.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.courses && templateData.courses.length > 0) {
        await db.insert(courses).values(
            templateData.courses.map((c, idx) => ({
                resumeId,
                name: c.name || null,
                institution: c.institution || null,
                description: c.description || null,
                date: c.date ? new Date(c.date) : null,
                visible: c.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.references && templateData.references.length > 0) {
        await db.insert(resumeReferences).values(
            templateData.references.map((r, idx) => ({
                resumeId,
                name: r.name || null,
                position: r.position || null,
                company: r.company || null,
                email: r.email || null,
                phone: r.phone || null,
                visible: r.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    if (templateData.interests && templateData.interests.length > 0) {
        await db.insert(interests).values(
            templateData.interests.map((i, idx) => ({
                resumeId,
                name: i.name || null,
                visible: i.visible ?? true,
                displayOrder: idx,
            })),
        );
    }

    redirect(`/dashboard/editor/${resumeId}`);
}

// ---------------------------------------------------------------------------
// Delete a resume (cascades to all related tables via FK)
// ---------------------------------------------------------------------------
export async function deleteResume(resumeId: string) {
    const session = await requireSession();
    const db = await getDb();

    // Clean up files associated with this resume (Turso storage)
    await db
        .delete(userFiles)
        .where(
            and(
                eq(userFiles.resumeId, resumeId),
                eq(userFiles.userId, session.user.id),
            ),
        );

    // ownership check built into the WHERE clause
    await db
        .delete(resumes)
        .where(
            and(
                eq(resumes.id, resumeId),
                eq(resumes.userId, session.user.id),
            ),
        );

    revalidatePath("/dashboard");
}

// ---------------------------------------------------------------------------
// Save / auto-save resume (used by the editor auto-save hook)
//
// Architecture decisions:
//   - Server-side Zod validation on every save (never trust the client)
//   - Auth + ownership check before any write
//   - "delete-all-then-insert" for relations (simple, safe at resume scale)
//   - Returns {success, error} – never throws so the client can recover
// ---------------------------------------------------------------------------
export async function saveResume(
    values: ResumeValues,
): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Auth
        const session = await requireSession();

        // 2. Server-side validation
        const parsed = resumeSchema.safeParse(values);
        if (!parsed.success) {
            return {
                success: false,
                error: "Validation failed: " + parsed.error.issues[0]?.message,
            };
        }
        const data = parsed.data;

        if (!data.id) {
            return { success: false, error: "Resume ID is required" };
        }

        const db = await getDb();

        // 3. Ownership check – fetch once, fail fast
        const existing = await db.query.resumes.findFirst({
            where: and(
                eq(resumes.id, data.id),
                eq(resumes.userId, session.user.id),
            ),
            columns: { id: true },
        });

        if (!existing) {
            return { success: false, error: "Resume not found" };
        }

        // 4. Destructure relations from the flat resume fields
        const {
            id: resumeId,
            workExperiences: workExps,
            educations: edus,
            projects: projs,
            awards: awds,
            publications: pubs,
            certificates: certs,
            languages: langs,
            courses: crses,
            references: refs,
            interests: ints,
            ...resumeFields
        } = data;

        // 5. Atomic save: update resume + replace all relations in one transaction
        await db.transaction(async (tx) => {
            // 5a. Update the resume row
            await tx
                .update(resumes)
                .set({
                    ...resumeFields,
                    skills: resumeFields.skills ?? [],
                    sectionOrder: resumeFields.sectionOrder ?? [],
                    sectionVisibility: resumeFields.sectionVisibility ?? {},
                    fieldVisibility: resumeFields.fieldVisibility ?? {},
                    updatedAt: new Date(),
                })
                .where(eq(resumes.id, resumeId));

            // 5b. Helper: replace all rows for a relation table
            async function replaceRelation<T extends Record<string, unknown>>(
                table: Parameters<typeof tx.delete>[0],
                _resumeIdCol: { resumeId: string },
                rows: T[] | undefined,
                mapFn: (row: T, idx: number) => Record<string, unknown>,
            ) {
                await tx.delete(table).where(
                    eq(
                        (table as any).resumeId,
                        resumeId,
                    ),
                );
                if (rows && rows.length > 0) {
                    await tx.insert(table as any).values(
                        rows.map((row, idx) => ({
                            ...mapFn(row, idx),
                            resumeId,
                        })),
                    );
                }
            }

            // Replace work experiences
            await replaceRelation(
                workExperiences,
                { resumeId },
                workExps,
                (exp, idx) => ({
                    position: exp.position || null,
                    company: exp.company || null,
                    startDate: exp.startDate ? new Date(exp.startDate) : null,
                    endDate: exp.endDate ? new Date(exp.endDate) : null,
                    description: exp.description || null,
                    location: exp.location || null,
                    subheading: exp.subheading || null,
                    visible: exp.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace educations
            await replaceRelation(
                educations,
                { resumeId },
                edus,
                (edu, idx) => ({
                    degree: edu.degree || null,
                    school: edu.school || null,
                    fieldOfStudy: edu.fieldOfStudy || null,
                    gpa: edu.gpa || null,
                    description: edu.description || null,
                    location: edu.location || null,
                    startDate: edu.startDate ? new Date(edu.startDate) : null,
                    endDate: edu.endDate ? new Date(edu.endDate) : null,
                    visible: edu.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace projects
            await replaceRelation(
                projects,
                { resumeId },
                projs,
                (p, idx) => ({
                    title: p.title || null,
                    subtitle: p.subtitle || null,
                    description: p.description || null,
                    link: p.link || null,
                    startDate: p.startDate ? new Date(p.startDate) : null,
                    endDate: p.endDate ? new Date(p.endDate) : null,
                    visible: p.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace awards
            await replaceRelation(
                awards,
                { resumeId },
                awds,
                (a, idx) => ({
                    title: a.title || null,
                    issuer: a.issuer || null,
                    description: a.description || null,
                    date: a.date ? new Date(a.date) : null,
                    visible: a.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace publications
            await replaceRelation(
                publications,
                { resumeId },
                pubs,
                (p, idx) => ({
                    title: p.title || null,
                    publisher: p.publisher || null,
                    authors: p.authors || null,
                    description: p.description || null,
                    date: p.date ? new Date(p.date) : null,
                    link: p.link || null,
                    visible: p.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace certificates
            await replaceRelation(
                certificates,
                { resumeId },
                certs,
                (c, idx) => ({
                    title: c.title || null,
                    issuer: c.issuer || null,
                    description: c.description || null,
                    date: c.date ? new Date(c.date) : null,
                    link: c.link || null,
                    credentialId: c.credentialId || null,
                    visible: c.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace languages
            await replaceRelation(
                languages,
                { resumeId },
                langs,
                (l, idx) => ({
                    language: l.language || null,
                    proficiency: l.proficiency || null,
                    visible: l.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace courses
            await replaceRelation(
                courses,
                { resumeId },
                crses,
                (c, idx) => ({
                    name: c.name || null,
                    institution: c.institution || null,
                    description: c.description || null,
                    date: c.date ? new Date(c.date) : null,
                    visible: c.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace references
            await replaceRelation(
                resumeReferences,
                { resumeId },
                refs,
                (r, idx) => ({
                    name: r.name || null,
                    position: r.position || null,
                    company: r.company || null,
                    email: r.email || null,
                    phone: r.phone || null,
                    visible: r.visible ?? true,
                    displayOrder: idx,
                }),
            );

            // Replace interests
            await replaceRelation(
                interests,
                { resumeId },
                ints,
                (i, idx) => ({
                    name: i.name || null,
                    visible: i.visible ?? true,
                    displayOrder: idx,
                }),
            );
        });

        return { success: true };
    } catch (err) {
        console.error("[saveResume] Unexpected error:", err);
        return {
            success: false,
            error: "An unexpected error occurred while saving",
        };
    }
}

// ---------------------------------------------------------------------------
// Delete a file from storage and its DB record
// ---------------------------------------------------------------------------
export async function deleteFile(
    fileId: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        const session = await requireSession();
        const db = await getDb();

        const file = await db.query.userFiles.findFirst({
            where: and(
                eq(userFiles.id, fileId),
                eq(userFiles.userId, session.user.id),
            ),
        });

        if (!file) {
            return { success: false, error: "File not found" };
        }

        // Delete from Turso storage (data is in the DB)
        await db.delete(userFiles).where(and(eq(userFiles.id, fileId), eq(userFiles.userId, session.user.id)));

        return { success: true };
    } catch (err) {
        console.error("[deleteFile] error:", err);
        return { success: false, error: "Failed to delete file" };
    }
}

// ---------------------------------------------------------------------------
// AI Helpers (internal, not exported)
// ---------------------------------------------------------------------------

/**
 * Gets the PDF content as a base64 data URL for AI processing.
 * File data is stored directly in Turso as base64.
 */
async function getPdfDataForAi(
    userId: string,
    fileId: string,
): Promise<{ dataUrl: string; fileName: string }> {
    const db = await getDb();

    const file = await db.query.userFiles.findFirst({
        where: and(
            eq(userFiles.id, fileId),
            eq(userFiles.userId, userId),
            eq(userFiles.fileType, "resume_pdf"),
        ),
        columns: { fileData: true, fileName: true },
    });

    if (!file || !file.fileData) {
        throw new Error("PDF file not found");
    }

    // File data is already stored as base64 in Turso
    const dataUrl = `data:application/pdf;base64,${file.fileData}`;
    return { dataUrl, fileName: file.fileName };
}

async function getCachedAiResult(
    userFileId: string,
    resultType: "extraction" | "analysis",
): Promise<unknown | null> {
    const db = await getDb();
    const cached = await db.query.aiResults.findFirst({
        where: and(
            eq(aiResults.userFileId, userFileId),
            eq(aiResults.resultType, resultType),
        ),
    });
    return cached?.resultData ?? null;
}

async function saveCachedAiResult(
    userId: string,
    userFileId: string,
    resultType: "extraction" | "analysis",
    resultData: unknown,
    modelId: string,
): Promise<void> {
    const db = await getDb();
    await db.insert(aiResults).values({
        userId,
        userFileId,
        resultType,
        resultData: resultData as Record<string, unknown>,
        modelId,
    });
}

function buildSectionOrder(extraction: AiResumeExtraction): string[] {
    const order: string[] = ["personal-info"];
    if (extraction.summary) order.push("profile");
    if (extraction.educations?.length) order.push("education");
    if (extraction.skills?.length) order.push("skills");
    if (extraction.workExperiences?.length) order.push("experience");
    if (extraction.projects?.length) order.push("projects");
    if (extraction.awards?.length) order.push("awards");
    if (extraction.publications?.length) order.push("publications");
    if (extraction.certificates?.length) order.push("certificates");
    if (extraction.languages?.length) order.push("languages");
    if (extraction.courses?.length) order.push("courses");
    if (extraction.references?.length) order.push("references");
    if (extraction.interests?.length) order.push("interests");
    return order;
}

function buildSectionVisibility(
    extraction: AiResumeExtraction,
): Record<string, boolean> {
    return {
        "personal-info": true,
        profile: !!extraction.summary,
        education: !!extraction.educations?.length,
        skills: !!extraction.skills?.length,
        experience: !!extraction.workExperiences?.length,
        projects: !!extraction.projects?.length,
        awards: !!extraction.awards?.length,
        publications: !!extraction.publications?.length,
        certificates: !!extraction.certificates?.length,
        languages: !!extraction.languages?.length,
        courses: !!extraction.courses?.length,
        references: !!extraction.references?.length,
        interests: !!extraction.interests?.length,
    };
}

// ---------------------------------------------------------------------------
// Recreate Resume from uploaded PDF via AI extraction
// ---------------------------------------------------------------------------
export async function recreateResumeFromPdf(
    fileId: string,
): Promise<{ success: boolean; resumeId?: string; error?: string }> {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        // 1. Check cache for existing extraction
        const cached = await getCachedAiResult(fileId, "extraction");
        let extraction: AiResumeExtraction;

        if (cached) {
            extraction = cached as AiResumeExtraction;
        } else {
            // 2. Check AI usage limit
            const usageCheck = await checkAiUsageLimit(userId);
            if (!usageCheck.allowed) {
                return {
                    success: false,
                    error: `AI usage limit reached (${usageCheck.used.toLocaleString()} / ${usageCheck.limit.toLocaleString()} tokens this month). Upgrade to premium for unlimited access.`,
                };
            }

            // 2b. Check per-feature monthly limit
            const featureCheck = await checkFeatureLimit(userId, "recreate");
            if (!featureCheck.allowed) {
                return {
                    success: false,
                    error: `AI recreate limit reached (${featureCheck.used} / ${featureCheck.limit} this month). Upgrade for higher limits.`,
                };
            }

            // 3. Get a temporary presigned URL for the PDF
            const { dataUrl: pdfDataUrl, fileName } = await getPdfDataForAi(userId, fileId);

            // 4. Call Gemini via AI Gateway for structured extraction
            const model = await getAiModel();
            const { output, usage } = await generateText({
                model,
                output: Output.object({
                    schema: aiResumeExtractionSchema,
                }),
                system: `You are a world-class resume data extraction engine built for precision and completeness. You have deep expertise in parsing resumes across every industry, career level, and format — from a fresh graduate's single-page resume to a senior executive's multi-page CV.

Your mission: extract EVERY piece of structured data from the PDF with surgical accuracy. Treat the resume as a source of truth — extract what exists, never infer what doesn't.

## Core Extraction Rules

1. **Completeness over brevity.** Extract ALL sections, ALL entries, ALL bullet points. If a resume has 15 bullet points under a role, extract all 15 — do not summarize or truncate.

2. **Fidelity to source.** Extract text exactly as written. Do not rephrase, paraphrase, improve, or "clean up" the candidate's language. Their exact wording matters for recreating a faithful resume.

3. **Null over fabrication.** If a field is not present in the resume, omit it (return null/undefined). NEVER guess, infer, or fabricate data. Common examples:
   - No phone number listed → phone: null (don't guess from area codes or other context)
   - No end date on a role → endDate: null (this means "present/current")
   - No location listed → location: null (don't infer from company name)
   - No GPA listed → gpa: null (don't estimate)

## Date Handling

Dates on resumes come in wildly inconsistent formats. Normalize ALL dates to YYYY-MM-DD:
- "June 2023" or "Jun 2023" → "2023-06-01"
- "2023" (year only) → "2023-01-01"
- "Summer 2022" → "2022-06-01"
- "Q3 2021" → "2021-07-01"
- "Present", "Current", "Now", or "Ongoing" → leave endDate empty/null
- "Expected May 2025" or "Expected 2025" → use the expected date
- If a date range says "2021 - 2023" with no months → startDate: "2021-01-01", endDate: "2023-01-01"

## Layout & Format Handling

Resumes come in many layouts. Handle each correctly:
- **Multi-column layouts:** Read ALL columns. Side columns often contain contact info, skills, languages, or certifications.
- **Two-column designs:** Left column might have skills/contact, right column has experience. Extract from both.
- **Tables/grids:** These might contain skills matrices or structured education data. Extract the cell content.
- **Headers/footers:** May contain contact info, page numbers, or links. Don't miss them.
- **Icons/symbols:** Resume may use icons (📧, 📱, 🔗) before contact info. Extract the data after the icon.

## Work Experience Nuances

- **Multiple roles at same company:** Some candidates list multiple promotions/roles under one company. Extract each as a separate workExperience entry with the company name repeated.
- **Titles with slashes:** "Software Engineer / Tech Lead" → position: "Software Engineer / Tech Lead" (keep as-is, don't split)
- **Freelance/contract work:** Extract like any other role. Company might be "Self-employed", "Freelance", or client names.
- **Bullet points vs. paragraphs:** If descriptions use bullet points (•, -, *, ▪), join them with "\n". If it's a paragraph, keep as a single string.
- **Subheadings:** Some resumes have a secondary line under the job title (e.g., department name, team name, or a brief tagline). Capture this in the subheading field.

## Skills Extraction

- **Flatten grouped skills.** If the resume says "Programming: Python, Java, C++" → extract as ["Python", "Java", "C++"]
- **Separate categories.** "Frontend: React, Vue" and "Backend: Node.js, Django" → ["React", "Vue", "Node.js", "Django"]
- **Preserve proficiency if mentioned inline.** Don't extract "Advanced" or "Beginner" as skills — they are proficiency levels for language entries.
- **Tools and platforms are skills too.** Git, Docker, AWS, Figma, Jira — these are individual skills.
- **Soft skills only if explicitly listed.** Leadership, Communication, etc. — only extract if the resume explicitly lists them in a skills section.

## Education Nuances

- **Honors/Cum Laude:** Include in the description field, not the degree field.
- **Minor/Concentration:** Include in fieldOfStudy (e.g., "Computer Science, Minor in Mathematics")
- **Coursework listings:** If relevant coursework is listed, include in description.
- **Study abroad:** If listed as a separate education entry, extract it as one.

## Contact & Personal Info

- **Name parsing:** First word(s) = firstName, last word = lastName. For names like "Jean-Pierre Dupont", firstName: "Jean-Pierre", lastName: "Dupont". For "Mary Jane Watson", firstName: "Mary Jane", lastName: "Watson" (middle names go with first name).
- **LinkedIn URL normalization:** Extract the full URL as written (don't try to normalize linkedin.com/in/xxx formats).
- **Multiple websites:** If both a portfolio and GitHub are listed, pick the primary portfolio for website. GitHub can be noted in projects.
- **Location:** Extract city and country separately. "New York, NY" → city: "New York", country: "NY". "London, UK" → city: "London", country: "UK".

## Ordering

- Preserve the resume's original ordering within each section (typically most recent first for experience/education).`,
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "file",
                                data: pdfDataUrl,
                                mediaType: "application/pdf",
                            },
                            {
                                type: "text",
                                text: `Extract all structured data from this resume PDF ("${fileName}").

Here is an example of the expected output format for a work experience entry:
{
  "position": "Senior Software Engineer",
  "company": "Acme Corp",
  "location": "San Francisco, CA",
  "startDate": "2021-03-01",
  "endDate": "2023-11-01",
  "description": "Led migration of monolith to microservices architecture, reducing deployment time by 60%\nDesigned and implemented real-time event processing pipeline handling 50K events/sec\nReduced API p95 latency from 800ms to 120ms through Redis caching and query optimization\nMentored 3 junior engineers through weekly 1:1s and code reviews",
  "subheading": "Platform Engineering Team"
}

And for an education entry:
{
  "degree": "Bachelor of Science",
  "school": "Stanford University",
  "fieldOfStudy": "Computer Science",
  "gpa": "3.8/4.0",
  "location": "Stanford, CA",
  "startDate": "2017-09-01",
  "endDate": "2021-06-01",
  "description": "Dean's List (6 semesters)\nRelevant Coursework: Distributed Systems, Machine Learning, Database Systems"
}

Extract EVERY section you can find: personal info, summary/objective, work experience, education, projects, skills, awards, publications, certificates, languages, courses, references, and interests. Do not skip any content — even small sections like hobbies or volunteer work should be captured in the appropriate field.`,
                            },
                        ],
                    },
                ],
                maxRetries: 2,
            });

            if (!output) {
                return {
                    success: false,
                    error: "AI could not extract structured data from this PDF. Please ensure it is a valid resume.",
                };
            }

            extraction = output;

            // 5. Log token usage (non-blocking — never crash the flow if logging fails)
            try {
                await logAiUsage(userId, usage, "recreate");
            } catch (logErr) {
                console.error("[recreateResumeFromPdf] Failed to log AI usage:", logErr);
            }

            // 6. Cache the extraction result
            await saveCachedAiResult(
                userId,
                fileId,
                "extraction",
                extraction,
                MODEL_ID,
            );
        }

        // 5. Transform AI extraction to ResumeValues shape
        //    Null-coalesce every field — never let undefined slip into the DB
        const nameParts = [extraction.firstName, extraction.lastName].filter(
            Boolean,
        );
        const resumeValues: ResumeValues = {
            title:
                nameParts.length > 0
                    ? `${nameParts.join(" ")}'s Resume`
                    : "Imported Resume",
            firstName: extraction.firstName ?? undefined,
            lastName: extraction.lastName ?? undefined,
            jobTitle: extraction.jobTitle ?? undefined,
            email: extraction.email ?? undefined,
            phone: extraction.phone ?? undefined,
            city: extraction.city ?? undefined,
            country: extraction.country ?? undefined,
            linkedin: extraction.linkedin ?? undefined,
            website: extraction.website ?? undefined,
            summary: extraction.summary ?? undefined,
            skills: extraction.skills ?? [],

            // Defaults for visual settings
            colorHex: "#000000",
            borderStyle: "squircle",
            layout: "single-column",
            templateName: "professional",
            fontSize: 10,
            fontFamily: "serif",

            // Compute from extracted data
            sectionOrder: buildSectionOrder(extraction),
            sectionVisibility: buildSectionVisibility(extraction),

            workExperiences: (extraction.workExperiences ?? []).map((exp, idx) => ({
                ...exp,
                visible: true,
                displayOrder: idx,
            })),
            educations: (extraction.educations ?? []).map((edu, idx) => ({
                ...edu,
                visible: true,
                displayOrder: idx,
            })),
            projects: (extraction.projects ?? []).map((p, idx) => ({
                ...p,
                visible: true,
                displayOrder: idx,
            })),
            awards: (extraction.awards ?? []).map((a, idx) => ({
                ...a,
                visible: true,
                displayOrder: idx,
            })),
            publications: (extraction.publications ?? []).map((p, idx) => ({
                ...p,
                visible: true,
                displayOrder: idx,
            })),
            certificates: (extraction.certificates ?? []).map((c, idx) => ({
                ...c,
                visible: true,
                displayOrder: idx,
            })),
            languages: (extraction.languages ?? []).map((l, idx) => ({
                ...l,
                visible: true,
                displayOrder: idx,
            })),
            courses: (extraction.courses ?? []).map((c, idx) => ({
                ...c,
                visible: true,
                displayOrder: idx,
            })),
            references: (extraction.references ?? []).map((r, idx) => ({
                ...r,
                visible: true,
                displayOrder: idx,
            })),
            interests: (extraction.interests ?? []).map((i, idx) => ({
                ...i,
                visible: true,
                displayOrder: idx,
            })),
        };

        // 6. Create resume in DB (without the redirect)
        const db = await getDb();
        const [resume] = await db
            .insert(resumes)
            .values({
                userId,
                title: resumeValues.title || "Imported Resume",
                firstName: resumeValues.firstName || null,
                lastName: resumeValues.lastName || null,
                jobTitle: resumeValues.jobTitle || null,
                email: resumeValues.email || null,
                phone: resumeValues.phone || null,
                city: resumeValues.city || null,
                country: resumeValues.country || null,
                linkedin: resumeValues.linkedin || null,
                website: resumeValues.website || null,
                summary: resumeValues.summary || null,
                colorHex: resumeValues.colorHex || "#000000",
                borderStyle: resumeValues.borderStyle || "squircle",
                layout: resumeValues.layout || "single-column",
                templateName: resumeValues.templateName || "professional",
                skills: resumeValues.skills ?? [],
                sectionOrder: resumeValues.sectionOrder ?? [],
                sectionVisibility: resumeValues.sectionVisibility ?? {},
                fieldVisibility: resumeValues.fieldVisibility ?? {},
                fontSize: resumeValues.fontSize ?? 10,
                fontFamily: resumeValues.fontFamily ?? "serif",
            })
            .returning();

        const resumeId = resume.id;

        // 7. Insert related rows
        if (resumeValues.workExperiences?.length) {
            await db.insert(workExperiences).values(
                resumeValues.workExperiences.map((exp, idx) => ({
                    resumeId,
                    position: exp.position || null,
                    company: exp.company || null,
                    startDate: exp.startDate ? new Date(exp.startDate) : null,
                    endDate: exp.endDate ? new Date(exp.endDate) : null,
                    description: exp.description || null,
                    location: exp.location || null,
                    subheading: exp.subheading || null,
                    visible: exp.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.educations?.length) {
            await db.insert(educations).values(
                resumeValues.educations.map((edu, idx) => ({
                    resumeId,
                    degree: edu.degree || null,
                    school: edu.school || null,
                    fieldOfStudy: edu.fieldOfStudy || null,
                    gpa: edu.gpa || null,
                    description: edu.description || null,
                    location: edu.location || null,
                    startDate: edu.startDate ? new Date(edu.startDate) : null,
                    endDate: edu.endDate ? new Date(edu.endDate) : null,
                    visible: edu.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.projects?.length) {
            await db.insert(projects).values(
                resumeValues.projects.map((p, idx) => ({
                    resumeId,
                    title: p.title || null,
                    subtitle: p.subtitle || null,
                    description: p.description || null,
                    link: p.link || null,
                    startDate: p.startDate ? new Date(p.startDate) : null,
                    endDate: p.endDate ? new Date(p.endDate) : null,
                    visible: p.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.awards?.length) {
            await db.insert(awards).values(
                resumeValues.awards.map((a, idx) => ({
                    resumeId,
                    title: a.title || null,
                    issuer: a.issuer || null,
                    description: a.description || null,
                    date: a.date ? new Date(a.date) : null,
                    visible: a.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.publications?.length) {
            await db.insert(publications).values(
                resumeValues.publications.map((p, idx) => ({
                    resumeId,
                    title: p.title || null,
                    publisher: p.publisher || null,
                    authors: p.authors || null,
                    description: p.description || null,
                    date: p.date ? new Date(p.date) : null,
                    link: p.link || null,
                    visible: p.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.certificates?.length) {
            await db.insert(certificates).values(
                resumeValues.certificates.map((c, idx) => ({
                    resumeId,
                    title: c.title || null,
                    issuer: c.issuer || null,
                    description: c.description || null,
                    date: c.date ? new Date(c.date) : null,
                    link: c.link || null,
                    credentialId: c.credentialId || null,
                    visible: c.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.languages?.length) {
            await db.insert(languages).values(
                resumeValues.languages.map((l, idx) => ({
                    resumeId,
                    language: l.language || null,
                    proficiency: l.proficiency || null,
                    visible: l.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.courses?.length) {
            await db.insert(courses).values(
                resumeValues.courses.map((c, idx) => ({
                    resumeId,
                    name: c.name || null,
                    institution: c.institution || null,
                    description: c.description || null,
                    date: c.date ? new Date(c.date) : null,
                    visible: c.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.references?.length) {
            await db.insert(resumeReferences).values(
                resumeValues.references.map((r, idx) => ({
                    resumeId,
                    name: r.name || null,
                    position: r.position || null,
                    company: r.company || null,
                    email: r.email || null,
                    phone: r.phone || null,
                    visible: r.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        if (resumeValues.interests?.length) {
            await db.insert(interests).values(
                resumeValues.interests.map((i, idx) => ({
                    resumeId,
                    name: i.name || null,
                    visible: i.visible ?? true,
                    displayOrder: idx,
                })),
            );
        }

        return { success: true, resumeId };
    } catch (err) {
        console.error("[recreateResumeFromPdf] error:", err);
        if (NoObjectGeneratedError.isInstance(err)) {
            return {
                success: false,
                error: "AI could not parse this resume. The PDF may be image-based or in an unsupported format.",
            };
        }
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : "Failed to recreate resume. Please try again.",
        };
    }
}

// ---------------------------------------------------------------------------
// Analyze an uploaded PDF resume via AI
// ---------------------------------------------------------------------------
export async function analyzeResumePdf(
    fileId: string,
    forceRefresh: boolean = false,
): Promise<{ success: boolean; analysis?: AiResumeAnalysis; error?: string }> {
    try {
        const session = await requireSession();
        const userId = session.user.id;

        // 1. Check cache (skip if forceRefresh)
        if (!forceRefresh) {
            const cached = await getCachedAiResult(fileId, "analysis");
            if (cached) {
                return { success: true, analysis: cached as AiResumeAnalysis };
            }
        }

        // 2. Check AI usage limit
        const usageCheck = await checkAiUsageLimit(userId);
        if (!usageCheck.allowed) {
            return {
                success: false,
                error: `AI usage limit reached (${usageCheck.used.toLocaleString()} / ${usageCheck.limit.toLocaleString()} tokens this month). Upgrade to premium for unlimited access.`,
            };
        }

        // 2b. Check per-feature monthly limit
        const featureCheck = await checkFeatureLimit(userId, "analyze");
        if (!featureCheck.allowed) {
            return {
                success: false,
                error: `AI analyze limit reached (${featureCheck.used} / ${featureCheck.limit} this month). Upgrade for higher limits.`,
            };
        }

        // 3. Get a temporary presigned URL for the PDF
        const { dataUrl: pdfDataUrl, fileName } = await getPdfDataForAi(userId, fileId);

        // 4. Call Gemini for analysis via generateText + Output.object
        const model = await getAiModel();
        const { output, usage } = await generateText({
            model,
            output: Output.object({
                schema: aiResumeAnalysisSchema,
            }),
            system: `You are a world-class resume reviewer who combines the perspectives of three distinct experts:

1. **The Recruiter (6-Second Scan):** You evaluate first impressions. Can you identify the candidate's target role, experience level, and key qualifications within 6 seconds? Is the visual hierarchy effective? Does the resume pass the "squint test" — when you squint, can you still see clear section breaks and a logical flow?

2. **The Hiring Manager (Deep Read):** You evaluate substance. Are achievements specific, quantified, and relevant? Does the candidate demonstrate impact, not just activity? Can you understand what this person actually DID, not just what they were responsible for? Are there red flags like unexplained gaps, job-hopping without progression, or vague buzzwords without substance?

3. **The ATS Parser (Machine Read):** You evaluate technical compatibility. Will automated screening systems correctly parse every section? Are there formatting elements (tables, columns, text boxes, headers/footers, images) that would cause parsing failures? Are standard section headers used? Would keyword matching work effectively against common job descriptions in this field?

## Scoring Philosophy

Your scores must be honest, calibrated, and defensible:

- **0-20:** Fundamentally broken — Missing critical sections, incoherent structure, or appears to be a non-resume document. Almost never given.
- **21-40:** Significantly below standard — Major gaps (no work experience section, no contact info), severely poor formatting, or content that would immediately disqualify in most applications.
- **41-55:** Below average — Functional but with substantial issues. Common for first-draft resumes: duty-based descriptions without achievements, inconsistent formatting, missing quantification.
- **56-70:** Average — Meets basic standards but lacks polish. Has some quantified achievements but inconsistent. Formatting is decent but not optimized. This is where most resumes land.
- **71-82:** Good — Well-structured, mostly quantified achievements, clean formatting, clear career narrative. Minor improvements possible but wouldn't embarrass the candidate.
- **83-92:** Excellent — Strong achievements with clear metrics, polished formatting, compelling narrative, optimized for ATS. Ready for top-tier applications with perhaps 1-2 small tweaks.
- **93-100:** Near-perfect — Reserve this for resumes that are genuinely exceptional. This means every bullet point has quantified impact, the career story is compelling and cohesive, formatting is immaculate, and you'd struggle to find meaningful improvements. Extremely rare.

**Calibration anchor:** A typical software engineer resume with 3 years of experience, decent formatting, a mix of quantified and non-quantified bullets, and standard section headers should score around 55-65. Adjust from there.

## Feedback Quality Standards

Your feedback must be:

- **Specific, not generic.** BAD: "Add more metrics." GOOD: "Your second bullet at TechCo says 'improved system performance' — quantify this: by what percentage? measured how? what was the baseline?"
- **Actionable, not observational.** BAD: "The skills section could be better." GOOD: "Group your 18 skills into 3-4 categories (Languages, Frameworks, Tools, Cloud) to improve scannability. Consider removing 'Microsoft Office' — it's assumed for professional roles and uses valuable space."
- **Prioritized.** Distinguish between critical issues that would hurt the candidate's chances vs. nice-to-have polish improvements.
- **Context-aware.** A fresh graduate's resume should be evaluated differently than a staff engineer's. Don't penalize a student for lacking 10 years of experience. Don't penalize a senior executive for having a 2-page resume.

## What to Look For (Deep Analysis Lenses)

### Content Quality
- Are bullet points achievement-oriented ("Increased revenue by 30%") vs. duty-oriented ("Responsible for managing revenue")?
- Does the candidate use the PAR/STAR format (Problem → Action → Result)?
- Are there specific metrics, numbers, dollar amounts, percentages, team sizes?
- Is there evidence of career progression (growing responsibilities, promotions)?
- Do descriptions use strong action verbs ("Architected", "Spearheaded", "Optimized") vs. weak ones ("Helped", "Assisted", "Worked on")?

### Professional Narrative
- Does the summary/objective clearly state what the candidate does and what value they bring?
- Is there a coherent career story — can you see the thread connecting their experiences?
- Are there career gaps? If so, are they explained?
- Does the resume show job-hopping (multiple roles under 1 year)? Is there a pattern of growth despite job changes?

### Formatting & Design
- Is there a clear visual hierarchy (name → role → sections)?
- Is whitespace used effectively or is the resume either too cramped or too sparse?
- Is typography consistent (same font sizes for same-level headings, consistent date formats)?
- Are margins reasonable (0.5-1 inch)?
- Is the resume an appropriate length for the candidate's experience level? (1 page for <5 years, 2 pages acceptable for >5 years)
- Are there orphan lines or awkward page breaks?

### ATS Compatibility
- Is the file a text-based PDF (not a scanned image)?
- Are section headers standard ("Work Experience" not "Where I've Made My Mark")?
- Is contact info in the document body (not in the header/footer, which many ATS systems skip)?
- Are there fancy design elements (tables, multi-column layouts, icons, charts) that could confuse parsers?
- Does it avoid text boxes, which are often ignored by ATS?

### Red Flags to Call Out
- Unexplained gaps > 6 months
- Inconsistencies (dates overlapping, title inflation)
- Overuse of buzzwords without substance ("synergy", "leverage", "paradigm shift")
- Wall-of-text descriptions vs. crisp bullets
- Missing contact information
- Unprofessional email addresses
- Including irrelevant personal information (age, photo, marital status — depends on region)`,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "file",
                            data: pdfDataUrl,
                            mediaType: "application/pdf",
                        },
                        {
                            type: "text",
                            text: `Perform a comprehensive, no-holds-barred analysis of this resume ("${fileName}").

For each section that exists in the resume, provide:
1. A score from 0-100 (calibrated to the scoring guidelines)
2. What's working well (specific strengths with examples from the resume)
3. What needs improvement (specific, actionable suggestions — not vague platitudes)

Required evaluation sections:
- **Summary / Objective** — Value proposition clarity, tailoring, and hook strength
- **Work Experience** — Achievement quantification, action verb strength, impact demonstration, PAR/STAR format usage
- **Education** — Completeness, relevance, proper formatting
- **Skills** — Relevance, organization, technical vs. soft skill balance, keyword optimization
- **Projects** — Impact clarity, technology stack, outcomes
- **Formatting & Layout** — Visual hierarchy, consistency, whitespace, typography, page length appropriateness
- **Overall Impact** — Career narrative coherence, differentiation, and "Would I interview this person?" gut check

Then evaluate ATS compatibility separately:
- Identify specific elements that would cause parsing failures
- Check for standard vs. creative section headers
- Evaluate keyword density for the candidate's apparent target role

Finally provide:
- **Top strengths:** 3-5 specific things this resume does well (cite actual content)
- **Critical improvements:** 3-5 highest-impact changes ranked by importance (most impactful first)
- **Overall summary:** 2-3 sentences capturing your honest assessment — imagine you're giving this feedback face-to-face to the candidate`,
                        },
                    ],
                },
            ],
            maxRetries: 2,
        });

        if (!output) {
            return {
                success: false,
                error: "AI could not generate an analysis for this resume. Please try again.",
            };
        }

        const analysis = output;

        // 5. Log token usage (non-blocking — never crash the flow if logging fails)
        try {
            await logAiUsage(userId, usage, "analyze");
        } catch (logErr) {
            console.error("[analyzeResumePdf] Failed to log AI usage:", logErr);
        }

        // 6. Cache the result (delete old cache first on forceRefresh)
        if (forceRefresh) {
            const db = await getDb();
            await db
                .delete(aiResults)
                .where(
                    and(
                        eq(aiResults.userFileId, fileId),
                        eq(aiResults.resultType, "analysis"),
                    ),
                );
        }

        await saveCachedAiResult(
            userId,
            fileId,
            "analysis",
            analysis,
            MODEL_ID,
        );

        return { success: true, analysis };
    } catch (err) {
        console.error("[analyzeResumePdf] error:", err);
        if (NoObjectGeneratedError.isInstance(err)) {
            return {
                success: false,
                error: "AI could not parse this resume for analysis. The PDF may be image-based or in an unsupported format.",
            };
        }
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : "Failed to analyze resume. Please try again.",
        };
    }
}

// ---------------------------------------------------------------------------
// Generate a neobrutalist portfolio webpage from resume data via Gemini 3.1 Pro
// ---------------------------------------------------------------------------

export async function generatePortfolioFromResume(
    resumeId: string,
): Promise<{ success: boolean; html?: string; error?: string }> {
    try {
        const session = await requireSession();
        const userId = session.user.id;
        const db = await getDb();

        // 1. Check AI usage limit
        const usageCheck = await checkAiUsageLimit(userId);
        if (!usageCheck.allowed) {
            return {
                success: false,
                error: `AI usage limit reached (${usageCheck.used.toLocaleString()} / ${usageCheck.limit.toLocaleString()} tokens this month). Upgrade to premium for unlimited access.`,
            };
        }

        // 2. Auth + ownership check — load full resume with all relations
        const resume = await db.query.resumes.findFirst({
            where: and(
                eq(resumes.id, resumeId),
                eq(resumes.userId, userId),
            ),
            with: {
                workExperiences: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                educations: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                projects: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                awards: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                publications: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                certificates: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                languages: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                courses: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                resumeReferences: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
                interests: { orderBy: (t, { asc }) => [asc(t.displayOrder)] },
            },
        });

        if (!resume) {
            return { success: false, error: "Resume not found" };
        }



        // 3. Serialize resume data into a clean JSON context string
        const resumeContext = JSON.stringify(
            {
                name: [resume.firstName, resume.lastName].filter(Boolean).join(" "),
                jobTitle: resume.jobTitle,
                email: resume.email,
                phone: resume.phone,
                city: resume.city,
                country: resume.country,
                linkedin: resume.linkedin,
                website: resume.website,
                summary: resume.summary,
                skills: resume.skills ?? [],
                workExperiences: (resume.workExperiences ?? []).map((e) => ({
                    position: e.position,
                    company: e.company,
                    location: e.location,
                    startDate: e.startDate,
                    endDate: e.endDate,
                    description: e.description,
                })),
                educations: (resume.educations ?? []).map((e) => ({
                    degree: e.degree,
                    fieldOfStudy: e.fieldOfStudy,
                    school: e.school,
                    location: e.location,
                    startDate: e.startDate,
                    endDate: e.endDate,
                    gpa: e.gpa,
                    description: e.description,
                })),
                projects: (resume.projects ?? []).map((p) => ({
                    title: p.title,
                    subtitle: p.subtitle,
                    description: p.description,
                    link: p.link,
                    startDate: p.startDate,
                    endDate: p.endDate,
                })),
                certificates: (resume.certificates ?? []).map((c) => ({
                    title: c.title,
                    issuer: c.issuer,
                    date: c.date,
                    link: c.link,
                    credentialId: c.credentialId,
                    description: c.description,
                })),
                awards: (resume.awards ?? []).map((a) => ({
                    title: a.title,
                    issuer: a.issuer,
                    date: a.date,
                    description: a.description,
                })),
                publications: (resume.publications ?? []).map((p) => ({
                    title: p.title,
                    publisher: p.publisher,
                    authors: p.authors,
                    description: p.description,
                    date: p.date,
                    link: p.link,
                })),
                courses: (resume.courses ?? []).map((c) => ({
                    name: c.name,
                    institution: c.institution,
                    description: c.description,
                    date: c.date,
                })),
                references: (resume.resumeReferences ?? []).map((r) => ({
                    name: r.name,
                    position: r.position,
                    company: r.company,
                    email: r.email,
                    phone: r.phone,
                })),
                languages: (resume.languages ?? []).map((l) => ({
                    language: l.language,
                    proficiency: l.proficiency,
                })),
                interests: (resume.interests ?? []).map((i) => i.name),
            },
            null,
            2,
        );

        // 4. Build the prompt — meticulous system prompt + resume data as context
        const systemPrompt = `You are a world-class frontend developer and creative designer specializing in NEOBRUTALIST web design. Your mission is to generate a single, self-contained, production-quality HTML portfolio page from provided resume data.

## Design Philosophy — Neobrutalism

Neobrutalism is a design trend that embraces rawness, boldness, and visible structure. It is the antithesis of polished minimalism. Apply these principles aggressively:

### Visual Identity
- **Thick black borders**: 3px–5px solid black on nearly every element. Cards, buttons, sections, images — all get chunky borders.
- **Hard box-shadows**: Use offset solid shadows (e.g. \`shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]\` or \`shadow-[8px_8px_0px_0px_#000]\`). NO soft/blurred shadows — this is neobrutalism, not material design.
- **Raw, loud colors**: Use a vibrant palette — hot pink (#FF6B9D), electric yellow (#FFE66D), lime green (#A8E6CF), sky blue (#88D8F3), coral (#FF8A5C), lavender (#C3B1E1). Backgrounds should be bold solid colors, NOT white/gray.
- **High contrast**: Black text on bright backgrounds. White text on dark accent blocks.
- **Visible grid structure**: Sections should look like intentionally placed blocks/cards on a page, not smooth flowing content.
- **Playful asymmetry**: Slight rotations on cards (\`rotate-1\`, \`-rotate-2\`), offset elements, sticker-like badges.
- **Monospace + display fonts**: Use Google Fonts like \`Space Mono\`, \`DM Mono\`, or \`JetBrains Mono\` for body text, and \`Space Grotesk\`, \`Outfit\`, or \`Unbounded\` for headings.
- **Sticker/badge elements**: Use rounded-full pill badges for skills, tags, and labels with thick borders and bright backgrounds.

### Layout
- **Bento grid**: Use CSS Grid or Tailwind grid utilities to create a bento-box layout for the main content area (experience, projects, skills arranged in a grid of unequal cards).
- **Full-bleed hero section**: The hero/header should be bold, take up at least 80vh, with the person's name in massive typography (\`text-6xl\` to \`text-9xl\`), job title as a chunky badge, and a brief summary.
- **Section dividers**: Use thick horizontal rules, zigzag patterns, or colored blocks between sections — NOT subtle lines.
- **Sticky navigation**: A top nav bar with thick border-bottom and bold section links. Smooth-scroll to sections on click.
- **Footer**: Include contact info, social links, and a fun "Built with ☕ and code" or similar personal touch.

### Animations & Interactions
- Load GSAP from CDN: \`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js\` and ScrollTrigger: \`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js\`
- **Scroll-triggered reveals**: Each section/card should animate in (fade-up, slide-in, scale-up) as the user scrolls.
- **Staggered animations**: When multiple cards are in view, stagger their entrance (\`stagger: 0.1\`).
- **Hover effects on cards**: Cards should \`translate\` on hover (e.g. \`hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000]\`), shifting their shadow to create a "lifting" effect.
- **Marquee**: Add a horizontal scrolling marquee of skills/tech as a fun divider between sections.
- **Smooth scroll**: \`html { scroll-behavior: smooth; }\`.
- **Typing/scramble effect on name** (optional but impressive): Quickly scramble letters of the name on page load before resolving.

### Responsiveness
- Mobile-first: single-column stack on mobile, bento grid on \`md:\` and up.
- Hero text sizes scale down gracefully (\`text-4xl md:text-6xl lg:text-8xl\`).
- Cards should be full-width on mobile, grid on desktop.
- Navigation collapses to a hamburger on mobile.

## Content Mapping Rules

Map resume JSON fields to portfolio sections as follows. ONLY include sections that have data (non-empty arrays, non-null fields). Skip sections entirely if there's no data for them:

| Resume Field | Portfolio Section | Rendering Notes |
|---|---|---|
| name, jobTitle, summary | **Hero Section** | Name in massive type, job title as badge, summary as subtitle |
| email, phone, city, country, linkedin, website | **Contact / Footer** | Render as clickable links where applicable (mailto:, tel:, https://) |
| skills | **Skills Section** | Render as a grid of pill/sticker badges with bright random accent colors |
| workExperiences | **Experience Section** | Cards with company, role, dates, description. Use a timeline or card grid |
| educations | **Education Section** | Cards with school, degree, field, dates, GPA if present |
| projects | **Projects Section** | Prominent cards with title, description, and link (if available) as a button |
| certificates | **Certifications Section** | Compact cards or list items |
| awards | **Awards Section** | Highlight cards |
| publications | **Publications Section** | List with links |
| courses | **Courses Section** | Compact list or tag cloud |
| languages | **Languages Section** | Badges with proficiency levels |
| interests | **Interests Section** | Fun sticker/tag cloud |
| references | **References Section** | Simple contact cards |

## Technical Requirements

1. Output ONLY a single complete HTML file: \`<!DOCTYPE html>\` through \`</html>\`. No markdown fences, no explanations, no preamble.
2. Load Tailwind CSS from CDN: \`<script src="https://cdn.tailwindcss.com"></script>\`
3. Configure Tailwind inline with a \`<script>\` block to extend the theme with custom colors and fonts.
4. Load Google Fonts via \`<link>\` tag.
5. All JS at the bottom of \`<body>\` — GSAP setup, ScrollTrigger, nav behavior, etc.
6. Use semantic HTML5 elements (\`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<footer>\`).
7. Every piece of text content MUST come from the resume data. Do NOT invent, paraphrase, or use placeholder/lorem ipsum text.
8. Include proper \`<title>\` and \`<meta>\` tags with the person's name and job title.
9. Make date formatting human-readable (e.g. "Jan 2023 — Present", not "2023-01-01").`;

        const userPrompt = `Make a neobrutalist webpage, make it extremely creative, as far as possible, push the limits. Add smooth scroll animations, add fancy colors and tailwind css styles. Make it responsive.

Here is the resume data to use:

\`\`\`json
${resumeContext}
\`\`\`

Remember: output ONLY the raw HTML file, nothing else. Every word of content must come from the resume data above.`;

        // 5. Call Gemini 3.1 Pro via AI Gateway
        const model = await getAiModel();
        const { text, usage } = await generateText({
            model,
            system: systemPrompt,
            prompt: userPrompt,
            maxOutputTokens: 32000,
            maxRetries: 1,
        });

        // 7. Extract clean HTML (strip any accidental markdown code fences)
        let html = text.trim();
        // Remove ```html ... ``` or ``` ... ``` wrappers if model added them
        html = html.replace(/^```(?:html)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

        if (!html.toLowerCase().includes("<!doctype html") && !html.toLowerCase().startsWith("<html")) {
            return {
                success: false,
                error: "AI did not return a valid HTML page. Please try again.",
            };
        }

        // 8. Log usage ONLY after confirming valid result (non-blocking)
        try {
            await logAiUsage(userId, usage, "portfolio");
        } catch (logErr) {
            console.error("[generatePortfolioFromResume] Failed to log AI usage:", logErr);
        }

        return { success: true, html };
    } catch (err) {
        console.error("[generatePortfolioFromResume] error:", err);
        return {
            success: false,
            error:
                err instanceof Error
                    ? err.message
                    : "Failed to generate portfolio. Please try again.",
        };
    }
}

// ---------------------------------------------------------------------------
// Cover Letter Actions
// ---------------------------------------------------------------------------

export async function getResumeForCoverLetter(resumeId: string) {
    const session = await requireSession();
    const db = await getDb();

    const resume = await db.query.resumes.findFirst({
        where: and(
            eq(resumes.id, resumeId),
            eq(resumes.userId, session.user.id),
        ),
        with: {
            workExperiences: true,
            educations: true,
            projects: true,
        },
    });

    if (!resume) return null;

    return {
        firstName: resume.firstName,
        lastName: resume.lastName,
        jobTitle: resume.jobTitle,
        email: resume.email,
        phone: resume.phone,
        city: resume.city,
        country: resume.country,
        summary: resume.summary,
        skills: resume.skills,
        workExperiences: resume.workExperiences.map((w) => ({
            position: w.position,
            company: w.company,
            description: w.description,
            location: w.location,
            startDate: w.startDate,
            endDate: w.endDate,
        })),
        educations: resume.educations.map((e) => ({
            degree: e.degree,
            school: e.school,
            fieldOfStudy: e.fieldOfStudy,
            description: e.description,
        })),
        projects: resume.projects.map((p) => ({
            title: p.title,
            description: p.description,
        })),
    };
}

export async function createCoverLetter(resumeId?: string) {
    const session = await requireSession();
    const db = await getDb();

    const [coverLetter] = await db
        .insert(coverLetters)
        .values({
            userId: session.user.id,
            resumeId: resumeId || null,
            title: "Untitled Cover Letter",
        })
        .returning();

    redirect(`/dashboard/cover-letters/${coverLetter.id}`);
}

export async function saveCoverLetter(values: CoverLetterValues) {
    const session = await requireSession();

    const parsed = coverLetterSchema.safeParse(values);
    if (!parsed.success) {
        return { error: "Invalid cover letter data." };
    }

    const { id, ...data } = parsed.data;
    if (!id) return { error: "Cover letter ID is required." };

    const db = await getDb();

    // Verify ownership
    const existing = await db.query.coverLetters.findFirst({
        where: and(
            eq(coverLetters.id, id),
            eq(coverLetters.userId, session.user.id),
        ),
        columns: { id: true },
    });

    if (!existing) {
        return { error: "Cover letter not found." };
    }

    await db
        .update(coverLetters)
        .set({
            ...data,
            updatedAt: new Date(),
        })
        .where(and(eq(coverLetters.id, id), eq(coverLetters.userId, session.user.id)));

    return { success: true };
}

export async function deleteCoverLetter(coverLetterId: string) {
    const session = await requireSession();
    const db = await getDb();

    // Verify ownership
    const existing = await db.query.coverLetters.findFirst({
        where: and(
            eq(coverLetters.id, coverLetterId),
            eq(coverLetters.userId, session.user.id),
        ),
        columns: { id: true },
    });

    if (!existing) {
        return { error: "Cover letter not found." };
    }

    await db.delete(coverLetters).where(and(eq(coverLetters.id, coverLetterId), eq(coverLetters.userId, session.user.id)));

    revalidatePath("/dashboard/cover-letters");
}

// ---------------------------------------------------------------------------
// Referral tracking
// ---------------------------------------------------------------------------
export async function recordReferralAction(referralCode: string): Promise<boolean> {
    const session = await requireSession();
    const { recordReferral } = await import("@/lib/referrals");
    return recordReferral(referralCode, session.user.id);
}
