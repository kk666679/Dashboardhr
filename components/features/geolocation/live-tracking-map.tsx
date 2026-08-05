"use client";

/* ── Rewritten: real Leaflet live-tracking map (removed static Mapbox placeholder) ── */

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, MapPin, User, Navigation, Battery, Signal, Activity } from "lucide-react";

// Dynamically import Leaflet components (SSR-safe)
const LeafletMapComponent = dynamic(
  () => import("@/components/features/geolocation/leaflet").then((m) => ({ default: m.LeafletMap })),
  { ssr: false, loading: () => <Skeleton className="h-[400px] w-full rounded-lg" /> }
);

const MarkerComponent = dynamic(
  () => import("react-leaflet").then((m) => ({ default: m.Marker })),
  { ssr: false }
);

const PopupComponent = dynamic(
  () => import("react-leaflet").then((m) => ({ default: m.Popup })),
  { ssr: false }
);

interface LiveLocation {
  id: string;
  userId: string;
  userName: string;
  lat: number;
  lng: number;
  timestamp: string;
  accuracy: number;
  device?: string;
  status?: string;
  battery?: number;
  signal?: number;
}

interface LiveTrackingMapProps {
  locations: LiveLocation[];
  onRefresh?: () => void;
  isLoading?: boolean;
  onCenterUser?: (userId: string) => void;
}

export function LiveTrackingMap({
  locations,
  onRefresh,
  isLoading,
  onCenterUser,
}: LiveTrackingMapProps) {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    locations.length > 0
      ? [locations[0].lat, locations[0].lng]
      : [3.139, 101.687]
  );

  const handleUserClick = useCallback(
    (userId: string) => {
      setSelectedUser(userId === selectedUser ? null : userId);
      onCenterUser?.(userId);
    },
    [selectedUser, onCenterUser]
  );

  if (locations.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">Live Tracking</CardTitle>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No active tracking data</p>
              <p className="text-xs mt-1">Waiting for location updates...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "alert": return "bg-orange-500";
      case "offline": return "bg-gray-400";
      default: return "bg-blue-500";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-600" />
            Live Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-500 text-white gap-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {locations.length} active
            </Badge>
            <Button variant="outline" size="sm" onClick={onRefresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Real Leaflet Map */}
        <div className="rounded-lg overflow-hidden border">
          <LeafletMapComponent
            center={mapCenter}
            zoom={14}
            style={{ height: "400px", width: "100%" }}
            controls={{ zoom: true, scale: true, attribution: true }}
          >
            {locations.map((loc) => (
              <MarkerComponent
                key={loc.id}
                position={[loc.lat, loc.lng]}
              >
                <PopupComponent>
                  <div className="min-w-[180px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(loc.status)}`} />
                      <h3 className="font-bold text-sm">{loc.userName}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{loc.id}</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3 text-muted-foreground" />
                        Accuracy: ±{loc.accuracy?.toFixed(0) ?? "?"}m
                      </div>
                      {loc.battery != null && (
                        <div className="flex items-center gap-1">
                          <Battery className="h-3 w-3 text-muted-foreground" />
                          {loc.battery}%
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {new Date(loc.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    {loc.status === "alert" && (
                      <div className="mt-2 p-1.5 bg-orange-50 rounded text-[10px] text-orange-700 font-medium">
                        ⚠ Alert triggered
                      </div>
                    )}
                  </div>
                </PopupComponent>
              </MarkerComponent>
            ))}
          </LeafletMapComponent>
        </div>

        {/* User badges */}
        <div className="flex flex-wrap gap-2">
          {locations.slice(0, 8).map((loc) => (
            <Badge
              key={loc.id}
              variant={selectedUser === loc.userId ? "default" : "outline"}
              className={`cursor-pointer gap-1 text-xs ${
                loc.status === "alert"
                  ? "border-orange-300 text-orange-700 hover:bg-orange-50"
                  : loc.status === "offline"
                  ? "opacity-50"
                  : ""
              }`}
              onClick={() => handleUserClick(loc.userId)}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${getStatusColor(loc.status)}`} />
              {loc.userName}
              {loc.battery != null && (
                <span className="text-[10px] text-muted-foreground ml-1">
                  {loc.battery}%
                </span>
              )}
            </Badge>
          ))}
          {locations.length > 8 && (
            <Badge variant="outline" className="text-xs">
              +{locations.length - 8} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

