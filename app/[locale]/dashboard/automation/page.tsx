"use client";

import { FlowDesigner } from "@/components/features/automation/FlowDesigner";

export default function AutomationPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background p-4">
        <h1 className="text-xl font-semibold">Automation Hub</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Design and manage workflows from a single automation workspace.
        </p>
      </div>
      <FlowDesigner />
    </div>
  );
}
