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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Users,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  BarChart3,
  FileText,
  Phone,
  MessageCircle,
  Award,
  Shield,
  Clock,
  Activity,
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
  visible: { opacity: 1, y: 0 },
};

const stats = [
  {
    title: "Open Grievances",
    value: "12",
    change: "+3",
    trend: "up",
    icon: AlertTriangle,
    color: "text-orange-600",
  },
  {
    title: "Resolution Rate",
    value: "94%",
    change: "+2%",
    trend: "up",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    title: "Avg Resolution Time",
    value: "4.2 days",
    change: "-1 day",
    trend: "down",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    title: "Engagement Score",
    value: "78%",
    change: "-3%",
    trend: "down",
    icon: BarChart3,
    color: "text-purple-600",
  },
];

const grievances = [
  {
    id: "GRV-001",
    employee: "Ahmad Rahman",
    type: "Salary Dispute",
    stage: "Investigation",
    daysOpen: 5,
    priority: "High",
  },
  {
    id: "GRV-002",
    employee: "Kumar Patel",
    type: "Working Hours",
    stage: "Mediation",
    daysOpen: 3,
    priority: "Medium",
  },
  {
    id: "GRV-003",
    employee: "Nguyen Van Duc",
    type: "Harassment",
    stage: "Investigation",
    daysOpen: 8,
    priority: "Critical",
  },
];

const performanceReviews = [
  {
    employee: "Rahman Ali",
    rating: 4.2,
    status: "Pending",
    dueDate: "2024-02-05",
  },
  {
    employee: "Siti Aishah",
    rating: 4.8,
    status: "Completed",
    dueDate: "2024-01-20",
  },
];

export function RelationsDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Employee Relations
          </h1>
          <p className="text-muted-foreground text-lg">
            Grievances, performance management, and engagement tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            New Grievance
          </Button>
          <Button>
            <MessageCircle className="w-4 h-4 mr-2" />
            Counseling Log
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div variants={itemVariants} key={stat.title}>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} bg-opacity-10 rounded-xl flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className={`bg-${stat.trend === 'up' ? 'orange' : 'green'}-100 text-${stat.trend === 'up' ? 'orange' : 'green'}-800`}>
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <p className="text-sm text-muted-foreground capitalize">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grievance Pipeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Grievance Pipeline
              <Badge variant="outline" className="text-xs">12 Active</Badge>
            </CardTitle>
            <CardDescription>Malaysian Industrial Relations Act compliance</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Days Open</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grievances.map((grv) => (
                  <TableRow key={grv.id}>
                    <TableCell className="font-mono text-sm">#{grv.id}</TableCell>
                    <TableCell className="font-medium">{grv.employee}</TableCell>
                    <TableCell>
                      <Badge variant={grv.priority === 'Critical' ? 'destructive' : 'secondary'}>
                        {grv.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${grv.priority === 'Critical' ? 'bg-red-500' : grv.priority === 'High' ? 'bg-orange-500' : 'bg-green-500'}`} />
                        {grv.stage}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{grv.daysOpen}d</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Performance Reviews */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Reviews</CardTitle>
            <CardDescription>Upcoming and recent reviews</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {performanceReviews.map((review) => (
              <div key={review.employee} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{review.employee}</div>
                  <div className="text-sm text-muted-foreground">Rating: {review.rating}/5</div>
                </div>
                <div className="text-right">
                  <Badge variant={review.status === 'Completed' ? 'default' : 'secondary'}>
                    {review.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">{review.dueDate}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Counseling & Disciplinary */}
      <Card>
        <CardHeader>
          <CardTitle>Counseling & Disciplinary Actions</CardTitle>
          <CardDescription>Track employee counseling sessions and disciplinary measures</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-6 border rounded-lg">
              <Shield className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-muted-foreground">Counseling Sessions</div>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Warnings Issued</div>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Activity className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <div className="text-2xl font-bold">1</div>
              <div className="text-sm text-muted-foreground">Suspensions</div>
            </div>
            <div className="text-center p-6 border rounded-lg">
              <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <div className="text-2xl font-bold">28</div>
              <div className="text-sm text-muted-foreground">Exit Interviews</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

