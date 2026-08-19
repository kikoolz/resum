import { describe, it, expect, vi } from "vitest";
import { PLAN_LIMITS } from "@/lib/subscription";

// Mock env vars for stripe prices
process.env.STRIPE_PRO_PRICE_ID_MONTHLY = "price_pro_monthly_123";
process.env.STRIPE_PRO_PRICE_ID_YEARLY = "price_pro_yearly_456";
process.env.STRIPE_LIFETIME_PRICE_ID = "price_lifetime_789";

describe("PLAN_LIMITS", () => {
  it("should define limits for all tiers", () => {
    expect(PLAN_LIMITS.free).toBeDefined();
    expect(PLAN_LIMITS.pro).toBeDefined();
    expect(PLAN_LIMITS.lifetime).toBeDefined();
  });

  it("should limit free tier to 1 resume and 0 cover letters", () => {
    expect(PLAN_LIMITS.free.resumes).toBe(1);
    expect(PLAN_LIMITS.free.coverLetters).toBe(0);
  });

  it("should give pro and lifetime unlimited resumes and cover letters", () => {
    expect(PLAN_LIMITS.pro.resumes).toBe(Infinity);
    expect(PLAN_LIMITS.pro.coverLetters).toBe(Infinity);
    expect(PLAN_LIMITS.lifetime.resumes).toBe(Infinity);
    expect(PLAN_LIMITS.lifetime.coverLetters).toBe(Infinity);
  });

  it("should limit free AI tokens to 50K monthly", () => {
    expect(PLAN_LIMITS.free.aiTokensMonthly).toBe(50_000);
  });

  it("should give pro 500K AI tokens monthly", () => {
    expect(PLAN_LIMITS.pro.aiTokensMonthly).toBe(500_000);
  });

  it("should have matching limits for pro and lifetime", () => {
    expect(PLAN_LIMITS.pro.aiTokensMonthly).toBe(PLAN_LIMITS.lifetime.aiTokensMonthly);
    expect(PLAN_LIMITS.pro.resumes).toBe(PLAN_LIMITS.lifetime.resumes);
    expect(PLAN_LIMITS.pro.coverLetters).toBe(PLAN_LIMITS.lifetime.coverLetters);
  });
});
