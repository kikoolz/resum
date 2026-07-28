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

function fmtDateShort(d?: string): string {
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
  return `${s} - ${e}`;
}

// ---------------------------------------------------------------------------
// AcademyTemplate — Two-column with blue accent, photo, key achievements
//     with icons, skills grid with underlines, language progress bars,
//     decorative wavy shapes
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

// ---------------------------------------------------------------------------
// Decorative wavy shapes
// ---------------------------------------------------------------------------

function WavyBackground() {
  return (
    <>
      {/* Top-left wavy shape */}
      <svg
        className="absolute left-0 top-0 h-[120px] w-[180px] opacity-20"
        viewBox="0 0 200 150"
        fill="none"
      >
        <path
          d="M0 0C40 20 80 60 60 100C40 140 0 120 0 80V0Z"
          fill="var(--accent)"
        />
        <path
          d="M30 0C70 30 100 70 80 110C60 150 20 130 10 90V0H30Z"
          fill="var(--accent)"
          opacity="0.5"
        />
      </svg>
      {/* Bottom-left wavy shape */}
      <svg
        className="absolute bottom-0 left-0 h-[100px] w-[150px] opacity-15"
        viewBox="0 0 200 150"
        fill="none"
      >
        <path
          d="M0 150C40 130 80 90 60 50C40 10 0 30 0 70V150Z"
          fill="var(--accent)"
        />
        <path
          d="M30 150C70 120 100 80 80 40C60 0 20 20 10 60V150H30Z"
          fill="var(--accent)"
          opacity="0.5"
        />
      </svg>
    </>
  );
}

// ---------------------------------------------------------------------------
// Photo with decorative circle behind it
// ---------------------------------------------------------------------------

function PhotoBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const showPhoto = isFieldVisible(fv, "photoUrl") && data.photoUrl;
  if (!showPhoto) return null;

  return (
    <div className="absolute right-2 top-2 z-10">
      {/* Decorative circle behind photo */}
      <div className="relative">
        <div
          className="absolute -left-2 -top-2 h-[110px] w-[110px] rounded-full opacity-25"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <div className="relative h-[96px] w-[96px] overflow-hidden rounded-full border-3 border-white shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.photoUrl}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section Heading — uppercase, small, gray
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 mt-5 text-[9px] font-semibold uppercase tracking-widest text-[#6b7280]">
      {children}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Header — name, job title (blue), contact icons inline
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

  return (
    <div className="mb-5 pr-[120px]">
      {fullName && (
        <h1
          className="text-[28px] font-light text-[#2d3436]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {fullName}
        </h1>
      )}
      {jobTitle && (
        <p
          className="mt-1 text-[11px] font-medium"
          style={{ color: "var(--accent)" }}
        >
          {jobTitle}
        </p>
      )}
      {contacts.length > 0 && (
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {contacts.map(({ icon: Icon, value }, i) => (
            <div key={i} className="flex items-center gap-1">
              <div style={{ color: "var(--accent)" } as React.CSSProperties}>
                <Icon className="h-3 w-3 shrink-0" />
              </div>
              <span className="text-[9px] text-[#6b7280]">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left Column Blocks
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
          <div key={i}>
            {/* Position */}
            {exp.position && (
              <p className="text-[12px] font-bold text-[#2d3436]">
                {exp.position}
              </p>
            )}
            {/* Company + Date + Location row */}
            <div className="mt-0.5 flex items-center gap-2">
              {exp.company && (
                <span
                  className="text-[10px] font-medium"
                  style={{ color: "var(--accent)" }}
                >
                  {exp.company}
                </span>
              )}
              <span className="text-[9px] text-[#9ca3af]">
                {dateRange(exp.startDate, exp.endDate)}
              </span>
              {exp.location && (
                <span className="text-[9px] text-[#9ca3af]">
                  {exp.location}
                </span>
              )}
            </div>
            {/* Description bullets */}
            {exp.description && (
              <div className="mt-1.5 text-[10px] leading-[1.6] text-[#4a5568] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
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
      <div className="flex flex-col gap-3">
        {educations.map((edu, i) => {
          const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
          const degreeStr = degreeParts.join(" in ");
          return (
            <div key={i}>
              {degreeStr && (
                <p className="text-[12px] font-bold text-[#2d3436]">
                  {degreeStr}
                </p>
              )}
              <div className="mt-0.5 flex items-center gap-2">
                {edu.school && (
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    {edu.school}
                  </span>
                )}
                <span className="text-[9px] text-[#9ca3af]">
                  {fmtDate(edu.startDate)} - {fmtDate(edu.endDate)}
                </span>
                {edu.location && (
                  <span className="text-[9px] text-[#9ca3af]">
                    {edu.location}
                  </span>
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
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        {skills.map((skill, i) => (
          <div key={i} className="border-b border-[#e5e7eb] pb-1">
            <p className="text-[10px] font-bold text-[#2d3436]">{skill}</p>
          </div>
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
      <div className="flex flex-col gap-2.5">
        {languages.map((lang, i) => {
          // Map proficiency to a percentage for the bar
          const profMap: Record<string, number> = {
            Native: 100,
            Fluent: 90,
            Advanced: 80,
            Intermediate: 60,
            Beginner: 40,
          };
          const pct = profMap[lang.proficiency || ""] || 70;
          return (
            <div key={i}>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-[#2d3436]">
                  {lang.language}
                </p>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-[#e5e7eb]">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: "var(--accent)" }}
                />
              </div>
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
// Right Column Blocks
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

function AchievementsBlock({ data }: { data: ResumeValues }) {
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Key Achievements</SectionHeading>
      <div className="flex flex-col gap-3">
        {skills.map((skill, i) => (
          <div key={i} className="flex gap-2">
            <div className="mt-0.5 shrink-0">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="var(--accent)"
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

function CoursesBlock({ data }: { data: ResumeValues }) {
  const courses =
    data.courses?.filter((c) => c.visible !== false && c.name?.trim()) ?? [];
  if (courses.length === 0) return null;

  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading>Courses</SectionHeading>
      <div className="flex flex-col gap-3">
        {courses.map((course, i) => (
          <div key={i}>
            <p className="text-[10.5px] font-bold text-[#2d3436]">
              {course.name}
            </p>
            {course.institution && (
              <p className="mt-0.5 text-[9.5px] leading-[1.5] text-[#6b7280]">
                {course.institution}
              </p>
            )}
          </div>
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
      <SectionHeading>Passions</SectionHeading>
      <div className="flex flex-col gap-3">
        {interests.map((interest, i) => (
          <div key={i} className="flex gap-2">
            <div className="mt-0.5 shrink-0">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div>
              <p className="text-[10.5px] font-bold text-[#2d3436]">
                {interest.name}
              </p>
            </div>
          </div>
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
            <p className="text-[11px] font-bold text-[#2d3436]">
              {award.title}
            </p>
            {award.date && (
              <p className="text-[9px] text-[#9ca3af]">
                {fmtDateShort(award.date)}
              </p>
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
// Renderer maps
// ---------------------------------------------------------------------------

const LEFT_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
  experience: ExperienceBlock,
  education: EducationBlock,
  skills: SkillsBlock,
  projects: ProjectsBlock,
};

const RIGHT_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
  profile: SummaryBlock,
  languages: LanguagesBlock,
  courses: CoursesBlock,
  interests: InterestsBlock,
  awards: AwardsBlock,
  certificates: CertificatesBlock,
  references: ReferencesBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function AcademyTemplate({
  resumeData,
  className,
  fontFamily,
}: TemplateProps) {
  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder
      : DEFAULT_SECTION_ORDER;
  const sv = resumeData.sectionVisibility;
  const color = resumeData.colorHex || "#4a90a4";

  const leftSections = [
    "experience",
    "education",
    "skills",
    "projects",
  ];
  const rightSections = [
    "profile",
    "languages",
    "courses",
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
          color: "#2d3436",
          "--accent": color,
        } as React.CSSProperties
      }
    >
      {/* Decorative wavy background */}
      <WavyBackground />

      <div className="relative grid min-h-full grid-cols-[55%_1fr] px-6 py-6">
        {/* Photo (positioned absolutely in top-right) */}
        <PhotoBlock data={resumeData} />

        {/* Left Column */}
        <div className="flex flex-col pr-6">
          {/* Header */}
          {isSectionVisible(sv, "personal-info") && (
            <HeaderBlock data={resumeData} />
          )}

          {/* Sections */}
          {sectionOrder.map((key) => {
            if (leftSections.includes(key) && isSectionVisible(sv, key)) {
              const Renderer = LEFT_RENDERERS[key];
              if (Renderer) return <Renderer key={key} data={resumeData} />;
            }
            return null;
          })}

          {/* Render optional sections with data even if not in sectionOrder */}
          {!sectionOrder.includes("projects") &&
            resumeData.projects?.some(
              (p) => p.visible !== false && p.title?.trim(),
            ) && <ProjectsBlock data={resumeData} />}
        </div>

        {/* Right Column */}
        <div className="flex flex-col pl-2">
          {/* Key Achievements (uses skills) */}
          {isSectionVisible(sv, "skills") && (
            <AchievementsBlock data={resumeData} />
          )}

          {/* Other right sections from sectionOrder */}
          {sectionOrder.map((key) => {
            if (rightSections.includes(key) && isSectionVisible(sv, key)) {
              const Renderer = RIGHT_RENDERERS[key];
              if (Renderer) return <Renderer key={key} data={resumeData} />;
            }
            return null;
          })}

          {/* Render optional sections with data even if not in sectionOrder */}
          {!sectionOrder.includes("languages") &&
            resumeData.languages?.some(
              (l) => l.visible !== false && l.language?.trim(),
            ) && <LanguagesBlock data={resumeData} />}
          {!sectionOrder.includes("courses") &&
            resumeData.courses?.some(
              (c) => c.visible !== false && c.name?.trim(),
            ) && <CoursesBlock data={resumeData} />}
          {!sectionOrder.includes("interests") &&
            resumeData.interests?.some(
              (i) => i.visible !== false && i.name?.trim(),
            ) && <InterestsBlock data={resumeData} />}
          {!sectionOrder.includes("awards") &&
            resumeData.awards?.some(
              (a) => a.visible !== false && a.title?.trim(),
            ) && <AwardsBlock data={resumeData} />}
          {!sectionOrder.includes("certificates") &&
            resumeData.certificates?.some(
              (c) => c.visible !== false && c.title?.trim(),
            ) && <CertificatesBlock data={resumeData} />}
          {!sectionOrder.includes("references") &&
            resumeData.references?.some(
              (r) => r.visible !== false && r.name?.trim(),
            ) && <ReferencesBlock data={resumeData} />}
        </div>
      </div>
    </div>
  );
}
