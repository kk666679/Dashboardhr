"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Plus, ArrowLeft, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const STATUS_BADGE: Record<string, string> = {
  SCHEDULED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  MISSED: "bg-red-100 text-red-800",
  PENDING: "bg-yellow-100 text-yellow-800",
};

export default function FomemaSchedulePage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    workerId: "",
    scheduledDate: "",
    clinic: "",
    notes: "",
  });

  // FOMEMA scheduling uses the medical/fomema router when available
  const { data: records, isLoading } = trpc.medical.getFomemaRecords.useQuery(
    { take: 50 },
    { enabled: false }
  );

  const mockScheduled = [
    {
      id: "FOM-SCH-001",
      workerId: "WKR-0012",
      workerName: "Ahmad bin Razak",
      scheduledDate: "2024-02-10",
      clinic: "Klinik Kesihatan Petaling Jaya",
      status: "SCHEDULED",
    },
    {
      id: "FOM-SCH-002",
      workerId: "WKR-0045",
      workerName: "Ravi a/l Subramaniam",
      scheduledDate: "2024-02-14",
      clinic: "Panel Clinic Shah Alam",
      status: "SCHEDULED",
    },
    {
      id: "FOM-SCH-003",
      workerId: "WKR-0067",
      workerName: "Nguyen Van Thanh",
      scheduledDate: "2024-01-28",
      clinic: "Klinik Kesihatan Klang",
      status: "COMPLETED",
    },
    {
      id: "FOM-SCH-004",
      workerId: "WKR-0078",
      workerName: "Md. Karim Hossain",
      scheduledDate: "2024-01-20",
      clinic: "Panel Clinic KL",
      status: "MISSED",
    },
  ];

  const upcoming = mockScheduled.filter((r) => r.status === "SCHEDULED");
  const completed = mockScheduled.filter((r) => r.status === "COMPLETED");
  const missed = mockScheduled.filter((r) => r.status === "MISSED");

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/medical/fomema">
              <ArrowLeft className="h-4 w-4 mr-1" /> FOMEMA
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">FOMEMA Schedule</h1>
              <p className="text-sm text-muted-foreground">
                Schedule and track FOMEMA medical examinations
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" /> Schedule Examination
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{upcoming.length}</div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">{completed.length}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <div className="text-2xl font-bold text-red-600">{missed.length}</div>
              <div className="text-xs text-muted-foreground">Missed</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Schedule form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schedule FOMEMA Examination</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Worker ID</Label>
              <Input
                placeholder="e.g. WKR-0012"
                value={form.workerId}
                onChange={(e) => setForm((f) => ({ ...f, workerId: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Examination Date</Label>
              <Input
                type="date"
                value={form.scheduledDate}
                onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Clinic</Label>
              <Input
                placeholder="Panel clinic name"
                value={form.clinic}
                onChange={(e) => setForm((f) => ({ ...f, clinic: e.target.value }))}
              />
            </div>
            <div className="space-y-1">
              <Label>Notes (optional)</Label>
              <Input
                placeholder="Any additional notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2 flex gap-2">
              <Button disabled={!form.workerId || !form.scheduledDate}>
                Schedule
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Examination Schedule</CardTitle>
          <CardDescription>All scheduled and past FOMEMA examinations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockScheduled.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between border rounded-lg p-3 gap-3 flex-wrap"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={STATUS_BADGE[record.status] ?? ""}>
                      {record.status}
                    </Badge>
                    <span className="font-medium text-sm">{record.workerName}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {record.workerId}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {record.clinic}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium">
                    {new Date(record.scheduledDate).toLocaleDateString("en-MY", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
