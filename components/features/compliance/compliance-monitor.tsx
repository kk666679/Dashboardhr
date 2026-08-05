"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { useGetLocationAlertsQuery } from "@/server/api/geolocation-api";
import {
  useGetComplianceStatusQuery,
  useSyncComplianceDataMutation,
} from "@/server/api/hr-integration-api";
import type { GeofenceAlert } from "@/types/geolocation";
import type { ComplianceSync } from "@/types/hr-integration";

interface ComplianceMonitorProps {
  workerId?: string;
}

export function ComplianceMonitor({ workerId }: ComplianceMonitorProps) {
  const [activeTab, setActiveTab] = useState<"alerts" | "permits" | "medical">(
    "alerts",
  );

  const { data: alerts = [] } = useGetLocationAlertsQuery({ workerId });
  const { data: complianceData = [] } = useGetComplianceStatusQuery();
  const [syncCompliance] = useSyncComplianceDataMutation();

  const handleSyncCompliance = async () => {
    try {
      await syncCompliance().unwrap();
    } catch (error: unknown) {
      console.error("Failed to sync compliance data:", error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL":
        return "destructive" as const;
      case "HIGH":
        return "destructive" as const;
      case "MEDIUM":
        return "secondary" as const;
      case "LOW":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "unauthorized_exit":
      case "EXIT":
        return <MapPin className="h-4 w-4" />;
      case "restricted_entry":
      case "ENTER":
        return <AlertTriangle className="h-4 w-4" />;
      case "sos":
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // GeofenceAlert uses resolvedAt (null = unresolved) and AlertSeverity (uppercase)
  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "CRITICAL" && alert.resolvedAt === null,
  );

  const workerCompliance = workerId
    ? complianceData.find((c: ComplianceSync) => c.workerId === workerId)
    : null;

  const getLocationString = (alert: GeofenceAlert) => {
    const loc = alert.location;
    return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {criticalAlerts.length} critical compliance alert
            {criticalAlerts.length > 1 ? "s" : ""} require immediate attention
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Monitor
            </div>
            <Button onClick={handleSyncCompliance} size="sm">
              Sync with Authorities
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {alerts.filter((a) => a.resolvedAt !== null).length}
              </div>
              <div className="text-sm text-green-700">Resolved Alerts</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  alerts.filter(
                    (a) => a.resolvedAt === null && a.severity !== "CRITICAL",
                  ).length
                }
              </div>
              <div className="text-sm text-yellow-700">Pending Alerts</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {criticalAlerts.length}
              </div>
              <div className="text-sm text-red-700">Critical Alerts</div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-4">
            <Button
              variant={activeTab === "alerts" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("alerts")}
            >
              Location Alerts
            </Button>
            <Button
              variant={activeTab === "permits" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("permits")}
            >
              Permit Status
            </Button>
            <Button
              variant={activeTab === "medical" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("medical")}
            >
              Medical Status
            </Button>
          </div>

          {/* Location Alerts Tab */}
          {activeTab === "alerts" && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Worker</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.slice(0, 10).map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getAlertIcon(alert.type)}
                        <span className="capitalize">
                          {alert.type.replace("_", " ")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{alert.userId}</TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{getLocationString(alert)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(alert.createdAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {alert.resolvedAt !== null ? (
                        <Badge variant="outline">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Resolved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {/* Permit Status Tab */}
          {activeTab === "permits" && workerCompliance && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Work Permit Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Permit Number</label>
                      <div className="text-lg">{workerCompliance.permitData.number}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Type</label>
                      <div className="text-lg capitalize">{workerCompliance.permitData.type}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Expiry Date</label>
                      <div className="text-lg">
                        {new Date(workerCompliance.permitData.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge
                        variant={
                          workerCompliance.permitData.status === "valid"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {workerCompliance.permitData.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Authorized Locations</label>
                      <div className="text-sm text-gray-600">
                        {workerCompliance.locationCompliance.authorizedLocations.join(", ")}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Current Location</label>
                      <div className="text-sm">
                        {workerCompliance.locationCompliance.currentLocation}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Violations</label>
                      <Badge
                        variant={
                          workerCompliance.locationCompliance.violations > 0
                            ? "destructive"
                            : "default"
                        }
                      >
                        {workerCompliance.locationCompliance.violations} violations
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Medical Status Tab */}
          {activeTab === "medical" && workerCompliance && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medical Examination Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Last Examination</label>
                    <div className="text-lg">
                      {new Date(workerCompliance.medicalStatus.lastExam).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Next Due</label>
                    <div className="text-lg">
                      {new Date(workerCompliance.medicalStatus.nextDue).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Status</label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          workerCompliance.medicalStatus.status === "fit"
                            ? "default"
                            : workerCompliance.medicalStatus.status === "unfit"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {workerCompliance.medicalStatus.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
