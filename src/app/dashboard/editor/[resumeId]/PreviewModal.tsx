"use client";

import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, X } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import type { ResumeValues } from "@/lib/validation";
import PrintableResume from "./PrintableResume";
import {
    PAGE_HEIGHT,
    PAGE_PADDING_X,
    PAGE_PADDING_Y,
    PAGE_WIDTH,
    RESUME_PRINT_PAGE_STYLE,
    getPreviewFontFamilyCss,
    type PreviewSettings,
} from "./previewConfig";
import { ResumePageFlow, useResumePagination } from "./resumePagination";

interface PreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resumeData: ResumeValues;
    previewSettings: PreviewSettings;
}

export default function PreviewModal({
    open,
    onOpenChange,
    resumeData,
    previewSettings,
}: PreviewModalProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const printRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(PAGE_WIDTH + 48);

    const fontScale = previewSettings.fontSize / 10;
    const fontFamilyCss = getPreviewFontFamilyCss(previewSettings.fontFamily);

    const {
        numPages,
        measureFlowRef,
        effectiveContentWidth,
        effectiveContentHeight,
    } = useResumePagination({
        resumeData,
        fontFamilyCss,
        fontScale,
        active: open,
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

    useEffect(() => {
        if (!open) return;

        const element = containerRef.current;
        if (!element) return;

        const observer = new ResizeObserver((entries) => {
            setContainerWidth(entries[0]?.contentRect.width ?? PAGE_WIDTH + 48);
        });
        observer.observe(element);

        return () => observer.disconnect();
    }, [open]);

    const displayScale = Math.min(
        1,
        Math.max(0.35, (containerWidth - 48) / PAGE_WIDTH),
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="flex h-[90vh] w-[min(96vw,800px)] max-w-none flex-col gap-0 p-0 sm:max-w-none"
            >
                <DialogHeader className="shrink-0 border-b px-6 py-4">
                    <div className="flex items-center justify-between gap-3">
                        <DialogTitle>
                            Resume Preview
                            <span className="ml-2 text-sm font-normal text-muted-foreground">
                                {numPages} {numPages === 1 ? "page" : "pages"}
                            </span>
                        </DialogTitle>
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrint()}
                            >
                                <Printer className="mr-1.5 h-4 w-4" />
                                Print / PDF
                            </Button>
                            <DialogClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    aria-label="Close preview"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </DialogHeader>

                <div ref={containerRef} className="relative flex-1 overflow-hidden">
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

                    <ScrollArea className="h-full bg-muted/50">
                        <div className="flex flex-col items-center gap-6 p-6">
                            {Array.from({ length: numPages }).map((_, pageIndex) => (
                                <div key={pageIndex}>
                                    <div
                                        style={{
                                            width: PAGE_WIDTH * displayScale,
                                            height: PAGE_HEIGHT * displayScale,
                                        }}
                                    >
                                        <div
                                            className="relative rounded-sm bg-white shadow-md"
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
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                <PrintableResume ref={printRef} resumeData={resumeData} />
            </DialogContent>
        </Dialog>
    );
}
