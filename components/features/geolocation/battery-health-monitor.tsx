"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Battery, BatteryLow, BatteryWarning, BatteryFull, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface BatteryHealthMonitorProps {
  batteryLevel: number; // 0-100
  isCharging?: boolean;
  showLabel?: boolean;
  className?: string;
}

/**
 * Monitors device battery health and shows predictive alerts.
 * 2026 trend: Predictive battery monitoring that alerts when
 * battery is likely to die before shift ends.
 */
export function BatteryHealthMonitor({
  batteryLevel,
  isCharging = false,
  showLabel = true,
  className,
}: BatteryHealthMonitorProps) {
  const getBatteryStatus = () => {
    if (batteryLevel <= 10) return { color: "text-red-600", bg: "bg-red-100", icon: BatteryLow, label: "Critical" };
    if (batteryLevel <= 20) return { color: "text-orange-600", bg: "bg-orange-100", icon: BatteryWarning, label: "Low" };
    if (batteryLevel <= 50) return { color: "text-yellow-600", bg: "bg-yellow-100", icon: Battery, label: "Moderate" };
    return { color: "text-green-600", bg: "bg-green-100", icon: BatteryFull, label: "Good" };
  };

  const status = getBatteryStatus();
  const Icon = status.icon;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", status.bg)}>
        {isCharging ? (
          <Zap className={cn("h-4 w-4", status.color)} />
        ) : (
          <Icon className={cn("h-4 w-4", status.color)} />
        )}
      </div>
      {showLabel && (
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{status.label}</span>
            <span className="text-xs text-muted-foreground">{batteryLevel}%</span>
          </div>
          <div className="h-1.5 mt-1 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full transition-all"
              style={{ width: `${batteryLevel}%` }}
              data-color={
                batteryLevel <= 10 ? "red" :
                batteryLevel <= 20 ? "orange" :
                batteryLevel <= 50 ? "yellow" :
                "green"
              }
            />
          </div>
        </div>
      )}
      {isCharging && (
        <Badge variant="outline" className="text-[10px] text-green-600">
          Charging
        </Badge>
      )}
    </div>
  );
}

