"use client";

import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "@/lib/motion-variants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Shield, Zap, MessageCircle } from "lucide-react";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterSectionProps {
  brand: {
    name: string;
    version: string;
    subtitle: string;
    tagline: string;
    copyright: string;
  };
  columns: FooterColumn[];
  aiAssistant?: {
    title: string;
    description: string;
    buttonLabel: string;
  };
}

export function FooterSection({ brand, columns, aiAssistant }: FooterSectionProps) {
  return (
    <motion.footer
      className="bg-gray-900 text-white py-10 sm:py-12 px-4 sm:px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        <motion.div
          className="grid sm:grid-cols-2 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Brand Column */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center space-x-2 mb-4">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Building2 className="h-6 w-6 text-blue-400" />
              </motion.div>
              <span className="text-xl font-bold">{brand.name}</span>
              <Badge variant="outline" className="text-xs">
                {brand.version}
              </Badge>
            </div>
            <p className="text-gray-400 mb-4">{brand.subtitle}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <motion.span className="flex items-center" whileHover={{ scale: 1.05 }}>
                <Shield className="w-4 h-4 mr-2" />
                {brand.tagline.split(" ")[0]}
              </motion.span>
              <motion.span className="flex items-center" whileHover={{ scale: 1.05 }}>
                <Zap className="w-4 h-4 mr-2" />
                {brand.tagline.split(" ")[2] ?? "Enabled"}
              </motion.span>
            </div>
          </motion.div>

          {/* Link Columns */}
          {columns.map((column) => (
            <motion.div key={column.title} variants={itemVariants}>
              <h3 className="font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2 text-gray-400">
                {column.links.map((link) => (
                  <motion.li
                    key={link.href}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* AI Assistant Column */}
          {aiAssistant && (
            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-4">{aiAssistant.title}</h3>
              <motion.div
                className="bg-gray-800 rounded-lg p-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">Ask about compliance</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  {aiAssistant.description}
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                    <Link href="/ai/kb-chat" aria-label={aiAssistant.buttonLabel}>
                      {aiAssistant.buttonLabel}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p>{brand.copyright}</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
