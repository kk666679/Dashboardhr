"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  CreditCard,
  Wallet,
  Workflow,
  ShieldCheck,
  Globe,
  Plane,
  Shield,
  User,
  Briefcase,
  BarChart3,
  Cloud,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const PLATFORM_CAPABILITIES: PlatformItem[] = [
  { id: "ai", label: "AI Platform", href: "/ai", icon: Sparkles, color: "from-amber-500 to-orange-600" },
  { id: "hrms", label: "HRMS", href: "/employees", icon: Users, color: "from-blue-500 to-indigo-600" },
  { id: "payroll", label: "Payroll", href: "/accounting/payroll", icon: CreditCard, color: "from-green-500 to-emerald-600" },
  { id: "accounting", label: "Accounting", href: "/accounting", icon: Wallet, color: "from-teal-500 to-cyan-600" },
  { id: "automation", label: "Automation", href: "/automation", icon: Workflow, color: "from-purple-500 to-violet-600" },
  { id: "iso", label: "ISO/QMS", href: "/iso", icon: ShieldCheck, color: "from-red-500 to-rose-600" },
  { id: "foreign-workers", label: "Foreign Workers", href: "/employees/foreign-workers", icon: Globe, color: "from-cyan-500 to-sky-600" },
  { id: "expatriates", label: "Expatriates", href: "/employees/expatriates", icon: Plane, color: "from-indigo-500 to-blue-600" },
  { id: "compliance", label: "Compliance", href: "/dashboard/compliance", icon: Shield, color: "from-red-500 to-pink-600" },
  { id: "ess", label: "ESS", href: "/ess", icon: User, color: "from-orange-500 to-amber-600" },
  { id: "mss", label: "MSS", href: "/mss", icon: Briefcase, color: "from-violet-500 to-purple-600" },
  { id: "analytics", label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, color: "from-pink-500 to-rose-600" },
  { id: "open-api", label: "Open API", href: "/api/openapi", icon: GitBranch, color: "from-sky-500 to-blue-600" },
  { id: "gov-integration", label: "Gov Integration", href: "/integrations/government", icon: Cloud, color: "from-emerald-500 to-teal-600" },
];

export function PlatformOverviewModule() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Complete Enterprise Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            One integrated platform replacing 14+ standalone systems
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.04, delayChildren: 0.1 },
            },
          }}
        >
          {PLATFORM_CAPABILITIES.map((item) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link
                  href={item.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-lg transition-all duration-300 group"
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      item.color,
                    )}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

