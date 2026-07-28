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
    return `${m}/${y}`;
}

function dateRange(start?: string, end?: string): string {
    const s = fmtDate(start);
    const e = end ? fmtDate(end) : "CURRENT";
    if (!s && e === "CURRENT") return "";
    return `${s} – ${e}`;
}

// ---------------------------------------------------------------------------
// Profile Template
// Europass-inspired: photo + contact top left, right column with blue-gray bg
// containing social links, skills as pills, languages.
// Left column: summary, experience, education with blue icons.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

const ACCENT = "#2B5797";
const SIDEBAR_BG = "#E8EDF5";

// Section icon components
function SummaryIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="7" y1="8" x2="17" y2="8" />
            <line x1="7" y1="12" x2="17" y2="12" />
            <line x1="7" y1="16" x2="13" y2="16" />
        </svg>
    );
}

function ExperienceIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        </svg>
    );
}

function EducationIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
    );
}

function SkillsIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
    );
}

function LanguagesIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
    );
}

function SocialIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    );
}

function SectionHeading({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
    return (
        <div className="mb-3 mt-5 flex items-center gap-2">
            <Icon className="shrink-0 text-[#2B5797]" />
            <h3
                className="text-[12px] font-black uppercase tracking-wider text-[#2B5797]"
            >
                {children}
            </h3>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Header Block
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;
    const showPhoto = isFieldVisible(fv, "photoUrl") && data.photoUrl;

    const contactItems: React.ReactNode[] = [];
    if (isFieldVisible(fv, "phone") && data.phone) {
        contactItems.push(
            <span key="phone" className="inline-flex items-center gap-1 text-[9.5px]">
                <Phone className="h-3 w-3 shrink-0 opacity-60" /> {data.phone}
            </span>,
        );
    }
    if (isFieldVisible(fv, "email") && data.email) {
        contactItems.push(
            <span key="email" className="inline-flex items-center gap-1 text-[9.5px]">
                <Mail className="h-3 w-3 shrink-0 opacity-60" /> {data.email}
            </span>,
        );
    }
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [
            isFieldVisible(fv, "city") ? data.city : null,
            isFieldVisible(fv, "country") ? data.country : null,
        ].filter(Boolean).join(", ");
        if (loc) {
            contactItems.push(
                <span key="loc" className="inline-flex items-center gap-1 text-[9.5px]">
                    <MapPin className="h-3 w-3 shrink-0 opacity-60" /> {loc}
                </span>,
            );
        }
    }

    return (
        <div className="mb-6 flex items-start gap-4">
            {showPhoto && (
                <img
                    src={data.photoUrl}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-full border-2 border-[#1a1a1a]/10 object-cover"
                />
            )}
            <div className="flex-1">
                {fullName && (
                    <h1 className="text-[24px] font-black uppercase tracking-wider" style={{ color: "var(--accent)" }}>
                        {fullName}
                    </h1>
                )}
                {jobTitle && (
                    <p className="mt-0.5 text-[11px] opacity-70">{jobTitle}</p>
                )}
                {contactItems.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                        {contactItems}
                    </div>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Left Column Blocks
// ---------------------------------------------------------------------------

function SummaryBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading icon={SummaryIcon}>Summary</SectionHeading>
            <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
        </div>
    );
}

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const experiences = data.workExperiences?.filter((e) => e.visible !== false && (e.position || e.company)) ?? [];
    if (experiences.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading icon={ExperienceIcon}>Experience</SectionHeading>
            <div className="flex flex-col gap-4">
                {experiences.map((exp, i) => (
                    <div key={i}>
                        <div className="flex items-baseline gap-2">
                            <p className="text-[10px] font-bold">{dateRange(exp.startDate, exp.endDate)}</p>
                            {exp.location && <p className="text-[9.5px] opacity-70">{exp.location}</p>}
                        </div>
                        {(exp.position || exp.company) && (
                            <p className="mt-0.5 text-[11px] font-bold">
                                {exp.position || "Position"}{exp.company ? ` | ${exp.company}` : ""}
                            </p>
                        )}
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
            <SectionHeading icon={EducationIcon}>Education</SectionHeading>
            <div className="flex flex-col gap-3">
                {educations.map((edu, i) => {
                    const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
                    const degreeStr = degreeParts.join(": ");
                    return (
                        <div key={i}>
                            <div className="flex items-baseline gap-2">
                                <p className="text-[10px] font-bold">{dateRange(edu.startDate, edu.endDate)}</p>
                                {edu.location && <p className="text-[9.5px] opacity-70">{edu.location}</p>}
                            </div>
                            {degreeStr && (
                                <p className="mt-0.5 text-[11px] font-bold">{degreeStr}</p>
                            )}
                            {edu.school && (
                                <p className="text-[10px] opacity-70">{edu.school}</p>
                            )}
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
            <SectionHeading icon={SummaryIcon}>Projects</SectionHeading>
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
            <SectionHeading icon={EducationIcon}>Courses</SectionHeading>
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
            <SectionHeading icon={SummaryIcon}>Publications</SectionHeading>
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
// Right Sidebar Blocks
// ---------------------------------------------------------------------------

function SocialLinksBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const links: { label: string; value: string }[] = [];

    if (isFieldVisible(fv, "linkedin") && data.linkedin) {
        links.push({ label: "LinkedIn", value: data.linkedin });
    }
    if (isFieldVisible(fv, "website") && data.website) {
        links.push({ label: "Website", value: data.website });
    }

    if (links.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading icon={SocialIcon}>Social Links</SectionHeading>
            <div className="flex flex-col gap-1.5">
                {links.map(({ label, value }) => (
                    <div key={label}>
                        <p className="text-[10px] font-bold opacity-70">{label}:</p>
                        <p className="text-[9.5px] break-all" style={{ color: ACCENT }}>{value}</p>
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
            <SectionHeading icon={SkillsIcon}>Skills</SectionHeading>
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
            <SectionHeading icon={LanguagesIcon}>Languages</SectionHeading>
            <div className="flex flex-col gap-2">
                <div>
                    <p className="text-[9.5px] opacity-70">Mother language(s):</p>
                    {languages.filter((l) => l.proficiency?.toLowerCase() === "native").length > 0 ? (
                        <p className="text-[10px] font-bold">
                            {languages.filter((l) => l.proficiency?.toLowerCase() === "native").map((l) => l.language?.toUpperCase()).join(", ")}
                        </p>
                    ) : (
                        <p className="text-[10px] font-bold">{languages[0]?.language?.toUpperCase()}</p>
                    )}
                </div>
                {languages.filter((l) => l.proficiency?.toLowerCase() !== "native").length > 0 && (
                    <div>
                        <p className="text-[9.5px] opacity-70">Other language(s):</p>
                        <div className="flex flex-col gap-0.5">
                            {languages.filter((l) => l.proficiency?.toLowerCase() !== "native").map((lang, i) => (
                                <p key={i} className="text-[10px]">
                                    <span className="font-bold">{lang.language?.toUpperCase()}</span>
                                    {lang.proficiency ? ` ${lang.proficiency}` : ""}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function AwardsBlock({ data }: { data: ResumeValues }) {
    const awards = data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
    if (awards.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading icon={SummaryIcon}>Awards</SectionHeading>
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
            <SectionHeading icon={EducationIcon}>Certificates</SectionHeading>
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
            <SectionHeading icon={SocialIcon}>References</SectionHeading>
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

function InterestsBlock({ data }: { data: ResumeValues }) {
    const interests = data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
    if (interests.length === 0) return null;

    return (
        <div className="mb-4">
            <SectionHeading icon={SkillsIcon}>Interests</SectionHeading>
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

export default function ProfileTemplate({
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
            <div className="grid h-full grid-cols-[65%_1fr]">
                {/* Left Column */}
                <div className="flex flex-col border-l-2 border-[#1a1a1a]/10 bg-white px-6 py-6">
                    {/* Header with photo */}
                    {isSectionVisible(sv, "personal-info") && <HeaderBlock data={resumeData} />}

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

                {/* Right Sidebar */}
                <div className="flex flex-col px-5 py-6" style={{ backgroundColor: `color-mix(in srgb, ${color} 12%, white)` }}>
                    {/* Social Links at top */}
                    <SocialLinksBlock data={resumeData} />

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
