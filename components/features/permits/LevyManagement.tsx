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
import { AlertCircle, DollarSign, TrendingUp } from "lucide-react";

export interface LevyRecord {
  id: string;
  workerName: string;
  amount: number;
  paymentDate: Date;
  expiryDate: Date;
  status: "paid" | "pending" | "overdue";
}

interface LevyManagementProps {
  levies?: LevyRecord[];
  isLoading?: boolean;
  onPay?: (id: string) => void;
}

export function LevyManagement({
  levies = [],
  isLoading = false,
  onPay,
}: LevyManagementProps) {
  const totalAmount = levies.reduce((sum, l) => sum + l.amount, 0);
  const paidAmount = levies
    .filter((l) => l.status === "paid")
    .reduce((sum, l) => sum + l.amount, 0);
  const overdueAmount = levies
    .filter((l) => l.status === "overdue")
    .reduce((sum, l) => sum + l.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Levy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {(totalAmount / 1000).toFixed(1)}K
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total amount due
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {(paidAmount / 1000).toFixed(1)}K
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Successfully paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <div className="text-2xl font-bold text-destructive">
                {(overdueAmount / 1000).toFixed(1)}K
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Payment overdue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Levy Records */}
      <Card>
        <CardHeader>
          <CardTitle>Levy Records</CardTitle>
          <CardDescription>Track foreign worker levy payments</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading levy records...</div>
          ) : levies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No levy records to display
            </div>
          ) : (
            <div className="space-y-3 overflow-x-auto">
              {levies.map((levy) => (
                <div
                  key={levy.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors min-w-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{levy.workerName}</p>
                    <p className="text-sm text-muted-foreground">
                      Amount: MYR {levy.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Expires: {levy.expiryDate.toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2">
                    <Badge variant={getStatusColor(levy.status)}>
                      {levy.status}
                    </Badge>
                  </div>

                  {levy.status !== "paid" && (
                    <Button
                      size="sm"
                      onClick={() => onPay?.(levy.id)}
                      className="w-full sm:w-auto"
                    >
                      Pay
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
