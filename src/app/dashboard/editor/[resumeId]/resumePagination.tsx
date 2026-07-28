"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type Ref,
} from "react";
import type { ResumeValues } from "@/lib/validation";
import ResumeTemplate from "./ResumeTemplate";
import { CONTENT_HEIGHT, CONTENT_WIDTH } from "./previewConfig";

interface UseResumePaginationArgs {
    resumeData: ResumeValues;
    fontFamilyCss: string;
    fontScale: number;
    active?: boolean;
}

interface UseResumePaginationResult {
    numPages: number;
    measureFlowRef: React.RefObject<HTMLDivElement | null>;
    effectiveContentWidth: number;
    effectiveContentHeight: number;
    recomputePageCount: () => void;
}

interface ResumePageFlowProps {
    resumeData: ResumeValues;
    fontFamilyCss: string;
    fontScale: number;
    effectiveContentWidth: number;
    effectiveContentHeight: number;
    pageIndex?: number;
    flowRef?: Ref<HTMLDivElement>;
    printPageWidth?: number;
    printPageHeight?: number;
    printPaddingX?: number;
    printPaddingY?: number;
}

const PAGE_COUNT_RECHECK_DELAYS_MS = [0, 80, 220] as const;

export function useResumePagination({
    resumeData,
    fontFamilyCss,
    fontScale,
    active = true,
}: UseResumePaginationArgs): UseResumePaginationResult {
    const measureFlowRef = useRef<HTMLDivElement>(null);
    const [numPages, setNumPages] = useState(1);

    const effectiveContentWidth = CONTENT_WIDTH / fontScale;
    const effectiveContentHeight = CONTENT_HEIGHT / fontScale;

    const recomputePageCount = useCallback(() => {
        const flowElement = measureFlowRef.current;
        if (!flowElement) return;

        const singlePageWidth = flowElement.clientWidth || effectiveContentWidth;
        const totalFlowWidth = Math.max(flowElement.scrollWidth, singlePageWidth);
        const pages = Math.max(1, Math.ceil(totalFlowWidth / singlePageWidth));

        setNumPages((prev) => (prev === pages ? prev : pages));
    }, [effectiveContentWidth]);

    useEffect(() => {
        if (!active) return;

        const cleanup: Array<() => void> = [];
        const timeouts: number[] = [];

        const runMeasurement = () => {
            recomputePageCount();

            const flowElement = measureFlowRef.current;
            if (!flowElement) return;

            const pendingImages = Array.from(flowElement.querySelectorAll("img")).filter(
                (image) => !image.complete,
            );

            pendingImages.forEach((image) => {
                const onImageSettled = () => {
                    recomputePageCount();
                };

                image.addEventListener("load", onImageSettled);
                image.addEventListener("error", onImageSettled);
                cleanup.push(() => {
                    image.removeEventListener("load", onImageSettled);
                    image.removeEventListener("error", onImageSettled);
                });
            });

            const mutationObserver = new MutationObserver(() => {
                recomputePageCount();
            });
            mutationObserver.observe(flowElement, {
                childList: true,
                subtree: true,
                characterData: true,
            });
            cleanup.push(() => mutationObserver.disconnect());
        };

        const rafId = requestAnimationFrame(runMeasurement);
        cleanup.push(() => cancelAnimationFrame(rafId));

        PAGE_COUNT_RECHECK_DELAYS_MS.forEach((delayMs) => {
            const timeoutId = window.setTimeout(recomputePageCount, delayMs);
            timeouts.push(timeoutId);
        });

        return () => {
            cleanup.forEach((fn) => fn());
            timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
        };
    }, [active, recomputePageCount, resumeData, fontFamilyCss, fontScale]);

    return {
        numPages,
        measureFlowRef,
        effectiveContentWidth,
        effectiveContentHeight,
        recomputePageCount,
    };
}

export function ResumePageFlow({
    resumeData,
    fontFamilyCss,
    fontScale,
    effectiveContentWidth,
    effectiveContentHeight,
    pageIndex = 0,
    flowRef,
    printPageWidth,
    printPageHeight,
    printPaddingX,
    printPaddingY,
}: ResumePageFlowProps) {
    const isPrint = !!printPageWidth;
    const outerWidth = isPrint ? printPageWidth! : CONTENT_WIDTH;
    const outerHeight = isPrint ? printPageHeight! : CONTENT_HEIGHT;

    const flowStyle: CSSProperties = {
        width: effectiveContentWidth,
        height: effectiveContentHeight,
        columnWidth: effectiveContentWidth,
        columnGap: 0,
        columnFill: "auto",
    };

    if (pageIndex > 0) {
        flowStyle.transform = `translateX(-${pageIndex * effectiveContentWidth}px)`;
        flowStyle.transformOrigin = "top left";
    }

    return (
        <div
            style={{
                width: outerWidth,
                height: outerHeight,
                overflow: "hidden",
            }}
        >
            {isPrint && printPaddingX != null && printPaddingY != null ? (
                <div style={{ padding: `${printPaddingY}px ${printPaddingX}px` }}>
                    <div
                        style={{
                            width: effectiveContentWidth,
                            height: effectiveContentHeight,
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: effectiveContentWidth,
                                height: effectiveContentHeight,
                                zoom: fontScale,
                                transformOrigin: "top left",
                            }}
                        >
                            <div ref={flowRef} style={flowStyle}>
                                <ResumeTemplate
                                    resumeData={resumeData}
                                    fontFamily={fontFamilyCss}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    style={{
                        width: effectiveContentWidth,
                        height: effectiveContentHeight,
                        zoom: fontScale,
                        transformOrigin: "top left",
                    }}
                >
                    <div ref={flowRef} style={flowStyle}>
                        <ResumeTemplate
                            resumeData={resumeData}
                            fontFamily={fontFamilyCss}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
