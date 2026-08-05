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
  Briefcase,
  Search,
  Calendar,
  TrendingUp,
  Clock,
  MapPin,
  GraduationCap,
  Target,
  Award,
  Zap,
  FileText,
  DollarSign,
} from "lucide-react";

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

const stats = [
  {
    title: "Open Positions",
    value: "18",
    change: "+4",
    icon: Briefcase,
    color: "text-blue-600",
  },
  {
    title: "Pipeline Fill Rate",
    value: "67%",
    change: "+12%",
    icon: Target,
    color: "text-green-600",
  },
  {
    title: "Time to Hire",
    value: "23 days",
    change: "-3 days",
    icon: Clock,
    color: "text-purple-600",
  },
  {
    title: "Cost per Hire",
    value: "RM 4,250",
    change: "-8%",
    icon: DollarSign,
    color: "text-orange-600",
  },
];

const pipeline = [
  { stage: "Sourcing", candidates: 245, rate: 100, goal: 250 },
  { stage: "Screening", candidates: 156, rate: 64, goal: 180 },
  { stage: "Interview", candidates: 78, rate: 50, goal: 100 },
  { stage: "Offer", candidates: 12, rate: 15, goal: 20 },
  { stage: "Hired", candidates: 8, rate: 67, goal: 12 },
];

const topSources = [
  { source: "JobStreet", hires: 23, cost: "RM 85K", effectiveness: 92 },
  { source: "Facebook", hires: 15, cost: "RM 42K", effectiveness: 78 },
  { source: "Referrals", hires: 12, cost: "RM 0", effectiveness: 100 },
  { source: "LinkedIn", hires: 8, cost: "RM 32K", effectiveness: 65 },
];

const recentReqs = [
  {
    id: "REQ-045",
    title: "Construction Supervisor",
    status: "Interviewing",
    applicants: 34,
    daysOpen: 12,
  },
  {
    id: "REQ-046",
    title: "Machine Operator",
    status: "Offer Extended",
    applicants: 28,
    daysOpen: 8,
  },
];

export function TalentDashboard() {
  return (
<>  
  <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex items-start sm:flex-row justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600" />
            Talent Acquisition
          </h1>
          <p className="text-muted-foreground text-lg">
            Recruitment pipeline, sourcing effectiveness, and ATS metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            New Job Req
          </Button>
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Candidate Search
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div variants={itemVariants} key={stat.title}>
            <Card className="border-0 shadow-lg hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-sm text-muted-foreground capitalize">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recruitment Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recruitment Pipeline</CardTitle>
            <CardDescription>Candidates by stage (target vs actual)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pipeline.map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="font-medium">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{stage.candidates}</div>
                    <Progress value={(stage.candidates / stage.goal) * 100} className="w-32 mt-1" />
                    <span className="text-xs text-muted-foreground">{stage.rate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Source Effectiveness */}
        <Card>
          <CardHeader>
            <CardTitle>Source Effectiveness</CardTitle>
            <CardDescription>ROI by recruitment channel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topSources.map((source) => (
                <div key={source.source} className="flex items-center justify-between py-2">
                  <span className="font-medium">{source.source}</span>
                  <div className="text-right">
                    <div className="font-semibold">{source.hires} hires</div>
                    <div className="text-sm text-muted-foreground">RM {source.cost} • {source.effectiveness}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reqs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Job Reqs</CardTitle>
          <CardDescription>Latest recruitment requests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentReqs.map((req) => (
            <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted">
              <div>
                <div className="font-semibold">#{req.id} {req.title}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Badge variant="secondary" className="text-xs">{req.status}</Badge>
                  <span>{req.applicants} applicants</span>
                  <span>{req.daysOpen}d open</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View</Button>
                <Button variant="ghost" size="sm">Pipeline</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </>);
}
