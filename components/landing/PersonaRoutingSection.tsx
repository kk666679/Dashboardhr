"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, BarChart3, Settings2, Shield, Code2, ArrowRight } from "lucide-react";

const PERSONAS = [
  {
    icon: Users,
    role: "HR leaders",
    concern: "Employee experience, compliance, adoption",
    outcomes: ["Guided onboarding workflows", "Foreign worker permit lifecycle", "Self-service for every employee"],
    cta: "See HR workflows",
    href: "/employees",
    color: "border-blue-500/30 from-blue-500/15 to-cyan-500/5",
    iconColor: "text-blue-400",
  },
  {
    icon: BarChart3,
    role: "Finance leaders",
    concern: "Cost control, ROI, statutory risk, predictability",
    outcomes: ["EPF / SOCSO / PCB auto-calculated", "LHDN e-Invoice compliant", "Payroll cost by department"],
    cta: "See finance controls",
    href: "/accounting",
    color: "border-emerald-500/30 from-emerald-500/15 to-green-500/5",
    iconColor: "text-emerald-400",
  },
  {
    icon: Settings2,
    role: "Operations leaders",
    concern: "Throughput, consistency, workforce visibility",
    outcomes: ["GPS attendance you can trust", "Live site workforce view", "EMA Act 446 accommodation compliance"],
    cta: "See operations tools",
    href: "/dashboard/geolocation",
    color: "border-violet-500/30 from-violet-500/15 to-purple-500/5",
    iconColor: "text-violet-400",
  },
  {
    icon: Shield,
    role: "IT leaders",
    concern: "Security, interoperability, administration",
    outcomes: ["SAML / OIDC / SCIM identity federation", "RBAC + ABAC + tenant isolation", "Immutable audit trail"],
    cta: "Review security & integrations",
    href: "/dashboard/security",
    color: "border-amber-500/30 from-amber-500/15 to-yellow-500/5",
    iconColor: "text-amber-400",
  },
  {
    icon: Code2,
    role: "Developers",
    concern: "APIs, extensibility, deployment experience",
    outcomes: ["REST + tRPC APIs with OpenAPI spec", "Webhooks with HMAC verification", "Docker / Neon / Vercel ready"],
    cta: "Explore the developer platform",
    href: "/api/openapi",
    color: "border-rose-500/30 from-rose-500/15 to-pink-500/5",
    iconColor: "text-rose-400",
  },
];

export function PersonaRoutingSection() {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Built for every stakeholder
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            What matters most to you?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Executives see outcomes first. Technical evaluators reach architecture, security, and APIs within two clicks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PERSONAS.map((persona, i) => (
            <motion.div
              key={persona.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex"
            >
              <Link
                href={persona.href}
                className={`group flex flex-col w-full rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${persona.color}`}
              >
                <persona.icon className={`h-7 w-7 mb-4 ${persona.iconColor}`} />
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  {persona.role}
                </div>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{persona.concern}</p>
                <ul className="space-y-1.5 mt-auto mb-5">
                  {persona.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-xs text-foreground/80">
                      <span className="h-1.5 w-1.5 rounded-full bg-current flex-shrink-0 mt-1" />
                      {o}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  {persona.cta} <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
