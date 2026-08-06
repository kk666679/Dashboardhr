"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, BarChart, ChartCard } from "@/components/charts";
import { TrendingUp, Users, AlertTriangle, Lightbulb, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const HEADCOUNT_FORECAST = [
  { month: "Aug", current: 42, forecast: 42, demand: 44 },
  { month: "Sep", current: 42, forecast: 43, demand: 46 },
  { month: "Oct", current: 42, forecast: 44, demand: 48 },
  { month: "Nov", current: 42, forecast: 44, demand: 50 },
  { month: "Dec", current: 42, forecast: 45, demand: 51 },
  { month: "Jan", current: 42, forecast: 46, demand: 53 },
];

const SKILL_DEMAND = [
  { skill: "Cloud / AWS", current: 3, demand: 8, gap: 5 },
  { skill: "Data Engineering", current: 2, demand: 5, gap: 3 },
  { skill: "React / Next.js", current: 7, demand: 9, gap: 2 },
  { skill: "DevOps / CI-CD", current: 2, demand: 4, gap: 2 },
  { skill: "Product Management", current: 1, demand: 3, gap: 2 },
];

const SCENARIOS = [
  { id: "base", label: "Base Case", description: "Current trajectory, no changes" },
  { id: "growth20", label: "+20% Workload", description: "Simulate 20% demand increase" },
  { id: "attrition", label: "High Attrition", description: "3 key departures in 90 days" },
  { id: "mobility", label: "Internal Mobility", description: "Fill gaps via internal transfers" },
];

export function WorkforcePlanning() {
  const [workloadDelta, setWorkloadDelta] = useState([0]);
  const [scenario, setScenario] = useState("base");
  const [simResult, setSimResult] = useState<string | null>(null);

  function runSimulation() {
    const delta = workloadDelta[0]!;
    if (delta > 15) {
      setSimResult(`⚠️ At +${delta}% workload, your team will be over capacity by October. You need 4–6 additional hires or must defer 2 projects. Internal mobility can cover ~30% of the gap.`);
    } else if (delta > 0) {
      setSimResult(`✅ At +${delta}% workload, the team can absorb demand through Q4 with overtime management. Monitor burnout indicators closely.`);
    } else {
      setSimResult(`📊 Current capacity is sufficient for the next 90 days. Consider upskilling 3 engineers in cloud architecture to prepare for Q1 2027 roadmap.`);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workforce Planning</h1>
        <p className="text-sm text-muted-foreground mt-0.5">AI-driven headcount forecasting and scenario modelling</p>
      </div>

      {/* Headcount Forecast */}
      <ChartCard title="Headcount Forecast vs. Demand (6-month)">
        <LineChart
          data={HEADCOUNT_FORECAST}
          xKey="month"
          yKey={["current", "forecast", "demand"]}
        />
      </ChartCard>

      {/* Skill Demand Gap */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Skill Supply vs. Demand Gap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {SKILL_DEMAND.map((s) => (
            <div key={s.skill} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{s.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{s.current} / {s.demand} needed</span>
                  <Badge className={cn("text-[10px] border-0", s.gap >= 4 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700")}>
                    -{s.gap} gap
                  </Badge>
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.current / s.demand) * 100}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Scenario Planner */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-violet-600" />
            Scenario Planner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <div className="grid grid-cols-2 gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenario(s.id)}
                className={cn(
                  "text-left rounded-lg border p-3 transition-colors text-sm",
                  scenario === s.id ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30" : "hover:bg-muted/40"
                )}
              >
                <div className="font-medium text-xs">{s.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.description}</div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Workload change</span>
              <span className="text-muted-foreground font-mono">{workloadDelta[0]! > 0 ? "+" : ""}{workloadDelta[0]}%</span>
            </div>
            <Slider
              value={workloadDelta}
              onValueChange={setWorkloadDelta}
              min={-20}
              max={50}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>-20%</span><span>0%</span><span>+50%</span>
            </div>
          </div>

          <Button onClick={runSimulation} className="w-full bg-violet-600 hover:bg-violet-700">
            <Play className="h-3.5 w-3.5 mr-2" /> Run Simulation
          </Button>

          {simResult && (
            <div className="rounded-lg bg-muted/60 border p-3 text-sm">
              {simResult}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget Impact */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Budget Impact Simulation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Current Payroll", value: "RM 284K", sub: "monthly" },
              { label: "Projected (6M)", value: "RM 312K", sub: "+9.8% growth" },
              { label: "Hiring Budget", value: "RM 45K", sub: "remaining" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-lg bg-muted/40 p-3">
                <div className="text-lg font-bold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="text-[10px] text-muted-foreground">{sub}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
