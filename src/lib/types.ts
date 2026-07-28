import type { Dispatch, SetStateAction } from "react";
import type {
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
} from "@/db/schema";
import type { ResumeValues } from "@/lib/validation";

export type Resume = typeof resumes.$inferSelect;
export type WorkExperience = typeof workExperiences.$inferSelect;
export type Education = typeof educations.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Award = typeof awards.$inferSelect;
export type Publication = typeof publications.$inferSelect;
export type Certificate = typeof certificates.$inferSelect;
export type Language = typeof languages.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type ResumeReference = typeof resumeReferences.$inferSelect;
export type Interest = typeof interests.$inferSelect;
export type UserFile = typeof userFiles.$inferSelect;

export interface ResumeServerData extends Resume {
    workExperiences: WorkExperience[];
    educations: Education[];
    projects: Project[];
    awards: Award[];
    publications: Publication[];
    certificates: Certificate[];
    languages: Language[];
    courses: Course[];
    resumeReferences: ResumeReference[];
    interests: Interest[];
}

export interface EditorFormProps {
    resumeData: ResumeValues;
    setResumeData: Dispatch<SetStateAction<ResumeValues>>;
}
