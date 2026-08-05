"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  Shield,
  TrendingUp,
  Award,
  FileText,
  Calculator,
  CheckCircle,
  Clock,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stats = [
  {
    title: "Total Payroll",
    value: "RM 2.8M",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
  },
  {
    title: "Avg Salary",
    value: "RM 3,450",
    change: "+8.2%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Benefits Rate",
    value: "92%",
    change: "+3%",
    trend: "up",
    icon: Award,
    color: "text-purple-600",
  },
  {
    title: "Compliance",
    value: "98%",
    change: "100%",
    trend: "up",
    icon: Shield,
    color: "text-emerald-600",
  },
];

const salaryBands = [
  { band: "Unskilled", min: "RM1,850", max: "RM2,500", workers: 847, compliance: 98 },
  { band: "Semi-Skilled", min: "RM2,500", max: "RM3,500", workers: 1234, compliance: 95 },
  { band: "Skilled", min: "RM3,500", max: "RM5,000", workers: 456, compliance: 99 },
  { band: "Supervisor", min: "RM5,000", max: "RM7,000", workers: 123, compliance: 100 },
];

const recentAdjustments = [
  {
    id: "ADJ-001",
    worker: "Ahmad Rahman",
    type: "Salary Increment",
    amount: "+RM250",
    date: "2024-01-25",
    approved: true,
  },
  {
    id: "ADJ-002",
    worker: "Kumar Patel",
    type: "Overtime Bonus",
    amount: "+RM450",
    date: "2024-01-24",
    approved: false,
  },
];

export function CompBenefitsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
<>  
  <div className="space-y-6">
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compensation & Benefits</h1>
          <p className="text-muted-foreground text-lg">
            Manage salaries, statutory benefits, and Malaysian compliance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calculator className="w-4 h-4 mr-2" />
            Salary Calculator
          </Button>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div variants={itemVariants} key={stat.title}>
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge className={stat.trend === "up" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Salary Bands Compliance
              </CardTitle>
              <CardDescription>
                Malaysian minimum wage & sector compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {salaryBands.map((band) => (
                  <div key={band.band} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">{band.band}</div>
                      <div className="text-sm text-muted-foreground">{band.min} - {band.max}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{band.workers}</div>
                      <Progress value={band.compliance} className="w-24 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Statutory Contributions</CardTitle>
              <CardDescription>EPF, SOCSO, EIS, PCB breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>EPF (13%)</span>
                  <span className="font-semibold">RM 285K</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCSO (1.75%)</span>
                  <span className="font-semibold">RM 42K</span>
                </div>
                <div className="flex justify-between">
                  <span>EIS (0.4%)</span>
                  <span className="font-semibold">RM 9K</span>
                </div>
                <div className="flex justify-between">
                  <span>PCB Tax</span>
                  <span className="font-semibold">RM 156K</span>
                </div>
                <div className="flex justify-between pt-2 border-t font-semibold">
                  <span>Foreign Levy</span>
                  <span>RM 1.85M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAdjustments.map((adj) => (
                  <div key={adj.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">{adj.worker}</div>
                      <div className="text-sm text-muted-foreground">{adj.type}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${adj.amount.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {adj.amount}
                      </div>
                      <div className="text-xs text-muted-foreground">{adj.date}</div>
                      {adj.approved ? (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-500 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  </>);
}
