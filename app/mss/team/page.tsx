"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useState } from "react";

export default function MssTeamPage() {
  const [deptId, setDeptId] = useState("");
  const { data: breakdown } = trpc.analytics.getDepartmentBreakdown.useQuery();
  const { data: skillMatrix } = trpc.lms.getSkillMatrix.useQuery(
    { departmentId: deptId },
    { enabled: !!deptId }
  );

  const depts = breakdown ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2"><Users className="h-5 w-5 text-blue-600" /> My Team</h1>

      {/* Department breakdown */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Department Overview</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                {["Department", "Headcount", "Foreign", "Male", "Female"].map(h => (
                  <th key={h} className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {depts.map(d => (
                <tr key={d.department} className="border-b hover:bg-muted/20 cursor-pointer" onClick={() => setDeptId(d.department)}>
                  <td className="px-4 py-2.5 font-medium">{d.department}</td>
                  <td className="px-4 py-2.5">{d.total}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{d.foreign}</td>
                  <td className="px-4 py-2.5">{d.male}</td>
                  <td className="px-4 py-2.5">{d.female}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Skill matrix */}
      {skillMatrix && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Skill Matrix — {deptId}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {skillMatrix.skills.map(s => (
              <div key={s.skill} className="flex items-center gap-3">
                <span className="text-sm w-40 truncate">{s.skill}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.coveragePct >= 75 ? "bg-green-500" : s.coveragePct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${s.coveragePct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">{s.coveragePct}%</span>
                {s.coveragePct < 50 && <span className="text-xs text-red-600 font-medium">GAP</span>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
