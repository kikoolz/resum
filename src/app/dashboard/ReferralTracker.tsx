"use client";

import { useEffect } from "react";
import { recordReferralAction } from "./actions";

export function ReferralTracker() {
    useEffect(() => {
        const pendingCode = localStorage.getItem("pendingReferral");
        if (pendingCode) {
            localStorage.removeItem("pendingReferral");
            recordReferralAction(pendingCode).catch(() => {
                // Silently fail — referral is not critical
            });
        }
    }, []);

    return null;
}
