import { z } from "zod";

const optionalString = z.string().trim().max(200).optional();
const optionalUrl = z.string().trim().max(500).optional().or(z.literal(""));
const optionalDate = z.string().max(10).optional(); // YYYY-MM-DD

// ---------------------------------------------------------------------------
// Sub-schemas for related tables
// ---------------------------------------------------------------------------

const workExperienceSchema = z.object({
    id: z.string().optional(),
    position: optionalString,
    company: optionalString,
    startDate: optionalDate,
    endDate: optionalDate,
    description: z.string().trim().max(2000).optional(),
    location: optionalString,
    subheading: optionalString,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const educationSchema = z.object({
    id: z.string().optional(),
    degree: optionalString,
    school: optionalString,
    fieldOfStudy: optionalString,
    gpa: optionalString,
    description: z.string().trim().max(2000).optional(),
    location: optionalString,
    startDate: optionalDate,
    endDate: optionalDate,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const projectSchema = z.object({
    id: z.string().optional(),
    title: optionalString,
    subtitle: optionalString,
    description: z.string().trim().max(2000).optional(),
    link: optionalUrl,
    startDate: optionalDate,
    endDate: optionalDate,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const awardSchema = z.object({
    id: z.string().optional(),
    title: optionalString,
    issuer: optionalString,
    description: z.string().trim().max(2000).optional(),
    date: optionalDate,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const publicationSchema = z.object({
    id: z.string().optional(),
    title: optionalString,
    publisher: optionalString,
    authors: optionalString,
    description: z.string().trim().max(2000).optional(),
    date: optionalDate,
    link: optionalUrl,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const certificateSchema = z.object({
    id: z.string().optional(),
    title: optionalString,
    issuer: optionalString,
    description: z.string().trim().max(2000).optional(),
    date: optionalDate,
    link: optionalUrl,
    credentialId: optionalString,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const languageSchema = z.object({
    id: z.string().optional(),
    language: optionalString,
    proficiency: optionalString,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const courseSchema = z.object({
    id: z.string().optional(),
    name: optionalString,
    institution: optionalString,
    description: z.string().trim().max(2000).optional(),
    date: optionalDate,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const referenceSchema = z.object({
    id: z.string().optional(),
    name: optionalString,
    position: optionalString,
    company: optionalString,
    email: z.string().trim().max(200).optional().or(z.literal("")),
    phone: z.string().trim().max(30).optional(),
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

const interestSchema = z.object({
    id: z.string().optional(),
    name: optionalString,
    visible: z.boolean().optional().default(true),
    displayOrder: z.number().int().optional(),
});

// ---------------------------------------------------------------------------
// Main resume schema
// ---------------------------------------------------------------------------

export const resumeSchema = z.object({
    id: z.string().optional(),
    title: z.string().trim().max(200).optional(),
    description: z.string().trim().max(500).optional(),
    photoUrl: optionalUrl,
    colorHex: z
        .string()
        .max(9)
        .regex(/^#[0-9a-fA-F]{3,8}$/)
        .optional(),
    borderStyle: z.string().max(50).optional(),
    layout: z.enum(["single-column", "two-column", "split-date"]).optional(),
    templateName: z.enum(["professional", "creative", "modern", "simple", "europass", "executive", "blush", "fresh", "classic", "sleek", "profile", "euro-modern", "badge", "timeline", "minimal", "notion", "academy", "bold", "executive-pro", "classic-timeline"]).optional(),
    summary: z.string().trim().max(1000).optional(),
    firstName: optionalString,
    lastName: optionalString,
    jobTitle: optionalString,
    city: optionalString,
    country: optionalString,
    phone: z.string().trim().max(30).optional(),
    email: z.string().trim().max(200).optional().or(z.literal("")),
    linkedin: optionalUrl,
    website: optionalUrl,

    skills: z.array(z.string().trim().max(100)).max(50).optional(),

    // Preview settings
    fontSize: z.number().int().min(8).max(14).optional(),
    fontFamily: z.string().max(50).optional(),

    // Editor config
    sectionOrder: z.array(z.string().max(50)).max(30).optional(),
    sectionVisibility: z.record(z.string(), z.boolean()).optional(),
    fieldVisibility: z.record(z.string(), z.boolean()).optional(),

    // Related sections
    workExperiences: z.array(workExperienceSchema).max(20).optional(),
    educations: z.array(educationSchema).max(20).optional(),
    projects: z.array(projectSchema).max(20).optional(),
    awards: z.array(awardSchema).max(20).optional(),
    publications: z.array(publicationSchema).max(20).optional(),
    certificates: z.array(certificateSchema).max(20).optional(),
    languages: z.array(languageSchema).max(20).optional(),
    courses: z.array(courseSchema).max(20).optional(),
    references: z.array(referenceSchema).max(20).optional(),
    interests: z.array(interestSchema).max(50).optional(),
});

export type ResumeValues = z.infer<typeof resumeSchema>;
