"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Shield,
  ChevronDown,
  ChevronRight,
  Target,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Risk {
  id: string;
  name: string;
  description: string;
  category: string;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  mitigations: string[];
  owner: string;
  status: "open" | "mitigated" | "closed";
}

interface RiskAssessmentToolProps {
  risks?: Risk[];
  onRisksChange?: (risks: Risk[]) => void;
  className?: string;
}

const riskCategories = [
  "Operational",
  "Quality",
  "Compliance",
  "Financial",
  "Strategic",
  "Technical",
  "External",
];

const likelihoodLabels = ["Rare", "Unlikely", "Possible", "Likely", "Almost Certain"];
const impactLabels = ["Negligible", "Minor", "Moderate", "Major", "Severe"];

export function RiskAssessmentTool({
  risks: initialRisks,
  onRisksChange,
  className,
}: RiskAssessmentToolProps) {
  const [risks, setRisks] = React.useState<Risk[]>(
    initialRisks || [
      {
        id: "1",
        name: "Process Deviation",
        description: "Risk of deviating from established processes",
        category: "Operational",
        likelihood: 3,
        impact: 4,
        mitigations: ["Regular audits", "Training programs"],
        owner: "Quality Manager",
        status: "open",
      },
      {
        id: "2",
        name: "Documentation Gaps",
        description: "Incomplete or outdated documentation",
        category: "Compliance",
        likelihood: 4,
        impact: 3,
        mitigations: ["Document review schedule", "Version control"],
        owner: "Document Controller",
        status: "mitigated",
      },
      {
        id: "3",
        name: "Supplier Quality Issues",
        description: "Non-conforming materials from suppliers",
        category: "Quality",
        likelihood: 2,
        impact: 5,
        mitigations: ["Supplier audits", "Incoming inspection"],
        owner: "Procurement Manager",
        status: "open",
      },
    ]
  );

  const [expandedRisks, setExpandedRisks] = React.useState<string[]>([]);

  const toggleRisk = (riskId: string) => {
    setExpandedRisks((prev) =>
      prev.includes(riskId) ? prev.filter((r) => r !== riskId) : [...prev, riskId]
    );
  };

  const getRiskScore = (risk: Risk) => risk.likelihood * risk.impact;

  const getRiskLevel = (score: number): { label: string; color: string } => {
    if (score >= 15) return { label: "Critical", color: "text-destructive" };
    if (score >= 10) return { label: "High", color: "text-warning" };
    if (score >= 5) return { label: "Medium", color: "text-chart-3" };
    return { label: "Low", color: "text-success" };
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 15) return "bg-destructive";
    if (score >= 10) return "bg-warning";
    if (score >= 5) return "bg-chart-3";
    return "bg-success";
  };

  const addRisk = () => {
    const newRisk: Risk = {
      id: `${Date.now()}`,
      name: "New Risk",
      description: "Describe the risk",
      category: "Operational",
      likelihood: 3,
      impact: 3,
      mitigations: [],
      owner: "Unassigned",
      status: "open",
    };
    const updatedRisks = [...risks, newRisk];
    setRisks(updatedRisks);
    onRisksChange?.(updatedRisks);
    setExpandedRisks((prev) => [...prev, newRisk.id]);
  };

  const removeRisk = (id: string) => {
    const updatedRisks = risks.filter((risk) => risk.id !== id);
    setRisks(updatedRisks);
    onRisksChange?.(updatedRisks);
  };

  const updateRisk = (id: string, field: keyof Risk, value: unknown) => {
    const updatedRisks = risks.map((risk) =>
      risk.id === id ? { ...risk, [field]: value } : risk
    );
    setRisks(updatedRisks);
    onRisksChange?.(updatedRisks);
  };

  // Calculate statistics
  const totalRisks = risks.length;
  const criticalRisks = risks.filter((r) => getRiskScore(r) >= 15).length;
  const highRisks = risks.filter((r) => getRiskScore(r) >= 10 && getRiskScore(r) < 15).length;
  const mitigatedRisks = risks.filter((r) => r.status === "mitigated").length;
  const avgRiskScore = totalRisks > 0
    ? risks.reduce((sum, r) => sum + getRiskScore(r), 0) / totalRisks
    : 0;

  return (
    <Card className={cn("border-border/50 bg-card/80", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Risk Assessment</CardTitle>
            </div>
            <CardDescription>
              Identify, assess, and mitigate risks to your QMS
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={addRisk}>
            <Plus className="h-4 w-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
            <p className="text-2xl font-bold">{totalRisks}</p>
            <p className="text-xs text-muted-foreground">Total Risks</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-destructive/10 p-3 text-center">
            <p className="text-2xl font-bold text-destructive">{criticalRisks}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-warning/10 p-3 text-center">
            <p className="text-2xl font-bold text-warning">{highRisks}</p>
            <p className="text-xs text-muted-foreground">High</p>
          </div>
          <div className="rounded-lg border border-border/50 bg-success/10 p-3 text-center">
            <p className="text-2xl font-bold text-success">{mitigatedRisks}</p>
            <p className="text-xs text-muted-foreground">Mitigated</p>
          </div>
        </div>

        {/* Average Risk Score */}
        <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Average Risk Score</span>
            <span className={cn("font-bold", getRiskLevel(avgRiskScore).color)}>
              {avgRiskScore.toFixed(1)} / 25
            </span>
          </div>
          <Progress value={(avgRiskScore / 25) * 100} className="h-2" />
        </div>

        {/* Risk Matrix Legend */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-success" />
            <span>Low (1-4)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-chart-3" />
            <span>Medium (5-9)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-warning" />
            <span>High (10-14)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-destructive" />
            <span>Critical (15-25)</span>
          </div>
        </div>

        {/* Risk List */}
        <div className="space-y-2">
          {risks.map((risk) => {
            const score = getRiskScore(risk);
            const level = getRiskLevel(score);

            return (
              <Collapsible
                key={risk.id}
                open={expandedRisks.includes(risk.id)}
                onOpenChange={() => toggleRisk(risk.id)}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      {expandedRisks.includes(risk.id) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <AlertTriangle className={cn("h-4 w-4", level.color)} />
                      <div>
                        <span className="font-medium">{risk.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="outline" className="text-xs">
                            {risk.category}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              risk.status === "mitigated" && "text-success border-success/50",
                              risk.status === "closed" && "text-muted-foreground"
                            )}
                          >
                            {risk.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={cn("font-bold", level.color)}>
                          {score}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {level.label}
                        </div>
                      </div>
                      <div
                        className={cn(
                          "w-3 h-8 rounded",
                          getRiskScoreColor(score)
                        )}
                      />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1 ml-7 p-4 rounded-lg border border-border/30 bg-background/50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground">Risk Name</label>
                          <Input
                            value={risk.name}
                            onChange={(e) => updateRisk(risk.id, "name", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Description</label>
                          <Input
                            value={risk.description}
                            onChange={(e) => updateRisk(risk.id, "description", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Category</label>
                          <Select
                            value={risk.category}
                            onValueChange={(v) => updateRisk(risk.id, "category", v)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {riskCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Owner</label>
                          <Input
                            value={risk.owner}
                            onChange={(e) => updateRisk(risk.id, "owner", e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Likelihood: {likelihoodLabels[risk.likelihood - 1]} ({risk.likelihood})
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={risk.likelihood}
                            onChange={(e) => updateRisk(risk.id, "likelihood", parseInt(e.target.value) as Risk["likelihood"])}
                            className="w-full mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">
                            Impact: {impactLabels[risk.impact - 1]} ({risk.impact})
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={risk.impact}
                            onChange={(e) => updateRisk(risk.id, "impact", parseInt(e.target.value) as Risk["impact"])}
                            className="w-full mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground">Status</label>
                          <Select
                            value={risk.status}
                            onValueChange={(v) => updateRisk(risk.id, "status", v as Risk["status"])}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Open</SelectItem>
                              <SelectItem value="mitigated">Mitigated</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground flex items-center gap-1">
                            <Target className="h-3 w-3" /> Mitigations
                          </label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {risk.mitigations.map((mit, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {mit}
                              </Badge>
                            ))}
                            {risk.mitigations.length === 0 && (
                              <span className="text-xs text-muted-foreground">
                                No mitigations defined
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRisk(risk.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Risk
                      </Button>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}

          {risks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No risks identified yet</p>
              <Button variant="outline" size="sm" onClick={addRisk} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Risk
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
