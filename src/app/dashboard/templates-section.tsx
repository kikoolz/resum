"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { sampleTemplates, type SampleTemplate } from "./sample-templates";
import { TemplatePreviewModal } from "./template-preview-modal";
import ResumeTemplate from "./editor/[resumeId]/ResumeTemplate";
import {
    PAGE_WIDTH,
    PAGE_PADDING_X,
    PAGE_PADDING_Y,
    getPreviewFontFamilyCss,
} from "./editor/[resumeId]/previewConfig";

export default function TemplatesSection() {
    const [selectedTemplate, setSelectedTemplate] =
        useState<SampleTemplate | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    function handleTemplateClick(templateName: string) {
        const template = sampleTemplates.find((t) => t.name === templateName);
        if (template) {
            setSelectedTemplate(template);
            setModalOpen(true);
        }
    }

    return (
        <div className="mt-12">
            <h2 className="mb-4 text-2xl font-bold">Templates</h2>
            <p className="mb-6 text-muted-foreground">
                Choose a template to get started quickly
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {sampleTemplates.map((template) => (
                    <TemplateCard
                        key={template.name}
                        template={template}
                        onClick={() => handleTemplateClick(template.name)}
                    />
                ))}
            </div>

            <TemplatePreviewModal
                template={selectedTemplate}
                open={modalOpen}
                onOpenChange={setModalOpen}
            />
        </div>
    );
}

// ---------------------------------------------------------------------------
// Template Card with live rendered preview
// ---------------------------------------------------------------------------

function TemplateCard({
    template,
    onClick,
}: {
    template: SampleTemplate;
    onClick: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width ?? 0;
            setCardWidth(width);
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const fontFamilyCss = getPreviewFontFamilyCss(template.data.fontFamily);
    const fontScale = (template.data.fontSize ?? 10) / 10;
    const contentWidth = PAGE_WIDTH - PAGE_PADDING_X * 2;
    const scale = cardWidth > 0 ? (cardWidth - 16) / PAGE_WIDTH : 0.35;
    const scaledHeight = PAGE_WIDTH * (297 / 210) * scale;

    return (
        <Card
            onClick={onClick}
            className="group relative cursor-pointer overflow-hidden p-0 template-card"
        >
            {/* Live rendered preview */}
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden bg-white border-b"
                style={{ height: scaledHeight }}
            >
                {mounted && (
                    <div
                        style={{
                            width: PAGE_WIDTH,
                            transform: `scale(${scale})`,
                            transformOrigin: "top left",
                        }}
                    >
                        <div
                            style={{
                                padding: `${PAGE_PADDING_Y}px ${PAGE_PADDING_X}px`,
                                width: PAGE_WIDTH,
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
                )}
            </div>

            {/* Select overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/50">
                <div className="translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 bg-background/95 backdrop-blur-sm text-foreground text-base font-medium px-5 py-2.5 tracking-wide font-heading">
                        Select Template
                        <svg className="h-3.5 w-3.5 animate-none group-hover:animate-[arrowSlide_0.6s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                    </span>
                </div>
            </div>

            {/* Card info */}
            <div className="p-3">
                <h3 className="text-sm font-medium">{template.name}</h3>
                <p className="text-xs text-muted-foreground">
                    {template.description}
                </p>
            </div>
        </Card>
    );
}
