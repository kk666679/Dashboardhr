"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    desc: "For small teams getting started",
    color: "border-border",
    badge: null,
    features: ["Up to 10 employees", "HR & Payroll basics", "ESS Portal", "Email support"],
    cta: { label: "Start Free", href: "/dashboard" },
    variant: "outline" as const,
  },
  {
    name: "Professional",
    price: "RM 299",
    period: "/month",
    desc: "For growing Malaysian businesses",
    color: "border-primary ring-2 ring-primary/20",
    badge: "Most Popular",
    features: [
      "Up to 100 employees",
      "Full HR, Payroll & Accounting",
      "Foreign Worker Management",
      "Government API integrations",
      "AI HR Assistant",
      "Compliance & ISO tools",
      "Priority support",
    ],
    cta: { label: "Start Trial", href: "/dashboard" },
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large organisations",
    color: "border-border",
    badge: null,
    features: [
      "Unlimited employees",
      "Full platform access",
      "Custom AI models",
      "Dedicated infrastructure",
      "SLA guarantee",
      "Onboarding & training",
    ],
    cta: { label: "Contact Sales", href: "/login" },
    variant: "outline" as const,
  },
];

export function PricingPreviewModule() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--background-subtle,#f8fafc)] dark:bg-background">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary/80">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Transparent, Scalable Pricing</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, scale as you grow. No hidden fees.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex flex-col rounded-2xl border bg-card p-6 ${plan.color}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}
              <div className="mb-5">
                <h3 className="font-bold text-base mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-xs text-muted-foreground">{plan.desc}</p>
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full gap-2" asChild>
                <Link href={plan.cta.href}>
                  {plan.cta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-xs text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          All plans include a 14-day free trial. No credit card required.{" "}
          <Link href="/dashboard/settings/pricing" className="underline hover:text-foreground">
            View full pricing →
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
