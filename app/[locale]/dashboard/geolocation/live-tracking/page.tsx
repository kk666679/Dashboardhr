"use client";

import { useState, useRef, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-shell";
import { StatCard } from "@/components/layout/page-shell";
import { KpiCardGrid } from "@/components/modules/common/KpiCardGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LeafletMap } from "@/components/features/geolocation/leaflet";
import { GeoJsonLayer } from "@/components/features/geolocation/geojson";
import { malaysiaWorksiteGeofences } from "@/lib/geolocation-utils";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import {
  RefreshCw,
  Users,
  MapPin,
  Battery,
  Signal,
  Satellite,
  Navigation,
  Activity,
  AlertTriangle,
} from "lucide-react";

export default function LiveTrackingPage() {
  const { useActiveUsers, useGeofences } = useGeolocation();
  const { data: activeUsers, isLoading, refetch } = useActiveUsers();
  const { data: geofences } = useGeofences({ isActive: true });
  const mapRef = useRef<L.Map | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleRefresh = () => {
    refetch();
  };

  const handleCenterOnUser = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 16, { animate: true });
    }
  };

  if (isLoading) {
    return (
      <PageShell>
        <PageHeader title="Live Tracking" description="Loading active users..." />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Live Tracking"
        description="Real-time GPS monitoring of workers with movement tracking and device health"
        actions={
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        }
        badge={
          <Badge variant="default" className="bg-green-500 text-white gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            {activeUsers?.length ?? 0} online
          </Badge>
        }
      />

      {/* Stats */}
      <KpiCardGrid
        columns={4}
        items={[
          {
            label: "Online Workers",
            value: activeUsers?.length ?? 0,
            icon: <Users className="h-4 w-4" />,
            color: "text-green-600",
          },
          {
            label: "Active Geofences",
            value: geofences?.length ?? 0,
            icon: <MapPin className="h-4 w-4" />,
            color: "text-purple-600",
          },
          {
            label: "Avg Battery",
            value: activeUsers?.length
              ? `${Math.round(
                  activeUsers.reduce((s: number, u: any) => s + (u.batteryLevel ?? 50), 0) /
                    activeUsers.length
                )}%`
              : "N/A",
            icon: <Battery className="h-4 w-4" />,
            color: "text-blue-600",
          },
          {
            label: "Map Layers",
            value: "OSM + GeoJSON",
            icon: <Satellite className="h-4 w-4" />,
            color: "text-indigo-600",
          },
        ]}
      />

      {/* Map + User List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[600px] w-full">
              <LeafletMap
                center={[3.139, 101.687]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                controls={{ zoom: true, scale: true, attribution: true }}
                onLoad={(map) => { mapRef.current = map; }}
              >
                <GeoJsonLayer data={malaysiaWorksiteGeofences} />
                {activeUsers?.map((user: any) => (
                  <Marker
                    key={user.userId}
                    position={[user.latitude, user.longitude]}
                  >
                    <Popup>
                      <div className="min-w-[180px]">
                        <h3 className="font-bold text-sm">{user.userName}</h3>
                        <p className="text-xs text-muted-foreground">ID: {user.userId}</p>
                        <div className="mt-2 space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Battery className="h-3 w-3" />
                            {user.batteryLevel ?? "N/A"}%
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="h-3 w-3" />
                            Accuracy: ±{user.accuracy?.toFixed(0) ?? "?"}m
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Last update: {new Date(user.lastUpdate).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LeafletMap>
            </div>
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-green-600" />
              Online Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[540px] overflow-y-auto">
              {activeUsers?.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">
                  No active users detected
                </p>
              )}
              {activeUsers?.map((user: any) => (
                <div
                  key={user.userId}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                    selectedUser === user.userId ? "ring-2 ring-green-500 bg-green-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedUser(user.userId);
                    handleCenterOnUser(user.latitude, user.longitude);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium">{user.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.latitude.toFixed(4)}, {user.longitude.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Battery className="h-3 w-3" />
                      {user.batteryLevel ?? "?"}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCenterOnUser(user.latitude, user.longitude);
                      }}
                    >
                      <Navigation className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}

