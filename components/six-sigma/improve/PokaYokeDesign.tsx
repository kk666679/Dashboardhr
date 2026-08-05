"use client";

import { useState } from "react";
import {
  Agent,
  AgentHeader,
  AgentStatusDot,
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, Plus, Trash2, CheckCircle, XCircle } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface ErrorMode {
  id: string;
  description: string;
  potentialCause: string;
  countermeasure: string;
  status: "pending" | "implemented" | "validated";
  effectiveness: number; // 1-5
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const initialErrorModes: ErrorMode[] = [
  {
    id: "e1",
    description: "Operator installs part backwards",
    potentialCause: "Lack of visual orientation marking",
    countermeasure: "Add asymmetric locating pin (poka-yoke)",
    status: "implemented",
    effectiveness: 4,
  },
  {
    id: "e2",
    description: "Wrong fastener torque applied",
    potentialCause: "Different torque specs per model",
    countermeasure: "Use torque‑limited wrench with color coding",
    status: "pending",
    effectiveness: 3,
  },
  {
    id: "e3",
    description: "Missing seal in assembly",
    potentialCause: "Seal not picked from kit",
    countermeasure: "Weight sensor at kit station to detect missing seal",
    status: "pending",
    effectiveness: 5,
  },
  {
    id: "e4",
    description: "Incorrect sensor calibration value",
    potentialCause: "Manual data entry",
    countermeasure: "Barcode scanner auto‑loads calibration profile",
    status: "validated",
    effectiveness: 5,
  },
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function PokaYokeDesign() {
  const [errorModes, setErrorModes] = useState<ErrorMode[]>(initialErrorModes);
  const [newDescription, setNewDescription] = useState("");
  const [newCause, setNewCause] = useState("");
  const [newCountermeasure, setNewCountermeasure] = useState("");
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");

  // Add new error mode
  const addErrorMode = () => {
    if (!newDescription.trim() || !newCause.trim() || !newCountermeasure.trim()) return;
    const newMode: ErrorMode = {
      id: `e${errorModes.length + 1}`,
      description: newDescription,
      potentialCause: newCause,
      countermeasure: newCountermeasure,
      status: "pending",
      effectiveness: 3,
    };
    setErrorModes([...errorModes, newMode]);
    setNewDescription("");
    setNewCause("");
    setNewCountermeasure("");
  };

  // Remove error mode
  const removeErrorMode = (id: string) => {
    setErrorModes((prev) => prev.filter((e) => e.id !== id));
  };

  // Toggle status (cycle: pending -> implemented -> validated -> pending)
  const toggleStatus = (id: string) => {
    setErrorModes((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const nextStatus: Record<ErrorMode["status"], ErrorMode["status"]> = {
          pending: "implemented",
          implemented: "validated",
          validated: "pending",
        };
        return { ...e, status: nextStatus[e.status] };
      })
    );
  };

  // Update effectiveness
  const updateEffectiveness = (id: string, value: number) => {
    setErrorModes((prev) =>
      prev.map((e) => (e.id === id ? { ...e, effectiveness: value } : e))
    );
  };

  // AI analysis simulation
  const runAnalysis = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      // In a real app, you'd compute something here
    }, 1500);
  };

  // Suggestions based on statuses
  const suggestions = [
    errorModes.some((e) => e.status === "pending")
      ? "⚠️ There are pending countermeasures – prioritize implementation."
      : "✅ All countermeasures are implemented or validated.",
    errorModes.filter((e) => e.effectiveness < 4).length > 0
      ? "Some countermeasures have low effectiveness – consider redesign."
      : "All countermeasures have high effectiveness.",
  ];

  // Counts
  const total = errorModes.length;
  const implemented = errorModes.filter((e) => e.status === "implemented" || e.status === "validated").length;

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Poka‑Yoke Design</h2>
        <p className="text-sm text-muted-foreground">
          Identify potential errors and design mistake‑proofing countermeasures.
        </p>
      </div>

      {/* Agent */}
      <Agent>
        <AgentHeader
          name="Poka‑Yoke Analyst"
          model="mistake-proof-v1"
          status={agentStatus}
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status={agentStatus} />
              {agentStatus === "idle" && "Ready"}
              {agentStatus === "thinking" && "Analyzing..."}
              {agentStatus === "done" && "Done"}
            </span>
          }
        />
      </Agent>

      {/* Reasoning */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Design Process</CardTitle>
          <CardDescription>Systematic approach to error‑proofing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Reasoning>
            <ReasoningTrigger />
            <ReasoningContent>Identify potential failure modes (error modes). Determine root cause of each error. Brainstorm countermeasures (poka‑yoke devices). Assess effectiveness and implement. Validate through testing.</ReasoningContent>
          </Reasoning>
        </CardContent>
      </Card>

      {/* Artifact: Checklist */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-muted-foreground" />
            <ArtifactTitle>Poka‑Yoke Checklist</ArtifactTitle>
            <Badge variant="outline">
              {implemented}/{total} implemented
            </Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Run AI analysis" label="Analyze" onClick={runAnalysis} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
          List of error modes, causes, and countermeasures with status.
        </ArtifactDescription>
        <ArtifactContent>
          <div className="space-y-4">
            {/* Add new form */}
            <div className="grid gap-2 sm:grid-cols-4">
              <Input
                placeholder="Error description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="Potential cause"
                value={newCause}
                onChange={(e) => setNewCause(e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                placeholder="Countermeasure"
                value={newCountermeasure}
                onChange={(e) => setNewCountermeasure(e.target.value)}
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={addErrorMode} className="gap-1">
                <Plus className="size-3" /> Add
              </Button>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Error Mode</TableHead>
                  <TableHead>Cause</TableHead>
                  <TableHead>Countermeasure</TableHead>
                  <TableHead className="text-center">Effectiveness</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorModes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No error modes defined. Add one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  errorModes.map((mode) => (
                    <TableRow key={mode.id}>
                      <TableCell>{mode.description}</TableCell>
                      <TableCell>{mode.potentialCause}</TableCell>
                      <TableCell>{mode.countermeasure}</TableCell>
                      <TableCell className="text-center">
                        <Select
                          value={mode.effectiveness.toString()}
                          onValueChange={(v) =>
                            updateEffectiveness(mode.id, parseInt(v))
                          }
                        >
                          <SelectTrigger className="h-7 w-16 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map((n) => (
                              <SelectItem key={n} value={n.toString()}>
                                {n}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            mode.status === "pending"
                              ? "secondary"
                              : mode.status === "implemented"
                              ? "default"
                              : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleStatus(mode.id)}
                        >
                          {mode.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="size-6"
                          onClick={() => removeErrorMode(mode.id)}
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </ArtifactContent>
      </Artifact>

      {/* Suggestions */}
      <Suggestions>
        {suggestions.map((s, i) => (
          <Suggestion key={i} suggestion={s} variant="outline" className="text-xs" />
        ))}
      </Suggestions>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Poka‑Yoke Handbook" href="/dashboard/documents/repository" />
          <Source title="FMEA Template v2" href="/dashboard/documents/templates" />
        </SourcesContent>
      </Sources>
    </div>
  );
}