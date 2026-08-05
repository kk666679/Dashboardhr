"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-shell";
import { KpiCardGrid } from "@/components/modules/common/KpiCardGrid";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Activity,
  AlertTriangle,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  Target,
  BarChart3,
} from "lucide-react";

export default function AnalyticsPage() {
  const { useAnalyticsStats, useActiveUsers, useAlerts, useGeofences } = useGeolocation();
  const { data: stats, isLoading: statsLoading } = useAnalyticsStats();
  const { data: activeUsers } = useActiveUsers();
  const { data: alertsData } = useAlerts({ limit: 200 });
  const { data: geofences } = useGeofences();

  const alerts = alertsData?.alerts ?? [];

  // Alert severity distribution
  const severityCounts: Record<string, number> = {};
  alerts.forEach((a: any) => {
    severityCounts[a.severity] = (severityCounts[a.severity] ?? 0) + 1;
  });
  const severityChart = Object.entries(severityCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Alert type distribution
  const typeCounts: Record<string, number> = {};
  alerts.forEach((a: any) => {
    typeCounts[a.type] = (typeCounts[a.type] ?? 0) + 1;
  });
  const typeChart = Object.entries(typeCounts).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
  }));

  // Geofence type distribution
  const geofenceTypeCounts: Record<string, number> = {};
  geofences?.forEach((g: any) => {
    geofenceTypeCounts[g.type] = (geofenceTypeCounts[g.type] ?? 0) + 1;
  });
  const geofenceTypeChart = Object.entries(geofenceTypeCounts).map(([type, count]) => ({
    type,
    count,
  }));

  // Average battery per geofence (from active users)
  const avgBattery = activeUsers?.length
    ? Math.round(
        activeUsers.reduce((s: number, u: any) => s + (u.batteryLevel ?? 50), 0) /
          activeUsers.length
      )
    : 0;

  if (statsLoading) {
    return (
      <PageShell>
        <PageHeader title="Geolocation Analytics" description="Loading..." />
        <div className="grid grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Geolocation Analytics & Reports"
        description="Comprehensive analytics on worker movements, geofence compliance, and alert patterns"
      />

      <KpiCardGrid
        columns={4}
        items={[
          {
            label: "Total Location Updates",
            value: stats?.totalLocationUpdates ?? 0,
            sub: "Last 5 minutes",
            icon: <Activity className="h-4 w-4" />,
            color: "text-blue-600",
          },
          {
            label: "Pending Alerts",
            value: stats?.pendingAlerts ?? 0,
            sub: "Requiring attention",
            icon: <AlertTriangle className="h-4 w-4" />,
            color: stats?.pendingAlerts > 0 ? "text-red-600" : "text-green-600",
          },
          {
            label: "Active Geofences",
            value: stats?.activeGeofences ?? 0,
            sub: "Monitoring zones",
            icon: <MapPin className="h-4 w-4" />,
            color: "text-purple-600",
          },
          {
            label: "Active Trackers",
            value: stats?.activeTrackers ?? 0,
            sub: `Avg battery ${avgBattery}%`,
            icon: <Users className="h-4 w-4" />,
            color: "text-green-600",
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alert Severity Distribution */}
        <ChartCard
          title="Alert Severity Distribution"
          description="Breakdown by severity level"
          downloadData={severityChart}
          downloadFilename="alert-severity.csv"
        >
          <BarChart data={severityChart} xKey="name" yKey="value" />
        </ChartCard>

        {/* Alert Type Distribution */}
        <ChartCard
          title="Alert Types"
          description="Most common alert categories"
          downloadData={typeChart}
          downloadFilename="alert-types.csv"
        >
          <BarChart data={typeChart} xKey="name" yKey="value" />
        </ChartCard>

        {/* Geofence Type Distribution */}
        {geofenceTypeChart.length > 0 && (
          <ChartCard
            title="Geofence Type Distribution"
            description="Zones by type"
            downloadData={geofenceTypeChart}
            downloadFilename="geofence-types.csv"
          >
            <BarChart data={geofenceTypeChart} xKey="type" yKey="count" />
          </ChartCard>
        )}

        {/* Compliance Overview */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-600" />
              Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Geofence Compliance</span>
                  <span className="font-medium">
                    {geofences?.length
                      ? `${Math.round(
                          (geofences.filter((g: any) => g.isActive).length / geofences.length) * 100
                        )}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all"
                    style={{
                      width: geofences?.length
                        ? `${(geofences.filter((g: any) => g.isActive).length / geofences.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Alert Resolution Rate</span>
                  <span className="font-medium">
                    {alerts.length
                      ? `${Math.round((alerts.filter((a: any) => a.isResolved).length / alerts.length) * 100)}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{
                      width: alerts.length
                        ? `${(alerts.filter((a: any) => a.isResolved).length / alerts.length) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Online Rate</span>
                  <span className="font-medium">
                    {activeUsers?.length ? `${activeUsers.length} online` : "N/A"}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (activeUsers?.length ?? 0) * 10)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Row */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-green-50 border border-green-200">
              <p className="font-medium text-green-800">Active Monitoring</p>
              <p className="text-green-600 text-xs mt-1">
                {activeUsers?.length ?? 0} workers being tracked across {geofences?.length ?? 0} geofences
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
              <p className="font-medium text-orange-800">Alert Activity</p>
              <p className="text-orange-600 text-xs mt-1">
                {stats?.pendingAlerts ?? 0} unresolved alerts requiring attention
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
              <p className="font-medium text-blue-800">Coverage Area</p>
              <p className="text-blue-600 text-xs mt-1">
                Real-time monitoring with {stats?.totalLocationUpdates ?? 0} location updates
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}

