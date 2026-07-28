"use client";

import type { ResumeValues } from "@/lib/validation";
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Globe,
    Calendar,
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
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${m}/${y}`;
}

function dateRange(start?: string, end?: string): string {
    const s = fmtDate(start);
    const e = end ? fmtDate(end) : "Present";
    if (!s && e === "Present") return "";
    return `${s} - ${e}`;
}

// ---------------------------------------------------------------------------
// ExecutiveProTemplate — Two-column with dark navy header, photo in header,
//     section headings with underline, key achievements with icons,
//     skills with underlines
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

// ---------------------------------------------------------------------------
// Achievement icons (unique per entry)
// ---------------------------------------------------------------------------

const ACHIEVEMENT_ICONS = [
    // Pencil/edit
    (props: { className?: string }) => (
        <svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
    ),
    // Checkmark circle
    (props: { className?: string }) => (
        <svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    ),
    // Star outline
    (props: { className?: string }) => (
        <svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    ),
    // Trophy
    (props: { className?: string }) => (
        <svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    ),
];

// ---------------------------------------------------------------------------
// Section Heading — bold uppercase with underline
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-3 mt-5">
            <h3
                className="text-[13px] font-black uppercase tracking-wider"
                style={{ color: "var(--accent)" }}
            >
                {children}
            </h3>
            <div className="mt-1 h-[2px] w-full" style={{ backgroundColor: "var(--accent)" }} />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Header — dark navy bar with name, job title, contacts, photo
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;
    const showPhoto = isFieldVisible(fv, "photoUrl") && data.photoUrl;

    const leftContacts: { icon: React.ComponentType<{ className?: string }>; value: string }[] = [];
    const rightContacts: { icon: React.ComponentType<{ className?: string }>; value: string }[] = [];

    if (isFieldVisible(fv, "phone") && data.phone) leftContacts.push({ icon: Phone, value: data.phone });
    if (isFieldVisible(fv, "linkedin") && data.linkedin) leftContacts.push({ icon: Linkedin, value: data.linkedin });
    if (isFieldVisible(fv, "email") && data.email) rightContacts.push({ icon: Mail, value: data.email });
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [
            isFieldVisible(fv, "city") ? data.city : null,
            isFieldVisible(fv, "country") ? data.country : null,
        ].filter(Boolean).join(", ");
        if (loc) rightContacts.push({ icon: MapPin, value: loc });
    }
    if (isFieldVisible(fv, "website") && data.website) rightContacts.push({ icon: Globe, value: data.website });

    return (
        <div
            className="relative flex items-center justify-between px-8 py-6"
            style={{ backgroundColor: "var(--accent)" }}
        >
            <div className="flex-1 pr-4">
                {fullName && (
                    <h1 className="text-[28px] font-black uppercase tracking-wider text-white">
                        {fullName}
                    </h1>
                )}
                {jobTitle && (
                    <p className="mt-1 text-[12px] font-medium text-white/90">{jobTitle}</p>
                )}
                <div className="mt-3 flex gap-8">
                    <div className="flex flex-col gap-1.5">
                        {leftContacts.map(({ icon: Icon, value }, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <Icon className="h-3 w-3 shrink-0 text-white/70" />
                                <span className="text-[9.5px] text-white/80">{value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-1.5">
                        {rightContacts.map(({ icon: Icon, value }, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <Icon className="h-3 w-3 shrink-0 text-white/70" />
                                <span className="text-[9.5px] text-white/80">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {showPhoto && (
                <div className="h-[90px] w-[90px] shrink-0 overflow-hidden rounded-full border-3 border-white/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={data.photoUrl}
                        alt="Profile"
                        className="h-full w-full object-cover"
                    />
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Left Column Blocks
// ---------------------------------------------------------------------------

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const experiences = data.workExperiences?.filter((e) => e.visible !== false && (e.position || e.company)) ?? [];
    if (experiences.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Experience</SectionHeading>
            <div className="flex flex-col gap-4">
                {experiences.map((exp, i) => (
                    <div key={i}>
                        {exp.position && (
                            <p className="text-[12px] font-bold text-[#2d3436]">{exp.position}</p>
                        )}
                        {exp.company && (
                            <p className="text-[11px] font-semibold text-[#2d3436]">{exp.company}</p>
                        )}
                        <div className="mt-0.5 flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-[#9ca3af]" />
                                <span className="text-[9px] text-[#9ca3af]">
                                    {dateRange(exp.startDate, exp.endDate)}
                                </span>
                            </div>
                            {exp.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-[#9ca3af]" />
                                    <span className="text-[9px] text-[#9ca3af]">{exp.location}</span>
                                </div>
                            )}
                        </div>
                        {exp.description && (
                            <div dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} className="mt-1.5 text-[10px] leading-[1.6] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
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
                    const degreeStr = degreeParts.join(" in ");
                    return (
                        <div key={i}>
                            {degreeStr && (
                                <p className="text-[12px] font-bold text-[#2d3436]">{degreeStr}</p>
                            )}
                            {edu.school && (
                                <p className="text-[11px] font-semibold text-[#2d3436]">{edu.school}</p>
                            )}
                            <div className="mt-0.5 flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-[#9ca3af]" />
                                    <span className="text-[9px] text-[#9ca3af]">
                                        {fmtDate(edu.startDate)} - {fmtDate(edu.endDate)}
                                    </span>
                                </div>
                                {edu.location && (
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3 text-[#9ca3af]" />
                                        <span className="text-[9px] text-[#9ca3af]">{edu.location}</span>
                                    </div>
                                )}
                            </div>
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Skills</SectionHeading>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
                {skills.map((skill, i) => (
                    <div key={i} className="border-b-2 pb-0.5" style={{ borderColor: "var(--accent)" }}>
                        <p className="text-[10.5px] font-medium text-[#2d3436]">{skill}</p>
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Projects</SectionHeading>
            <div className="flex flex-col gap-3">
                {projects.map((proj, i) => (
                    <div key={i}>
                        <p className="text-[12px] font-bold text-[#2d3436]">{proj.title}</p>
                        {proj.description && (
                            <p dangerouslySetInnerHTML={{ __html: richTextHtml(proj.description) }} className="mt-1 text-[10px] leading-[1.6] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function LeftLanguagesBlock({ data }: { data: ResumeValues }) {
    const languages = data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ?? [];
    if (languages.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Languages</SectionHeading>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
                {languages.map((lang, i) => (
                    <div key={i}>
                        <span className="text-[10.5px] font-medium text-[#2d3436]">{lang.language}</span>
                        {lang.proficiency && (
                            <span className="ml-1 text-[9.5px] text-[#9ca3af]">— {lang.proficiency}</span>
                        )}
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Summary</SectionHeading>
            <p dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} className="text-[10.5px] leading-[1.65] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
        </div>
    );
}

function AchievementsBlock({ data }: { data: ResumeValues }) {
    const skills = data.skills?.filter((s) => s.trim()) ?? [];
    if (skills.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Key Achievements</SectionHeading>
            <div className="flex flex-col gap-3">
                {skills.map((skill, i) => {
                    const IconComp = ACHIEVEMENT_ICONS[i % ACHIEVEMENT_ICONS.length];
                    return (
                        <div key={i} className="flex gap-2">
                            <div className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
                                <IconComp className="" />
                            </div>
                            <div>
                                <p className="text-[10.5px] font-bold text-[#2d3436]">{skill}</p>
                            </div>
                        </div>
                    );
                })}
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
            <div className="flex flex-col gap-3">
                {courses.map((course, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold text-[#2d3436]">{course.name}</p>
                        {course.institution && (
                            <p className="mt-0.5 text-[9.5px] leading-[1.5] text-[#6b7280]">{course.institution}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PassionsBlock({ data }: { data: ResumeValues }) {
    const interests = data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
    if (interests.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Passions</SectionHeading>
            <div className="flex flex-col gap-3">
                {interests.map((interest, i) => {
                    const IconComp = ACHIEVEMENT_ICONS[i % ACHIEVEMENT_ICONS.length];
                    return (
                        <div key={i} className="flex gap-2">
                            <div className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }}>
                                <IconComp className="" />
                            </div>
                            <div>
                                <p className="text-[10.5px] font-bold text-[#2d3436]">{interest.name}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function AwardsBlock({ data }: { data: ResumeValues }) {
    const awards = data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
    if (awards.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Awards</SectionHeading>
            <div className="flex flex-col gap-2">
                {awards.map((award, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold text-[#2d3436]">{award.title}</p>
                        {award.date && <p className="text-[9px] text-[#9ca3af]">{fmtDate(award.date)}</p>}
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Certificates</SectionHeading>
            <div className="flex flex-col gap-2">
                {certificates.map((cert, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold text-[#2d3436]">{cert.title}</p>
                        {cert.issuer && <p className="text-[9px] text-[#9ca3af]">{cert.issuer}</p>}
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>References</SectionHeading>
            <div className="flex flex-col gap-2">
                {references.map((ref, i) => (
                    <div key={i}>
                        <p className="text-[11px] font-bold text-[#2d3436]">{ref.name}</p>
                        {ref.position && <p className="text-[9px] text-[#9ca3af]">{ref.position}</p>}
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
    experience: ExperienceBlock,
    education: EducationBlock,
    skills: SkillsBlock,
    languages: LeftLanguagesBlock,
    projects: ProjectsBlock,
};

const RIGHT_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    profile: SummaryBlock,
    courses: CoursesBlock,
    interests: PassionsBlock,
    awards: AwardsBlock,
    certificates: CertificatesBlock,
    references: ReferencesBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function ExecutiveProTemplate({
    resumeData,
    className,
    fontFamily,
}: TemplateProps) {
    const sectionOrder =
        resumeData.sectionOrder && resumeData.sectionOrder.length > 0
            ? resumeData.sectionOrder
            : DEFAULT_SECTION_ORDER;
    const sv = resumeData.sectionVisibility;
    const color = resumeData.colorHex || "#1a365d";

    const leftSections = ["experience", "education", "skills", "languages", "projects"];
    const rightSections = ["profile", "courses", "interests", "awards", "certificates", "references"];

    return (
        <div
            className={className}
            style={{
                fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
                color: "#2d3436",
                "--accent": color,
            } as React.CSSProperties}
        >
            {/* Header */}
            {isSectionVisible(sv, "personal-info") && <HeaderBlock data={resumeData} />}

            {/* Content */}
            <div className="grid min-h-full grid-cols-[55%_1fr] px-6 py-5">
                {/* Left Column */}
                <div className="flex flex-col pr-6">
                    {sectionOrder.map((key) => {
                        if (leftSections.includes(key) && isSectionVisible(sv, key)) {
                            const Renderer = LEFT_RENDERERS[key];
                            if (Renderer) return <Renderer key={key} data={resumeData} />;
                        }
                        return null;
                    })}

                    {/* Render optional sections with data even if not in sectionOrder */}
                    {!sectionOrder.includes("projects") && resumeData.projects?.some((p) => p.visible !== false && p.title?.trim()) && (
                        <ProjectsBlock data={resumeData} />
                    )}
                </div>

                {/* Right Column */}
                <div className="flex flex-col pl-2">
                    {sectionOrder.map((key) => {
                        if (rightSections.includes(key) && isSectionVisible(sv, key)) {
                            const Renderer = RIGHT_RENDERERS[key];
                            if (Renderer) return <Renderer key={key} data={resumeData} />;
                        }
                        return null;
                    })}

                    {/* Render optional sections with data even if not in sectionOrder */}
                    {!sectionOrder.includes("courses") && resumeData.courses?.some((c) => c.visible !== false && c.name?.trim()) && (
                        <CoursesBlock data={resumeData} />
                    )}
                    {!sectionOrder.includes("interests") && resumeData.interests?.some((i) => i.visible !== false && i.name?.trim()) && (
                        <PassionsBlock data={resumeData} />
                    )}
                    {!sectionOrder.includes("awards") && resumeData.awards?.some((a) => a.visible !== false && a.title?.trim()) && (
                        <AwardsBlock data={resumeData} />
                    )}
                    {!sectionOrder.includes("certificates") && resumeData.certificates?.some((c) => c.visible !== false && c.title?.trim()) && (
                        <CertificatesBlock data={resumeData} />
                    )}
                    {!sectionOrder.includes("references") && resumeData.references?.some((r) => r.visible !== false && r.name?.trim()) && (
                        <ReferencesBlock data={resumeData} />
                    )}
                </div>
            </div>
        </div>
    );
}
