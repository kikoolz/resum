"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import {
  ArrowRight,
  Download,
  Loader2,
  Snowflake,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
  const { data: session, isPending } = useSession();

  return (
    <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-primary/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[5%] left-[10%] w-[280px] h-[280px] bg-secondary/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-4 items-center">
          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Snowflake className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                AI-Powered Resume Builder
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-8"
            >
              Land The <span className="italic text-primary">Job</span>.
              <br />
              Not The Trash Bin.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mb-10"
            >
              Resum uses AI to build ATS-friendly resumes that actually get
              read. Upload your existing resume or start fresh you&apos;ll have
              a polished, recruiter-ready PDF in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <Link href={session ? "/dashboard" : "/sign-in"}>
                <Button
                  size="lg"
                  className="text-base h-13 px-8 font-medium"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Get Started
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </>
                  )}
                </Button>
              </Link>
              <Link href="#pricing">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-base h-13 px-8 font-medium"
                >
                  View Pricing
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Resume Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Main resume card */}
            <div className="relative bg-card rounded-xl border border-border shadow-xl overflow-hidden w-[340px] ml-auto">
              {/* Header */}
              <div className="bg-muted/50 px-6 pt-6 pb-5">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/20 shrink-0 overflow-hidden">
                    <img
                      src="/templates/blackwoman.png"
                      alt="Sarah Debbs"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold tracking-tight truncate">
                      Sarah Debbs
                    </h3>
                    <p className="text-xs text-primary font-medium">
                      Senior Analyst
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      New York, NY 10001
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      sarah.debbs@gmail.com
                    </p>
                  </div>
                  <div className="ml-auto shrink-0">
                    <span className="text-[10px] font-medium text-muted-foreground border border-border rounded px-1.5 py-0.5">
                      in LinkedIn
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-2 space-y-5">
                {/* Summary */}
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                    Summary
                  </h4>
                  <p className="text-[10px] leading-relaxed text-muted-foreground">
                    Senior Analyst with 5+ years of experience in data analysis,
                    business intelligence, and process optimization. Skilled in
                    driving operational efficiency and leading data-driven
                    strategies.
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {[
                      "Project Management",
                      "SQL & Excel",
                      "Financial Analysis",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] bg-muted px-2 py-1 rounded-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">
                    Experience
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h5 className="text-[11px] font-bold">
                          Senior Analyst
                        </h5>
                        <span className="text-[9px] text-muted-foreground">
                          Jul 2021 – Current
                        </span>
                      </div>
                      <p className="text-[9px] text-primary font-medium">
                        Loom & Lantern Co. – New York, NY
                      </p>
                      <ul className="mt-1.5 space-y-1 text-[9px] text-muted-foreground list-disc pl-3">
                        <li>
                          Spearhead data analysis and reporting for key business
                          functions
                        </li>
                        <li>
                          Conduct in-depth market analysis and competitive
                          benchmarking
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-baseline justify-between">
                        <h5 className="text-[11px] font-bold">
                          Business Analyst
                        </h5>
                        <span className="text-[9px] text-muted-foreground">
                          Aug 2017 – May 2021
                        </span>
                      </div>
                      <p className="text-[9px] text-primary font-medium">
                        Willow & Wren Ltd. – New York, NY
                      </p>
                      <ul className="mt-1.5 space-y-1 text-[9px] text-muted-foreground list-disc pl-3">
                        <li>
                          Analyzed and interpreted large datasets to identify
                          opportunities
                        </li>
                        <li>
                          Created detailed financial models and dashboards
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating: PDF badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="absolute -top-3 -right-3 bg-card rounded-lg border border-border shadow-lg px-3 py-2 flex items-center gap-2"
            >
              <div className="h-6 w-6 rounded bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <span className="text-[8px] font-bold text-red-600 dark:text-red-400">
                  PDF
                </span>
              </div>
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
            </motion.div>

            {/* Floating: DOC badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="absolute top-10 -right-3 bg-card rounded-lg border border-border shadow-lg px-3 py-2 flex items-center gap-2"
            >
              <div className="h-6 w-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400">
                  DOC
                </span>
              </div>
              <Download className="h-3.5 w-3.5 text-muted-foreground" />
            </motion.div>

            {/* Floating: Color palette dots */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              className="absolute top-[41%] -left-[-180px] flex flex-row gap-2 bg-card/80 backdrop-blur-sm rounded-sm px-3 py-2 border border-border/50 shadow-lg"
            >
              {[
                "bg-rose-300",
                "bg-blue-300",
                "bg-amber-200",
                "bg-green-300",
                "bg-slate-300",
              ].map((color, i) => (
                <div key={i} className={`h-3.5 w-3.5 rounded-full ${color}`} />
              ))}
            </motion.div>

            {/* Floating: ATS Perfect badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              className="absolute top-[56%] -left-[-180px] bg-green-50 dark:bg-green-950/30 rounded-sm border border-green-200 dark:border-green-800 px-4 py-1 flex items-center gap-2 backdrop-blur-sm shadow-xl"
            >
              <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-bold text-green-700 dark:text-green-300">
                ATS Perfect
              </span>
            </motion.div>

            {/* Floating: AI ideas card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="absolute -bottom-8 -right-8 bg-card rounded-sm border border-border shadow-xl p-2 w-52"
            >
              <div className="flex items-center gap-2 mb-3">
                <Snowflake className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold">AI-powered ideas:</span>
              </div>
              <div className="space-y-2">
                <div className="bg-muted/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] leading-relaxed">
                    Analyzed market trends to identify new growth opportunities.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg px-3 py-2">
                  <p className="text-[10px] leading-relaxed">
                    Reduced operational costs by 15% through process
                    optimization.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
