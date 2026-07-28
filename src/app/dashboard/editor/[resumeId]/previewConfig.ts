"use client";

export const PAGE_WIDTH = 680;
const A4_RATIO = 297 / 210;
export const PAGE_HEIGHT = Math.round(PAGE_WIDTH * A4_RATIO);
export const PAGE_PADDING_X = 40;
export const PAGE_PADDING_Y = 32;
export const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING_Y * 2;
export const CONTENT_WIDTH = PAGE_WIDTH - PAGE_PADDING_X * 2;

export const FONT_FAMILIES = [
    {
        label: "Serif",
        value: "serif",
        css: 'Georgia, "Times New Roman", "Noto Serif", serif',
    },
    {
        label: "Sans Serif",
        value: "sans-serif",
        css: '"Helvetica Neue", Arial, "Segoe UI", sans-serif',
    },
    {
        label: "Monospace",
        value: "monospace",
        css: '"Courier New", Courier, monospace',
    },
    {
        label: "System",
        value: "system",
        css: 'system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    },
    {
        label: "Garamond",
        value: "garamond",
        css: 'Garamond, "Hoefler Text", "Times New Roman", Times, serif',
    },
    {
        label: "Verdana",
        value: "verdana",
        css: 'Verdana, Geneva, Tahoma, sans-serif',
    },
    {
        label: "Slab",
        value: "slab",
        css: '"Rockwell", "Roboto Slab", "DejaVu Serif", "Sitka Small", serif',
    },
] as const;

export const FONT_SIZE_MIN = 8;
export const FONT_SIZE_MAX = 14;
export const FONT_SIZE_DEFAULT = 10;

export type PreviewFontFamily = (typeof FONT_FAMILIES)[number]["value"];

export interface PreviewSettings {
    fontSize: number;
    fontFamily: PreviewFontFamily;
}

export const DEFAULT_PREVIEW_SETTINGS: PreviewSettings = {
    fontSize: FONT_SIZE_DEFAULT,
    fontFamily: "serif",
};

export function getPreviewFontFamilyCss(fontFamily: string | undefined): string {
    return (
        FONT_FAMILIES.find((f) => f.value === fontFamily)?.css ??
        FONT_FAMILIES[0].css
    );
}

export const RESUME_PRINT_PAGE_STYLE = `
@page {
  size: ${PAGE_WIDTH}px ${PAGE_HEIGHT}px;
  margin: 0;
}

html,
body {
  margin: 0 !important;
  padding: 0 !important;
}

body {
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

#resumePrintContent {
  width: ${PAGE_WIDTH}px !important;
  margin: 0 auto !important;
}

.resume-print-page {
  width: ${PAGE_WIDTH}px !important;
  height: ${PAGE_HEIGHT}px !important;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  break-after: page;
}

.resume-print-page:last-child {
  page-break-after: auto;
  break-after: auto;
}
`;
