"use client";

import type { ResumeValues } from "@/lib/validation";
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Globe,
} from "lucide-react";
import { richTextHtml } from "@/lib/rich-text";
import { DEFAULT_SECTION_ORDER } from "../sectionConfig";

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
// Executive Template
// Two-column with blue-gray header block on the left.
// Left: header (name, title, contact on blue-gray bg), then education + skills on white.
// Right: summary, experience on white.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

const HEADER_BG = "#8BA4B8";

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-2 mt-5">
            <h3
                className="border-b-2 pb-1 text-[12px] font-black uppercase tracking-wider"
                style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
            >
                {children}
            </h3>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Left Column Blocks
// ---------------------------------------------------------------------------

function SidebarHeader({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

    const contactItems: React.ReactNode[] = [];
    if (isFieldVisible(fv, "email") && data.email) {
        contactItems.push(
            <div key="email" className="flex items-center gap-2">
                <Mail className="h-3 w-3 shrink-0" />
                <span className="text-[9.5px] break-all">{data.email}</span>
            </div>,
        );
    }
    if (isFieldVisible(fv, "phone") && data.phone) {
        contactItems.push(
            <div key="phone" className="flex items-center gap-2">
                <Phone className="h-3 w-3 shrink-0" />
                <span className="text-[9.5px]">{data.phone}</span>
            </div>,
        );
    }
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [
            isFieldVisible(fv, "city") ? data.city : null,
            isFieldVisible(fv, "country") ? data.country : null,
        ].filter(Boolean).join(", ");
        if (loc) {
            contactItems.push(
                <div key="loc" className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="text-[9.5px]">{loc}</span>
                </div>,
            );
        }
    }
    if (isFieldVisible(fv, "linkedin") && data.linkedin) {
        contactItems.push(
            <div key="li" className="flex items-center gap-2">
                <Linkedin className="h-3 w-3 shrink-0" />
                <span className="text-[9.5px] break-all">{data.linkedin}</span>
            </div>,
        );
    }
    if (isFieldVisible(fv, "website") && data.website) {
        contactItems.push(
            <div key="web" className="flex items-center gap-2">
                <Globe className="h-3 w-3 shrink-0" />
                <span className="text-[9.5px] break-all">{data.website}</span>
            </div>,
        );
    }

    return (
        <div>
            {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
                <img
                    src={data.photoUrl}
                    alt=""
                    className="mb-3 h-24 w-24 rounded-full object-cover"
                />
            )}
            {fullName && (
                <h1 className="text-[24px] font-bold leading-tight text-[#1a1a1a]">
                    {fullName}
                </h1>
            )}
            {jobTitle && (
                <p className="mt-1 text-[12px] font-medium text-[#1a1a1a]/80">{jobTitle}</p>
            )}
            {contactItems.length > 0 && (
                <div className="mt-3 flex flex-col gap-1.5 text-[#1a1a1a]">
                    {contactItems}
                </div>
            )}
        </div>
    );
}

function EducationBlock({ data }: { data: ResumeValues }) {
    const educations = data.educations?.filter((e) => e.visible !== false && (e.school || e.degree)) ?? [];
    if (educations.length === 0) return null;

    return (
        <div className="px-5 py-4">
            <SectionHeading>Education</SectionHeading>
            <div className="flex flex-col gap-3">
                {educations.map((edu, i) => {
                    const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
                    const degreeStr = degreeParts.join(", ");
                    return (
                        <div key={i}>
                            {edu.school && (
                                <p className="text-[11px] font-bold">{edu.school}</p>
                            )}
                            {(edu.location || edu.startDate || edu.endDate) && (
                                <p className="text-[9.5px] italic opacity-70">
                                    {[edu.location, dateRange(edu.startDate, edu.endDate)].filter(Boolean).join(" · ")}
                                </p>
                            )}
                            {degreeStr && (
                                <p className="mt-0.5 text-[10px] font-semibold">{degreeStr}</p>
                            )}
                            {edu.description && (
                                <p dangerouslySetInnerHTML={{ __html: richTextHtml(edu.description) }} className="mt-0.5 text-[9.5px] leading-[1.5] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
    const skills = data.skills?.filter((s) => s.trim()) ?? [];
    if (skills.length === 0) return null;

    return (
        <div className="px-5 py-4">
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
        <div className="px-5 py-4">
            <SectionHeading>Languages</SectionHeading>
            <ul className="flex flex-col gap-1">
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
        <div className="px-5 py-4">
            <SectionHeading>Interests</SectionHeading>
            <ul className="flex flex-col gap-1">
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
        <div className="px-5 py-4">
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
        <div className="px-5 py-4">
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
        <div className="px-5 py-4">
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
// Right Column Blocks
// ---------------------------------------------------------------------------

function SummaryBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div className="px-6 py-4" style={{ breakInside: "avoid" }}>
            <SectionHeading>Summary</SectionHeading>
            <p dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
        </div>
    );
}

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const experiences = data.workExperiences?.filter((e) => e.visible !== false && (e.position || e.company)) ?? [];
    if (experiences.length === 0) return null;

    return (
        <div className="px-6 py-4" style={{ breakInside: "avoid" }}>
            <SectionHeading>Experience</SectionHeading>
            <div className="flex flex-col gap-4">
                {experiences.map((exp, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold">
                            {exp.position || "Position"}{exp.company ? ` - ${exp.company}` : ""}
                        </p>
                        {(exp.location || exp.startDate || exp.endDate) && (
                            <p className="text-[9.5px] italic opacity-70">
                                {[exp.location, dateRange(exp.startDate, exp.endDate)].filter(Boolean).join(" · ")}
                            </p>
                        )}
                        {exp.description && (
                            <div dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} className="mt-1.5 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjectsBlock({ data }: { data: ResumeValues }) {
    const projects = data.projects?.filter((p) => p.visible !== false && p.title?.trim()) ?? [];
    if (projects.length === 0) return null;

    return (
        <div className="px-6 py-4" style={{ breakInside: "avoid" }}>
            <SectionHeading>Projects</SectionHeading>
            <div className="flex flex-col gap-3">
                {projects.map((proj, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold">{proj.title}</p>
                        {proj.description && (
                            <p dangerouslySetInnerHTML={{ __html: richTextHtml(proj.description) }} className="mt-1 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
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
        <div className="px-6 py-4" style={{ breakInside: "avoid" }}>
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
        <div className="px-6 py-4" style={{ breakInside: "avoid" }}>
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

const LEFT_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    education: EducationBlock,
    skills: SkillsBlock,
    languages: LanguagesBlock,
    interests: InterestsBlock,
    awards: AwardsBlock,
    certificates: CertificatesBlock,
    references: ReferencesBlock,
};

const RIGHT_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    experience: ExperienceBlock,
    projects: ProjectsBlock,
    courses: CoursesBlock,
    publications: PublicationsBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function ExecutiveTemplate({
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

    const leftSections = ["education", "skills", "languages", "interests", "awards", "certificates", "references"];
    const rightSections = ["experience", "projects", "courses", "publications"];

    return (
        <div
            className={className}
            style={{
                fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
                color: "#000000",
                "--accent": color,
            } as React.CSSProperties}
        >
            {/* Full-width header */}
            <div
                className="grid grid-cols-[40%_1fr]"
                style={{ backgroundColor: HEADER_BG }}
            >
                <div className="border-r border-black/20 px-5 py-6">
                    <SidebarHeader data={resumeData} />
                </div>
                <div className="flex flex-col justify-center px-6 py-6">
                    {isSectionVisible(sv, "profile") && resumeData.summary && (
                        <div>
                            <SectionHeading>Summary</SectionHeading>
                            <p dangerouslySetInnerHTML={{ __html: richTextHtml(resumeData.summary) }} className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
                        </div>
                    )}
                </div>
            </div>

            {/* Body: two-column */}
            <div className="grid h-full grid-cols-[40%_1fr]">
                {/* Left Column */}
                <div className="flex flex-col border-r border-black/20 bg-white">
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
                    {/* Render optional sections with data even if not in sectionOrder */}
                    {!sectionOrder.includes("languages") && resumeData.languages?.some((l) => l.visible !== false && l.language?.trim()) && (
                        <LanguagesBlock data={resumeData} />
                    )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col bg-white">
                    {sectionOrder.map((key) => {
                        if (rightSections.includes(key) && isSectionVisible(sv, key)) {
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
