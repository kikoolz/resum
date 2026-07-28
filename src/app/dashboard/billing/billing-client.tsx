"use client";

import { useState } from "react";
import { getStripe } from "@/lib/stripe-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Check,
  Zap,
  Crown,
  Infinity,
  Loader2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Plan definitions
// ---------------------------------------------------------------------------

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
    icon: Zap,
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
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious job seekers",
    monthlyPrice: "$10",
    yearlyPrice: "$96",
    yearlyMonthly: "$8",
    icon: Crown,
    features: PRO_FEATURES,
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime",
    description: "Pay once, use forever",
    price: "$129",
    icon: Infinity,
    features: LIFETIME_FEATURES,
    cta: "Get Lifetime Access",
    popular: false,
  },
];

// ---------------------------------------------------------------------------
// Billing Page Component
// ---------------------------------------------------------------------------

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

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Plans</h1>
        <p className="mt-1 text-muted-foreground">
          Choose the plan that fits your job search. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Subscription Status */}
      {currentTier !== "free" && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                {currentTier === "lifetime" ? "Lifetime Access" : "Current Subscription"}
              </CardTitle>
              <CardDescription>
                {currentTier === "lifetime"
                  ? "You have lifetime access. No expiration."
                  : isCanceled
                    ? "Your subscription will expire at the end of the billing period."
                    : renewalDate
                      ? `Next renewal: ${renewalDate}`
                      : "Active subscription"}
              </CardDescription>
            </div>
            <Badge variant={isCanceled ? "destructive" : "default"}>
              {currentTier === "lifetime" ? "LIFETIME" : currentTier.toUpperCase()}
            </Badge>
          </CardHeader>
          <CardFooter>
            {currentTier !== "lifetime" && (
              <Button variant="outline" onClick={handlePortal} disabled={loading === "portal"}>
                {loading === "portal" ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="mr-2 h-4 w-4" />
                )}
                Manage Subscription
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Billing Toggle (only for Pro) */}
      <div className="flex items-center justify-center gap-3">
        <span className={cn("text-sm font-medium", billing === "monthly" ? "text-foreground" : "text-muted-foreground")}>
          Monthly
        </span>
        <button
          type="button"
          onClick={() => setBilling(billing === "monthly" ? "yearly" : "monthly")}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
            billing === "yearly" ? "bg-primary" : "bg-muted"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition duration-200 ease-in-out",
              billing === "yearly" ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
        <span className={cn("text-sm font-medium", billing === "yearly" ? "text-foreground" : "text-muted-foreground")}>
          Yearly
        </span>
        {billing === "yearly" && (
          <Badge variant="secondary" className="text-xs">Save 20%</Badge>
        )}
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = currentTier === plan.id;

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col",
                plan.popular && "border-primary shadow-lg scale-[1.02]",
                isCurrent && "border-green-500 bg-green-500/5 dark:bg-green-500/10",
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="flex-1">
                <div className="flex items-center gap-2">
                  <plan.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{plan.name}</CardTitle>
                </div>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  {plan.id === "pro" ? (
                    <>
                      <span className="text-4xl font-bold">
                        {billing === "yearly" ? plan.yearlyMonthly : plan.monthlyPrice}
                      </span>
                      <span className="text-muted-foreground">
                        {billing === "yearly" ? "/month, billed yearly" : "/month"}
                      </span>
                      {billing === "yearly" && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          ${plan.yearlyPrice}/year
                        </p>
                      )}
                    </>
                  ) : plan.id === "lifetime" ? (
                    <>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground"> one-time</span>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/forever</span>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>
                    Current Plan
                  </Button>
                ) : plan.id === "lifetime" ? (
                  <Button
                    className="w-full"
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
                ) : plan.id === "pro" ? (
                  <Button
                    className="w-full"
                    variant="default"
                    onClick={() => {
                      const priceId = billing === "yearly"
                        ? priceIds.pro.yearly
                        : priceIds.pro.monthly;
                      if (priceId) handleCheckout(priceId, plan.id);
                    }}
                    disabled={loading !== null}
                  >
                    {loading === plan.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {plan.cta}
                  </Button>
                ) : (
                  <Button className="w-full" variant="outline" disabled>
                    {plan.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="space-y-4 pt-8">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <Separator />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Can I switch plans anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! You can upgrade or downgrade at any time. Changes take effect
              immediately, and we&apos;ll prorate the difference.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">What happens when I downgrade?</h3>
            <p className="text-sm text-muted-foreground">
              You&apos;ll keep your current plan until the end of the billing period.
              After that, you&apos;ll be moved to the Free plan with its limits.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Do you offer refunds?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 14-day money-back guarantee. If you&apos;re not satisfied,
              contact us within 14 days for a full refund.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">What&apos;s the difference between Pro and Lifetime?</h3>
            <p className="text-sm text-muted-foreground">
              Same features! Pro is $10/month (or $96/year). Lifetime is $129
              once — pay once and never worry about subscriptions again.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
