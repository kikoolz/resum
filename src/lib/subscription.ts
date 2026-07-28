import { getDb } from "@/db";
import { resumes, userSubscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getPlanFromPriceId, isLifetimePriceId, type PlanTier } from "@/lib/stripe";

// ---------------------------------------------------------------------------
// Plan limits
// ---------------------------------------------------------------------------

export const PLAN_LIMITS = {
  free: {
    resumes: 3,
    aiTokensMonthly: 50_000,
    aiRecreateMonthly: 1,
    aiAnalyzeMonthly: 1,
    templates: ["simple", "modern"],
  },
  pro: {
    resumes: Infinity,
    aiTokensMonthly: 500_000,
    aiRecreateMonthly: Infinity,
    aiAnalyzeMonthly: Infinity,
    templates: [
      "simple", "modern", "professional", "creative", "executive",
      "euro-modern", "badge", "timeline", "minimal", "notion",
      "academy", "bold", "classic-timeline", "classic", "fresh",
      "blush", "sleek", "profile", "europass", "executive-pro",
    ],
  },
  lifetime: {
    resumes: Infinity,
    aiTokensMonthly: 500_000,
    aiRecreateMonthly: Infinity,
    aiAnalyzeMonthly: Infinity,
    templates: [
      "simple", "modern", "professional", "creative", "executive",
      "euro-modern", "badge", "timeline", "minimal", "notion",
      "academy", "bold", "classic-timeline", "classic", "fresh",
      "blush", "sleek", "profile", "europass", "executive-pro",
    ],
  },
} as const;

// ---------------------------------------------------------------------------
// Get user's subscription tier
// ---------------------------------------------------------------------------

export async function getUserTier(userId: string): Promise<PlanTier> {
  const db = await getDb();
  const subscription = await db.query.userSubscriptions.findFirst({
    where: eq(userSubscriptions.userId, userId),
  });

  if (!subscription) return "free";

  // Lifetime never expires
  if (isLifetimePriceId(subscription.stripePriceId)) {
    return "lifetime";
  }

  // Check if subscription was canceled or expired
  if (subscription.stripeCancelAtPeriodEnd) return "free";
  if (subscription.stripeCurrentPeriodEnd <= new Date()) return "free";

  return getPlanFromPriceId(subscription.stripePriceId);
}

// ---------------------------------------------------------------------------
// Check if user has an active premium subscription
// ---------------------------------------------------------------------------

export async function isPremiumUser(userId: string): Promise<boolean> {
  const tier = await getUserTier(userId);
  return tier !== "free";
}

// ---------------------------------------------------------------------------
// Check if user can create a new resume
// ---------------------------------------------------------------------------

export async function canCreateResume(
  userId: string,
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const tier = await getUserTier(userId);
  const limits = PLAN_LIMITS[tier];

  if (tier !== "free") {
    return { allowed: true, current: 0, limit: Infinity };
  }

  const db = await getDb();
  const userResumes = await db.query.resumes.findMany({
    where: eq(resumes.userId, userId),
    columns: { id: true },
  });

  const current = userResumes.length;

  return {
    allowed: current < limits.resumes,
    current,
    limit: limits.resumes,
  };
}

// ---------------------------------------------------------------------------
// Get full plan info for display
// ---------------------------------------------------------------------------

export async function getUserPlanInfo(userId: string) {
  const tier = await getUserTier(userId);
  const limits = PLAN_LIMITS[tier];

  const db = await getDb();
  const subscription = await db.query.userSubscriptions.findFirst({
    where: eq(userSubscriptions.userId, userId),
  });

  return {
    tier,
    limits,
    subscription,
    renewalDate: subscription?.stripeCurrentPeriodEnd ?? null,
    isCanceled: subscription?.stripeCancelAtPeriodEnd ?? false,
  };
}
