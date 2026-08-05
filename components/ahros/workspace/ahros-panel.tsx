/**
 * AhrosPanel — Individual panel wrapper for the AHROS workspace.
 *
 * Provides a consistent header, collapse/expand, close, and drag-to-reorder
 * affordances for each panel in the workspace layout.
 */

"use client";

import { type ReactNode, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  XIcon,
  ChevronDownIcon,
  Maximize2Icon,
  Minimize2Icon,
} from "lucide-react";
import type { PanelId } from "@/lib/ahros/types";

export interface AhrosPanelProps {
  /** Unique panel ID */
  panelId: PanelId;
  /** Panel title/label */
  title: string;
  /** Whether the panel is visible */
  visible?: boolean;
  /** Whether the panel is collapsed */
  collapsed?: boolean;
  /** Whether the panel can be collapsed */
  collapsible?: boolean;
  /** Whether the panel can be closed */
  closable?: boolean;
  /** Whether the panel is currently maximized */
  maximized?: boolean;
  /** Actions to render in the panel header */
  actions?: ReactNode;
  /** Panel content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Callbacks */
  onToggleCollapse?: () => void;
  onClose?: () => void;
  onMaximize?: () => void;
}

export function AhrosPanel({
  panelId,
  title,
  visible = true,
  collapsed = false,
  collapsible = true,
  closable = true,
  maximized = false,
  actions,
  children,
  className,
  onToggleCollapse,
  onClose,
  onMaximize,
}: AhrosPanelProps) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm",
        maximized && "fixed inset-4 z-50",
        className,
      )}
      data-panel-id={panelId}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-muted/30 px-3 py-1.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          {collapsible && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 p-0 text-muted-foreground hover:text-foreground"
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? "Expand" : "Collapse"}
                  >
                    <ChevronDownIcon
                      className={cn(
                        "size-3.5 transition-transform",
                        collapsed ? "-rotate-90" : "rotate-0",
                      )}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {collapsed ? "Expand panel" : "Collapse panel"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className="truncate font-medium text-xs text-foreground/80 uppercase tracking-wider">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-0.5">
          {actions}

          {onMaximize && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 p-0 text-muted-foreground hover:text-foreground"
                    onClick={onMaximize}
                    aria-label={maximized ? "Restore" : "Maximize"}
                  >
                    {maximized ? (
                      <Minimize2Icon className="size-3" />
                    ) : (
                      <Maximize2Icon className="size-3" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {maximized ? "Restore" : "Maximize"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {closable && onClose && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-5 p-0 text-muted-foreground hover:text-foreground"
                    onClick={onClose}
                    aria-label="Close panel"
                  >
                    <XIcon className="size-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Close panel
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 overflow-auto transition-all duration-200",
          collapsed ? "max-h-0 overflow-hidden p-0" : "p-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

