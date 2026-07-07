"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Users, Search, Eye, Edit3, UserX, Bot, FileText, ShieldCheck, AlertCircle, CalendarX } from "lucide-react";
import type { EmployeeRow } from "@/components/features/employee/employee";
import { EmployeeTable, EmployeeCard } from "@/components/features/employee/employee";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function ForeignWorkersPage() {
  const { data: employees = [], isLoading } = trpc.employee.list.useQuery({
    isForeign: true
  });

  const employeeRows: EmployeeRow[] = employees.map((e) => ({
    ...e,
    hireDate: e.hireDate ? String(e.hireDate).split('T')[0] : '',
  } as EmployeeRow));

  const foreignWorkers = employeeRows.filter(e => e.isForeign);

  if (isLoading) {
    return (
      <div className={`space-y-6 p-6`}>
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
        </div>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 p-6`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
        <div>
          <h1 className={`text-3xl font-bold tracking-tight`}>👷 Foreign Workers</h1>
          <p className={`text-muted-foreground`}>
            Manage foreign workforce permits, levy compliance, and FOMEMA requirements
          </p>
        </div>
        <Button asChild size={`sm`} className={`w-full sm:w-auto`}>
          <Link href={`/dashboard/employees/new?isForeign=true`}>
            <Plus className={`h-4 w-4 mr-2`} />
            Add Foreign Worker
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`}>
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2`}>
            <CardTitle className={`text-sm font-medium`}>Total Foreign Workers</CardTitle>
            <Users className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold`}>{foreignWorkers.length.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2`}>
            <CardTitle className={`text-sm font-medium`}>Permits Expiring Soon</CardTitle>
            <AlertCircle className={`h-4 w-4 text-destructive`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-destructive`}>8</div>
            <p className={`text-xs text-muted-foreground mt-1`}>Within 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2`}>
            <CardTitle className={`text-sm font-medium`}>Levy Compliance</CardTitle>
            <ShieldCheck className={`h-4 w-4 text-muted-foreground`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-emerald-600`}>95%</div>
            <p className={`text-xs text-muted-foreground mt-1`}>Paid on time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-2`}>
            <CardTitle className={`text-sm font-medium`}>FOMEMA Due</CardTitle>
            <CalendarX className={`h-4 w-4 text-orange-500`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-orange-500`}>15</div>
            <p className={`text-xs text-muted-foreground mt-1`}>Medical exams overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Views */}
      <Tabs defaultValue={`table`} className={`space-y-4`}>
        <TabsList>
          <TabsTrigger value={`table`}>
            <Users className={`h-4 w-4 mr-2`} />Table View
          </TabsTrigger>
          <TabsTrigger value={`cards`}>
            Cards ({foreignWorkers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={`table`} className={`w-full`}>
          <EmployeeTable
            employees={foreignWorkers}
            onView={(id) => `/dashboard/employees/${id}`}
            onEdit={(id) => `/dashboard/employees/${id}/edit`}
            onTerminate={(id) => console.log('terminate foreign worker', id)}
          />
        </TabsContent>

        <TabsContent value={`cards`} className={`w-full`}>
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`}>
            {foreignWorkers.map((employee: EmployeeRow) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onView={() => {}} 
                onEdit={() => {}}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Foreign Worker Quick Actions */}
      <div className={`flex flex-wrap gap-3 pt-6 border-t`}>
        <Button variant={`outline`} asChild size={`sm`}>
          <Link href={`/dashboard/ai/foreign-worker`}>
            <Bot className={`h-4 w-4 mr-2`} />AI Compliance Assistant
          </Link>
        </Button>
        <Button variant={`outline`} size={`sm`}>
          <FileText className={`h-4 w-4 mr-2`} />Bulk Levy Payment
        </Button>
        <Button variant={`outline`} size={`sm`}>
          <ShieldCheck className={`h-4 w-4 mr-2`} />FOMEMA Scheduling
        </Button>
        <Button variant={`outline`} size={`sm`}>
          <CalendarX className={`h-4 w-4 mr-2`} />Permit Renewals
        </Button>
      </div>
    </div>
  );
}

