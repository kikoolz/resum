"use server";

import { getDb } from "@/db";
import { referrals } from "@/db/schema";
import { users } from "@/db/auth.schema";
import { requireSession } from "@/lib/auth-server";
import { eq, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

function generateReferralCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `RESUM-${code}`;
}

export async function getOrCreateReferralCode(): Promise<string> {
    const session = await requireSession();
    const db = await getDb();

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { referralCode: true },
    });

    if (user?.referralCode) {
        return user.referralCode;
    }

    let code = generateReferralCode();
    let attempts = 0;
    while (attempts < 10) {
        const existing = await db.query.users.findFirst({
            where: eq(users.referralCode, code),
            columns: { id: true },
        });
        if (!existing) break;
        code = generateReferralCode();
        attempts++;
    }

    await db
        .update(users)
        .set({ referralCode: code })
        .where(eq(users.id, session.user.id));

    revalidatePath("/dashboard/referrals");
    return code;
}

export async function getReferralStats(): Promise<{
    referralCode: string | null;
    totalReferrals: number;
    successfulSubscriptions: number;
    referredUserEmails: string[];
}> {
    const session = await requireSession();
    const db = await getDb();

    const user = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: { referralCode: true },
    });

    if (!user?.referralCode) {
        return {
            referralCode: null,
            totalReferrals: 0,
            successfulSubscriptions: 0,
            referredUserEmails: [],
        };
    }

    const allReferrals = await db.query.referrals.findMany({
        where: eq(referrals.referrerUserId, session.user.id),
        with: {
            referred: {
                columns: { email: true },
            },
        },
    });

    const successfulSubscriptions = allReferrals.filter(
        (r) => r.rewardGranted,
    ).length;

    return {
        referralCode: user.referralCode,
        totalReferrals: allReferrals.length,
        successfulSubscriptions,
        referredUserEmails: allReferrals.map((r) => r.referred.email),
    };
}

export async function recordReferral(
    referralCode: string,
    newUserId: string,
): Promise<boolean> {
    const db = await getDb();

    const referrer = await db.query.users.findFirst({
        where: eq(users.referralCode, referralCode),
        columns: { id: true },
    });

    if (!referrer) return false;

    const existing = await db.query.referrals.findFirst({
        where: eq(referrals.referredUserId, newUserId),
        columns: { id: true },
    });

    if (existing) return false;

    await db.insert(referrals).values({
        referrerUserId: referrer.id,
        referredUserId: newUserId,
        referralCode,
    });

    // Also set referredBy on the user record
    await db
        .update(users)
        .set({ referredBy: referrer.id })
        .where(eq(users.id, newUserId));

    return true;
}

export async function grantReferralReward(referredUserId: string): Promise<void> {
    const db = await getDb();

    const referral = await db.query.referrals.findFirst({
        where: eq(referrals.referredUserId, referredUserId),
    });

    if (!referral || referral.rewardGranted) return;

    // Find the referrer's subscription and extend by 1 month
    const { userSubscriptions } = await import("@/db/schema");
    const referrerSub = await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.userId, referral.referrerUserId),
    });

    if (referrerSub) {
        const currentEnd = new Date(referrerSub.stripeCurrentPeriodEnd);
        // Add 30 days to the current period end
        const newEnd = new Date(currentEnd.getTime() + 30 * 24 * 60 * 60 * 1000);
        await db
            .update(userSubscriptions)
            .set({ stripeCurrentPeriodEnd: newEnd })
            .where(eq(userSubscriptions.userId, referral.referrerUserId));
    }

    await db
        .update(referrals)
        .set({ rewardGranted: true })
        .where(eq(referrals.id, referral.id));

    revalidatePath("/dashboard/referrals");
    revalidatePath("/dashboard/billing");
}
