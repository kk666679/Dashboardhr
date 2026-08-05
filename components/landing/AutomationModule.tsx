"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Workflow, GitBranch, Bot, FileText, BarChart3, Layers, ArrowRight, Zap } from "lucide-react";

const ITEMS = [
  { icon: Workflow, title: "Workflow Engine", desc: "Visual drag-and-drop workflow builder with conditional logic and approvals.", href: "/automation/workflow-engine", color: "text-purple-500" },
  { icon: GitBranch, title: "Flow Designer", desc: "React Flow-based process designer for complex multi-step business flows.", href: "/automation/designer", color: "text-blue-500" },
  { icon: Bot, title: "QMS / Quality", desc: "Quality management system with process control and non-conformance tracking.", href: "/automation/qms", color: "text-emerald-500" },
  { icon: FileText, title: "SOP Workflows", desc: "Digitise standard operating procedures and enforce step-by-step execution.", href: "/automation/sops", color: "text-amber-500" },
  { icon: BarChart3, title: "Automation Analytics", desc: "Monitor workflow performance, bottlenecks, and SLA compliance.", href: "/automation/analytics", color: "text-cyan-500" },
  { icon: Layers, title: "Templates", desc: "Pre-built workflow templates for HR, compliance, onboarding, and more.", href: "/automation/templates", color: "text-rose-500" },
];

export function AutomationModule() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-gradient-to-b from-background via-purple-500/5 to-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 mb-6">
            <Zap className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">Automation & Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Automate Every Process</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From simple approvals to complex multi-department workflows — automate, monitor, and optimise
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link
                  href={item.href}
                  className="group flex items-start gap-4 p-5 rounded-xl border bg-card hover:shadow-md hover:border-purple-200 dark:hover:border-purple-800 transition-all duration-200"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-purple-50 dark:group-hover:bg-purple-950/40 transition-colors">
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
