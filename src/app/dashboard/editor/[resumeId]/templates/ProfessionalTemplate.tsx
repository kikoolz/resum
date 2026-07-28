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
// Helpers (shared)
// ---------------------------------------------------------------------------

function isFieldVisible(
    fv: Record<string, boolean> | undefined,
    field: string,
): boolean {
    return fv?.[field] !== false;
}

function isSectionVisible(
    sv: Record<string, boolean> | undefined,
    key: string,
): boolean {
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
// Professional Template
// Classic single-column: centered serif name, HR under section headings,
// dates right-aligned, formal corporate look.
// ---------------------------------------------------------------------------

interface TemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <div className="mb-[6px] mt-[14px] flex items-baseline gap-2">
            <h3 className="whitespace-nowrap text-[11.5px] font-bold uppercase tracking-[0.08em]" style={{ color: "var(--accent)" }}>
                {children}
            </h3>
            <div className="h-px flex-1 opacity-80" style={{ backgroundColor: "var(--accent)" }} />
        </div>
    );
}

function ContactItem({
    icon: Icon,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <span className="inline-flex items-center gap-[4px]">
            <Icon className="h-[10px] w-[10px] shrink-0 opacity-70" />
            <span>{children}</span>
        </span>
    );
}

function HeaderBlock({ data }: { data: ResumeValues }) {
    const fv = data.fieldVisibility;
    const firstName = isFieldVisible(fv, "firstName") ? data.firstName : undefined;
    const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

    const contactItems: React.ReactNode[] = [];
    if (isFieldVisible(fv, "email") && data.email) {
        contactItems.push(
            <ContactItem key="email" icon={Mail}>
                <a href={`mailto:${data.email}`} className="underline decoration-current/40 hover:decoration-current">{data.email}</a>
            </ContactItem>,
        );
    }
    if (isFieldVisible(fv, "phone") && data.phone) {
        contactItems.push(<ContactItem key="phone" icon={Phone}>{data.phone}</ContactItem>);
    }
    if ((isFieldVisible(fv, "city") && data.city) || (isFieldVisible(fv, "country") && data.country)) {
        const loc = [isFieldVisible(fv, "city") ? data.city : null, isFieldVisible(fv, "country") ? data.country : null].filter(Boolean).join(", ");
        if (loc) contactItems.push(<ContactItem key="loc" icon={MapPin}>{loc}</ContactItem>);
    }
    if (isFieldVisible(fv, "linkedin") && data.linkedin) {
        contactItems.push(
            <ContactItem key="li" icon={Linkedin}>
                <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="underline decoration-current/40 hover:decoration-current">{data.linkedin}</a>
            </ContactItem>,
        );
    }
    if (isFieldVisible(fv, "website") && data.website) {
        contactItems.push(
            <ContactItem key="web" icon={Globe}>
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="underline decoration-current/40 hover:decoration-current">{data.website}</a>
            </ContactItem>,
        );
    }

    if (!fullName && !jobTitle && contactItems.length === 0) return null;

    return (
        <div className="mb-[18px] text-center">
            {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
                <img
                    src={data.photoUrl}
                    alt=""
                    className="mx-auto mb-3 h-24 w-24 rounded-full object-cover"
                />
            )}
            <h1 className="mb-2 text-[28px] font-bold leading-none tracking-tight" style={{ color: "var(--accent)" }}>
                {fullName || "Your Name"}
            </h1>
            {jobTitle && (
                <p className="mb-3 text-[14px] font-medium text-current/80">{jobTitle}</p>
            )}
            {contactItems.length > 0 && (
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] leading-snug text-current/75">
                    {contactItems}
                </div>
            )}
        </div>
    );
}

function ProfileBlock({ data }: { data: ResumeValues }) {
    if (!data.summary) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Summary</SectionHeading>
            <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
        </div>
    );
}

function EducationBlock({ data }: { data: ResumeValues }) {
    const items = data.educations?.filter((e) => e.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading>Education</SectionHeading>
            <div className="space-y-3">
                {items.map((edu, i) => (
                    <div key={edu.id || i} style={{ breakInside: "avoid" }}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                            <h4 className="text-[11px] font-bold">
                                {edu.school || "School"}
                            </h4>
                            {dateRange(edu.startDate, edu.endDate) && (
                                <span className="text-[10px] font-medium opacity-70">
                                    {dateRange(edu.startDate, edu.endDate)}
                                </span>
                            )}
                        </div>
                        <div className="mb-0.5 text-[10.5px]">
                            <span className="font-medium italic opacity-90">{edu.degree}</span>
                            {edu.fieldOfStudy && <span className="opacity-90"> in {edu.fieldOfStudy}</span>}
                            {edu.gpa && <span className="ml-2 opacity-75">GPA: {edu.gpa}</span>}
                        </div>
                        {edu.description && (
                            <p className="text-[10px] leading-[1.5] opacity-85 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(edu.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const items = data.workExperiences?.filter((e) => e.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading>Work Experience</SectionHeading>
            <div className="space-y-4">
                {items.map((exp, i) => (
                    <div key={exp.id || i} style={{ breakInside: "avoid" }}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                            <h4 className="text-[11px] font-bold">{exp.position || "Position"}</h4>
                            {dateRange(exp.startDate, exp.endDate) && (
                                <span className="text-[10px] font-medium opacity-70">
                                    {dateRange(exp.startDate, exp.endDate)}
                                </span>
                            )}
                        </div>
                        <div className="mb-1 flex flex-wrap items-center justify-between gap-x-2 text-[10.5px]">
                            <span className="font-semibold italic opacity-90">
                                {exp.company}{exp.subheading && ` · ${exp.subheading}`}
                            </span>
                            {exp.location && <span className="opacity-70">{exp.location}</span>}
                        </div>
                        {exp.description && (
                            <div className="space-y-[2px] text-[10px] leading-[1.5] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
    if (!data.skills || data.skills.length === 0) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Technical Expertise</SectionHeading>
            <p className="text-[10.5px] leading-[1.6]">
                {data.skills.join(", ")}
            </p>
        </div>
    );
}

function ProjectsBlock({ data }: { data: ResumeValues }) {
    const items = data.projects?.filter((p) => p.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading>Projects</SectionHeading>
            <div className="space-y-3">
                {items.map((p, i) => (
                    <div key={p.id || i} style={{ breakInside: "avoid" }}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                            <h4 className="text-[11px] font-bold">{p.title || "Project"}</h4>
                            {dateRange(p.startDate, p.endDate) && (
                                <span className="text-[10px] font-medium opacity-70">
                                    {dateRange(p.startDate, p.endDate)}
                                </span>
                            )}
                        </div>
                        {p.subtitle && <p className="mb-0.5 text-[10.5px] font-medium italic opacity-85">{p.subtitle}</p>}
                        {p.description && (
                            <div className="space-y-[2px] text-[10px] leading-[1.5] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(p.description) }} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AwardsBlock({ data }: { data: ResumeValues }) {
    const items = data.awards?.filter((a) => a.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Awards</SectionHeading>
            <div className="space-y-2">
                {items.map((a, i) => (
                    <div key={a.id || i} className="text-[10.5px]">
                        <p className="font-bold leading-snug">{a.title || "Award"}</p>
                        {a.issuer && <p className="italic opacity-80">{a.issuer}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PublicationsBlock({ data }: { data: ResumeValues }) {
    const items = data.publications?.filter((p) => p.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-2">
                {items.map((p, i) => (
                    <div key={p.id || i} className="text-[10.5px]">
                        <p className="font-bold leading-snug">
                            {p.title || "Publication"}
                            {p.date && <span className="ml-2 font-normal opacity-70">({fmtDate(p.date)})</span>}
                        </p>
                        {(p.publisher || p.authors) && (
                            <p className="italic opacity-80">{[p.authors, p.publisher].filter(Boolean).join(" · ")}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CertificatesBlock({ data }: { data: ResumeValues }) {
    const items = data.certificates?.filter((c) => c.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Certificates</SectionHeading>
            <div className="space-y-1.5">
                {items.map((c, i) => (
                    <div key={c.id || i} className="text-[10.5px]">
                        <p className="font-bold leading-snug">{c.title || "Certificate"}</p>
                        <div className="flex gap-2 text-[9.5px] opacity-75">
                            {c.date && <span>{fmtDate(c.date)}</span>}
                            {c.issuer && <span>{c.issuer}</span>}
                        </div>
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
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Languages</SectionHeading>
            <div className="flex flex-col gap-1 text-[10px]">
                {items.map((l, i) => (
                    <div key={l.id || i} className="flex justify-between">
                        <span className="font-semibold">{l.language || "Language"}</span>
                        {l.proficiency && <span className="opacity-75">{l.proficiency}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function CoursesBlock({ data }: { data: ResumeValues }) {
    const items = data.courses?.filter((c) => c.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Courses</SectionHeading>
            <div className="space-y-1 text-[10.5px]">
                {items.map((c, i) => (
                    <div key={c.id || i}>
                        <span className="font-bold">{c.name || "Course"}</span>
                        {c.institution && <span className="italic opacity-80"> — {c.institution}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReferencesBlock({ data }: { data: ResumeValues }) {
    const items = data.references?.filter((r) => r.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>References</SectionHeading>
            <div className="space-y-2 text-[10.5px]">
                {items.map((r, i) => (
                    <div key={r.id || i}>
                        <p className="font-bold">{r.name || "Reference"}</p>
                        <p className="opacity-80">{[r.position, r.company].filter(Boolean).join(" at ")}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function InterestsBlock({ data }: { data: ResumeValues }) {
    const items = data.interests?.filter((i) => i.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div style={{ breakInside: "avoid" }}>
            <SectionHeading>Interests</SectionHeading>
            <p className="text-[10.5px]">{items.map((i) => i.name).filter(Boolean).join(" · ")}</p>
        </div>
    );
}

const BLOCK_RENDERERS: Record<string, (props: { data: ResumeValues }) => React.ReactNode> = {
    profile: ProfileBlock,
    experience: ExperienceBlock,
    education: EducationBlock,
    skills: SkillsBlock,
    projects: ProjectsBlock,
    awards: AwardsBlock,
    publications: PublicationsBlock,
    certificates: CertificatesBlock,
    languages: LanguagesBlock,
    courses: CoursesBlock,
    references: ReferencesBlock,
    interests: InterestsBlock,
};

// ---------------------------------------------------------------------------
// Exported Professional Template
// ---------------------------------------------------------------------------

export default function ProfessionalTemplate({
    resumeData,
    className,
    fontFamily,
}: TemplateProps) {
    const sectionOrder =
        resumeData.sectionOrder && resumeData.sectionOrder.length > 0
            ? resumeData.sectionOrder
            : DEFAULT_SECTION_ORDER;
    const sv = resumeData.sectionVisibility;

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
            {isSectionVisible(sv, "personal-info") && <HeaderBlock data={resumeData} />}

            {sectionOrder.map((key) => {
                if (key === "personal-info") return null;
                if (!isSectionVisible(sv, key)) return null;
                const Renderer = BLOCK_RENDERERS[key];
                if (!Renderer) return null;
                return <Renderer key={key} data={resumeData} />;
            })}
        </div>
    );
}
