"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-6">
      <div className="text-5xl font-black text-foreground/10 leading-none shrink-0 w-16">
        {number}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const steps = [
  {
    number: "01",
    title: "Import or Start Fresh",
    description:
      "Upload your existing PDF resume for AI recreation, or start from scratch with our guided editor. Sign in with Google to get started in seconds.",
  },
  {
    number: "02",
    title: "AI Enhancement",
    description:
      "Let our Gemini-powered AI polish your content, generate professional summaries, suggest stronger action verbs, and optimize for ATS keywords.",
  },
  {
    number: "03",
    title: "Download & Apply",
    description:
      "Export as a perfectly formatted A4 PDF with one click. Your resume is ATS-tested and ready to land interviews instantly.",
  },
];

export function HowItWorks() {
  const { data: session } = useSession();

  return (
    <section className="py-28">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:sticky lg:top-24"
          >
            <div className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4">
              Process
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight">
              3 Steps To
              <br />
              <span className="italic text-primary">Your Dream Job</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-md leading-relaxed">
              We&apos;ve simplified the process so you can focus on
              preparing for the interview.
            </p>
            <Link href={session ? "/dashboard" : "/sign-in"}>
              <Button size="lg" className="px-8 font-medium">
                Build Now
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-12"
          >
            {steps.map((step, i) => (
              <div key={step.number}>
                {i > 0 && <div className="h-px bg-foreground/10 mb-12" />}
                <StepCard {...step} />
              </div>
            ))}
            <div className="h-px bg-foreground/10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
