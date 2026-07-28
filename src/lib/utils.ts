import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ResumeServerData } from "./types";
import type { ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/** Convert a DB timestamp (Date | null) to a YYYY-MM-DD string or undefined. */
function tsToDateStr(ts: Date | null): string | undefined {
    return ts ? ts.toISOString().split("T")[0] : undefined;
}

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
    return {
        id: data.id,
        title: data.title ?? undefined,
        description: data.description ?? undefined,
        photoUrl: data.photoUrl ?? undefined,
        colorHex: data.colorHex,
        borderStyle: data.borderStyle,
        layout: (data.layout as ResumeValues["layout"]) ?? undefined,
        templateName: (data.templateName as ResumeValues["templateName"]) ?? undefined,
        summary: data.summary ?? undefined,
        firstName: data.firstName ?? undefined,
        lastName: data.lastName ?? undefined,
        jobTitle: data.jobTitle ?? undefined,
        city: data.city ?? undefined,
        country: data.country ?? undefined,
        phone: data.phone ?? undefined,
        email: data.email ?? undefined,
        linkedin: data.linkedin ?? undefined,
        website: data.website ?? undefined,
        skills: data.skills ?? undefined,

        // Preview settings
        fontSize: data.fontSize,
        fontFamily: data.fontFamily,

        // Editor config
        sectionOrder: data.sectionOrder ?? undefined,
        sectionVisibility: data.sectionVisibility ?? undefined,
        fieldVisibility: data.fieldVisibility ?? undefined,

        // Relations
        workExperiences: data.workExperiences.map((exp) => ({
            id: exp.id,
            position: exp.position ?? undefined,
            company: exp.company ?? undefined,
            startDate: tsToDateStr(exp.startDate),
            endDate: tsToDateStr(exp.endDate),
            description: exp.description ?? undefined,
            location: exp.location ?? undefined,
            subheading: exp.subheading ?? undefined,
            visible: exp.visible,
            displayOrder: exp.displayOrder,
        })),
        educations: data.educations.map((edu) => ({
            id: edu.id,
            degree: edu.degree ?? undefined,
            school: edu.school ?? undefined,
            fieldOfStudy: edu.fieldOfStudy ?? undefined,
            gpa: edu.gpa ?? undefined,
            description: edu.description ?? undefined,
            location: edu.location ?? undefined,
            startDate: tsToDateStr(edu.startDate),
            endDate: tsToDateStr(edu.endDate),
            visible: edu.visible,
            displayOrder: edu.displayOrder,
        })),
        projects: data.projects.map((p) => ({
            id: p.id,
            title: p.title ?? undefined,
            subtitle: p.subtitle ?? undefined,
            description: p.description ?? undefined,
            link: p.link ?? undefined,
            startDate: tsToDateStr(p.startDate),
            endDate: tsToDateStr(p.endDate),
            visible: p.visible,
            displayOrder: p.displayOrder,
        })),
        awards: data.awards.map((a) => ({
            id: a.id,
            title: a.title ?? undefined,
            issuer: a.issuer ?? undefined,
            description: a.description ?? undefined,
            date: tsToDateStr(a.date),
            visible: a.visible,
            displayOrder: a.displayOrder,
        })),
        publications: data.publications.map((p) => ({
            id: p.id,
            title: p.title ?? undefined,
            publisher: p.publisher ?? undefined,
            authors: p.authors ?? undefined,
            description: p.description ?? undefined,
            date: tsToDateStr(p.date),
            link: p.link ?? undefined,
            visible: p.visible,
            displayOrder: p.displayOrder,
        })),
        certificates: data.certificates.map((c) => ({
            id: c.id,
            title: c.title ?? undefined,
            issuer: c.issuer ?? undefined,
            description: c.description ?? undefined,
            date: tsToDateStr(c.date),
            link: c.link ?? undefined,
            credentialId: c.credentialId ?? undefined,
            visible: c.visible,
            displayOrder: c.displayOrder,
        })),
        languages: data.languages.map((l) => ({
            id: l.id,
            language: l.language ?? undefined,
            proficiency: l.proficiency ?? undefined,
            visible: l.visible,
            displayOrder: l.displayOrder,
        })),
        courses: data.courses.map((c) => ({
            id: c.id,
            name: c.name ?? undefined,
            institution: c.institution ?? undefined,
            description: c.description ?? undefined,
            date: tsToDateStr(c.date),
            visible: c.visible,
            displayOrder: c.displayOrder,
        })),
        references: data.resumeReferences.map((r) => ({
            id: r.id,
            name: r.name ?? undefined,
            position: r.position ?? undefined,
            company: r.company ?? undefined,
            email: r.email ?? undefined,
            phone: r.phone ?? undefined,
            visible: r.visible,
            displayOrder: r.displayOrder,
        })),
        interests: data.interests.map((i) => ({
            id: i.id,
            name: i.name ?? undefined,
            visible: i.visible,
            displayOrder: i.displayOrder,
        })),
    };
}
