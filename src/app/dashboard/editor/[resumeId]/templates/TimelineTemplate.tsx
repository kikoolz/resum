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
    return `${s} – ${e}`;
}

// ---------------------------------------------------------------------------
// Timeline Template
// Two-column with timeline-style entries (vertical line on left),
// icons next to section headings, skills as pills.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

// Section icons
function ClipboardIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <rect x="8" y="2" width="8" height="4" rx="1" />
        </svg>
    );
}

function BriefcaseIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
    );
}

function BookIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    );
}

function SectionHeading({ icon: Icon, children }: { icon: React.ComponentType; children: React.ReactNode }) {
    return (
        <div className="mb-3 mt-5 flex items-center gap-2">
            <Icon />
            <h3
                className="text-[13px] font-black uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
            >
                {children}
            </h3>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sidebar (Right Column)
// ---------------------------------------------------------------------------

function ContactBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const items: { icon: React.ComponentType<{ className?: string }>; value: string }[] = [];

    if (isFieldVisible(fv, "email") && data.email) {
        items.push({ icon: Mail, value: data.email });
    }
    if (isFieldVisible(fv, "phone") && data.phone) {
        items.push({ icon: Phone, value: data.phone });
    }
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [
            isFieldVisible(fv, "city") ? data.city : null,
            isFieldVisible(fv, "country") ? data.country : null,
        ].filter(Boolean).join(", ");
        if (loc) items.push({ icon: MapPin, value: loc });
    }
    if (isFieldVisible(fv, "linkedin") && data.linkedin) {
        items.push({ icon: Linkedin, value: data.linkedin });
    }
    if (isFieldVisible(fv, "website") && data.website) {
        items.push({ icon: Globe, value: data.website });
    }

    if (items.length === 0) return null;

    return (
        <div className="mb-4">
            <div className="flex flex-col gap-2">
                {items.map(({ icon: Icon, value }, i) => (
                    <div key={i} className="flex items-start gap-2">
                        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-60" />
                        <span className="text-[10px] leading-snug">{value}</span>
                    </div>
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
            <SectionHeading icon={StarIcon}>Skills</SectionHeading>
            <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, i) => (
                    <span
                        key={i}
                        className="rounded-full border border-[#1a1a1a]/20 px-2.5 py-0.5 text-[9px]"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        </div>
    );
}

function LanguagesBlock({ data }: { data: ResumeValues }) {
    const languages = data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ?? [];
    if (languages.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading icon={StarIcon}>Languages</SectionHeading>
            <div className="flex flex-wrap gap-1.5">
                {languages.map((lang, i) => (
                    <span
                        key={i}
                        className="rounded-full border border-[#1a1a1a]/20 px-2.5 py-0.5 text-[9px]"
                    >
                        {lang.language}{lang.proficiency ? ` — ${lang.proficiency}` : ""}
                    </span>
                ))}
            </div>
        </div>
    );
}

function InterestsBlock({ data }: { data: ResumeValues }) {
    const interests = data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
    if (interests.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading icon={StarIcon}>Interests</SectionHeading>
            <div className="flex flex-wrap gap-1.5">
                {interests.map((interest, i) => (
                    <span
                        key={i}
                        className="rounded-full border border-[#1a1a1a]/20 px-2.5 py-0.5 text-[9px]"
                    >
                        {interest.name}
                    </span>
                ))}
            </div>
        </div>
    );
}

function AwardsBlock({ data }: { data: ResumeValues }) {
    const awards = data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
    if (awards.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading icon={StarIcon}>Awards</SectionHeading>
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
            <SectionHeading icon={StarIcon}>Certificates</SectionHeading>
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
            <SectionHeading icon={StarIcon}>References</SectionHeading>
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
// Left Column Blocks
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

    if (!fullName && !jobTitle) return null;

    return (
        <div className="mb-4">
            {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
                <img
                    src={data.photoUrl}
                    alt=""
                    className="mb-3 h-20 w-20 rounded-full object-cover"
                />
            )}
            {fullName && (
                <h1 className="text-[24px] font-black uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                    {fullName}
                </h1>
            )}
            {jobTitle && (
                <p className="mt-0.5 text-[11px] uppercase tracking-wider opacity-70">{jobTitle}</p>
            )}
            <div className="mt-4 h-[2px] w-full" style={{ backgroundColor: "var(--accent)" }} />
        </div>
    );
}

function SummaryBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading icon={ClipboardIcon}>Summary</SectionHeading>
            <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
            <div className="mt-4 h-px w-full bg-[#1a1a1a]/10" />
        </div>
    );
}

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const experiences = data.workExperiences?.filter((e) => e.visible !== false && (e.position || e.company)) ?? [];
    if (experiences.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading icon={BriefcaseIcon}>Experience</SectionHeading>
            <div className="flex flex-col gap-4">
                {experiences.map((exp, i) => (
                    <div key={i} className="flex gap-3">
                        {/* Timeline gutter: line + dot */}
                        <div className="relative flex w-4 shrink-0 flex-col items-center">
                            {/* Vertical line (extends from top to bottom of entry) */}
                            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#1a1a1a]/20" />
                            {/* Dot */}
                            <div className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-[#1a1a1a]/40 bg-white" />
                            {/* Spacer to push content down */}
                            <div className="h-full" />
                        </div>
                        {/* Content */}
                        <div className="flex-1 pb-1">
                            <div className="flex items-start gap-4">
                                <p className="w-[130px] shrink-0 text-[9.5px] font-medium opacity-70">
                                    {dateRange(exp.startDate, exp.endDate)}
                                </p>
                                <div className="flex-1">
                                    {(exp.position || exp.company) && (
                                        <p className="text-[11px] font-bold">
                                            {exp.position || "Position"}
                                            {exp.company && <span className="font-normal opacity-70"> — {exp.company}</span>}
                                        </p>
                                    )}
                                    {exp.location && (
                                        <p className="text-[9.5px] opacity-60">{exp.location}</p>
                                    )}
                                    {exp.description && (
                                        <div className="mt-1.5 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 h-px w-full bg-[#1a1a1a]/10" />
        </div>
    );
}

function EducationBlock({ data }: { data: ResumeValues }) {
    const educations = data.educations?.filter((e) => e.visible !== false && (e.school || e.degree)) ?? [];
    if (educations.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading icon={BookIcon}>Education</SectionHeading>
            <div className="flex flex-col gap-4">
                {educations.map((edu, i) => {
                    const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
                    const degreeStr = degreeParts.join(", ");
                    return (
                        <div key={i} className="flex gap-3">
                            {/* Timeline gutter: line + dot */}
                            <div className="relative flex w-4 shrink-0 flex-col items-center">
                                {/* Vertical line (extends from top to bottom of entry) */}
                                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#1a1a1a]/20" />
                                {/* Dot */}
                                <div className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 border-[#1a1a1a]/40 bg-white" />
                                {/* Spacer to push content down */}
                                <div className="h-full" />
                            </div>
                            {/* Content */}
                            <div className="flex-1 pb-1">
                                <div className="flex items-start gap-4">
                                    <p className="w-[130px] shrink-0 text-[9.5px] font-medium opacity-70">
                                        {dateRange(edu.startDate, edu.endDate)}
                                    </p>
                                    <div className="flex-1">
                                        {edu.school && (
                                            <p className="text-[11px] font-bold">{edu.school}</p>
                                        )}
                                        {degreeStr && (
                                            <p className="text-[10px] opacity-70">{degreeStr}</p>
                                        )}
                                        {edu.location && (
                                            <p className="text-[9.5px] opacity-60">{edu.location}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
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
            <SectionHeading icon={ClipboardIcon}>Projects</SectionHeading>
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
            <SectionHeading icon={BookIcon}>Courses</SectionHeading>
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
            <SectionHeading icon={ClipboardIcon}>Publications</SectionHeading>
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
    profile: SummaryBlock,
    experience: ExperienceBlock,
    education: EducationBlock,
    projects: ProjectsBlock,
    courses: CoursesBlock,
    publications: PublicationsBlock,
};

const RIGHT_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    skills: SkillsBlock,
    languages: LanguagesBlock,
    interests: InterestsBlock,
    awards: AwardsBlock,
    certificates: CertificatesBlock,
    references: ReferencesBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function TimelineTemplate({
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

    const leftSections = ["profile", "experience", "education", "projects", "courses", "publications"];
    const rightSections = ["skills", "languages", "interests", "awards", "certificates", "references"];

    return (
        <div
            className={className}
            style={{
                fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
                color: "#000000",
                "--accent": color,
            } as React.CSSProperties}
        >
            <div className="px-6 py-6">
                {/* Header */}
                {isSectionVisible(sv, "personal-info") && <HeaderBlock data={resumeData} />}

                <div className="grid h-full grid-cols-[60%_1fr]">
                    {/* Left Column */}
                    <div className="flex flex-col pr-6">
                        {sectionOrder.map((key) => {
                            if (leftSections.includes(key) && isSectionVisible(sv, key)) {
                                const Renderer = LEFT_RENDERERS[key];
                                return (
                                    <Renderer key={key} data={resumeData} />
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
                    <div className="flex flex-col border-l border-[#1a1a1a]/15 pl-6">
                        <ContactBlock data={resumeData} />
                        <div className="h-px w-full bg-[#1a1a1a]/10" />
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
        </div>
    );
}
