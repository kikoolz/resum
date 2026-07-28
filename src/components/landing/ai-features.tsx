"use client";

import { motion } from "framer-motion";
import { Zap, ScanSearch, Check } from "lucide-react";

const aiCards = [
  {
    icon: <Zap className="h-5 w-5" />,
    iconBg: "bg-primary/10 text-primary",
    title: "Recreate",
    subtitle: "PDF → Editable Resume",
    items: [
      "Upload any existing PDF resume",
      "AI extracts all structured data",
      "Creates fully editable resume",
      "Preserves all sections & formatting",
      "Redirects straight to the editor",
    ],
    checkColor: "text-primary",
    delay: 0,
  },
  {
    icon: <ScanSearch className="h-5 w-5" />,
    iconBg: "bg-secondary/10 text-secondary",
    title: "Analyze",
    subtitle: "Score & Improve",
    items: [
      "Upload your resume PDF for review",
      "Get a detailed overall score",
      "Section-by-section breakdown",
      "Actionable improvement tips",
      "Results cached — no redundant calls",
    ],
    checkColor: "text-secondary",
    delay: 0.1,
  },
];

export function AIFeatures() {
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
            AI
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            AI That Actually Works
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {aiCards.map((card) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: card.delay }}
              className="bg-background p-10"
            >
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`h-10 w-10 rounded-full ${card.iconBg} flex items-center justify-center`}
                >
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.subtitle}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {card.items.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Check
                      className={`h-4 w-4 shrink-0 ${card.checkColor} mt-1`}
                    />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
