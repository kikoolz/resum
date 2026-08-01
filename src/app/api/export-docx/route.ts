import { NextResponse } from "next/server";
import { requireSession } from "@/lib/auth-server";
import { getDb } from "@/db";
import { resumes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { generateDocx } from "@/lib/docx-export";
import type { ResumeValues } from "@/lib/validation";

export async function POST(request: Request) {
    try {
        const session = await requireSession();
        const { resumeId } = await request.json();

        if (!resumeId) {
            return NextResponse.json({ error: "Resume ID required" }, { status: 400 });
        }

        const db = await getDb();

        const resume = await db.query.resumes.findFirst({
            where: and(eq(resumes.id, resumeId), eq(resumes.userId, session.user.id)),
            with: {
                workExperiences: true,
                educations: true,
                projects: true,
                awards: true,
                publications: true,
                certificates: true,
                languages: true,
                courses: true,
                resumeReferences: true,
                interests: true,
            },
        });

        if (!resume) {
            return NextResponse.json({ error: "Resume not found" }, { status: 404 });
        }

        const tsToDateStr = (d: Date | null | undefined): string | undefined =>
            d ? d.toISOString().split("T")[0] : undefined;

        const resumeData: ResumeValues = {
            id: resume.id,
            title: resume.title ?? undefined,
            firstName: resume.firstName ?? undefined,
            lastName: resume.lastName ?? undefined,
            jobTitle: resume.jobTitle ?? undefined,
            email: resume.email ?? undefined,
            phone: resume.phone ?? undefined,
            city: resume.city ?? undefined,
            country: resume.country ?? undefined,
            linkedin: resume.linkedin ?? undefined,
            website: resume.website ?? undefined,
            summary: resume.summary ?? undefined,
            skills: (resume.skills as string[] | null) ?? undefined,
            colorHex: resume.colorHex ?? undefined,
            fontSize: resume.fontSize ?? undefined,
            fontFamily: resume.fontFamily ?? undefined,
            sectionOrder: (resume.sectionOrder as string[] | null) ?? undefined,
            sectionVisibility: (resume.sectionVisibility as Record<string, boolean> | null) ?? undefined,
            fieldVisibility: (resume.fieldVisibility as Record<string, boolean> | null) ?? undefined,
            workExperiences: resume.workExperiences
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((w) => ({
                    id: w.id,
                    position: w.position ?? undefined,
                    company: w.company ?? undefined,
                    startDate: tsToDateStr(w.startDate),
                    endDate: tsToDateStr(w.endDate),
                    description: w.description ?? undefined,
                    location: w.location ?? undefined,
                    visible: w.visible ?? undefined,
                    displayOrder: w.displayOrder ?? undefined,
                })),
            educations: resume.educations
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((e) => ({
                    id: e.id,
                    degree: e.degree ?? undefined,
                    school: e.school ?? undefined,
                    fieldOfStudy: e.fieldOfStudy ?? undefined,
                    gpa: e.gpa ?? undefined,
                    startDate: tsToDateStr(e.startDate),
                    endDate: tsToDateStr(e.endDate),
                    description: e.description ?? undefined,
                    location: e.location ?? undefined,
                    visible: e.visible ?? undefined,
                    displayOrder: e.displayOrder ?? undefined,
                })),
            projects: resume.projects
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((p) => ({
                    id: p.id,
                    title: p.title ?? undefined,
                    subtitle: p.subtitle ?? undefined,
                    description: p.description ?? undefined,
                    link: p.link ?? undefined,
                    startDate: tsToDateStr(p.startDate),
                    endDate: tsToDateStr(p.endDate),
                    visible: p.visible ?? undefined,
                    displayOrder: p.displayOrder ?? undefined,
                })),
            awards: resume.awards
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((a) => ({
                    id: a.id,
                    title: a.title ?? undefined,
                    issuer: a.issuer ?? undefined,
                    description: a.description ?? undefined,
                    date: tsToDateStr(a.date),
                    visible: a.visible ?? undefined,
                    displayOrder: a.displayOrder ?? undefined,
                })),
            publications: resume.publications
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((p) => ({
                    id: p.id,
                    title: p.title ?? undefined,
                    publisher: p.publisher ?? undefined,
                    authors: p.authors ?? undefined,
                    description: p.description ?? undefined,
                    date: tsToDateStr(p.date),
                    link: p.link ?? undefined,
                    visible: p.visible ?? undefined,
                    displayOrder: p.displayOrder ?? undefined,
                })),
            certificates: resume.certificates
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((c) => ({
                    id: c.id,
                    title: c.title ?? undefined,
                    issuer: c.issuer ?? undefined,
                    description: c.description ?? undefined,
                    date: tsToDateStr(c.date),
                    link: c.link ?? undefined,
                    credentialId: c.credentialId ?? undefined,
                    visible: c.visible ?? undefined,
                    displayOrder: c.displayOrder ?? undefined,
                })),
            languages: resume.languages
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((l) => ({
                    id: l.id,
                    language: l.language ?? undefined,
                    proficiency: l.proficiency ?? undefined,
                    visible: l.visible ?? undefined,
                    displayOrder: l.displayOrder ?? undefined,
                })),
            courses: resume.courses
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((c) => ({
                    id: c.id,
                    name: c.name ?? undefined,
                    institution: c.institution ?? undefined,
                    description: c.description ?? undefined,
                    date: tsToDateStr(c.date),
                    visible: c.visible ?? undefined,
                    displayOrder: c.displayOrder ?? undefined,
                })),
            references: resume.resumeReferences
                .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                .map((r) => ({
                    id: r.id,
                    name: r.name ?? undefined,
                    position: r.position ?? undefined,
                    company: r.company ?? undefined,
                    email: r.email ?? undefined,
                    phone: r.phone ?? undefined,
                    visible: r.visible ?? undefined,
                    displayOrder: r.displayOrder ?? undefined,
                })),
            interests: resume.interests.map((i) => ({
                id: i.id,
                name: i.name ?? undefined,
                visible: i.visible ?? undefined,
            })),
        };

        const docxBytes = await generateDocx(resumeData);

        const fileName = `${(resumeData.firstName || "resume").replace(/\s+/g, "_")}_${(resumeData.lastName || "").replace(/\s+/g, "_")}_resume.docx`.replace(/^_/, "");

        return new NextResponse(new Uint8Array(docxBytes), {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        });
    } catch (err) {
        console.error("[export-docx] error:", err);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
