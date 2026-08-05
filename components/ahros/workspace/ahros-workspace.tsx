/**
 * AhrosWorkspace — The main AHROS Agentic Workspace layout.
 *
 * Renders a multi-panel workspace with:
 *  - Left: Conversation + Planning panels
 *  - Center: Workflow Blueprint (FlowDesigner)
 *  - Right: Reasoning + Compliance panels
 *  - Bottom: Timeline panel
 *  - Floating Dock: Knowledge Tree, Sandbox, Memory
 *  - Status bar showing execution state
 *
 * All panels are synchronized via the EventBus and share state via Zustand.
 */

"use client";

import { useState, useCallback, useMemo, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BotIcon,
  PanelLeftOpenIcon,
  PanelLeftCloseIcon,
} from "lucide-react";

// AHROS hooks
import { useAhros } from "@/lib/ahros/wiring/use-ahros";

// Panel components
import { AhrosPanel } from "./ahros-panel";
import { AhrosDock, type DockItem } from "./ahros-dock";

// Panel implementations
import { ConversationPanel } from "../panels/conversation-panel";
import { PlanningPanel } from "../panels/planning-panel";
import { WorkflowPanel } from "../panels/workflow-panel";
import { ReasoningPanel } from "../panels/reasoning-panel";
import { TimelinePanel } from "../panels/timeline-panel";
import { CompliancePanel } from "../panels/compliance-panel";
import { KnowledgePanel } from "../panels/knowledge-panel";
import { SandboxPanel } from "../panels/sandbox-panel";
import { MemoryPanel } from "../panels/memory-panel";

import type { PanelId } from "@/lib/ahros/types";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AhrosWorkspaceProps {
  className?: string;
  /** If true, renders with demo data for testing */
  demoMode?: boolean;
  /** Initial active panel */
  defaultPanel?: PanelId;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function AhrosWorkspace({
  className,
  demoMode = false,
  defaultPanel = "conversation",
}: AhrosWorkspaceProps) {
  const ahros = useAhros();

  // ── Local UI State ──────────────────────────────────────────────────────
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [maximizedPanel, setMaximizedPanel] = useState<PanelId | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────
  const panels = ahros.panels;
  const activePanelId = ahros.activePanelId;

  const dockItems: DockItem[] = useMemo(
    () =>
      panels
        .filter((p) => p.position === "floating")
        .map((p) => ({
          id: `dock-${p.id}`,
          label: p.label,
          type: p.id as any,
          panelId: p.id,
          pinned: !p.collapsed && p.visible,
        })),
    [panels],
  );

  // ── Handlers ────────────────────────────────────────────────────────────

  const setActivePanel = useCallback(
    (panelId: PanelId) => {
      ahros.setActivePanel(panelId);
      setMaximizedPanel(null);
    },
    [ahros],
  );

  const handleMaximize = useCallback(
    (panelId: PanelId) => {
      setMaximizedPanel((prev) => (prev === panelId ? null : panelId));
    },
    [],
  );

  const handleDockItemClick = useCallback(
    (item: DockItem) => {
      setActivePanel(item.panelId);
      const panel = panels.find((p) => p.id === item.panelId);
      if (panel && !panel.visible) {
        ahros.togglePanelVisibility(item.panelId);
      }
    },
    [setActivePanel, panels, ahros],
  );

  // ── Render Panel Content ────────────────────────────────────────────────

  const renderPanelContent = useCallback(
    (panelId: PanelId) => {
      switch (panelId) {
        case "conversation":
          return <ConversationPanel />;
        case "planning":
          return <PlanningPanel />;
        case "workflow":
          return <WorkflowPanel />;
        case "reasoning":
          return <ReasoningPanel />;
        case "timeline":
          return <TimelinePanel />;
        case "compliance":
          return <CompliancePanel />;
        case "knowledge":
          return <KnowledgePanel />;
        case "sandbox":
          return <SandboxPanel />;
        case "memory":
          return <MemoryPanel />;
        default:
          return (
            <div className="p-4 text-sm text-muted-foreground">
              Unknown panel
            </div>
          );
      }
    },
    [],
  );

  // ── Status helpers ────────────────────────────────────────────────────

  const statusColor = useMemo(() => {
    switch (ahros.status) {
      case "executing":
      case "processing":
        return "bg-blue-500 animate-pulse";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "paused":
        return "bg-yellow-500";
      default:
        return "bg-muted-foreground/40";
    }
  }, [ahros.status]);

  const statusLabel = useMemo(() => {
    switch (ahros.status) {
      case "idle":
        return "Idle";
      case "processing":
        return "Processing...";
      case "executing":
        return "Executing...";
      case "paused":
        return "Paused";
      case "completed":
        return "Completed";
      case "error":
        return "Error";
      default:
        return ahros.status;
    }
  }, [ahros.status]);

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className={cn("flex h-full flex-col bg-background", className)}>
      {/* Main workspace area */}
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Column: Conversation + Planning */}
          <ResizablePanel
            defaultSize={25}
            minSize={15}
            maxSize={40}
            collapsedSize={0}
            collapsible
            onResize={(size) => {
              if (typeof size === 'number') setSidebarCollapsed(size < 10);
            }}
            className={cn(
              "border-r bg-background",
              sidebarCollapsed ? "min-w-[40px]" : "min-w-[280px]",
            )}
          >
            <div className="flex flex-col h-full relative">
              {/* Collapse toggle */}
              <button
                onClick={() => setSidebarCollapsed((v) => !v)}
                className="absolute -right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-muted"
                aria-label={
                  sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
              >
                {sidebarCollapsed ? (
                  <PanelLeftOpenIcon className="h-3 w-3" />
                ) : (
                  <PanelLeftCloseIcon className="h-3 w-3" />
                )}
              </button>

              {!sidebarCollapsed && (
                <div className="flex flex-col h-full gap-2 p-2">
                  <AhrosPanel
                    panelId="conversation"
                    title="Conversation"
                    visible
                    collapsible
                    closable={false}
                    collapsed={false}
                    className="flex-1 min-h-[200px]"
                  >
                    <ScrollArea className="h-full">
                      <ConversationPanel />
                    </ScrollArea>
                  </AhrosPanel>

                  <AhrosPanel
                    panelId="planning"
                    title="Planning"
                    visible
                    collapsible
                    closable={false}
                    collapsed
                    className="flex-shrink-0"
                  >
                    <ScrollArea className="max-h-[200px]">
                      <PlanningPanel />
                    </ScrollArea>
                  </AhrosPanel>
                </div>
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Center: Workflow Blueprint */}
          <ResizablePanel defaultSize={50} minSize={30}>
            <AhrosPanel
              panelId="workflow"
              title="Workflow Blueprint"
              visible
              collapsible={false}
              closable={false}
              className="h-full"
              onMaximize={() => handleMaximize("workflow")}
            >
              <WorkflowPanel />
            </AhrosPanel>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Column: Reasoning + Compliance */}
          <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
            <div className="flex flex-col h-full gap-2 p-2">
              <AhrosPanel
                panelId="reasoning"
                title="AI Reasoning"
                visible
                collapsible
                closable={false}
                className="flex-1 min-h-[150px]"
              >
                <ScrollArea className="h-full">
                  <ReasoningPanel />
                </ScrollArea>
              </AhrosPanel>

              <AhrosPanel
                panelId="compliance"
                title="Compliance"
                visible
                collapsible
                closable={false}
                collapsed
                className="flex-shrink-0"
              >
                <ScrollArea className="max-h-[200px]">
                  <CompliancePanel />
                </ScrollArea>
              </AhrosPanel>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Bottom: Timeline */}
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={20} minSize={8} maxSize={40}>
          <AhrosPanel
            panelId="timeline"
            title="Execution Timeline"
            visible
            collapsible
            closable={false}
            className="h-full border-t"
            onMaximize={() => handleMaximize("timeline")}
          >
            <ScrollArea className="h-full">
              <TimelinePanel />
            </ScrollArea>
          </AhrosPanel>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Floating Dock */}
      {dockItems.length > 0 && (
        <AhrosDock
          items={dockItems}
          activePanelId={activePanelId}
          onItemClick={handleDockItemClick}
          position="bottom"
        />
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-1 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className={cn("inline-block size-1.5 rounded-full", statusColor)} />
            {statusLabel}
          </span>
          {ahros.activeEvent && (
            <span className="text-xs">
              Event: {ahros.activeEvent.type.replace(/_/g, " ")}
            </span>
          )}
          {ahros.plan && (
            <span>
              Plan confidence: {Math.round(ahros.plan.confidence * 100)}%
            </span>
          )}
          {ahros.compliance && (
            <span>
              Compliance: {ahros.compliance.score}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span>{ahros.activeArtifactIds.length} artifacts</span>
          {ahros.execution && (
            <span>
              Steps: {ahros.execution.steps.length}
            </span>
          )}
          <button
            onClick={() => ahros.resetWorkspace()}
            className="hover:text-foreground transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

