"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Clock, CheckCircle, XCircle } from "lucide-react";

export default function MssApprovalsPage() {
  const { data: workflows, refetch } = trpc.workflowEngine.getActiveWorkflows.useQuery({});
  const submitDecision = trpc.workflowEngine.submitDecision.useMutation({ onSuccess: () => refetch() });

  const pending = workflows?.filter(w => w.status === "ACTIVE") ?? [];

  function handleDecision(instanceId: string, stepId: string, decision: "APPROVED" | "REJECTED") {
    submitDecision.mutate({ instanceId, stepId, decision });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <CheckSquare className="h-5 w-5 text-orange-600" />
        <h1 className="text-xl font-bold">Approval Queue</h1>
        {pending.length > 0 && <Badge className="bg-orange-500 text-white">{pending.length}</Badge>}
      </div>

      {pending.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500 opacity-50" />
            <p className="text-sm">All caught up — no pending approvals!</p>
          </CardContent>
        </Card>
      )}

      {pending.map(wf => {
        const activeStep = wf.steps.find(s => s.status === "ACTIVE");
        const slaDeadline = activeStep?.slaDeadline ? new Date(activeStep.slaDeadline) : null;
        const minutesLeft = slaDeadline ? Math.floor((slaDeadline.getTime() - Date.now()) / 60000) : null;
        const isOverdue = minutesLeft !== null && minutesLeft < 0;

        return (
          <Card key={wf.id} className={isOverdue ? "border-red-200" : ""}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{wf.entityType}</span>
                {minutesLeft !== null && (
                  <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                    <Clock className="h-3.5 w-3.5" />
                    {isOverdue ? `Overdue by ${Math.abs(minutesLeft)}m` : `${minutesLeft}m remaining`}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground mb-3">
                Entity ID: <span className="font-mono">{wf.entityId.slice(0, 16)}…</span>
                {activeStep && <> · Step: {activeStep.stepName}</>}
              </div>
              {activeStep && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleDecision(wf.id, activeStep.stepId, "APPROVED")}
                    disabled={submitDecision.isPending}
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200"
                    onClick={() => handleDecision(wf.id, activeStep.stepId, "REJECTED")}
                    disabled={submitDecision.isPending}
                  >
                    <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
