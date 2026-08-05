"use client";

/**
 * SmartAnalytics — HR-domain AI-powered analytics panel
 * Tabs: Predictive · Workforce · Anomaly · Compliance
 * Leverages ai-elements: Reasoning, Suggestion, ConversationTypingIndicator
 */

import { useState, useCallback } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Cell, PieChart, Pie,
} from "recharts";
import {
  Brain, AlertTriangle, TrendingUp, TrendingDown,
  BarChart2, Shield, Users, DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import { ConversationTypingIndicator } from "@/components/ai-elements/conversation";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "predictive" | "workforce" | "anomaly" | "compliance";

// ─── Palette ──────────────────────────────────────────────────────────────────

const P = {
  blue:   "#00d4ff",
  purple: "#7c5cfc",
  green:  "#00d68f",
  amber:  "#ffaa00",
  red:    "#ff4d6d",
  muted:  "#4d5468",
  text:   "#f0f2f7",
  sub:    "#8b92a9",
  bg:     "#0f1117",
  card:   "#161820",
  border: "rgba(255,255,255,0.06)",
};

// ─── Shared tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number | null; color?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs shadow-xl" style={{ background: P.card, border: `1px solid ${P.border}`, color: P.text, fontFamily: "monospace" }}>
      {label && <div className="mb-1" style={{ color: P.sub }}>{label}</div>}
      {payload.map((p, i) => p.value !== null && (
        <div key={i} style={{ color: p.color ?? P.text }}>
          {p.name}: <span className="font-bold">{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const turnoverForecast = [
  { month: "Jan", actual: 8.2,  forecast: null, lower: null, upper: null },
  { month: "Feb", actual: 7.8,  forecast: null, lower: null, upper: null },
  { month: "Mar", actual: 9.1,  forecast: null, lower: null, upper: null },
  { month: "Apr", actual: 8.4,  forecast: null, lower: null, upper: null },
  { month: "May", actual: 7.6,  forecast: null, lower: null, upper: null },
  { month: "Jun", actual: 8.0,  forecast: null, lower: null, upper: null },
  { month: "Jul", actual: null, forecast: 7.4, lower: 6.8,  upper: 8.0  },
  { month: "Aug", actual: null, forecast: 7.0, lower: 6.3,  upper: 7.7  },
  { month: "Sep", actual: null, forecast: 6.8, lower: 6.0,  upper: 7.6  },
  { month: "Oct", actual: null, forecast: 6.5, lower: 5.7,  upper: 7.3  },
];

const mlInsights = [
  { title: "Turnover Forecast", value: "6.5%", desc: "Model predicts turnover will decline to 6.5% by Q4 if retention bonus program proceeds as planned.", color: P.green, conf: 78 },
  { title: "Leave Spike Risk", value: "HIGH", desc: "Peak leave demand expected Aug–Sep (school holidays). 34% probability of understaffing in Operations.", color: P.amber, conf: 71 },
  { title: "Payroll Cost Trend", value: "+4.2%", desc: "Headcount growth + EPF rate adjustments will push payroll 4.2% higher by Q3 vs budget baseline.", color: P.red, conf: 83 },
];

const headcountByDept = [
  { dept: "Operations", total: 142, foreign: 68 },
  { dept: "Engineering", total: 58, foreign: 12 },
  { dept: "Finance", total: 31, foreign: 0 },
  { dept: "HR", total: 18, foreign: 0 },
  { dept: "Logistics", total: 47, foreign: 23 },
  { dept: "QC", total: 34, foreign: 15 },
];

const attendanceHeatmapData = [
  { day: "Mon", hour: "08:00", value: 94 }, { day: "Mon", hour: "09:00", value: 98 },
  { day: "Mon", hour: "17:00", value: 72 }, { day: "Tue", hour: "08:00", value: 91 },
  { day: "Tue", hour: "09:00", value: 96 }, { day: "Wed", hour: "08:00", value: 88 },
  { day: "Wed", hour: "13:00", value: 76 }, { day: "Thu", hour: "08:00", value: 92 },
  { day: "Fri", hour: "08:00", value: 85 }, { day: "Fri", hour: "16:00", value: 61 },
];

const anomalyPoints = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  value: 88 + (Math.random() - 0.5) * 12,
  anomaly: i === 13 || i === 23,
  note: i === 13 ? "Sudden absence spike — public holiday" : i === 23 ? "Overtime surge — production rush" : null,
}));

const complianceDomains = [
  { domain: "EPF/SOCSO",      score: 98, subject: "contribution" },
  { domain: "Work Permit",    score: 87, subject: "expiry" },
  { domain: "FOMEMA",         score: 92, subject: "medical" },
  { domain: "PDPA",           score: 76, subject: "data" },
  { domain: "OSH",            score: 89, subject: "safety" },
  { domain: "ISO 9001",       score: 82, subject: "quality" },
];

const radarData = complianceDomains.map((d) => ({ subject: d.domain, score: d.score, benchmark: 90 }));

// ─── Predictive tab ───────────────────────────────────────────────────────────

function PredictiveTab({ onSuggest }: { onSuggest: (s: string) => void }) {
  return (
    <div className="space-y-4">
      {/* ML insight cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {mlInsights.map((ins) => (
          <div key={ins.title} className="rounded-xl p-4" style={{ background: `${ins.color}08`, border: `1px solid ${ins.color}20` }}>
            <div className="flex items-center gap-2 mb-2">
              <Brain size={13} style={{ color: ins.color }} />
              <span className="text-xs font-semibold" style={{ color: P.text }}>{ins.title}</span>
            </div>
            <div className="text-2xl font-bold mb-2 font-mono" style={{ color: ins.color }}>{ins.value}</div>
            <p className="text-xs leading-relaxed mb-3" style={{ color: P.sub }}>{ins.desc}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                <div className="h-full rounded-full" style={{ width: `${ins.conf}%`, background: ins.color }} />
              </div>
              <span className="text-xs font-mono" style={{ color: P.muted }}>{ins.conf}% conf.</span>
            </div>
          </div>
        ))}
      </div>

      {/* Turnover forecast chart */}
      <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: P.text }}>Turnover Rate Forecast — H2</div>
            <div className="text-xs mt-0.5" style={{ color: P.muted }}>Historical + ML prediction with 80% CI</div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5" style={{ color: P.sub }}><span className="w-4 h-0.5 inline-block rounded" style={{ background: P.blue }} />Actual</span>
            <span className="flex items-center gap-1.5" style={{ color: P.sub }}><span className="w-4 h-0.5 inline-block rounded border-dashed border-b" style={{ borderColor: P.purple }} />Forecast</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={turnoverForecast}>
            <defs>
              <linearGradient id="ciHR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={P.purple} stopOpacity={0.15} />
                <stop offset="95%" stopColor={P.purple} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" />
            <XAxis dataKey="month" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#ciHR)" name="Upper CI" />
            <Area type="monotone" dataKey="lower" stroke="transparent" fill={P.bg} name="Lower CI" />
            <Line type="monotone" dataKey="actual" stroke={P.blue} strokeWidth={2} dot={{ fill: P.blue, r: 3 }} name="Actual %" connectNulls={false} />
            <Line type="monotone" dataKey="forecast" stroke={P.purple} strokeWidth={2} strokeDasharray="6 3" dot={{ fill: P.purple, r: 3 }} name="Forecast %" connectNulls={false} />
            <ReferenceLine y={7} stroke={P.green} strokeDasharray="4 4" label={{ value: "Target 7%", fill: P.green, fontSize: 10 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Suggestions */}
      <Suggestions>
        {["What drives the Aug leave spike?", "Show retention lever analysis", "EPF contribution forecast"].map((s) => (
          <Suggestion key={s} suggestion={s} onClick={onSuggest} />
        ))}
      </Suggestions>
    </div>
  );
}

// ─── Workforce tab ────────────────────────────────────────────────────────────

function WorkforceTab() {
  const max = Math.max(...headcountByDept.map((d) => d.total));
  return (
    <div className="space-y-4">
      {/* Dept bar chart */}
      <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
        <div className="text-sm font-semibold mb-1" style={{ color: P.text }}>Headcount by Department</div>
        <div className="text-xs mb-4" style={{ color: P.muted }}>Local vs foreign workers</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={headcountByDept} layout="vertical">
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="4 4" horizontal={false} />
            <XAxis type="number" tick={{ fill: P.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="dept" tick={{ fill: P.sub, fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="total" name="Local" fill={P.blue} radius={[0, 3, 3, 0]} />
            <Bar dataKey="foreign" name="Foreign" fill={P.amber} radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Foreign worker ratio ring */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-5" style={{ background: P.bg, border: `1px solid ${P.border}` }}>
          <div className="text-sm font-semibold mb-1" style={{ color: P.text }}>Workforce Composition</div>
          <div className="text-xs mb-3" style={{ color: P.muted }}>Local vs Foreign distribution</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={[{ name: "Local", value: 201 }, { name: "Foreign", value: 118 }]} cx="50%" cy="50%" innerRadius={45} outerRadius={65} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                <Cell fill={P.blue} />
                <Cell fill={P.amber} />
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* KPI tiles */}
        <div className="grid grid-cols-2 gap-2 content-start">
          {[
            { label: "Total Headcount",  value: "319", color: P.blue },
            { label: "Foreign Workers",  value: "118", color: P.amber },
            { label: "Avg Tenure (yr)",  value: "3.4", color: P.green },
            { label: "Active Permits",   value: "102", color: P.purple },
          ].map((k) => (
            <div key={k.label} className="rounded-xl p-3 flex flex-col gap-1" style={{ background: P.card, border: `1px solid ${P.border}` }}>
              <div className="text-xl font-bold font-mono" style={{ color: k.color }}>{k.value}</div>
              <div className="text-[10px]" style={{ color: P.muted }}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
