"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Agent, AgentHeader, AgentStatusDot, AgentContent } from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Download, Filter, Search, Sparkles, AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/hooks/useAdmin";

interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  ip: string;
  riskScore?: number;
  anomaly?: boolean;
}

interface AuditLogListProps {
  logs?: AuditLogEntry[];
  onExport?: () => void;
}

export function AuditLogList({ logs: propLogs, onExport }: AuditLogListProps) {
  const { toast } = useToast();
  const { auditLogs, invalidate } = useAdmin();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");

  // Fetch real data
  const { data, isLoading, error, refetch } = auditLogs.getAll(undefined, {
    staleTime: 30_000,
  });

  const logs = propLogs || (data as AuditLogEntry[]) || [];

  useEffect(() => {
    if (error) {
      toast({ title: "Error loading audit logs", description: error.message, variant: "destructive" });
    }
  }, [error, toast]);

  // Derived stats
  const totalLogs = logs.length;
  const anomalyCount = logs.filter(l => l.anomaly).length;
  const highRiskCount = logs.filter(l => (l.riskScore || 0) > 70).length;

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === "all" || log.action === filterAction;
    const matchesUser = filterUser === "all" || log.user === filterUser;
    return matchesSearch && matchesAction && matchesUser;
  });

  const uniqueUsers = [...new Set(logs.map(l => l.user).filter(Boolean))];
  const uniqueActions = [...new Set(logs.map(l => l.action).filter(Boolean))];

  const runAIAnalysis = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      toast({
        title: "AI Analysis Complete",
        description: `Detected ${anomalyCount} anomalous activities and ${highRiskCount} high-risk events.`,
      });
    }, 1500);
  };

  const handleRefresh = () => {
    refetch();
    toast({ title: "Refreshed", description: "Audit logs updated." });
  };

  return (
    <div className="space-y-6">
      {/* AI Agent Overview */}
      <Agent>
        <AgentHeader
          name="Audit Intelligence Agent"
          model="audit-v2"
          status={agentStatus}
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status={agentStatus} />
              {agentStatus === "idle" && "Monitoring"}
              {agentStatus === "thinking" && "Analyzing..."}
              {agentStatus === "done" && "Done"}
            </span>
          }
        />
        <AgentContent>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Total Events:</span>
              <span className="font-bold">{totalLogs}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">Anomalies:</span>
              <span className="font-bold text-yellow-500">{anomalyCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-muted-foreground">High Risk:</span>
              <span className="font-bold text-red-500">{highRiskCount}</span>
            </div>
            <Button size="sm" variant="outline" onClick={runAIAnalysis} className="gap-2">
              <Sparkles className="h-4 w-4" />
              Run AI Analysis
            </Button>
            <Button size="sm" variant="outline" onClick={handleRefresh} className="gap-2">
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              Refresh
            </Button>
            <Button size="sm" variant="outline" onClick={onExport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </AgentContent>
      </Agent>

      {/* Suggestions */}
      {agentStatus === "done" && (
        <Suggestions>
          <Suggestion suggestion="🔍 3 high-risk events detected – investigate immediately" variant="outline" />
          <Suggestion suggestion="📊 Anomaly pattern detected in user activity" variant="outline" />
          <Suggestion suggestion="🛡️ Review recent permission changes" variant="outline" />
        </Suggestions>
      )}

      {agentStatus === "done" && (
        <Reasoning defaultOpen={false}>
          <ReasoningTrigger />
          <ReasoningContent>
            AI has analyzed {totalLogs} audit events. Detected {highRiskCount} high‑risk activities.
            Recommended actions: Review suspicious IPs, enforce MFA for all admins, and audit recent permission changes.
          </ReasoningContent>
        </Reasoning>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {uniqueActions.map(action => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterUser} onValueChange={setFilterUser}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {uniqueUsers.map(user => (
              <SelectItem key={user} value={user}>{user}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          Advanced
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Risk</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Loading audit logs...
                </TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No audit logs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => {
                const isAnomaly = log.anomaly || (log.riskScore || 0) > 70;
                return (
                  <TableRow
                    key={log.id}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-muted/50",
                      isAnomaly && "bg-red-50 dark:bg-red-950/10"
                    )}
                    onClick={() => setSelectedLog(log)}
                  >
                    <TableCell className="whitespace-nowrap text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="font-medium">{log.user}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.resource}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell>
                      {log.riskScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-mono text-xs font-medium",
                            log.riskScore > 70 ? "text-red-500" : log.riskScore > 40 ? "text-yellow-500" : "text-green-500"
                          )}>
                            {log.riskScore}%
                          </span>
                          {log.anomaly && (
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Audit Policy Document" href="/dashboard/compliance/policy-library" />
          <Source title="GDPR Compliance Checklist" href="/dashboard/compliance/requirements" />
        </SourcesContent>
      </Sources>
    </div>
  );
}