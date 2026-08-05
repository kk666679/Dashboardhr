"use client";
/**
 * Travel Management Dashboard — Sprint 20
 * Submit, approve, and track travel requests.
 * Requirements: 20.1–20.6
 */
import { Suspense, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane, Plus, CheckCircle, XCircle } from "lucide-react";

// ─── Type Definitions ────────────────────────────────────────────────────────

type TravelStatus = "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED";

interface TravelRequest {
  id: string;
  employeeId: string;
  destination: string;
  purpose: string;
  departureDate: Date | string;
  returnDate: Date | string;
  estimatedCost: number | string;
  status: TravelStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface TravelFormData {
  employeeId: string;
  destination: string;
  purpose: string;
  departureDate: string;
  returnDate: string;
  estimatedCost: string;
}

interface SummaryStat {
  label: string;
  value: number;
  color: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<TravelStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-slate-100 text-slate-700",
};

const STATUS_LABELS: Record<TravelStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// ─── Component ──────────────────────────────────────────────────────────────

export default function TravelPage() {
  return (
    <Suspense fallback={
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    }>
      <TravelContent />
    </Suspense>
  );
}

function TravelContent() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<TravelFormData>({
    employeeId: "",
    destination: "",
    purpose: "",
    departureDate: "",
    returnDate: "",
    estimatedCost: "",
  });

  const { data: requests, refetch } = trpc.travel.list.useQuery({ take: 50 });
  const submit = trpc.travel.submit.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      // Reset form
      setForm({
        employeeId: "",
        destination: "",
        purpose: "",
        departureDate: "",
        returnDate: "",
        estimatedCost: "",
      });
    },
  });
  const approve = trpc.travel.approve.useMutation({
    onSuccess: () => refetch(),
  });
  const reject = trpc.travel.reject.useMutation({
    onSuccess: () => refetch(),
  });

  const pending = requests?.filter((r: TravelRequest) => r.status === "PENDING") ?? [];
  const approved = requests?.filter((r: TravelRequest) => r.status === "APPROVED") ?? [];

  const handleFormChange = <K extends keyof TravelFormData>(
    key: K,
    value: TravelFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const { employeeId, destination, purpose, departureDate, returnDate, estimatedCost } = form;
    
    if (!employeeId.trim() || !destination.trim() || !departureDate || !returnDate) return;

    submit.mutate({
      employeeId: employeeId.trim(),
      destination: destination.trim(),
      purpose: purpose.trim(),
      departureDate: new Date(departureDate),
      returnDate: new Date(returnDate),
      estimatedCost: estimatedCost ? Number(estimatedCost) : 0,
    });
  };

  const handleApprove = (id: string) => {
    approve.mutate({ id });
  };

  const handleReject = (id: string) => {
    reject.mutate({ id, reason: "Not approved" });
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  const formatCost = (cost: number | string): string => {
    const num = typeof cost === "string" ? parseFloat(cost) : cost;
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  const getStatusBadge = (status: TravelStatus): string => {
    return STATUS_BADGE[status] || "bg-slate-100 text-slate-700";
  };

  const getStatusLabel = (status: TravelStatus): string => {
    return STATUS_LABELS[status] || status;
  };

  const isPending = (status: TravelStatus): boolean => {
    return status === "PENDING";
  };

  const isFormValid = (): boolean => {
    return (
      form.employeeId.trim().length > 0 &&
      form.destination.trim().length > 0 &&
      form.departureDate.length > 0 &&
      form.returnDate.length > 0
    );
  };

  const summaryStats: SummaryStat[] = [
    { label: "Pending", value: pending.length, color: "text-yellow-600" },
    { label: "Approved", value: approved.length, color: "text-green-600" },
    { label: "Total", value: requests?.length ?? 0, color: "text-slate-700" },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Travel Management</h1>
            <p className="text-sm text-muted-foreground">Request and approve business travel</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> New Request
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Travel Request</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            <Input
              placeholder="Employee ID"
              value={form.employeeId}
              onChange={(e) => handleFormChange("employeeId", e.target.value)}
            />
            <Input
              placeholder="Destination"
              value={form.destination}
              onChange={(e) => handleFormChange("destination", e.target.value)}
            />
            <Input
              placeholder="Purpose"
              value={form.purpose}
              onChange={(e) => handleFormChange("purpose", e.target.value)}
            />
            <Input
              type="date"
              placeholder="Departure"
              value={form.departureDate}
              onChange={(e) => handleFormChange("departureDate", e.target.value)}
            />
            <Input
              type="date"
              placeholder="Return"
              value={form.returnDate}
              onChange={(e) => handleFormChange("returnDate", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Est. Cost (MYR)"
              value={form.estimatedCost}
              onChange={(e) => handleFormChange("estimatedCost", e.target.value)}
            />
            <div className="sm:col-span-2 md:col-span-3 flex gap-2">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid() || submit.isPending}
              >
                {submit.isPending ? "Submitting…" : "Submit Request"}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map(({ label, value, color }) => (
          <Card key={label} className="p-4">
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </Card>
        ))}
      </div>

      {/* Requests list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Travel Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {!requests?.length ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No travel requests
            </p>
          ) : (
            <div className="space-y-3">
              {(requests as TravelRequest[]).map((request: TravelRequest) => (
                <div key={request.id} className="border rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getStatusBadge(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                        <span className="font-medium text-sm">
                          {request.destination}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {request.purpose} · {formatDate(request.departureDate)} – {formatDate(request.returnDate)}
                        {Number(request.estimatedCost) > 0 && 
                          ` · Est. MYR ${formatCost(request.estimatedCost)}`
                        }
                      </div>
                    </div>
                    {isPending(request.status) && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(request.id)}
                          disabled={approve.isPending}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200"
                          onClick={() => handleReject(request.id)}
                          disabled={reject.isPending}
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </div>
                    )}
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