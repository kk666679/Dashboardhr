"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cloud, ArrowRight } from "lucide-react";

const GOV_APIS = [
  { name: "JTK", desc: "Labour Dept", icon: "⚖️", status: "Live" },
  { name: "Immigration", desc: "Visa & Permits", icon: "🛂", status: "Live" },
  { name: "LHDN", desc: "Tax Authority", icon: "📊", status: "Live" },
  { name: "EPF", desc: "Provident Fund", icon: "🏛️", status: "Live" },
  { name: "SOCSO", desc: "Social Security", icon: "🛡️", status: "Live" },
  { name: "FOMEMA", desc: "Medical Screen", icon: "🏥", status: "Live" },
  { name: "EIS", desc: "Employment Ins.", icon: "📋", status: "Live" },
  { name: "HRDC", desc: "Training Levy", icon: "🎓", status: "Live" },
];

const PLATFORM_APIS = [
  { name: "OpenAPI 3.1", desc: "Full REST API with Swagger docs", href: "/api/openapi" },
  { name: "Webhooks", desc: "Real-time event notifications", href: "/api/webhooks" },
  { name: "HR Integration", desc: "Sync with existing HRMS", href: "/api/hr-integration" },
  { name: "Payroll API", desc: "Payroll data export & sync", href: "/api/payroll" },
];

export function IntegrationsModule() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-6">
            <Cloud className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Integrations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Connected to Malaysia's Government</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Direct API integrations with all major Malaysian government agencies — no manual submissions
          </p>
        </motion.div>

        {/* Government APIs */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
        >
          {GOV_APIS.map((api) => (
            <motion.div
              key={api.name}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:shadow-md transition-all duration-200 text-center"
            >
              <span className="text-2xl">{api.icon}</span>
              <span className="font-bold text-sm">{api.name}</span>
              <span className="text-[10px] text-muted-foreground">{api.desc}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {api.status}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Platform APIs */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORM_APIS.map((api, i) => (
            <motion.div
              key={api.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={api.href}
                className="group flex items-center justify-between p-4 rounded-xl border bg-card hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800 transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:text-primary transition-colors">{api.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{api.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
