"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  ExternalLink,
  FileText,
  Shield,
  Globe,
  Database,
  Zap,
  TrendingUp,
} from "lucide-react";

export default function GovernmentIntegrationsPage() {
  const integrations = [
    {
      id: "epf",
      name: "EPF/KWSP",
      logo: "🏛️",
      description:
        "Employee Provident Fund - Monthly contribution submissions and Form A generation",
      status: "active",
      uptime: 99.8,
      apiCalls: 1247,
      lastSubmission: "2 hours ago",
      nextSubmission: "Tomorrow 9:00 AM",
      features: [
        "Automated monthly Form A submissions",
        "Real-time contribution calculations",
        "Employee registration management",
        "Compliance status monitoring",
      ],
      recentActivity: [
        { action: "Form A submitted", time: "2 hours ago", status: "success" },
        {
          action: "Contribution calculated",
          time: "4 hours ago",
          status: "success",
        },
        {
          action: "Employee registered",
          time: "6 hours ago",
          status: "success",
        },
      ],
    },
    {
      id: "socso",
      name: "SOCSO/PERKESO",
      logo: "🛡️",
      description:
        "Social Security Organization - EIS and SOCSO contribution management",
      status: "active",
      uptime: 99.9,
      apiCalls: 892,
      lastSubmission: "1 hour ago",
      nextSubmission: "Tomorrow 10:00 AM",
      features: [
        "EIS contribution submissions",
        "SOCSO rate calculations",
        "Employee benefit tracking",
        "Injury compensation claims",
      ],
      recentActivity: [
        {
          action: "EIS contribution submitted",
          time: "1 hour ago",
          status: "success",
        },
        { action: "Rate updated", time: "3 hours ago", status: "success" },
        { action: "Employee verified", time: "5 hours ago", status: "success" },
      ],
    },
    {
      id: "lhdn",
      name: "LHDN MyInvois",
      logo: "📄",
      description:
        "Inland Revenue Board - E-invoice submission and tax compliance",
      status: "active",
      uptime: 98.5,
      apiCalls: 456,
      lastSubmission: "30 minutes ago",
      nextSubmission: "Real-time",
      features: [
        "E-invoice validation and submission",
        "Real-time tax calculations",
        "Digital signature support",
        "Cancellation and amendment handling",
      ],
      recentActivity: [
        {
          action: "E-invoice validated",
          time: "30 minutes ago",
          status: "success",
        },
        { action: "Tax calculated", time: "1 hour ago", status: "success" },
        { action: "Invoice submitted", time: "2 hours ago", status: "success" },
      ],
    },
    {
      id: "jtk",
      name: "JTK",
      logo: "⚖️",
      description:
        "Department of Labour - Foreign worker levy and compliance management",
      status: "active",
      uptime: 99.2,
      apiCalls: 234,
      lastSubmission: "4 hours ago",
      nextSubmission: "Weekly",
      features: [
        "Foreign worker levy calculations",
        "Quota management and tracking",
        "Compliance report generation",
        "Penalty calculation and alerts",
      ],
      recentActivity: [
        {
          action: "Levy payment processed",
          time: "4 hours ago",
          status: "success",
        },
        { action: "Quota updated", time: "1 day ago", status: "success" },
        {
          action: "Compliance report sent",
          time: "2 days ago",
          status: "success",
        },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Government API Integrations</h1>
        <p className="text-gray-600">
          Direct integration with Malaysian government systems for compliance
          and reporting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold">4</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-2xl font-bold">99.1%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-purple-600" />
              <span className="text-2xl font-bold">2,829</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">100%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{integration.logo}</span>
                  <div>
                    <CardTitle className="text-xl">
                      {integration.name}
                    </CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(integration.status)}>
                  {getStatusIcon(integration.status)}
                  <span className="ml-1 capitalize">{integration.status}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {integration.uptime}%
                  </div>
                  <div className="text-xs text-gray-500">Uptime</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {integration.apiCalls}
                  </div>
                  <div className="text-xs text-gray-500">API Calls</div>
                </div>
                <div>
                  <div className="text-sm font-medium">
                    {integration.nextSubmission}
                  </div>
                  <div className="text-xs text-gray-500">Next Submission</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>System Uptime</span>
                  <span>{integration.uptime}%</span>
                </div>
                <Progress value={integration.uptime} className="h-2" />
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Key Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {integration.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-xs text-gray-600"
                    >
                      <CheckCircle className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {integration.recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{activity.action}</span>
                      </div>
                      <span className="text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
