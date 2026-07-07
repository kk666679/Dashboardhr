"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Database, FileText, Shield, Zap, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function IntegrationsPage() {
  const integrations = [
    {
      title: "Government APIs",
      description: "Connect with Malaysian government services for real-time permit status, visa processing, and compliance checks.",
      href: "/integrations/government",
      icon: Globe,
      status: "live",
      features: ["JIM Immigration API", "ESD Online Permits", "FMM Status Check", "Real-time Compliance"],
    },
    {
      title: "Payroll Systems",
      description: "Seamless integration with popular payroll providers in Malaysia.",
      href: "#",
      icon: Database,
      status: "coming-soon",
      features: ["SOCSO Contributions", "EPF Reporting", "EIS Integration"],
    },
    {
      title: "Document Management",
      description: "Automated document workflows with government e-services.",
      href: "#",
      icon: FileText,
      status: "beta",
      features: ["e-Submission", "Digital Signatures", "Audit Trails"],
    },
    {
      title: "Security & Compliance",
      description: "Enterprise-grade security integrations for regulatory compliance.",
      href: "#",
      icon: Shield,
      status: "secure",
      features: ["ISO 27001", "GDPR Compliant", "Data Encryption"],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 lg:py-24 space-y-12">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        <motion.div variants={itemVariants}>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1">
            Integrations Hub
          </Badge>
        </motion.div>
        <motion.div variants={itemVariants} className="space-y-4">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight flex flex-col sm:flex-row items-center justify-center gap-4 mx-auto max-w-4xl leading-tight">
            <Globe className="h-16 w-16 text-blue-600" />
            <span>Centralized Integrations</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly connect FWMS with government APIs, payroll systems, and compliance platforms.
            Streamline your HR operations with secure, real-time data exchange.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/integrations/government">
              Explore Government APIs <Zap className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Integrations Grid */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {integrations.map((integration, index) => (
            <motion.div
              key={integration.title}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl bg-gradient-to-br from-white to-gray-50 group-hover:to-blue-50 transition-all duration-500 overflow-hidden">
                <CardHeader className="pb-4 pt-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <integration.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge 
                      variant={
                        integration.status === "live" ? "default" :
                        integration.status === "beta" ? "secondary" :
                        integration.status === "secure" ? "outline" : "outline"
                      }
                      className={`${
                        integration.status === "live" ? "bg-green-500 hover:bg-green-500" :
                        integration.status === "beta" ? "bg-orange-500 hover:bg-orange-500" : ""
                      }`}
                    >
                      {integration.status.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {integration.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {integration.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-6">
                    {integration.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center space-x-2 p-2 bg-white/50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + featureIndex * 0.1 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                  <Button 
                    asChild 
                    className="w-full group-hover:bg-blue-600 transition-colors"
                    variant={integration.href === "#" ? "outline" : "default"}
                  >
                    {integration.href === "#" ? (
                      <span className="flex items-center justify-center">
                        Coming Soon
                        <AlertCircle className="ml-2 h-4 w-4" />
                      </span>
                    ) : (
                      <Link href={integration.href}>
                        Connect Now <Zap className="ml-2 h-4 w-4" />
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div variants={itemVariants}>
            <div className="text-4xl font-bold text-blue-600 mb-2">99.9%</div>
            <div className="text-lg font-semibold text-muted-foreground">Uptime</div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="text-4xl font-bold text-green-600 mb-2">{"<100ms"}</div>
            <div className="text-lg font-semibold text-muted-foreground">API Response</div>
          </motion.div>
          <motion.div variants={itemVariants}>
            <div className="text-4xl font-bold text-purple-600 mb-2">256-bit</div>
            <div className="text-lg font-semibold text-muted-foreground">Encryption</div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

