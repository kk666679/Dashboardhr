"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";
import { useState } from "react";

export default function MssTeamPage() {
  const [deptId, setDeptId] = useState("");
  const { data: breakdown, isLoading: isLoadingDepts } = trpc.analytics.getDepartmentBreakdown.useQuery({}, { enabled: true });
  const { data: skillMatrix, isLoading: isLoadingSkills } = trpc.lms.getSkillMatrix.useQuery(
    { departmentId: deptId },
    { enabled: !!deptId }
  );

  const depts = breakdown ?? [];
  const isLoading = isLoadingDepts || (!!deptId && isLoadingSkills);

  if (isLoadingDepts) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-600" /> My Team
      </h1>

      {/* Department breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Department Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Department</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Headcount</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Foreign</th>
                </tr>
              </thead>
              <tbody>
                {depts.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No department data available
                    </td>
                  </tr>
                ) : (
                  depts.map((d) => (
                    <tr
                      key={d.department}
                      className="border-b hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => setDeptId(d.department)}
                    >
                      <td className="px-4 py-2.5 font-medium">{d.department}</td>
                      <td className="px-4 py-2.5">{d.total}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{d.foreign}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Skill matrix */}
      {skillMatrix && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Skill Matrix — {deptId}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {skillMatrix.skills.map((s) => (
              <div key={s.skill} className="flex items-center gap-3">
                <span className="text-sm w-40 truncate font-medium">{s.skill}</span>
                <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.coveragePct >= 75 ? "bg-green-500" : s.coveragePct >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${s.coveragePct}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{s.coveragePct}%</span>
                {s.coveragePct < 50 && (
                  <Badge variant="destructive" className="text-[10px] h-5">GAP</Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
