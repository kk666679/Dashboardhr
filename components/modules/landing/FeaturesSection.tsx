"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  containerVariants,
  itemVariants,
  floatingVariants,
} from "@/lib/motion-variants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";

interface FeatureItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  gradient: string;
  bgColor: string;
  badge: string;
  badgeColor: string;
  href?: string;
}

interface FeaturesSectionProps {
  title: string;
  subtitle: string;
  features: FeatureItem[];
}

export function FeaturesSection({ title, subtitle, features }: FeaturesSectionProps) {
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true });

  return (
    <motion.section
      ref={featuresRef}
      className="py-12 sm:py-20 px-4 sm:px-6 bg-gradient-to-br from-gray-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={isFeaturesInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
        >
          <motion.h2 className="text-5xl font-bold text-gray-900 mb-4" variants={itemVariants}>
            {title}
          </motion.h2>
          <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto" variants={itemVariants}>
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => {
            const cardContent = (
              <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full bg-white/80 backdrop-blur-sm cursor-pointer">
                <CardHeader>
                  <motion.div
                    className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    variants={floatingVariants}
                    animate="float"
                  >
                    <motion.div
                      className={`w-8 h-8 bg-gradient-to-r ${feature.gradient} rounded-lg flex items-center justify-center`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <feature.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </motion.div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {feature.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-2">
                  <Badge variant="default" className={`${feature.badgeColor} text-white border-0`}>
                    {feature.badge}
                  </Badge>
                  {feature.href && (
                    <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </span>
                  )}
                </CardContent>
              </Card>
            );

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                }}
                className="group"
              >
                {feature.href ? (
                  <Link href={feature.href} className="block h-full" aria-label={`Learn more about ${feature.title}`}>
                    {cardContent}
                  </Link>
                ) : (
                  cardContent
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
