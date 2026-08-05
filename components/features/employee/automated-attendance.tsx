"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  useGetLocationAttendanceQuery,
  useRecordLocationAttendanceMutation,
} from "@/server/api/geolocation-api";
import { useSyncAttendanceToPayrollMutation } from "@/server/api/hr-integration-api";
import { useToast } from "@/components/ui/use-toast";
import type { AttendanceLocation } from "@/types/geolocation";

interface AutomatedAttendanceProps {
  workerId: string;
  date?: string;
}

export function AutomatedAttendance({
  workerId,
  date = new Date().toISOString().split("T")[0],
}: AutomatedAttendanceProps) {
  const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: attendance = [], refetch } = useGetLocationAttendanceQuery({
    workerId,
    date,
  });
  const [recordAttendance] = useRecordLocationAttendanceMutation();
  const [syncToPayroll, { isLoading: isSyncing }] =
    useSyncAttendanceToPayrollMutation();

  const handleSyncToPayroll = async () => {
    if (!workerId || !date) {
      toast({
        title: "Invalid data",
        description: "Worker ID or date is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      const startDate = date;
      const endDate = date;
      await syncToPayroll({ workerId, startDate, endDate }).unwrap();
      toast({
        title: "Success",
        description: "Attendance synced to payroll successfully.",
      });
      refetch();
    } catch (error: unknown) {
      console.error(
        "Failed to sync to payroll - Full error details:",
        JSON.stringify(error, null, 2),
      );
      const err = error as { data?: { error?: string }; message?: string };
      toast({
        title: "Sync failed",
        description:
          err.data?.error ||
          err.message ||
          "Failed to sync. Check server logs.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (record: AttendanceLocation) => {
    if (!record.isValid) {
      return <Badge variant="destructive">Invalid</Badge>;
    }
    if (record.checkIn && record.checkOut) {
      return <Badge variant="default">Complete</Badge>;
    }
    if (record.checkIn) {
      return <Badge variant="secondary">Checked In</Badge>;
    }
    return <Badge variant="outline">Pending</Badge>;
  };

  const calculateOvertimeHours = (totalHours: number) => {
    const standardHours = 8;
    return Math.max(0, totalHours - standardHours);
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-MY", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Automated Attendance - {date}
            </div>
            <Button
              onClick={handleSyncToPayroll}
              size="sm"
              disabled={isSyncing || !workerId || !date}
            >
              {isSyncing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Sync to Payroll"
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Total Hours</TableHead>
                <TableHead>Overtime</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{getStatusBadge(record)}</TableCell>
                  <TableCell>
                    {record.checkIn ? (
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatTime(record.checkIn.time)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record.checkIn.location.address ||
                            "Location verified"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not checked in</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.checkOut ? (
                      <div className="space-y-1">
                        <div className="font-medium">
                          {formatTime(record.checkOut.time)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {record.checkOut.location.address ||
                            "Location verified"}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not checked out</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {record.isValid ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">
                        {record.isValid ? "Authorized" : "Unauthorized"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {record.totalHours.toFixed(2)}h
                    </span>
                  </TableCell>
                  <TableCell>
                    {calculateOvertimeHours(record.totalHours) > 0 ? (
                      <Badge variant="secondary">
                        +{calculateOvertimeHours(record.totalHours).toFixed(2)}h
                      </Badge>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>

          {attendance.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No attendance records found for this date
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Daily Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {attendance
                  .reduce((sum, record) => sum + record.totalHours, 0)
                  .toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Total Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {attendance
                  .reduce(
                    (sum, record) =>
                      sum + calculateOvertimeHours(record.totalHours),
                    0,
                  )
                  .toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">Overtime Hours</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {attendance.filter((record) => record.isValid).length}
              </div>
              <div className="text-sm text-gray-500">Valid Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {attendance.filter((record) => !record.isValid).length}
              </div>
              <div className="text-sm text-gray-500">Violations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
