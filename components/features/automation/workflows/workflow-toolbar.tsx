"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, Square, RefreshCw } from "lucide-react";

interface WorkflowToolbarProps {
  isRunning?: boolean;
  isPaused?: boolean;
  onRun?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onReset?: () => void;
}

export function WorkflowToolbar({
  isRunning = false,
  isPaused = false,
  onRun,
  onPause,
  onStop,
  onReset,
}: WorkflowToolbarProps) {
  return (
    <div className="flex items-center gap-2 p-2 bg-background border rounded-md shadow-sm">
      {!isRunning && !isPaused && (
        <Button size="sm" onClick={onRun}>
          <Play className="h-4 w-4 mr-1" /> Run
        </Button>
      )}
      {isRunning && !isPaused && (
        <>
          <Button size="sm" variant="outline" onClick={onPause}>
            <Pause className="h-4 w-4 mr-1" /> Pause
          </Button>
          <Button size="sm" variant="destructive" onClick={onStop}>
            <Square className="h-4 w-4 mr-1" /> Stop
          </Button>
        </>
      )}
      {isPaused && (
        <>
          <Button size="sm" variant="outline" onClick={onRun}>
            <Play className="h-4 w-4 mr-1" /> Resume
          </Button>
          <Button size="sm" variant="destructive" onClick={onStop}>
            <Square className="h-4 w-4 mr-1" /> Stop
          </Button>
        </>
      )}
      {(isRunning || isPaused) && (
        <Button size="sm" variant="ghost" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-1" /> Reset
        </Button>
      )}
    </div>
  );
}
