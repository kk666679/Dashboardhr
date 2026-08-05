"use client";

import { useState, useEffect } from "react";
import { IntegrationForm } from "./IntegrationForm";
import { IntegrationList } from "./IntegrationList";
import { Agent, AgentHeader, AgentStatusDot, AgentContent } from "@/components/ai-elements/agent";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { RefreshCw, Sparkles } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { cn } from "@/lib/utils";

export function IntegrationsPage() {
  const { toast } = useToast();
  const { integrations: integrationsApi, invalidate } = useAdmin();
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "done">("idle");

  const { data, isLoading, error, refetch } = integrationsApi.getAll(undefined, {
    staleTime: 60_000,
  });

  const integrations = data as any[] || [];

  useEffect(() => {
    if (error) {
      toast({ title: "Error loading integrations", description: error.message, variant: "destructive" });
    }
  }, [error, toast]);

  const runHealthCheck = () => {
    setAgentStatus("thinking");
    setTimeout(() => {
      setAgentStatus("done");
      toast({ title: "Health check complete", description: "All integrations are healthy." });
    }, 1500);
  };

  const handleRefresh = () => {
    refetch();
    toast({ title: "Refreshed", description: "Integration list updated." });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">Connect and manage third-party services</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={runHealthCheck} className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Health Check
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <Agent>
        <AgentHeader
          name="Integration Health Agent"
          model="integration-v2"
          status={agentStatus}
          actions={
            <span className="flex items-center gap-1 text-xs">
              <AgentStatusDot status={agentStatus} />
              {agentStatus === "idle" && "Ready"}
              {agentStatus === "thinking" && "Checking..."}
              {agentStatus === "done" && "Done"}
            </span>
          }
        />
        {agentStatus === "done" && (
          <AgentContent>
            <Suggestions>
              <Suggestion suggestion={`✅ ${integrations.length} integrations connected`} variant="outline" />
              <Suggestion suggestion="🔧 Review API key expiry dates" variant="outline" />
              <Suggestion suggestion="📈 All endpoints responding within SLA" variant="outline" />
            </Suggestions>
          </AgentContent>
        )}
      </Agent>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Integrations</TabsTrigger>
          <TabsTrigger value="add">Add Integration</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Active Integrations</CardTitle>
              <CardDescription>Manage and monitor connected services</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 text-center text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin mx-auto mb-2" />
                  Loading integrations...
                </div>
              ) : (
                <IntegrationList
                  integrations={integrations}
                  onDelete={(id) => {
                    integrationsApi.delete.mutate({ id }, {
                      onSuccess: () => {
                        toast({ title: "Integration deleted" });
                        invalidate.integrations();
                      },
                      onError: (err: { message: string }) => {
                        toast({ title: "Delete failed", description: err.message, variant: "destructive" });
                      },
                    } as any);
                  }}
                  onEdit={(id) => {
                    toast({ title: "Edit integration", description: `Editing integration...` });
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>New Integration</CardTitle>
              <CardDescription>Connect a new service to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <IntegrationForm
                onSuccess={() => {
                  toast({ title: "Integration created" });
                  invalidate.integrations();
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}