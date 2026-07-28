"use client";

import type { ResumeValues } from "@/lib/validation";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import SimpleTemplate from "./templates/SimpleTemplate";
import EuropassTemplate from "./templates/EuropassTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import BlushTemplate from "./templates/BlushTemplate";
import FreshTemplate from "./templates/FreshTemplate";
import ClassicTemplate from "./templates/ClassicTemplate";
import SleekTemplate from "./templates/SleekTemplate";
import ProfileTemplate from "./templates/ProfileTemplate";
import EuroModernTemplate from "./templates/EuroModernTemplate";
import BadgeTemplate from "./templates/BadgeTemplate";
import TimelineTemplate from "./templates/TimelineTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import NotionTemplate from "./templates/NotionTemplate";
import AcademyTemplate from "./templates/AcademyTemplate";
import BoldTemplate from "./templates/BoldTemplate";
import ExecutiveProTemplate from "./templates/ExecutiveProTemplate";
import ClassicTimelineTemplate from "./templates/ClassicTimelineTemplate";

// ---------------------------------------------------------------------------
// Template dispatcher
// Routes to the correct per-template renderer based on `templateName`.
// Falls back to Professional for unknown/legacy values.
// ---------------------------------------------------------------------------

interface ResumeTemplateProps {
    resumeData: ResumeValues;
    className?: string;
    fontFamily?: string;
}

const TEMPLATE_MAP: Record<
    string,
    React.ComponentType<{
        resumeData: ResumeValues;
        className?: string;
        fontFamily?: string;
    }>
> = {
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
    modern: ModernTemplate,
    simple: SimpleTemplate,
    europass: EuropassTemplate,
    executive: ExecutiveTemplate,
    blush: BlushTemplate,
    fresh: FreshTemplate,
    classic: ClassicTemplate,
    sleek: SleekTemplate,
    profile: ProfileTemplate,
    "euro-modern": EuroModernTemplate,
    badge: BadgeTemplate,
    timeline: TimelineTemplate,
    minimal: MinimalTemplate,
    notion: NotionTemplate,
    academy: AcademyTemplate,
    bold: BoldTemplate,
    "executive-pro": ExecutiveProTemplate,
    "classic-timeline": ClassicTimelineTemplate,
};

export default function ResumeTemplate({
    resumeData,
    className,
    fontFamily,
}: ResumeTemplateProps) {
    const templateName = resumeData.templateName || "professional";
    const TemplateComponent = TEMPLATE_MAP[templateName] || ProfessionalTemplate;

    return (
        <TemplateComponent
            resumeData={resumeData}
            className={className}
            fontFamily={fontFamily}
        />
    );
}
