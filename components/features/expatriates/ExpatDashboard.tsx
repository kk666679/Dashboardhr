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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";

interface ExpatMetrics {
  totalExpatriates: number;
  activePassports: number;
  expiringWithin30: number;
  renewalsPending: number;
}

interface ExpatDashboardProps {
  metrics?: ExpatMetrics;
  isLoading?: boolean;
}

export function ExpatDashboard({
  metrics = {
    totalExpatriates: 0,
    activePassports: 0,
    expiringWithin30: 0,
    renewalsPending: 0,
  },
  isLoading = false,
}: ExpatDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Expatriate Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor employment passes, visas, and compliance
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expatriates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">{metrics.totalExpatriates}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Passes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                {metrics.activePassports}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <div className="text-2xl font-bold text-orange-500">
                {metrics.expiringWithin30}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Within 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Renewals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <div className="text-2xl font-bold text-amber-500">
                {metrics.renewalsPending}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Card>
        <CardHeader>
          <CardTitle>Expatriate Management</CardTitle>
          <CardDescription>
            Manage employment passes and visa information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="renewals">Renewals</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Employment Passes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Category I</span>
                        <Badge>0</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Category II</span>
                        <Badge variant="secondary">0</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Category III</span>
                        <Badge variant="secondary">0</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Visa Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Valid</span>
                        <Badge variant="default">0</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Expiring Soon</span>
                        <Badge variant="secondary">0</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Expired</span>
                        <Badge variant="destructive">0</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="renewals" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Renewal requests will appear here
              </p>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Document management coming soon
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
