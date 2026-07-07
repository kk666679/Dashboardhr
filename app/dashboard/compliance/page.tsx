"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  Shield,
  Calendar,
  TrendingUp,
  Users,
  Building,
  Stethoscope,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function CompliancePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock compliance alerts data
  const complianceAlerts = [
    {
      id: "C001",
      type: "document_expiry",
      severity: "high",
      title: "Work Permit Expiring Soon",
      description:
        "PLKS permit for Ahmad Rahman (BD1234567) expires in 15 days",
      workerId: "W001",
      workerName: "Ahmad Rahman",
      dueDate: "2024-02-15",
      status: "active",
      actionRequired: "Initiate permit renewal process",
      assignedTo: "HR Team",
      createdAt: "2024-01-31",
      authority: "Immigration Department",
    },
    {
      id: "C002",
      type: "medical_exam_due",
      severity: "critical",
      title: "FOMEMA Medical Exam Overdue",
      description:
        "Medical examination for Siti Nurhaliza (ID9876543) is 30 days overdue",
      workerId: "W002",
      workerName: "Siti Nurhaliza",
      dueDate: "2024-01-01",
      status: "overdue",
      actionRequired: "Schedule immediate medical examination",
      assignedTo: "Medical Team",
      createdAt: "2024-01-02",
      authority: "FOMEMA",
    },
    {
      id: "C003",
      type: "levy_payment_due",
      severity: "medium",
      title: "Government Levy Payment Due",
      description:
        "Monthly levy payment for 15 workers due tomorrow - RM 4,500",
      workerId: null,
      workerName: "Multiple Workers",
      dueDate: "2024-02-01",
      status: "active",
      actionRequired: "Process levy payment through MYEG",
      assignedTo: "Finance Team",
      createdAt: "2024-01-30",
      authority: "Immigration Department",
    },
    {
      id: "C004",
      type: "accommodation_issue",
      severity: "high",
      title: "Accommodation Compliance Issue",
      description:
        "Fire safety equipment expired at Hostel Block A - JTK inspection required",
      workerId: null,
      workerName: "Hostel Block A Residents",
      dueDate: "2024-02-10",
      status: "active",
      actionRequired:
        "Replace fire safety equipment and schedule JTK inspection",
      assignedTo: "Facilities Team",
      createdAt: "2024-01-28",
      authority: "JTK (Department of Labour)",
    },
  ];

  // Mock compliance reports data
  const complianceReports = [
    {
      id: "R001",
      reportType: "monthly",
      title: "January 2024 JTK Compliance Report",
      period: "2024-01",
      generatedDate: "2024-02-01",
      status: "completed",
      submittedToAuthorities: ["JTK", "Immigration"],
      complianceRate: 94.2,
      totalWorkers: 1247,
      issues: 23,
    },
    {
      id: "R002",
      reportType: "quarterly",
      title: "Q4 2023 Immigration Compliance Report",
      period: "2023-Q4",
      generatedDate: "2024-01-15",
      status: "submitted",
      submittedToAuthorities: ["Immigration Department", "MYEG"],
      complianceRate: 96.8,
      totalWorkers: 1189,
      issues: 15,
    },
  ];

  const filteredAlerts = complianceAlerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      severityFilter === "all" || alert.severity === severityFilter;
    const matchesType = typeFilter === "all" || alert.type === typeFilter;

    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "overdue":
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case "dismissed":
        return <Badge className="bg-gray-100 text-gray-800">Dismissed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeLabels = {
      document_expiry: "Document Expiry",
      permit_renewal: "Permit Renewal",
      medical_exam_due: "Medical Exam",
      levy_payment_due: "Levy Payment",
      compliance_violation: "Compliance Violation",
      accommodation_issue: "Accommodation",
      performance_issue: "Performance",
      attendance_issue: "Attendance",
    };
    return (
      <Badge variant="outline">
        {typeLabels[type as keyof typeof typeLabels] || type}
      </Badge>
    );
  };

  const stats = {
    totalAlerts: complianceAlerts.length,
    critical: complianceAlerts.filter((a) => a.severity === "critical").length,
    high: complianceAlerts.filter((a) => a.severity === "high").length,
    overdue: complianceAlerts.filter((a) => a.status === "overdue").length,
    complianceRate: 94.2,
    totalWorkers: 1247,
    compliantWorkers: Math.floor(1247 * 0.942),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Compliance Management
          </h1>
          <p className="text-muted-foreground">
            Monitor regulatory compliance, track alerts, and generate government
            reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/compliance/audit/new">
              <FileText className="mr-2 h-4 w-4" />
              New Audit
            </Link>
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.critical}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.high}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.complianceRate}%
            </div>
            <Progress value={stats.complianceRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliant Workers
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.compliantWorkers}
            </div>
            <div className="text-xs text-muted-foreground">
              of {stats.totalWorkers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Management Tabs */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="dashboard">Compliance Dashboard</TabsTrigger>
          <TabsTrigger value="authorities">Government Authorities</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Alerts</CardTitle>
              <CardDescription>
                Monitor and manage regulatory compliance alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts by title, worker, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={severityFilter}
                  onValueChange={setSeverityFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severities</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document_expiry">
                      Document Expiry
                    </SelectItem>
                    <SelectItem value="medical_exam_due">
                      Medical Exam
                    </SelectItem>
                    <SelectItem value="levy_payment_due">
                      Levy Payment
                    </SelectItem>
                    <SelectItem value="accommodation_issue">
                      Accommodation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alerts Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert Details</TableHead>
                    <TableHead>Worker/Scope</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Authority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{alert.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {alert.description}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getTypeBadge(alert.type)}
                            {getStatusBadge(alert.status)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{alert.workerName}</div>
                          {alert.workerId && (
                            <div className="text-sm text-muted-foreground">
                              ID: {alert.workerId}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div
                            className={`text-sm ${
                              new Date(alert.dueDate) < new Date()
                                ? "text-red-600 font-medium"
                                : new Date(alert.dueDate) <=
                                    new Date(
                                      Date.now() + 7 * 24 * 60 * 60 * 1000,
                                    )
                                  ? "text-orange-600"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {alert.dueDate}
                          </div>
                          {new Date(alert.dueDate) < new Date() && (
                            <Badge variant="destructive" className="text-xs">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{alert.authority}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{alert.assignedTo}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/compliance/alerts/${alert.id}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm">
                            Resolve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>
                Generate and manage regulatory compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Period: {report.period} | Generated:{" "}
                        {report.generatedDate}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            report.status === "completed"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {report.status}
                        </Badge>
                        <span className="text-sm text-green-600">
                          {report.complianceRate}% compliance rate
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Submitted to: {report.submittedToAuthorities.join(", ")}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link
                          href={`/dashboard/compliance/reports/${report.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate New Compliance Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>
                  Current compliance status across all areas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Worker Documentation</span>
                    <span className="text-sm font-medium">96.5%</span>
                  </div>
                  <Progress value={96.5} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Permit Compliance</span>
                    <span className="text-sm font-medium">92.1%</span>
                  </div>
                  <Progress value={92.1} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Medical Compliance</span>
                    <span className="text-sm font-medium">87.3%</span>
                  </div>
                  <Progress value={87.3} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Accommodation Standards</span>
                    <span className="text-sm font-medium">94.8%</span>
                  </div>
                  <Progress value={94.8} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>
                  Critical compliance deadlines in the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 border rounded">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        JTK Monthly Report
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: Feb 20, 2024
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      5 days
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-2 border rounded">
                    <Shield className="h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Permit Renewals (5)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: Feb 25, 2024
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      10 days
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-2 border rounded">
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        Medical Exams (12)
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Due: Mar 1, 2024
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      15 days
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="authorities" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Immigration Department</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Active Permits: 1,189</div>
                  <div className="text-muted-foreground">Expiring Soon: 23</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Levy Status: RM 45,000 due</div>
                  <div className="text-muted-foreground">
                    Next Payment: Feb 1, 2024
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Submit to Immigration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>JTK (Dept of Labour)</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Registered Workers: 1,247</div>
                  <div className="text-muted-foreground">
                    Compliance Rate: 98.5%
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Monthly Report Due</div>
                  <div className="text-muted-foreground">
                    Deadline: Feb 20, 2024
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Generate JTK Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Stethoscope className="h-5 w-5" />
                  <span>FOMEMA</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">Medical Records: 1,247</div>
                  <div className="text-muted-foreground">Overdue Exams: 12</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Fit Workers: 1,089 (87.3%)</div>
                  <div className="text-muted-foreground">
                    Pending Results: 15
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Sync FOMEMA Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
