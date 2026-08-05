"use client";

import { useState } from "react";
import {
  Agent,
  AgentHeader,
  AgentStatusDot,
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, RefreshCw, BarChart3 } from "lucide-react";

// -----------------------------------------------------------------------------
// Types & Mock Data
// -----------------------------------------------------------------------------
interface ParetoItem {
  category: string;
  count: number;
  percentage?: number;
  cumulativePercentage?: number;
}

const rawData: ParetoItem[] = [
  { category: "Material Defects", count: 48 },
  { category: "Assembly Errors", count: 32 },
  { category: "Calibration Issues", count: 18 },
  { category: "Operator Mistakes", count: 12 },
  { category: "Equipment Failure", count: 8 },
  { category: "Other", count: 5 },
];

// Sort descending and compute percentages
const sortedData = [...rawData].sort((a, b) => b.count - a.count);
const total = sortedData.reduce((sum, item) => sum + item.count, 0);
let cumSum = 0;
const computedData = sortedData.map((item) => {
  cumSum += item.count;
  return {
    ...item,
    percentage: (item.count / total) * 100,
    cumulativePercentage: (cumSum / total) * 100,
  };
});

// -----------------------------------------------------------------------------
// Pareto Chart (custom SVG) – renamed to avoid conflict with default export
// -----------------------------------------------------------------------------
interface ParetoChartViewProps {
  data: ParetoItem[];
}

const ParetoChartView = ({ data }: ParetoChartViewProps) => {
  const chartWidth = 600;
  const chartHeight = 300;
  const padding = { top: 20, right: 40, bottom: 40, left: 40 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const maxCount = Math.max(...data.map(d => d.count));
  const barWidth = innerWidth / data.length * 0.7;
  const gap = innerWidth / data.length * 0.3;

  return (
    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-w-full">
      {/* Axes */}
      <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight - padding.bottom} stroke="#888" strokeWidth="1" />
      <line x1={padding.left} y1={chartHeight - padding.bottom} x2={chartWidth - padding.right} y2={chartHeight - padding.bottom} stroke="#888" strokeWidth="1" />

      {/* Bars */}
      {data.map((item, index) => {
        const x = padding.left + index * (barWidth + gap);
        const barHeight = (item.count / maxCount) * innerHeight;
        const y = chartHeight - padding.bottom - barHeight;
        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight}
            fill="#3b82f6"
            rx="2"
          />
        );
      })}

      {/* Cumulative percentage line */}
      {data.map((item, index) => {
        const x = padding.left + index * (barWidth + gap) + barWidth / 2;
        const y = chartHeight - padding.bottom - ((item.cumulativePercentage ?? 0) / 100) * innerHeight;
        return (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="4"
            fill="#ef4444"
            stroke="#ef4444"
            strokeWidth="2"
          />
        );
      })}
      {data.map((item, index) => {
        if (index === 0) return null;
        const prevX = padding.left + (index - 1) * (barWidth + gap) + barWidth / 2;
        const prevY = chartHeight - padding.bottom - ((data[index - 1].cumulativePercentage ?? 0) / 100) * innerHeight;
        const currX = padding.left + index * (barWidth + gap) + barWidth / 2;
        const currY = chartHeight - padding.bottom - ((item.cumulativePercentage ?? 0) / 100) * innerHeight;
        return (
          <line
            key={index}
            x1={prevX}
            y1={prevY}
            x2={currX}
            y2={currY}
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="4"
          />
        );
      })}

      {/* Labels on X axis (categories) */}
      {data.map((item, index) => {
        const x = padding.left + index * (barWidth + gap) + barWidth / 2;
        return (
          <text
            key={index}
            x={x}
            y={chartHeight - padding.bottom + 16}
            textAnchor="middle"
            fontSize="10"
            fill="#888"
            transform={`rotate(-15, ${x}, ${chartHeight - padding.bottom + 16})`}
          >
            {item.category}
          </text>
        );
      })}

      {/* Y axis labels (counts) */}
      <text x={padding.left - 8} y={padding.top} textAnchor="end" fontSize="10" fill="#888">
        {maxCount}
      </text>
      <text x={padding.left - 8} y={chartHeight - padding.bottom} textAnchor="end" fontSize="10" fill="#888">
        0
      </text>

      {/* Right side percentage axis labels (cumulative) */}
      <text x={chartWidth - padding.right + 4} y={padding.top} textAnchor="start" fontSize="10" fill="#888">
        100%
      </text>
      <text x={chartWidth - padding.right + 4} y={chartHeight - padding.bottom} textAnchor="start" fontSize="10" fill="#888">
        0%
      </text>
    </svg>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function ParetoChart() {
  const [data] = useState(computedData);

  // Identify top 3 causes (80% rule)
  const topCauses = data.filter(item => item.cumulativePercentage <= 80);
  const suggestionText = topCauses.length > 0
    ? `Focus on top ${topCauses.length} causes accounting for 80% of defects`
    : "Analyze top causes for process improvement";

  return (
    <div className="space-y-4 p-4">
      {/* Agent Section */}
      <Agent>
        <AgentHeader
          name="Pareto Analysis Agent"
          model="pareto-v1"
          status="done"
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status="done" /> Complete
            </span>
          }
        />
      </Agent>

      {/* Artifact: Pareto Chart */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="size-4 text-muted-foreground" />
            <ArtifactTitle>Pareto Chart – Defect Analysis</ArtifactTitle>
            <Badge variant="outline">80/20 rule</Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Refresh" label="Refresh" icon={RefreshCw} />
            <ArtifactAction tooltip="Download as PNG" label="Download" icon={Download} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
          Defect frequency per category, with cumulative percentage overlay.
        </ArtifactDescription>
        <ArtifactContent>
          <div className="overflow-x-auto">
            <ParetoChartView data={data} />
          </div>

          {/* Data Table */}
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                  <TableHead className="text-right">Cumulative %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right font-mono">{item.count}</TableCell>
                    <TableCell className="text-right font-mono">
                      {item.percentage?.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {item.cumulativePercentage?.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ArtifactContent>
      </Artifact>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">AI Suggestions</CardTitle>
          <CardDescription>Actionable insights from Pareto analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Suggestions>
            <Suggestion suggestion={suggestionText} variant="outline" className="text-xs" />
            <Suggestion suggestion="Implement corrective actions for top contributors first" variant="outline" className="text-xs" />
            <Suggestion suggestion="Monitor improvements to verify reduction in defects" variant="outline" className="text-xs" />
          </Suggestions>
        </CardContent>
      </Card>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Defect Log – July 2026" href="/dashboard/reports/compliance" />
          <Source title="Quality Control Reports" href="/dashboard/reports/workforce" />
        </SourcesContent>
      </Sources>
    </div>
  );
}