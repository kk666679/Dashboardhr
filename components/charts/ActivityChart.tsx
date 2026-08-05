"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { trpc } from "@/lib/trpc";

type ActivityDatum = {
  name: string;
  users: number;
  sessions: number;
};

function formatDayShort(d: Date) {
  return d.toLocaleDateString(undefined, { weekday: "short" });
}

export function ActivityChart() {
  const days = React.useMemo(() => {
    const now = new Date();
    const list: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      list.push(d);
    }
    return list;
  }, []);

  const q0 = trpc.attendance.getDailySummary.useQuery({ date: days[0] });
  const q1 = trpc.attendance.getDailySummary.useQuery({ date: days[1] });
  const q2 = trpc.attendance.getDailySummary.useQuery({ date: days[2] });
  const q3 = trpc.attendance.getDailySummary.useQuery({ date: days[3] });
  const q4 = trpc.attendance.getDailySummary.useQuery({ date: days[4] });
  const q5 = trpc.attendance.getDailySummary.useQuery({ date: days[5] });
  const q6 = trpc.attendance.getDailySummary.useQuery({ date: days[6] });

  const queries = [q0, q1, q2, q3, q4, q5, q6];

  const isLoading = queries.some((q) => q.isLoading);

  const data: ActivityDatum[] = queries.map((q, idx) => {
    const date = days[idx];
    const summary = q.data;
    return {
      name: formatDayShort(date),
      users: summary?.present ?? 0,
      sessions: summary ? Math.round(Number(summary.overtime) * 10) / 10 : 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={isLoading ? [] : data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="usersColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sessionsColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Area type="monotone" dataKey="users" stroke="#6366f1" fillOpacity={1} fill="url(#usersColor)" />
        <Area type="monotone" dataKey="sessions" stroke="#22c55e" fillOpacity={1} fill="url(#sessionsColor)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
