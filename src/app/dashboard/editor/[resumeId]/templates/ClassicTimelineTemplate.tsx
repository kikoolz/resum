"use client";

import type { ResumeValues } from "@/lib/validation";
import { Mail, Phone, MapPin, GraduationCap } from "lucide-react";
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
  const e = end ? fmtDate(end) : "Current";
  if (!s && e === "Current") return "";
  return `${s} to ${e}`;
}

// ---------------------------------------------------------------------------
// TimelineTemplate — Two-column with left section labels, vertical timeline
//     line with dots, gold border frame, monogram circle
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

// ---------------------------------------------------------------------------
// Profile photo circle
// ---------------------------------------------------------------------------

function ProfilePhoto({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const showPhoto = fv?.photoUrl !== false && data.photoUrl;

  const initials = [data.firstName?.[0] || "", data.lastName?.[0] || ""]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div
      className="relative pt-1 h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full border-1"
      style={{ borderColor: "var(--accent)" }}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.photoUrl}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span
          className="flex h-full w-full items-center justify-center text-[18px] font-light"
          style={{ color: "var(--accent)" }}
        >
          {initials}
        </span>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Heading — left-side label with timeline dot
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-6 mb-3 flex items-center gap-3">
      {/* Timeline dot */}
      <div
        className="relative z-10 h-3 w-3 shrink-0 rounded-full border-2 bg-white"
        style={{ borderColor: "var(--accent)" }}
      />
      <h3
        className="text-[11px] font-black uppercase tracking-wider"
        style={{ color: "var(--accent)" }}
      >
        {children}
      </h3>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header — name, monogram, contact row
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const firstName = isFieldVisible(fv, "firstName")
    ? data.firstName
    : undefined;
  const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");

  const contacts: {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
  }[] = [];
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
  if (isFieldVisible(fv, "phone") && data.phone)
    contacts.push({ icon: Phone, value: data.phone });
  if (isFieldVisible(fv, "email") && data.email)
    contacts.push({ icon: Mail, value: data.email });

  return (
    <div className="mb-4 flex items-center gap-4">
      <ProfilePhoto data={data} />
      <div>
        {fullName && (
          <h1
            className="text-[32px] font-light"
            style={{ color: "var(--accent)" }}
          >
            {fullName}
          </h1>
        )}
        {contacts.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-3">
            {contacts.map(({ icon: Icon, value }, i) => (
              <div key={i} className="flex items-center gap-1">
                <div style={{ color: "var(--accent)" } as React.CSSProperties}>
                  <Icon className="h-3 w-3 shrink-0" />
                </div>
                <span className="text-[9.5px] text-[#6b7280]">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary — right of timeline
// ---------------------------------------------------------------------------

function SummaryBlock({ data }: { data: ResumeValues }) {
  if (!data.summary) return null;
  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Professional Summary</SectionHeading>
      <p className="text-[10.5px] leading-[1.65] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Experience — timeline with dots
// ---------------------------------------------------------------------------

function ExperienceBlock({ data }: { data: ResumeValues }) {
  const experiences =
    data.workExperiences?.filter(
      (e) => e.visible !== false && (e.position || e.company),
    ) ?? [];
  if (experiences.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Work History</SectionHeading>
      <div className="flex flex-col gap-4">
        {experiences.map((exp, i) => (
          <div key={i} className="flex gap-3">
            {/* Timeline gutter */}
            <div className="relative flex w-3 shrink-0 flex-col items-center">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d1d5db]" />
              <div
                className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 bg-white"
                style={{ borderColor: "var(--accent)" }}
              />
              <div className="h-full" />
            </div>
            {/* Content */}
            <div className="flex-1 pb-1">
              {/* Position + Date row */}
              <div className="flex items-baseline justify-between">
                {exp.position && (
                  <p
                    className="text-[12px] font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {exp.position}
                  </p>
                )}
                <span className="text-[9.5px] font-medium text-[#9ca3af]">
                  {dateRange(exp.startDate, exp.endDate)}
                </span>
              </div>
              {/* Company + Location */}
              {(exp.company || exp.location) && (
                <p className="text-[10.5px] font-semibold text-[#2d3436]">
                  {[exp.company, exp.location].filter(Boolean).join(" | ")}
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
// Skills — two-column grid
// ---------------------------------------------------------------------------

function SkillsBlock({ data }: { data: ResumeValues }) {
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Skills</SectionHeading>
      <div className="grid grid-cols-2 gap-y-1.5 pl-6">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-[#9ca3af]">•</span>
            <p className="text-[10px] text-[#4a5568]">{skill}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Education — timeline with dots
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
          const degreeStr = degreeParts.join(" | ");
          return (
            <div key={i} className="flex gap-3">
              {/* Timeline gutter */}
              <div className="relative flex w-3 shrink-0 flex-col items-center">
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#d1d5db]" />
                <div
                  className="relative z-10 mt-1.5 h-2 w-2 shrink-0 rounded-full border-2 bg-white"
                  style={{ borderColor: "var(--accent)" }}
                />
                <div className="h-full" />
              </div>
              {/* Content */}
              <div className="flex-1 pb-1">
                {degreeStr && (
                  <p className="text-[11px] font-bold text-[#2d3436]">
                    {degreeStr}
                  </p>
                )}
                {edu.school && (
                  <p className="text-[10.5px] font-semibold text-[#2d3436]">
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
      <div className="grid grid-cols-2 gap-y-1.5 pl-6">
        {languages.map((lang, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-[#9ca3af]">•</span>
            <p className="text-[10px] text-[#4a5568]">
              {lang.language}
              {lang.proficiency ? ` — ${lang.proficiency}` : ""}
            </p>
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
      <div className="flex flex-col gap-3 pl-6">
        {projects.map((proj, i) => (
          <div key={i}>
            <p className="text-[11px] font-bold text-[#2d3436]">{proj.title}</p>
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
      <div className="flex flex-col gap-2 pl-6">
        {courses.map((course, i) => (
          <div key={i}>
            <p className="text-[11px] font-bold text-[#2d3436]">
              {course.name}
            </p>
            {course.institution && (
              <p className="text-[9.5px] text-[#6b7280]">
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
      <div className="flex flex-col gap-2 pl-6">
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
      <div className="flex flex-col gap-2 pl-6">
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
      <div className="grid grid-cols-2 gap-y-1.5 pl-6">
        {interests.map((interest, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="text-[#9ca3af]">•</span>
            <p className="text-[10px] text-[#4a5568]">{interest.name}</p>
          </div>
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
      <div className="flex flex-col gap-2 pl-6">
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

export default function ClassicTimelineTemplate({
  resumeData,
  className,
  fontFamily,
}: TemplateProps) {
  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder
      : DEFAULT_SECTION_ORDER;
  const sv = resumeData.sectionVisibility;
  const color = resumeData.colorHex || "#c0392b";

  return (
    <div
      className={className}
      style={
        {
          fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
          color: "#2d3436",
          "--accent": color,
        } as React.CSSProperties
      }
    >
      {/* Border frame */}
      <div className="m-2 p-6">
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
