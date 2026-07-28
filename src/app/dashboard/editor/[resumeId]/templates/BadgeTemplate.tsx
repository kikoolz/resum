"use client";

import type { ResumeValues } from "@/lib/validation";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { DEFAULT_SECTION_ORDER } from "../sectionConfig";
import { richTextHtml } from "@/lib/rich-text";

// ---------------------------------------------------------------------------
// Helpers
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
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
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
// Badge Template
// Single-column, serif name, gray badge section headings, gray badge date
// ranges, skills as rounded pills, clean minimal design.
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-6">
      <span
        className="inline-block px-3 py-1 text-[12px] font-black uppercase tracking-wider"
        style={{
          backgroundColor: "var(--accent-bg, #E5E5E5)",
          color: "var(--accent-text, #1a1a1a)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

function DateBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block px-2.5 py-0.5 text-[9.5px] font-medium"
      style={{ backgroundColor: "#6B7280", color: "white" }}
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const firstName = isFieldVisible(fv, "firstName")
    ? data.firstName
    : undefined;
  const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

  const contactParts: string[] = [];
  if (
    (isFieldVisible(fv, "city") && data.city) ||
    (isFieldVisible(fv, "country") && data.country)
  ) {
    const loc = [
      isFieldVisible(fv, "city") ? data.city : null,
      isFieldVisible(fv, "country") ? data.country : null,
    ]
      .filter(Boolean)
      .join(", ");
    if (loc) contactParts.push(loc);
  }
  if (isFieldVisible(fv, "phone") && data.phone) {
    contactParts.push(data.phone);
  }
  if (isFieldVisible(fv, "email") && data.email) {
    contactParts.push(data.email);
  }
  if (isFieldVisible(fv, "linkedin") && data.linkedin) {
    contactParts.push(data.linkedin);
  }
  if (isFieldVisible(fv, "website") && data.website) {
    contactParts.push(data.website);
  }

  return (
    <div className="mb-4">
      {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
        <img
          src={data.photoUrl}
          alt=""
          className="mb-3 h-20 w-20 rounded-full object-cover"
        />
      )}
      <div className="flex items-baseline justify-between">
        {fullName && (
          <h1
            className="text-[28px] font-bold tracking-tight"
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              color: "var(--accent)",
            }}
          >
            {fullName}
          </h1>
        )}
        {jobTitle && (
          <p className="text-[11px] font-medium opacity-70">{jobTitle}</p>
        )}
      </div>
      {contactParts.length > 0 && (
        <>
          <div className="my-3 h-px w-full bg-[#1a1a1a]/15" />
          <p className="text-center text-[9.5px] opacity-70">
            {contactParts.join(" • ")}
          </p>
        </>
      )}
      <div className="mt-3 h-px w-full bg-[#1a1a1a]/15" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Body Blocks
// ---------------------------------------------------------------------------

function SummaryBlock({ data }: { data: ResumeValues }) {
  if (!data.summary) return null;
  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Summary</SectionHeading>
      <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/10" />
    </div>
  );
}

function ExperienceBlock({ data }: { data: ResumeValues }) {
  const experiences =
    data.workExperiences?.filter(
      (e) => e.visible !== false && (e.position || e.company),
    ) ?? [];
  if (experiences.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Experience</SectionHeading>
      <div className="flex flex-col gap-4">
        {experiences.map((exp, i) => (
          <div key={i}>
            <DateBadge>{dateRange(exp.startDate, exp.endDate)}</DateBadge>
            {(exp.position || exp.company) && (
              <p className="mt-2 text-[11px] font-bold">
                {exp.position || "Position"}
                {exp.location ? ` | ${exp.location}` : ""}
                {exp.company ? `, ${exp.company}` : ""}
              </p>
            )}
            {exp.description && (
              <div className="mt-2 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/10" />
    </div>
  );
}

function EducationBlock({ data }: { data: ResumeValues }) {
  const educations =
    data.educations?.filter(
      (e) => e.visible !== false && (e.school || e.degree),
    ) ?? [];
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
              <DateBadge>{dateRange(edu.startDate, edu.endDate)}</DateBadge>
              {degreeStr && (
                <p className="mt-2 text-[11px] font-bold">{degreeStr}</p>
              )}
              {edu.school && (
                <p className="text-[10px] opacity-70">
                  {edu.school}
                  {edu.location ? `, ${edu.location}` : ""}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/10" />
    </div>
  );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Skills</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="border border-[#1a1a1a]/20 px-3 py-1 text-[10px]"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

function LanguagesBlock({ data }: { data: ResumeValues }) {
  const languages =
    data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ??
    [];
  if (languages.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Languages</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang, i) => (
          <span
            key={i}
            className="rounded-full border border-[#1a1a1a]/20 px-3 py-1 text-[10px]"
          >
            {lang.language}
            {lang.proficiency ? ` — ${lang.proficiency}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

function InterestsBlock({ data }: { data: ResumeValues }) {
  const interests =
    data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
  if (interests.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Interests</SectionHeading>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, i) => (
          <span
            key={i}
            className="rounded-full border border-[#1a1a1a]/20 px-3 py-1 text-[10px]"
          >
            {interest.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function AwardsBlock({ data }: { data: ResumeValues }) {
  const awards =
    data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
  if (awards.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Awards</SectionHeading>
      <div className="flex flex-col gap-2">
        {awards.map((award, i) => (
          <div key={i}>
            <p className="text-[10.5px] font-bold leading-snug">
              {award.title}
            </p>
            {award.date && (
              <p className="text-[9px] opacity-70">{fmtDate(award.date)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CertificatesBlock({ data }: { data: ResumeValues }) {
  const certificates =
    data.certificates?.filter((c) => c.visible !== false && c.title?.trim()) ??
    [];
  if (certificates.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Certificates</SectionHeading>
      <div className="flex flex-col gap-2">
        {certificates.map((cert, i) => (
          <div key={i}>
            <p className="text-[10.5px] font-bold leading-snug">{cert.title}</p>
            {cert.issuer && (
              <p className="text-[9px] opacity-70">{cert.issuer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferencesBlock({ data }: { data: ResumeValues }) {
  const references =
    data.references?.filter((r) => r.visible !== false && r.name?.trim()) ?? [];
  if (references.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>References</SectionHeading>
      <div className="flex flex-col gap-2">
        {references.map((ref, i) => (
          <div key={i}>
            <p className="text-[10.5px] font-bold leading-snug">{ref.name}</p>
            {ref.position && (
              <p className="text-[9px] opacity-70">{ref.position}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsBlock({ data }: { data: ResumeValues }) {
  const projects =
    data.projects?.filter((p) => p.visible !== false && p.title?.trim()) ?? [];
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
  const courses =
    data.courses?.filter((c) => c.visible !== false && c.name?.trim()) ?? [];
  if (courses.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Courses</SectionHeading>
      <div className="flex flex-col gap-2">
        {courses.map((course, i) => (
          <div key={i}>
            <p className="text-[11px] font-bold">{course.name}</p>
            {course.institution && (
              <p className="text-[10px] opacity-70">{course.institution}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicationsBlock({ data }: { data: ResumeValues }) {
  const pubs =
    data.publications?.filter((p) => p.visible !== false && p.title?.trim()) ??
    [];
  if (pubs.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Publications</SectionHeading>
      <div className="flex flex-col gap-2">
        {pubs.map((pub, i) => (
          <div key={i}>
            <p className="text-[11px] font-bold">{pub.title}</p>
            {pub.publisher && (
              <p className="text-[10px] opacity-70">{pub.publisher}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Renderer map
// ---------------------------------------------------------------------------

const BLOCK_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
  profile: SummaryBlock,
  experience: ExperienceBlock,
  education: EducationBlock,
  skills: SkillsBlock,
  languages: LanguagesBlock,
  interests: InterestsBlock,
  awards: AwardsBlock,
  certificates: CertificatesBlock,
  references: ReferencesBlock,
  projects: ProjectsBlock,
  courses: CoursesBlock,
  publications: PublicationsBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function BadgeTemplate({
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
      style={
        {
          fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
          color: "#000000",
          "--accent": color,
          "--accent-bg": `color-mix(in srgb, ${color} 15%, #E5E5E5)`,
          "--accent-text": color,
        } as React.CSSProperties
      }
    >
      <div className="px-8 py-6">
        {/* Header */}
        {isSectionVisible(sv, "personal-info") && (
          <HeaderBlock data={resumeData} />
        )}

        {/* Body sections */}
        {sectionOrder.map((key) => {
          if (key === "personal-info") return null;
          if (!isSectionVisible(sv, key)) return null;
          const Renderer = BLOCK_RENDERERS[key];
          if (!Renderer) return null;
          return <Renderer key={key} data={resumeData} />;
        })}

        {/* Render optional sections with data even if not in sectionOrder */}
        {!sectionOrder.includes("languages") &&
          resumeData.languages?.some(
            (l) => l.visible !== false && l.language?.trim(),
          ) && <LanguagesBlock data={resumeData} />}
      </div>
    </div>
  );
}
