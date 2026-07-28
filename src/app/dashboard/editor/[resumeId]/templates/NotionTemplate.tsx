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
// NotionTemplate — Two-column with photo, job title badge, colored section
//     heading squares, key achievements sidebar, subtle background
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

// ---------------------------------------------------------------------------
// Section Heading — colored square icon + uppercase text
// ---------------------------------------------------------------------------

function SectionIcon({
  type,
}: {
  type:
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "courses"
    | "achievements"
    | "contacts"
    | "default";
}) {
  const icons: Record<string, React.ReactNode> = {
    summary: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    experience: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    education: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
    skills: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    courses: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    achievements: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M7 2h10v3h-10z" />
        <path d="M5 5h14l-1 4a6 6 0 0 1-12 0z" />
        <path d="M8 13h8v3a4 4 0 0 1-8 0z" />
        <path d="M9 19h6" />
      </svg>
    ),
    contacts: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    default: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  };

  return (
    <div
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
      style={{ backgroundColor: "var(--accent)" }}
    >
      {icons[type] || icons.default}
    </div>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon:
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "courses"
    | "achievements"
    | "contacts"
    | "default";
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 mt-5 flex items-center gap-2">
      <SectionIcon type={icon} />
      <h3
        className="text-[12px] font-black uppercase tracking-wider"
        style={{ color: "var(--accent)" }}
      >
        {children}
      </h3>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left Column (Sidebar)
// ---------------------------------------------------------------------------

function PhotoBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const showPhoto = isFieldVisible(fv, "photoUrl") && data.photoUrl;
  if (!showPhoto) return null;

  return (
    <div className="relative mb-6 flex justify-center">
      {/* Decorative background shapes */}
      <div
        className="absolute -left-2 -top-4 h-[140px] w-[140px] rounded-full opacity-30"
        style={{ backgroundColor: "var(--accent)" }}
      />
      <div
        className="absolute -left-1 -top-2 h-[120px] w-[120px] rounded-full opacity-20"
        style={{ backgroundColor: "var(--accent)" }}
      />
      {/* Photo */}
      <div className="relative z-10 h-[120px] w-[120px] overflow-hidden rounded-full border-4 border-white shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={data.photoUrl}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

function ContactsBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const items: {
    icon: React.ComponentType<{ className?: string }>;
    value: string;
  }[] = [];

  if (isFieldVisible(fv, "phone") && data.phone) {
    items.push({ icon: Phone, value: data.phone });
  }
  if (isFieldVisible(fv, "email") && data.email) {
    items.push({ icon: Mail, value: data.email });
  }
  if (isFieldVisible(fv, "linkedin") && data.linkedin) {
    items.push({ icon: Linkedin, value: data.linkedin });
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
    if (loc) items.push({ icon: MapPin, value: loc });
  }
  if (isFieldVisible(fv, "website") && data.website) {
    items.push({ icon: Globe, value: data.website });
  }

  if (items.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="contacts">Contacts</SectionHeading>
      <div className="flex flex-col gap-2">
        {items.map(({ icon: Icon, value }, i) => (
          <div key={i} className="flex items-center gap-2">
            <div style={{ color: "var(--accent)" } as React.CSSProperties}>
              <Icon className="h-3.5 w-3.5 shrink-0" />
            </div>
            <span className="text-[9.5px] leading-snug">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AchievementsBlock({ data }: { data: ResumeValues }) {
  // Use skills as "key achievements" — they're bold titles with no descriptions in this template
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="achievements">Key Achievements</SectionHeading>
      <div className="flex flex-col gap-3">
        {skills.map((skill, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold leading-snug">{skill}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarCoursesBlock({ data }: { data: ResumeValues }) {
  const courses =
    data.courses?.filter((c) => c.visible !== false && c.name?.trim()) ?? [];
  if (courses.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="courses">Courses</SectionHeading>
      <div className="flex flex-col gap-3">
        {courses.map((course, i) => (
          <div key={i}>
            <p className="text-[10px] font-bold leading-snug">{course.name}</p>
            {course.institution && (
              <p className="mt-0.5 text-[9px] leading-snug opacity-70">
                {course.institution}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSkillsBlock({ data }: { data: ResumeValues }) {
  const skills = data.skills?.filter((s) => s.trim()) ?? [];
  if (skills.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="skills">Skills</SectionHeading>
      <div className="flex flex-col gap-1.5">
        {skills.map((skill, i) => (
          <p key={i} className="text-[9.5px]">
            {skill}
          </p>
        ))}
      </div>
    </div>
  );
}

function SidebarLanguagesBlock({ data }: { data: ResumeValues }) {
  const languages =
    data.languages?.filter((l) => l.visible !== false && l.language?.trim()) ??
    [];
  if (languages.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="default">Languages</SectionHeading>
      <div className="flex flex-col gap-1.5">
        {languages.map((lang, i) => (
          <p key={i} className="text-[9.5px]">
            {lang.language}
            {lang.proficiency ? ` — ${lang.proficiency}` : ""}
          </p>
        ))}
      </div>
    </div>
  );
}

function SidebarInterestsBlock({ data }: { data: ResumeValues }) {
  const interests =
    data.interests?.filter((i) => i.visible !== false && i.name?.trim()) ?? [];
  if (interests.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="default">Interests</SectionHeading>
      <div className="flex flex-col gap-1.5">
        {interests.map((interest, i) => (
          <p key={i} className="text-[9.5px]">
            {interest.name}
          </p>
        ))}
      </div>
    </div>
  );
}

function SidebarAwardsBlock({ data }: { data: ResumeValues }) {
  const awards =
    data.awards?.filter((a) => a.visible !== false && a.title?.trim()) ?? [];
  if (awards.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="default">Awards</SectionHeading>
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

function SidebarCertificatesBlock({ data }: { data: ResumeValues }) {
  const certificates =
    data.certificates?.filter((c) => c.visible !== false && c.title?.trim()) ??
    [];
  if (certificates.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="default">Certificates</SectionHeading>
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

function SidebarReferencesBlock({ data }: { data: ResumeValues }) {
  const references =
    data.references?.filter((r) => r.visible !== false && r.name?.trim()) ?? [];
  if (references.length === 0) return null;

  return (
    <div className="mb-5">
      <SectionHeading icon="default">References</SectionHeading>
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
// Right Column (Main Content)
// ---------------------------------------------------------------------------

function HeaderBlock({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const firstName = isFieldVisible(fv, "firstName")
    ? data.firstName
    : undefined;
  const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;

  if (!fullName && !jobTitle) return null;

  return (
    <div className="mb-4">
      {fullName && (
        <h1
          className="text-[28px] font-light tracking-wide text-[#2d3436]"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {fullName}
        </h1>
      )}
      {jobTitle && (
        <div
          className="mt-2 inline-block rounded-xs px-4 py-1.5"
          style={{ backgroundColor: "var(--accent)", color: "white" }}
        >
          <p className="text-[10.5px] font-medium">{jobTitle}</p>
        </div>
      )}
    </div>
  );
}

function SummaryBlock({ data }: { data: ResumeValues }) {
  if (!data.summary) return null;
  return (
    <div style={{ breakInside: "avoid" }}>
      <SectionHeading icon="summary">Summary</SectionHeading>
      <p className="text-[10.5px] leading-[1.65] opacity-85 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
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
      <SectionHeading icon="experience">Experience</SectionHeading>
      <div className="flex flex-col gap-4">
        {experiences.map((exp, i) => (
          <div key={i}>
            {/* Company + Location/Date row */}
            <div className="flex items-baseline justify-between">
              {exp.company && (
                <p className="text-[12px] font-bold">{exp.company}</p>
              )}
              <div className="flex items-center gap-3 text-[9px] opacity-60">
                {exp.location && <span>{exp.location}</span>}
                <span>{dateRange(exp.startDate, exp.endDate)}</span>
              </div>
            </div>
            {/* Position */}
            {exp.position && (
              <p className="text-[10.5px] opacity-70">{exp.position}</p>
            )}
            {/* Description bullets */}
            {exp.description && (
              <div className="mt-1.5 text-[10px] leading-[1.6] opacity-85 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
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
      <SectionHeading icon="education">Education</SectionHeading>
      <div className="flex flex-col gap-3">
        {educations.map((edu, i) => {
          const degreeParts = [edu.degree, edu.fieldOfStudy].filter(Boolean);
          const degreeStr = degreeParts.join(" in ");
          return (
            <div key={i}>
              {/* School + Location/Date row */}
              <div className="flex items-baseline justify-between">
                {edu.school && (
                  <p className="text-[12px] font-bold">{edu.school}</p>
                )}
                <div className="flex items-center gap-3 text-[9px] opacity-60">
                  {edu.location && <span>{edu.location}</span>}
                  <span>
                    {fmtDate(edu.startDate)} - {fmtDate(edu.endDate)}
                  </span>
                </div>
              </div>
              {/* Degree */}
              {degreeStr && (
                <p className="text-[10.5px] opacity-70">{degreeStr}</p>
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
      <SectionHeading icon="default">Projects</SectionHeading>
      <div className="flex flex-col gap-3">
        {projects.map((proj, i) => (
          <div key={i}>
            <div className="flex items-baseline justify-between">
              <p className="text-[12px] font-bold">{proj.title}</p>
              {proj.startDate && (
                <span className="text-[9px] opacity-60">
                  {fmtDate(proj.startDate)}
                </span>
              )}
            </div>
            {proj.description && (
              <p className="mt-1 text-[10px] leading-[1.6] opacity-85 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(proj.description) }} />
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
      <SectionHeading icon="default">Publications</SectionHeading>
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
// Renderer maps
// ---------------------------------------------------------------------------

const LEFT_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
  skills: SidebarSkillsBlock,
  courses: SidebarCoursesBlock,
  languages: SidebarLanguagesBlock,
  interests: SidebarInterestsBlock,
  awards: SidebarAwardsBlock,
  certificates: SidebarCertificatesBlock,
  references: SidebarReferencesBlock,
};

const RIGHT_RENDERERS: Record<
  string,
  React.ComponentType<{ data: ResumeValues }>
> = {
  profile: SummaryBlock,
  experience: ExperienceBlock,
  education: EducationBlock,
  projects: ProjectsBlock,
  publications: PublicationsBlock,
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------

export default function NotionTemplate({
  resumeData,
  className,
  fontFamily,
}: TemplateProps) {
  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder
      : DEFAULT_SECTION_ORDER;
  const sv = resumeData.sectionVisibility;
  const color = resumeData.colorHex || "#7ba38e";

  const leftSections = [
    "skills",
    "courses",
    "languages",
    "interests",
    "awards",
    "certificates",
    "references",
  ];
  const rightSections = [
    "profile",
    "experience",
    "education",
    "projects",
    "publications",
  ];

  return (
    <div
      className={`${className ?? ""} min-h-full`}
      style={
        {
          fontFamily: fontFamily || 'Inter, system-ui, "Noto Sans", sans-serif',
          color: "#2d3436",
          backgroundColor: "#f5f5f0",
          "--accent": color,
        } as React.CSSProperties
      }
    >
      <div className="grid min-h-full grid-cols-[35%_1fr]">
        {/* Left Column (Sidebar) */}
        <div
          className="flex flex-col border-r border-[#e0e0d8] px-5 py-6"
          style={{ backgroundColor: "rgba(0,0,0,0.02)" }}
        >
          {/* Photo */}
          <PhotoBlock data={resumeData} />

          {/* Achievements (uses skills data) */}
          <AchievementsBlock data={resumeData} />

          {/* Other sidebar sections from sectionOrder */}
          {sectionOrder.map((key) => {
            if (leftSections.includes(key) && isSectionVisible(sv, key)) {
              const Renderer = LEFT_RENDERERS[key];
              if (Renderer) return <Renderer key={key} data={resumeData} />;
            }
            return null;
          })}

          {/* Render optional sidebar sections with data even if not in sectionOrder */}
          {!sectionOrder.includes("languages") &&
            resumeData.languages?.some(
              (l) => l.visible !== false && l.language?.trim(),
            ) && <SidebarLanguagesBlock data={resumeData} />}
          {!sectionOrder.includes("interests") &&
            resumeData.interests?.some(
              (i) => i.visible !== false && i.name?.trim(),
            ) && <SidebarInterestsBlock data={resumeData} />}
          {!sectionOrder.includes("awards") &&
            resumeData.awards?.some(
              (a) => a.visible !== false && a.title?.trim(),
            ) && <SidebarAwardsBlock data={resumeData} />}
          {!sectionOrder.includes("certificates") &&
            resumeData.certificates?.some(
              (c) => c.visible !== false && c.title?.trim(),
            ) && <SidebarCertificatesBlock data={resumeData} />}
          {!sectionOrder.includes("references") &&
            resumeData.references?.some(
              (r) => r.visible !== false && r.name?.trim(),
            ) && <SidebarReferencesBlock data={resumeData} />}
        </div>

        {/* Right Column (Main Content) */}
        <div className="flex flex-col px-6 py-6">
          {/* Header */}
          {isSectionVisible(sv, "personal-info") && (
            <HeaderBlock data={resumeData} />
          )}

          {/* Main sections from sectionOrder */}
          {sectionOrder.map((key) => {
            if (rightSections.includes(key) && isSectionVisible(sv, key)) {
              const Renderer = RIGHT_RENDERERS[key];
              if (Renderer) return <Renderer key={key} data={resumeData} />;
            }
            return null;
          })}

          {/* Render optional main sections with data even if not in sectionOrder */}
          {!sectionOrder.includes("projects") &&
            resumeData.projects?.some(
              (p) => p.visible !== false && p.title?.trim(),
            ) && <ProjectsBlock data={resumeData} />}
          {!sectionOrder.includes("publications") &&
            resumeData.publications?.some(
              (p) => p.visible !== false && p.title?.trim(),
            ) && <PublicationsBlock data={resumeData} />}
        </div>
      </div>
    </div>
  );
}
