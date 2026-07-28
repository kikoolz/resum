"use client";

import { forwardRef } from "react";
import type { ResumeValues } from "@/lib/validation";
import {
    CONTENT_HEIGHT,
    PAGE_HEIGHT,
    PAGE_PADDING_X,
    PAGE_PADDING_Y,
    PAGE_WIDTH,
    getPreviewFontFamilyCss,
} from "./previewConfig";
import { ResumePageFlow, useResumePagination } from "./resumePagination";

interface PrintableResumeProps {
    resumeData: ResumeValues;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
        : null;
}

function mixColor(color1Hex: string, pct: number, color2Hex: string): string {
    const c1 = hexToRgb(color1Hex);
    const c2 = hexToRgb(color2Hex);
    if (!c1 || !c2) return color2Hex;
    const r = Math.round(c2.r + (c1.r - c2.r) * pct);
    const g = Math.round(c2.g + (c1.g - c2.g) * pct);
    const b = Math.round(c2.b + (c1.b - c2.b) * pct);
    return `rgb(${r}, ${g}, ${b})`;
}

function getPageBackground(templateName: string | undefined, colorHex: string | undefined): string | undefined {
    const color = colorHex || "#000000";
    switch (templateName) {
        // Full-page background templates
        case "fresh":
            return mixColor(color, 0.08, "#F5F8E8");
        case "blush":
            return mixColor(color, 0.08, "#FFFFFF");
        case "notion":
            return "#f5f5f0";
        // Sidebar-only background templates (gradient: sidebar color on left/right, white on rest)
        case "creative": {
            // Left sidebar 32%, accent color
            const c = color;
            return `linear-gradient(to right, ${c} 0%, ${c} 32%, #ffffff 32%)`;
        }
        case "europass": {
            // Left sidebar 34%, tinted accent
            const c = mixColor(color, 0.15, "#FFFFFF");
            return `linear-gradient(to right, ${c} 0%, ${c} 34%, #ffffff 34%)`;
        }
        case "classic": {
            // Left sidebar 30%, light gray
            return `linear-gradient(to right, #F3F3F3 0%, #F3F3F3 30%, #ffffff 30%)`;
        }
        case "profile": {
            // Right sidebar 35%, tinted accent
            const c = mixColor(color, 0.12, "#FFFFFF");
            return `linear-gradient(to left, ${c} 0%, ${c} 35%, #ffffff 35%)`;
        }
        case "euro-modern": {
            // Right sidebar 35%, light gray
            return `linear-gradient(to left, #F5F5F5 0%, #F5F5F5 35%, #ffffff 35%)`;
        }
        default:
            return undefined;
    }
}

const PrintableResume = forwardRef<HTMLDivElement, PrintableResumeProps>(
    function PrintableResume({ resumeData }, ref) {
        const fontScale = (resumeData.fontSize ?? 10) / 10;
        const fontFamilyCss = getPreviewFontFamilyCss(resumeData.fontFamily);
        const pageBackground = getPageBackground(resumeData.templateName, resumeData.colorHex);

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

        return (
            <div
                aria-hidden
                style={{
                    overflow: "hidden",
                    height: 0,
                    position: "absolute",
                    left: 0,
                    top: 0,
                }}
            >
                <div
                    aria-hidden
                    style={{
                        position: "absolute",
                        left: -10000,
                        top: 0,
                        opacity: 0,
                        pointerEvents: "none",
                    }}
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
                    ref={ref}
                    id="resumePrintContent"
                    style={{
                        width: PAGE_WIDTH,
                        margin: "0 auto",
                        background: "white",
                        color: "black",
                    }}
                >
                    {Array.from({ length: numPages }).map((_, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="resume-print-page"
                            style={{
                                width: PAGE_WIDTH,
                                height: PAGE_HEIGHT,
                                position: "relative",
                                overflow: "hidden",
                                ...(pageBackground ? { backgroundColor: pageBackground } : {}),
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    overflow: "hidden",
                                }}
                            >
                                <ResumePageFlow
                                    resumeData={resumeData}
                                    fontFamilyCss={fontFamilyCss}
                                    fontScale={fontScale}
                                    effectiveContentWidth={effectiveContentWidth}
                                    effectiveContentHeight={effectiveContentHeight}
                                    pageIndex={pageIndex}
                                    printPageWidth={PAGE_WIDTH}
                                    printPageHeight={PAGE_HEIGHT}
                                    printPaddingX={PAGE_PADDING_X}
                                    printPaddingY={PAGE_PADDING_Y}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
);

export default PrintableResume;
