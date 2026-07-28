"use client";

import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DoodleBackground } from "@/app/(auth)/doodle-background";

export function CTA() {
  const { data: session } = useSession();

  return (
    <section className="relative py-32 overflow-hidden">
      <DoodleBackground />
      <div className="relative z-10 container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">
            Ready To
            <br />
            <span className="italic text-primary">Level Up</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
            Join thousands of professionals who have accelerated their
            careers with AI Resume. Build your first resume in under 2
            minutes.
          </p>
          <Link href={session ? "/dashboard" : "/sign-in"}>
            <Button size="lg" className="text-base h-14 px-12 font-medium">
              Get Started Free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
