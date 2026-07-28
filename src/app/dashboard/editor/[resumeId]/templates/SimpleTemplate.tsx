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
// Simple Template
// Split-date layout: dates in left margin column, clean minimal look,
// dot skill ratings, HR under section headings.
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
            <ContactItem key="email" icon={Mail}>{data.email}</ContactItem>,
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
        contactItems.push(<ContactItem key="li" icon={Linkedin}>{data.linkedin}</ContactItem>);
    }
    if (isFieldVisible(fv, "website") && data.website) {
        contactItems.push(<ContactItem key="web" icon={Globe}>{data.website}</ContactItem>);
    }

    if (!fullName && !jobTitle && contactItems.length === 0) return null;

    return (
        <div className="mb-[18px]">
            <div className="flex items-start gap-5">
                {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
                    <img
                        src={data.photoUrl}
                        alt=""
                        className="h-20 w-20 shrink-0 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <div className="flex flex-col gap-1">
                        <span className="text-[28px] font-bold leading-none tracking-tight" style={{ color: "var(--accent)" }}>
                            {fullName || "Your Name"}
                        </span>
                        {jobTitle && (
                            <span className="text-[14px] font-medium opacity-80">{jobTitle}</span>
                        )}
                    </div>
                    {contactItems.length > 0 && (
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] leading-snug text-current/75">
                            {contactItems}
                        </div>
                    )}
                </div>
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

function ExperienceBlock({ data }: { data: ResumeValues }) {
    const items = data.workExperiences?.filter((e) => e.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading>Professional Experience</SectionHeading>
            <div className="space-y-4">
                {items.map((exp, i) => (
                    <div
                        key={exp.id || i}
                        className="grid grid-cols-[90px_1fr] gap-x-4"
                        style={{ breakInside: "avoid" }}
                    >
                        <div className="pt-[1.5px] text-right text-[9.5px] font-medium opacity-70">
                            {dateRange(exp.startDate, exp.endDate) && (
                                <div>{dateRange(exp.startDate, exp.endDate)}</div>
                            )}
                            {exp.location && (
                                <div className="mt-0.5 opacity-80">{exp.location}</div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold">{exp.position || "Position"}</h4>
                            <div className="mb-1 text-[10.5px] italic opacity-80">
                                {exp.company}{exp.subheading && ` · ${exp.subheading}`}
                            </div>
                            {exp.description && (
                                <div className="space-y-[2px] text-[10px] leading-[1.5] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
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
                    <div
                        key={edu.id || i}
                        className="grid grid-cols-[90px_1fr] gap-x-4"
                        style={{ breakInside: "avoid" }}
                    >
                        <div className="pt-[1.5px] text-right text-[9.5px] font-medium opacity-70">
                            {dateRange(edu.startDate, edu.endDate) && (
                                <div>{dateRange(edu.startDate, edu.endDate)}</div>
                            )}
                            {edu.location && (
                                <div className="mt-0.5 opacity-80">{edu.location}</div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold">{edu.school || "School"}</h4>
                            <div className="text-[10.5px] italic opacity-80">
                                {edu.degree}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}
                            </div>
                            {edu.gpa && <p className="text-[10px] opacity-75">GPA: {edu.gpa}</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
    if (!data.skills || data.skills.length === 0) return null;
    return (
        <div>
            <SectionHeading>Skills</SectionHeading>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10.5px]">
                {data.skills.map((skill, i) => (
                    <div key={`${skill}-${i}`} className="flex items-center justify-between">
                        <span>{skill}</span>
                        <span className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((dot) => (
                                <span
                                    key={dot}
                                    className={`h-[6px] w-[6px] rounded-full ${
                                        dot <= 4 ? "bg-current" : "bg-current/20"
                                    }`}
                                />
                            ))}
                        </span>
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
            <SectionHeading>Languages</SectionHeading>
            <p className="text-[10.5px]">
                {items.map((l) => `${l.language || "Language"}${l.proficiency ? ` — ${l.proficiency}` : ""}`).join(" · ")}
            </p>
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

function ProjectsBlock({ data }: { data: ResumeValues }) {
    const items = data.projects?.filter((p) => p.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
            <SectionHeading>Projects</SectionHeading>
            <div className="space-y-3">
                {items.map((p, i) => (
                    <div
                        key={p.id || i}
                        className="grid grid-cols-[90px_1fr] gap-x-4"
                        style={{ breakInside: "avoid" }}
                    >
                        <div className="pt-[1.5px] text-right text-[9.5px] font-medium opacity-70">
                            {dateRange(p.startDate, p.endDate) && (
                                <div>{dateRange(p.startDate, p.endDate)}</div>
                            )}
                        </div>
                        <div>
                            <h4 className="text-[11px] font-bold">{p.title || "Project"}</h4>
                            {p.subtitle && <p className="text-[10.5px] italic opacity-80">{p.subtitle}</p>}
                            {p.description && (
                                <p className="mt-1 text-[10px] leading-[1.5] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(p.description) }} />
                            )}
                        </div>
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
        <div>
            <SectionHeading>Publications</SectionHeading>
            <div className="space-y-2">
                {items.map((p, i) => (
                    <div key={p.id || i} className="text-[10.5px]">
                        <p className="font-bold">{p.title || "Publication"}</p>
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
        <div>
            <SectionHeading>Certificates</SectionHeading>
            <div className="space-y-1.5">
                {items.map((c, i) => (
                    <div key={c.id || i} className="text-[10.5px]">
                        <p className="font-bold">{c.title || "Certificate"}</p>
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

function CoursesBlock({ data }: { data: ResumeValues }) {
    const items = data.courses?.filter((c) => c.visible !== false);
    if (!items || items.length === 0) return null;
    return (
        <div>
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
        <div>
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
        <div>
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
// Exported Simple Template
// ---------------------------------------------------------------------------

export default function SimpleTemplate({
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
