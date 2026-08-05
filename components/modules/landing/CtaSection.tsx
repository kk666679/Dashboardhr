"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download, Phone, Zap, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export interface CtaAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: "zap" | "download" | "phone";
  variant?: "primary" | "outline";
}

interface CtaSectionProps {
  title: string;
  subtitle: string;
  actions: CtaAction[];
}

const ICON_MAP = {
  zap: Zap,
  download: Download,
  phone: Phone,
};

export function CtaSection({ title, subtitle, actions }: CtaSectionProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <motion.section
      className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {mounted &&
          [...Array(15)].map((_, i) => {
            const seed = i * 54321;
            const left = ((seed * 9301 + 49297) % 233280) / 2332.8;
            const top = ((seed * 9301 + 49297 + 2000) % 233280) / 2332.8;
            const delay = (seed % 3000) / 1000;
            return (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{ left: `${left}%`, top: `${top}%` }}
                animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay }}
              />
            );
          })}
      </div>

      <div className="container mx-auto text-center relative z-10">
        <motion.h2
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-xl mb-8 opacity-90"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {subtitle}
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          {actions.map((action, i) => {
            const IconComponent = action.icon ? ICON_MAP[action.icon] : null;
            const isPrimary = action.variant !== "outline";

            if (action.href) {
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant={isPrimary ? "default" : "outline"}
                    className={
                      isPrimary
                        ? "bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl"
                        : "border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg shadow-xl"
                    }
                    asChild
                  >
                    <Link href={action.href}>
                      {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                      {action.label}
                      {action.icon === "zap" && <ArrowRight className="w-5 h-5 ml-2" />}
                    </Link>
                  </Button>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant={isPrimary ? "default" : "outline"}
                  className={
                    isPrimary
                      ? "bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg shadow-xl"
                      : "border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg shadow-xl"
                  }
                  onClick={action.onClick}
                >
                  {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                  {action.label}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
