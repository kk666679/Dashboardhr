"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow, TableEmpty,
} from "@/components/ui/table";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Calendar, CheckCircle, XCircle, Clock, Users } from "lucide-react";

// ─── Type Definitions ────────────────────────────────────────────────────────

type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
type AccrualMethod = "ANNUAL" | "MONTHLY" | "HOURS_WORKED";

interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: string;
  startDate: Date | string;
  endDate: Date | string;
  days: number | string;
  status: LeaveStatus;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface LeavePolicy {
  id: string;
  leaveType: string;
  annualEntitlement: number | string;
  carryForwardMax: number | string;
  statutoryMinimum: number | string;
  accrualMethod: AccrualMethod;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<LeaveStatus, "warning" | "success" | "destructive" | "secondary"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  CANCELLED: "secondary",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState<string>("approvals");
  const [rejectId, setRejectId] = useState<string>("");
  const [rejectReason, setRejectReason] = useState<string>("");

  const { data: pending, refetch } = trpc.leave.list.useQuery({ 
    status: "PENDING", 
    take: 50 
  });
  const { data: policies } = trpc.leave.listPolicies.useQuery({});

  const approve = trpc.leave.approve.useMutation({ 
    onSuccess: () => refetch() 
  });
  const reject = trpc.leave.reject.useMutation({
    onSuccess: () => {
      setRejectId("");
      setRejectReason("");
      refetch();
    },
  });

  const handleApprove = (leaveId: string) => {
    approve.mutate({ leaveId });
  };

  const handleReject = () => {
    if (!rejectId || !rejectReason.trim()) return;
    reject.mutate({ 
      leaveId: rejectId, 
      reason: rejectReason.trim() 
    });
  };

  const handleCancelReject = () => {
    setRejectId("");
    setRejectReason("");
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const formatDays = (days: number | string): string => {
    const num = typeof days === "string" ? parseFloat(days) : days;
    return isNaN(num) ? "0.0" : num.toFixed(1);
  };

  const formatEntitlement = (value: number | string): string => {
    const num = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(num) ? "0.0" : num.toFixed(1);
  };

  const getStatusBadge = (status: LeaveStatus): "warning" | "success" | "destructive" | "secondary" => {
    return STATUS_VARIANT[status] || "secondary";
  };

  const isPendingApproval = (status: LeaveStatus): boolean => {
    return status === "PENDING";
  };

  const isRejecting = (id: string): boolean => {
    return rejectId === id;
  };

  const isApproveDisabled = (): boolean => {
    return approve.isPending;
  };

  const isRejectDisabled = (): boolean => {
    return reject.isPending || !rejectReason.trim();
  };

  return (
    <PageShell>
      <PageHeader
        title="Leave Management"
        description="Approve requests, manage policies, and view the team calendar"
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCard
          title="Pending Requests"
          value={pending?.length ?? 0}
          icon={<Clock className="size-4" />}
          trend="neutral"
          sub="awaiting approval"
        />
        <StatCard
          title="Leave Types"
          value={policies?.length ?? 0}
          icon={<Users className="size-4" />}
          sub="configured policies"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="approvals">
            Pending Approvals
            {(pending?.length ?? 0) > 0 && (
              <Badge variant="solid" size="xs" className="ml-2">
                {pending?.length ?? 0}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        {/* ── Pending approvals ── */}
        <TabsContent value="approvals">
          <Card>
            <CardContent className="pt-4">
              {!pending?.length ? (
                <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
                  No pending leave requests
                </p>
              ) : (
                <div className="space-y-2">
                  {(pending as LeaveRequest[]).map((request: LeaveRequest) => (
                    <div
                      key={request.id}
                      className="rounded-[var(--radius-md)] border border-[var(--border)] p-3 space-y-2"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge 
                              variant={getStatusBadge(request.status)} 
                              size="sm"
                            >
                              {request.status}
                            </Badge>
                            <span className="text-sm font-medium">
                              {request.leaveType}
                            </span>
                            <span className="text-xs text-[var(--foreground-muted)]">
                              {formatDate(request.startDate)} –{" "}
                              {formatDate(request.endDate)}
                            </span>
                            <Badge variant="outline" size="sm">
                              {formatDays(request.days)} day(s)
                            </Badge>
                          </div>
                          <p className="text-xs text-[var(--foreground-muted)]">
                            Employee: {request.employeeId.slice(0, 16)}…
                            {request.reason && ` · "${request.reason}"`}
                          </p>
                        </div>

                        {isPendingApproval(request.status) && (
                          <div className="flex items-center gap-2 shrink-0">
                            {isRejecting(request.id) ? (
                              <>
                                <Input
                                  placeholder="Rejection reason"
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  className="h-7 text-xs w-44"
                                />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={handleReject}
                                  disabled={isRejectDisabled()}
                                >
                                  Confirm
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={handleCancelReject}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="success"
                                  onClick={() => handleApprove(request.id)}
                                  disabled={isApproveDisabled()}
                                >
                                  <CheckCircle className="size-3.5" /> Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setRejectId(request.id)}
                                >
                                  <XCircle className="size-3.5" /> Reject
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Policies ── */}
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Leave Policies</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {!policies?.length ? (
                <p className="py-8 text-center text-sm text-[var(--foreground-muted)]">
                  No policies configured
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead className="text-right">Entitlement</TableHead>
                      <TableHead className="text-right">Carry Fwd Max</TableHead>
                      <TableHead className="text-right">Statutory Min</TableHead>
                      <TableHead>Accrual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(policies as LeavePolicy[]).map((policy: LeavePolicy) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">
                          {policy.leaveType}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatEntitlement(policy.annualEntitlement)} days
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatEntitlement(policy.carryForwardMax)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatEntitlement(policy.statutoryMinimum)}
                        </TableCell>
                        <TableCell>{policy.accrualMethod}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}