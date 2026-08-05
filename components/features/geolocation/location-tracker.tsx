"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, Shield, Clock } from "lucide-react";
import {
  useUpdateLocationMutation,
  useGetWorkerLocationSettingsQuery,
} from "@/server/api/geolocation-api";

interface LocationTrackerProps {
  workerId: string;
}

export function LocationTracker({ workerId }: LocationTrackerProps) {
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const { data: settings } = useGetWorkerLocationSettingsQuery(workerId);
  const [updateLocation] = useUpdateLocationMutation();

  useEffect(() => {
    if (!settings?.trackingEnabled || !settings?.geofenceAlerts) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation(position);
        setError(null);

        // Update location to server
        updateLocation({
          workerId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          source: "gps",
        });
      },
      (err: GeolocationPositionError) => setError(err.message),
        {
          enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: (settings.updateInterval || 5) * 60 * 1000,
      },
    );

    setIsTracking(true);
    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  }, [settings, workerId, updateLocation]);

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position);
        updateLocation({
          workerId,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
          source: "manual",
        });
      },
      (err: GeolocationPositionError) => setError(err.message),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Status:</span>
          <Badge variant={isTracking ? "default" : "secondary"}>
            {isTracking ? "Active" : "Inactive"}
          </Badge>
        </div>

        {location && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">
                {location.coords.latitude.toFixed(6)},{" "}
                {location.coords.longitude.toFixed(6)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {new Date(location.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm">
                Accuracy: ±{location.coords.accuracy.toFixed(0)}m
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Button onClick={getCurrentLocation} className="w-full">
          Update Location
        </Button>
      </CardContent>
    </Card>
  );
}
