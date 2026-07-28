"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "13+", label: "Resume Sections" },
  { value: "∞", label: "Resumes Created" },
  { value: "<30s", label: "AI Generation" },
  { value: "100%", label: "ATS Compatible" },
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
