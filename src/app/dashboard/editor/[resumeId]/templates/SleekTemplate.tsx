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
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const y = date.getFullYear();
    const m = months[date.getMonth()];
    return `${m} ${y}`;
}

function dateRange(start?: string, end?: string): string {
    const s = fmtDate(start);
    const e = end ? fmtDate(end) : "Present";
    if (!s && e === "Present") return "";
    return `${s} — ${e}`;
}

// ---------------------------------------------------------------------------
// Sleek Template
// Two-column: narrow left (details, skills) + wide right (name centered,
// job title with decorative lines, summary, experience, education).
// Vertical divider between columns.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-3 mt-6">
            <h3
                className="text-[13px] font-black uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
            >
                {children}
            </h3>
            <div className="mt-1 h-px w-full bg-[#1a1a1a]" />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sidebar Blocks
// ---------------------------------------------------------------------------

function SidebarDetails({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const items: string[] = [];

    if (isFieldVisible(fv, "phone") && data.phone) {
        items.push(data.phone);
    }
    if (isFieldVisible(fv, "email") && data.email) {
        items.push(data.email);
    }
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [
            isFieldVisible(fv, "city") ? data.city : null,
            isFieldVisible(fv, "country") ? data.country : null,
        ].filter(Boolean).join(", ");
        if (loc) items.push(loc);
    }
    if (isFieldVisible(fv, "linkedin") && data.linkedin) {
        items.push(data.linkedin);
    }
    if (isFieldVisible(fv, "website") && data.website) {
        items.push(data.website);
    }

    if (items.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading>Details</SectionHeading>
            <div className="flex flex-col gap-1">
                {items.map((item, i) => (
                    <p key={i} className="text-[10px] leading-snug">
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
    const skills = data.skills?.filter((s) => s.trim()) ?? [];
    if (skills.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading>Skills</SectionHeading>
            <ul className="flex flex-col gap-1.5">
                {skills.map((skill, i) => (
                    <li key={i} className="text-[10px] leading-snug">
                        {skill}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function LanguagesBlock({ data }: { data: ResumeValues }) {
    const languages = data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ?? [];
    if (languages.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading>Languages</SectionHeading>
            <ul className="flex flex-col gap-1.5">
                {languages.map((lang, i) => (
                    <li key={i} className="text-[10px] leading-snug">
                        {lang.language}{lang.proficiency ? ` — ${lang.proficiency}` : ""}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function InterestsBlock({ data }: { data: ResumeValues }) {
    const interests = data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
    if (interests.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading>Interests</SectionHeading>
            <ul className="flex flex-col gap-1.5">
                {interests.map((interest, i) => (
                    <li key={i} className="text-[10px] leading-snug">
                        {interest.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function AwardsBlock({ data }: { data: ResumeValues }) {
    const awards = data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
    if (awards.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading>Awards</SectionHeading>
            <div className="flex flex-col gap-2">
                {awards.map((award, i) => (
                    <div key={i}>
                        <p className="text-[10px] font-bold leading-snug">{award.title}</p>
                        {award.date && <p className="text-[9px] opacity-70">{fmtDate(award.date)}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CertificatesBlock({ data }: { data: ResumeValues }) {
    const certificates = data.certificates?.filter((c) => c.visible !== false && c.title?.trim()) ?? [];
    if (certificates.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading>Certificates</SectionHeading>
            <div className="flex flex-col gap-2">
                {certificates.map((cert, i) => (
                    <div key={i}>
                        <p className="text-[10px] font-bold leading-snug">{cert.title}</p>
                        {cert.issuer && <p className="text-[9px] opacity-70">{cert.issuer}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReferencesBlock({ data }: { data: ResumeValues }) {
    const references = data.references?.filter((r) => r.visible !== false && r.name?.trim()) ?? [];
    if (references.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading>References</SectionHeading>
            <div className="flex flex-col gap-2">
                {references.map((ref, i) => (
                    <div key={i}>
                        <p className="text-[10px] font-bold leading-snug">{ref.name}</p>
                        {ref.position && <p className="text-[9px] opacity-70">{ref.position}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main Content Blocks
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

    if (!fullName && !jobTitle) return null;

    return (
        <div className="mb-6 text-center">
            {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
                <img
                    src={data.photoUrl}
                    alt=""
                    className="mx-auto mb-3 h-20 w-20 rounded-full object-cover"
                />
            )}
            {fullName && (
                <h1 className="text-[28px] font-black uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                    {fullName}
                </h1>
            )}
            {jobTitle && (
                <div className="mt-2 flex items-center gap-3">
                    <div className="h-px flex-1 bg-[#1a1a1a]/30" />
                    <p className="text-[10px] uppercase tracking-[0.15em] opacity-70 whitespace-nowrap">
                        {jobTitle}
                    </p>
                    <div className="h-px flex-1 bg-[#1a1a1a]/30" />
                </div>
            )}
        </div>
    );
}

function SummaryBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Summary</SectionHeading>
            <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
        </div>
    );
}

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const experiences = data.workExperiences?.filter((e) => e.visible !== false && (e.position || e.company)) ?? [];
    if (experiences.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Experience</SectionHeading>
            <div className="flex flex-col gap-4">
                {experiences.map((exp, i) => (
                    <div key={i}>
                        {(exp.position || exp.company) && (
                            <p className="text-[11px]">
                                {exp.position || "Position"}{exp.company ? `, ${exp.company}` : ""}{exp.location ? `, ${exp.location}` : ""}
                            </p>
                        )}
                        <p className="mt-0.5 text-[10px] font-bold">
                            {dateRange(exp.startDate, exp.endDate)}
                        </p>
                        {exp.description && (
                            <div className="mt-2 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function EducationBlock({ data }: { data: ResumeValues }) {
    const educations = data.educations?.filter((e) => e.visible !== false && (e.school || e.degree)) ?? [];
    if (educations.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Education</SectionHeading>
            <div className="flex flex-col gap-3">
                {educations.map((edu, i) => {
                    const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
                    const degreeStr = degreeParts.join(", ");
                    return (
                        <div key={i}>
                            <p className="text-[11px]">
                                {edu.school || "School"}{degreeStr ? `, ${degreeStr}` : ""}{edu.location ? `, ${edu.location}` : ""}
                            </p>
                            <p className="mt-0.5 text-[10px] font-bold">
                                {dateRange(edu.startDate, edu.endDate)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function ProjectsBlock({ data }: { data: ResumeValues }) {
    const projects = data.projects?.filter((p) => p.visible !== false && p.title?.trim()) ?? [];
    if (projects.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Projects</SectionHeading>
            <div className="flex flex-col gap-3">
                {projects.map((proj, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold">{proj.title}</p>
                        {proj.description && (
                            <p className="mt-1 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(proj.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CoursesBlock({ data }: { data: ResumeValues }) {
    const courses = data.courses?.filter((c) => c.visible !== false && c.name?.trim()) ?? [];
    if (courses.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Courses</SectionHeading>
            <div className="flex flex-col gap-2">
                {courses.map((course, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold">{course.name}</p>
                        {course.institution && <p className="text-[10px] opacity-70">{course.institution}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PublicationsBlock({ data }: { data: ResumeValues }) {
    const pubs = data.publications?.filter((p) => p.visible !== false && p.title?.trim()) ?? [];
    if (pubs.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Publications</SectionHeading>
            <div className="flex flex-col gap-2">
                {pubs.map((pub, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold">{pub.title}</p>
                        {pub.publisher && <p className="text-[10px] opacity-70">{pub.publisher}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Renderer maps
// ---------------------------------------------------------------------------

const SIDEBAR_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    skills: SkillsBlock,
    languages: LanguagesBlock,
    interests: InterestsBlock,
    awards: AwardsBlock,
    certificates: CertificatesBlock,
    references: ReferencesBlock,
};

const MAIN_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    profile: SummaryBlock,
    experience: ExperienceBlock,
    education: EducationBlock,
    projects: ProjectsBlock,
    courses: CoursesBlock,
    publications: PublicationsBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function SleekTemplate({
    resumeData,
    className,
    fontFamily,
}: TemplateProps) {
    const sectionOrder =
        resumeData.sectionOrder && resumeData.sectionOrder.length > 0
            ? resumeData.sectionOrder
            : DEFAULT_SECTION_ORDER;
    const sv = resumeData.sectionVisibility;
    const color = resumeData.colorHex || "#000000";

    const sidebarSections = ["skills", "languages", "interests", "awards", "certificates", "references"];
    const mainSections = ["personal-info", "profile", "experience", "education", "projects", "courses", "publications"];

    return (
        <div
            className={className}
            style={{
                fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
                color: "#000000",
                "--accent": color,
            } as React.CSSProperties}
        >
            <div className="grid h-full grid-cols-[25%_1fr]">
                {/* Left Sidebar */}
                <div className="flex flex-col gap-1 border-r border-[#1a1a1a]/15 px-5 py-6">
                    <SidebarDetails data={resumeData} />
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
                    {/* Render optional sections with data even if not in sectionOrder */}
                    {!sectionOrder.includes("languages") && resumeData.languages?.some((l) => l.visible !== false && l.language?.trim()) && (
                        <LanguagesBlock data={resumeData} />
                    )}
                </div>

                {/* Right Main Content */}
                <div className="flex flex-col bg-white px-6 py-6">
                    {/* Name + Job Title */}
                    {isSectionVisible(sv, "personal-info") && <HeaderBlock data={resumeData} />}

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
