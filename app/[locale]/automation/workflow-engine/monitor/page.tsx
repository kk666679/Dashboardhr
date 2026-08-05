"use client";

/**
 * Workflow Monitor Page
 *
 * Uses the shared WorkflowExecutionMonitor component.
 * Previously this was a standalone page with its own data fetching and rendering.
 * Now it reuses the shared monitoring component from the automation module.
 *
 * @see WorkflowExecutionMonitor (shared base)
 */

import { WorkflowExecutionMonitor } from "@/components/features/automation/WorkflowExecutionMonitor";

export default function WorkflowMonitorPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Workflow Monitor</h1>
        <p className="text-sm text-muted-foreground">
          Real-time status of all workflow instances
        </p>
      </div>
      <WorkflowExecutionMonitor />
    </div>
  );
}

