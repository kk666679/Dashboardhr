"use client";

import { useState } from "react";
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanContent,
  PlanTrigger,
  PlanAction,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Trash2,
  Beaker,
  BarChart3,
  Download,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface Factor {
  id: string;
  name: string;
  low: number;
  high: number;
}

interface Experiment {
  id: number;
  factors: Record<string, number>; // factor id -> level (-1 or +1)
  response: number;
}

interface DOEStats {
  mainEffects: Record<string, number>;
  interactions: Record<string, number>;
  rSquared: number;
  pValue: number;
  significant: boolean;
}

// -----------------------------------------------------------------------------
// Initial Mock Data
// -----------------------------------------------------------------------------
const initialFactors: Factor[] = [
  { id: "A", name: "Temperature", low: 150, high: 200 },
  { id: "B", name: "Pressure", low: 50, high: 80 },
  { id: "C", name: "Speed", low: 100, high: 150 },
];

// Generate a full factorial 2^k design (k=3 -> 8 runs)
const generateFullFactorial = (factors: Factor[]): Experiment[] => {
  const k = factors.length;
  const runs = Math.pow(2, k);
  const experiments: Experiment[] = [];
  for (let i = 0; i < runs; i++) {
    const factorLevels: Record<string, number> = {};
    factors.forEach((f, idx) => {
      const bit = (i >> (k - 1 - idx)) & 1;
      factorLevels[f.id] = bit === 0 ? -1 : 1;
    });
    // Mock response: y = 50 + 10*A + 5*B - 8*C + 3*A*B + noise
    const A = factorLevels["A"] || 0;
    const B = factorLevels["B"] || 0;
    const C = factorLevels["C"] || 0;
    const noise = (Math.random() - 0.5) * 2;
    const response = 50 + 10 * A + 5 * B - 8 * C + 3 * A * B + noise;
    experiments.push({
      id: i + 1,
      factors: factorLevels,
      response: Math.round(response * 100) / 100,
    });
  }
  return experiments;
};

// Compute DOE statistics (simplified)
const computeStats = (experiments: Experiment[], factors: Factor[]): DOEStats => {
  // Main effects: average difference between high and low
  const mainEffects: Record<string, number> = {};
  factors.forEach((f) => {
    const high = experiments.filter((e) => e.factors[f.id] === 1);
    const low = experiments.filter((e) => e.factors[f.id] === -1);
    const avgHigh = high.reduce((s, e) => s + e.response, 0) / high.length;
    const avgLow = low.reduce((s, e) => s + e.response, 0) / low.length;
    mainEffects[f.id] = avgHigh - avgLow;
  });

  // Simple pseudo R² (based on main effects only, for demo)
  const totalMean = experiments.reduce((s, e) => s + e.response, 0) / experiments.length;
  const totalSS = experiments.reduce((s, e) => s + (e.response - totalMean) ** 2, 0);
  const explainedSS = Object.values(mainEffects).reduce((s, v) => s + v * v, 0);
  const rSquared = Math.min(1, explainedSS / totalSS);

  // Mock p-value (not really computed)
  const pValue = 0.03;
  const significant = pValue < 0.05;

  // Interactions: just a placeholder
  const interactions: Record<string, number> = {};
  for (let i = 0; i < factors.length; i++) {
    for (let j = i + 1; j < factors.length; j++) {
      const key = `${factors[i].id}*${factors[j].id}`;
      const highHigh = experiments.filter(
        (e) => e.factors[factors[i].id] === 1 && e.factors[factors[j].id] === 1
      );
      const lowLow = experiments.filter(
        (e) => e.factors[factors[i].id] === -1 && e.factors[factors[j].id] === -1
      );
      const highLow = experiments.filter(
        (e) => e.factors[factors[i].id] === 1 && e.factors[factors[j].id] === -1
      );
      const lowHigh = experiments.filter(
        (e) => e.factors[factors[i].id] === -1 && e.factors[factors[j].id] === 1
      );
      const avgHH = highHigh.reduce((s, e) => s + e.response, 0) / (highHigh.length || 1);
      const avgLL = lowLow.reduce((s, e) => s + e.response, 0) / (lowLow.length || 1);
      const avgHL = highLow.reduce((s, e) => s + e.response, 0) / (highLow.length || 1);
      const avgLH = lowHigh.reduce((s, e) => s + e.response, 0) / (lowHigh.length || 1);
      interactions[key] = (avgHH + avgLL - avgHL - avgLH) / 2;
    }
  }
  return { mainEffects, interactions, rSquared, pValue, significant };
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function DOE() {
  const [factors, setFactors] = useState<Factor[]>(initialFactors);
  const [replicates, setReplicates] = useState(1);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [stats, setStats] = useState<DOEStats | null>(null);
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done" | "error">("idle");
  const [suggestions, setSuggestions] = useState<string[]>([
    "Define factors and run design to see main effects.",
  ]);
  const [activeTab, setActiveTab] = useState("design");

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const generateDesign = () => {
    if (factors.length === 0) return;
    // For simplicity, we generate a full factorial with replicates
    const baseRuns = generateFullFactorial(factors);
    const allRuns: Experiment[] = [];
    for (let r = 0; r < replicates; r++) {
      baseRuns.forEach((run) => {
        // Add noise variation per replicate
        const noise = (Math.random() - 0.5) * 2;
        allRuns.push({
          ...run,
          id: allRuns.length + 1,
          response: Math.round((run.response + noise) * 100) / 100,
        });
      });
    }
    setExperiments(allRuns);
    setStats(null);
    setAgentStatus("idle");
    setSuggestions(["Design generated. Click 'Analyze' to compute effects."]);
  };

  const analyzeDOE = () => {
    if (experiments.length === 0) return;
    setAgentStatus("thinking");
    setTimeout(() => {
      const newStats = computeStats(experiments, factors);
      setStats(newStats);
      setAgentStatus("done");
      // Generate suggestions
      const topEffects = Object.entries(newStats.mainEffects)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .slice(0, 2);
      const sugg = [
        `Main effects: ${topEffects.map(([id, val]) => `${id} (${val.toFixed(2)})`).join(", ")}`,
        newStats.significant
          ? "Model is statistically significant (p < 0.05)."
          : "Model not significant; consider adding more factors or reducing noise.",
        `R² = ${(newStats.rSquared * 100).toFixed(1)}% of variation explained.`,
      ];
      setSuggestions(sugg);
    }, 1500);
  };

  // Update factor level
  const updateFactor = (id: string, field: keyof Factor, value: string | number) => {
    setFactors((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const addFactor = () => {
    const newId = String.fromCharCode(65 + factors.length); // A, B, C, ...
    setFactors((prev) => [
      ...prev,
      { id: newId, name: `Factor ${newId}`, low: 0, high: 1 },
    ]);
  };

  const removeFactor = (id: string) => {
    setFactors((prev) => prev.filter((f) => f.id !== id));
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Design of Experiments (DOE)</h2>
        <p className="text-sm text-muted-foreground">
          Plan, run, and analyze factorial experiments.
        </p>
      </div>

      {/* Plan Component */}
      <Plan defaultOpen>
        <PlanHeader>
          <div>
            <PlanTitle>DOE Workflow</PlanTitle>
            <PlanDescription>Follow these steps to complete your DOE.</PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">1</Badge>
            <span>Define factors and levels</span>
            {factors.length > 0 && <CheckCircle className="size-4 text-green-500" />}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">2</Badge>
            <span>Set replicates and generate design</span>
            {experiments.length > 0 && <CheckCircle className="size-4 text-green-500" />}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline">3</Badge>
            <span>Run experiments (simulated) and analyze</span>
            {stats && <CheckCircle className="size-4 text-green-500" />}
          </div>
        </PlanContent>
      </Plan>

      {/* Controls: Factors and Replicates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Design Factors</span>
            <Button size="sm" variant="outline" onClick={addFactor}>
              <Plus className="mr-1 size-3" /> Add Factor
            </Button>
          </CardTitle>
          <CardDescription>Set low and high levels for each factor.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {factors.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground">
              No factors defined. Add factors to create a design.
            </div>
          ) : (
            <div className="space-y-2">
              {factors.map((factor) => (
                <div key={factor.id} className="flex items-center gap-2">
                  <span className="w-8 font-mono text-sm font-medium">{factor.id}</span>
                  <Input
                    placeholder="Name"
                    value={factor.name}
                    onChange={(e) => updateFactor(factor.id, "name", e.target.value)}
                    className="h-8 flex-1 text-sm"
                  />
                  <Label className="text-xs">Low</Label>
                  <Input
                    type="number"
                    value={factor.low}
                    onChange={(e) => updateFactor(factor.id, "low", parseFloat(e.target.value))}
                    className="h-8 w-16 text-sm"
                  />
                  <Label className="text-xs">High</Label>
                  <Input
                    type="number"
                    value={factor.high}
                    onChange={(e) => updateFactor(factor.id, "high", parseFloat(e.target.value))}
                    className="h-8 w-16 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7"
                    onClick={() => removeFactor(factor.id)}
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="replicates" className="text-xs">
                Replicates
              </Label>
              <Input
                id="replicates"
                type="number"
                min={1}
                max={5}
                value={replicates}
                onChange={(e) => setReplicates(parseInt(e.target.value) || 1)}
                className="h-8 w-20 text-sm"
              />
            </div>
            <Button onClick={generateDesign} className="gap-1">
              <Beaker className="size-4" /> Generate Design
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Agent and Artifact */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="design">Design Matrix</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="design">
          <Artifact>
            <ArtifactHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="size-4 text-muted-foreground" />
                <ArtifactTitle>Design Matrix</ArtifactTitle>
                <Badge variant="outline">
                  {experiments.length} runs
                </Badge>
              </div>
              <ArtifactActions>
                <ArtifactAction tooltip="Export CSV" label="Export" icon={Download} />
                <ArtifactClose />
              </ArtifactActions>
            </ArtifactHeader>
            <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
              Full factorial design with replicates. Run experiments and enter responses.
            </ArtifactDescription>
            <ArtifactContent>
              {experiments.length === 0 ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  Generate a design to see the matrix.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Run</TableHead>
                        {factors.map((f) => (
                          <TableHead key={f.id} className="text-center">
                            {f.name}
                          </TableHead>
                        ))}
                        <TableHead className="text-center">Response</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {experiments.map((exp) => (
                        <TableRow key={exp.id}>
                          <TableCell className="font-mono text-xs">{exp.id}</TableCell>
                          {factors.map((f) => (
                            <TableCell key={f.id} className="text-center font-mono text-xs">
                              {exp.factors[f.id] === 1 ? "+" : "-"}
                            </TableCell>
                          ))}
                          <TableCell className="text-center font-mono">
                            <Input
                              type="number"
                              step="0.1"
                              value={exp.response}
                              onChange={(e) => {
                                const newVal = parseFloat(e.target.value) || 0;
                                setExperiments((prev) =>
                                  prev.map((e) =>
                                    e.id === exp.id ? { ...e, response: newVal } : e
                                  )
                                );
                              }}
                              className="h-7 w-20 text-center text-sm"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {experiments.length > 0 && (
                <div className="mt-2 flex justify-end">
                  <Button size="sm" onClick={analyzeDOE} className="gap-1">
                    <TrendingUp className="size-4" /> Analyze
                  </Button>
                </div>
              )}
            </ArtifactContent>
          </Artifact>
        </TabsContent>

        <TabsContent value="analysis">
          <Artifact>
            <ArtifactHeader>
              <div className="flex items-center gap-2">
                <Beaker className="size-4 text-muted-foreground" />
                <ArtifactTitle>DOE Analysis</ArtifactTitle>
                <Badge variant={stats?.significant ? "default" : "outline"}>
                  {stats?.significant ? "Significant" : "Not Significant"}
                </Badge>
              </div>
              <ArtifactActions>
                <ArtifactAction tooltip="Refresh" label="Refresh" icon={RefreshCw} />
                <ArtifactClose />
              </ArtifactActions>
            </ArtifactHeader>
            <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
              Main effects, interactions, and model fit.
            </ArtifactDescription>
            <ArtifactContent>
              {!stats ? (
                <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                  Run the analysis to see results.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">R²</div>
                      <div className="text-lg font-bold">
                        {(stats.rSquared * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">p‑value</div>
                      <div className="text-lg font-bold">
                        {stats.pValue.toFixed(3)}
                      </div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">Main Effects</div>
                      <div className="text-lg font-bold">
                        {Object.keys(stats.mainEffects).length}
                      </div>
                    </div>
                    <div className="rounded-lg border p-2 text-center">
                      <div className="text-xs text-muted-foreground">Interactions</div>
                      <div className="text-lg font-bold">
                        {Object.keys(stats.interactions).length}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Main Effects</h4>
                    <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {Object.entries(stats.mainEffects).map(([id, val]) => (
                        <div
                          key={id}
                          className="rounded-lg border p-2 text-center text-sm"
                        >
                          <span className="font-medium">{id}</span>
                          <span
                            className={`ml-2 font-mono ${
                              val > 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {val.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium">Interactions</h4>
                    <div className="mt-1 grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {Object.entries(stats.interactions).map(([key, val]) => (
                        <div
                          key={key}
                          className="rounded-lg border p-2 text-center text-sm"
                        >
                          <span className="font-medium">{key}</span>
                          <span
                            className={`ml-2 font-mono ${
                              val > 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {val.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </ArtifactContent>
          </Artifact>
        </TabsContent>
      </Tabs>

      {/* Agent Status */}
      <Agent>
        <AgentHeader
          name="DOE Analysis Agent"
          model="factorial-v1"
          status={agentStatus}
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status={agentStatus} />{" "}
              {agentStatus === "idle" && "Ready"}
              {agentStatus === "thinking" && "Analyzing..."}
              {agentStatus === "done" && "Done"}
              {agentStatus === "error" && "Error"}
            </span>
          }
        />
        {agentStatus === "done" && (
          <AgentContent>
            <Suggestions>
              {suggestions.map((s, i) => (
                <Suggestion key={i} suggestion={s} variant="outline" className="text-xs" />
              ))}
            </Suggestions>
          </AgentContent>
        )}
      </Agent>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="DOE Methodology Handbook" href="/dashboard/documents/repository" />
          <Source title="Factorial Design Template" href="/dashboard/documents/templates" />
        </SourcesContent>
      </Sources>
    </div>
  );
}