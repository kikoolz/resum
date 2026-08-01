"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Users, Gift } from "lucide-react";
import { getOrCreateReferralCode } from "@/lib/referrals";

interface ReferralStats {
    referralCode: string | null;
    totalReferrals: number;
    successfulSubscriptions: number;
    referredUserEmails: string[];
}

interface ReferralsClientProps {
    initialStats: ReferralStats;
}

export default function ReferralsClient({ initialStats }: ReferralsClientProps) {
    const [stats, setStats] = useState(initialStats);
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    const referralUrl = stats.referralCode
        ? `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${stats.referralCode}`
        : "";

    async function handleGenerateCode() {
        setGenerating(true);
        try {
            const code = await getOrCreateReferralCode();
            setStats((prev) => ({ ...prev, referralCode: code }));
        } catch (err) {
            console.error("Failed to generate code:", err);
        } finally {
            setGenerating(false);
        }
    }

    async function handleCopy() {
        if (!stats.referralCode) return;
        try {
            await navigator.clipboard.writeText(referralUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
            const input = document.createElement("input");
            input.value = referralUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: "Join Resum",
                text: "Create a professional resume with AI assistance",
                url: referralUrl,
            });
        } else {
            handleCopy();
        }
    }

    return (
        <div className="space-y-12">
            {/* Referral Code Section */}
            <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Your Code
                </p>
                {stats.referralCode ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 rounded-none border border-foreground/10 bg-muted/30 px-4 py-3 font-mono text-lg font-bold tracking-widest">
                                {stats.referralCode}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className="flex-1 rounded-none border-foreground/10 cursor-pointer"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy Link
                                    </>
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 rounded-none border-foreground/10 cursor-pointer"
                                onClick={handleShare}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                            Share this link. When someone signs up and subscribes, you both earn rewards.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            You haven&apos;t generated a referral code yet.
                        </p>
                        <Button
                            className="rounded-none bg-foreground px-6 font-bold text-background cursor-pointer"
                            onClick={handleGenerateCode}
                            disabled={generating}
                        >
                            {generating ? "Generating..." : "Generate Referral Code"}
                        </Button>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/10" />

            {/* Stats */}
            <div>
                <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Stats
                </p>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">Total Referrals</span>
                        </div>
                        <p className="mt-2 text-4xl font-black">{stats.totalReferrals}</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Gift className="h-4 w-4" />
                            <span className="text-xs uppercase tracking-wider">Subscribed</span>
                        </div>
                        <p className="mt-2 text-4xl font-black">{stats.successfulSubscriptions}</p>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/10" />

            {/* How It Works */}
            <div>
                <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    How It Works
                </p>
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <span className="flex-none text-2xl font-black text-muted-foreground">1</span>
                        <div>
                            <p className="font-bold">Share your referral link</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Send your unique link to friends, colleagues, or post it online.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="flex-none text-2xl font-black text-muted-foreground">2</span>
                        <div>
                            <p className="font-bold">They sign up and subscribe</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                When someone joins Resum using your link and purchases a plan, it counts as a successful referral.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <span className="flex-none text-2xl font-black text-muted-foreground">3</span>
                        <div>
                            <p className="font-bold">You both earn rewards</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                You&apos;ll receive bonus AI tokens and priority features as a thank you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/10" />

            {/* Referred Users */}
            {stats.referredUserEmails.length > 0 && (
                <div>
                    <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Your Referrals
                    </p>
                    <div className="space-y-3">
                        {stats.referredUserEmails.map((email, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between border-b border-foreground/5 pb-3"
                            >
                                <span className="text-sm">{email}</span>
                                <span className="text-xs text-muted-foreground">Signed up</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
