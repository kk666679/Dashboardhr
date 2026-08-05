"use client";

import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  pulseVariants,
} from "@/lib/motion-variants";
import { Card, CardContent } from "@/components/ui/card";

interface GovernmentApi {
  name: string;
  status: string;
  icon: string;
  color: string;
}

interface GovernmentIntegrationProps {
  title: string;
  subtitle: string;
  apis: GovernmentApi[];
}

export function GovernmentIntegration({ title, subtitle, apis }: GovernmentIntegrationProps) {
  return (
    <motion.section
      className="py-12 sm:py-16 px-4 sm:px-6 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 text-lg">{subtitle}</p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {apis.map((api, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 border-2 border-transparent group-hover:border-green-200">
                <CardContent className="p-6">
                  <motion.div
                    className="text-4xl mb-3"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {api.icon}
                  </motion.div>
                  <div className="font-semibold text-sm mb-2">{api.name}</div>
                  <div className="flex items-center justify-center">
                    <motion.div
                      className={`w-3 h-3 ${api.color} rounded-full mr-2`}
                      variants={pulseVariants}
                      animate="pulse"
                    />
                    <span className="text-xs text-green-600 font-medium">
                      {api.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
