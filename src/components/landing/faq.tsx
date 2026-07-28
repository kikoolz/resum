"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

function FAQItem({
  question,
  answer,
  delay,
}: {
  question: string;
  answer: string;
  delay: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 py-7 text-left group"
      >
        <span className="text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
          {question}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-7 text-muted-foreground text-lg leading-relaxed max-w-2xl">
          {answer}
        </p>
      </motion.div>
      <div className="h-px bg-foreground/10" />
    </motion.div>
  );
}

const faqs = [
  {
    question: "Is this really free?",
    answer:
      "Yes! You can create, edit, and export resumes for free. Sign in with your Google account and start building immediately no credit card required.",
    delay: 0.05,
  },
  {
    question: "How does the AI resume recreator work?",
    answer:
      "Upload any existing PDF resume to our uploads page. Our Gemini AI reads and extracts all structured data work experience, education, skills, and more then creates a fully editable resume you can customize in our drag-and-drop editor.",
    delay: 0.1,
  },
  {
    question: "What resume sections are supported?",
    answer:
      "We support 13 sections: Personal Info, Profile Summary, Experience, Education, Skills, Projects, Awards, Publications, Certificates, Languages, Courses, References, and Interests. Each can be reordered, toggled visible/hidden, or removed entirely.",
    delay: 0.15,
  },
  {
    question: "Are the exported PDFs ATS-friendly?",
    answer:
      "Absolutely. Our resume templates are tested against major Applicant Tracking Systems. The exported A4 PDFs use clean formatting that ATS software can parse correctly, ensuring your application gets seen by recruiters.",
    delay: 0.2,
  },
  {
    question: "Can I upload a profile photo?",
    answer:
      "Yes! Upload any image, crop it with our built-in circular cropper, and it'll be embedded directly in your resume. Photos are stored securely on Cloudflare R2.",
    delay: 0.25,
  },
  {
    question: "What AI model powers this?",
    answer:
      "We use Google Gemini through Cloudflare AI Gateway via the Vercel AI SDK. This gives you fast, reliable AI generation for content writing, resume recreation, and analysis features.",
    delay: 0.3,
  },
];

export function FAQ() {
  return (
    <section className="py-28 bg-muted/30">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-sm font-medium text-muted-foreground tracking-widest uppercase mb-4"
          >
            FAQ
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl md:text-5xl font-black tracking-tight"
          >
            Questions & Answers
          </motion.h2>
        </div>

        <div>
          <div className="h-px bg-foreground/10" />
          {faqs.map((faq) => (
            <FAQItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
