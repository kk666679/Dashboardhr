"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Server, Key, CheckCircle2 } from "lucide-react";

const PILLARS = [
  { icon: Shield, title: "Multi-Tenant Isolation", desc: "Every tenant's data is strictly scoped — no cross-tenant data leakage by design." },
  { icon: Lock, title: "RBAC & ABAC", desc: "Role and attribute-based access control with fine-grained permission enforcement." },
  { icon: Eye, title: "Audit Trail", desc: "Immutable audit logs for every action — who did what, when, and from where." },
  { icon: Server, title: "Data Residency", desc: "Data hosted in Malaysia-region infrastructure with PDPA compliance." },
  { icon: Key, title: "Secrets Management", desc: "Environment-based secrets with support for external secrets managers." },
  { icon: CheckCircle2, title: "ISO 27001 Aligned", desc: "Security controls mapped to ISO 27001 and NIST frameworks." },
];

export function SecurityModule() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-background via-slate-500/5 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-500/20 bg-slate-500/5 mb-6">
            <Shield className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Enterprise Security</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Built Secure from the Ground Up</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enterprise-grade security controls protecting your workforce data at every layer
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-start gap-4 p-5 rounded-xl border bg-card"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
