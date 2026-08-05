"use client";

import { useGeolocation } from "@/hooks/useGeolocation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-shell";
import { StatCard } from "@/components/layout/page-shell";
import { KpiCardGrid } from "@/components/modules/common/KpiCardGrid";
import { ChartCard } from "@/components/charts/ChartCard";
import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  Activity,
  MapPin,
  Users,
  AlertTriangle,
  Satellite,
  Navigation,
  Target,
  Clock,
  Settings,
  History,
  BarChart3,
  ArrowRight,
  Shield,
  Battery,
  Signal,
  Globe,
  RefreshCw,
} from "lucide-react";

export default function GeolocationHubPage() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || "en";

  const {
    useAnalyticsStats,
    useActiveUsers,
    useAlerts,
    useGeofences,
  } = useGeolocation();

  const { data: stats, isLoading: statsLoading } = useAnalyticsStats();
  const { data: activeUsers, isLoading: usersLoading } = useActiveUsers();
  const { data: alertsData, isLoading: alertsLoading } = useAlerts({ limit: 5 });
  const { data: geofences, isLoading: geofencesLoading } = useGeofences();

  const navTo = (path: string) => router.push(`/${locale}/dashboard/geolocation/${path}`);

  // Count alerts by severity
  const criticalAlerts = alertsData?.alerts?.filter((a: any) => a.severity === "CRITICAL").length ?? 0;
  const totalAlerts = alertsData?.total ?? 0;
  const activeGeofenceCount = geofences?.length ?? 0;
  const onlineUsers = activeUsers?.length ?? 0;

  if (statsLoading && usersLoading && alertsLoading && geofencesLoading) {
    return (
      <PageShell>
        <PageHeader title="Geolocation Dashboard" description="Loading..." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Geolocation"
        description="Real-time worker location tracking, geofence management, and location-based insights"
        badge={
          <span className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        }
      />

      {/* KPI Cards */}
      <KpiCardGrid
        columns={4}
        items={[
          {
            label: "Active Trackers",
            value: stats?.activeTrackers ?? 0,
            sub: "Updated in last 5 minutes",
            icon: <Activity className="h-4 w-4" />,
            color: "text-blue-600",
            loading: statsLoading,
          },
          {
            label: "Pending Alerts",
            value: stats?.pendingAlerts ?? 0,
            sub: `${criticalAlerts} critical • ${totalAlerts - criticalAlerts} normal`,
            icon: <AlertTriangle className="h-4 w-4" />,
            color: criticalAlerts > 0 ? "text-red-600" : "text-orange-600",
            loading: alertsLoading,
          },
          {
            label: "Online Workers",
            value: onlineUsers,
            sub: "Currently tracking",
            icon: <Users className="h-4 w-4" />,
            color: "text-green-600",
            loading: usersLoading,
          },
          {
            label: "Active Geofences",
            value: activeGeofenceCount,
            sub: "Monitoring zones",
            icon: <MapPin className="h-4 w-4" />,
            color: "text-purple-600",
            loading: geofencesLoading,
          },
        ]}
      />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-blue-500 hover:-translate-y-0.5"
          onClick={() => navTo("live-tracking")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Satellite className="h-4 w-4 text-blue-600" />
              Live Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-2">
              View real-time worker positions, movement trails, and device status
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Battery className="h-3 w-3" /> Battery
              </span>
              <span className="flex items-center gap-1">
                <Signal className="h-3 w-3" /> Signal
              </span>
              <ArrowRight className="h-3 w-3 ml-auto text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-purple-500 hover:-translate-y-0.5"
          onClick={() => navTo("geofences")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              Geofence Manager
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-2">
              Create and manage location boundaries, restricted zones, and automated alerts
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{activeGeofenceCount} active zones</span>
              <ArrowRight className="h-3 w-3 ml-auto text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-orange-500 hover:-translate-y-0.5"
          onClick={() => navTo("alerts")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Alert Center
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-2">
              Monitor, acknowledge, and resolve location-based alerts and emergencies
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className={criticalAlerts > 0 ? "text-red-600" : "text-orange-600"}>
                {totalAlerts} pending ({criticalAlerts} critical)
              </span>
              <ArrowRight className="h-3 w-3 ml-auto text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-green-500 hover:-translate-y-0.5"
          onClick={() => navTo("history")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              Location History
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-2">
              Browse and export historical location data with timeline playback
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowRight className="h-3 w-3 ml-auto text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-indigo-500 hover:-translate-y-0.5"
          onClick={() => navTo("analytics")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              Analytics & Reports
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-2">
              Heatmaps, dwell time analysis, occupancy trends, and compliance reports
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowRight className="h-3 w-3 ml-auto text-indigo-500" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-md transition-all border-l-4 border-l-gray-500 hover:-translate-y-0.5"
          onClick={() => navTo("settings")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-600" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-xs text-muted-foreground mb-2">
              Configure update intervals, privacy levels, retention policies, and alerts
            </p>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowRight className="h-3 w-3 ml-auto text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {alertsData?.alerts && alertsData.alerts.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Recent Alerts
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => navTo("alerts")}>
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alertsData.alerts.slice(0, 5).map((alert: any) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-2 rounded-lg border text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Shield className={`h-3 w-3 ${
                      alert.severity === "CRITICAL" ? "text-red-500" :
                      alert.severity === "HIGH" ? "text-orange-500" : "text-yellow-500"
                    }`} />
                    <span className="font-medium">{alert.type.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground">
                      {alert.employee?.name ?? "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      alert.severity === "CRITICAL" ? "bg-red-100 text-red-700" :
                      alert.severity === "HIGH" ? "bg-orange-100 text-orange-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Workers Map Preview */}
      {activeUsers && activeUsers.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                Online Workers
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => navTo("live-tracking")}>
                Live Map <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {activeUsers.slice(0, 12).map((user: any) => (
                <div key={user.userId} className="flex items-center gap-2 p-2 rounded-lg border text-xs">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-medium truncate">{user.userName}</span>
                </div>
              ))}
              {activeUsers.length > 12 && (
                <div className="flex items-center justify-center p-2 rounded-lg border text-xs text-muted-foreground">
                  +{activeUsers.length - 12} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </PageShell>
  );
}

