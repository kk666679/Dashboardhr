"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ZoomIn, ZoomOut, Maximize2, Grid3x3, Magnet,
  Undo2, Redo2, Save, Download, Upload, Layers,
  Search, Play, Pause, Square, RotateCcw,
  GitBranch, Layout, AlignJustify, AlignHorizontalJustifyCenter,
  MoreHorizontal, Keyboard, Eye, EyeOff, Map,
  Crosshair, ChevronDown, Sparkles, History,
  FlaskConical, BarChart3, BookOpen, Settings2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AutoLayout } from "./layout/AutoLayout";

interface FlowStudioToolbarProps {
  // Viewport
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onZoomTo100: () => void;
  zoomLevel?: number;
  // Canvas toggles
  showGrid: boolean;
  showSnap: boolean;
  showMinimap: boolean;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onToggleMinimap: () => void;
  // History
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  // File
  onSave: () => void;
  onExport: () => void;
  onImport: () => void;
  isDirty?: boolean;
  // Panels
  onToggleSearch: () => void;
  onToggleLayers: () => void;
  onToggleAI: () => void;
  onToggleLogs: () => void;
  onToggleVersions: () => void;
  onToggleTest: () => void;
  onToggleAnalytics: () => void;
  showAI?: boolean;
  showLogs?: boolean;
  showVersions?: boolean;
  showTest?: boolean;
  showAnalytics?: boolean;
  // Execution
  executionStatus: "idle" | "running" | "paused" | "completed" | "failed";
  onExecute: () => void;
  onPause: () => void;
  onStop: () => void;
  // Meta
  nodeCount?: number;
  edgeCount?: number;
  className?: string;
}

function ToolBtn({
  icon: Icon,
  label,
  shortcut,
  onClick,
  disabled,
  active,
  variant = "ghost",
  className,
}: {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: "ghost" | "default" | "outline";
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size="icon"
          className={cn(
            "h-7 w-7 shrink-0",
            active && "bg-accent text-accent-foreground",
            className
          )}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className="h-3.5 w-3.5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="flex items-center gap-2">
        <span>{label}</span>
        {shortcut && (
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            {shortcut}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

const SEP = () => <Separator orientation="vertical" className="h-5 mx-0.5" />;

export function FlowStudioToolbar({
  onZoomIn, onZoomOut, onFitView, onZoomTo100, zoomLevel = 100,
  showGrid, showSnap, showMinimap, onToggleGrid, onToggleSnap, onToggleMinimap,
  canUndo, canRedo, onUndo, onRedo,
  onSave, onExport, onImport, isDirty,
  onToggleSearch, onToggleLayers, onToggleAI, onToggleLogs,
  onToggleVersions, onToggleTest, onToggleAnalytics,
  showAI, showLogs, showVersions, showTest, showAnalytics,
  executionStatus, onExecute, onPause, onStop,
  nodeCount = 0, edgeCount = 0,
  className,
}: FlowStudioToolbarProps) {
  const isRunning = executionStatus === "running";
  const isPaused = executionStatus === "paused";
  const isActive = isRunning || isPaused;

  return (
    <div className={cn(
      "flex items-center gap-0.5 px-2 py-1 bg-background/95 backdrop-blur border-b shrink-0 overflow-x-auto scrollbar-none",
      className
    )}>

      {/* ── History ── */}
      <ToolBtn icon={Undo2}  label="Undo"  shortcut="⌘Z" onClick={onUndo} disabled={!canUndo} />
      <ToolBtn icon={Redo2}  label="Redo"  shortcut="⌘⇧Z" onClick={onRedo} disabled={!canRedo} />

      <SEP />

      {/* ── Viewport ── */}
      <ToolBtn icon={ZoomIn}   label="Zoom In"   shortcut="+" onClick={onZoomIn} />
      <ToolBtn icon={ZoomOut}  label="Zoom Out"  shortcut="-" onClick={onZoomOut} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-mono tabular-nums shrink-0 min-w-[46px]"
            onClick={onZoomTo100}
          >
            {Math.round(zoomLevel)}%
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">Reset to 100%</TooltipContent>
      </Tooltip>
      <ToolBtn icon={Maximize2} label="Fit View" shortcut="⌘⇧F" onClick={onFitView} />

      <SEP />

      {/* ── Canvas toggles ── */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={showGrid}
            onPressedChange={onToggleGrid}
            size="sm"
            className="h-7 w-7 data-[state=on]:bg-accent"
            aria-label="Toggle Grid"
          >
            <Grid3x3 className="h-3.5 w-3.5" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom">Grid</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={showSnap}
            onPressedChange={onToggleSnap}
            size="sm"
            className="h-7 w-7 data-[state=on]:bg-accent"
            aria-label="Toggle Snap"
          >
            <Magnet className="h-3.5 w-3.5" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom">Snap to Grid</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Toggle
            pressed={showMinimap}
            onPressedChange={onToggleMinimap}
            size="sm"
            className="h-7 w-7 data-[state=on]:bg-accent"
            aria-label="Toggle Minimap"
          >
            <Map className="h-3.5 w-3.5" />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent side="bottom">Minimap</TooltipContent>
      </Tooltip>

      <SEP />

      {/* ── Auto Layout ── */}
      <AutoLayout />

      <SEP />

      {/* ── File ops ── */}
      <ToolBtn icon={Save}   label="Save"   shortcut="⌘S" onClick={onSave} />
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">More</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuLabel>File</DropdownMenuLabel>
          <DropdownMenuItem onClick={onExport}>
            <Download className="mr-2 h-4 w-4" /> Export JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onImport}>
            <Upload className="mr-2 h-4 w-4" /> Import JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuItem onClick={onToggleSearch}>
            <Search className="mr-2 h-4 w-4" /> Search Nodes
            <kbd className="ml-auto text-[10px] text-muted-foreground">⌘F</kbd>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleLayers}>
            <Layers className="mr-2 h-4 w-4" /> Layers
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SEP />

      {/* ── Execution ── */}
      {!isActive ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              className="h-7 gap-1.5 px-2.5 text-xs bg-green-600 hover:bg-green-700 text-white shrink-0"
              onClick={onExecute}
            >
              <Play className="h-3 w-3 fill-current" />
              <span className="hidden sm:inline">Run</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Run Workflow <kbd className="ml-1 text-[10px]">⌘↵</kbd></TooltipContent>
        </Tooltip>
      ) : (
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-yellow-600"
                onClick={onPause}
              >
                {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{isPaused ? "Resume" : "Pause"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-red-600"
                onClick={onStop}
              >
                <Square className="h-3.5 w-3.5 fill-current" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Stop</TooltipContent>
          </Tooltip>
          <Badge
            variant="outline"
            className={cn(
              "h-5 text-[10px] px-1.5 shrink-0",
              isRunning && "border-green-500 text-green-600 animate-pulse",
              isPaused && "border-yellow-500 text-yellow-600"
            )}
          >
            {isRunning ? "Running" : "Paused"}
          </Badge>
        </div>
      )}

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Panel toggles (right side) ── */}
      <div className="flex items-center gap-0.5">
        <ToolBtn
          icon={Sparkles}
          label="AI Copilot"
          shortcut="⌘I"
          onClick={onToggleAI}
          active={showAI}
          className="text-violet-500"
        />
        <ToolBtn
          icon={FlaskConical}
          label="Test Mode"
          onClick={onToggleTest}
          active={showTest}
          className="text-blue-500"
        />
        <ToolBtn
          icon={History}
          label="Version History"
          onClick={onToggleVersions}
          active={showVersions}
          className="text-orange-500"
        />
        <ToolBtn
          icon={BarChart3}
          label="Analytics"
          onClick={onToggleAnalytics}
          active={showAnalytics}
          className="text-teal-500"
        />
        <ToolBtn
          icon={BookOpen}
          label="Execution Logs"
          onClick={onToggleLogs}
          active={showLogs}
          className="text-slate-500"
        />
      </div>

      {/* ── Dirty indicator ── */}
      {isDirty && (
        <div className="flex items-center gap-1 ml-1 shrink-0">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          <span className="text-[10px] text-amber-500 font-medium hidden sm:inline">Unsaved</span>
        </div>
      )}
    </div>
  );
}
