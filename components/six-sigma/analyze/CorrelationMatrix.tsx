"use client";

import { useState } from "react";
import {
  Agent,
  AgentHeader,
  AgentStatusDot,
  AgentContent,
  Suggestion,
  Suggestions,
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
} from "../../ai-elements";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  RefreshCw,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types & Mock Data
// -----------------------------------------------------------------------------
interface CorrelationMatrix {
  variables: string[];
  data: number[][]; // symmetric matrix, values between -1 and 1
}

// Mock correlation matrix for 5 variables
const mockVariables = ["X1 (Temp)", "X2 (Pressure)", "X3 (Speed)", "X4 (Humidity)", "Y (Defect Rate)"];

const mockCorrelations: number[][] = [
  [1.0, 0.12, -0.05, 0.32, 0.65],  // X1 with others
  [0.12, 1.0, 0.45, -0.22, 0.28], // X2
  [-0.05, 0.45, 1.0, 0.08, -0.34], // X3
  [0.32, -0.22, 0.08, 1.0, 0.55],  // X4
  [0.65, 0.28, -0.34, 0.55, 1.0], // Y (defect rate)
];

// -----------------------------------------------------------------------------
// Helper to get color based on correlation value
// -----------------------------------------------------------------------------
const getCorrelationColor = (value: number): string => {
  const abs = Math.abs(value);
  if (abs < 0.2) return "bg-gray-100 dark:bg-gray-800";
  if (abs < 0.4) return value > 0 ? "bg-blue-200 dark:bg-blue-900" : "bg-red-200 dark:bg-red-900";
  if (abs < 0.6) return value > 0 ? "bg-blue-400 dark:bg-blue-700" : "bg-red-400 dark:bg-red-700";
  if (abs < 0.8) return value > 0 ? "bg-blue-600 dark:bg-blue-500" : "bg-red-600 dark:bg-red-500";
  return value > 0 ? "bg-blue-800 dark:bg-blue-300" : "bg-red-800 dark:bg-red-300";
};

const getTextColor = (value: number): string => {
  const abs = Math.abs(value);
  if (abs > 0.5) return "text-white";
  return "text-foreground";
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function CorrelationMatrix() {
  const [variables] = useState<string[]>(mockVariables);
  const [matrix] = useState<number[][]>(mockCorrelations);
  const [highlightedPair, setHighlightedPair] = useState<[number, number] | null>(null);

  // Find strongest positive and negative correlations (excluding diagonal)
  let maxPos = -Infinity;
  let maxNeg = Infinity;
  let posPair: [number, number] = [0, 0];
  let negPair: [number, number] = [0, 0];

  for (let i = 0; i < matrix.length; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      const val = matrix[i][j];
      if (val > maxPos) {
        maxPos = val;
        posPair = [i, j];
      }
      if (val < maxNeg) {
        maxNeg = val;
        negPair = [i, j];
      }
    }
  }

  const suggestions = [
    `Strong positive correlation: ${variables[posPair[0]]} and ${variables[posPair[1]]} (r = ${maxPos.toFixed(2)})`,
    `Strong negative correlation: ${variables[negPair[0]]} and ${variables[negPair[1]]} (r = ${maxNeg.toFixed(2)})`,
    `Y is most correlated with ${variables[posPair[0]]} (r = ${matrix[matrix.length-1][posPair[0]].toFixed(2)})`,
  ];

  return (
    <div className="space-y-4 p-4">
      {/* Agent Section */}
      <Agent>
        <AgentHeader
          name="Correlation Analysis Agent"
          model="pearson-v1"
          status="done"
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status="done" /> Complete
            </span>
          }
        />
      </Agent>

      {/* Artifact: Heatmap */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            <ArtifactTitle>Correlation Heatmap</ArtifactTitle>
            <Badge variant="outline">Pearson</Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Refresh" label="Refresh" icon={RefreshCw} />
            <ArtifactAction tooltip="Download as PNG" label="Download" icon={Download} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
          Pairwise correlations between process variables and defect rate (Y). Strong correlations highlighted.
        </ArtifactDescription>
        <ArtifactContent>
          <div className="overflow-x-auto">
            <Table className="w-full border">
              <TableHeader>
                <TableRow>
                  <TableHead className="bg-muted/50" />
                  {variables.map((v, i) => (
                    <TableHead
                      key={i}
                      className="text-center text-xs font-medium"
                      style={{ minWidth: "80px" }}
                    >
                      {v}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="bg-muted/50 font-medium text-xs">
                      {variables[i]}
                    </TableCell>
                    {row.map((val, j) => {
                      const isDiagonal = i === j;
                      const isHighlighted =
                        highlightedPair &&
                        ((highlightedPair[0] === i && highlightedPair[1] === j) ||
                          (highlightedPair[0] === j && highlightedPair[1] === i));
                      return (
                        <TableCell
                          key={j}
                          className={`text-center text-xs font-mono transition-colors ${
                            isDiagonal ? "bg-muted/30" : "cursor-pointer hover:opacity-80"
                          } ${getCorrelationColor(val)} ${getTextColor(val)} ${
                            isHighlighted ? "ring-2 ring-primary ring-inset" : ""
                          }`}
                          onMouseEnter={() => {
                            if (!isDiagonal) setHighlightedPair([i, j]);
                          }}
                          onMouseLeave={() => setHighlightedPair(null)}
                        >
                          {val.toFixed(2)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Strong positive</span>
              <div className="flex h-4 w-8 rounded bg-blue-600" />
              <span>Weak positive</span>
              <div className="flex h-4 w-8 rounded bg-blue-200 dark:bg-blue-900" />
              <span>No correlation</span>
              <div className="flex h-4 w-8 rounded bg-gray-100 dark:bg-gray-800" />
              <span>Weak negative</span>
              <div className="flex h-4 w-8 rounded bg-red-200 dark:bg-red-900" />
              <span>Strong negative</span>
              <div className="flex h-4 w-8 rounded bg-red-600" />
            </div>
            <span>Hover over a cell to highlight the pair</span>
          </div>
        </ArtifactContent>
      </Artifact>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">AI Insights</CardTitle>
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
          <Source title="Process Data – July 2026" href="/dashboard/reports/workforce" />
          <Source title="Correlation Analysis Methodology" href="/dashboard/documents/repository" />
        </SourcesContent>
      </Sources>
    </div>
  );
}