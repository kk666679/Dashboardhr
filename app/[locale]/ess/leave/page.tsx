"use client";

/**
 * ESS Leave Page
 *
 * Allows employees to submit, track, and withdraw leave applications.
 * Displays real-time leave balance by type.
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus, X, Loader2 } from "lucide-react";
import { LeaveRequestList } from "@/components/features/ess";

const LEAVE_TYPES = [
  { value: "ANNUAL", label: "Annual Leave" },
  { value: "MEDICAL", label: "Medical Leave" },
  { value: "HOSPITALIZATION", label: "Hospitalisation" },
  { value: "EMERGENCY", label: "Emergency" },
  { value: "COMPASSIONATE", label: "Compassionate" },
  { value: "MATERNITY", label: "Maternity" },
  { value: "PATERNITY", label: "Paternity" },
  { value: "UNPAID", label: "Unpaid Leave" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING:   "bg-yellow-100 text-yellow-800",
  APPROVED:  "bg-green-100 text-green-800",
  REJECTED:  "bg-red-100 text-red-800",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default function EssLeavePage() {
  const year = new Date().getFullYear();
  const [showForm, setShowForm] = useState(false);
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null);

  const { data: balances, isLoading: isLoadingBalances, refetch: refetchBalances } = trpc.leave.balance.useQuery(
    { employeeId: "me", year },
    { enabled: true }
  );

  const { data: applications, isLoading: isLoadingApps, refetch: refetchApps } = trpc.leave.list.useQuery(
    { employeeId: "me", status: undefined },
    { enabled: true }
  );

  const submitMutation = trpc.leave.request.useMutation({
    onSuccess: () => {
      setShowForm(false);
      setOverlapWarning(null);
      refetchBalances();
      refetchApps();
    },
    onError: (err) => {
      if (err.message.includes("overlap")) {
        setOverlapWarning(err.message);
      }
    },
  });

  const { register, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      leaveType: "ANNUAL",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const onSubmit = (data: { leaveType: string; startDate: string; endDate: string; reason: string }) => {
    submitMutation.mutate({
      employeeId: "me",
      leaveType: data.leaveType as any,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      reason: data.reason,
    });
  };

  const handleConfirmOverlap = () => {
    handleSubmit(onSubmit)();
  };

  const isLoading = isLoadingBalances || isLoadingApps;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Leave</h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> Apply
        </Button>
      </div>

      {/* Leave balances */}
      <div className="grid grid-cols-2 gap-2">
        {(balances ?? []).map((b: any) => {
          const remaining = Number(b.available);
          return (
            <Card key={`${b.employeeId}-${b.leaveType}-${b.year}`}>
              <CardContent className="p-3">
                <p className="text-xs text-slate-500 capitalize mb-1">
                  {b.leaveType.toLowerCase().replace("_", " ")}
                </p>
                <p className="text-xl font-bold text-slate-900">{remaining.toFixed(1)}</p>
                <p className="text-xs text-slate-400">days remaining</p>
              </CardContent>
            </Card>
          );
        })}
        {(!balances || balances.length === 0) && (
          <div className="col-span-2 text-sm text-slate-400 text-center py-4">
            No balance data — please log in to view your leave balances.
          </div>
        )}
      </div>

      {/* Application form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-2 pt-4 px-4 flex-row items-center justify-between">
            <CardTitle className="text-sm">New Leave Application</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { setShowForm(false); reset(); }}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <Label className="text-xs">Leave Type</Label>
                <Select onValueChange={(v) => setValue("leaveType", v)} defaultValue="ANNUAL">
                  <SelectTrigger className="h-9 text-sm mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAVE_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">From</Label>
                  <Input type="date" className="h-9 text-sm mt-1" {...register("startDate", { required: true })} />
                </div>
                <div>
                  <Label className="text-xs">To</Label>
                  <Input type="date" className="h-9 text-sm mt-1" {...register("endDate", { required: true })} />
                </div>
              </div>
              <div>
                <Label className="text-xs">Reason (optional)</Label>
                <Input className="h-9 text-sm mt-1" placeholder="Brief reason…" {...register("reason")} />
              </div>

              {overlapWarning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
                  <p className="font-medium mb-1">⚠ Team overlap warning</p>
                  <p>{overlapWarning}</p>
                  <Button size="sm" className="mt-2" type="button" onClick={handleConfirmOverlap}>
                    Confirm and submit anyway
                  </Button>
                </div>
              )}

              {submitMutation.error && !overlapWarning && (
                <p className="text-xs text-red-600">{submitMutation.error.message}</p>
              )}

              <Button type="submit" className="w-full h-9" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? "Submitting…" : "Submit Application"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Application history */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" /> My Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {(!applications || applications.length === 0) ? (
            <p className="text-sm text-slate-400">No applications yet</p>
          ) : (
            <div className="space-y-2">
              {applications.map((app) => (
                <div key={app.id} className="flex items-start justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {app.leaveType.toLowerCase().replace("_", " ")}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(app.startDate).toLocaleDateString()} – {new Date(app.endDate).toLocaleDateString()}
                      {" "}({(app.numberOfDays ?? 0).toFixed(1)} days)
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[app.status] ?? ""}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
