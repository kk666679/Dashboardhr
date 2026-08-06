"use client";

import { motion } from "framer-motion";
import { UserPlus, CreditCard, Shield, Building2, Smile, ArrowRight } from "lucide-react";

const STEPS = [
  {
    icon: UserPlus,
    dept: "HR",
    action: "Offer accepted",
    detail: "Contract generated, onboarding checklist triggered",
    color: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  },
  {
    icon: CreditCard,
    dept: "Finance",
    action: "Payroll enrolled",
    detail: "EPF, SOCSO, PCB configured. Bank details collected.",
    color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Shield,
    dept: "IT",
    action: "Access provisioned",
    detail: "SSO, email, and system permissions activated",
    color: "border-violet-500/40 bg-violet-500/10 text-violet-400",
  },
  {
    icon: Building2,
    dept: "Facilities",
    action: "Workspace ready",
    detail: "Accommodation assigned, geofence registered",
    color: "border-amber-500/40 bg-amber-500/10 text-amber-400",
  },
  {
    icon: Smile,
    dept: "Employee",
    action: "Day 1 ready",
    detail: "Portal access, payslip, leave balance — all live",
    color: "border-rose-500/40 bg-rose-500/10 text-rose-400",
  },
];

export function ConnectedWorkflowSection() {
  return (
    <section className="py-24 px-4 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            One event. Every department. Zero manual handoffs.
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            See how a single hire flows across your entire organisation
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto text-base">
            When a worker is hired, AiFWMS orchestrates every downstream task — payroll setup, permit registration, IT access, accommodation, and employee self-service — automatically.
          </p>
        </div>

        {/* Flow steps */}
        <div className="flex flex-col md:flex-row items-stretch gap-3">
          {STEPS.map((step, i) => (
            <div key={step.dept} className="flex flex-col md:flex-row items-center flex-1 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className={`flex-1 w-full rounded-2xl border p-5 ${step.color}`}
              >
                <step.icon className="h-6 w-6 mb-3" />
                <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                  {step.dept}
                </div>
                <div className="font-semibold text-foreground text-sm mb-1">{step.action}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{step.detail}</div>
              </motion.div>

              {i < STEPS.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground/40 flex-shrink-0 rotate-90 md:rotate-0" />
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-10">
          The same orchestration applies to permit renewals, offboarding, FOMEMA scheduling, and any workflow you configure.
        </p>
      </div>
    </section>
  );
}
