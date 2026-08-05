"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface CoverageDashboardProps {
  data: { date: string; required: number; actual: number }[];
  gaps: { date: string; gap: number }[];
}

export function CoverageDashboard({ data, gaps }: CoverageDashboardProps) {
  const totalGap = gaps.reduce((sum, g) => sum + g.gap, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Gap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGap}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Days with Gap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gaps.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Coverage Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.length ? Math.round((1 - totalGap / data.reduce((s, d) => s + d.required, 0)) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coverage vs Requirement</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="required" fill="#94a3b8" />
              <Bar dataKey="actual" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
