"use client";

import { useState } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { PageShell } from "@/components/layout/page-shell";
import { PageHeader } from "@/components/layout/page-shell";
import { KpiCardGrid } from "@/components/modules/common/KpiCardGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  Filter,
  RefreshCw,
} from "lucide-react";

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800 border-red-200",
  HIGH: "bg-orange-100 text-orange-800 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  LOW: "bg-blue-100 text-blue-800 border-blue-200",
};

const TYPE_LABELS: Record<string, string> = {
  UNAUTHORIZED_EXIT: "Unauthorized Exit",
  RESTRICTED_ENTRY: "Restricted Entry",
  SOS: "SOS Emergency",
  OFFLINE: "Worker Offline",
  GEO_FENCE_VIOLATION: "Geofence Violation",
};

export default function AlertsPage() {
  const { useAlerts, acknowledgeAlertMutation, resolveAlertMutation } = useGeolocation();
  const [filterStatus, setFilterStatus] = useState<"RESOLVED" | "PENDING" | undefined>("PENDING");
  const [filterSeverity, setFilterSeverity] = useState<string | undefined>();

  const { data, isLoading, refetch } = useAlerts({
    status: filterStatus,
    severity: filterSeverity as any,
    limit: 100,
  });

  const alerts = data?.alerts ?? [];
  const total = data?.total ?? 0;

  const handleAcknowledge = async (id: string) => {
    await acknowledgeAlertMutation.mutateAsync({ id });
  };

  const handleResolve = async (id: string) => {
    await resolveAlertMutation.mutateAsync({ id });
  };

  if (isLoading) {
    return (
      <PageShell>
        <PageHeader title="Alert Center" description="Loading..." />
        <Skeleton className="h-64 w-full rounded-xl" />
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeader
        title="Alert Center"
        description="Monitor, acknowledge, and resolve location-based alerts and emergencies"
        actions={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        }
      />

      {/* Stats */}
      <KpiCardGrid
        columns={4}
        items={[
          {
            label: "Total Alerts",
            value: total,
            icon: <AlertTriangle className="h-4 w-4" />,
            color: "text-orange-600",
          },
          {
            label: "Critical",
            value: alerts.filter((a: any) => a.severity === "CRITICAL").length,
            icon: <Shield className="h-4 w-4" />,
            color: "text-red-600",
          },
          {
            label: "Unresolved",
            value: alerts.filter((a: any) => !a.isResolved).length,
            icon: <Clock className="h-4 w-4" />,
            color: "text-yellow-600",
          },
          {
            label: "Resolved",
            value: alerts.filter((a: any) => a.isResolved).length,
            icon: <CheckCircle className="h-4 w-4" />,
            color: "text-green-600",
          },
        ]}
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge
          variant={filterStatus === undefined ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilterStatus(undefined)}
        >
          All
        </Badge>
        <Badge
          variant={filterStatus === "PENDING" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilterStatus("PENDING")}
        >
          Unresolved
        </Badge>
        <Badge
          variant={filterStatus === "RESOLVED" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setFilterStatus("RESOLVED")}
        >
          Resolved
        </Badge>
        <span className="text-xs text-muted-foreground mx-1">|</span>
        {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => (
          <Badge
            key={s}
            variant={filterSeverity === s ? "default" : "outline"}
            className={`cursor-pointer text-xs ${
              s === "CRITICAL" ? "hover:bg-red-100" :
              s === "HIGH" ? "hover:bg-orange-100" :
              s === "MEDIUM" ? "hover:bg-yellow-100" :
              "hover:bg-blue-100"
            }`}
            onClick={() => setFilterSeverity(filterSeverity === s ? undefined : s)}
          >
            {s}
          </Badge>
        ))}
      </div>

      {/* Alerts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    No alerts found
                  </TableCell>
                </TableRow>
              )}
              {alerts.map((alert: any) => (
                <TableRow key={alert.id} className={!alert.isResolved && alert.severity === "CRITICAL" ? "bg-red-50/50" : ""}>
                  <TableCell>
                    <span className="text-xs font-medium">
                      {TYPE_LABELS[alert.type] ?? alert.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{alert.employee?.name ?? "Unknown"}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${SEVERITY_COLORS[alert.severity] ?? "bg-gray-100"}`}>
                      {alert.severity}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {alert.message}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(alert.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={alert.isResolved ? "outline" : "secondary"} className="text-[10px]">
                      {alert.isResolved ? "Resolved" : "Open"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!alert.isResolved && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleAcknowledge(alert.id)}>
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-green-600" onClick={() => handleResolve(alert.id)}>
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
}

