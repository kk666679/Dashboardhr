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
  Plus,
  Filter,
  Download,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  RefreshCw,
  Calculator,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

export default function PermitsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock permit data
  const permits = [
    {
      id: "P001",
      permitNumber: "PLKS-2024-001234",
      type: "plks",
      workerId: "W001",
      workerName: "Ahmad Rahman",
      workerPassport: "BD1234567",
      employer: "ABC Construction Sdn Bhd",
      status: "approved",
      applicationDate: "2024-01-15",
      approvalDate: "2024-02-01",
      issueDate: "2024-02-05",
      expiryDate: "2025-02-04",
      levyAmount: 1850,
      levyPaid: 1850,
      levyDueDate: "2024-03-01",
      sector: "Construction",
      issuingAuthority: "Immigration Department",
      conditions: [
        "Must work only for registered employer",
        "Medical exam required annually",
      ],
      daysToExpiry: 245,
    },
    {
      id: "P002",
      permitNumber: "EVAL-2024-005678",
      type: "eval",
      workerId: "W002",
      workerName: "Siti Nurhaliza",
      workerPassport: "ID9876543",
      employer: "XYZ Services Sdn Bhd",
      status: "pending_application",
      applicationDate: "2024-01-20",
      approvalDate: null,
      issueDate: null,
      expiryDate: "2025-01-19",
      levyAmount: 1650,
      levyPaid: 0,
      levyDueDate: "2024-02-20",
      sector: "Services",
      issuingAuthority: "Immigration Department",
      conditions: [],
      daysToExpiry: null,
    },
    {
      id: "P003",
      permitNumber: "PLKS-2024-009876",
      type: "plks",
      workerId: "W003",
      workerName: "Ram Bahadur",
      workerPassport: "NP5555555",
      employer: "Security Plus Sdn Bhd",
      status: "expiring_soon",
      applicationDate: "2023-03-10",
      approvalDate: "2023-03-25",
      issueDate: "2023-03-30",
      expiryDate: "2024-03-29",
      levyAmount: 1850,
      levyPaid: 1850,
      levyDueDate: "2024-04-01",
      sector: "Security",
      issuingAuthority: "Immigration Department",
      conditions: [
        "Must work only for registered employer",
        "Security license required",
      ],
      daysToExpiry: 15,
    },
    {
      id: "P004",
      permitNumber: "VWR-2024-111222",
      type: "visa_with_reference",
      workerId: "W004",
      workerName: "Thant Zin",
      workerPassport: "MM7777777",
      employer: "Manufacturing Corp Sdn Bhd",
      status: "under_review",
      applicationDate: "2024-01-25",
      approvalDate: null,
      issueDate: null,
      expiryDate: "2025-01-24",
      levyAmount: 1850,
      levyPaid: 925,
      levyDueDate: "2024-02-25",
      sector: "Manufacturing",
      issuingAuthority: "Immigration Department",
      conditions: [],
      daysToExpiry: null,
    },
  ];

  const filteredPermits = permits.filter((permit) => {
    const matchesSearch =
      permit.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.permitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permit.workerPassport.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || permit.status === statusFilter;
    const matchesType = typeFilter === "all" || permit.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "pending_application":
        return (
          <Badge className="bg-blue-100 text-blue-800">
            Pending Application
          </Badge>
        );
      case "under_review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
        );
      case "expiring_soon":
        return (
          <Badge className="bg-orange-100 text-orange-800">Expiring Soon</Badge>
        );
      case "expired":
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPermitTypeBadge = (type: string) => {
    switch (type) {
      case "plks":
        return <Badge variant="outline">PLKS</Badge>;
      case "eval":
        return <Badge variant="outline">eVAL</Badge>;
      case "visa_with_reference":
        return <Badge variant="outline">VWR</Badge>;
      case "special_pass":
        return <Badge variant="outline">Special Pass</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const stats = {
    total: permits.length,
    approved: permits.filter((p) => p.status === "approved").length,
    pending: permits.filter(
      (p) => p.status === "pending_application" || p.status === "under_review",
    ).length,
    expiring: permits.filter((p) => p.status === "expiring_soon").length,
    totalLevy: permits.reduce((sum, p) => sum + p.levyAmount, 0),
    paidLevy: permits.reduce((sum, p) => sum + p.levyPaid, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Permits & Immigration
          </h1>
          <p className="text-muted-foreground">
            Manage work permits, visa applications, and government levy payments
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Calculator className="mr-2 h-4 w-4" />
            Levy Calculator
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/permits/apply">
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permits</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.expiring}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Levy Status</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              RM {stats.paidLevy.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">
              of RM {stats.totalLevy.toLocaleString()}
            </div>
            <Progress
              value={(stats.paidLevy / stats.totalLevy) * 100}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Permit Management Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Permits</TabsTrigger>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="levy">Levy Management</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Permit Directory</CardTitle>
              <CardDescription>
                Search and filter work permits and applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by worker name, permit number, or passport..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending_application">
                      Pending Application
                    </SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="plks">PLKS</SelectItem>
                    <SelectItem value="eval">eVAL</SelectItem>
                    <SelectItem value="visa_with_reference">
                      Visa with Reference
                    </SelectItem>
                    <SelectItem value="special_pass">Special Pass</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Permits Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permit Details</TableHead>
                    <TableHead>Worker</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Levy</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermits.map((permit) => (
                    <TableRow key={permit.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">
                            {permit.permitNumber}
                          </div>
                          <div className="flex items-center space-x-2">
                            {getPermitTypeBadge(permit.type)}
                            <span className="text-sm text-muted-foreground">
                              {permit.sector}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {permit.issuingAuthority}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{permit.workerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {permit.workerPassport}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {permit.employer}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(permit.status)}
                          {permit.daysToExpiry !== null &&
                            permit.daysToExpiry <= 30 && (
                              <div className="flex items-center space-x-1 text-xs text-orange-600">
                                <AlertTriangle className="h-3 w-3" />
                                <span>
                                  {permit.daysToExpiry} days to expiry
                                </span>
                              </div>
                            )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Applied:
                            </span>{" "}
                            {permit.applicationDate}
                          </div>
                          {permit.approvalDate && (
                            <div>
                              <span className="text-muted-foreground">
                                Approved:
                              </span>{" "}
                              {permit.approvalDate}
                            </div>
                          )}
                          {permit.expiryDate && (
                            <div>
                              <span className="text-muted-foreground">
                                Expires:
                              </span>{" "}
                              {permit.expiryDate}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">
                            RM {permit.levyPaid.toLocaleString()} / RM{" "}
                            {permit.levyAmount.toLocaleString()}
                          </div>
                          <Progress
                            value={(permit.levyPaid / permit.levyAmount) * 100}
                            className="h-2"
                          />
                          <div className="text-xs text-muted-foreground">
                            Due: {permit.levyDueDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/permits/${permit.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {permit.status === "expiring_soon" && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/dashboard/permits/${permit.id}/renew`}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/permits/${permit.id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
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

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>
                Track application status and follow up with authorities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">
                  Pending Applications
                </h3>
                <p className="text-muted-foreground">
                  {
                    permits.filter(
                      (p) =>
                        p.status === "pending_application" ||
                        p.status === "under_review",
                    ).length
                  }{" "}
                  applications are currently being processed
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiring Permits</CardTitle>
              <CardDescription>
                Permits that require renewal within the next 60 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-orange-500" />
                <h3 className="mt-4 text-lg font-semibold">Renewal Required</h3>
                <p className="text-muted-foreground">
                  {permits.filter((p) => p.status === "expiring_soon").length}{" "}
                  permits require immediate attention
                </p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/permits/bulk-renewal">
                    Start Bulk Renewal Process
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Government Levy Management</CardTitle>
              <CardDescription>
                Track and manage monthly government levy payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Total Levy Amount</div>
                      <div className="text-2xl font-bold">
                        RM {stats.totalLevy.toLocaleString()}
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Amount Paid</div>
                      <div className="text-2xl font-bold text-green-600">
                        RM {stats.paidLevy.toLocaleString()}
                      </div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">Outstanding Amount</div>
                      <div className="text-2xl font-bold text-red-600">
                        RM {(stats.totalLevy - stats.paidLevy).toLocaleString()}
                      </div>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                  <Button className="w-full">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Process Bulk Payment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
