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
  Download,
  Stethoscope,
  Heart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Calendar,
  RefreshCw,
  FileText,
  MapPin,
  Phone,
  DollarSign,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function MedicalPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [examTypeFilter, setExamTypeFilter] = useState("all");

  // Mock medical records data
  const medicalRecords = [
    {
      id: "M001",
      workerId: "W001",
      workerName: "Ahmad Rahman",
      workerPassport: "BD1234567",
      examType: "periodic",
      examDate: "2024-01-15",
      clinicName: "Klinik Kesihatan Bangsar",
      clinicCode: "KKB001",
      doctorName: "Dr. Siti Aminah",
      fomemaStatus: "fit",
      fomemaTransactionId: "FOM2024001234",
      overallStatus: "fit",
      nextExamDue: "2025-01-15",
      certificateNumber: "CERT-2024-001234",
      cost: 180,
      paidBy: "employer" as const,
      results: [
        { testType: "Chest X-Ray", result: "normal" },
        { testType: "Blood Test", result: "normal" },
        { testType: "Urine Test", result: "normal" },
        { testType: "Physical Examination", result: "normal" },
      ],
      daysToNextExam: 350,
    },
    {
      id: "M002",
      workerId: "W002",
      workerName: "Siti Nurhaliza",
      workerPassport: "ID9876543",
      examType: "periodic",
      examDate: "2023-12-01",
      clinicName: "Pusat Kesihatan Petaling Jaya",
      clinicCode: "PKP002",
      doctorName: "Dr. Ahmad Zaki",
      fomemaStatus: "unfit",
      fomemaTransactionId: "FOM2023005678",
      overallStatus: "unfit",
      nextExamDue: "2024-02-01",
      certificateNumber: null,
      cost: 180,
      paidBy: "employer" as const,
      results: [
        { testType: "Chest X-Ray", result: "abnormal" },
        { testType: "Blood Test", result: "normal" },
        { testType: "Urine Test", result: "normal" },
        { testType: "Physical Examination", result: "referred" },
      ],
      daysToNextExam: -30,
    },
    {
      id: "M003",
      workerId: "W003",
      workerName: "Ram Bahadur",
      workerPassport: "NP5555555",
      examType: "pre_employment",
      examDate: "2024-01-20",
      clinicName: "Klinik Mediviron",
      clinicCode: "KMV003",
      doctorName: "Dr. Lim Wei Ming",
      fomemaStatus: "fit",
      fomemaTransactionId: "FOM2024009876",
      overallStatus: "fit",
      nextExamDue: "2025-01-20",
      certificateNumber: "CERT-2024-009876",
      cost: 180,
      paidBy: "employer" as const,
      results: [
        { testType: "Chest X-Ray", result: "normal" },
        { testType: "Blood Test", result: "normal" },
        { testType: "Urine Test", result: "normal" },
        { testType: "Physical Examination", result: "normal" },
      ],
      daysToNextExam: 355,
    },
    {
      id: "M004",
      workerId: "W004",
      workerName: "Thant Zin",
      workerPassport: "MM7777777",
      examType: "periodic",
      examDate: null,
      clinicName: null,
      clinicCode: null,
      doctorName: null,
      fomemaStatus: "pending_registration",
      fomemaTransactionId: null,
      overallStatus: "pending",
      nextExamDue: "2024-02-15",
      certificateNumber: null,
      cost: 180,
      paidBy: "employer" as const,
      results: [],
      daysToNextExam: 10,
    },
  ];

  // Mock clinic data
  const clinics = [
    {
      id: "C001",
      name: "Klinik Kesihatan Bangsar",
      code: "KKB001",
      address: "Jalan Bangsar, 59000 Kuala Lumpur",
      phone: "+603-2282-3456",
      email: "info@<clinic-domain>.com",
      operatingHours: "8:00 AM - 5:00 PM",
      specialties: ["General Health", "Occupational Health", "FOMEMA"],
      rating: 4.5,
      availableSlots: 15,
    },
    {
      id: "C002",
      name: "Pusat Kesihatan Petaling Jaya",
      code: "PKP002",
      address: "Jalan PJ, 46000 Petaling Jaya",
      phone: "+603-7956-1234",
      email: "contact@<clinic-domain>.com",
      operatingHours: "8:30 AM - 4:30 PM",
      specialties: ["General Health", "FOMEMA", "X-Ray"],
      rating: 4.2,
      availableSlots: 8,
    },
  ];

  const filteredRecords = medicalRecords.filter((record) => {
    const matchesSearch =
      record.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.workerPassport.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.fomemaTransactionId &&
        record.fomemaTransactionId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" || record.fomemaStatus === statusFilter;
    const matchesExamType =
      examTypeFilter === "all" || record.examType === examTypeFilter;

    return matchesSearch && matchesStatus && matchesExamType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "fit":
        return <Badge className="bg-green-100 text-green-800">Fit</Badge>;
      case "unfit":
        return <Badge className="bg-red-100 text-red-800">Unfit</Badge>;
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case "pending_registration":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Registration
          </Badge>
        );
      case "exam_scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800">Exam Scheduled</Badge>
        );
      case "results_pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Results Pending
          </Badge>
        );
      case "referred":
        return (
          <Badge className="bg-orange-100 text-orange-800">Referred</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getExamTypeBadge = (type: string) => {
    switch (type) {
      case "pre_employment":
        return <Badge variant="outline">Pre-Employment</Badge>;
      case "periodic":
        return <Badge variant="outline">Periodic</Badge>;
      case "special":
        return <Badge variant="outline">Special</Badge>;
      case "exit":
        return <Badge variant="outline">Exit</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const stats = {
    total: medicalRecords.length,
    fit: medicalRecords.filter((r) => r.fomemaStatus === "fit").length,
    unfit: medicalRecords.filter((r) => r.fomemaStatus === "unfit").length,
    pending: medicalRecords.filter(
      (r) =>
        r.fomemaStatus === "pending" ||
        r.fomemaStatus === "pending_registration",
    ).length,
    overdue: medicalRecords.filter((r) => r.daysToNextExam < 0).length,
    dueSoon: medicalRecords.filter(
      (r) => r.daysToNextExam > 0 && r.daysToNextExam <= 30,
    ).length,
    totalCost: medicalRecords.reduce((sum, r) => sum + r.cost, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Medical & FOMEMA
          </h1>
          <p className="text-muted-foreground">
            Manage medical examinations, FOMEMA compliance, and health records
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync FOMEMA
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/medical/schedule">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fit</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.fit}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unfit</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.unfit}</div>
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
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.overdue}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Due Soon</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.dueSoon}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medical Management Tabs */}
      <Tabs defaultValue="records" className="space-y-4">
        <TabsList>
          <TabsTrigger value="records">Medical Records</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Exams</TabsTrigger>
          <TabsTrigger value="clinics">FOMEMA Clinics</TabsTrigger>
          <TabsTrigger value="reports">Health Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="records" className="space-y-4">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>
                Track medical examinations and FOMEMA compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by worker name, passport, or FOMEMA ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="fit">Fit</SelectItem>
                    <SelectItem value="unfit">Unfit</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pending_registration">
                      Pending Registration
                    </SelectItem>
                    <SelectItem value="referred">Referred</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={examTypeFilter}
                  onValueChange={setExamTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by exam type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pre_employment">
                      Pre-Employment
                    </SelectItem>
                    <SelectItem value="periodic">Periodic</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                    <SelectItem value="exit">Exit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Medical Records Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Worker Details</TableHead>
                    <TableHead>Exam Information</TableHead>
                    <TableHead>FOMEMA Status</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Next Exam</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{record.workerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {record.workerPassport}
                          </div>
                          {record.fomemaTransactionId && (
                            <div className="text-xs text-muted-foreground">
                              FOMEMA: {record.fomemaTransactionId}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getExamTypeBadge(record.examType)}
                          {record.examDate && (
                            <div className="text-sm text-muted-foreground">
                              Date: {record.examDate}
                            </div>
                          )}
                          {record.clinicName && (
                            <div className="text-xs text-muted-foreground">
                              {record.clinicName}
                            </div>
                          )}
                          {record.doctorName && (
                            <div className="text-xs text-muted-foreground">
                              Dr: {record.doctorName}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {getStatusBadge(record.fomemaStatus)}
                          {record.certificateNumber && (
                            <div className="text-xs text-muted-foreground">
                              Cert: {record.certificateNumber}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {record.results.length > 0 ? (
                            record.results.map((result, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-xs"
                              >
                                <span className="text-muted-foreground">
                                  {result.testType}:
                                </span>
                                <Badge
                                  variant={
                                    result.result === "normal"
                                      ? "outline"
                                      : "destructive"
                                  }
                                  className="text-xs"
                                >
                                  {result.result}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No results
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {record.nextExamDue && (
                            <div className="text-sm">{record.nextExamDue}</div>
                          )}
                          {record.daysToNextExam !== null && (
                            <div
                              className={`text-xs ${
                                record.daysToNextExam < 0
                                  ? "text-red-600"
                                  : record.daysToNextExam <= 30
                                    ? "text-orange-600"
                                    : "text-green-600"
                              }`}
                            >
                              {record.daysToNextExam < 0
                                ? `${Math.abs(record.daysToNextExam)} days overdue`
                                : `${record.daysToNextExam} days remaining`}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/medical/${record.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {record.fomemaStatus === "pending_registration" && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link
                                href={`/dashboard/medical/schedule?workerId=${record.workerId}`}
                              >
                                <Calendar className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <RefreshCw className="h-4 w-4" />
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

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Medical Examinations</CardTitle>
              <CardDescription>
                Book FOMEMA medical exams for workers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Workers Requiring Medical Exams
                  </h3>
                  <div className="space-y-2">
                    {medicalRecords
                      .filter((r) => r.daysToNextExam <= 30)
                      .map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <div className="font-medium">
                              {record.workerName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {record.workerPassport}
                            </div>
                            <div
                              className={`text-xs ${
                                record.daysToNextExam < 0
                                  ? "text-red-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {record.daysToNextExam < 0
                                ? `${Math.abs(record.daysToNextExam)} days overdue`
                                : `Due in ${record.daysToNextExam} days`}
                            </div>
                          </div>
                          <Button size="sm" asChild>
                            <Link
                              href={`/dashboard/medical/schedule?workerId=${record.workerId}`}
                            >
                              Schedule
                            </Link>
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="mr-2 h-4 w-4" />
                      Bulk Schedule Exams
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync FOMEMA Status
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Medical Report
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Medical Cost Summary
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clinics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>FOMEMA Registered Clinics</CardTitle>
              <CardDescription>
                Find and manage approved medical examination clinics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {clinics.map((clinic) => (
                  <Card key={clinic.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{clinic.name}</CardTitle>
                        <Badge variant="outline">{clinic.code}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{clinic.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{clinic.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{clinic.operatingHours}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span>{clinic.availableSlots} slots available</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {clinic.specialties.map((specialty) => (
                          <Badge
                            key={specialty}
                            variant="secondary"
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-1">
                          <span className="text-sm font-medium">Rating:</span>
                          <span className="text-sm text-yellow-600">
                            ★ {clinic.rating}
                          </span>
                        </div>
                        <Button size="sm" asChild>
                          <Link
                            href={`/dashboard/medical/schedule?clinicId=${clinic.id}`}
                          >
                            Book Appointment
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Health Reports & Analytics</CardTitle>
              <CardDescription>
                Medical examination statistics and compliance reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-4">
                  <h3 className="font-semibold">Compliance Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Fit Workers</span>
                      <span className="text-sm font-medium">
                        {((stats.fit / stats.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={(stats.fit / stats.total) * 100} />
                    <div className="flex justify-between">
                      <span className="text-sm">Up-to-date Exams</span>
                      <span className="text-sm font-medium">
                        {(
                          ((stats.total - stats.overdue) / stats.total) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        ((stats.total - stats.overdue) / stats.total) * 100
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Cost Analysis</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Medical Costs</span>
                      <span className="text-sm font-medium">
                        RM {stats.totalCost.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average per Worker</span>
                      <span className="text-sm font-medium">
                        RM {(stats.totalCost / stats.total).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Upcoming Costs</span>
                      <span className="text-sm font-medium">
                        RM {(stats.dueSoon * 180).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Actions Required</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Compliance Report
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export Medical Data
                    </Button>
                    <Button
                      className="w-full justify-start"
                      variant="outline"
                      size="sm"
                    >
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Send Overdue Alerts
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
