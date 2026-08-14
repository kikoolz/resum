"use client";

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText, FileDown, Maximize2, Minus, Plus, Printer, Lock } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import type { ResumeValues } from "@/lib/validation";
import { PLAN_LIMITS } from "@/lib/subscription";
import PrintableResume from "./PrintableResume";
import {
    FONT_FAMILIES,
    FONT_SIZE_MAX,
    FONT_SIZE_MIN,
    PAGE_HEIGHT,
    PAGE_PADDING_X,
    PAGE_PADDING_Y,
    PAGE_WIDTH,
    RESUME_PRINT_PAGE_STYLE,
    getPreviewFontFamilyCss,
    type PreviewFontFamily,
    type PreviewSettings,
} from "./previewConfig";
import { ResumePageFlow, useResumePagination } from "./resumePagination";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: Dispatch<SetStateAction<ResumeValues>>;
    previewSettings: PreviewSettings;
    onPreviewSettingsChange: Dispatch<SetStateAction<PreviewSettings>>;
    onPreviewOpen?: () => void;
    userTier?: "free" | "pro" | "lifetime";
    className?: string;
}

export default function ResumePreviewSection({
    resumeData,
    setResumeData,
    previewSettings,
    onPreviewSettingsChange,
    onPreviewOpen,
    userTier,
    className,
}: ResumePreviewSectionProps) {
    const fontSize = previewSettings.fontSize;
    const fontFamilyKey = previewSettings.fontFamily;
    const fontScale = fontSize / 10;
    const fontFamilyCss = getPreviewFontFamilyCss(fontFamilyKey);

    const allowedTemplates = PLAN_LIMITS[userTier ?? "free"].templates as readonly string[];

    const containerRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(PAGE_WIDTH + 48);

    const {
        numPages,
        measureFlowRef,
        effectiveContentWidth,
        effectiveContentHeight,
    } = useResumePagination({
        resumeData,
        fontFamilyCss,
        fontScale,
    });

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: resumeData.title || "Resume",
        pageStyle: RESUME_PRINT_PAGE_STYLE,
        onBeforePrint: async () => {
            const el = printRef.current;
            if (!el) return;
            const imgs = Array.from(el.querySelectorAll("img"));
            await Promise.allSettled(
                imgs.map(
                    (img) =>
                        new Promise<void>((resolve) => {
                            if (img.complete && img.naturalWidth > 0) {
                                resolve();
                                return;
                            }
                            img.onload = () => resolve();
                            img.onerror = () => resolve();
                        })
                )
            );
        },
    });

    async function handleDocxDownload() {
        if (!resumeData.id) return;
        try {
            const res = await fetch("/api/export-docx", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ resumeId: resumeData.id }),
            });
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${(resumeData.firstName || "resume").replace(/\s+/g, "_")}_${(resumeData.lastName || "").replace(/\s+/g, "_")}_resume.docx`.replace(/^_/, "");
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("DOCX export error:", err);
        }
    }

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            setContainerWidth(entries[0]?.contentRect.width ?? PAGE_WIDTH + 48);
        });
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const displayScale = Math.min(
        1,
        Math.max(0.35, (containerWidth - 48) / PAGE_WIDTH),
    );

    const hasAnyContent = Boolean(
        resumeData.firstName ||
        resumeData.lastName ||
        resumeData.summary ||
        resumeData.jobTitle ||
        resumeData.workExperiences?.length ||
        resumeData.educations?.length ||
        resumeData.skills?.length ||
        resumeData.projects?.length,
    );

    return (
        <div
            className={cn(
                "group relative hidden w-full flex-col md:flex md:w-[65%] md:max-w-[65%]",
                className,
            )}
        >
            <div className="absolute left-0 right-0 top-0 z-10 flex w-full justify-center p-4">
                <div className="flex items-center gap-3 rounded-full border border-border/40 bg-background/80 px-4 py-2 shadow-sm backdrop-blur-md transition-all hover:border-border/80 hover:shadow-md supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                            onClick={() =>
                                onPreviewSettingsChange((prev) => ({
                                    ...prev,
                                    fontSize: Math.max(FONT_SIZE_MIN, prev.fontSize - 1),
                                }))
                            }
                            disabled={fontSize <= FONT_SIZE_MIN}
                            title="Decrease font size"
                        >
                            <Minus className="h-3.5 w-3.5" />
                        </Button>
                        <div className="flex w-12 items-center justify-center">
                            <span className="text-sm font-medium tabular-nums">
                                {fontSize}px
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                            onClick={() =>
                                onPreviewSettingsChange((prev) => ({
                                    ...prev,
                                    fontSize: Math.min(FONT_SIZE_MAX, prev.fontSize + 1),
                                }))
                            }
                            disabled={fontSize >= FONT_SIZE_MAX}
                            title="Increase font size"
                        >
                            <Plus className="h-3.5 w-3.5" />
                        </Button>
                    </div>

                    <div className="h-4 w-px bg-border" />

                    <Select
                        value={fontFamilyKey}
                        onValueChange={(value) =>
                            onPreviewSettingsChange((prev) => ({
                                ...prev,
                                fontFamily: value as PreviewFontFamily,
                            }))
                        }
                    >
                        <SelectTrigger className="h-8 w-[130px] border-none bg-transparent text-xs font-medium focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="center">
                            {FONT_FAMILIES.map((family) => (
                                <SelectItem key={family.value} value={family.value}>
                                    {family.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="h-4 w-px bg-border" />

                    {/* Template Selector */}
                    <Select
                        value={resumeData.templateName || "professional"}
                        onValueChange={(value) =>
                            setResumeData((prev) => ({
                                ...prev,
                                templateName: value as ResumeValues["templateName"],
                            }))
                        }
                    >
                        <SelectTrigger className="h-8 w-[130px] border-none bg-transparent text-xs font-medium focus:ring-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent align="center">
                            {([
                                { value: "professional", label: "Professional" },
                                { value: "creative", label: "Creative" },
                                { value: "modern", label: "Modern" },
                                { value: "simple", label: "Simple" },
                                { value: "europass", label: "Europass" },
                                { value: "executive", label: "Executive" },
                                { value: "blush", label: "Blush" },
                                { value: "fresh", label: "Fresh" },
                                { value: "classic", label: "Classic" },
                                { value: "sleek", label: "Sleek" },
                                { value: "profile", label: "Profile" },
                                { value: "euro-modern", label: "Euro Modern" },
                                { value: "badge", label: "Badge" },
                                { value: "timeline", label: "Timeline" },
                                { value: "minimal", label: "Minimal" },
                                { value: "notion", label: "Notion" },
                                { value: "academy", label: "Academy" },
                                { value: "bold", label: "Bold" },
                                { value: "executive-pro", label: "Executive Pro" },
                                { value: "classic-timeline", label: "Classic Timeline" },
                            ] as const).map((tpl) => {
                                const isAllowed = allowedTemplates.includes(tpl.value);
                                return (
                                    <SelectItem
                                        key={tpl.value}
                                        value={tpl.value}
                                        disabled={!isAllowed}
                                    >
                                        <span className="flex items-center gap-1.5">
                                            {tpl.label}
                                            {!isAllowed && (
                                                <Lock className="h-3 w-3 text-muted-foreground" />
                                            )}
                                        </span>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>

                    <div className="h-4 w-px bg-border" />

                    {/* Color Palette */}
                    <div className="flex items-center gap-1.5">
                        {[
                            { label: "Black", value: "#000000" },
                            { label: "Navy", value: "#1e3a5f" },
                            { label: "Blue", value: "#2563eb" },
                            { label: "Teal", value: "#0d9488" },
                            { label: "Green", value: "#16a34a" },
                            { label: "Orange", value: "#ea580c" },
                            { label: "Red", value: "#dc2626" },
                            { label: "Purple", value: "#7c3aed" },
                        ].map((color) => (
                            <button
                                key={color.value}
                                type="button"
                                title={color.label}
                                className={`h-5 w-5 rounded-full border transition-all hover:scale-110 ${
                                    (resumeData.colorHex || "#000000") === color.value
                                        ? "border-foreground ring-1 ring-foreground/30 scale-110"
                                        : "border-muted-foreground/30 hover:border-muted-foreground/60"
                                }`}
                                style={{ backgroundColor: color.value }}
                                onClick={() =>
                                    setResumeData((prev) => ({
                                        ...prev,
                                        colorHex: color.value,
                                    }))
                                }
                            />
                        ))}
                        <label
                            className="relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-dashed border-muted-foreground/30 transition-all hover:border-muted-foreground/60"
                            title="Custom color"
                        >
                            <input
                                type="color"
                                value={resumeData.colorHex || "#000000"}
                                onChange={(e) =>
                                    setResumeData((prev) => ({
                                        ...prev,
                                        colorHex: e.target.value,
                                    }))
                                }
                                className="absolute inset-0 cursor-pointer opacity-0"
                            />
                            <span className="text-[9px] text-muted-foreground">+</span>
                        </label>
                    </div>

                    <div className="h-4 w-px bg-border" />

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                            onClick={() => handlePrint()}
                            title={`Print ${numPages} page${numPages === 1 ? "" : "s"}`}
                        >
                            <Printer className="h-4 w-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                            onClick={handleDocxDownload}
                            title="Download as DOCX"
                        >
                            <FileDown className="h-4 w-4" />
                        </Button>

                        {onPreviewOpen && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:bg-muted"
                                onClick={onPreviewOpen}
                                title="Fullscreen preview"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div
                aria-hidden
                className="pointer-events-none absolute top-0 opacity-0"
                style={{ left: -10000 }}
            >
                <ResumePageFlow
                    resumeData={resumeData}
                    fontFamilyCss={fontFamilyCss}
                    fontScale={fontScale}
                    effectiveContentWidth={effectiveContentWidth}
                    effectiveContentHeight={effectiveContentHeight}
                    flowRef={measureFlowRef}
                />
            </div>

            <div
                ref={containerRef}
                className="relative flex-1 overflow-hidden bg-muted/30"
            >
                <ScrollArea className="h-full">
                    <div className="flex flex-col items-center gap-6 pb-20 pt-24 px-6 md:pt-28">
                        {hasAnyContent ? (
                            Array.from({ length: numPages }).map((_, pageIndex) => (
                                <div key={pageIndex}>
                                    <div
                                        style={{
                                            width: PAGE_WIDTH * displayScale,
                                            height: PAGE_HEIGHT * displayScale,
                                        }}
                                    >
                                        <div
                                            className="relative rounded-sm bg-white shadow-2xl transition-shadow duration-300 dark:shadow-xl"
                                            style={{
                                                width: PAGE_WIDTH,
                                                height: PAGE_HEIGHT,
                                                transform: `scale(${displayScale})`,
                                                transformOrigin: "top left",
                                            }}
                                        >
                                            <div
                                                className="absolute overflow-hidden"
                                                style={{
                                                    top: PAGE_PADDING_Y,
                                                    left: PAGE_PADDING_X,
                                                    right: PAGE_PADDING_X,
                                                }}
                                            >
                                                <ResumePageFlow
                                                    resumeData={resumeData}
                                                    fontFamilyCss={fontFamilyCss}
                                                    fontScale={fontScale}
                                                    effectiveContentWidth={
                                                        effectiveContentWidth
                                                    }
                                                    effectiveContentHeight={
                                                        effectiveContentHeight
                                                    }
                                                    pageIndex={pageIndex}
                                                />
                                            </div>
                                            <div className="absolute bottom-2 right-4 text-[10px] text-neutral-300">
                                                {pageIndex + 1} / {numPages}
                                            </div>
                                        </div>
                                    </div>

                                    {pageIndex < numPages - 1 && (
                                        <div className="mx-auto mt-2 flex items-center gap-2 px-4">
                                            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                                            <span className="text-[10px] text-neutral-400">
                                                Page break
                                            </span>
                                            <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div
                                style={{
                                    width: PAGE_WIDTH * displayScale,
                                    height: PAGE_HEIGHT * displayScale,
                                }}
                            >
                                <div
                                    className="relative rounded-sm bg-white shadow-xl dark:shadow-2xl"
                                    style={{
                                        width: PAGE_WIDTH,
                                        height: PAGE_HEIGHT,
                                        transform: `scale(${displayScale})`,
                                        transformOrigin: "top left",
                                    }}
                                >
                                    <div className="flex h-full flex-col items-center justify-center text-center">
                                        <FileText className="mb-3 h-10 w-10 text-neutral-200" />
                                        <p className="text-sm text-neutral-400">
                                            Your resume preview will appear here
                                        </p>
                                        <p className="mt-1 text-xs text-neutral-300">
                                            Start filling in the sections on the
                                            left
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>

            <PrintableResume ref={printRef} resumeData={resumeData} userTier={userTier} />
        </div>
    );
}
