"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  Users,
  Plus,
} from "lucide-react";
import { TeamCalendar } from "@/components/features/scheduling/Calendar/TeamCalendar";
import { RotationBuilder } from "@/components/features/scheduling/Rotations/RotationBuilder";
import { RotationAssignmentList } from "@/components/features/scheduling/Rotations/RotationAssignmentList";
import { PatternList } from "@/components/features/scheduling/ShiftPatterns/PatternList";
import { PatternForm } from "@/components/features/scheduling/ShiftPatterns/PatternForm";
import { SwapRequestList } from "@/components/features/scheduling/Swaps/SwapRequestList";
import { SwapApproval } from "@/components/features/scheduling/Swaps/SwapApproval";
import { CoverageDashboard } from "@/components/features/scheduling/Coverage/CoverageDashboard";
import { ForecastDashboard } from "@/components/features/scheduling/Forecasting/ForecastDashboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";

const STUB_COVERAGE = {
  data: [
    { date: "Mon", required: 10, actual: 9 },
    { date: "Tue", required: 10, actual: 10 },
    { date: "Wed", required: 10, actual: 7 },
    { date: "Thu", required: 10, actual: 10 },
    { date: "Fri", required: 10, actual: 8 },
  ],
  gaps: [
    { date: "Mon", gap: 1 },
    { date: "Wed", gap: 3 },
    { date: "Fri", gap: 2 },
  ],
};

const STUB_FORECAST = {
  historical: [
    { date: "Jan", headcount: 48 },
    { date: "Feb", headcount: 51 },
    { date: "Mar", headcount: 53 },
    { date: "Apr", headcount: 50 },
  ],
  predicted: [
    { date: "May", headcount: 55, lower: 52, upper: 58 },
    { date: "Jun", headcount: 57, lower: 53, upper: 61 },
    { date: "Jul", headcount: 60, lower: 55, upper: 65 },
  ],
};

const KPI_CARDS = [
  { label: "Active Shifts", value: "24", delta: "+2", positive: true },
  { label: "Pending Swaps", value: "6", delta: "-1", positive: true },
  { label: "Coverage Gaps", value: "3", delta: "+1", positive: false },
  { label: "Patterns", value: "8", delta: "0", positive: true },
];

export default function SchedulingPage() {
  const [newPatternOpen, setNewPatternOpen] = useState(false);

  const { data: swapRequests = [] } = trpc.swap.getAll.useQuery();
  const { data: patterns = [] } = trpc.shiftPattern.getAll.useQuery();
  const { data: assignments = [] } = trpc.rotation.getByGroup.useQuery({ groupId: undefined });

  const calendarAssignments: { employee: string; date: string; shift: string }[] = assignments.map((a: { employee?: { name?: string }; employeeId?: string; date?: string; shiftStart?: string }) => ({
    employee: a.employee?.name || a.employeeId || "Unassigned",
    date: a.date || new Date().toISOString(),
    shift: a.shiftStart ? new Date(a.shiftStart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—",
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shift Scheduling</h1>
          <p className="text-muted-foreground">
            Manage rotations, shift patterns, coverage, and swap requests
          </p>
        </div>
        <Button onClick={() => setNewPatternOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Pattern
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.label} className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{kpi.value}</div>
              <Badge variant={kpi.positive ? "secondary" : "destructive"} className="text-xs">
                {kpi.delta}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-1">{kpi.label}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="calendar">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="calendar">
            <Calendar className="h-3.5 w-3.5 mr-1.5" /> Calendar
          </TabsTrigger>
          <TabsTrigger value="rotations">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Rotations
          </TabsTrigger>
          <TabsTrigger value="patterns">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Patterns
          </TabsTrigger>
          <TabsTrigger value="swaps">
            <Users className="h-3.5 w-3.5 mr-1.5" /> Swaps
          </TabsTrigger>
          <TabsTrigger value="coverage">
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Coverage
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" /> Forecast
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-4">
          <TeamCalendar teamId="default" assignments={calendarAssignments} />
        </TabsContent>

        <TabsContent value="rotations" className="mt-4 space-y-4">
          <RotationBuilder />
          <RotationAssignmentList assignments={assignments} />
        </TabsContent>

        <TabsContent value="patterns" className="mt-4">
          <PatternList patterns={patterns} />
        </TabsContent>

        <TabsContent value="swaps" className="mt-4">
          <SwapRequestList requests={swapRequests} />
        </TabsContent>

        <TabsContent value="coverage" className="mt-4">
          <CoverageDashboard data={STUB_COVERAGE.data} gaps={STUB_COVERAGE.gaps} />
        </TabsContent>

        <TabsContent value="forecast" className="mt-4">
          <ForecastDashboard
            historical={STUB_FORECAST.historical}
            predicted={STUB_FORECAST.predicted}
          />
        </TabsContent>
      </Tabs>

      {/* New Pattern Dialog */}
      <Dialog open={newPatternOpen} onOpenChange={setNewPatternOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>New Shift Pattern</DialogTitle>
          </DialogHeader>
          <PatternForm onSuccess={() => setNewPatternOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
