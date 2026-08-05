/**
 * AhrosDock — Floating artifact dock for the AHROS workspace.
 *
 * Provides quick access to pinned/minimized artifacts that are not
 * currently visible in the main panel layout.
 */

"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PanelBottomIcon,
  PanelRightIcon,
  PanelLeftIcon,
  GripVerticalIcon,
  LayersIcon,
} from "lucide-react";
import type { PanelId, ArtifactType } from "@/lib/ahros/types";

export interface DockItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  type: ArtifactType;
  panelId: PanelId;
  pinned: boolean;
}

export interface AhrosDockProps {
  /** Items to display in the dock */
  items: DockItem[];
  /** Currently active panel */
  activePanelId?: PanelId;
  /** Callback when a dock item is clicked */
  onItemClick?: (item: DockItem) => void;
  /** Callback to toggle pin */
  onItemPin?: (itemId: string) => void;
  /** Callback to close item */
  onItemClose?: (itemId: string) => void;
  /** Position of the dock */
  position?: "bottom" | "right" | "left";
  className?: string;
}

const PANEL_ICONS: Record<PanelId, React.ReactNode> = {
  conversation: <PanelLeftIcon className="size-3.5" />,
  planning: <LayersIcon className="size-3.5" />,
  workflow: <LayersIcon className="size-3.5" />,
  reasoning: <PanelRightIcon className="size-3.5" />,
  timeline: <PanelBottomIcon className="size-3.5" />,
  compliance: <PanelRightIcon className="size-3.5" />,
  knowledge: <LayersIcon className="size-3.5" />,
  sandbox: <LayersIcon className="size-3.5" />,
  memory: <LayersIcon className="size-3.5" />,
};

export function AhrosDock({
  items,
  activePanelId,
  onItemClick,
  position = "bottom",
  className,
}: AhrosDockProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleItems = items.filter((item) => item.pinned);

  if (visibleItems.length === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-3 py-1.5",
        position === "left" && "flex-col border-t-0 border-r",
        position === "right" && "flex-col border-t-0 border-l",
        position === "bottom" && "flex-row",
        className,
      )}
    >
      <TooltipProvider>
        {visibleItems.slice(0, expanded ? undefined : 5).map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Button
                variant={activePanelId === item.panelId ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "h-7 px-2 text-xs gap-1.5",
                  activePanelId === item.panelId && "bg-muted font-medium",
                )}
                onClick={() => onItemClick?.(item)}
              >
                {PANEL_ICONS[item.panelId] ?? <LayersIcon className="size-3.5" />}
                <span className="max-w-[80px] truncate">{item.label}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {visibleItems.length > 5 && !expanded && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setExpanded(true)}
              >
                +{visibleItems.length - 5} more
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Show all dock items</TooltipContent>
          </Tooltip>
        )}

        {expanded && visibleItems.length > 5 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setExpanded(false)}
              >
                Show less
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Collapse dock</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

