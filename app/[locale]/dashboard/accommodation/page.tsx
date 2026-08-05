'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertTriangle,
  Building,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AccommodationDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);

  const { data, isLoading, error } = trpc.accommodation.listTwinsSummary.useQuery({
    take: 50,
    skip: 0,
    riskLevel: riskFilter as any,
  });

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Failed to load data</h3>
          <p className="text-muted-foreground">{error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const twins = data?.twins || [];
  const stats = calculateStats(twins);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Accommodation Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time safety and wellbeing monitoring for all accommodations
          </p>
        </div>
        <Button>
          <Building className="mr-2 h-4 w-4" />
          Add Accommodation
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Accommodations"
          value={twins.length}
          icon={<Building className="h-5 w-5" />}
          trend={`${stats.active} active`}
        />
        <StatCard
          title="Open Incidents"
          value={stats.totalIncidents}
          icon={<AlertTriangle className="h-5 w-5 text-orange-500" />}
          trend={`${stats.criticalIncidents} critical`}
          danger={stats.totalIncidents > 0}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.avgOccupancy}%`}
          icon={<Users className="h-5 w-5" />}
          trend={`${stats.totalCapacity} total capacity`}
        />
        <StatCard
          title="Safety Score"
          value={stats.avgSafetyScore.toFixed(1)}
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          trend={`${stats.lowRisk} low risk`}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={riskFilter === null ? 'default' : 'outline'}
          onClick={() => setRiskFilter(null)}
          size="sm"
        >
          All
        </Button>
        {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((level) => (
          <Button
            key={level}
            variant={riskFilter === level ? 'default' : 'outline'}
            onClick={() => setRiskFilter(level)}
            size="sm"
            className={
              level === 'CRITICAL'
                ? 'border-red-500 text-red-500 hover:bg-red-50'
                : level === 'HIGH'
                ? 'border-orange-500 text-orange-500 hover:bg-orange-50'
                : ''
            }
          >
            {level}
          </Button>
        ))}
      </div>

      {/* Twins Table */}
      <Card>
        <CardHeader>
          <CardTitle>Accommodation Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Safety Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Incidents</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {twins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No accommodations found
                  </TableCell>
                </TableRow>
              ) : (
                twins.map((twin: any) => (
                  <TableRow key={twin.id}>
                    <TableCell className="font-medium">{twin.name}</TableCell>
                    <TableCell>{twin.type}</TableCell>
                    <TableCell>
                      {twin.currentOccupancy !== null ? (
                        <div className="flex items-center gap-2">
                          <span>{twin.currentOccupancy} / {twin.capacity}</span>
                          <span className="text-xs text-muted-foreground">
                            ({twin.occupancyPercentage}%)
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No data</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {twin.safetyScore !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{twin.safetyScore.toFixed(1)}</span>
                          {twin.safetyScore >= 70 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : twin.safetyScore >= 50 ? (
                            <AlertCircle className="h-4 w-4 text-yellow-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          twin.riskLevel === 'CRITICAL'
                            ? 'destructive'
                            : twin.riskLevel === 'HIGH'
                            ? 'default'
                            : twin.riskLevel === 'MEDIUM'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {twin.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {twin.openIncidents > 0 ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {twin.openIncidents}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Clear
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          twin.status === 'ACTIVE'
                            ? 'default'
                            : twin.status === 'MAINTENANCE'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {twin.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
function StatCard({
  title,
  value,
  icon,
  trend,
  danger = false,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  danger?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
          {danger && <AlertTriangle className="h-4 w-4 text-orange-500" />}
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{value}</span>
          <p className="text-xs text-muted-foreground mt-1">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Functions
function calculateStats(twins: any[]) {
  const total = twins.length;
  const active = twins.filter(t => t.status === 'ACTIVE').length;
  
  let totalIncidents = 0;
  let criticalIncidents = 0;
  let totalCapacity = 0;
  let totalOccupancy = 0;
  let occupancyCount = 0;
  let totalSafetyScore = 0;
  let safetyCount = 0;
  let lowRisk = 0;

  for (const twin of twins) {
    totalIncidents += twin.openIncidents;
    criticalIncidents += twin.criticalIncidents;
    totalCapacity += twin.capacity;
    
    if (twin.currentOccupancy !== null) {
      totalOccupancy += twin.currentOccupancy;
      occupancyCount++;
    }
    
    if (twin.safetyScore !== null) {
      totalSafetyScore += twin.safetyScore;
      safetyCount++;
    }
    
    if (twin.riskLevel === 'LOW') {
      lowRisk++;
    }
  }

  return {
    active,
    totalIncidents,
    criticalIncidents,
    totalCapacity,
    avgOccupancy: occupancyCount > 0 ? Math.round(totalOccupancy / occupancyCount) : 0,
    avgSafetyScore: safetyCount > 0 ? totalSafetyScore / safetyCount : 0,
    lowRisk,
  };
}
