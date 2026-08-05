"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, ChevronLeft, ChevronRight, LayoutDashboard, MapPin, Settings2, Users } from "lucide-react";

export type GeolocationPanel = "dashboard" | "alerts" | "geofences" | "tracking" | "workers" | "analytics" | "settings";

interface GeolocationSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: (panel: GeolocationPanel) => void;
  activePanel?: GeolocationPanel;
  className?: string;
}

const NAV_ITEMS: Array<{ panel: GeolocationPanel; label: string; icon: typeof LayoutDashboard }> = [
  { panel: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { panel: "alerts", label: "Alerts", icon: AlertTriangle },
  { panel: "geofences", label: "Geofences", icon: MapPin },
  { panel: "tracking", label: "Tracking", icon: Activity },
  { panel: "workers", label: "Workers", icon: Users },
  { panel: "analytics", label: "Analytics", icon: Activity },
  { panel: "settings", label: "Settings", icon: Settings2 },
];

export function GeolocationSidebar({
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
  activePanel = "dashboard",
  className,
}: GeolocationSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-200",
        isCollapsed ? "w-16" : "w-72",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-3">
        <span className={cn("truncate text-sm font-semibold text-slate-900", isCollapsed && "hidden")}>Geolocation</span>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="h-8 w-8" aria-label="Toggle sidebar">
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-2">
        {NAV_ITEMS.map(({ panel, label, icon: Icon }) => (
          <button
            key={panel}
            type="button"
            onClick={() => onNavigate?.(panel)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              activePanel === panel
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
              isCollapsed && "justify-center px-2",
            )}
            aria-current={activePanel === panel ? "page" : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="truncate">{label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default GeolocationSidebar;
