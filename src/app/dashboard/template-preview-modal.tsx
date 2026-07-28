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
import { Loader2 } from "lucide-react";
import ResumeTemplate from "./editor/[resumeId]/ResumeTemplate";
import {
    PAGE_WIDTH,
    PAGE_PADDING_X,
    PAGE_PADDING_Y,
    getPreviewFontFamilyCss,
} from "./editor/[resumeId]/previewConfig";
import type { SampleTemplate } from "./sample-templates";
import { createResumeFromTemplate } from "./actions";

const A4_RATIO = 297 / 210;

interface TemplatePreviewModalProps {
    template: SampleTemplate | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TemplatePreviewModal({
    template,
    open,
    onOpenChange,
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
            <DialogContent className="flex h-[90vh] w-[95vw] max-w-5xl flex-col gap-0 overflow-hidden border-2 border-foreground p-0 shadow-[8px_8px_0px_0px_var(--color-foreground)] sm:rounded-none">
                {/* Header */}
                <DialogHeader className="flex-none border-b-2 border-foreground px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight">
                                {template.name} Template
                            </DialogTitle>
                            <DialogDescription className="text-sm font-medium text-muted-foreground">
                                {template.description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Preview Area */}
                <div
                    ref={wrapperRef}
                    className="flex-1 overflow-auto bg-muted/30"
                >
                    <div className="flex items-center justify-center p-6" style={{ minHeight: "100%" }}>
                        <div
                            className="bg-white shadow-[4px_4px_0px_0px_var(--color-foreground)] border-2 border-foreground"
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

                {/* Footer */}
                <div className="flex-none border-t-2 border-foreground bg-card px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <p className="hidden text-sm font-medium text-muted-foreground sm:block">
                            Use this template as a starting point
                        </p>
                        <div className="flex w-full gap-3 sm:w-auto">
                            <Button
                                variant="outline"
                                className="flex-1 border-2 border-foreground font-bold shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--color-foreground)] sm:flex-none cursor-pointer"
                                onClick={() => onOpenChange(false)}
                            >
                                Close
                            </Button>
                            <Button
                                className="flex-1 border-2 border-foreground bg-primary font-bold text-primary-foreground shadow-[3px_3px_0px_0px_var(--color-foreground)] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_var(--color-foreground)] sm:flex-none cursor-pointer"
                                disabled={isCreating}
                                onClick={handleCreateYours}
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating…
                                    </>
                                ) : (
                                    "Create Yours"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
