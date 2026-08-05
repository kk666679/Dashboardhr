"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { ComplianceRule } from "../../../lib/compliance-engine";

interface ComplianceAlertItem {
  type: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  daysUntilExpiry: number;
}

interface ComplianceAlertProps {
  employeeName: string;
  isCompliant: boolean;
  alerts: ComplianceAlertItem[];
  lastChecked: Date;
  loading?: boolean;
}

export function ComplianceAlert({
  employeeName,
  isCompliant,
  alerts,
  lastChecked,
  loading,
}: ComplianceAlertProps) {
  if (loading) return <Skeleton className="h-40 rounded-xl" />;

  const critical = alerts.filter((a) => a.severity === "CRITICAL");

  return (
    <Card className={isCompliant ? "border-green-200" : "border-red-200"}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{employeeName}</CardTitle>
          <Badge variant={isCompliant ? "default" : "destructive"} className="gap-1">
            {isCompliant ? (
              <>
                <CheckCircle className="h-3 w-3" /> Compliant
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" /> Non-Compliant
              </>
            )}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          Checked {lastChecked.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {critical.length > 0 && (
          <Alert variant="destructive" className="py-2">
            <AlertTriangle className="h-3 w-3" />
            <AlertDescription className="text-xs">
              {critical.length} critical issue{critical.length > 1 ? "s" : ""} — immediate action
              required
            </AlertDescription>
          </Alert>
        )}
        <ScrollArea className="max-h-32">
          <div className="space-y-1.5">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                {alert.severity === "CRITICAL" ? (
                  <XCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
                ) : alert.severity === "WARNING" ? (
                  <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-blue-500 mt-0.5 shrink-0" />
                )}
                <span className="text-muted-foreground">{alert.message}</span>
              </div>
            ))}
            {alerts.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-2">
                All documents in order
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface ComplianceRuleCardProps {
  rule: ComplianceRule;
}

export function ComplianceRuleCard({ rule }: ComplianceRuleCardProps) {
  const typeColors: Record<string, string> = {
    VISA: "bg-blue-100 text-blue-800",
    PERMIT: "bg-purple-100 text-purple-800",
    MEDICAL: "bg-green-100 text-green-800",
    TAX: "bg-orange-100 text-orange-800",
    LABOR: "bg-red-100 text-red-800",
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge className={typeColors[rule.ruleType] ?? "bg-gray-100 text-gray-800"}>
            {rule.ruleType}
          </Badge>
          <Badge variant={rule.active ? "default" : "secondary"}>
            {rule.active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardTitle className="text-sm mt-2">{rule.description}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center p-2 bg-muted rounded cursor-default">
                <div className="font-semibold text-foreground">{rule.validityMonths}mo</div>
                <div>Validity</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Document validity period</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center p-2 bg-muted rounded cursor-default">
                <div className="font-semibold text-foreground">{rule.alertDays}d</div>
                <div>Alert</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Days before expiry to alert</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="text-center p-2 bg-muted rounded cursor-default">
                <div className="font-semibold text-foreground">{rule.renewalLeadTime}d</div>
                <div>Lead</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>Renewal lead time in days</TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}
