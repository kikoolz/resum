"use client";

import { motion } from "framer-motion";

const sections = [
  { label: "Personal Info", icon: "👤" },
  { label: "Profile Summary", icon: "📝" },
  { label: "Experience", icon: "💼" },
  { label: "Education", icon: "🎓" },
  { label: "Skills", icon: "⚡" },
  { label: "Projects", icon: "🚀" },
  { label: "Awards", icon: "🏆" },
  { label: "Publications", icon: "📄" },
  { label: "Certificates", icon: "📜" },
  { label: "Languages", icon: "🌍" },
  { label: "Courses", icon: "📚" },
  { label: "References", icon: "🤝" },
  { label: "Interests", icon: "🎯" },
];

export function SectionsShowcase() {
  return (
    <section className="py-28 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4"
          >
            Sections
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            Every Section Covered
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-lg text-muted-foreground max-w-xl"
          >
            13 fully customizable sections. Add, remove, reorder, and toggle
            any of them.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {sections.map((section, i) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex items-center gap-3 p-4 bg-background border border-foreground/5"
            >
              <span className="text-lg">{section.icon}</span>
              <span className="text-sm font-medium">{section.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
