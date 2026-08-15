import Stripe from "stripe";

// ---------------------------------------------------------------------------
// Lazy-initialized Stripe client (avoids crash at build time)
// ---------------------------------------------------------------------------

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-06-24.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

// ---------------------------------------------------------------------------
// Price IDs — create these in your Stripe Dashboard and paste here
// ---------------------------------------------------------------------------

export const STRIPE_PRICES = {
  pro: {
    monthly: process.env.STRIPE_PRO_PRICE_ID_MONTHLY!,
    yearly: process.env.STRIPE_PRO_PRICE_ID_YEARLY,
  },
  lifetime: {
    payment: process.env.STRIPE_LIFETIME_PRICE_ID!,
  },
} as const;

// All known price IDs (flat list for validation)
export const ALL_PRICE_IDS = [
  STRIPE_PRICES.pro.monthly,
  STRIPE_PRICES.pro.yearly,
  STRIPE_PRICES.lifetime.payment,
].filter(Boolean) as string[];

// ---------------------------------------------------------------------------
// Plan helpers
// ---------------------------------------------------------------------------

export type PlanTier = "free" | "pro" | "lifetime";

export function getPlanFromPriceId(priceId: string): PlanTier {
  if (priceId === STRIPE_PRICES.pro.monthly || priceId === STRIPE_PRICES.pro.yearly) {
    return "pro";
  }
  if (priceId === STRIPE_PRICES.lifetime.payment) {
    return "lifetime";
  }
  return "free";
}

export function isLifetimePriceId(priceId: string): boolean {
  return priceId === STRIPE_PRICES.lifetime.payment;
}
