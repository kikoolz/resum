/**
 * Template Registry — single source of truth for all resume templates.
 *
 * To add/remove a template, edit ONLY this file.
 * All other modules (validation, subscription, editor) derive from here.
 */

export interface TemplateDefinition {
    key: string;
    label: string;
    /** If true, available on all tiers including free. */
    free: boolean;
}

export const TEMPLATES: TemplateDefinition[] = [
    { key: "professional", label: "Professional", free: false },
    { key: "creative", label: "Creative", free: false },
    { key: "modern", label: "Modern", free: true },
    { key: "simple", label: "Simple", free: true },
    { key: "europass", label: "Europass", free: false },
    { key: "executive", label: "Executive", free: false },
    { key: "blush", label: "Blush", free: false },
    { key: "fresh", label: "Fresh", free: false },
    { key: "classic", label: "Classic", free: false },
    { key: "sleek", label: "Sleek", free: false },
    { key: "profile", label: "Profile", free: false },
    { key: "euro-modern", label: "Euro Modern", free: false },
    { key: "badge", label: "Badge", free: false },
    { key: "timeline", label: "Timeline", free: false },
    { key: "minimal", label: "Minimal", free: false },
    { key: "notion", label: "Notion", free: false },
    { key: "academy", label: "Academy", free: false },
    { key: "bold", label: "Bold", free: false },
    { key: "executive-pro", label: "Executive Pro", free: false },
    { key: "classic-timeline", label: "Classic Timeline", free: false },
] as const;

/** All template keys as a string array (for Zod enum, iteration, etc.). */
export const ALL_TEMPLATE_KEYS = TEMPLATES.map((t) => t.key);

/** Template keys available on the free tier. */
export const FREE_TEMPLATE_KEYS = TEMPLATES.filter((t) => t.free).map((t) => t.key);

/** Template keys available on pro/lifetime tiers. */
export const PREMIUM_TEMPLATE_KEYS = TEMPLATES.map((t) => t.key);

/** Lookup a template by key. */
export function getTemplate(key: string): TemplateDefinition | undefined {
    return TEMPLATES.find((t) => t.key === key);
}
