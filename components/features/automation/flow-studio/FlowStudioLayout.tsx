"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PanelLeft, PanelRight } from "lucide-react";

export type StudioBreakpoint = "mobile" | "tablet" | "desktop";

export interface FlowStudioLayoutProps {
  /** Left panel (palette / library) */
  palette?: React.ReactNode;
  /** Central canvas area */
  canvas: React.ReactNode;
  /** Right panel (properties) */
  properties?: React.ReactNode;
  /** Bottom drawer panels for tablet */
  tabletDrawer?: React.ReactNode;
  /** Mobile floating sheets */
  mobileSheets?: React.ReactNode;
  /** Floating action button for mobile */
  fab?: React.ReactNode;
  /** Persistent status bar */
  statusBar?: React.ReactNode;
  /** Top toolbar */
  toolbar?: React.ReactNode;
  /** Floating template carousel */
  templateQuickPick?: React.ReactNode;
/** Command menu */
  commandMenu?: React.ReactNode;
  /** Global overlays / dialogs rendered last */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Adaptive layout engine for Flow Studio.
 *
 * Desktop:  [Palette] [Canvas] [Properties]
 * Tablet:   [Canvas] + bottom drawer panels
 * Mobile:   Fullscreen canvas + FAB + bottom sheet panels
 *
 * Preserves workflow state across breakpoints (state lives in the store,
 * so switching layouts never loses the graph).
 */
export function FlowStudioLayout({
  palette,
  canvas,
  properties,
  tabletDrawer,
  mobileSheets,
  fab,
  statusBar,
  toolbar,
templateQuickPick,
  commandMenu,
  children,
  className,
}: FlowStudioLayoutProps) {
  const isMobile = useIsMobile();
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isPaletteCollapsed, setIsPaletteCollapsed] = React.useState(false);
  const [isPropertiesCollapsed, setIsPropertiesCollapsed] = React.useState(false);

  const breakpoint: StudioBreakpoint = isMobile
    ? "mobile"
    : isTablet
      ? "tablet"
      : "desktop";

  return (
    <div className={cn("flex flex-col h-full overflow-hidden bg-background", className)} data-breakpoint={breakpoint}>
      {/* Toolbar */}
      {toolbar}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Desktop: full three-pane layout ── */}
        {breakpoint === "desktop" && (
          <>
            {palette && (
              <aside
                className={cn(
                  "relative shrink-0 border-r bg-background/95 backdrop-blur-md transition-[width] duration-200 ease-out z-10",
                  isPaletteCollapsed ? "w-11" : "w-[264px]"
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-2 z-20 size-8"
                  onClick={() => setIsPaletteCollapsed((value) => !value)}
                  aria-label={isPaletteCollapsed ? "Expand node palette" : "Collapse node palette"}
                  aria-expanded={!isPaletteCollapsed}
                >
                  <PanelLeft className={cn("size-4 transition-transform", isPaletteCollapsed && "rotate-180")} />
                </Button>
                <div className={cn("h-full overflow-hidden", isPaletteCollapsed && "invisible")}>{palette}</div>
              </aside>
            )}
            <main className="relative min-w-0 flex-1">
              {canvas}
              {templateQuickPick}
            </main>
            {properties && (
              <aside
                className={cn(
                  "relative shrink-0 border-l bg-background/95 backdrop-blur-md transition-[width] duration-200 ease-out z-10",
                  isPropertiesCollapsed ? "w-11" : "w-[340px]"
                )}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute left-1 top-2 z-20 size-8"
                  onClick={() => setIsPropertiesCollapsed((value) => !value)}
                  aria-label={isPropertiesCollapsed ? "Expand properties panel" : "Collapse properties panel"}
                  aria-expanded={!isPropertiesCollapsed}
                >
                  <PanelRight className={cn("size-4 transition-transform", isPropertiesCollapsed && "rotate-180")} />
                </Button>
                <div className={cn("h-full overflow-hidden", isPropertiesCollapsed && "invisible")}>{properties}</div>
              </aside>
            )}
          </>
        )}

        {/* ── Tablet: full-width canvas + bottom drawers ── */}
        {breakpoint === "tablet" && (
          <>
            <main className="flex-1 relative min-w-0">
              {canvas}
              {templateQuickPick}
            </main>
            {tabletDrawer}
          </>
        )}

        {/* ── Mobile: fullscreen canvas + FAB + bottom sheets ── */}
        {breakpoint === "mobile" && (
          <>
            <main className="flex-1 relative min-w-0">
              {canvas}
              {templateQuickPick}
              {fab}
            </main>
            {mobileSheets}
          </>
        )}
      </div>

      {/* Persistent status bar */}
      {statusBar}

{/* Global overlays */}
      {commandMenu}

      {/* Children (dialogs / global overlays) */}
      {children}
    </div>
  );
}
