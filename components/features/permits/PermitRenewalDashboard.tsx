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
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export interface PermitRenewal {
  id: string;
  workerName: string;
  permitType: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  status: "urgent" | "pending" | "renewed";
}

interface PermitRenewalDashboardProps {
  renewals?: PermitRenewal[];
  isLoading?: boolean;
  onRenew?: (id: string) => void;
}

export function PermitRenewalDashboard({
  renewals = [],
  isLoading = false,
  onRenew,
}: PermitRenewalDashboardProps) {
  const urgent = renewals.filter((r) => r.status === "urgent").length;
  const pending = renewals.filter((r) => r.status === "pending").length;
  const renewed = renewals.filter((r) => r.status === "renewed").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "destructive";
      case "pending":
        return "secondary";
      case "renewed":
        return "default";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "urgent":
        return <AlertCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "renewed":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Urgent Renewals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{urgent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Expiring within 14 days
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
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Renewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{renewed}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully renewed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Renewals List */}
      <Card>
        <CardHeader>
          <CardTitle>Permit Renewals</CardTitle>
          <CardDescription>Track and manage permit renewal dates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading renewals...</div>
          ) : renewals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No renewals to display
            </div>
          ) : (
            <div className="space-y-3">
              {renewals.map((renewal) => (
                <div
                  key={renewal.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(renewal.status)}
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {renewal.workerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {renewal.permitType}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge variant={getStatusColor(renewal.status)}>
                      {renewal.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {renewal.daysUntilExpiry > 0
                        ? `${renewal.daysUntilExpiry} days left`
                        : "Expired"}
                    </p>
                  </div>

                  {renewal.status !== "renewed" && (
                    <Button
                      size="sm"
                      onClick={() => onRenew?.(renewal.id)}
                      className="w-full sm:w-auto"
                    >
                      Renew
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
