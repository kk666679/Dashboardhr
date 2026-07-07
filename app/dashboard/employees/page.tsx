"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Search, Eye, Edit3, UserX, Bot, AlertTriangle } from "lucide-react";
import type { EmployeeRow } from "@/components/features/employee/employee";
import { EmployeeTable, EmployeeCard } from "@/components/features/employee/employee";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function EmployeesPage() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const { data: employees = [], isLoading, error } = trpc.employee.list.useQuery();

  const deleteEmployee = trpc.employee.delete.useMutation({
    onSuccess: () => {
      toast.success("Employee terminated successfully");
      utils.employee.list.invalidate();
      setTerminateDialogOpen(false);
      setSelectedEmployeeId(null);
    },
    onError: (err) => {
      toast.error(`Failed to terminate employee: ${err.message}`);
    },
  });

  // Transform data to match EmployeeRow interface
  const employeeRows: EmployeeRow[] = employees.map((e) => ({
    id: e.id,
    name: e.name,
    email: e.email,
    phone: e.phone ?? undefined,
    position: e.position ?? "",
    department: e.department ?? "",
    nationality: e.nationality ?? "Unknown",
    isForeign: e.isForeign,
    hireDate: e.hireDate ? String(e.hireDate).split("T")[0] : "",
    createdAt: e.createdAt ?? "",
    status: "active" as const,
  }));

  const handleTerminate = (id: string) => {
    setSelectedEmployeeId(id);
    setTerminateDialogOpen(true);
  };

  const confirmTerminate = () => {
    if (selectedEmployeeId) {
      deleteEmployee.mutate({ id: selectedEmployeeId });
    }
  };

  // Error state
  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Card className="border-destructive">
          <CardContent className="flex items-center gap-4 py-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
            <div>
              <h3 className="font-semibold">Failed to load employees</h3>
              <p className="text-sm text-muted-foreground">{error.message}</p>
            </div>
            <Button 
              variant="outline" 
              className="ml-auto"
              onClick={() => utils.employee.list.invalidate()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Calculate stats
  const foreignWorkerCount = employees.filter((e) => e.isForeign).length;
  const uniqueDepartments = new Set(employees.map((e) => e.department).filter(Boolean)).size;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
          <p className="text-muted-foreground">
            Manage your workforce across all departments and compliance status
          </p>
        </div>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/dashboard/employees/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Active workforce</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Foreign Workers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{foreignWorkerCount}</div>
            <p className="text-xs text-muted-foreground">
              {employees.length > 0 
                ? `${((foreignWorkerCount / employees.length) * 100).toFixed(1)}% of workforce`
                : "No employees"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueDepartments}</div>
            <p className="text-xs text-muted-foreground">Unique departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">12</div>
            <p className="text-xs text-muted-foreground">Visa renewals due</p>
          </CardContent>
        </Card>
      </div>

      {/* Views */}
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">
            <Users className="h-4 w-4 mr-2" />Table View
          </TabsTrigger>
          <TabsTrigger value="cards">
            Cards ({employees.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="w-full">
          <EmployeeTable
            employees={employeeRows}
            onView={(id) => `/dashboard/employees/${id}`}
            onEdit={(id) => `/dashboard/employees/${id}/edit`}
            onTerminate={handleTerminate}
            showFilters={true}
            pageSize={10}
          />
        </TabsContent>

        <TabsContent value="cards" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employeeRows.map((employee: EmployeeRow) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onView={(id) => router.push(`/dashboard/employees/${id}`)}
                onEdit={(id) => router.push(`/dashboard/employees/${id}/edit`)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 pt-6 border-t">
        <Button variant="outline" asChild size="sm">
          <Link href="/dashboard/ai/employee">
            <Bot className="h-4 w-4 mr-2" />AI Employee Assistant
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4 mr-2" />Bulk Import
        </Button>
        <Button variant="outline" size="sm">
          <Edit3 className="h-4 w-4 mr-2" />Export CSV
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/termination">
            <UserX className="h-4 w-4 mr-2" />Pending Terminations
          </Link>
        </Button>
      </div>

      {/* Terminate Confirmation Dialog */}
      <AlertDialog open={terminateDialogOpen} onOpenChange={setTerminateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to terminate this employee? This action cannot be undone.
              All associated data will be archived for compliance purposes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmTerminate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteEmployee.isPending}
            >
              {deleteEmployee.isPending ? "Terminating..." : "Terminate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
