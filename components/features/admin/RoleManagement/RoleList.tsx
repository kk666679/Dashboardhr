"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Agent, AgentHeader, AgentStatusDot, AgentContent } from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Sparkles, Users, RefreshCw, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: number;
  users: number;
  status: "Active" | "Inactive";
  riskScore?: number;
}

interface RoleListProps {
  onEdit?: (id: string) => void;
  onRefresh?: () => void;
}

export function RoleList({ onEdit, onRefresh }: RoleListProps) {
  const { toast } = useToast();
  const { roles: rolesApi, invalidate } = useAdmin();
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");

  const { data, isLoading, error, refetch } = rolesApi.getAll(undefined, {
    staleTime: 60_000,
  });

  const roles = (data as Role[]) || [];

  useEffect(() => {
    if (error) {
      toast({ title: "Error loading roles", description: error.message, variant: "destructive" });
    }
  }, [error, toast]);

  const runAIAnalysis = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      toast({
        title: "AI Role Analysis",
        description: `Found ${roles.filter(r => r.riskScore && r.riskScore > 80).length} high-risk roles.`,
      });
    }, 1500);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    rolesApi.delete.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Role deleted" });
        invalidate.roles();
        onRefresh?.();
      },
      onError: (err) => {
        toast({ title: "Delete failed", description: err.message, variant: "destructive" });
      },
    });
  };

  const handleRefresh = () => {
    refetch();
    toast({ title: "Refreshed", description: "Role list updated." });
  };

  return (
    <div className="space-y-6">
      <Agent>
        <AgentHeader
          name="Role Intelligence"
          model="role-v1"
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
        <AgentContent>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">AI-powered role risk assessment</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={runAIAnalysis} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Analyze Roles
              </Button>
              <Button size="sm" variant="ghost" onClick={handleRefresh} className="gap-1">
                <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
              </Button>
            </div>
          </div>
          {agentStatus === "done" && (
            <Suggestions>
              <Suggestion suggestion={`⚠️ ${roles.filter(r => r.riskScore && r.riskScore > 80).length} high-risk roles – review permissions`} variant="outline" />
              <Suggestion suggestion="🔄 Merge redundant roles to reduce administrative overhead" variant="outline" />
              <Suggestion suggestion="📊 Users with multiple roles may create privilege escalation" variant="outline" />
            </Suggestions>
          )}
        </AgentContent>
      </Agent>

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
          Loading roles...
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No roles found.
                </TableCell>
              </TableRow>
            ) : (
              roles.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{r.permissions}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {r.users}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={r.status === "Active" ? "success" : "secondary"}>
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {r.riskScore !== undefined ? (
                      <Badge
                        variant={
                          r.riskScore > 80 ? "destructive" :
                          r.riskScore > 60 ? "warning" :
                          "secondary"
                        }
                      >
                        {r.riskScore}%
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit?.(r.id)} className="gap-1">
                      <Pencil className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)} className="gap-1">
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
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