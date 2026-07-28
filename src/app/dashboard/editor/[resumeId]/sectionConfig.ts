import {
    User,
    FileText,
    GraduationCap,
    Wrench,
    Briefcase,
    FolderOpen,
    Award,
    BookOpen,
    ShieldCheck,
    Languages,
    BookMarked,
    Users,
    Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SectionMeta {
    key: string;
    title: string;
    icon: LucideIcon;
    isOptional: boolean;
    description: string;
}

export const ALL_SECTIONS: SectionMeta[] = [
    {
        key: "personal-info",
        title: "Personal Info",
        icon: User,
        isOptional: false,
        description: "Name, contact details, and links",
    },
    {
        key: "profile",
        title: "Profile Summary",
        icon: FileText,
        isOptional: false,
        description: "A brief professional summary",
    },
    {
        key: "education",
        title: "Education",
        icon: GraduationCap,
        isOptional: false,
        description: "Your academic background",
    },
    {
        key: "skills",
        title: "Skills",
        icon: Wrench,
        isOptional: false,
        description: "Technical and soft skills",
    },
    {
        key: "experience",
        title: "Professional Experience",
        icon: Briefcase,
        isOptional: false,
        description: "Your work history",
    },
    {
        key: "projects",
        title: "Personal Projects",
        icon: FolderOpen,
        isOptional: false,
        description: "Side projects and portfolio work",
    },
    {
        key: "awards",
        title: "Awards",
        icon: Award,
        isOptional: false,
        description: "Honors and recognitions",
    },
    {
        key: "publications",
        title: "Publications",
        icon: BookOpen,
        isOptional: false,
        description: "Published papers and articles",
    },
    {
        key: "certificates",
        title: "Certificates",
        icon: ShieldCheck,
        isOptional: false,
        description: "Professional certifications",
    },
    // Optional sections (added via "Add Content" modal)
    {
        key: "languages",
        title: "Languages",
        icon: Languages,
        isOptional: true,
        description: "Languages you speak",
    },
    {
        key: "courses",
        title: "Courses",
        icon: BookMarked,
        isOptional: true,
        description: "Relevant courses and training",
    },
    {
        key: "references",
        title: "References",
        icon: Users,
        isOptional: true,
        description: "Professional references",
    },
    {
        key: "interests",
        title: "Interests",
        icon: Heart,
        isOptional: true,
        description: "Hobbies and interests",
    },
];

export const CORE_SECTIONS = ALL_SECTIONS.filter((s) => !s.isOptional);
export const OPTIONAL_SECTIONS = ALL_SECTIONS.filter((s) => s.isOptional);

export const DEFAULT_SECTION_ORDER = CORE_SECTIONS.map((s) => s.key);

export function getSectionMeta(key: string): SectionMeta | undefined {
    return ALL_SECTIONS.find((s) => s.key === key);
}
