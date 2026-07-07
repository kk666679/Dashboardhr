"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  AlertTriangle,
  Settings,
  Play,
  ExternalLink,
  Building,
  CreditCard,
  Users,
  FileText,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  const integrations = {
    hr_payroll: [
      {
        name: "BambooHR",
        logo: "🌿",
        status: "connected",
        description: "Sync employee data and automate onboarding",
        features: [
          "Auto-import worker data",
          "Push payroll to EPF",
          "Document sync",
        ],
        setupTime: "5 minutes",
      },
      {
        name: "SQL Payroll",
        logo: "💼",
        status: "available",
        description: "Malaysian payroll system integration",
        features: [
          "EPF/SOCSO calculations",
          "PCB tax deductions",
          "Payslip generation",
        ],
        setupTime: "10 minutes",
      },
      {
        name: "Symphony HRM",
        logo: "🎵",
        status: "beta",
        description: "Complete HR management integration",
        features: [
          "Employee lifecycle",
          "Performance tracking",
          "Leave management",
        ],
        setupTime: "15 minutes",
      },
    ],
    government: [
      {
        name: "MYEG",
        logo: "🏛️",
        status: "connected",
        description: "Government services portal integration",
        features: [
          "Auto-file permits",
          "Status tracking",
          "Payment processing",
        ],
        setupTime: "Ready",
      },
      {
        name: "IMigresen",
        logo: "🛂",
        status: "connected",
        description: "Immigration Department portal",
        features: [
          "Permit applications",
          "Blacklist checking",
          "Status updates",
        ],
        setupTime: "Ready",
      },
      {
        name: "HRMIS",
        logo: "👥",
        status: "available",
        description: "Human Resource Management Information System",
        features: [
          "Employee registration",
          "Compliance reporting",
          "Data sync",
        ],
        setupTime: "20 minutes",
      },
    ],
    accounting: [
      {
        name: "AutoCount",
        logo: "🧮",
        status: "connected",
        description: "Malaysian accounting software integration",
        features: ["GL sync", "SST-ready invoices", "Financial reporting"],
        setupTime: "Ready",
      },
      {
        name: "QuickBooks MY",
        logo: "📊",
        status: "available",
        description: "Cloud accounting platform",
        features: ["Invoice sync", "Expense tracking", "Tax compliance"],
        setupTime: "10 minutes",
      },
      {
        name: "SQL Account",
        logo: "💳",
        status: "beta",
        description: "Comprehensive accounting solution",
        features: ["Multi-currency", "Inventory management", "Custom reports"],
        setupTime: "15 minutes",
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        );
      case "available":
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>;
      case "beta":
        return <Badge className="bg-orange-100 text-orange-800">Beta</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const apiStatus = [
    { name: "MYEG Portal", status: "operational", uptime: "99.9%" },
    { name: "EPF/KWSP API", status: "operational", uptime: "99.8%" },
    { name: "SOCSO API", status: "operational", uptime: "99.7%" },
    { name: "LHDN MyInvois", status: "maintenance", uptime: "98.5%" },
    { name: "BNM Exchange", status: "operational", uptime: "99.9%" },
    { name: "FOMEMA Portal", status: "operational", uptime: "99.6%" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Integration Hub
              </h1>
              <p className="text-gray-600 mt-2">
                Connect FWMS with your existing systems and government portals
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard">
                <Settings className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Status Checker */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              API Status Monitor
            </CardTitle>
            <CardDescription>
              Real-time status of government and third-party integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {apiStatus.map((api) => (
                <div
                  key={api.name}
                  className="text-center p-3 border rounded-lg"
                >
                  <div
                    className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                      api.status === "operational"
                        ? "bg-green-500"
                        : api.status === "maintenance"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                  <div className="font-medium text-sm">{api.name}</div>
                  <div className="text-xs text-gray-500">{api.uptime}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Categories */}
        <Tabs defaultValue="government" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="government" className="flex items-center">
              <Building className="w-4 h-4 mr-2" />
              Government Portals
            </TabsTrigger>
            <TabsTrigger value="hr_payroll" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              HR & Payroll
            </TabsTrigger>
            <TabsTrigger value="accounting" className="flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Accounting Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="government" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.government.map((integration) => (
                <Card
                  key={integration.name}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.logo}</span>
                        <div>
                          <CardTitle className="text-lg">
                            {integration.name}
                          </CardTitle>
                          <CardDescription>
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {integration.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-500">
                          Setup: {integration.setupTime}
                        </span>
                        <Button
                          size="sm"
                          variant={
                            integration.status === "connected"
                              ? "outline"
                              : "default"
                          }
                        >
                          {integration.status === "connected" ? (
                            <>
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Setup
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="hr_payroll" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.hr_payroll.map((integration) => (
                <Card
                  key={integration.name}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.logo}</span>
                        <div>
                          <CardTitle className="text-lg">
                            {integration.name}
                          </CardTitle>
                          <CardDescription>
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">
                          Sync Capabilities:
                        </h4>
                        <ul className="space-y-1">
                          {integration.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-500">
                          Setup: {integration.setupTime}
                        </span>
                        <Button
                          size="sm"
                          variant={
                            integration.status === "connected"
                              ? "outline"
                              : "default"
                          }
                        >
                          {integration.status === "connected" ? (
                            <>
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Setup
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accounting" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.accounting.map((integration) => (
                <Card
                  key={integration.name}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{integration.logo}</span>
                        <div>
                          <CardTitle className="text-lg">
                            {integration.name}
                          </CardTitle>
                          <CardDescription>
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(integration.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {integration.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm text-gray-600"
                            >
                              <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-500">
                          Setup: {integration.setupTime}
                        </span>
                        <Button
                          size="sm"
                          variant={
                            integration.status === "connected"
                              ? "outline"
                              : "default"
                          }
                        >
                          {integration.status === "connected" ? (
                            <>
                              <Settings className="w-3 h-3 mr-1" />
                              Configure
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Setup
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Setup Wizard Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Setup Wizard</CardTitle>
            <CardDescription>
              Step-by-step integration guides with video tutorials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">1. Documentation</h3>
                <p className="text-sm text-gray-600">
                  Detailed setup guides and API documentation
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium mb-2">2. Video Tutorials</h3>
                <p className="text-sm text-gray-600">
                  Step-by-step video guides for each integration
                </p>
              </div>
              <div className="text-center p-6 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium mb-2">3. Live Support</h3>
                <p className="text-sm text-gray-600">
                  Get help from our integration specialists
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
