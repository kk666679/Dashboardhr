"use client";

import { useState, useMemo } from "react";
import {
  Controls,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// -----------------------------------------------------------------------------
// Types & Mock Data Generation
// -----------------------------------------------------------------------------
interface DataPoint {
  date: string;
  value: number;
}

type DateRange = "7d" | "30d" | "90d";

const generateMockData = (days: number): DataPoint[] => {
  const data: DataPoint[] = [];
  const now = new Date();
  let value = 10; // baseline mean
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    // Random walk with slight drift and noise
    const change = (Math.random() - 0.5) * 0.6;
    value = Math.max(8, Math.min(12, value + change));
    // Add occasional outliers
    if (i === 12) value = 13.5;
    if (i === 25) value = 7.8;
    data.push({
      date: date.toISOString().slice(0, 10),
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function BaselineChart() {
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const data = useMemo(() => {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    return generateMockData(days);
  }, [dateRange]);

  // Compute statistics
  const mean = useMemo(() => {
    const sum = data.reduce((acc, d) => acc + d.value, 0);
    return sum / data.length;
  }, [data]);

  const stdDev = useMemo(() => {
    const squaredDiffs = data.reduce((acc, d) => acc + (d.value - mean) ** 2, 0);
    return Math.sqrt(squaredDiffs / data.length);
  }, [data, mean]);

  const ucl = mean + 3 * stdDev;
  const lcl = Math.max(0, mean - 3 * stdDev);

  // Detect trend: simple linear regression slope
  const trend = useMemo(() => {
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((s, d) => s + d.value, 0);
    const sumXY = data.reduce((s, d, i) => s + i * d.value, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * (n * (n + 1) * (2 * n + 1)) / 6 - sumX * sumX);
    return slope;
  }, [data]);

  // Generate suggestions based on data
  const suggestions = useMemo(() => {
    const latest = data[data.length - 1]?.value || 0;
    const earliest = data[0]?.value || 0;
    const shift = latest - earliest;
    let sugg = [];
    if (shift > 0.5) {
      sugg.push(`📈 Upward trend detected (${shift.toFixed(1)} unit increase). Investigate assignable cause.`);
    } else if (shift < -0.5) {
      sugg.push(`📉 Downward trend detected (${Math.abs(shift).toFixed(1)} unit decrease). Improvement may be occurring.`);
    } else {
      sugg.push("Process appears stable with no significant trend.");
    }
    if (latest > ucl) {
      sugg.push(`⚠️ Latest point (${latest}) exceeds UCL (${ucl.toFixed(2)}). Out-of-control signal.`);
    } else if (latest < lcl) {
      sugg.push(`⚠️ Latest point (${latest}) below LCL (${lcl.toFixed(2)}). Out-of-control signal.`);
    } else {
      sugg.push("All points within control limits.");
    }
    return sugg;
  }, [data, ucl, lcl]);

  // ---------------------------------------------------------------------------
  // Render: SVG Chart
  // ---------------------------------------------------------------------------
  const chartWidth = 700;
  const chartHeight = 300;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  const minVal = Math.min(0, ...data.map((d) => d.value), lcl) - 0.5;
  const maxVal = Math.max(...data.map((d) => d.value), ucl) + 0.5;
  const yScale = (v: number) =>
    padding.top + innerHeight - ((v - minVal) / (maxVal - minVal)) * innerHeight;

  const xScale = (i: number) =>
    padding.left + (i / (data.length - 1)) * innerWidth;

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Baseline Process Chart</h2>
        <p className="text-sm text-muted-foreground">
          Monitor process performance over time before improvement initiatives.
        </p>
      </div>

      {/* Controls: Date range */}
      <div className="flex items-end gap-4">
        <div className="space-y-1">
          <Label htmlFor="date-range" className="text-sm">
            Time Range
          </Label>
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger id="date-range" className="w-36">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">Mean: {mean.toFixed(2)}</Badge>
          <Badge variant="outline">UCL: {ucl.toFixed(2)}</Badge>
          <Badge variant="outline">LCL: {lcl.toFixed(2)}</Badge>
        </div>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Baseline Data</CardTitle>
          <CardDescription>Process metric over time with ±3σ limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-auto w-full max-w-full"
            >
              {/* Axes */}
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={chartHeight - padding.bottom}
                stroke="#888"
                strokeWidth="1"
              />
              <line
                x1={padding.left}
                y1={chartHeight - padding.bottom}
                x2={chartWidth - padding.right}
                y2={chartHeight - padding.bottom}
                stroke="#888"
                strokeWidth="1"
              />

              {/* Grid lines for Y axis */}
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
                const y = padding.top + (1 - tick) * innerHeight;
                const val = minVal + tick * (maxVal - minVal);
                return (
                  <g key={tick}>
                    <line
                      x1={padding.left}
                      y1={y}
                      x2={chartWidth - padding.right}
                      y2={y}
                      stroke="#e5e7eb"
                      strokeWidth="0.5"
                      strokeDasharray="4"
                    />
                    <text
                      x={padding.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10"
                      fill="#888"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Mean line */}
              <line
                x1={padding.left}
                y1={yScale(mean)}
                x2={chartWidth - padding.right}
                y2={yScale(mean)}
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="6"
              />
              <text
                x={chartWidth - padding.right + 4}
                y={yScale(mean) + 4}
                fontSize="10"
                fill="#3b82f6"
              >
                Mean
              </text>

              {/* UCL / LCL lines */}
              <line
                x1={padding.left}
                y1={yScale(ucl)}
                x2={chartWidth - padding.right}
                y2={yScale(ucl)}
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x={chartWidth - padding.right + 4}
                y={yScale(ucl) + 4}
                fontSize="10"
                fill="#ef4444"
              >
                UCL
              </text>
              <line
                x1={padding.left}
                y1={yScale(lcl)}
                x2={chartWidth - padding.right}
                y2={yScale(lcl)}
                stroke="#ef4444"
                strokeWidth="1"
                strokeDasharray="4"
              />
              <text
                x={chartWidth - padding.right + 4}
                y={yScale(lcl) + 4}
                fontSize="10"
                fill="#ef4444"
              >
                LCL
              </text>

              {/* Data points and line */}
              <polyline
                points={data
                  .map((d, i) => `${xScale(i)},${yScale(d.value)}`)
                  .join(" ")}
                fill="none"
                stroke="#00d4ff"
                strokeWidth="2"
              />
              {data.map((d, i) => {
                const isOut = d.value > ucl || d.value < lcl;
                return (
                  <circle
                    key={i}
                    cx={xScale(i)}
                    cy={yScale(d.value)}
                    r="4"
                    fill={isOut ? "#ef4444" : "#00d4ff"}
                    stroke="white"
                    strokeWidth="1"
                  />
                );
              })}

              {/* X-axis labels (every 7th day) */}
              {data.map((d, i) => {
                if (i % Math.max(1, Math.floor(data.length / 10)) === 0 || i === data.length - 1) {
                  return (
                    <text
                      key={i}
                      x={xScale(i)}
                      y={chartHeight - padding.bottom + 14}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#888"
                    >
                      {d.date.slice(5)} {/* MM-DD */}
                    </text>
                  );
                }
                return null;
              })}
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI Insights</CardTitle>
          <CardDescription>Based on baseline analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Suggestions>
            {suggestions.map((s, i) => (
              <Suggestion key={i} suggestion={s} variant="outline" className="text-xs" />
            ))}
          </Suggestions>
        </CardContent>
      </Card>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Historical Process Data" href="/dashboard/reports/workforce" />
          <Source title="Baseline Report – Q2 2026" href="/dashboard/reports/compliance" />
        </SourcesContent>
      </Sources>
    </div>
  );
}