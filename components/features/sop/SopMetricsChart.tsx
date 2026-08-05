'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function SopMetricsChart() {
  const { data, isLoading } = trpc.sop.getMetrics.useQuery();

  if (isLoading) {
    return <div className="rounded-md border p-4 text-sm text-muted-foreground">Loading SOP metrics...</div>;
  }

  const averages = data?.averages ?? { complianceScore: 0, riskScore: 0, auditReadinessScore: 0 };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SOP Status</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.status ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Published Scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between"><span>Compliance</span><span>{averages.complianceScore}</span></div>
            <Progress value={averages.complianceScore} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Risk</span><span>{averages.riskScore}</span></div>
            <Progress value={averages.riskScore} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Audit readiness</span><span>{averages.auditReadinessScore}</span></div>
            <Progress value={averages.auditReadinessScore} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
