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
// Euro Modern Template
// Dark blue top bar, two-column: left (name, summary, experience, education)
// + right (photo, details, skills, languages). Blue section headings with
// underline, horizontal rules between sections.
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

const ACCENT = "#1a365d";
const SIDEBAR_BG = "#F5F5F5";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-5">
      <h3
        className="text-[13px] font-black uppercase tracking-wider"
        style={{ color: "var(--accent)" }}
      >
        {children}
      </h3>
      <div
        className="mt-1 h-[3px] w-full rounded-full"
        style={{ backgroundColor: "var(--accent)" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header Block
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const firstName = isFieldVisible(fv, "firstName")
    ? data.firstName
    : undefined;
  const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

  return (
    <div className="mb-4">
      {jobTitle && <p className="text-[10px] opacity-70">{jobTitle}</p>}
      {fullName && (
        <h1
          className="text-[26px] font-black uppercase tracking-wider"
          style={{ color: "var(--accent)" }}
        >
          {fullName}
        </h1>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Top Bar
// ---------------------------------------------------------------------------

function TopBar({ accent }: { accent: string }) {
  return (
    <div
      className="flex items-center justify-end px-6 py-2"
      style={{ backgroundColor: accent }}
    >
      <div className="flex items-center gap-1.5 text-white">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="12" cy="12" r="1" />
        </svg>
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
      <SectionHeading>Summary</SectionHeading>
      <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/15" />
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
            <div className="flex items-baseline gap-2">
              <p className="text-[10px] font-bold">
                {dateRange(exp.startDate, exp.endDate)}
              </p>
              {exp.location && (
                <p className="text-[9.5px] opacity-70">{exp.location}</p>
              )}
            </div>
            {(exp.position || exp.company) && (
              <p className="mt-0.5 text-[11px] font-bold">
                {exp.position || "Position"}
                {exp.company ? ` | ${exp.company}` : ""}
              </p>
            )}
            {exp.description && (
              <div className="mt-2 text-[10px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/15" />
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
      <div className="flex flex-col gap-3">
        {educations.map((edu, i) => {
          const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
          const degreeStr = degreeParts.join(": ");
          return (
            <div key={i}>
              <div className="flex items-baseline gap-2">
                <p className="text-[10px] font-bold">
                  {dateRange(edu.startDate, edu.endDate)}
                </p>
                {edu.location && (
                  <p className="text-[9.5px] opacity-70">{edu.location}</p>
                )}
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
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/15" />
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
// Right Sidebar Blocks
// ---------------------------------------------------------------------------

function PhotoBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  if (!isFieldVisible(fv, "photoUrl") || !data.photoUrl) return null;
  return (
    <div className="mb-4">
      <img
        src={data.photoUrl}
        alt=""
        className="h-32 w-full rounded-lg object-cover"
      />
    </div>
  );
}

function DetailsBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const items: { label: string; value: string; isLink?: boolean }[] = [];

  if (isFieldVisible(fv, "phone") && data.phone) {
    items.push({ label: "Phone number:", value: data.phone });
  }
  if (isFieldVisible(fv, "email") && data.email) {
    items.push({ label: "Email address:", value: data.email });
  }
  if (isFieldVisible(fv, "linkedin") && data.linkedin) {
    items.push({ label: "LinkedIn:", value: data.linkedin, isLink: true });
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
    if (loc) items.push({ label: "Address:", value: loc });
  }
  if (isFieldVisible(fv, "website") && data.website) {
    items.push({ label: "Website:", value: data.website, isLink: true });
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <SectionHeading>Details</SectionHeading>
      <div className="flex flex-col gap-2">
        {items.map(({ label, value, isLink }) => (
          <div key={label}>
            <p className="text-[10px] font-bold opacity-70">{label}</p>
            {isLink ? (
              <p
                className="text-[10px] break-all"
                style={{ color: "var(--accent)" }}
              >
                {value}
              </p>
            ) : (
              <p className="text-[10px] leading-snug">{value}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/15" />
    </div>
  );
}

function SkillsBlock({ data }: { data: ResumeValues }) {
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div className="mb-4">
      <SectionHeading>Skills</SectionHeading>
      <ul className="flex flex-col gap-1.5">
        {skills.map((skill, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[10px] leading-snug"
          >
            <span className="mt-[2px] shrink-0">•</span>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 h-px w-full bg-[#1a1a1a]/15" />
    </div>
  );
}

function LanguagesBlock({ data }: { data: ResumeValues }) {
  const languages =
    data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ??
    [];
  if (languages.length === 0) return null;

  return (
    <div className="mb-4">
      <SectionHeading>Languages</SectionHeading>
      <div className="flex flex-col gap-2">
        <div>
          <p className="text-[9.5px] opacity-70">Mother language(s):</p>
          {languages.filter((l) => l.proficiency?.toLowerCase() === "native")
            .length > 0 ? (
            <p className="text-[10px] font-bold">
              {languages
                .filter((l) => l.proficiency?.toLowerCase() === "native")
                .map((l) => l.language?.toUpperCase())
                .join(", ")}
            </p>
          ) : (
            <p className="text-[10px] font-bold">
              {languages[0]?.language?.toUpperCase()}
            </p>
          )}
        </div>
        {languages.filter((l) => l.proficiency?.toLowerCase() !== "native")
          .length > 0 && (
          <div>
            <p className="text-[9.5px] opacity-70">Other language(s):</p>
            <div className="flex flex-col gap-0.5">
              {languages
                .filter((l) => l.proficiency?.toLowerCase() !== "native")
                .map((lang, i) => (
                  <p key={i} className="text-[10px]">
                    <span className="font-bold">
                      {lang.language?.toUpperCase()}
                    </span>
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

function InterestsBlock({ data }: { data: ResumeValues }) {
  const interests =
    data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
  if (interests.length === 0) return null;

  return (
    <div className="mb-4">
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
  const awards =
    data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
  if (awards.length === 0) return null;

  return (
    <div className="mb-4">
      <SectionHeading>Awards</SectionHeading>
      <div className="flex flex-col gap-2">
        {awards.map((award, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold leading-snug">{award.title}</p>
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
    <div className="mb-4">
      <SectionHeading>Certificates</SectionHeading>
      <div className="flex flex-col gap-2">
        {certificates.map((cert, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold leading-snug">{cert.title}</p>
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
    <div className="mb-4">
      <SectionHeading>References</SectionHeading>
      <div className="flex flex-col gap-2">
        {references.map((ref, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold leading-snug">{ref.name}</p>
            {ref.position && (
              <p className="text-[9px] opacity-70">{ref.position}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Renderer maps
// ---------------------------------------------------------------------------

const LEFT_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
  profile: SummaryBlock,
  experience: ExperienceBlock,
  education: EducationBlock,
  projects: ProjectsBlock,
  courses: CoursesBlock,
  publications: PublicationsBlock,
};

const RIGHT_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
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

export default function EuroModernTemplate({
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

  const leftSections = [
    "profile",
    "experience",
    "education",
    "projects",
    "courses",
    "publications",
  ];
  const rightSections = [
    "skills",
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
          color: "#000000",
          "--accent": color,
        } as React.CSSProperties
      }
    >
      {/* Dark blue top bar */}
      <TopBar accent={color} />

      <div className="grid h-full grid-cols-[65%_1fr]">
        {/* Left Column */}
        <div className="flex flex-col bg-white px-6 py-5">
          {/* Name + Job Title */}
          {isSectionVisible(sv, "personal-info") && (
            <HeaderBlock data={resumeData} />
          )}

          <div className="mb-4 h-px w-full bg-[#1a1a1a]/15" />

          {sectionOrder.map((key) => {
            if (leftSections.includes(key) && isSectionVisible(sv, key)) {
              const Renderer = LEFT_RENDERERS[key];
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

        {/* Right Sidebar */}
        <div
          className="flex flex-col px-5 py-5"
          style={{ backgroundColor: SIDEBAR_BG }}
        >
          {/* Photo */}
          <PhotoBlock data={resumeData} />

          {/* Details */}
          <DetailsBlock data={resumeData} />

          {sectionOrder.map((key) => {
            if (rightSections.includes(key) && isSectionVisible(sv, key)) {
              const Renderer = RIGHT_RENDERERS[key];
              return <Renderer key={key} data={resumeData} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
