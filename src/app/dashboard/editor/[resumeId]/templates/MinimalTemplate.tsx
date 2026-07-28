"use client";

import type { ResumeValues } from "@/lib/validation";
import { Mail, Phone, MapPin } from "lucide-react";
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
    const e = end ? fmtDate(end) : "Current";
    if (!s && e === "Current") return "";
    return `${s} - ${e}`;
}

// ---------------------------------------------------------------------------
// Minimal Template
// Single-column with left date / right content entries,
// uppercase section headings with horizontal rule, clean and minimal.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

// ---------------------------------------------------------------------------
// Section Heading — uppercase bold text + horizontal line
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-6 mb-3">
            <h3
                className="text-[12px] font-black uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
            >
                {children}
            </h3>
            <div className="mt-1 h-[1.5px] w-full" style={{ backgroundColor: "var(--accent)" }} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Header — Name left, contact right
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

    const contacts: { icon: React.ComponentType<{ className?: string }>; value: string }[] = [];
    if (isFieldVisible(fv, "phone") && data.phone) contacts.push({ icon: Phone, value: data.phone });
    if (isFieldVisible(fv, "email") && data.email) contacts.push({ icon: Mail, value: data.email });
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [
            isFieldVisible(fv, "city") ? data.city : null,
            isFieldVisible(fv, "country") ? data.country : null,
        ].filter(Boolean).join(", ");
        if (loc) contacts.push({ icon: MapPin, value: loc });
    }

    return (
        <div className="flex items-start justify-between">
            <div>
                {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
                    <img
                        src={data.photoUrl}
                        alt=""
                        className="mb-2 h-16 w-16 rounded-full object-cover"
                    />
                )}
                {fullName && (
                    <h1 className="text-[26px] font-black tracking-wide" style={{ color: "var(--accent)" }}>
                        {fullName.toUpperCase()}
                    </h1>
                )}
                {jobTitle && (
                    <p className="mt-0.5 text-[12px] opacity-60">{jobTitle}</p>
                )}
            </div>
            {contacts.length > 0 && (
                <div className="flex flex-col items-end gap-1 pt-1">
                    {contacts.map(({ icon: Icon, value }, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] opacity-70">
                            <Icon className="h-3 w-3" />
                            <span>{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

function SummaryBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Summary</SectionHeading>
            <p className="text-[11px] leading-[1.65] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Experience — left date, right content
// ---------------------------------------------------------------------------

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const experiences = data.workExperiences?.filter((e) => e.visible !== false && (e.position || e.company)) ?? [];
    if (experiences.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Experience</SectionHeading>
            <div className="flex flex-col gap-4">
                {experiences.map((exp, i) => (
                    <div key={i} className="flex gap-6">
                        <p className="w-[140px] shrink-0 text-[10px] font-medium opacity-60">
                            {dateRange(exp.startDate, exp.endDate)}
                        </p>
                        <div className="flex-1">
                            {exp.position && (
                                <p className="text-[12px] font-bold">{exp.position}</p>
                            )}
                            {(exp.company || exp.location) && (
                                <p className="text-[10.5px] opacity-60">
                                    {[exp.company, exp.location].filter(Boolean).join(", ")}
                                </p>
                            )}
                            {exp.description && (
                                <div className="mt-2 text-[10.5px] leading-[1.65] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Education — left date, right content
// ---------------------------------------------------------------------------

function EducationBlock({ data }: { data: ResumeValues }) {
    const educations = data.educations?.filter((e) => e.visible !== false && (e.school || e.degree)) ?? [];
    if (educations.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Education</SectionHeading>
            <div className="flex flex-col gap-4">
                {educations.map((edu, i) => {
                    const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
                    const degreeStr = degreeParts.join(", ");
                    return (
                        <div key={i} className="flex gap-6">
                            <p className="w-[140px] shrink-0 text-[10px] font-medium opacity-60">
                                {fmtDate(edu.startDate)}
                            </p>
                            <div className="flex-1">
                                {degreeStr && (
                                    <p className="text-[12px] font-bold">{degreeStr}</p>
                                )}
                                {edu.school && (
                                    <p className="text-[10.5px] opacity-60">
                                        {[edu.school, edu.location].filter(Boolean).join(", ")}
                                    </p>
                                )}
                                {edu.fieldOfStudy && edu.degree && (
                                    <p className="text-[10.5px] opacity-60">{edu.degree}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Skills — two-column grid
// ---------------------------------------------------------------------------

function SkillsBlock({ data }: { data: ResumeValues }) {
    const skills = data.skills?.filter((s) => s.trim()) ?? [];
    if (skills.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Skills</SectionHeading>
            <div className="grid grid-cols-2 gap-y-1.5">
                {skills.map((skill, i) => (
                    <p key={i} className="text-[10.5px] opacity-90">
                        {skill}
                    </p>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Languages — two-column grid
// ---------------------------------------------------------------------------

function LanguagesBlock({ data }: { data: ResumeValues }) {
    const languages = data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ?? [];
    if (languages.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Languages</SectionHeading>
            <div className="grid grid-cols-2 gap-y-1.5">
                {languages.map((lang, i) => (
                    <p key={i} className="text-[10.5px] opacity-90">
                        {lang.language}{lang.proficiency ? ` — ${lang.proficiency}` : ""}
                    </p>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Projects — left date, right content
// ---------------------------------------------------------------------------

function ProjectsBlock({ data }: { data: ResumeValues }) {
    const projects = data.projects?.filter((p) => p.visible !== false && p.title?.trim()) ?? [];
    if (projects.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Projects</SectionHeading>
            <div className="flex flex-col gap-3">
                {projects.map((proj, i) => (
                    <div key={i} className="flex gap-6">
                        {proj.startDate && (
                            <p className="w-[140px] shrink-0 text-[10px] font-medium opacity-60">
                                {fmtDate(proj.startDate)}
                            </p>
                        )}
                        <div className="flex-1">
                            <p className="text-[12px] font-bold">{proj.title}</p>
                            {proj.description && (
                                <p className="mt-1 text-[10.5px] leading-[1.65] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(proj.description) }} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------

function CertificatesBlock({ data }: { data: ResumeValues }) {
    const certificates = data.certificates?.filter((c) => c.visible !== false && c.title?.trim()) ?? [];
    if (certificates.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Certificates</SectionHeading>
            <div className="flex flex-col gap-2">
                {certificates.map((cert, i) => (
                    <div key={i}>
                        <p className="text-[12px] font-bold">{cert.title}</p>
                        {cert.issuer && <p className="text-[10.5px] opacity-60">{cert.issuer}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------

function AwardsBlock({ data }: { data: ResumeValues }) {
    const awards = data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
    if (awards.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Awards</SectionHeading>
            <div className="flex flex-col gap-2">
                {awards.map((award, i) => (
                    <div key={i}>
                        <p className="text-[12px] font-bold">{award.title}</p>
                        {award.date && <p className="text-[10.5px] opacity-60">{fmtDate(award.date)}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

function CoursesBlock({ data }: { data: ResumeValues }) {
    const courses = data.courses?.filter((c) => c.visible !== false && c.name?.trim()) ?? [];
    if (courses.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Courses</SectionHeading>
            <div className="flex flex-col gap-2">
                {courses.map((course, i) => (
                    <div key={i}>
                        <p className="text-[12px] font-bold">{course.name}</p>
                        {course.institution && <p className="text-[10.5px] opacity-60">{course.institution}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------

function PublicationsBlock({ data }: { data: ResumeValues }) {
    const pubs = data.publications?.filter((p) => p.visible !== false && p.title?.trim()) ?? [];
    if (pubs.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Publications</SectionHeading>
            <div className="flex flex-col gap-2">
                {pubs.map((pub, i) => (
                    <div key={i}>
                        <p className="text-[12px] font-bold">{pub.title}</p>
                        {pub.publisher && <p className="text-[10.5px] opacity-60">{pub.publisher}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Interests
// ---------------------------------------------------------------------------

function InterestsBlock({ data }: { data: ResumeValues }) {
    const interests = data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
    if (interests.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Interests</SectionHeading>
            <div className="grid grid-cols-2 gap-y-1.5">
                {interests.map((interest, i) => (
                    <p key={i} className="text-[10.5px] opacity-90">
                        {interest.name}
                    </p>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

function ReferencesBlock({ data }: { data: ResumeValues }) {
    const references = data.references?.filter((r) => r.visible !== false && r.name?.trim()) ?? [];
    if (references.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>References</SectionHeading>
            <div className="flex flex-col gap-2">
                {references.map((ref, i) => (
                    <div key={i}>
                        <p className="text-[12px] font-bold">{ref.name}</p>
                        {ref.position && <p className="text-[10.5px] opacity-60">{ref.position}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Renderer map
// ---------------------------------------------------------------------------

const SECTION_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    profile: SummaryBlock,
    experience: ExperienceBlock,
    education: EducationBlock,
    skills: SkillsBlock,
    languages: LanguagesBlock,
    projects: ProjectsBlock,
    courses: CoursesBlock,
    publications: PublicationsBlock,
    awards: AwardsBlock,
    certificates: CertificatesBlock,
    interests: InterestsBlock,
    references: ReferencesBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function MinimalTemplate({
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

    return (
        <div
            className={className}
            style={{
                fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
                color: "#000000",
                "--accent": color,
            } as React.CSSProperties}
        >
            <div className="px-8 py-8">
                {/* Header */}
                {isSectionVisible(sv, "personal-info") && <HeaderBlock data={resumeData} />}

                {/* Sections */}
                {sectionOrder.map((key) => {
                    if (key === "personal-info") return null;
                    if (!isSectionVisible(sv, key)) return null;
                    const Renderer = SECTION_RENDERERS[key];
                    if (!Renderer) return null;
                    return <Renderer key={key} data={resumeData} />;
                })}

                {/* Render optional sections with data even if not in sectionOrder */}
                {!sectionOrder.includes("languages") && resumeData.languages?.some((l) => l.visible !== false && l.language?.trim()) && (
                    <LanguagesBlock data={resumeData} />
                )}
                {!sectionOrder.includes("projects") && resumeData.projects?.some((p) => p.visible !== false && p.title?.trim()) && (
                    <ProjectsBlock data={resumeData} />
                )}
                {!sectionOrder.includes("awards") && resumeData.awards?.some((a) => a.visible !== false && a.title?.trim()) && (
                    <AwardsBlock data={resumeData} />
                )}
                {!sectionOrder.includes("certificates") && resumeData.certificates?.some((c) => c.visible !== false && c.title?.trim()) && (
                    <CertificatesBlock data={resumeData} />
                )}
                {!sectionOrder.includes("courses") && resumeData.courses?.some((c) => c.visible !== false && c.name?.trim()) && (
                    <CoursesBlock data={resumeData} />
                )}
                {!sectionOrder.includes("publications") && resumeData.publications?.some((p) => p.visible !== false && p.title?.trim()) && (
                    <PublicationsBlock data={resumeData} />
                )}
                {!sectionOrder.includes("interests") && resumeData.interests?.some((i) => i.visible !== false && i.name?.trim()) && (
                    <InterestsBlock data={resumeData} />
                )}
                {!sectionOrder.includes("references") && resumeData.references?.some((r) => r.visible !== false && r.name?.trim()) && (
                    <ReferencesBlock data={resumeData} />
                )}
            </div>
        </div>
    );
}
