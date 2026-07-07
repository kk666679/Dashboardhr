"use client";

import { useState } from "react";
import { GlassmorphicCard, StaggerContainer, StaggerItem, SlideIn } from "@/components/GlassmorphicCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const analytics = {
    attendance: {
      rate: 94.2,
      trend: "+2.1%",
      onTime: 87.5,
      late: 8.3,
      absent: 4.2,
    },
    compliance: { overall: 96.8, geofence: 98.2, permits: 94.1, medical: 97.5 },
    productivity: { hoursWorked: 2847, overtime: 312, efficiency: 89.3 },
    locations: [
      { site: "Construction Site A", workers: 45, compliance: 98 },
      { site: "Manufacturing Plant B", workers: 32, compliance: 94 },
      { site: "Security Posts", workers: 18, compliance: 100 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Responsive page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Worker performance and compliance insights
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Glassmorphic KPI cards with stagger */}
      <StaggerContainer className="grid gap-6 grid-cols-2 lg:grid-cols-4">
        <StaggerItem>
          <GlassmorphicCard 
            gradient="from-emerald/20 via-teal/10 to-green/20" 
            blur="backdrop-blur-xl"
            animation="scale"
            className="h-[160px] border-white/30 shadow-2xl hover:shadow-3xl group"
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold text-white/95 tracking-wide">
                Attendance Rate
              </span>
              <Users className="h-5 w-5 text-emerald-400 shrink-0 opacity-90 drop-shadow-md" />
            </div>
            <div className="space-y-2 mt-1">
              <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 bg-clip-text text-transparent drop-shadow-2xl">
                {analytics.attendance.rate}%
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                <span className="text-emerald-300 font-bold">
                  {analytics.attendance.trend}
                </span> from last period
              </p>
            </div>
          </GlassmorphicCard>
        </StaggerItem>

        <StaggerItem>
          <GlassmorphicCard 
            gradient="from-indigo/20 via-blue/15 to-purple/20" 
            blur="backdrop-blur-xl"
            animation="scale"
            className="h-[160px] border-white/30 shadow-2xl hover:shadow-3xl"
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold text-white/95">
                Compliance Score
              </span>
              <CheckCircle className="h-5 w-5 text-blue-400 shrink-0 drop-shadow-md" />
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
                {analytics.compliance.overall}%
              </div>
              <Progress value={analytics.compliance.overall} className="mt-4 h-2 [&>div]:bg-gradient-to-r [&>div]:from-blue-400 [&>div]:to-indigo-400" />
            </div>
          </GlassmorphicCard>
        </StaggerItem>

        <StaggerItem>
          <GlassmorphicCard 
            gradient="from-violet/20 via-purple/15 to-fuchsia/20" 
            blur="backdrop-blur-xl"
            animation="scale"
            className="h-[160px] border-white/30 shadow-2xl hover:shadow-3xl"
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold text-white/95">
                Hours Worked
              </span>
              <Clock className="h-5 w-5 text-violet-400 shrink-0 drop-shadow-md" />
            </div>
            <div className="space-y-2 mt-1">
              <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                {analytics.productivity.hoursWorked.toLocaleString()}
              </div>
              <p className="text-xs text-white/80">
                +{analytics.productivity.overtime} overtime
              </p>
            </div>
          </GlassmorphicCard>
        </StaggerItem>

        <StaggerItem>
          <GlassmorphicCard 
            gradient="from-amber/20 via-orange/15 to-red/20" 
            blur="backdrop-blur-xl"
            animation="scale"
            className="h-[160px] border-white/30 shadow-2xl hover:shadow-3xl"
          >
            <div className="flex flex-row items-center justify-between pb-3">
              <span className="text-sm font-semibold text-white/95">
                Efficiency
              </span>
              <TrendingUp className="h-5 w-5 text-orange-400 shrink-0 drop-shadow-md" />
            </div>
            <div className="space-y-3">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-2xl">
                {analytics.productivity.efficiency}%
              </div>
              <Progress 
                value={analytics.productivity.efficiency}
                className="mt-4 h-2 [&>div]:bg-gradient-to-r [&>div]:from-orange-400 [&>div]:to-amber-400" 
              />
            </div>
          </GlassmorphicCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Charts — glassmorphic with stagger */}
      <StaggerContainer className="grid gap-8 grid-cols-1 md:grid-cols-2">
        <StaggerItem>
          <GlassmorphicCard 
            gradient="from-slate/10 via-blue/5 to-indigo/10" 
            blur="backdrop-blur-2xl"
            animation="fade"
            className="h-[300px] border-white/20 shadow-2xl hover:shadow-3xl p-1"
          >
            <div className="p-8 space-y-6 h-full flex flex-col">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  Attendance Breakdown
                </h3>
                <p className="text-sm text-white/80">Worker attendance patterns</p>
              </div>
              <div className="space-y-4 flex-1">
                {[
                  { label: "On Time", value: analytics.attendance.onTime },
                  { label: "Late Arrival", value: analytics.attendance.late },
                  { label: "Absent", value: analytics.attendance.absent },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <span className="text-base font-semibold text-white/95 w-28 shrink-0">
                      {row.label}
                    </span>
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                      <Progress value={row.value} className="flex-1 h-2 min-w-[80px] [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-blue-400 [&>div]:shadow-lg" />
                      <span className="text-lg font-mono text-white font-bold w-12 text-right shrink-0">
                        {row.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassmorphicCard>
        </StaggerItem>

        <StaggerItem>
          <GlassmorphicCard 
            gradient="from-indigo/10 via-purple/5 to-violet/10" 
            blur="backdrop-blur-2xl"
            animation="fade"
            className="h-[300px] border-white/20 shadow-2xl hover:shadow-3xl p-1"
          >
            <div className="p-8 space-y-6 h-full flex flex-col">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white drop-shadow-lg">
                  Compliance Metrics
                </h3>
                <p className="text-sm text-white/80">Regulatory compliance scores</p>
              </div>
              <div className="space-y-4 flex-1">
                {[
                  { label: "Geofence", value: analytics.compliance.geofence },
                  { label: "Permits", value: analytics.compliance.permits },
                  { label: "Medical", value: analytics.compliance.medical },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
                  >
                    <span className="text-base font-semibold text-white/95 w-24 shrink-0">
                      {row.label}
                    </span>
                    <div className="flex flex-1 items-center gap-4 min-w-0">
                      <Progress value={row.value} className="flex-1 h-2 min-w-[80px] [&>div]:bg-gradient-to-r [&>div]:from-indigo-400 [&>div]:to-purple-400 [&>div]:shadow-lg" />
                      <span className="text-lg font-mono text-white font-bold w-12 text-right shrink-0">
                        {row.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassmorphicCard>
        </StaggerItem>
      </StaggerContainer>

      <SlideIn delay={0.3}>
        <GlassmorphicCard 
          gradient="from-green/10 via-emerald/5 to-teal/10" 
          blur="backdrop-blur-2xl"
          animation="slide"
          className="max-w-4xl border-white/20 shadow-2xl hover:shadow-3xl p-1"
        >
          <div className="p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-white drop-shadow-xl flex items-center gap-2">
                <MapPin className="h-6 w-6 text-emerald-400" />
                Site Performance
              </h3>
              <p className="text-lg text-white/80">Worker distribution and compliance by location</p>
            </div>
            <div className="space-y-4 divide-y divide-white/10">
              {analytics.locations.map((loc, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="p-2 bg-emerald/20 rounded-2xl border border-emerald/30 shrink-0">
                      <MapPin className="h-6 w-6 text-emerald-400 drop-shadow-md" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xl font-bold text-white">{loc.site}</div>
                      <div className="text-lg text-emerald-200/90">{loc.workers} workers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 self-stretch">
                    <Progress value={loc.compliance} className="w-28 h-3 flex-1 [&>div]:bg-gradient-to-r [&>div]:from-emerald-400 [&>div]:to-teal-400 shadow-lg" />
                    <div className="text-right">
                      <Badge
                        variant={loc.compliance >= 95 ? "default" : "secondary"}
                        className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30 text-white shadow-lg"
                      >
                        {loc.compliance}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>

      <SlideIn delay={0.4}>
        <GlassmorphicCard 
          gradient="from-purple/15 via-violet/10 to-pink/15" 
          blur="backdrop-blur-2xl"
          animation="slide"
          className="max-w-3xl h-[300px] border-white/20 shadow-2xl hover:shadow-3xl p-1 flex items-center justify-center"
        >
          <div className="text-center space-y-6 p-12">
            <BarChart3 className="mx-auto h-20 w-20 text-white/60 drop-shadow-2xl animate-pulse" />
            <div className="space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-xl">
                Weekly Trends
              </h3>
              <p className="text-lg text-white/80 max-w-md mx-auto leading-relaxed">
                Performance trends over the selected period
              </p>
              <p className="text-xl font-medium text-purple-300 drop-shadow-lg">
                Interactive charts coming soon ✨
              </p>
            </div>
          </div>
        </GlassmorphicCard>
      </SlideIn>
    </div>
  );
}
