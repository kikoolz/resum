"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { Check, Zap, Crown, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Free",
    icon: <Zap className="h-4 w-4 text-muted-foreground" />,
    price: "$0",
    period: "/forever",
    features: [
      "3 resumes",
      "50,000 AI tokens/month",
      "1 AI recreation/month",
      "1 AI analysis/month",
      "2 templates",
      "PDF with watermark",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
    delay: 0,
  },
  {
    name: "Pro",
    icon: <Crown className="h-4 w-4 text-primary" />,
    price: "$10",
    period: "/month",
    yearlyNote: "or $96/year (save 20%)",
    features: [
      "Unlimited resumes",
      "500,000 AI tokens/month",
      "Unlimited AI recreation",
      "Unlimited AI analysis",
      "All 20 templates",
      "Watermark-free PDF",
      "Cover letter generator",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    variant: "default" as const,
    popular: true,
    delay: 0.08,
  },
  {
    name: "Lifetime",
    icon: <Infinity className="h-4 w-4 text-primary" />,
    price: "$129",
    period: "one-time",
    features: [
      "Everything in Pro, forever",
      "One-time payment",
      "All future templates included",
      "Lifetime updates",
      "Priority support forever",
    ],
    cta: "Get Lifetime Access",
    variant: "default" as const,
    popular: false,
    delay: 0.16,
  },
];

export function Pricing() {
  const { data: session } = useSession();

  return (
    <section id="pricing" className="py-28">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4"
          >
            Pricing
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            Simple Pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-lg text-muted-foreground max-w-xl"
          >
            Start free, upgrade when you&apos;re ready. No hidden fees.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: plan.delay }}
              className={`border p-8 flex flex-col relative ${
                plan.popular ? "border-2 border-primary" : "border-foreground/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-8">
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 tracking-wide uppercase">
                    Popular
                  </span>
                </div>
              )}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  {plan.icon}
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                {"yearlyNote" in plan && plan.yearlyNote && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {plan.yearlyNote}
                  </p>
                )}
              </div>
              <ul className="space-y-3.5 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm"
                  >
                    <Check
                      className={`h-4 w-4 shrink-0 mt-0.5 ${
                        plan.popular ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={session ? "/dashboard" : "/sign-in"}>
                <Button variant={plan.variant} className="w-full font-medium">
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
