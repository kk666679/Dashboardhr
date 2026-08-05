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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Calendar,
  Download,
  Heart,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";

const mockFomemaRecords: {
  id: string;
  workerId: string;
  workerName: string;
  passportNo: string;
  examDate: string;
  status: string;
  result: string;
  clinic: string;
  doctorName: string;
  expiryDate: string | null;
  certificateNo: string | null;
  cost: number;
  remarks?: string;
}[] = [];

export default function FomemaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [resultFilter, setResultFilter] = useState("all");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { color: "bg-blue-100 text-blue-800", icon: Calendar },
      in_progress: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
      expired: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.scheduled;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getResultBadge = (result: string) => {
    const resultConfig = {
      fit: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      unfit: { color: "bg-red-100 text-red-800", icon: XCircle },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      conditional: {
        color: "bg-orange-100 text-orange-800",
        icon: AlertTriangle,
      },
    };

    const config =
      resultConfig[result as keyof typeof resultConfig] || resultConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {result.charAt(0).toUpperCase() + result.slice(1)}
      </Badge>
    );
  };

  const filteredRecords = mockFomemaRecords.filter((record) => {
    const matchesSearch =
      record.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.passportNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    const matchesResult =
      resultFilter === "all" || record.result === resultFilter;

    return matchesSearch && matchesStatus && matchesResult;
  });

  const stats = {
    total: mockFomemaRecords.length,
    scheduled: mockFomemaRecords.filter((r) => r.status === "scheduled").length,
    completed: mockFomemaRecords.filter((r) => r.status === "completed").length,
    fit: mockFomemaRecords.filter((r) => r.result === "fit").length,
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            FOMEMA Medical Examinations
          </h1>
          <p className="text-muted-foreground">
            Manage foreign worker medical examinations and certificates
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button asChild>
            <Link href="/dashboard/medical/fomema/schedule">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Exam
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Examinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.scheduled}
            </div>
            <p className="text-xs text-muted-foreground">Upcoming exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.completed}
            </div>
            <p className="text-xs text-muted-foreground">Finished exams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fit Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.fit}</div>
            <p className="text-xs text-muted-foreground">Passed medical</p>
          </CardContent>
        </Card>
      </div>

      {/* FOMEMA Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Examination Records</CardTitle>
          <CardDescription>
            Track FOMEMA medical examinations and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by worker name, passport, or FOMEMA ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="fit">Fit</SelectItem>
                <SelectItem value="unfit">Unfit</SelectItem>
                <SelectItem value="conditional">Conditional</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Records Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>FOMEMA ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Exam Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Clinic</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.workerName}</div>
                      <div className="text-sm text-muted-foreground">
                        {record.passportNo}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(record.examDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell>{getResultBadge(record.result)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.clinic}</div>
                      <div className="text-sm text-muted-foreground">
                        {record.doctorName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>RM {record.cost.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/medical/fomema/${record.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          Reschedule
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/workers/${record.workerId}`}>
                            <Heart className="mr-2 h-4 w-4" />
                            Worker Profile
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Heart className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No medical records found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
