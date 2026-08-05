"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, XCircle, ChevronDown, ChevronRight, Shield, RefreshCw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ClauseRequirement {
  id: string;
  text: string;
  status: "compliant" | "partial" | "non-compliant" | "not-applicable";
  notes?: string;
}

interface ISOClause {
  number: string;
  title: string;
  requirements: ClauseRequirement[];
}

interface ISOComplianceCheckerProps {
  clauses?: ISOClause[];
  onCheckCompliance?: () => void;
  isChecking?: boolean;
  className?: string;
}

const defaultClauses: ISOClause[] = [
  {
    number: "4",
    title: "Context of the Organization",
    requirements: [
      { id: "4.1", text: "Understanding the organization and its context", status: "compliant" },
      { id: "4.2", text: "Understanding needs and expectations of interested parties", status: "compliant" },
      { id: "4.3", text: "Determining the scope of the QMS", status: "partial" },
      { id: "4.4", text: "QMS and its processes", status: "compliant" },
    ],
  },
  {
    number: "5",
    title: "Leadership",
    requirements: [
      { id: "5.1", text: "Leadership and commitment", status: "compliant" },
      { id: "5.2", text: "Quality policy", status: "compliant" },
      { id: "5.3", text: "Organizational roles, responsibilities and authorities", status: "partial" },
    ],
  },
  {
    number: "6",
    title: "Planning",
    requirements: [
      { id: "6.1", text: "Actions to address risks and opportunities", status: "partial" },
      { id: "6.2", text: "Quality objectives and planning to achieve them", status: "compliant" },
      { id: "6.3", text: "Planning of changes", status: "compliant" },
    ],
  },
  {
    number: "7",
    title: "Support",
    requirements: [
      { id: "7.1", text: "Resources", status: "compliant" },
      { id: "7.2", text: "Competence", status: "non-compliant" },
      { id: "7.3", text: "Awareness", status: "compliant" },
      { id: "7.4", text: "Communication", status: "compliant" },
      { id: "7.5", text: "Documented information", status: "partial" },
    ],
  },
  {
    number: "8",
    title: "Operation",
    requirements: [
      { id: "8.1", text: "Operational planning and control", status: "compliant" },
      { id: "8.2", text: "Requirements for products and services", status: "compliant" },
      { id: "8.3", text: "Design and development", status: "not-applicable" },
      { id: "8.4", text: "Control of externally provided processes", status: "compliant" },
      { id: "8.5", text: "Production and service provision", status: "compliant" },
      { id: "8.6", text: "Release of products and services", status: "compliant" },
      { id: "8.7", text: "Control of nonconforming outputs", status: "partial" },
    ],
  },
  {
    number: "9",
    title: "Performance Evaluation",
    requirements: [
      { id: "9.1", text: "Monitoring, measurement, analysis and evaluation", status: "compliant" },
      { id: "9.2", text: "Internal audit", status: "non-compliant" },
      { id: "9.3", text: "Management review", status: "compliant" },
    ],
  },
  {
    number: "10",
    title: "Improvement",
    requirements: [
      { id: "10.1", text: "General", status: "compliant" },
      { id: "10.2", text: "Nonconformity and corrective action", status: "partial" },
      { id: "10.3", text: "Continual improvement", status: "compliant" },
    ],
  },
];

export function ISOComplianceChecker({
  clauses = defaultClauses,
  onCheckCompliance,
  isChecking = false,
  className,
}: ISOComplianceCheckerProps) {
  const [expandedClauses, setExpandedClauses] = React.useState<string[]>(["4"]);

  const toggleClause = (clauseNumber: string) => {
    setExpandedClauses((prev) =>
      prev.includes(clauseNumber)
        ? prev.filter((c) => c !== clauseNumber)
        : [...prev, clauseNumber]
    );
  };

  const getStatusIcon = (status: ClauseRequirement["status"]) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "partial":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "non-compliant":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "not-applicable":
        return <span className="h-4 w-4 rounded-full bg-muted" />;
    }
  };

  const getStatusColor = (status: ClauseRequirement["status"]) => {
    switch (status) {
      case "compliant":
        return "text-success";
      case "partial":
        return "text-warning";
      case "non-compliant":
        return "text-destructive";
      case "not-applicable":
        return "text-muted-foreground";
    }
  };

  // Calculate overall compliance
  const allRequirements = clauses.flatMap((c) => c.requirements);
  const applicableRequirements = allRequirements.filter((r) => r.status !== "not-applicable");
  const compliantCount = applicableRequirements.filter((r) => r.status === "compliant").length;
  const partialCount = applicableRequirements.filter((r) => r.status === "partial").length;
  const overallScore = Math.round(
    ((compliantCount + partialCount * 0.5) / applicableRequirements.length) * 100
  );

  return (
    <Card className={cn("border-border/50 bg-card/80", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>ISO 9001:2015 Compliance Check</CardTitle>
            </div>
            <CardDescription>
              Review compliance status for each clause requirement
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCheckCompliance}
            disabled={isChecking}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isChecking && "animate-spin")} />
            {isChecking ? "Checking..." : "Re-check"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Overall Compliance Score</span>
            <span
              className={cn(
                "text-2xl font-bold",
                overallScore >= 90 ? "text-success" :
                overallScore >= 70 ? "text-warning" : "text-destructive"
              )}
            >
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className="h-2" />
          <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
            <span>{compliantCount} Compliant</span>
            <span>{partialCount} Partial</span>
            <span>{applicableRequirements.length - compliantCount - partialCount} Non-Compliant</span>
          </div>
        </div>

        {/* Clause List */}
        <div className="space-y-2">
          {clauses.map((clause) => {
            const clauseCompliant = clause.requirements.filter((r) => r.status === "compliant").length;
            const clauseTotal = clause.requirements.filter((r) => r.status !== "not-applicable").length;
            const clauseScore = clauseTotal > 0 ? Math.round((clauseCompliant / clauseTotal) * 100) : 100;

            return (
              <Collapsible
                key={clause.number}
                open={expandedClauses.includes(clause.number)}
                onOpenChange={() => toggleClause(clause.number)}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      {expandedClauses.includes(clause.number) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Clause {clause.number}
                        </Badge>
                        <span className="font-medium">{clause.title}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {clauseCompliant}/{clauseTotal}
                      </span>
                      <Badge
                        className={cn(
                          "text-xs",
                          clauseScore >= 90 ? "bg-success/20 text-success" :
                          clauseScore >= 70 ? "bg-warning/20 text-warning" :
                          "bg-destructive/20 text-destructive"
                        )}
                      >
                        {clauseScore}%
                      </Badge>
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-1 ml-7 space-y-1">
                    {clause.requirements.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-2 rounded border border-border/30 bg-background/50"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(req.status)}
                          <span className="text-sm">
                            <span className="font-mono text-xs text-muted-foreground mr-2">
                              {req.id}
                            </span>
                            {req.text}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn("text-xs capitalize", getStatusColor(req.status))}
                        >
                          {req.status.replace("-", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
