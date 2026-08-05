"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CheckCircle, XCircle } from "lucide-react";

interface AttendanceVerification {
  workerId: string;
  workerName: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  method: "geofence" | "manual" | "auto";
}

interface GeolocationAttendanceBridgeProps {
  verifications: AttendanceVerification[];
  onVerify?: (workerId: string) => void;
}

/**
 * Bridges geolocation tracking with attendance check-in/check-out.
 * 2026 trend: Seamless geo-verification of attendance records,
 * eliminating manual clock-in/out when worker is within geofence.
 */
export function GeolocationAttendanceBridge({
  verifications,
  onVerify,
}: GeolocationAttendanceBridgeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <MapPin className="h-4 w-4 text-blue-600" />
          Geo-Attendance Verification
          <Badge variant="outline" className="text-xs ml-auto">
            {verifications.filter((v) => v.verified).length}/{verifications.length} verified
          </Badge>
        </CardTitle>
      </CardHeader>
      {expanded && (
        <CardContent>
          <div className="space-y-2">
            {verifications.map((v) => (
              <div key={v.workerId} className="flex items-center justify-between p-2 rounded-lg border text-sm">
                <div className="flex items-center gap-2">
                  {v.verified ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium">{v.workerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(v.timestamp).toLocaleString()} via {v.method}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={v.verified ? "default" : "secondary"} className="text-[10px]">
                    {v.verified ? "Verified" : "Pending"}
                  </Badge>
                  {!v.verified && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => onVerify?.(v.workerId)}>
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

