"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What is AiFWMS?",
    a: "AiFWMS is an AI-powered Enterprise Operating System for Malaysian businesses. It unifies HR, Payroll, Foreign Worker Management, Accounting, Compliance, ISO/QMS, Automation, and AI into one integrated platform.",
  },
  {
    q: "Is it compliant with Malaysian labour laws?",
    a: "Yes. The platform is built specifically for Malaysian compliance — EPF, SOCSO, EIS, PCB, FOMEMA, JTK, and Immigration regulations are all built in and kept up to date.",
  },
  {
    q: "Which AI providers are supported?",
    a: "The platform supports OpenAI, Anthropic Claude, and Ollama (local models). The AI layer is provider-agnostic — you can switch or combine providers without changing your workflows.",
  },
  {
    q: "Is the system multi-tenant?",
    a: "Yes. Every tenant's data is strictly isolated via tenantId scoping. There is no cross-tenant data access by design.",
  },
  {
    q: "Can I integrate with existing government systems?",
    a: "Yes. The platform has direct API integrations with JTK, Immigration, LHDN, EPF, SOCSO, EIS, FOMEMA, and HRDC. No manual submissions required.",
  },
  {
    q: "How do I get started?",
    a: "Run npm install, configure your .env.local with your database and AI provider keys, then npm run dev. Full setup instructions are in the documentation.",
  },
  {
    q: "Is there an ESS mobile app?",
    a: "The ESS portal is a Progressive Web App (PWA) — it works on any mobile browser with offline support, push notifications, and a native app-like experience.",
  },
  {
    q: "What deployment options are available?",
    a: "The platform supports Vercel (recommended), Docker Compose for self-hosted, and any Node.js-compatible cloud provider. A multi-stage Dockerfile is included.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-4 text-left gap-4 group"
        aria-expanded={open}
      >
        <span className="font-medium text-sm group-hover:text-primary transition-colors">{q}</span>
        <ChevronDown
          className={cn("w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQModule() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-background">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">Everything you need to know about the platform</p>
        </motion.div>

        <motion.div
          className="rounded-2xl border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {FAQS.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
