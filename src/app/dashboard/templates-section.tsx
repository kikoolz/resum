"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sampleTemplates, type SampleTemplate } from "./sample-templates";
import { TemplatePreviewModal } from "./template-preview-modal";
import ResumeTemplate from "./editor/[resumeId]/ResumeTemplate";
import {
  PAGE_WIDTH,
  PAGE_PADDING_X,
  PAGE_PADDING_Y,
  getPreviewFontFamilyCss,
} from "./editor/[resumeId]/previewConfig";
import { ArrowRight, Lock } from "lucide-react";
import { PLAN_LIMITS, type PlanTier } from "@/lib/subscription";

export default function TemplatesSection({ userTier }: { userTier?: PlanTier }) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<SampleTemplate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const allowedTemplates = userTier ? PLAN_LIMITS[userTier].templates : PLAN_LIMITS.free.templates;

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
        Choose a template to get started quickly. Each one is fully customizable
        once you start editing.
      </p>

      <div className="mt-8 h-px bg-foreground/10" />

      <div className="grid grid-cols-1 gap-6 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {sampleTemplates.map((template, index) => (
          <TemplateCard
            key={template.name}
            template={template}
            index={index + 1}
            isLocked={!allowedTemplates.includes(template.data.templateName as typeof allowedTemplates[number])}
            onClick={() => handleTemplateClick(template.name)}
          />
        ))}
      </div>

      <TemplatePreviewModal
        template={selectedTemplate}
        open={modalOpen}
        onOpenChange={setModalOpen}
        userTier={userTier}
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
  isLocked,
  onClick,
}: {
  template: SampleTemplate;
  index: number;
  isLocked: boolean;
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
    <div onClick={onClick} className="group cursor-pointer">
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
        <div className="absolute inset-0 flex items-center justify-center bg-foreground/0 transition-all duration-300 group-hover:bg-foreground/12">
          {isLocked ? (
            <span className="translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 inline-flex items-center gap-1.5 bg-foreground/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-background/80 backdrop-blur-sm font-heading">
              <Lock className="h-3 w-3" />
              Pro
            </span>
          ) : (
            <button className="group/preview translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 inline-flex bg-primary px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-background/80 backdrop-blur-sm cursor-pointer font-heading">
              select template
              <ArrowRight className="ml-2 h-4 w-4 animate-[arrowSlide_0.8s_ease-in-out_infinite]" />
            </button>
          )}
        </div>

        {/* Lock badge */}
        {isLocked && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-1 bg-foreground/80 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-background/80 backdrop-blur-sm font-heading">
              <Lock className="h-2.5 w-2.5" />
              Pro
            </span>
          </div>
        )}
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
