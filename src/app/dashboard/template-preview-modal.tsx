"use client";

import { useState, useRef, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Lock } from "lucide-react";
import ResumeTemplate from "./editor/[resumeId]/ResumeTemplate";
import {
    PAGE_WIDTH,
    PAGE_PADDING_X,
    PAGE_PADDING_Y,
    getPreviewFontFamilyCss,
} from "./editor/[resumeId]/previewConfig";
import type { SampleTemplate } from "./sample-templates";
import { createResumeFromTemplate } from "./actions";
import { PLAN_LIMITS, type PlanTier } from "@/lib/subscription";

const A4_RATIO = 297 / 210;

interface TemplatePreviewModalProps {
    template: SampleTemplate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userTier?: PlanTier;
}

export function TemplatePreviewModal({
    template,
    open,
    onOpenChange,
    userTier,
}: TemplatePreviewModalProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!open) return;
        const el = wrapperRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            setContainerSize({
                width: entry?.contentRect.width ?? 0,
                height: entry?.contentRect.height ?? 0,
            });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [open]);

    if (!template) return null;

    const allowedTemplates = userTier ? PLAN_LIMITS[userTier].templates : PLAN_LIMITS.free.templates;
    const isLocked = !allowedTemplates.includes(template.data.templateName as typeof allowedTemplates[number]);

    const fontFamilyCss = getPreviewFontFamilyCss(template.data.fontFamily);
    const fontScale = (template.data.fontSize ?? 10) / 10;
    const contentWidth = PAGE_WIDTH - PAGE_PADDING_X * 2;

    const padding = 48;
    const pageHeight = PAGE_WIDTH * A4_RATIO;
    const availW = containerSize.width - padding;
    const availH = containerSize.height - padding;
    const scale = containerSize.width > 0
        ? Math.min(1, availW / PAGE_WIDTH, availH / pageHeight)
        : 0.6;

    async function handleCreateYours() {
        if (!template) return;
        setIsCreating(true);
        try {
            await createResumeFromTemplate(template.data);
        } catch {
            setIsCreating(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex h-[90vh] w-[95vw] max-w-6xl flex-col gap-0 overflow-hidden rounded-none border-none p-0 shadow-none">
                {/* Header */}
                <DialogHeader className="flex-none px-8 pb-6 pt-8">
                    <div className="flex items-start justify-between gap-8">
                        <div>
                            <DialogDescription className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                                Template Preview
                            </DialogDescription>
                            <DialogTitle className="text-3xl font-black tracking-tight md:text-4xl">
                                {template.name}
                            </DialogTitle>
                            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                                {template.description}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Thin divider */}
                <div className="mx-8 h-px bg-foreground/10" />

                {/* Preview Area */}
                <div
                    ref={wrapperRef}
                    className="flex-1 overflow-auto bg-muted/20"
                >
                    <div className="flex items-center justify-center p-8" style={{ minHeight: "100%" }}>
                        <div
                            className="bg-white shadow-lg"
                            style={{
                                width: PAGE_WIDTH * scale,
                                height: pageHeight * scale,
                            }}
                        >
                            <div
                                style={{
                                    transform: `scale(${scale})`,
                                    transformOrigin: "top left",
                                    width: PAGE_WIDTH,
                                    height: pageHeight,
                                    padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
                                    overflow: "hidden",
                                }}
                            >
                                <div style={{ width: contentWidth, zoom: fontScale }}>
                                    <ResumeTemplate
                                        resumeData={template.data}
                                        fontFamily={fontFamilyCss}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thin divider */}
                <div className="mx-8 h-px bg-foreground/10" />

                {/* Footer */}
                <div className="flex-none bg-background px-8 py-6">
                    <div className="flex items-center justify-between gap-4">
                        <p className="hidden text-xs uppercase tracking-[0.15em] text-muted-foreground sm:block">
                            {isLocked ? "Upgrade to use this template" : "Use as a starting point"}
                        </p>
                        <div className="flex w-full gap-3 sm:w-auto">
                            <Button
                                variant="ghost"
                                className="flex-1 rounded-none px-6 font-medium tracking-wide text-muted-foreground hover:text-foreground sm:flex-none cursor-pointer"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                            {isLocked ? (
                                <Button
                                    className="group flex-1 rounded-none bg-foreground px-6 font-bold text-background hover:bg-foreground/90 sm:flex-none cursor-pointer"
                                    onClick={() => {
                                        onOpenChange(false);
                                        window.location.href = "/dashboard/billing";
                                    }}
                                >
                                    <Lock className="mr-2 h-4 w-4" />
                                    Upgrade to Pro
                                </Button>
                            ) : (
                                <Button
                                    className="group flex-1 rounded-none bg-foreground px-6 font-bold text-background hover:bg-foreground/90 sm:flex-none cursor-pointer"
                                    disabled={isCreating}
                                    onClick={handleCreateYours}
                                >
                                    {isCreating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Use This Template
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
