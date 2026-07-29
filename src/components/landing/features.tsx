"use client";

import { motion } from "framer-motion";
import {
  Brain,
  ScanSearch,
  Snowflake,
  GripVertical,
  Eye,
  Image,
} from "lucide-react";

function FeatureItem({
  icon,
  title,
  description,
  delay,
  number,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  number: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 rounded-none border border-foreground/5 bg-card/50 hover:bg-card hover:border-foreground/10 transition-all duration-300 overflow-hidden"
    >
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-foreground/[0.05] leading-none pointer-events-none select-none">
        {number}
      </span>
      <div className="relative z-10">
        <div className="mb-4 text-foreground">{icon}</div>
        <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

const features = [
  {
    number: "01",
    icon: <Brain className="h-6 w-6" />,
    title: "AI Resume Recreator",
    description:
      "Upload any existing PDF resume and our AI extracts all data into a fully editable, structured resume instantly.",
    delay: 0.05,
  },
  {
    number: "02",
    icon: <ScanSearch className="h-6 w-6" />,
    title: "AI Resume Analyzer",
    description:
      "Get a detailed score and section-by-section review of your resume with actionable improvement suggestions.",
    delay: 0.1,
  },
  {
    number: "03",
    icon: <Snowflake className="h-6 w-6" />,
    title: "AI Content Writer",
    description:
      "Generate professional summaries, bullet points, and skill descriptions with a single click using Gemini AI.",
    delay: 0.15,
  },
  {
    number: "04",
    icon: <GripVertical className="h-6 w-6" />,
    title: "Drag & Drop Sections",
    description:
      "Reorder your 13 resume sections with intuitive drag-and-drop. Toggle visibility on any section instantly.",
    delay: 0.2,
  },
  {
    number: "05",
    icon: <Eye className="h-6 w-6" />,
    title: "Live A4 Preview",
    description:
      "See your resume update in real-time on a pixel-perfect A4 preview panel as you type and edit.",
    delay: 0.25,
  },
  {
    number: "06",
    icon: <Image className="h-6 w-6" />,
    title: "Photo Crop & Upload",
    description:
      "Upload a profile photo, crop it with a circular cropper, and embed it directly into your resume.",
    delay: 0.3,
  },
];

export function Features() {
  return (
    <section className="py-28">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4"
          >
            Features
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Everything You Need
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {features.map((feature) => (
            <FeatureItem key={feature.number} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
