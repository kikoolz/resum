import { describe, it, expect, vi, beforeAll } from "vitest";

// Mock env vars
process.env.STRIPE_PRO_PRICE_ID_MONTHLY = "price_pro_monthly_123";
process.env.STRIPE_PRO_PRICE_ID_YEARLY = "price_pro_yearly_456";
process.env.STRIPE_LIFETIME_PRICE_ID = "price_lifetime_789";

describe("Stripe plan helpers", () => {
  let getPlanFromPriceId: any;
  let isLifetimePriceId: any;

  beforeAll(async () => {
    const stripe = await import("@/lib/stripe");
    getPlanFromPriceId = stripe.getPlanFromPriceId;
    isLifetimePriceId = stripe.isLifetimePriceId;
  });

  it("should return 'pro' for monthly price ID", () => {
    expect(getPlanFromPriceId("price_pro_monthly_123")).toBe("pro");
  });

  it("should return 'pro' for yearly price ID", () => {
    expect(getPlanFromPriceId("price_pro_yearly_456")).toBe("pro");
  });

  it("should return 'lifetime' for lifetime price ID", () => {
    expect(getPlanFromPriceId("price_lifetime_789")).toBe("lifetime");
  });

  it("should return 'free' for unknown price ID", () => {
    expect(getPlanFromPriceId("price_unknown")).toBe("free");
  });

  it("should correctly identify lifetime price IDs", () => {
    expect(isLifetimePriceId("price_lifetime_789")).toBe(true);
    expect(isLifetimePriceId("price_pro_monthly_123")).toBe(false);
    expect(isLifetimePriceId("price_unknown")).toBe(false);
  });
});
