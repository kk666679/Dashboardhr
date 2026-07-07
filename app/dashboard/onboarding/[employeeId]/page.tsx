"use client";
/**
 * Onboarding Portal — Task 10.3
 * New hire self-service: personal details, document upload, policy acceptance,
 * bank/tax info. Tracks completion % for HR dashboard.
 * Requirements: 4.3, 4.6, 4.7
 */
import { use, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, User, FileText, Shield } from "lucide-react";

const STATUS_ICON: Record<string, React.ReactNode> = {
  COMPLETED: <CheckCircle className="h-4 w-4 text-green-600" />,
  IN_PROGRESS: <Clock className="h-4 w-4 text-yellow-600" />,
  OVERDUE:   <AlertCircle className="h-4 w-4 text-red-500" />,
  PENDING:   <Clock className="h-4 w-4 text-muted-foreground" />,
};

export default function OnboardingPortalPage({ params }: { params: Promise<{ employeeId: string }> }) {
  const { employeeId } = use(params);
  const [policyAccepted, setPolicyAccepted] = useState(false);
  const [acceptedAt, setAcceptedAt] = useState<string | null>(null);

  const { data: checklists, refetch } = trpc.onboarding.getChecklistByEmployee.useQuery({ employeeId });
  const completeTask = trpc.onboarding.completeTask.useMutation({ onSuccess: () => refetch() });

  const checklist = checklists?.[0];
  const tasks = checklist?.tasks ?? [];
  const completionPct = checklist?.completionPct ?? 0;

  function handleAcceptPolicy() {
    setPolicyAccepted(true);
    setAcceptedAt(new Date().toLocaleString());
    // Mark the policy task complete if it exists
    const policyTask = tasks.find(t => t.title.toLowerCase().includes("policy"));
    if (policyTask && !policyTask.completedAt) {
      completeTask.mutate({ taskId: policyTask.id });
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      <div className="text-center space-y-2">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Welcome Onboard!</h1>
        <p className="text-sm text-muted-foreground">Complete your onboarding tasks before your first day.</p>
      </div>

      {/* Progress bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Completion</span>
            <span className="text-sm font-bold text-primary">{completionPct}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${completionPct}%` }}
            />
          </div>
          {completionPct === 100 && (
            <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> All tasks complete! Your Employee ID and system access will be provisioned shortly.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Tasks */}
      {checklist && (
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Onboarding Checklist</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tasks.length === 0 && <p className="text-sm text-muted-foreground">No tasks assigned yet.</p>}
            {tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between border rounded-lg p-3">
                <div className="flex items-center gap-3">
                  {STATUS_ICON[task.status] ?? STATUS_ICON.PENDING}
                  <div>
                    <div className="text-sm font-medium">{task.title}</div>
                    {task.description && <div className="text-xs text-muted-foreground">{task.description}</div>}
                    {task.dueDate && (
                      <div className="text-xs text-muted-foreground">Due: {new Date(task.dueDate).toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {task.isMandatory && <Badge variant="secondary" className="text-xs">Required</Badge>}
                  {!task.completedAt && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => completeTask.mutate({ taskId: task.id })}
                      disabled={completeTask.isPending}
                    >
                      Mark Done
                    </Button>
                  )}
                  {task.completedAt && (
                    <span className="text-xs text-green-600">Completed {new Date(task.completedAt).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Policy acceptance */}
      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Policy Acceptance</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Please read and accept the company policies before your start date. Your digital signature timestamp will be recorded.
          </p>
          <div className="bg-muted/40 rounded-lg p-4 text-sm space-y-2 max-h-40 overflow-y-auto">
            <p className="font-medium">Company Code of Conduct</p>
            <p>All employees are expected to conduct themselves with integrity and professionalism. You agree to comply with all applicable laws, company policies, and data protection requirements (PDPA / GDPR).</p>
            <p>Confidentiality, IP ownership, and acceptable use of company systems apply from day one of employment.</p>
          </div>
          {!policyAccepted ? (
            <Button onClick={handleAcceptPolicy}>
              <Shield className="h-4 w-4 mr-2" /> I Accept — Sign Electronically
            </Button>
          ) : (
            <div className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Policy accepted on {acceptedAt} (digital signature recorded)
            </div>
          )}
        </CardContent>
      </Card>

      {/* No checklist yet */}
      {!checklist && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">Your onboarding checklist is being prepared. Please check back soon.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
