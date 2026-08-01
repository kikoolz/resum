"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { cn, mapToResumeValues } from "@/lib/utils";
import type { ResumeValues } from "@/lib/validation";
import type { ResumeServerData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import Footer from "./Footer";
import ResumePreviewSection from "./ResumePreviewSection";
import useAutoSaveResume from "./useAutoSaveResume";
import {
    DEFAULT_SECTION_ORDER,
    getSectionMeta,
} from "./sectionConfig";
import {
    FONT_SIZE_DEFAULT,
    type PreviewFontFamily,
    type PreviewSettings,
} from "./previewConfig";
import SectionWrapper from "./sections/SectionWrapper";
import AddContentModal from "./AddContentModal";

// Section content components
import PersonalInfoSection from "./sections/PersonalInfoSection";
import ProfileSection from "./sections/ProfileSection";
import SkillsSection from "./sections/SkillsSection";
import ExperienceSection from "./sections/ExperienceSection";
import EducationSection from "./sections/EducationSection";
import ProjectsSection from "./sections/ProjectsSection";
import AwardsSection from "./sections/AwardsSection";
import PublicationsSection from "./sections/PublicationsSection";
import CertificatesSection from "./sections/CertificatesSection";
import LanguagesSection from "./sections/LanguagesSection";
import CoursesSection from "./sections/CoursesSection";
import ReferencesSection from "./sections/ReferencesSection";
import InterestsSection from "./sections/InterestsSection";
import PreviewModal from "./PreviewModal";
import PortfolioModal from "./PortfolioModal";

/** Map section key -> React component */
const SECTION_COMPONENTS: Record<
    string,
    React.ComponentType<{
        resumeData: ResumeValues;
        setResumeData: React.Dispatch<React.SetStateAction<ResumeValues>>;
    }>
> = {
    "personal-info": PersonalInfoSection,
    profile: ProfileSection,
    education: EducationSection,
    skills: SkillsSection,
    experience: ExperienceSection,
    projects: ProjectsSection,
    awards: AwardsSection,
    publications: PublicationsSection,
    certificates: CertificatesSection,
    languages: LanguagesSection,
    courses: CoursesSection,
    references: ReferencesSection,
    interests: InterestsSection,
};

/** Count items for a section badge */
function getSectionCount(
    key: string,
    data: ResumeValues,
): number | undefined {
    switch (key) {
        case "experience":
            return data.workExperiences?.length;
        case "education":
            return data.educations?.length;
        case "projects":
            return data.projects?.length;
        case "awards":
            return data.awards?.length;
        case "publications":
            return data.publications?.length;
        case "certificates":
            return data.certificates?.length;
        case "languages":
            return data.languages?.length;
        case "courses":
            return data.courses?.length;
        case "references":
            return data.references?.length;
        case "interests":
            return data.interests?.length;
        default:
            return undefined;
    }
}

// ---------------------------------------------------------------------------
// Wrapper that gives each Reorder.Item its own useDragControls hook
// ---------------------------------------------------------------------------
function DraggableSectionItem({
    sectionKey,
    children,
}: {
    sectionKey: string;
    children: (startDrag: (e: React.PointerEvent) => void) => React.ReactNode;
}) {
    const controls = useDragControls();
    return (
        <Reorder.Item
            value={sectionKey}
            dragListener={false}
            dragControls={controls}
            as="div"
            layout="position"
            className="w-full min-w-0"
            whileDrag={{ zIndex: 10 }}
        >
            {children((e) => controls.start(e))}
        </Reorder.Item>
    );
}

// ---------------------------------------------------------------------------
// Main editor
// ---------------------------------------------------------------------------

interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null;
    userTier: "free" | "pro" | "lifetime";
}

export default function ResumeEditor({ resumeToEdit, userTier }: ResumeEditorProps) {
    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit) : {},
    );

    const [showSmResumePreview, setShowSmResumePreview] = useState(false);
    const [addContentOpen, setAddContentOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [portfolioOpen, setPortfolioOpen] = useState(false);

    // Derive preview settings from resumeData (persisted to DB via auto-save)
    const previewSettings: PreviewSettings = useMemo(
        () => ({
            fontSize: resumeData.fontSize ?? FONT_SIZE_DEFAULT,
            fontFamily:
                (resumeData.fontFamily as PreviewFontFamily) ?? "serif",
        }),
        [resumeData.fontSize, resumeData.fontFamily],
    );

    const setPreviewSettings = useCallback(
        (updater: PreviewSettings | ((prev: PreviewSettings) => PreviewSettings)) => {
            const next =
                typeof updater === "function" ? updater(previewSettings) : updater;
            setResumeData((prev) => ({
                ...prev,
                fontSize: next.fontSize,
                fontFamily: next.fontFamily,
            }));
        },
        [previewSettings],
    );

    // Track which sections are expanded (by key)
    const [openSections, setOpenSections] = useState<Set<string>>(
        new Set(),
    );




    const { isSaving, hasUnsavedChanges, lastSaveError } =
        useAutoSaveResume(resumeData);

    useUnloadWarning(hasUnsavedChanges);

    useEffect(() => {
        const previousBodyOverflow = document.body.style.overflow;
        const previousBodyOverscrollY = document.body.style.overscrollBehaviorY;
        const previousHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.body.style.overscrollBehaviorY = "none";
        document.documentElement.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousBodyOverflow;
            document.body.style.overscrollBehaviorY = previousBodyOverscrollY;
            document.documentElement.style.overflow = previousHtmlOverflow;
        };
    }, []);

    // Section order from resumeData, falling back to defaults
    const sectionOrder = useMemo(() => {
        const order =
            resumeData.sectionOrder && resumeData.sectionOrder.length > 0
                ? resumeData.sectionOrder
                : DEFAULT_SECTION_ORDER;
        const withoutPersonalInfo = order.filter((k) => k !== "personal-info");
        return ["personal-info", ...withoutPersonalInfo];
    }, [resumeData.sectionOrder]);

    const reorderableSectionOrder = useMemo(
        () => sectionOrder.filter((key) => key !== "personal-info"),
        [sectionOrder],
    );

    // Visibility map
    const sectionVisibility = resumeData.sectionVisibility ?? {};

    // ----- Handlers -----

    const setSectionOpen = useCallback((key: string, open: boolean) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (open) next.add(key);
            else next.delete(key);
            return next;
        });
    }, []);

    const toggleSectionVisibility = useCallback(
        (key: string) => {
            setResumeData((prev) => ({
                ...prev,
                sectionVisibility: {
                    ...(prev.sectionVisibility ?? {}),
                    [key]:
                        (prev.sectionVisibility?.[key] ?? true) === true
                            ? false
                            : true,
                },
            }));
        },
        [setResumeData],
    );

    const handleReorderSections = useCallback(
        (newOrder: string[]) => {
            const sanitized = newOrder.filter((key) => key !== "personal-info");
            setResumeData((prev) => ({
                ...prev,
                sectionOrder: ["personal-info", ...sanitized],
            }));
        },
        [setResumeData],
    );

    const handleAddSection = useCallback(
        (key: string) => {
            if (key === "personal-info") return;
            setResumeData((prev) => {
                const currentRaw = prev.sectionOrder ?? [...DEFAULT_SECTION_ORDER];
                const current = [
                    "personal-info",
                    ...currentRaw.filter((k) => k !== "personal-info"),
                ];
                if (current.includes(key)) return prev;
                return {
                    ...prev,
                    sectionOrder: [...current, key],
                    sectionVisibility: {
                        ...(prev.sectionVisibility ?? {}),
                        [key]: true,
                    },
                };
            });
            setOpenSections((prev) => new Set([...prev, key]));
        },
        [setResumeData],
    );

    const handleRemoveSection = useCallback(
        (key: string) => {
            if (key === "personal-info") return;
            setResumeData((prev) => ({
                ...prev,
                sectionOrder: (
                    prev.sectionOrder ?? [...DEFAULT_SECTION_ORDER]
                ).filter((k) => k !== key),
            }));
            setOpenSections((prev) => {
                const next = new Set(prev);
                next.delete(key);
                return next;
            });
        },
        [setResumeData],
    );

    const renderSection = (
        key: string,
        options?: { startDrag?: (e: React.PointerEvent) => void; draggable?: boolean },
    ) => {
        const meta = getSectionMeta(key);
        if (!meta) return null;

        const SectionContent = SECTION_COMPONENTS[key];
        if (!SectionContent) return null;

        const isVisible = sectionVisibility[key] !== false;
        const count = getSectionCount(key, resumeData);

        return (
            <SectionWrapper
                key={key}
                title={meta.title}
                icon={meta.icon}
                isVisible={isVisible}
                onToggleVisibility={() => toggleSectionVisibility(key)}
                count={count}
                removable={meta.isOptional}
                onRemove={() => handleRemoveSection(key)}
                open={openSections.has(key)}
                onOpenChange={(open) => setSectionOpen(key, open)}
                onDragStart={options?.startDrag}
                draggable={options?.draggable ?? true}
            >
                <SectionContent
                    resumeData={resumeData}
                    setResumeData={setResumeData}
                />
            </SectionWrapper>
        );
    };

    return (
        <div className="flex h-full w-full flex-col overflow-hidden bg-muted/10 bg-grid-pattern">
            {/* Main split view -- 35 / 65 */}
            <main className="relative grow">
                <div className="absolute bottom-0 top-0 flex w-full">
                    {/* LEFT PANEL: Accordion sections (35%) */}
                    <div
                        className={cn(
                            "w-full min-w-0 max-w-full md:block md:w-[35%] md:max-w-[35%]",
                            showSmResumePreview && "hidden",
                        )}
                    >
                        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="w-full min-w-0 max-w-full space-y-4 p-4 md:p-6"
                            >
                                {/* Header / Title area could go here if needed */}

                                <div className="space-y-4">
                                    {/* Fixed top section: cannot be dragged/reordered */}
                                    {renderSection("personal-info", {
                                        draggable: false,
                                    })}

                                    <Reorder.Group
                                        axis="y"
                                        values={reorderableSectionOrder}
                                        onReorder={handleReorderSections}
                                        as="div"
                                        className="w-full min-w-0 max-w-full space-y-4 overflow-x-hidden"
                                    >
                                        {reorderableSectionOrder.map((key) => (
                                            <DraggableSectionItem
                                                key={key}
                                                sectionKey={key}
                                            >
                                                {(startDrag) =>
                                                    renderSection(key, {
                                                        startDrag,
                                                    })
                                                }
                                            </DraggableSectionItem>
                                        ))}
                                    </Reorder.Group>
                                </div>

                                {/* Add Content button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full border-dashed border-primary/30 py-6 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all active:scale-[0.99]"
                                    onClick={() => setAddContentOpen(true)}
                                >
                                    <Plus className="mr-1.5 h-4 w-4" />
                                    Add Section
                                </Button>

                                <div className="h-10" /> {/* Spacer for bottom scroll */}
                            </motion.div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="hidden shrink-0 md:block w-px bg-border/40" />

                    {/* RIGHT PANEL: Live preview (70%) */}
                    <ResumePreviewSection
                        resumeData={resumeData}
                        setResumeData={setResumeData}
                        previewSettings={previewSettings}
                        onPreviewSettingsChange={setPreviewSettings}
                        onPreviewOpen={() => setPreviewOpen(true)}
                        userTier={userTier}
                        className={cn(showSmResumePreview && "flex")}
                    />
                </div>
            </main>

            {/* Footer */}
            <Footer
                showSmResumePreview={showSmResumePreview}
                setShowSmResumePreview={setShowSmResumePreview}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
                lastSaveError={lastSaveError}
                onGeneratePortfolio={() => setPortfolioOpen(true)}
                resumeId={resumeData.id}
            />

            {/* Modals */}
            <AddContentModal
                open={addContentOpen}
                onOpenChange={setAddContentOpen}
                currentOrder={sectionOrder}
                onAddSection={handleAddSection}
            />
            <PreviewModal
                open={previewOpen}
                onOpenChange={setPreviewOpen}
                resumeData={resumeData}
                previewSettings={previewSettings}
                userTier={userTier}
            />
            <PortfolioModal
                open={portfolioOpen}
                onOpenChange={setPortfolioOpen}
                resumeId={resumeData.id ?? ""}
                resumeTitle={resumeData.title}
            />
        </div>
    );
}
