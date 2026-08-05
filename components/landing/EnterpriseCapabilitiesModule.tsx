"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, CreditCard, Briefcase, Award, Home, UserCog,
  Workflow, CalendarDays, CheckSquare, FileText,
  Wallet, Receipt, BarChart3, Calculator,
  Shield, ClipboardCheck, AlertTriangle, Building2,
  Bot, BookOpen, Search, Network, Sparkles,
} from "lucide-react";

const DOMAINS = [
  {
    label: "People",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    items: [
      { label: "HR Management", href: "/employees", icon: Users },
      { label: "Payroll", href: "/accounting/payroll", icon: CreditCard },
      { label: "Recruitment", href: "/dashboard/recruitment", icon: Briefcase },
      { label: "Performance", href: "/dashboard/performance", icon: Award },
      { label: "ESS Portal", href: "/ess", icon: Home },
      { label: "MSS Portal", href: "/mss", icon: UserCog },
    ],
  },
  {
    label: "Operations",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
    items: [
      { label: "Workflow Engine", href: "/automation/workflow-engine", icon: Workflow },
      { label: "Automation", href: "/automation", icon: Bot },
      { label: "Scheduling", href: "/dashboard/scheduling", icon: CalendarDays },
      { label: "Approvals", href: "/mss/approvals", icon: CheckSquare },
      { label: "Documents", href: "/dashboard/documents", icon: FileText },
      { label: "SOPs", href: "/automation/sops", icon: ClipboardCheck },
    ],
  },
  {
    label: "Finance",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
    items: [
      { label: "Accounting", href: "/accounting", icon: Wallet },
      { label: "E-Invoice", href: "/accounting/e-invoice", icon: Receipt },
      { label: "Reports", href: "/accounting/reports", icon: BarChart3 },
      { label: "Tax Calculator", href: "/accounting/tax-calculator", icon: Calculator },
      { label: "CAPEX", href: "/capex", icon: Building2 },
      { label: "OPEX", href: "/opex", icon: Award },
    ],
  },
  {
    label: "Compliance",
    color: "from-red-500 to-rose-600",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
    items: [
      { label: "ISO Management", href: "/iso", icon: Shield },
      { label: "Audit", href: "/iso/audit-checklist", icon: ClipboardCheck },
      { label: "Risk Assessment", href: "/iso/gap-analysis", icon: AlertTriangle },
      { label: "Government APIs", href: "/integrations/government", icon: Building2 },
      { label: "CAPA", href: "/iso/capa-create", icon: CheckSquare },
      { label: "Compliance Score", href: "/iso/compliance-score", icon: Award },
    ],
  },
  {
    label: "AI",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    items: [
      { label: "AI Chat", href: "/ai/chat-hub", icon: Bot },
      { label: "Knowledge Base", href: "/ai/kb-chat", icon: BookOpen },
      { label: "RAG / Search", href: "/ai/semantic-search", icon: Search },
      { label: "Automation AI", href: "/ai/hr-orchestrator", icon: Network },
      { label: "Document AI", href: "/ai/doc-generator", icon: FileText },
      { label: "AI Platform", href: "/ai", icon: Sparkles },
    ],
  },
];

export function EnterpriseCapabilitiesModule() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-[var(--background-subtle,#f8fafc)] dark:bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Enterprise Capability Grid
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every business domain covered — from people to finance, compliance to AI
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {DOMAINS.map((domain, di) => (
            <motion.div
              key={domain.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: di * 0.08 }}
              className={`rounded-2xl border p-5 ${domain.bg} ${domain.border}`}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-6 rounded-full bg-gradient-to-b ${domain.color}`} />
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground/70">
                  {domain.label}
                </h3>
              </div>
              <ul className="space-y-1.5">
                {domain.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-white/60 dark:hover:bg-white/10 transition-colors group"
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
