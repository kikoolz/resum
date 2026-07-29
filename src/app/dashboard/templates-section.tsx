"use client";

import { useState, useRef, useEffect } from "react";
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
        <div className="mt-16">
            <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Get Started
            </div>
            <h2 className="text-3xl font-black tracking-tight">Templates</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Choose a template to get started quickly. Each one is fully customizable once you start editing.
            </p>

            <div className="mt-8 h-px bg-foreground/10" />

            <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-4">
                {sampleTemplates.map((template, index) => (
                    <TemplateCard
                        key={template.name}
                        template={template}
                        index={index + 1}
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
// Template Card with live rendered preview — Editorial style
// ---------------------------------------------------------------------------

function TemplateCard({
    template,
    index,
    onClick,
}: {
    template: SampleTemplate;
    index: number;
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
        <div
            onClick={onClick}
            className="group cursor-pointer"
        >
            {/* Live rendered preview */}
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden bg-white"
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

                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/[0.12]">
                    <span className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 text-xs font-medium uppercase tracking-[0.15em] text-foreground/70">
                        Preview
                    </span>
                </div>
            </div>

            {/* Card info */}
            <div className="mt-3 flex items-start justify-between">
                <div>
                    <h3 className="text-sm font-bold tracking-tight">{template.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                        {template.description}
                    </p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground/60 tabular-nums">
                    {String(index).padStart(2, "0")}
                </span>
            </div>
        </div>
    );
}
