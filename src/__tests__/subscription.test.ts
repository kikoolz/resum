import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock env vars for stripe prices
process.env.STRIPE_PRO_PRICE_ID_MONTHLY = "price_pro_monthly_123";
process.env.STRIPE_PRO_PRICE_ID_YEARLY = "price_pro_yearly_456";
process.env.STRIPE_LIFETIME_PRICE_ID = "price_lifetime_789";

// Mock database
vi.mock("@/db", () => ({
  getDb: vi.fn(),
}));

// Mock stripe helpers
vi.mock("@/lib/stripe", () => ({
  getPlanFromPriceId: (priceId: string) => {
    if (priceId === "price_pro_monthly_123" || priceId === "price_pro_yearly_456") {
      return "pro";
    }
    if (priceId === "price_lifetime_789") {
      return "lifetime";
    }
    return "free";
  },
  isLifetimePriceId: (priceId: string) => priceId === "price_lifetime_789",
}));

// Mock templates
vi.mock("@/lib/templates", () => ({
  FREE_TEMPLATE_KEYS: ["modern", "simple"],
  PREMIUM_TEMPLATE_KEYS: ["professional", "creative"],
}));

import { getDb } from "@/db";
import { PLAN_LIMITS, getUserTier } from "@/lib/subscription";

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

describe("getUserTier", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 'free' when no subscription exists", async () => {
    const mockDb = {
      query: {
        userSubscriptions: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      },
    };
    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const tier = await getUserTier("user-123");
    expect(tier).toBe("free");
  });

  it("should return 'pro' for active pro subscription", async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const mockDb = {
      query: {
        userSubscriptions: {
          findFirst: vi.fn().mockResolvedValue({
            stripePriceId: "price_pro_monthly_123",
            stripeCancelAtPeriodEnd: false,
            stripeCurrentPeriodEnd: futureDate,
          }),
        },
      },
    };
    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const tier = await getUserTier("user-123");
    expect(tier).toBe("pro");
  });

  it("should return 'lifetime' for lifetime subscription", async () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 100);

    const mockDb = {
      query: {
        userSubscriptions: {
          findFirst: vi.fn().mockResolvedValue({
            stripePriceId: "price_lifetime_789",
            stripeCancelAtPeriodEnd: false,
            stripeCurrentPeriodEnd: futureDate,
          }),
        },
      },
    };
    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const tier = await getUserTier("user-123");
    expect(tier).toBe("lifetime");
  });

  it("should return 'pro' when canceled but still within period", async () => {
    // Scenario: User canceled on day 2 of a 30-day cycle
    // They should keep pro access until day 30
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 20); // 20 days left

    const mockDb = {
      query: {
        userSubscriptions: {
          findFirst: vi.fn().mockResolvedValue({
            stripePriceId: "price_pro_monthly_123",
            stripeCancelAtPeriodEnd: true, // User canceled
            stripeCurrentPeriodEnd: futureDate, // But period hasn't ended
          }),
        },
      },
    };
    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const tier = await getUserTier("user-123");
    expect(tier).toBe("pro"); // Should STILL be pro, not free
  });

  it("should return 'free' when canceled AND period has ended", async () => {
    // Scenario: User canceled and the billing period has passed
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 5); // 5 days ago

    const mockDb = {
      query: {
        userSubscriptions: {
          findFirst: vi.fn().mockResolvedValue({
            stripePriceId: "price_pro_monthly_123",
            stripeCancelAtPeriodEnd: true,
            stripeCurrentPeriodEnd: pastDate, // Period has ended
          }),
        },
      },
    };
    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const tier = await getUserTier("user-123");
    expect(tier).toBe("free");
  });

  it("should return 'free' when not canceled but period has expired", async () => {
    // Scenario: Subscription expired without explicit cancellation
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    const mockDb = {
      query: {
        userSubscriptions: {
          findFirst: vi.fn().mockResolvedValue({
            stripePriceId: "price_pro_monthly_123",
            stripeCancelAtPeriodEnd: false,
            stripeCurrentPeriodEnd: pastDate,
          }),
        },
      },
    };
    vi.mocked(getDb).mockResolvedValue(mockDb as any);

    const tier = await getUserTier("user-123");
    expect(tier).toBe("free");
  });
});
