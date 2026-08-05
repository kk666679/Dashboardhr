"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, RefreshCw, Cloud, CloudOff } from "lucide-react";

interface OfflineSyncIndicatorProps {
  lastSyncTime?: Date;
  pendingRecords?: number;
  isOnline?: boolean;
}

/**
 * Shows the current online/offline sync status for geolocation data.
 * 2026 trend: Offline-first architecture with IndexedDB local caching and background sync.
 */
export function OfflineSyncIndicator({
  lastSyncTime,
  pendingRecords = 0,
  isOnline = navigator.onLine,
}: OfflineSyncIndicatorProps) {
  const [online, setOnline] = useState(isOnline);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (online && pendingRecords === 0) {
    return (
      <Badge variant="outline" className="gap-1 text-green-600 text-xs">
        <Cloud className="h-3 w-3" />
        Synced
        {lastSyncTime && (
          <span className="text-[10px] text-muted-foreground">
            {new Date(lastSyncTime).toLocaleTimeString()}
          </span>
        )}
      </Badge>
    );
  }

  if (online && pendingRecords > 0) {
    return (
      <Badge variant="outline" className="gap-1 text-blue-600 text-xs">
        <RefreshCw className="h-3 w-3 animate-spin" />
        Syncing {pendingRecords} records...
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1 text-orange-600 text-xs">
      <WifiOff className="h-3 w-3" />
      Offline ({pendingRecords} pending)
    </Badge>
  );
}

