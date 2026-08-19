import { describe, it, expect } from "vitest";
import { TEMPLATES, ALL_TEMPLATE_KEYS, FREE_TEMPLATE_KEYS, getTemplate } from "@/lib/templates";

describe("Template registry", () => {
  it("should have exactly 20 templates", () => {
    expect(TEMPLATES.length).toBe(20);
  });

  it("should have no duplicate keys", () => {
    const keys = TEMPLATES.map((t) => t.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("should have no duplicate labels", () => {
    const labels = TEMPLATES.map((t) => t.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("ALL_TEMPLATE_KEYS should include all template keys", () => {
    expect(ALL_TEMPLATE_KEYS.length).toBe(TEMPLATES.length);
    TEMPLATES.forEach((t) => {
      expect(ALL_TEMPLATE_KEYS).toContain(t.key);
    });
  });

  it("FREE_TEMPLATE_KEYS should only include free templates", () => {
    FREE_TEMPLATE_KEYS.forEach((key) => {
      const template = TEMPLATES.find((t) => t.key === key);
      expect(template?.free).toBe(true);
    });
  });

  it("FREE_TEMPLATE_KEYS should have exactly 2 entries", () => {
    expect(FREE_TEMPLATE_KEYS.length).toBe(2);
    expect(FREE_TEMPLATE_KEYS).toContain("modern");
    expect(FREE_TEMPLATE_KEYS).toContain("simple");
  });

  it("getTemplate should return the correct template", () => {
    const template = getTemplate("professional");
    expect(template).toBeDefined();
    expect(template?.label).toBe("Professional");
    expect(template?.free).toBe(false);
  });

  it("getTemplate should return undefined for unknown key", () => {
    expect(getTemplate("nonexistent")).toBeUndefined();
  });

  it("every template key should be a valid CSS-safe string", () => {
    TEMPLATES.forEach((t) => {
      expect(t.key).toMatch(/^[a-z0-9-]+$/);
    });
  });
});
