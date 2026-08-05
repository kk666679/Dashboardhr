"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Navigation } from "lucide-react";

interface GeofenceProximityAlertProps {
  userId: string;
  geofenceId: string;
  geofenceName: string;
  distance: number; // in meters
  threshold: number; // in meters
  isApproaching: boolean;
}

/**
 * Alerts when a worker is approaching a geofence boundary.
 * 2026 trend: Predictive proximity detection with configurable thresholds.
 */
export function GeofenceProximityAlert({
  userId,
  geofenceName,
  distance,
  threshold,
  isApproaching,
}: GeofenceProximityAlertProps) {
  const [alertActive, setAlertActive] = useState(false);

  useEffect(() => {
    if (isApproaching && distance <= threshold) {
      setAlertActive(true);
      const timer = setTimeout(() => setAlertActive(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isApproaching, distance, threshold]);

  if (!alertActive) return null;

  return (
    <Card className="border-orange-300 bg-orange-50 animate-pulse">
      <CardContent className="p-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-orange-200 flex items-center justify-center">
          <Navigation className="h-4 w-4 text-orange-700" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-orange-800">Proximity Alert</p>
            <Badge variant="outline" className="text-[10px] border-orange-300 text-orange-700">
              {distance.toFixed(0)}m
            </Badge>
          </div>
          <p className="text-xs text-orange-600 mt-0.5">
            User {userId} is approaching {geofenceName} boundary
          </p>
        </div>
        <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
      </CardContent>
    </Card>
  );
}

