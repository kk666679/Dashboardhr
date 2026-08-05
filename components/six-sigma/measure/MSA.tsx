"use client";

import { useState } from "react";
import {
  Agent,
  AgentHeader,
  AgentStatusDot,
  AgentContent,
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, BarChart3 } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface MSAResult {
  source: string;
  variance: number;
  percentContribution: number;
  percentStudyVar: number;
}

interface MSAStats {
  totalVariance: number;
  grr: number; // %GRR
  ndc: number; // number of distinct categories
  repeatability: number;
  reproducibility: number;
  partToPart: number;
  results: MSAResult[];
  interpretation: string;
}

// -----------------------------------------------------------------------------
// Mock MSA Data Generator
// -----------------------------------------------------------------------------
const generateMSAData = (): MSAStats => {
  // Simulate typical Gauge R&R outputs
  const repeatabilityVar = 0.8 + Math.random() * 0.4;
  const reproducibilityVar = 0.5 + Math.random() * 0.3;
  const partToPartVar = 5.0 + Math.random() * 2.0;
  const totalVar = repeatabilityVar + reproducibilityVar + partToPartVar;
  const grr = ((repeatabilityVar + reproducibilityVar) / totalVar) * 100;
  const ndc = Math.round(1.41 * (partToPartVar / (repeatabilityVar + reproducibilityVar)));

  const results: MSAResult[] = [
    {
      source: "Repeatability (Equipment)",
      variance: repeatabilityVar,
      percentContribution: (repeatabilityVar / totalVar) * 100,
      percentStudyVar: (Math.sqrt(repeatabilityVar) / Math.sqrt(totalVar)) * 100,
    },
    {
      source: "Reproducibility (Operators)",
      variance: reproducibilityVar,
      percentContribution: (reproducibilityVar / totalVar) * 100,
      percentStudyVar: (Math.sqrt(reproducibilityVar) / Math.sqrt(totalVar)) * 100,
    },
    {
      source: "Part-to-Part",
      variance: partToPartVar,
      percentContribution: (partToPartVar / totalVar) * 100,
      percentStudyVar: (Math.sqrt(partToPartVar) / Math.sqrt(totalVar)) * 100,
    },
    {
      source: "Total Variation",
      variance: totalVar,
      percentContribution: 100,
      percentStudyVar: 100,
    },
  ];

  let interpretation = "";
  if (grr < 10) {
    interpretation = "Excellent measurement system (GRR < 10%). System is capable.";
  } else if (grr < 20) {
    interpretation = "Acceptable measurement system (GRR < 20%). May be acceptable for some applications.";
  } else if (grr < 30) {
    interpretation = "Marginal measurement system (GRR 20-30%). Improvement may be needed.";
  } else {
    interpretation =
      "Unacceptable measurement system (GRR > 30%). Significant improvement required.";
  }

  return {
    totalVariance: totalVar,
    grr,
    ndc,
    repeatability: repeatabilityVar,
    reproducibility: reproducibilityVar,
    partToPart: partToPartVar,
    results,
    interpretation,
  };
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function MSA() {
  const [data, setData] = useState<MSAStats | null>(null);
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");
  const [activeTab, setActiveTab] = useState("results");

  const runAnalysis = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setData(generateMSAData());
      setAgentStatus("done");
    }, 1200);
  };

  const isReady = data !== null;

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Measurement System Analysis (MSA)</h2>
        <p className="text-sm text-muted-foreground">
          Gauge R&R study to assess measurement system capability.
        </p>
      </div>

      {/* Agent */}
      <Agent>
        <AgentHeader
          name="MSA Analyst"
          model="gauge-rr-v1"
          status={agentStatus}
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status={agentStatus} />
              {agentStatus === "idle" && "Ready to analyze"}
              {agentStatus === "thinking" && "Computing..."}
              {agentStatus === "done" && "Analysis complete"}
            </span>
          }
        />
        {agentStatus === "done" && (
          <AgentContent>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={data?.grr && data.grr < 10 ? "default" : "destructive"}>
                %GRR: {data?.grr.toFixed(1)}%
              </Badge>
              <Badge variant="outline">NDC: {data?.ndc}</Badge>
              <Button size="sm" onClick={runAnalysis}>
                <RefreshCw className="mr-1 size-3" /> Re-run
              </Button>
            </div>
          </AgentContent>
        )}
        {agentStatus === "idle" && (
          <AgentContent>
            <Button onClick={runAnalysis} className="gap-1">
              <BarChart3 className="size-4" /> Run Gauge R&R
            </Button>
          </AgentContent>
        )}
      </Agent>

      {/* Reasoning (show only when done) */}
      {agentStatus === "done" && data && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Analysis Steps</CardTitle>
            <CardDescription>AI‑assisted reasoning process.</CardDescription>
          </CardHeader>
          <CardContent>
            <Reasoning>
              <ReasoningTrigger />
              <ReasoningContent>{`1. Perform ANOVA on measurement data. 2. Calculate variance components. 3. Compute %GRR and %Study Variation. 4. Determine Number of Distinct Categories (NDC). 5. Interpretation: ${data.interpretation}`}</ReasoningContent>
            </Reasoning>
          </CardContent>
        </Card>
      )}

      {/* Artifact: MSA Report */}
      {isReady && (
        <Artifact>
          <ArtifactHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-muted-foreground" />
              <ArtifactTitle>MSA Report</ArtifactTitle>
              <Badge variant="outline">Gauge R&R</Badge>
            </div>
            <ArtifactActions>
              <ArtifactAction tooltip="Export CSV" label="Export" icon={Download} />
              <ArtifactClose />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
            Variance component analysis and measurement system evaluation.
          </ArtifactDescription>
          <ArtifactContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="results">Variance Components</TabsTrigger>
                <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
              </TabsList>
              <TabsContent value="results" className="space-y-3">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Variance</TableHead>
                        <TableHead className="text-right">% Contribution</TableHead>
                        <TableHead className="text-right">% Study Variation</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.results.map((row) => (
                        <TableRow key={row.source}>
                          <TableCell className="font-medium">{row.source}</TableCell>
                          <TableCell className="text-right font-mono">
                            {row.variance.toFixed(3)}
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {row.percentContribution.toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {row.percentStudyVar.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span>Total Variation: {data.totalVariance.toFixed(3)}</span>
                  <span>GRR: {data.grr.toFixed(1)}%</span>
                  <span>NDC: {data.ndc}</span>
                  <span>
                    Repeatability: {data.repeatability.toFixed(3)} | Reproducibility:{" "}
                    {data.reproducibility.toFixed(3)}
                  </span>
                </div>
              </TabsContent>
              <TabsContent value="interpretation">
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-4 text-sm">
                    <p className="font-medium">AI Interpretation</p>
                    <p className="mt-1 text-muted-foreground">{data.interpretation}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">%GRR</div>
                      <div className="text-lg font-bold">{data.grr.toFixed(1)}%</div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">NDC</div>
                      <div className="text-lg font-bold">{data.ndc}</div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">% Study Var</div>
                      <div className="text-lg font-bold">
                        {(
                          Math.sqrt(data.totalVariance) /
                          Math.sqrt(data.totalVariance)
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </ArtifactContent>
        </Artifact>
      )}

      {/* Suggestions (only when done) */}
      {isReady && (
        <Suggestions>
          <Suggestion
            suggestion={
              data.grr < 10
                ? "✅ Measurement system is acceptable. Proceed with process monitoring."
                : data.grr < 20
                ? "ℹ️ Measurement system is acceptable for some applications. Consider improvement."
                : "⚠️ Measurement system needs improvement. Investigate operator training or equipment."
            }
            variant="outline"
            className="text-xs"
          />
          <Suggestion
            suggestion={
              data.ndc < 5
                ? "NDC is low; measurement system may not detect process variation. Increase number of distinct categories."
                : "NDC is sufficient for process control."
            }
            variant="outline"
            className="text-xs"
          />
        </Suggestions>
      )}

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="MSA Data – Q2 2026" href="/dashboard/reports/workforce" />
          <Source title="AIAG MSA Reference Manual" href="/dashboard/documents/repository" />
        </SourcesContent>
      </Sources>
    </div>
  );
}