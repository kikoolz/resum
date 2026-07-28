"use client";

import type { ResumeValues } from "@/lib/validation";
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Globe,
  Briefcase,
  GraduationCap,
  Heart,
  Award,
  BookOpen,
} from "lucide-react";
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
  return `${y}/${m}`;
}

function dateRange(start?: string, end?: string): string {
  const s = fmtDate(start);
  const e = end ? fmtDate(end) : "present";
  if (!s && e === "present") return "";
  return `${s || "?"} – ${e}`;
}

// ---------------------------------------------------------------------------
// Creative Template
// Purple sidebar (left) + white main (right).
// Sidebar: name (large uppercase), photo, contact, skills (progress bars),
//          languages (progress bars), interests.
// Main: summary, experience, education, projects.
// ---------------------------------------------------------------------------

interface TemplateProps {
  resumeData: ResumeValues;
  className?: string;
  fontFamily?: string;
}

function SidebarSectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-2 mt-5 text-[13px] font-black uppercase tracking-wider">
      {children}
    </h3>
  );
}

function MainSectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-2 mt-5">
      <h3
        className="border-b-2 pb-1 text-[13px] font-black uppercase tracking-wider"
        style={{ color: "var(--accent)", borderColor: "var(--accent)" }}
      >
        {children}
      </h3>
    </div>
  );
}

function SkillBar({ label, level = 80 }: { label: string; level?: number }) {
  return (
    <div className="mb-2">
      <p className="mb-1 text-[10px] font-medium">{label}</p>
      <div className="h-[5px] w-full bg-white/30">
        <div className="h-full bg-white" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar Blocks
// ---------------------------------------------------------------------------

function SidebarHeader({ data }: { data: ResumeValues }) {
  const fv = data.fieldVisibility;
  const firstName = isFieldVisible(fv, "firstName")
    ? data.firstName
    : undefined;
  const lastName = isFieldVisible(fv, "lastName") ? data.lastName : undefined;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const jobTitle = isFieldVisible(fv, "jobTitle") ? data.jobTitle : undefined;
  const showPhoto = isFieldVisible(fv, "photoUrl") && data.photoUrl;

  const contactItems: React.ReactNode[] = [];
  if (isFieldVisible(fv, "email") && data.email) {
    contactItems.push(
      <div key="email" className="flex items-center gap-2 text-[10px]">
        <Mail className="h-3 w-3 shrink-0" />
        <span>{data.email}</span>
      </div>,
    );
  }
  if (isFieldVisible(fv, "phone") && data.phone) {
    contactItems.push(
      <div key="phone" className="flex items-center gap-2 text-[10px]">
        <Phone className="h-3 w-3 shrink-0" />
        <span>{data.phone}</span>
      </div>,
    );
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
    if (loc) {
      contactItems.push(
        <div key="loc" className="flex items-center gap-2 text-[10px]">
          <MapPin className="h-3 w-3 shrink-0" />
          <span>{loc}</span>
        </div>,
      );
    }
  }
  if (isFieldVisible(fv, "linkedin") && data.linkedin) {
    contactItems.push(
      <div key="li" className="flex items-center gap-2 text-[10px]">
        <Linkedin className="h-3 w-3 shrink-0" />
        <span>{data.linkedin}</span>
      </div>,
    );
  }
  if (isFieldVisible(fv, "website") && data.website) {
    contactItems.push(
      <div key="web" className="flex items-center gap-2 text-[10px]">
        <Globe className="h-3 w-3 shrink-0" />
        <span>{data.website}</span>
      </div>,
    );
  }

  return (
    <div className="mb-6 text-center">
      <h1 className="mb-1 text-[26px] font-black leading-none tracking-tight uppercase">
        {fullName || "Your Name"}
      </h1>
      {jobTitle && (
        <p className="mb-4 text-[14px] font-medium italic opacity-90">
          {jobTitle}
        </p>
      )}
      {showPhoto && (
        <img
          src={data.photoUrl}
          alt=""
          className="mx-auto mb-4 h-32 w-32 rounded-full border-4 border-white object-cover shadow-sm"
        />
      )}
      <div className="mt-4 flex flex-col gap-1.5 text-[10px] opacity-90">
        {contactItems}
      </div>
    </div>
  );
}

function SidebarSkillsBlock({ data }: { data: ResumeValues }) {
  if (!data.skills || data.skills.length === 0) return null;
  return (
    <div>
      <SidebarSectionHeading>Skills</SidebarSectionHeading>
      {data.skills.map((skill, i) => (
        <SkillBar key={`${skill}-${i}`} label={skill} level={85 - i * 5} />
      ))}
    </div>
  );
}

function SidebarLanguagesBlock({ data }: { data: ResumeValues }) {
  const items = data.languages?.filter((l) => l.visible !== false);
  if (!items || items.length === 0) return null;
  return (
    <div>
      <SidebarSectionHeading>Languages</SidebarSectionHeading>
      {items.map((l, i) => (
        <SkillBar
          key={l.id || i}
          label={`${l.language || "Language"}${l.proficiency ? ` — ${l.proficiency}` : ""}`}
          level={90 - i * 10}
        />
      ))}
    </div>
  );
}

function SidebarInterestsBlock({ data }: { data: ResumeValues }) {
  const items = data.interests?.filter((i) => i.visible !== false);
  if (!items || items.length === 0) return null;
  return (
    <div>
      <SidebarSectionHeading>Interests</SidebarSectionHeading>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span
            key={item.id || i}
            className="rounded-full border border-white/40 px-3 py-1 text-[10px] font-medium"
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Content Blocks
// ---------------------------------------------------------------------------

function MainProfileBlock({ data }: { data: ResumeValues }) {
  if (!data.summary) return null;
  return (
    <div style={{ breakInside: "avoid" }}>
      <MainSectionHeading>Profile</MainSectionHeading>
      <p className="text-[10.5px] leading-[1.6] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(data.summary) }} />
    </div>
  );
}

function MainExperienceBlock({ data }: { data: ResumeValues }) {
  const items = data.workExperiences?.filter((e) => e.visible !== false);
  if (!items || items.length === 0) return null;
  return (
    <div>
      <MainSectionHeading>Professional Experience</MainSectionHeading>
      <div className="space-y-4">
        {items.map((exp, i) => (
          <div key={exp.id || i} style={{ breakInside: "avoid" }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <h4 className="text-[11px] font-bold">
                {exp.company || "Company"}, {exp.position || "Position"}
              </h4>
            </div>
            <div className="mb-1 text-[10px] opacity-70">
              {dateRange(exp.startDate, exp.endDate)}
              {exp.location && ` | ${exp.location}`}
            </div>
            {exp.description && (
              <p className="text-[10px] leading-[1.5] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(exp.description) }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MainEducationBlock({ data }: { data: ResumeValues }) {
  const items = data.educations?.filter((e) => e.visible !== false);
  if (!items || items.length === 0) return null;
  return (
    <div>
      <MainSectionHeading>Education</MainSectionHeading>
      <div className="space-y-3">
        {items.map((edu, i) => (
          <div key={edu.id || i} style={{ breakInside: "avoid" }}>
            <h4 className="text-[11px] font-bold">
              {edu.degree || "Degree"}
              {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
            </h4>
            <p className="text-[10.5px] italic opacity-80">
              {edu.school || "School"}
            </p>
            {dateRange(edu.startDate, edu.endDate) && (
              <p className="text-[10px] opacity-70">
                {dateRange(edu.startDate, edu.endDate)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MainProjectsBlock({ data }: { data: ResumeValues }) {
  const items = data.projects?.filter((p) => p.visible !== false);
  if (!items || items.length === 0) return null;
  return (
    <div>
      <MainSectionHeading>Projects</MainSectionHeading>
      <div className="space-y-3">
        {items.map((p, i) => (
          <div key={p.id || i} style={{ breakInside: "avoid" }}>
            <h4 className="text-[11px] font-bold">{p.title || "Project"}</h4>
            {p.subtitle && (
              <p className="text-[10.5px] italic opacity-80">{p.subtitle}</p>
            )}
            {p.description && (
              <p className="mt-1 text-[10px] leading-[1.5] opacity-90 [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:m-0" dangerouslySetInnerHTML={{ __html: richTextHtml(p.description) }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MainAwardsBlock({ data }: { data: ResumeValues }) {
  const items = data.awards?.filter((a) => a.visible !== false);
  if (!items || items.length === 0) return null;
  return (
    <div>
      <MainSectionHeading>Awards</MainSectionHeading>
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

const MAIN_RENDERERS: Record<
  string,
  (props: { data: ResumeValues }) => React.ReactNode
> = {
  profile: MainProfileBlock,
  experience: MainExperienceBlock,
  education: MainEducationBlock,
  projects: MainProjectsBlock,
  awards: MainAwardsBlock,
};

const SIDEBAR_RENDERERS: Record<
  string,
  (props: { data: ResumeValues }) => React.ReactNode
> = {
  skills: SidebarSkillsBlock,
  languages: SidebarLanguagesBlock,
  interests: SidebarInterestsBlock,
};

// ---------------------------------------------------------------------------
// Exported Creative Template
// ---------------------------------------------------------------------------

export default function CreativeTemplate({
  resumeData,
  className,
  fontFamily,
}: TemplateProps) {
  const sectionOrder =
    resumeData.sectionOrder && resumeData.sectionOrder.length > 0
      ? resumeData.sectionOrder
      : DEFAULT_SECTION_ORDER;
  const sv = resumeData.sectionVisibility;
  const color = resumeData.colorHex || "#6B5B95";

  const sidebarSections = [
    "skills",
    "languages",
    "interests",
    "awards",
    "certificates",
    "references",
  ];
  const mainSections = [
    "personal-info",
    "profile",
    "experience",
    "education",
    "projects",
    "courses",
    "publications",
  ];

  return (
    <div
      className={className}
      style={
        {
          fontFamily:
            fontFamily || 'Georgia, "Times New Roman", "Noto Serif", serif',
          color: "#000000",
          "--accent": color,
        } as React.CSSProperties
      }
    >
      <div className="grid h-full grid-cols-[32%_1fr]">
        {/* Left Sidebar */}
        <div
          className="flex flex-col gap-4 px-5 py-8 text-white"
          style={{ backgroundColor: color }}
        >
          <SidebarHeader data={resumeData} />
          {sectionOrder.map((key) => {
            if (sidebarSections.includes(key) && isSectionVisible(sv, key)) {
              const Renderer = SIDEBAR_RENDERERS[key];
              return (
                <div key={key}>
                  {Renderer && <Renderer data={resumeData} />}
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Right Main Content */}
        <div className="flex flex-col gap-1 bg-white p-8">
          {sectionOrder.map((key) => {
            if (mainSections.includes(key) && isSectionVisible(sv, key)) {
              if (key === "personal-info") return null;
              const Renderer = MAIN_RENDERERS[key];
              return <Renderer key={key} data={resumeData} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
