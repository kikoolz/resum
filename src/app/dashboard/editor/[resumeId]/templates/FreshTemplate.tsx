"use client";

import type { ResumeValues } from "@/lib/validation";
import { Mail, Phone, MapPin, Linkedin, Globe, Clock } from "lucide-react";
import { richTextHtml } from "@/lib/rich-text";
import { DEFAULT_SECTION_ORDER } from "../sectionConfig";

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
  const e = end ? fmtDate(end) : "Current";
  if (!s && e === "Current") return "";
  return `${s} · ${e}`;
}

// ---------------------------------------------------------------------------
// Fresh Template
// Light yellow-green background, two-column header (name left, details right),
// single-column body with star icons on section headings.
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

const BG_COLOR = "#F0F5E0";

function StarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="opacity-50"
    >
      <path d="M12 2L12 22M2 12L22 12M4.93 4.93L19.07 19.07M19.07 4.93L4.93 19.07" />
    </svg>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-6">
      <div className="flex items-center justify-between">
        <h3
          className="text-[16px] font-bold"
          style={{ color: "var(--accent)" }}
        >
          {children}
        </h3>
        <StarIcon />
      </div>
      <div className="mt-1 h-px w-full bg-[#1a1a1a]/30" />
    </div>
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
  const fullName = [firstName, lastName].filter(Boolean).join("\n");
  const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

  return (
    <div>
      {isFieldVisible(fv, "photoUrl") && data.photoUrl && (
        <img
          src={data.photoUrl}
          alt=""
          className="mb-3 h-20 w-20 rounded-full object-cover"
        />
      )}
      {fullName && (
        <h1
          className="text-[36px] font-bold leading-[1.05] tracking-tight whitespace-pre-line"
          style={{ color: "var(--accent)" }}
        >
          {fullName}
        </h1>
      )}
      {jobTitle && (
        <div className="mt-2 flex items-center gap-2 text-[11px] opacity-70">
          <Clock className="h-3 w-3" />
          <span>{jobTitle}</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Details Box (top right)
// ---------------------------------------------------------------------------

function DetailsBox({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const items: { label: string; value: string }[] = [];

  if (isFieldVisible(fv, "phone") && data.phone) {
    items.push({ label: "Phone", value: data.phone });
  }
  if (isFieldVisible(fv, "email") && data.email) {
    items.push({ label: "Email", value: data.email });
  }
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
    if (loc) items.push({ label: "Location", value: loc });
  }
  if (isFieldVisible(fv, "linkedin") && data.linkedin) {
    items.push({ label: "LinkedIn", value: data.linkedin });
  }
  if (isFieldVisible(fv, "website") && data.website) {
    items.push({ label: "Website", value: data.website });
  }

  if (items.length === 0) return null;

  return (
    <div>
      <h3
        className="mb-2 text-[14px] font-bold"
        style={{ color: "var(--accent)" }}
      >
        Details
      </h3>
      <div className="flex flex-col">
        {items.map(({ label, value }, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between py-1.5">
              <span className="text-[11px] opacity-70">{label}</span>
              <span className="text-[11px] font-medium">{value}</span>
            </div>
            {i < items.length - 1 && (
              <div className="h-px w-full bg-[#1a1a1a]/20" />
            )}
          </div>
        ))}
      </div>
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
      <p dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
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
            <p className="text-[10px] opacity-70">
              {dateRange(exp.startDate, exp.endDate)}
            </p>
            {exp.company && (
              <p className="mt-1 text-[12px] font-bold">{exp.company}</p>
            )}
            {exp.position && (
              <p className="text-[10.5px] opacity-70">
                {exp.position}
                {exp.location ? `, ${exp.location}` : ""}
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
              <p className="text-[10px] opacity-70">
                {dateRange(edu.startDate, edu.endDate)}
              </p>
              {degreeStr && (
                <p className="mt-1 text-[12px] font-bold">{degreeStr}</p>
              )}
              {edu.school && (
                <p className="text-[10.5px] opacity-70">{edu.school}</p>
              )}
              {edu.description && (
                <p dangerouslySetInnerHTML={{ __html: richTextHtml(edu.description) }} className="mt-1 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
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
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Skills</SectionHeading>
      <ul className="flex flex-col gap-1.5">
        {skills.map((skill, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-[10.5px] leading-snug"
          >
            <span>•</span>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
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
      <ul className="flex flex-col gap-1.5">
        {languages.map((lang, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-[10.5px] leading-snug"
          >
            <span>•</span>
            <span>
              {lang.language}
              {lang.proficiency ? ` — ${lang.proficiency}` : ""}
            </span>
          </li>
        ))}
      </ul>
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
      <ul className="flex flex-col gap-1.5">
        {interests.map((interest, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-[10.5px] leading-snug"
          >
            <span>•</span>
            <span>{interest.name}</span>
          </li>
        ))}
      </ul>
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
              <p dangerouslySetInnerHTML={{ __html: richTextHtml(proj.description) }} className="mt-1 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" />
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
// Exported component
// ---------------------------------------------------------------------------

export default function FreshTemplate({
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

  const bodySections = [
    "profile",
    "experience",
    "education",
    "skills",
    "projects",
    "courses",
    "publications",
    "languages",
    "interests",
    "awards",
    "certificates",
    "references",
  ];

  return (
    <div
      className={className}
      style={
        {
          fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
          color: "#1a1a1a",
          backgroundColor: `color-mix(in srgb, ${color} 8%, #F5F8E8)`,
          "--accent": color,
        } as React.CSSProperties
      }
    >
      {/* Header: Name + Job Title (left) | Details (right) */}
      <div className="grid grid-cols-[55%_1fr] border-b border-[#1a1a1a]/15">
        <div className="px-6 py-6">
          <HeaderBlock data={resumeData} />
        </div>
        <div className="px-6 py-6">
          <DetailsBox data={resumeData} />
        </div>
      </div>

      {/* Body: single-column */}
      <div className="px-6 pb-6">
        {sectionOrder.map((key) => {
          if (key === "personal-info") return null;
          if (bodySections.includes(key) && isSectionVisible(sv, key)) {
            const RENDERERS: Record<
              string,
              React.ComponentType<{ data: ResumeValues }>
            > = {
              profile: SummaryBlock,
              experience: ExperienceBlock,
              education: EducationBlock,
              skills: SkillsBlock,
              projects: ProjectsBlock,
              courses: CoursesBlock,
              publications: PublicationsBlock,
              languages: LanguagesBlock,
              interests: InterestsBlock,
              awards: AwardsBlock,
              certificates: CertificatesBlock,
              references: ReferencesBlock,
            };
            const Renderer = RENDERERS[key];
            return <Renderer key={key} data={resumeData} />;
          }
          return null;
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
