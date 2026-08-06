"use client";

import { motion } from "framer-motion";
import { Zap, TrendingDown, ShieldCheck, BarChart3, Star, Puzzle } from "lucide-react";

const OUTCOMES = [
  {
    icon: Zap,
    metric: "Faster productivity",
    label: "Shorter time-to-productivity, fewer support requests",
    color: "text-blue-400",
  },
  {
    icon: TrendingDown,
    metric: "Lower operating cost",
    label: "Reduce manual work and duplicated systems",
    color: "text-emerald-400",
  },
  {
    icon: ShieldCheck,
    metric: "Stronger compliance",
    label: "Less policy and regulatory exposure",
    color: "text-violet-400",
  },
  {
    icon: BarChart3,
    metric: "Better decisions",
    label: "Confident hiring, capacity, and spend decisions",
    color: "text-amber-400",
  },
  {
    icon: Star,
    metric: "Reliable services",
    label: "Higher satisfaction, less operational disruption",
    color: "text-rose-400",
  },
  {
    icon: Puzzle,
    metric: "Enterprise extensibility",
    label: "Lower integration friction and platform risk",
    color: "text-cyan-400",
  },
];

export function OutcomesBar() {
  return (
    <section className="border-y bg-muted/20 py-14 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10">
          Six outcomes that matter to enterprise buyers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
          {OUTCOMES.map((item, i) => (
            <motion.div
              key={item.metric}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="flex flex-col items-center gap-2"
            >
              <item.icon className={`h-6 w-6 ${item.color}`} />
              <div className="text-sm font-semibold text-foreground leading-tight">{item.metric}</div>
              <div className="text-xs text-muted-foreground leading-snug">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
