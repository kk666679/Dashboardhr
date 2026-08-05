"use client";

import { useState } from "react";
import {
  Timeline,
  TimelineEventItem,
  TimelineHeader,
  TimelineEmptyState,
  Suggestions,
  Suggestion,
} from "../../ai-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

// Mock data for KPIs
const kpiData = {
  totalDefects: 42,
  dpm: 3200,
  sigma: 4.2,
  yield: 99.68,
  trend: "improving", // or "declining"
};

// Mock data for timeline
const timelineEvents = [
  {
    id: "evt-1",
    status: "completed" as const,
    title: "Updated control limits for X-bar chart",
    description: "Recalculated limits based on last 30 subgroups",
    timestamp: new Date("2026-07-26T10:30:00"),
    duration: 120,
  },
  {
    id: "evt-2",
    status: "running" as const,
    title: "Investigate spike in defect rate on Line B",
    description: "Root cause analysis in progress",
    timestamp: new Date("2026-07-26T09:00:00"),
  },
  {
    id: "evt-3",
    status: "pending" as const,
    title: "Schedule calibration for gauge R-42",
    description: "Due by end of week",
    timestamp: new Date("2026-07-25T14:00:00"),
  },
  {
    id: "evt-4",
    status: "warning" as const,
    title: "Process capability index below threshold",
    description: "Cpk dropped to 1.1, investigate assignable causes",
    timestamp: new Date("2026-07-25T11:15:00"),
    duration: 45,
  },
];

// Mock suggestions
const suggestionList = [
  "Review control chart for Out-of-Control signals on Line A",
  "Recalculate sigma level after recent improvements",
  "Monitor operator training effectiveness for new hires",
];

export default function Dashboard() {
  const [selectedLine, setSelectedLine] = useState("all");
  const [dateRange, setDateRange] = useState("last30");

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Six Sigma Control Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Real-time process performance monitoring
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Activity className="size-3" />
          {kpiData.trend === "improving" ? (
            <TrendingUp className="size-3 text-green-500" />
          ) : (
            <TrendingDown className="size-3 text-red-500" />
          )}
          {kpiData.trend === "improving" ? "Improving" : "Declining"}
        </Badge>
      </div>

      {/* Controls / Filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="line-select">Production Line</Label>
          <Select value={selectedLine} onValueChange={setSelectedLine}>
            <SelectTrigger id="line-select">
              <SelectValue placeholder="Select line" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Lines</SelectItem>
              <SelectItem value="A">Line A</SelectItem>
              <SelectItem value="B">Line B</SelectItem>
              <SelectItem value="C">Line C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="date-range">Date Range</Label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger id="date-range">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
              <SelectItem value="last90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button className="w-full">Apply Filters</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Defects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.totalDefects}</div>
            <p className="text-xs text-muted-foreground">+12% vs previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">DPM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.dpm}</div>
            <p className="text-xs text-muted-foreground">Defects per million</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sigma Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.sigma}</div>
            <p className="text-xs text-muted-foreground">±1.5σ shift</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Yield</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpiData.yield}%</div>
            <p className="text-xs text-muted-foreground">First‑pass yield</p>
          </CardContent>
        </Card>
      </div>

      {/* Main content: Chart and Suggestions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Control Chart</CardTitle>
            <CardDescription>X‑bar & R chart for selected line</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
            <p className="text-muted-foreground text-sm">
              Chart visualization (e.g., recharts) goes here
            </p>
          </CardContent>
        </Card>

        {/* AI Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">AI Suggestions</CardTitle>
            <CardDescription>Actionable insights from process data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Suggestions className="flex flex-col items-stretch gap-2">
              {suggestionList.map((suggestion, index) => (
                <Suggestion
                  key={index}
                  suggestion={suggestion}
                  className="w-full justify-start rounded-md px-3 py-2 text-left text-sm"
                  variant="outline"
                  onClick={(s) => alert(`Selected: ${s}`)}
                />
              ))}
            </Suggestions>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Process events and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline>
            {timelineEvents.length === 0 ? (
              <TimelineEmptyState
                title="No events"
                description="No activity recorded in this period"
              />
            ) : (
              timelineEvents.map((event, index) => (
                <TimelineEventItem
                  key={event.id}
                  event={event}
                  showTimestamp
                  showDuration
                  isLast={index === timelineEvents.length - 1}
                />
              ))
            )}
          </Timeline>
        </CardContent>
      </Card>
    </div>
  );
}