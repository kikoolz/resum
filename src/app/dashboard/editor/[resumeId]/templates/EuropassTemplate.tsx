"use client";

import type { ResumeValues } from "@/lib/validation";
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Globe,
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
// Europass Template
// Two-column: light blue sidebar (left) + white main (right).
// Sidebar: photo, name, job title, contact details, skills.
// Main: summary, experience, education, languages.
// Blue/purple section headings with horizontal rules.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

function SidebarSectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="mb-3 mt-5 text-[13px] font-black uppercase tracking-wider" style={{ color: "var(--accent)" }}>
            {children}
        </h3>
    );
}

function MainSectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-3 mt-6">
            <h3
                className="pb-1 text-[14px] font-black uppercase tracking-wider"
                style={{ color: "var(--accent)", borderBottom: "2px solid var(--accent)" }}
            >
                {children}
            </h3>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sidebar Blocks
// ---------------------------------------------------------------------------

function SidebarHeader({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;
    const showPhoto = isFieldVisible(fv, "photoUrl") && data.photoUrl;

    return (
        <div className="mb-6 text-center">
            {showPhoto && (
                <img
                    src={data.photoUrl}
                    alt=""
                    className="mx-auto mb-4 h-28 w-28 rounded-full border-4 border-white object-cover shadow-sm"
                />
            )}
            <h1 className="text-[22px] font-black leading-tight">
                {fullName || "Your Name"}
            </h1>
            {jobTitle && (
                <p className="mt-1 text-[12px] font-medium opacity-80">{jobTitle}</p>
            )}
        </div>
    );
}

function SidebarDetailsBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const items: { label: string; value: string | undefined }[] = [];

    if (isFieldVisible(fv, "phone") && data.phone) {
        items.push({ label: "Phone number:", value: data.phone });
    }
    if (isFieldVisible(fv, "email") && data.email) {
        items.push({ label: "Email address:", value: data.email });
    }
    if (isFieldVisible(fv, "linkedin") && data.linkedin) {
        items.push({ label: "LinkedIn:", value: data.linkedin });
    }
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [isFieldVisible(fv, "city") ? data.city : null, isFieldVisible(fv, "country") ? data.country : null].filter(Boolean).join(", ");
        if (loc) items.push({ label: "Address:", value: loc });
    }
    if (isFieldVisible(fv, "website") && data.website) {
        items.push({ label: "Website:", value: data.website });
    }

    if (items.length === 0) return null;

    return (
        <div>
            <SidebarSectionHeading>Details</SidebarSectionHeading>
            <div className="space-y-3 text-[10.5px]">
                {items.map((item) => (
                    <div key={item.label}>
                        <p className="font-bold">{item.label}</p>
                        <p className="opacity-80">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SidebarSkillsBlock({ data }: { data: ResumeValues }) {
    if (!data.skills || data.skills.length === 0) return null;
    return (
        <div>
            <SidebarSectionHeading>Skills</SidebarSectionHeading>
            <ul className="space-y-1.5 text-[10.5px]">
                {data.skills.map((skill, i) => (
                    <li key={`${skill}-${i}`} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-60" />
                        {skill}
                    </li>
                ))}
            </ul>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Content Blocks
// ---------------------------------------------------------------------------

function MainSummaryBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <MainSectionHeading>Summary</MainSectionHeading>
            <p className="text-[11px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
        </div>
    );
}

function MainExperienceBlock({ data }: { data: ResumeValues }) {
    const items = data.workExperiences?.filter((e) => e.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <MainSectionHeading>Experience</MainSectionHeading>
            <div className="space-y-4">
                {items.map((exp, i) => (
                    <div key={exp.id || i} style={{ breakInside: "avoid" }}>
                        <div className="text-[10px] opacity-60">
                            {dateRange(exp.startDate, exp.endDate)}
                            {exp.location && ` ${exp.location}`}
                        </div>
                        <h4 className="mt-1 text-[12px] font-bold">
                            {exp.position || "Position"}
                            {exp.company && (
                                <span className="font-normal"> | {exp.company}</span>
                            )}
                        </h4>
                        {exp.description && (
                            <div className="mt-2 space-y-1 text-[10.5px] leading-[1.5] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MainEducationBlock({ data }: { data: ResumeValues }) {
    const items = data.educations?.filter((e) => e.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <MainSectionHeading>Education</MainSectionHeading>
            <div className="space-y-3">
                {items.map((edu, i) => (
                    <div key={edu.id || i} style={{ breakInside: "avoid" }}>
                        <div className="text-[10px] opacity-60">
                            {dateRange(edu.startDate, edu.endDate)}
                            {edu.location && ` ${edu.location}`}
                        </div>
                        <h4 className="mt-1 text-[12px] font-bold">
                            {edu.degree || "Degree"}{edu.fieldOfStudy && `: ${edu.fieldOfStudy}`}
                        </h4>
                        {edu.school && (
                            <p className="text-[10.5px] italic opacity-80">{edu.school}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MainLanguagesBlock({ data }: { data: ResumeValues }) {
    const items = data.languages?.filter((l) => l.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <MainSectionHeading>Languages</MainSectionHeading>
            <div className="space-y-1.5 text-[11px]">
                {items.map((l, i) => (
                    <div key={l.id || i}>
                        {l.proficiency && (
                            <span className="opacity-60">{l.proficiency === "Native" ? "Mother language(s):" : "Other language(s):"} </span>
                        )}
                        <span className="font-bold">{l.language || "Language"}</span>
                        {l.proficiency && l.proficiency !== "Native" && (
                            <span className="opacity-60"> {l.proficiency}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function MainProjectsBlock({ data }: { data: ResumeValues }) {
    const items = data.projects?.filter((p) => p.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <MainSectionHeading>Projects</MainSectionHeading>
            <div className="space-y-3">
                {items.map((p, i) => (
                    <div key={p.id || i} style={{ breakInside: "avoid" }}>
                        <h4 className="text-[12px] font-bold">{p.title || "Project"}</h4>
                        {p.subtitle && <p className="text-[10.5px] italic opacity-80">{p.subtitle}</p>}
                        {p.description && (
                            <p className="mt-1 text-[10.5px] leading-[1.5] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(p.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

const SIDEBAR_RENDERERS: Record<string, (props: { data: ResumeValues }) => React.ReactNode> = {
    skills: SidebarSkillsBlock,
};

const MAIN_RENDERERS: Record<string, (props: { data: ResumeValues }) => React.ReactNode> = {
    summary: MainSummaryBlock,
    profile: MainSummaryBlock,
    experience: MainExperienceBlock,
    education: MainEducationBlock,
    languages: MainLanguagesBlock,
    projects: MainProjectsBlock,
};

// ---------------------------------------------------------------------------
// Exported Europass Template
// ---------------------------------------------------------------------------

export default function EuropassTemplate({
    resumeData,
    className,
    fontFamily,
}: TemplateProps) {
    const sectionOrder =
        resumeData.sectionOrder && resumeData.sectionOrder.length > 0
            ? resumeData.sectionOrder
            : DEFAULT_SECTION_ORDER;
    const sv = resumeData.sectionVisibility;

    const sidebarSections = ["skills", "languages", "interests", "awards", "certificates", "references"];
    const mainSections = ["personal-info", "profile", "summary", "experience", "education", "projects", "courses", "publications"];

    const color = resumeData.colorHex || "#3366CC";

    return (
        <div
            className={className}
            style={{
                fontFamily: fontFamily || 'Georgia, "Times New Roman", "Noto Serif", serif',
                color: "#000000",
                "--accent": color,
            } as React.CSSProperties}
        >
            <div className="grid h-full grid-cols-[34%_1fr]">
                {/* Left Sidebar */}
                <div
                    className="flex flex-col gap-2 px-5 py-8"
                    style={{ backgroundColor: `color-mix(in srgb, ${color} 15%, white)` }}
                >
                    <SidebarHeader data={resumeData} />
                    <SidebarDetailsBlock data={resumeData} />
                    {sectionOrder.map((key) => {
                        if (sidebarSections.includes(key) && isSectionVisible(sv, key)) {
                            const Renderer = SIDEBAR_RENDERERS[key];
                            return (
                                <div key={key}>
                                    {Renderer && <Renderer data={resumeData} />}
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>

                {/* Right Main Content */}
                <div className="flex flex-col gap-1 bg-white p-8">
                    {sectionOrder.map((key) => {
                        if (mainSections.includes(key) && isSectionVisible(sv, key)) {
                            if (key === "personal-info") return null;
                            const Renderer = MAIN_RENDERERS[key];
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
