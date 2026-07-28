"use client";

import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Features } from "@/components/landing/features";
import { SectionsShowcase } from "@/components/landing/sections-showcase";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AIFeatures } from "@/components/landing/ai-features";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      <Navbar />

      <main className="relative z-10">
        <Hero />

        <div className="container mx-auto px-6">
          <div className="h-px bg-foreground/10" />
        </div>

        <Stats />

        <div className="container mx-auto px-6">
          <div className="h-px bg-foreground/10" />
        </div>

        <Features />

        <SectionsShowcase />

        <HowItWorks />

        <AIFeatures />

        <Pricing />

        <FAQ />

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
