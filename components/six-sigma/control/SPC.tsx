"use client";

import { useState } from "react";
import {
  Agent,
  AgentHeader,
  AgentStatusDot,
  AgentContent,
  AgentMetrics,
  AgentActions,
  AgentAction,
  Suggestion,
  Suggestions,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types & Mock Data
// -----------------------------------------------------------------------------
interface DataPoint {
  sample: number;
  value: number;
  ucl: number;
  lcl: number;
  outOfControl: boolean;
}

const generateMockData = (): DataPoint[] => {
  const data: DataPoint[] = [];
  let value = 10;
  for (let i = 1; i <= 30; i++) {
    // Random walk with occasional shift
    const change = (Math.random() - 0.5) * 0.8;
    value = Math.max(8, Math.min(12, value + change));
    // Occasional out-of-control signal
    if (i === 15) value = 14.5; // spike above UCL
    if (i === 22) value = 7.2; // dip below LCL
    const ucl = 12.5;
    const lcl = 7.5;
    data.push({
      sample: i,
      value: Math.round(value * 100) / 100,
      ucl,
      lcl,
      outOfControl: value > ucl || value < lcl,
    });
  }
  return data;
};

const mockData = generateMockData();
const outOfControlPoints = mockData.filter((d) => d.outOfControl).length;

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function SPC() {
  const [data] = useState<DataPoint[]>(mockData);
  const [selectedMetric, setSelectedMetric] = useState<
    "mean" | "range" | "sigma"
  >("mean");

  // AI suggestions (mock)
  const suggestions = [
    "Out‑of‑control signal at sample 15 – investigate assignable cause",
    "Process mean is trending upward – adjust if necessary",
    "Recent points within limits – process stable",
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Header with Agent */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Statistical Process Control</h2>
        <Agent className="w-auto">
          <AgentHeader
            name="SPC Monitor"
            model="control-chart-v2"
            status="streaming"
            actions={
              <span className="flex items-center gap-1 text-xs">
                <AgentStatusDot status="streaming" /> Monitoring
              </span>
            }
          />
        </Agent>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 readings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Control</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {outOfControlPoints}
            </div>
            <p className="text-xs text-muted-foreground">
              {outOfControlPoints > 0 ? "Investigate" : "All stable"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Process Mean</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                data.reduce((acc, d) => acc + d.value, 0) / data.length
              ).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Target: 10.0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Range (R)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(Math.max(...data.map((d) => d.value)) - Math.min(...data.map((d) => d.value))).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Control limits applied</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Control Chart – X̄</CardTitle>
          <CardDescription>
            X̄ chart with UCL / LCL. Signals in red.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full flex items-center justify-center border-2 border-dashed border-muted-foreground/20 rounded-lg relative">
            {/* Simple SVG representation of control chart */}
            <svg className="w-full h-full" viewBox="0 0 800 200">
              {/* Axes and labels would be complex; we'll just draw points */}
              <line
                x1="20"
                y1="20"
                x2="20"
                y2="180"
                stroke="#888"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="100"
                x2="780"
                y2="100"
                stroke="#666"
                strokeWidth="1"
                strokeDasharray="4"
              />
              {/* UCL & LCL lines */}
              <line
                x1="20"
                y1="40"
                x2="780"
                y2="40"
                stroke="#ff6b6b"
                strokeWidth="1.5"
                strokeDasharray="6"
              />
              <line
                x1="20"
                y1="160"
                x2="780"
                y2="160"
                stroke="#ff6b6b"
                strokeWidth="1.5"
                strokeDasharray="6"
              />
              {/* Data points */}
              {data.map((d, i) => {
                const x = 20 + (i / (data.length - 1)) * 760;
                const y = 180 - ((d.value - 6) / 8) * 160; // scale 6-14 to 20-180
                const isOut = d.outOfControl;
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill={isOut ? "#ff4d4d" : "#00d4ff"}
                    stroke={isOut ? "#ff4d4d" : "none"}
                    strokeWidth="1"
                  />
                );
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Real‑time suggestions from the SPC monitor</CardDescription>
        </CardHeader>
        <CardContent>
          <Suggestions>
            {suggestions.map((s, i) => (
              <Suggestion
                key={i}
                suggestion={s}
                variant="outline"
                className="text-xs"
                onClick={(s) => alert(`You selected: ${s}`)}
              />
            ))}
          </Suggestions>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>Last 10 samples</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sample</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>UCL</TableHead>
                <TableHead>LCL</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(-10).map((d) => (
                <TableRow key={d.sample}>
                  <TableCell>{d.sample}</TableCell>
                  <TableCell>{d.value}</TableCell>
                  <TableCell>{d.ucl}</TableCell>
                  <TableCell>{d.lcl}</TableCell>
                  <TableCell>
                    {d.outOfControl ? (
                      <Badge variant="destructive">Out of Control</Badge>
                    ) : (
                      <Badge variant="secondary">In Control</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
          <CardDescription>Where SPC data is coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <Sources>
            <SourcesTrigger count={2} />
            <SourcesContent>
              <Source
                title="Line B – QA Database"
                href="/dashboard/reports/compliance"
              />
              <Source
                title="Sensor Feed – Press #3"
                href="/dashboard/reports/workforce"
              />
            </SourcesContent>
          </Sources>
        </CardContent>
      </Card>
    </div>
  );
}