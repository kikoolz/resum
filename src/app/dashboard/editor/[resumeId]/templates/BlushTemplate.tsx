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

function fmtDateWord(d?: string): string {
    if (!d) return "";
    const date = new Date(d);
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const y = date.getFullYear();
    const m = months[date.getMonth()];
    return `${m} ${y}`;
}

function dateRangeWord(start?: string, end?: string): string {
    const s = fmtDateWord(start);
    const e = end ? fmtDateWord(end) : "CURRENT";
    if (!s && e === "CURRENT") return "";
    return `${s} – ${e}`;
}

// ---------------------------------------------------------------------------
// Blush Template
// Two-column with pink blush gradient behind name, elegant serif headings,
// pink star icons next to section titles, pink bullet points.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

const PINK_ACCENT = "#D4A0B0";
const BG_COLOR = "#FFF8F8";

function PinkStar() {
    return (
        <span className="ml-2 text-[14px]" style={{ color: PINK_ACCENT }}>
            ✦
        </span>
    );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-3 mt-6 flex items-center">
            <h3
                className="text-[16px] font-normal italic"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: "#1a1a1a" }}
            >
                {children}
            </h3>
            <PinkStar />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

    return (
        <div className="relative">
            {/* Pink blush gradient */}
            <div
                className="absolute -left-10 -top-10 h-[200px] w-[200px] rounded-full opacity-40 blur-3xl"
                style={{ background: `radial-gradient(circle, ${PINK_ACCENT} 0%, transparent 70%)` }}
            />
            <div className="relative z-10 py-6 pl-4">
                {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
                    <img
                        src={data.photoUrl}
                        alt=""
                        className="mb-3 h-20 w-20 rounded-full object-cover"
                    />
                )}
                {fullName && (
                    <h1
                        className="text-[42px] font-bold leading-[0.95] tracking-tight"
                        style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: "#1a1a1a" }}
                    >
                        {fullName}
                    </h1>
                )}
                {jobTitle && (
                    <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#1a1a1a]/70">
                        {jobTitle}
                    </p>
                )}
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Contact Box (top right)
// ---------------------------------------------------------------------------

function ContactBox({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const items: { icon: React.ComponentType<{ className?: string }>; value: string }[] = [];

    if (isFieldVisible(fv, "phone") && data.phone) {
        items.push({ icon: Phone, value: data.phone });
    }
    if (isFieldVisible(fv, "email") && data.email) {
        items.push({ icon: Mail, value: data.email });
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
        <div className="rounded-sm border border-[#1a1a1a]/20 py-1">
            {items.map(({ icon: Icon, value }, i) => (
                <div key={i}>
                    <div className="flex items-center gap-2 px-3 py-2">
                        <Icon className="h-3 w-3 shrink-0 opacity-60" />
                        <span className="text-[10px]">{value}</span>
                    </div>
                    {i < items.length - 1 && <div className="mx-3 h-px bg-[#1a1a1a]/10" />}
                </div>
            ))}
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
            <div className="flex flex-col gap-5">
                {experiences.map((exp, i) => (
                    <div key={i}>
                        <p className="text-[10px] font-bold uppercase tracking-wider">
                            {dateRangeWord(exp.startDate, exp.endDate)}
                        </p>
                        {exp.position && (
                            <p className="mt-1 text-[11px] font-bold uppercase">{exp.position}</p>
                        )}
                        {(exp.company || exp.location) && (
                            <p className="text-[10px] opacity-70">
                                {[exp.company, exp.location].filter(Boolean).join(", ")}
                            </p>
                        )}
                        {exp.description && (
                            <div dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} className="mt-2 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
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
            <div className="flex flex-col gap-4">
                {educations.map((edu, i) => {
                    const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
                    const degreeStr = degreeParts.join(", ");
                    return (
                        <div key={i}>
                            <p className="text-[10px] font-bold uppercase tracking-wider">
                                {dateRangeWord(edu.startDate, edu.endDate)}
                            </p>
                            {degreeStr && (
                                <p className="mt-1 text-[11px] font-bold uppercase">{degreeStr}</p>
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

// ---------------------------------------------------------------------------
// Right Column Blocks
// ---------------------------------------------------------------------------

function SummaryBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Summary</SectionHeading>
            <p dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
        </div>
    );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
    const skills = data.skills?.filter((s) => s.trim()) ?? [];
    if (skills.length === 0) return null;

    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Skills</SectionHeading>
            <ul className="flex flex-col gap-1.5">
                {skills.map((skill, i) => (
                    <li key={i} className="text-[10.5px] leading-snug">
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Languages</SectionHeading>
            <ul className="flex flex-col gap-1.5">
                {languages.map((lang, i) => (
                    <li key={i} className="text-[10.5px] leading-snug">
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Interests</SectionHeading>
            <ul className="flex flex-col gap-1.5">
                {interests.map((interest, i) => (
                    <li key={i} className="text-[10.5px] leading-snug">
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Awards</SectionHeading>
            <div className="flex flex-col gap-2">
                {awards.map((award, i) => (
                    <div key={i}>
                        <p className="text-[10.5px] font-bold leading-snug">{award.title}</p>
                        {award.date && <p className="text-[9px] opacity-70">{fmtDateWord(award.date)}</p>}
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
                        <p className="text-[10.5px] font-bold leading-snug">{cert.title}</p>
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>References</SectionHeading>
            <div className="flex flex-col gap-2">
                {references.map((ref, i) => (
                    <div key={i}>
                        <p className="text-[10.5px] font-bold leading-snug">{ref.name}</p>
                        {ref.position && <p className="text-[9px] opacity-70">{ref.position}</p>}
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

const LEFT_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    experience: ExperienceBlock,
    education: EducationBlock,
    projects: ProjectsBlock,
    courses: CoursesBlock,
    publications: PublicationsBlock,
};

const RIGHT_RENDERERS: Record<string, React.ComponentType<{ data: ResumeValues }>> = {
    profile: SummaryBlock,
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

export default function BlushTemplate({
    resumeData,
    className,
    fontFamily,
}: TemplateProps) {
    const sectionOrder =
        resumeData.sectionOrder && resumeData.sectionOrder.length > 0
            ? resumeData.sectionOrder
            : DEFAULT_SECTION_ORDER;
    const sv = resumeData.sectionVisibility;
    const color = resumeData.colorHex || "#1a1a1a";

    const leftSections = ["experience", "education", "projects", "courses", "publications"];
    const rightSections = ["personal-info", "profile", "skills", "languages", "interests", "awards", "certificates", "references"];

    return (
        <div
            className={`${className ?? ""} min-h-full`}
            style={{
                fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
                color: "#1a1a1a",
                backgroundColor: `color-mix(in srgb, ${color} 8%, white)`,
            }}
        >
            {/* Top row: Name (left) + Contact box (right) */}
            <div className="grid grid-cols-[55%_1fr] border-b border-[#1a1a1a]/15">
                <div className="px-4">
                    <HeaderBlock data={resumeData} />
                </div>
                <div className="px-4 py-6">
                    <ContactBox data={resumeData} />
                </div>
            </div>

            {/* Body: two-column */}
            <div className="grid h-full grid-cols-[55%_1fr]">
                {/* Left Column */}
                <div className="flex flex-col border-r border-[#1a1a1a]/15 px-4 pb-6">
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
                <div className="flex flex-col px-4 pb-6">
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
