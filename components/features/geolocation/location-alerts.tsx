"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, CheckCircle } from "lucide-react";
import {
  useGetLocationAlertsQuery,
  useResolveAlertMutation,
} from "@/server/api/geolocation-api";

interface LocationAlertsProps {
  workerId?: string;
}

export function LocationAlerts({ workerId }: LocationAlertsProps) {
  const { data: alerts, isLoading } = useGetLocationAlertsQuery({
    workerId,
    status: "active",
  });
  const [resolveAlert] = useResolveAlertMutation();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "unauthorized_exit":
      case "restricted_entry":
      case "geofence_violation":
        return <MapPin className="h-4 w-4" />;
      case "sos":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await resolveAlert({
        id: alertId,
        resolution: "Resolved by system administrator",
      });
    } catch (error: unknown) {
      console.error("Failed to resolve alert:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Location Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading alerts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Location Alerts
          {alerts && alerts.length > 0 && (
            <Badge variant="destructive">{alerts.length}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!alerts || alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>No active alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.type} Alert</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm opacity-75">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.createdAt).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location.latitude.toFixed(4)},{" "}
                          {alert.location.longitude.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {alert.severity}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
