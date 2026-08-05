"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, Plane, Truck, MapPin, HeartPulse, Home, ArrowRight } from "lucide-react";

const ITEMS = [
  {
    icon: Globe,
    title: "Foreign Worker Management",
    desc: "End-to-end lifecycle — hiring, permits, FOMEMA, accommodation, and repatriation.",
    href: "/employees/foreign-workers",
    color: "from-cyan-500 to-sky-600",
  },
  {
    icon: Plane,
    title: "Expatriate Management",
    desc: "Visa, work pass, relocation, tax equalisation, and expat payroll in one place.",
    href: "/employees/expatriates",
    color: "from-indigo-500 to-blue-600",
  },
  {
    icon: Truck,
    title: "Permits & Visas",
    desc: "Apply, renew, bulk-process permits. Levy calculator and JTK/Immigration integration.",
    href: "/employees/permits",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: MapPin,
    title: "Geolocation Attendance",
    desc: "Live GPS tracking, geofencing, and location-based clock-in for field workers.",
    href: "/dashboard/geolocation",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: HeartPulse,
    title: "Medical / FOMEMA",
    desc: "Schedule and track FOMEMA medical screenings with expiry alerts.",
    href: "/employees/medical",
    color: "from-red-500 to-rose-600",
  },
  {
    icon: Home,
    title: "Accommodation",
    desc: "Worker housing register, inspection scheduling, and compliance tracking.",
    href: "/dashboard/accommodation",
    color: "from-amber-500 to-orange-600",
  },
];

export function WorkforceModule() {
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-6">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Malaysian Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Foreign Workforce Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The only platform built specifically for Malaysian foreign worker compliance — from permit to repatriation
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <Link
                  href={item.href}
                  className="group flex flex-col gap-4 p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300 h-full"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1.5 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
