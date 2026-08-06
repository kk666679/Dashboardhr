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
import { useQueries } from "@tanstack/react-query";
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
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
  }, []);

  const utils = trpc.useUtils();

  const queries = useQueries({
    queries: days.map((date) => ({
      queryKey: ["attendance", "getDailySummary", date.toISOString()],
      queryFn: () => utils.attendance.getDailySummary.fetch({ date }),
      staleTime: 60_000,
    })),
  });

  const isLoading = queries.some((q) => q.isLoading);

  const data: ActivityDatum[] = queries.map((q, idx) => ({
    name: formatDayShort(days[idx]),
    users: q.data?.present ?? 0,
    sessions: q.data ? Math.round(Number(q.data.overtime) * 10) / 10 : 0,
  }));

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
