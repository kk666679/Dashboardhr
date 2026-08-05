"use client";

import { motion, useInView } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  pulseVariants,
} from "@/lib/motion-variants";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

interface StatItem {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

interface StatsSectionProps {
  stats: StatItem[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  return (
    <motion.section
      ref={statsRef}
      className="py-12 sm:py-16 px-4 sm:px-6 bg-white"
      initial={{ opacity: 0 }}
      animate={isStatsInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto">
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
        >
{stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-6"
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}
                  variants={pulseVariants}
                  animate="pulse"
                >
                  <IconComponent className="w-8 h-8" />
                </motion.div>
                <motion.div
                  className="text-3xl font-bold text-gray-900 mb-2"
                  initial={{ scale: 0 }}
                  animate={isStatsInView ? { scale: 1 } : { scale: 0 }}
                  transition={{
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
