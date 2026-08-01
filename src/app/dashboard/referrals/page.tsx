import { Suspense } from "react";
import { getReferralStats, getOrCreateReferralCode } from "@/lib/referrals";
import ReferralsClient from "./ReferralsClient";

export default async function ReferralsPage() {
    const stats = await getReferralStats();

    return (
        <div className="mx-auto max-w-2xl space-y-12 px-4 py-12">
            {/* Header */}
            <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Referral Program
                </p>
                <h1 className="text-5xl font-black tracking-tight">
                    Share Resum
                </h1>
                <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                    Invite friends to Resum. When they subscribe, you both earn rewards.
                </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/10" />

            <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
                <ReferralsClient initialStats={stats} />
            </Suspense>
        </div>
    );
}
