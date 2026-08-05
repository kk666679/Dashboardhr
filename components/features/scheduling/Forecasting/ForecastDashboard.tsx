"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ForecastDashboardProps {
  historical: { date: string; headcount: number }[];
  predicted: { date: string; headcount: number; lower?: number; upper?: number }[];
}

export function ForecastDashboard({ historical, predicted }: ForecastDashboardProps) {
  const combined = [...historical, ...predicted];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Headcount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {historical.length ? historical[historical.length - 1].headcount : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Forecasted (Next Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {predicted.length ? predicted[predicted.length - 1].headcount : 0}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Headcount Forecast</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combined}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="headcount" stroke="#3b82f6" strokeWidth={2} />
              {predicted.length > 0 && predicted[0].lower && (
                <Line type="monotone" dataKey="lower" stroke="#94a3b8" strokeDasharray="5 5" />
              )}
              {predicted.length > 0 && predicted[0].upper && (
                <Line type="monotone" dataKey="upper" stroke="#94a3b8" strokeDasharray="5 5" />
              )}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
