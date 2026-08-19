import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock @/lib/logger to capture log calls
vi.mock("@/lib/logger", () => ({
  log: {
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));

// Mock @/lib/stripe
vi.mock("@/lib/stripe", () => ({
  getStripe: vi.fn(),
  isLifetimePriceId: vi.fn((priceId: string) => priceId === "price_lifetime_123"),
}));

// Mock @/lib/referrals
vi.mock("@/lib/referrals", () => ({
  grantReferralReward: vi.fn(),
}));

// Mock @/db
const mockDb = {
  insert: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  query: { resumes: { findFirst: vi.fn() } },
};

vi.mock("@/db", () => ({
  getDb: vi.fn(() => Promise.resolve(mockDb)),
}));

describe("Webhook dedup logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should import without errors", async () => {
    const route = await import("@/app/api/webhooks/stripe/route");
    expect(route.POST).toBeDefined();
  });

  it("should return 400 when signature is missing", async () => {
    const { POST } = await import("@/app/api/webhooks/stripe/route");

    const req = new NextRequest("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "test",
    });

    const res = await POST(req);
    const body = await res.json();
    expect(res.status).toBe(400);
    expect(body.error).toBe("Missing signature");
  });
});
