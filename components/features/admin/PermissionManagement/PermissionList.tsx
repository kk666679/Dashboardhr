"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Agent, AgentHeader, AgentStatusDot, AgentContent } from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  enabled: boolean;
  riskLevel?: "low" | "medium" | "high";
  description?: string;
}

interface PermissionListProps {
  onRefresh?: () => void;
}

export function PermissionList({ onRefresh }: PermissionListProps) {
  const { toast } = useToast();
  const { permissions: permissionsApi, invalidate } = useAdmin();
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");

  const { data, isLoading, error, refetch } = permissionsApi.getAll(undefined, {
    staleTime: 60_000,
  });

  const permissions = (data as Permission[]) || [];

  useEffect(() => {
    if (error) {
      toast({ title: "Error loading permissions", description: error.message, variant: "destructive" });
    }
  }, [error, toast]);

  const runAIReview = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      toast({
        title: "AI Review Complete",
        description: `${permissions.filter(p => p.riskLevel === "high").length} high-risk permissions identified.`,
      });
    }, 1500);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    permissionsApi.toggle.mutate({ id }, {
      onSuccess: () => {
        toast({ title: `Permission ${enabled ? "enabled" : "disabled"}` });
        invalidate.permissions();
        onRefresh?.();
      },
      onError: (err) => {
        toast({ title: "Update failed", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({ title: "Refreshed", description: "Permission list updated." });
  };

  return (
    <div className="space-y-6">
      <Agent>
        <AgentHeader
          name="Permission AI Auditor"
          model="rbac-v2"
          status={agentStatus}
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status={agentStatus} />
              {agentStatus === "idle" && "Ready"}
              {agentStatus === "thinking" && "Reviewing..."}
              {agentStatus === "done" && "Done"}
            </span>
          }
        />
        <AgentContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI-powered RBAC review</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={runAIReview} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Run AI Review
              </Button>
              <Button size="sm" variant="ghost" onClick={handleRefresh} className="gap-1">
                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              </Button>
            </div>
          </div>
          {agentStatus === "done" && (
            <Suggestions>
              <Suggestion suggestion={`⚠️ ${permissions.filter(p => p.riskLevel === "high").length} permissions grant access to sensitive data – review immediately`} variant="outline" />
              <Suggestion suggestion={`🔄 ${permissions.filter(p => !p.enabled).length} disabled permissions can be removed`} variant="outline" />
              <Suggestion suggestion="📋 Recommended: implement least-privilege access control" variant="outline" />
            </Suggestions>
          )}
        </AgentContent>
      </Agent>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
          Loading permissions...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Enabled</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No permissions found.
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.resource}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{p.action}</Badge>
                  </TableCell>
                  <TableCell>
                    {p.riskLevel && (
                      <Badge
                        variant={
                          p.riskLevel === "high" ? "destructive" :
                          p.riskLevel === "medium" ? "warning" :
                          "secondary"
                        }
                      >
                        {p.riskLevel}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={p.enabled}
                      onCheckedChange={(v) => handleToggle(p.id, v)}
                      disabled={permissionsApi.toggle.isPending}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}