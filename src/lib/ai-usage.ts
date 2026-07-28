import { getDb } from "@/db";
import { aiUsageLogs } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { MODEL_ID } from "@/lib/ai";
import { getUserTier, PLAN_LIMITS } from "@/lib/subscription";

// ---------------------------------------------------------------------------
// Log a single AI call's token usage
// ---------------------------------------------------------------------------

export async function logAiUsage(
    userId: string,
    usage: { inputTokens?: number; outputTokens?: number; totalTokens?: number },
    featureType: "enhance" | "recreate" | "analyze" | "portfolio",
) {
    const db = await getDb();
    await db.insert(aiUsageLogs).values({
        userId,
        featureType,
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
        totalTokens: usage.totalTokens ?? 0,
        modelId: MODEL_ID,
    });
}

// ---------------------------------------------------------------------------
// Query aggregated usage for a user in the current calendar month
// ---------------------------------------------------------------------------

async function getUserTokenUsage(userId: string) {
    const db = await getDb();

    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [row] = await db
        .select({
            totalInputTokens: sql<number>`coalesce(sum(${aiUsageLogs.inputTokens}), 0)`,
            totalOutputTokens: sql<number>`coalesce(sum(${aiUsageLogs.outputTokens}), 0)`,
            totalTokens: sql<number>`coalesce(sum(${aiUsageLogs.totalTokens}), 0)`,
            callCount: sql<number>`count(*)`,
        })
        .from(aiUsageLogs)
        .where(
            and(
                eq(aiUsageLogs.userId, userId),
                gte(aiUsageLogs.createdAt, start),
            ),
        );

    return {
        totalInputTokens: Number(row.totalInputTokens),
        totalOutputTokens: Number(row.totalOutputTokens),
        totalTokens: Number(row.totalTokens),
        callCount: Number(row.callCount),
    };
}

// ---------------------------------------------------------------------------
// Get feature-specific usage count for the current month
// ---------------------------------------------------------------------------

async function getFeatureUsageCount(userId: string, featureType: string) {
    const db = await getDb();
    const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const [row] = await db
        .select({
            count: sql<number>`count(*)`,
        })
        .from(aiUsageLogs)
        .where(
            and(
                eq(aiUsageLogs.userId, userId),
                eq(aiUsageLogs.featureType, featureType),
                gte(aiUsageLogs.createdAt, start),
            ),
        );

    return Number(row.count);
}

// ---------------------------------------------------------------------------
// Check if user can make an AI call (token limit + feature-specific limits)
// ---------------------------------------------------------------------------

export async function checkAiUsageLimit(
    userId: string,
): Promise<{ allowed: boolean; used: number; limit: number }> {
    const tier = await getUserTier(userId);
    const limits = PLAN_LIMITS[tier];

    // Unlimited tier
    if (limits.aiTokensMonthly === Infinity) {
        return { allowed: true, used: 0, limit: Infinity };
    }

    const usage = await getUserTokenUsage(userId);
    return {
        allowed: usage.totalTokens < limits.aiTokensMonthly,
        used: usage.totalTokens,
        limit: limits.aiTokensMonthly,
    };
}

// ---------------------------------------------------------------------------
// Check feature-specific limits (recreate, analyze)
// ---------------------------------------------------------------------------

export async function checkFeatureLimit(
    userId: string,
    featureType: "recreate" | "analyze",
): Promise<{ allowed: boolean; used: number; limit: number }> {
    const tier = await getUserTier(userId);
    const limits = PLAN_LIMITS[tier];

    const featureLimit =
        featureType === "recreate"
            ? limits.aiRecreateMonthly
            : limits.aiAnalyzeMonthly;

    // Unlimited
    if (featureLimit === Infinity) {
        return { allowed: true, used: 0, limit: Infinity };
    }

    const used = await getFeatureUsageCount(userId, featureType);
    return {
        allowed: used < featureLimit,
        used,
        limit: featureLimit,
    };
}

// ---------------------------------------------------------------------------
// Get full AI usage info for display (profile page, etc.)
// ---------------------------------------------------------------------------

export async function getAiUsageInfo(userId: string) {
    const tier = await getUserTier(userId);
    const limits = PLAN_LIMITS[tier];
    const usage = await getUserTokenUsage(userId);

    const tokenLimit = limits.aiTokensMonthly;
    const usagePercent =
        tokenLimit === Infinity
            ? 0
            : Math.min(Math.round((usage.totalTokens / tokenLimit) * 100), 100);

    return {
        tier,
        totalInputTokens: usage.totalInputTokens,
        totalOutputTokens: usage.totalOutputTokens,
        totalTokens: usage.totalTokens,
        callCount: usage.callCount,
        limit: tokenLimit,
        usagePercent,
    };
}
