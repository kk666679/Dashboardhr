"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadarChart, BarChart, ChartCard } from "@/components/charts";
import { Heart, TrendingUp, TrendingDown, Minus, Send, Smile, Meh, Frown } from "lucide-react";
import { cn } from "@/lib/utils";

const PULSE_DATA = [
  { subject: "Engagement", score: 72 },
  { subject: "Wellbeing", score: 58 },
  { subject: "Inclusion", score: 81 },
  { subject: "Growth", score: 65 },
  { subject: "Recognition", score: 48 },
  { subject: "Workload", score: 54 },
];

const SENTIMENT_TREND = [
  { month: "Mar", positive: 68, neutral: 22, negative: 10 },
  { month: "Apr", positive: 71, neutral: 20, negative: 9 },
  { month: "May", positive: 65, neutral: 23, negative: 12 },
  { month: "Jun", positive: 62, neutral: 25, negative: 13 },
  { month: "Jul", positive: 69, neutral: 21, negative: 10 },
  { month: "Aug", positive: 74, neutral: 18, negative: 8 },
];

const EXPERIENCE_METRICS = [
  { label: "Manager Effectiveness", value: 78, trend: "up", delta: "+4pts" },
  { label: "Team Cohesion", value: 71, trend: "up", delta: "+2pts" },
  { label: "Work-Life Balance", value: 59, trend: "down", delta: "-6pts" },
  { label: "Career Growth Clarity", value: 63, trend: "neutral", delta: "0pts" },
  { label: "Psychological Safety", value: 76, trend: "up", delta: "+3pts" },
];

const TREND_ICONS = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const TREND_COLORS = {
  up: "text-emerald-600",
  down: "text-red-600",
  neutral: "text-muted-foreground",
};

export function WorkforceExperience() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Workforce Experience</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Engagement pulse, sentiment analysis, and team wellbeing</p>
      </div>

      {/* Overall Score */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Engagement Score", value: 72, icon: Smile, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20", status: "Good" },
          { label: "Wellbeing Index", value: 58, icon: Heart, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/20", status: "Needs Attention" },
          { label: "eNPS Score", value: 34, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20", status: "Moderate" },
        ].map(({ label, value, icon: Icon, color, bg, status }) => (
          <Card key={label} className={cn("border-0", bg)}>
            <CardContent className="p-4 text-center">
              <Icon className={cn("h-5 w-5 mx-auto mb-2", color)} />
              <div className={cn("text-2xl font-bold", color)}>{value}</div>
              <div className="text-xs font-medium mt-0.5">{label}</div>
              <Badge className="mt-1.5 text-[10px] border-0 bg-white/60 dark:bg-black/20 text-foreground">{status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Radar Chart */}
      <ChartCard title="Team Experience Radar">
        <RadarChart
          data={PULSE_DATA}
          xKey="subject"
          yKey="score"
        />
      </ChartCard>

      {/* Experience Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Experience Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {EXPERIENCE_METRICS.map((metric) => {
            const TrendIcon = TREND_ICONS[metric.trend as keyof typeof TREND_ICONS];
            return (
              <div key={metric.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{metric.label}</span>
                  <div className="flex items-center gap-1.5">
                    <TrendIcon className={cn("h-3.5 w-3.5", TREND_COLORS[metric.trend as keyof typeof TREND_COLORS])} />
                    <span className={cn("text-xs", TREND_COLORS[metric.trend as keyof typeof TREND_COLORS])}>{metric.delta}</span>
                    <span className="text-xs font-bold w-8 text-right">{metric.value}</span>
                  </div>
                </div>
                <Progress
                  value={metric.value}
                  className={cn("h-1.5",
                    metric.value >= 70 ? "[&>div]:bg-emerald-500" :
                    metric.value >= 55 ? "[&>div]:bg-amber-500" :
                    "[&>div]:bg-red-500"
                  )}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Sentiment Trend */}
      <ChartCard title="Team Sentiment Trend (6-month)">
        <BarChart
          data={SENTIMENT_TREND}
          xKey="month"
          yKey={["positive", "neutral", "negative"]}
        />
      </ChartCard>

      {/* Pulse Survey CTA */}
      <Card className="border-violet-200 bg-violet-50 dark:bg-violet-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Send Pulse Survey</p>
              <p className="text-xs text-muted-foreground mt-0.5">Last sent 14 days ago · 78% response rate</p>
            </div>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-xs">
              <Send className="h-3.5 w-3.5 mr-1.5" /> Send Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
