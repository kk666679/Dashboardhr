"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Heart, CheckCircle2 } from "lucide-react";

export interface FOMEMARecord {
  id: string;
  workerName: string;
  medicalStatus: "healthy" | "pending" | "failed";
  expiryDate: Date;
  daysUntilExpiry: number;
  lastCheckDate: Date;
}

interface FOMEMAManagementProps {
  records?: FOMEMARecord[];
  isLoading?: boolean;
  onSchedule?: (id: string) => void;
}

export function FOMEMAManagement({
  records = [],
  isLoading = false,
  onSchedule,
}: FOMEMAManagementProps) {
  const healthy = records.filter((r) => r.medicalStatus === "healthy").length;
  const pending = records.filter((r) => r.medicalStatus === "pending").length;
  const failed = records.filter((r) => r.medicalStatus === "failed").length;
  const expiringWithin30 = records.filter(
    (r) => r.daysUntilExpiry <= 30 && r.daysUntilExpiry > 0
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Healthy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthy}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Passed medical check
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting results
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{failed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Action required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringWithin30}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Within 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Medical Records */}
      <Card>
        <CardHeader>
          <CardTitle>Medical Certificates</CardTitle>
          <CardDescription>
            Manage FOMEMA medical check records and expiry dates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading medical records...</div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No medical records to display
            </div>
          ) : (
            <div className="space-y-3 overflow-x-auto">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.medicalStatus)}
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {record.workerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Last check: {record.lastCheckDate.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge variant={getStatusColor(record.medicalStatus)}>
                      {record.medicalStatus}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {record.daysUntilExpiry > 0
                        ? `${record.daysUntilExpiry} days left`
                        : "Expired"}
                    </p>
                  </div>

                  {record.daysUntilExpiry <= 30 && record.daysUntilExpiry > 0 && (
                    <Button
                      size="sm"
                      onClick={() => onSchedule?.(record.id)}
                      className="w-full sm:w-auto"
                    >
                      Schedule Check
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
