"use client";
/**
 * Workforce Planning dashboard — Sprint 28, Task 28.3
 * Demand-supply gap, headcount plan, 12-month forecast.
 * Requirements: 21.3, 21.4, 23.7
 */
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { Users, TrendingUp, AlertTriangle } from "lucide-react";

export default function WorkforcePlanningPage() {
  const { data: headcount }  = trpc.analytics.getHeadcountSummary.useQuery({});
  const { data: forecast }   = trpc.ai.getWorkforceForecast.useQuery({ annualGrowthTarget: 0.05 });
  const { data: turnover }   = trpc.analytics.getTurnoverRate.useQuery({ months: 12 });
  const { data: breakdown }  = trpc.analytics.getDepartmentBreakdown.useQuery();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Users className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Workforce Planning</h1>
          <p className="text-sm text-muted-foreground">Headcount analysis · Gap identification · 12-month forecast</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Headcount",   value: headcount?.total,    color: "text-blue-600" },
          { label: "Active Employees",  value: headcount?.active,   color: "text-green-600" },
          { label: "Annual Turnover",   value: turnover ? `${turnover.turnoverRatePct}%` : "—", color: "text-red-500" },
          { label: "12M Net Change",    value: forecast ? (forecast.netChange >= 0 ? `+${forecast.netChange}` : forecast.netChange) : "—", color: "text-purple-600" },
        ].map(({ label, value, color }) => (
          <Card key={label} className="p-4">
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className={`text-2xl font-bold mt-1 ${color}`}>{value ?? "—"}</div>
          </Card>
        ))}
      </div>

      {/* 12-Month forecast chart */}
      {forecast && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" /> 12-Month Headcount Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={forecast.months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="projected"    name="Projected"    stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="hiringRequired" name="Hires Needed" stroke="#16a34a" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
            {forecast.insights.length > 0 && (
              <div className="mt-3 space-y-1">
                {forecast.insights.map((i, idx) => (
                  <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-blue-500 shrink-0">•</span> {i}
                  </p>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Department breakdown */}
      {breakdown && breakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={breakdown.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="department" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="total" name="Headcount" fill="#2563eb" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
