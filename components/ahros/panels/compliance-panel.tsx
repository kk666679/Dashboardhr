/**
 * CompliancePanel — Compliance validation report panel.
 *
 * Uses the Artifact component from ai-elements to display
 * auto-generated compliance reports with color-coded risk scoring,
 * regulation references, and remediation suggestions.
 *
 * Covers: Employment Act, EPF, SOCSO, EIS, LHDN, PDPA, Immigration
 */

"use client";

import { useMemo } from "react";
import {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
} from "@/components/ai-elements/artifact";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import {
  ShieldCheckIcon,
  AlertTriangleIcon,
  XCircleIcon,
  InfoIcon,
  RefreshCcwIcon,
  DownloadIcon,
  FileTextIcon,
} from "lucide-react";

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-500 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-yellow-500 text-black",
  LOW: "bg-blue-500 text-white",
  INFO: "bg-gray-500 text-white",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pass: <ShieldCheckIcon className="size-4 text-green-500" />,
  fail: <XCircleIcon className="size-4 text-red-500" />,
  warning: <AlertTriangleIcon className="size-4 text-amber-500" />,
  not_applicable: <InfoIcon className="size-4 text-muted-foreground" />,
};

export function CompliancePanel() {
  const compliance = useAhrosStore((s) => s.complianceReport);

  // Generate human-readable summary
  const summary = useMemo(() => {
    if (!compliance) return null;

    const passed = compliance.checks.filter(
      (c) => c.status === "pass",
    ).length;
    const warnings = compliance.checks.filter(
      (c) => c.status === "warning",
    ).length;
    const failed = compliance.checks.filter(
      (c) => c.status === "fail",
    ).length;
    const critical = compliance.checks.filter(
      (c) => c.severity === "CRITICAL" && c.status === "fail",
    ).length;

    return { passed, warnings, failed, critical };
  }, [compliance]);

  if (!compliance) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <ShieldCheckIcon className="size-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No compliance data</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Compliance validation will appear here once a workflow is executed
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-4">
        {/* Score Card */}
        <Artifact>
          <ArtifactHeader>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="size-4" />
              <ArtifactTitle>Compliance Score</ArtifactTitle>
            </div>
            <ArtifactActions>
              <ArtifactAction
                tooltip="Refresh compliance check"
                icon={RefreshCcwIcon}
              />
              <ArtifactAction
                tooltip="Download report"
                icon={DownloadIcon}
              />
            </ArtifactActions>
          </ArtifactHeader>
          <ArtifactContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Overall Status</span>
                <Badge
                  variant={
                    compliance.overallStatus === "compliant"
                      ? "default"
                      : compliance.overallStatus === "partial"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-[10px]"
                >
                  {compliance.overallStatus.replace("_", " ").toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Score</span>
                  <span
                    className={
                      compliance.score >= 80
                        ? "text-green-500"
                        : compliance.score >= 50
                          ? "text-amber-500"
                          : "text-red-500"
                    }
                  >
                    {compliance.score}%
                  </span>
                </div>
                <Progress
                  value={compliance.score}
                  className={`h-2 ${
                    compliance.score >= 80
                      ? "[&>div]:bg-green-500"
                      : compliance.score >= 50
                        ? "[&>div]:bg-amber-500"
                        : "[&>div]:bg-red-500"
                  }`}
                />
              </div>

              {summary && (
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <ShieldCheckIcon className="size-3 text-green-500" />
                    {summary.passed} passed
                  </span>
                  {summary.warnings > 0 && (
                    <span className="flex items-center gap-1">
                      <AlertTriangleIcon className="size-3 text-amber-500" />
                      {summary.warnings} warnings
                    </span>
                  )}
                  {summary.failed > 0 && (
                    <span className="flex items-center gap-1">
                      <XCircleIcon className="size-3 text-red-500" />
                      {summary.failed} failed
                    </span>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground border-t pt-2">
                {compliance.summary}
              </p>
            </div>
          </ArtifactContent>
        </Artifact>

        {/* Individual Checks */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileTextIcon className="size-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Compliance Checks
            </span>
            <Badge variant="outline" className="text-[9px]">
              {compliance.checks.length} checks
            </Badge>
          </div>

          <div className="space-y-2">
            {compliance.checks.map((check) => (
              <Artifact key={check.id}>
                <ArtifactHeader>
                  <div className="flex items-center gap-2 min-w-0">
                    {STATUS_ICONS[check.status]}
                    <div className="min-w-0">
                      <ArtifactTitle className="text-xs truncate">
                        {check.rule}
                      </ArtifactTitle>
                      <ArtifactDescription className="text-[10px]">
                        {check.reference}
                      </ArtifactDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge
                      className={`text-[9px] px-1 py-0 ${
                        SEVERITY_COLORS[check.severity]
                      }`}
                    >
                      {check.severity}
                    </Badge>
                    <Badge
                      variant={
                        check.status === "pass"
                          ? "default"
                          : check.status === "fail"
                            ? "destructive"
                            : "outline"
                      }
                      className="text-[9px] px-1 py-0"
                    >
                      {check.status.replace("_", " ")}
                    </Badge>
                  </div>
                </ArtifactHeader>
                {check.detail && (
                  <ArtifactContent>
                    <p className="text-xs text-muted-foreground">
                      {check.detail}
                    </p>
                    {check.remediation && (
                      <div className="mt-2 flex items-start gap-1 rounded-md bg-amber-50 dark:bg-amber-950/20 p-2">
                        <AlertTriangleIcon className="size-3 text-amber-500 mt-0.5 shrink-0" />
                        <p className="text-[10px] text-amber-700 dark:text-amber-300">
                          {check.remediation}
                        </p>
                      </div>
                    )}
                  </ArtifactContent>
                )}
              </Artifact>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

