"use client";

import type { ResumeValues } from "@/lib/validation";
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Globe,
    Briefcase,
    GraduationCap,
    Wrench,
    Code,
    Cpu,
    Languages,
} from "lucide-react";
import { DEFAULT_SECTION_ORDER } from "../sectionConfig";
import { richTextHtml } from "@/lib/rich-text";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isFieldVisible(fv: Record<string, boolean> | undefined, field: string): boolean {
    return fv?.[field] !== false;
}

function isSectionVisible(sv: Record<string, boolean> | undefined, key: string): boolean {
    return sv?.[key] !== false;
}

function fmtDate(d?: string): string {
    if (!d) return "";
    const date = new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${y}/${m}`;
}

function dateRange(start?: string, end?: string): string {
    const s = fmtDate(start);
    const e = end ? fmtDate(end) : "present";
    if (!s && e === "present") return "";
    return `${s || "?"} – ${e}`;
}

// ---------------------------------------------------------------------------
// Modern Template
// Photo + name header spanning top, two columns below.
// Left: Education, Skills (categorized), Languages.
// Right: Work Experience, Projects.
// Orange accent color.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

function SectionHeading({
    children,
    icon: Icon,
}: {
    children: React.ReactNode;
    icon?: React.ComponentType<{ className?: string }>;
}) {
    return (
        <div className="mb-2 mt-5 flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <h3 className="text-[13px] font-black uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                {children}
            </h3>
        </div>
    );
}

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;
    const showPhoto = isFieldVisible(fv, "photoUrl") && data.photoUrl;

    const contactItems: React.ReactNode[] = [];
    if (isFieldVisible(fv, "email") && data.email) {
        contactItems.push(
            <span key="email" className="inline-flex items-center gap-1 text-[10px]">
                <Mail className="h-3 w-3" /> {data.email}
            </span>,
        );
    }
    if (isFieldVisible(fv, "phone") && data.phone) {
        contactItems.push(
            <span key="phone" className="inline-flex items-center gap-1 text-[10px]">
                <Phone className="h-3 w-3" /> {data.phone}
            </span>,
        );
    }
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [isFieldVisible(fv, "city") ? data.city : null, isFieldVisible(fv, "country") ? data.country : null].filter(Boolean).join(", ");
        if (loc) {
            contactItems.push(
                <span key="loc" className="inline-flex items-center gap-1 text-[10px]">
                    <MapPin className="h-3 w-3" /> {loc}
                </span>,
            );
        }
    }
    if (isFieldVisible(fv, "linkedin") && data.linkedin) {
        contactItems.push(
            <span key="li" className="inline-flex items-center gap-1 text-[10px]">
                <Linkedin className="h-3 w-3" /> {data.linkedin}
            </span>,
        );
    }
    if (isFieldVisible(fv, "website") && data.website) {
        contactItems.push(
            <span key="web" className="inline-flex items-center gap-1 text-[10px]">
                <Globe className="h-3 w-3" /> {data.website}
            </span>,
        );
    }

    if (!fullName && !jobTitle && contactItems.length === 0) return null;

    return (
        <div className="mb-6 flex items-center gap-5 border-b-2 pb-4" style={{ borderColor: "var(--accent)" }}>
            {showPhoto && (
                <img
                    src={data.photoUrl}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-full object-cover"
                />
            )}
            <div className="flex-1">
                <h1 className="text-[26px] font-black leading-none tracking-tight" style={{ color: "var(--accent)" }}>
                    {fullName || "Your Name"}
                </h1>
                {jobTitle && (
                    <p className="mt-1 text-[14px] font-medium italic opacity-80">{jobTitle}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {contactItems}
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Left Column Blocks
// ---------------------------------------------------------------------------

function EducationBlock({ data }: { data: ResumeValues }) {
    const items = data.educations?.filter((e) => e.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading icon={GraduationCap}>Education</SectionHeading>
            <div className="space-y-3">
                {items.map((edu, i) => (
                    <div key={edu.id || i} style={{ breakInside: "avoid" }}>
                        <h4 className="text-[11px] font-bold">{edu.school || "School"}</h4>
                        <p className="text-[10.5px] italic opacity-80">
                            {edu.degree}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                        </p>
                        {dateRange(edu.startDate, edu.endDate) && (
                            <p className="text-[9.5px] opacity-60">{dateRange(edu.startDate, edu.endDate)}</p>
                        )}
                        {edu.description && (
                            <p className="mt-1 text-[10px] leading-[1.5] opacity-85 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(edu.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
    if (!data.skills || data.skills.length === 0) return null;

    // Categorize skills (heuristic: look for keywords)
    const langKeywords = ["javascript", "typescript", "java", "python", "html", "css", "c#", "ruby", "go", "swift", "kotlin", "php"];
    const frameworkKeywords = ["react", "next", "vue", "angular", "node", "express", "spring", "django", "flask", "tailwind", "bootstrap", "thymeleaf", "daisyui"];
    const conceptKeywords = ["oop", "object-oriented", "full-stack", "api", "rest", "graphql", "database", "sql", "nosql", "relational", "agile", "scrum", "devops", "ci/cd", "git", "docker", "aws", "linux"];
    const toolKeywords = ["adobe", "photoshop", "illustrator", "figma", "sketch", "indesign", "canva", "excel", "powerpoint", "word"];

    const programming: string[] = [];
    const frameworks: string[] = [];
    const concepts: string[] = [];
    const tools: string[] = [];
    const other: string[] = [];

    for (const skill of data.skills) {
        const lower = skill.toLowerCase();
        if (langKeywords.some((k) => lower.includes(k))) {
            programming.push(skill);
        } else if (frameworkKeywords.some((k) => lower.includes(k))) {
            frameworks.push(skill);
        } else if (conceptKeywords.some((k) => lower.includes(k))) {
            concepts.push(skill);
        } else if (toolKeywords.some((k) => lower.includes(k))) {
            tools.push(skill);
        } else {
            other.push(skill);
        }
    }

    const categories = [
        { label: "Programming Languages", items: programming, icon: Code },
        { label: "Frameworks & Libraries", items: frameworks, icon: Wrench },
        { label: "Core Concepts", items: concepts, icon: Cpu },
        { label: "Developer Tools", items: tools, icon: Wrench },
        { label: "Other Skills", items: other, icon: Wrench },
    ].filter((c) => c.items.length > 0);

    return (
        <div>
            <SectionHeading icon={Code}>Skills</SectionHeading>
            <div className="space-y-3">
                {categories.map((cat) => (
                    <div key={cat.label}>
                        <p className="mb-1 text-[10px] font-bold opacity-80">{cat.label}:</p>
                        <p className="text-[10px] leading-[1.6]">
                            {cat.items.join(", ")}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function LanguagesBlock({ data }: { data: ResumeValues }) {
    const items = data.languages?.filter((l) => l.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading icon={Languages}>Languages</SectionHeading>
            <div className="space-y-1 text-[10.5px]">
                {items.map((l, i) => (
                    <div key={l.id || i}>
                        <span className="font-semibold">{l.language || "Language"}</span>
                        {l.proficiency && <span className="opacity-70">: {l.proficiency}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Right Column Blocks
// ---------------------------------------------------------------------------

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const items = data.workExperiences?.filter((e) => e.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading icon={Briefcase}>Work Experience</SectionHeading>
            <div className="space-y-4">
                {items.map((exp, i) => (
                    <div key={exp.id || i} style={{ breakInside: "avoid" }}>
                        <h4 className="text-[11px] font-bold">{exp.position || "Position"}</h4>
                        <div className="text-[10.5px] italic opacity-80">
                            {exp.company}{exp.location && `, ${exp.location}`}
                        </div>
                        {dateRange(exp.startDate, exp.endDate) && (
                            <p className="text-[9.5px] opacity-60">{dateRange(exp.startDate, exp.endDate)}</p>
                        )}
                        {exp.description && (
                            <div className="mt-1 space-y-[2px] text-[10px] leading-[1.5] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjectsBlock({ data }: { data: ResumeValues }) {
    const items = data.projects?.filter((p) => p.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading icon={Briefcase}>Projects</SectionHeading>
            <div className="space-y-3">
                {items.map((p, i) => (
                    <div key={p.id || i} style={{ breakInside: "avoid" }}>
                        <h4 className="text-[11px] font-bold">{p.title || "Project"}</h4>
                        {p.subtitle && <p className="text-[10.5px] italic opacity-80">{p.subtitle}</p>}
                        {p.description && (
                            <div className="mt-1 space-y-[2px] text-[10px] leading-[1.5] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(p.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProfileBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Profile</SectionHeading>
            <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
        </div>
    );
}

function AwardsBlock({ data }: { data: ResumeValues }) {
    const items = data.awards?.filter((a) => a.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading>Awards</SectionHeading>
            <div className="space-y-2">
                {items.map((a, i) => (
                    <div key={a.id || i} className="text-[10.5px]">
                        <p className="font-bold">{a.title || "Award"}</p>
                        {a.issuer && <p className="italic opacity-80">{a.issuer}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

const LEFT_RENDERERS: Record<string, (props: { data: ResumeValues }) => React.ReactNode> = {
    education: EducationBlock,
    skills: SkillsBlock,
    languages: LanguagesBlock,
    awards: AwardsBlock,
};

const RIGHT_RENDERERS: Record<string, (props: { data: ResumeValues }) => React.ReactNode> = {
    profile: ProfileBlock,
    experience: ExperienceBlock,
    projects: ProjectsBlock,
    education: EducationBlock,
    awards: AwardsBlock,
};

// ---------------------------------------------------------------------------
// Exported Modern Template
// ---------------------------------------------------------------------------

export default function ModernTemplate({
    resumeData,
    className,
    fontFamily,
}: TemplateProps) {
    const sectionOrder =
        resumeData.sectionOrder && resumeData.sectionOrder.length > 0
            ? resumeData.sectionOrder
            : DEFAULT_SECTION_ORDER;
    const sv = resumeData.sectionVisibility;

    const leftSections = ["education", "skills", "languages", "awards", "certificates", "references"];
    const rightSections = ["personal-info", "profile", "experience", "projects", "courses", "publications"];

    return (
        <div
            className={className}
            style={{
                fontFamily: fontFamily || 'Georgia, "Times New Roman", "Noto Serif", serif',
                color: "#000000",
                "--accent": resumeData.colorHex || "#000000",
                overflowWrap: "break-word",
                wordBreak: "break-word",
            } as React.CSSProperties}
        >
            {/* Header spans full width */}
            {isSectionVisible(sv, "personal-info") && <HeaderBlock data={resumeData} />}

            {/* Two-column body */}
            <div className="grid grid-cols-[38%_1fr] gap-6">
                {/* Left Column */}
                <div>
                    {sectionOrder.map((key) => {
                        if (leftSections.includes(key) && isSectionVisible(sv, key)) {
                            const Renderer = LEFT_RENDERERS[key];
                            return (
                                <div key={key}>
                                    {Renderer && <Renderer data={resumeData} />}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Right Column */}
                <div>
                    {sectionOrder.map((key) => {
                        if (rightSections.includes(key) && isSectionVisible(sv, key)) {
                            if (key === "personal-info") return null;
                            const Renderer = RIGHT_RENDERERS[key];
                            return (
                                <Renderer key={key} data={resumeData} />
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
}
