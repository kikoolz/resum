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
// BoldTemplate — Single-column with timeline, orange accent, dark navy
//     headings, two-column key achievements, underlined skills row
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

// ---------------------------------------------------------------------------
// Section Heading — bold uppercase with left accent border
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 mt-6">
      <h3
        className="text-[13px] font-black uppercase tracking-wider"
        style={{ color: "var(--accent-dark)" }}
      >
        {children}
      </h3>
      <div
        className="mt-1 h-[2px] w-full"
        style={{ backgroundColor: "var(--accent-dark)" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header — name, job title (orange), contact icons row
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const firstName = isFieldVisible(fv, "firstName")
    ? data.firstName
    : undefined;
  const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

  const contacts: {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
  }[] = [];
  if (isFieldVisible(fv, "phone") && data.phone)
    contacts.push({ icon: Phone, value: data.phone });
  if (isFieldVisible(fv, "email") && data.email)
    contacts.push({ icon: Mail, value: data.email });
  if (isFieldVisible(fv, "linkedin") && data.linkedin)
    contacts.push({ icon: Linkedin, value: data.linkedin });
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
    if (loc) contacts.push({ icon: MapPin, value: loc });
  }
  if (isFieldVisible(fv, "website") && data.website) {
    contacts.push({ icon: Globe, value: data.website });
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
      {fullName && (
        <h1
          className="text-[26px] font-black uppercase tracking-wider"
          style={{ color: "var(--accent-dark)" }}
        >
          {fullName}
        </h1>
      )}
      {jobTitle && (
        <p
          className="mt-1 text-[12px] font-semibold"
          style={{ color: "var(--accent)" }}
        >
          {jobTitle}
        </p>
      )}
      {contacts.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-4">
          {contacts.map(({ icon: Icon, value }, i) => (
            <div key={i} className="flex items-center gap-1">
              <Icon className="h-3 w-3 shrink-0 text-[#6b7280]" />
              <span className="text-[9.5px] text-[#6b7280]">{value}</span>
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
      <p className="text-[10.5px] leading-[1.65] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Experience — timeline with dots and vertical line
// ---------------------------------------------------------------------------

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
          <div key={i} className="flex gap-3">
            {/* Timeline gutter */}
            <div className="relative flex w-4 shrink-0 flex-col items-center">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d1d5db]" />
              <div
                className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 bg-white"
                style={{ borderColor: "var(--accent)" }}
              />
              <div className="h-full" />
            </div>
            {/* Content */}
            <div className="flex-1 pb-1">
              {/* Date + Location row */}
              <div className="flex items-center gap-3">
                <p
                  className="text-[10px] font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {dateRange(exp.startDate, exp.endDate)}
                </p>
                {exp.location && (
                  <span className="text-[9px] text-[#9ca3af]">
                    {exp.location}
                  </span>
                )}
              </div>
              {/* Position */}
              {exp.position && (
                <p className="mt-0.5 text-[12px] font-bold text-[#2d3436]">
                  {exp.position}
                </p>
              )}
              {/* Company */}
              {exp.company && (
                <p
                  className="text-[10.5px] font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {exp.company}
                </p>
              )}
              {/* Description bullets */}
            {exp.description && (
              <div className="mt-1.5 text-[10px] leading-[1.6] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Education — timeline with dots and vertical line
// ---------------------------------------------------------------------------

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
          const degreeStr = degreeParts.join(" in ");
          return (
            <div key={i} className="flex gap-3">
              {/* Timeline gutter */}
              <div className="relative flex w-4 shrink-0 flex-col items-center">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d1d5db]" />
                <div
                  className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 bg-white"
                  style={{ borderColor: "var(--accent)" }}
                />
                <div className="h-full" />
              </div>
              {/* Content */}
              <div className="flex-1 pb-1">
                {/* Date + Location row */}
                <div className="flex items-center gap-3">
                  <p
                    className="text-[10px] font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {fmtDate(edu.startDate)} - {fmtDate(edu.endDate)}
                  </p>
                  {edu.location && (
                    <span className="text-[9px] text-[#9ca3af]">
                      {edu.location}
                    </span>
                  )}
                </div>
                {/* Degree */}
                {degreeStr && (
                  <p className="mt-0.5 text-[12px] font-bold text-[#2d3436]">
                    {degreeStr}
                  </p>
                )}
                {/* School */}
                {edu.school && (
                  <p
                    className="text-[10.5px] font-semibold"
                    style={{ color: "var(--accent)" }}
                  >
                    {edu.school}
                  </p>
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
// Skills — horizontal row with underlined items
// ---------------------------------------------------------------------------

function SkillsBlock({ data }: { data: ResumeValues }) {
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Skills</SectionHeading>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {skills.map((skill, i) => (
          <div
            key={i}
            className="border-b-2 pb-0.5"
            style={{ borderColor: "var(--accent)" }}
          >
            <p className="text-[10.5px] font-medium text-[#2d3436]">{skill}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Key Achievements — two-column grid with star icons
// ---------------------------------------------------------------------------

function AchievementsBlock({ data }: { data: ResumeValues }) {
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Key Achievements</SectionHeading>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {skills.map((skill, i) => (
          <div key={i} className="flex gap-2">
            <div className="mt-0.5 shrink-0">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <p className="text-[10.5px] font-bold text-[#2d3436]">{skill}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

function LanguagesBlock({ data }: { data: ResumeValues }) {
  const languages =
    data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ??
    [];
  if (languages.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Languages</SectionHeading>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {languages.map((lang, i) => (
          <div key={i}>
            <span className="text-[10.5px] font-medium text-[#2d3436]">
              {lang.language}
            </span>
            {lang.proficiency && (
              <span className="ml-1 text-[9.5px] text-[#9ca3af]">
                — {lang.proficiency}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

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
            <p className="text-[12px] font-bold text-[#2d3436]">{proj.title}</p>
            {proj.description && (
              <p className="mt-1 text-[10px] leading-[1.6] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(proj.description) }} />
            )}
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
  const courses =
    data.courses?.filter((c) => c.visible !== false && c.name?.trim()) ?? [];
  if (courses.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Courses</SectionHeading>
      <div className="flex flex-col gap-2">
        {courses.map((course, i) => (
          <div key={i}>
            <p className="text-[11px] font-bold text-[#2d3436]">
              {course.name}
            </p>
            {course.institution && (
              <p className="text-[9.5px] text-[#9ca3af]">
                {course.institution}
              </p>
            )}
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
  const awards =
    data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
  if (awards.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Awards</SectionHeading>
      <div className="flex flex-col gap-2">
        {awards.map((award, i) => (
          <div key={i}>
            <p className="text-[11px] font-bold text-[#2d3436]">
              {award.title}
            </p>
            {award.date && (
              <p className="text-[9px] text-[#9ca3af]">{fmtDate(award.date)}</p>
            )}
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
            <p className="text-[11px] font-bold text-[#2d3436]">{cert.title}</p>
            {cert.issuer && (
              <p className="text-[9px] text-[#9ca3af]">{cert.issuer}</p>
            )}
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
  const interests =
    data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
  if (interests.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Interests</SectionHeading>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {interests.map((interest, i) => (
          <p key={i} className="text-[10.5px] text-[#2d3436]">
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
  const references =
    data.references?.filter((r) => r.visible !== false && r.name?.trim()) ?? [];
  if (references.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>References</SectionHeading>
      <div className="flex flex-col gap-2">
        {references.map((ref, i) => (
          <div key={i}>
            <p className="text-[11px] font-bold text-[#2d3436]">{ref.name}</p>
            {ref.position && (
              <p className="text-[9px] text-[#9ca3af]">{ref.position}</p>
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

const SECTION_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
  profile: SummaryBlock,
  experience: ExperienceBlock,
  education: EducationBlock,
  skills: SkillsBlock,
  languages: LanguagesBlock,
  projects: ProjectsBlock,
  courses: CoursesBlock,
  awards: AwardsBlock,
  certificates: CertificatesBlock,
  interests: InterestsBlock,
  references: ReferencesBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function BoldTemplate({
  resumeData,
  className,
  fontFamily,
}: TemplateProps) {
  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder
      : DEFAULT_SECTION_ORDER;
  const sv = resumeData.sectionVisibility;
  const color = resumeData.colorHex || "#e67e22";

  // Darker shade for headings
  const darkColor = color.replace(/[0-9a-f]{2}$/i, (m) => {
    const v = Math.max(0, parseInt(m, 16) - 40);
    return v.toString(16).padStart(2, "0");
  });

  return (
    <div
      className={className}
      style={
        {
          fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
          color: "#2d3436",
          backgroundColor: "#ffffff",
          "--accent": color,
          "--accent-dark": darkColor,
        } as React.CSSProperties
      }
    >
      <div className="px-8 py-7">
        {/* Header */}
        {isSectionVisible(sv, "personal-info") && (
          <HeaderBlock data={resumeData} />
        )}

        {/* Sections */}
        {sectionOrder.map((key) => {
          if (key === "personal-info") return null;
          if (!isSectionVisible(sv, key)) return null;
          const Renderer = SECTION_RENDERERS[key];
          if (!Renderer) return null;
          return <Renderer key={key} data={resumeData} />;
        })}

        {/* Render optional sections with data even if not in sectionOrder */}
        {!sectionOrder.includes("languages") &&
          resumeData.languages?.some(
            (l) => l.visible !== false && l.language?.trim(),
          ) && <LanguagesBlock data={resumeData} />}
        {!sectionOrder.includes("projects") &&
          resumeData.projects?.some(
            (p) => p.visible !== false && p.title?.trim(),
          ) && <ProjectsBlock data={resumeData} />}
        {!sectionOrder.includes("courses") &&
          resumeData.courses?.some(
            (c) => c.visible !== false && c.name?.trim(),
          ) && <CoursesBlock data={resumeData} />}
        {!sectionOrder.includes("awards") &&
          resumeData.awards?.some(
            (a) => a.visible !== false && a.title?.trim(),
          ) && <AwardsBlock data={resumeData} />}
        {!sectionOrder.includes("certificates") &&
          resumeData.certificates?.some(
            (c) => c.visible !== false && c.title?.trim(),
          ) && <CertificatesBlock data={resumeData} />}
        {!sectionOrder.includes("interests") &&
          resumeData.interests?.some(
            (i) => i.visible !== false && i.name?.trim(),
          ) && <InterestsBlock data={resumeData} />}
        {!sectionOrder.includes("references") &&
          resumeData.references?.some(
            (r) => r.visible !== false && r.name?.trim(),
          ) && <ReferencesBlock data={resumeData} />}
      </div>
    </div>
  );
}
