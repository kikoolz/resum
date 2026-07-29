"use client";

import { useState } from "react";
import { getStripe } from "@/lib/stripe-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Crown,
  Infinity,
  Loader2,
  ExternalLink,
  Sparkles,
  Check,
} from "lucide-react";

const PRO_FEATURES = [
  "Unlimited resumes",
  "500,000 AI tokens/month",
  "Unlimited AI recreation",
  "Unlimited AI analysis",
  "All 20 templates",
  "Watermark-free PDF export",
  "Cover letter generator",
  "Priority support",
];

const LIFETIME_FEATURES = [
  "Everything in Pro, forever",
  "One-time payment — no subscriptions",
  "All future templates included",
  "Lifetime updates",
  "Priority support forever",
];

const PLANS = [
  {
    id: "free",
    name: "Free",
    description: "Get started with the basics",
    price: "$0",
    period: "forever",
    features: [
      "3 resumes",
      "50,000 AI tokens/month",
      "1 AI recreation/month",
      "1 AI analysis/month",
      "2 templates (Simple, Modern)",
      "PDF export with watermark",
      "Basic portfolio link",
    ],
    cta: "Current Plan",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious job seekers",
    monthlyPrice: "$10",
    yearlyPrice: "$96",
    yearlyMonthly: "$8",
    features: PRO_FEATURES,
    cta: "Upgrade to Pro",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    description: "Pay once, use forever",
    price: "$129",
    features: LIFETIME_FEATURES,
    cta: "Get Lifetime Access",
  },
];

interface BillingPageProps {
  currentTier: string;
  renewalDate: string | null;
  isCanceled: boolean;
  priceIds: {
    pro: { monthly: string | null; yearly: string | null };
    lifetime: { payment: string | null };
  };
}

export default function BillingPageClient({
  currentTier,
  renewalDate,
  isCanceled,
  priceIds,
}: BillingPageProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const handleCheckout = async (priceId: string | null, planId: string) => {
    if (!priceId) return;

    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = (await res.json()) as { error?: string; url?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to start checkout");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = (await res.json()) as { error?: string; url?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to open billing portal");
      }

      window.location.href = data.url!;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  };

  const isPaid = currentTier !== "free";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* ── Header ──────────────────────────────────── */}
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Pricing
      </p>
      <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
        Billing & Plans
      </h1>
      <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
        Choose the plan that fits your job search. Upgrade or downgrade anytime.
      </p>

      <div className="my-10 h-px bg-foreground/10" />

      {/* ── Current Subscription ────────────────────── */}
      {isPaid && (
        <>
          <div className="flex flex-col gap-6 border border-foreground/10 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                <Crown className="h-3.5 w-3.5" />
                Active Plan
              </p>
              <h2 className="text-2xl font-black tracking-tight">
                {currentTier === "lifetime" ? "Lifetime Access" : "Pro Subscription"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentTier === "lifetime"
                  ? "You have lifetime access. No expiration."
                  : isCanceled
                    ? "Your subscription will expire at the end of the billing period."
                    : renewalDate
                      ? `Next renewal: ${renewalDate}`
                      : "Active subscription"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant={isCanceled ? "destructive" : "default"}
                className="rounded-none px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
              >
                {currentTier === "lifetime" ? "LIFETIME" : currentTier.toUpperCase()}
              </Badge>
              {currentTier !== "lifetime" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePortal}
                  disabled={loading === "portal"}
                  className="rounded-none gap-1.5 px-3 font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {loading === "portal" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="h-3.5 w-3.5" />
                  )}
                  Manage
                </Button>
              )}
            </div>
          </div>

          <div className="my-10 h-px bg-foreground/10" />
        </>
      )}

      {/* ── Billing Toggle ──────────────────────────── */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setBilling("monthly")}
          className={cn(
            "text-sm font-medium transition-colors",
            billing === "monthly" ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200",
            billing === "yearly" ? "bg-foreground" : "bg-foreground/20"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 translate-y-0.5 rounded-full bg-background transition-transform duration-200",
              billing === "yearly" ? "translate-x-[18px]" : "translate-x-0.5"
            )}
          />
        </button>
        <button
          type="button"
          onClick={() => setBilling("monthly")}
          className={cn(
            "text-sm font-medium transition-colors",
            billing === "yearly" ? "text-foreground" : "text-muted-foreground/50 hover:text-muted-foreground"
          )}
        >
          Yearly
        </button>
        {billing === "yearly" && (
          <Badge
            variant="secondary"
            className="rounded-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
          >
            Save 20%
          </Badge>
        )}
      </div>

      <div className="my-10 h-px bg-foreground/10" />

      {/* ── Plans ───────────────────────────────────── */}
      <div className="grid gap-10 md:grid-cols-3 md:gap-8">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;
          const isPro = plan.id === "pro";

          return (
            <div key={plan.id} className="flex flex-col border border-foreground/10 p-6">
              {/* Plan name */}
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {plan.id === "pro" ? "Recommended" : plan.name}
              </p>

              {/* Price */}
              <div className="mb-4">
                {isPro ? (
                  <>
                    <span className="text-5xl font-black tracking-tighter">
                      {billing === "yearly" ? plan.yearlyMonthly : plan.monthlyPrice}
                    </span>
                    <span className="ml-1 text-sm text-muted-foreground">
                      {billing === "yearly" ? "/mo, billed yearly" : "/month"}
                    </span>
                    {billing === "yearly" && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {plan.yearlyPrice}/year
                      </p>
                    )}
                  </>
                ) : plan.id === "lifetime" ? (
                  <>
                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                    <span className="ml-1 text-sm text-muted-foreground">one-time</span>
                  </>
                ) : (
                  <>
                    <span className="text-5xl font-black tracking-tighter">{plan.price}</span>
                    <span className="ml-1 text-sm text-muted-foreground">/forever</span>
                  </>
                )}
              </div>

              <p className="mb-6 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mb-6 h-px bg-foreground/10" />

              {/* Features */}
              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <Button
                  className="w-full rounded-none font-medium cursor-default"
                  variant="outline"
                  disabled
                >
                  Current Plan
                </Button>
              ) : isPro ? (
                <Button
                  className="w-full rounded-none font-medium cursor-pointer"
                  variant="default"
                  onClick={() => {
                    const priceId =
                      billing === "yearly" ? priceIds.pro.yearly : priceIds.pro.monthly;
                    if (priceId) handleCheckout(priceId, plan.id);
                  }}
                  disabled={loading !== null}
                >
                  {loading === plan.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {plan.cta}
                </Button>
              ) : plan.id === "lifetime" ? (
                <Button
                  className="w-full rounded-none font-medium cursor-pointer"
                  variant="default"
                  onClick={() => {
                    if (priceIds.lifetime.payment) {
                      handleCheckout(priceIds.lifetime.payment, plan.id);
                    }
                  }}
                  disabled={loading !== null}
                >
                  {loading === plan.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  {plan.cta}
                </Button>
              ) : (
                <Button
                  className="w-full rounded-none font-medium cursor-default"
                  variant="outline"
                  disabled
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="my-12 h-px bg-foreground/10" />

      {/* ── FAQ ─────────────────────────────────────── */}
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
        Common Questions
      </p>
      <h2 className="mb-8 text-2xl font-black tracking-tight">Frequently Asked</h2>

      <div className="grid gap-x-12 gap-y-8 md:grid-cols-2">
        <div>
          <h3 className="mb-1 text-sm font-semibold">Can I switch plans anytime?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Yes! You can upgrade or downgrade at any time. Changes take effect
            immediately, and we&apos;ll prorate the difference.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold">What happens when I downgrade?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You&apos;ll keep your current plan until the end of the billing period.
            After that, you&apos;ll be moved to the Free plan with its limits.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold">Do you offer refunds?</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We offer a 14-day money-back guarantee. If you&apos;re not satisfied,
            contact us within 14 days for a full refund.
          </p>
        </div>
        <div>
          <h3 className="mb-1 text-sm font-semibold">
            What&apos;s the difference between Pro and Lifetime?
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Same features! Pro is $10/month (or $96/year). Lifetime is $129
            once — pay once and never worry about subscriptions again.
          </p>
        </div>
      </div>
    </div>
  );
}
