"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function MssAttendancePage() {
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]!);
  const { data: summary } = trpc.attendance.getDailySummary.useQuery({ date: new Date(date) });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2"><Calendar className="h-5 w-5 text-green-600" /> Team Attendance</h1>

      <div className="flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border rounded px-2 py-1.5 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Present",  value: summary?.present,  color: "text-green-600" },
          { label: "Absent",   value: summary?.absent,   color: "text-red-600" },
          { label: "Late",     value: summary?.late,     color: "text-yellow-600" },
          { label: "On Leave", value: summary?.onLeave,  color: "text-blue-600" },
          { label: "Overtime", value: summary?.overtime, color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-4 text-center">
            <div className={`text-2xl font-bold ${color}`}>{value ?? "—"}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
