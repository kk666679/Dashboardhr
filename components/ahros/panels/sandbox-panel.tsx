/**
 * SandboxPanel — Workflow simulation sandbox.
 *
 * Uses the Sandbox component from ai-elements to simulate
 * entire workflows without making production changes.
 * Displays: API calls, documents, database mutations,
 * notifications, cost, runtime, compliance warnings.
 */

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Sandbox,
  SandboxHeader,
  SandboxContent,
  SandboxTabs,
  SandboxTabsBar,
  SandboxTabsList,
  SandboxTabsTrigger,
  SandboxTabContent,
} from "@/components/ai-elements/sandbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import {
  PlayIcon,
  RotateCcwIcon,
  BeakerIcon,
  TerminalIcon,
  DatabaseIcon,
  BellIcon,
  DollarSignIcon,
  ClockIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
} from "lucide-react";

interface SimulatedAction {
  id: string;
  type: "api_call" | "document" | "database" | "notification";
  label: string;
  status: "pending" | "simulating" | "success" | "warning" | "error";
  detail: string;
  duration: string;
  cost?: string;
  warnings?: string[];
}

export function SandboxPanel() {
  const plan = useAhrosStore((s) => s.currentPlan);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState("simulation");

  // Generate simulated actions from the plan
  const actions = useMemo((): SimulatedAction[] => {
    if (!plan) return [];

    const result: SimulatedAction[] = [];

    plan.tasks.forEach((task, index) => {
      result.push({
        id: `api-${task.id}`,
        type: "api_call",
        label: `API: ${task.title}`,
        status: "pending",
        detail: `POST /api/workflow/step/${index + 1}`,
        duration: `${task.estimatedDuration ?? 5}s`,
        cost: `RM ${((task.estimatedDuration ?? 5) * 0.02).toFixed(2)}`,
      });

      result.push({
        id: `doc-${task.id}`,
        type: "document",
        label: `Document: ${task.title}`,
        status: "pending",
        detail: `${task.description.slice(0, 50)}...`,
        duration: "2s",
        warnings:
          task.risk === "HIGH"
            ? ["High risk task requires additional validation"]
            : undefined,
      });

      result.push({
        id: `db-${task.id}`,
        type: "database",
        label: `DB: ${task.title}`,
        status: "pending",
        detail: `UPDATE workflow_state SET step_${index + 1} = 'completed'`,
        duration: "1s",
      });

      result.push({
        id: `notif-${task.id}`,
        type: "notification",
        label: `Notify: ${task.title}`,
        status: "pending",
        detail: `Send notification to stakeholders`,
        duration: "0.5s",
      });
    });

    return result;
  }, [plan]);

  const handleSimulate = useCallback(() => {
    if (!actions.length) return;
    setIsSimulating(true);

    // Simulate each action sequentially
    actions.forEach((action, index) => {
      setTimeout(() => {
        const el = document.getElementById(`action-${action.id}`);
        if (el) {
          el.className = el.className.replace(
            "text-muted-foreground",
            "",
          );
        }
      }, index * 500 + 500);
    });

    // Complete simulation
    setTimeout(() => {
      setIsSimulating(false);
    }, actions.length * 500 + 1000);
  }, [actions]);

  const handleReset = useCallback(() => {
    setIsSimulating(false);
    setActiveTab("simulation");
  }, []);

  const totalCost = useMemo(() => {
    return actions
      .reduce((sum, a) => {
        const cost = a.cost ? parseFloat(a.cost.replace("RM ", "")) : 0;
        return sum + cost;
      }, 0)
      .toFixed(2);
  }, [actions]);

  const totalDuration = useMemo(() => {
    const total = actions.reduce(
      (sum, a) => sum + parseInt(a.duration),
      0,
    );
    return `${Math.floor(total / 60)}m ${total % 60}s`;
  }, [actions]);

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <BeakerIcon className="size-8 text-muted-foreground/30 mb-2" />
        <p className="text-sm text-muted-foreground">No sandbox data</p>
        <p className="text-xs text-muted-foreground/60 mt-1">
          Generate a plan first, then simulate it here
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-muted/20 shrink-0">
        <div className="flex items-center gap-2">
          <BeakerIcon className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium">Sandbox Simulation</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="default"
            className="h-7 px-2 text-xs"
            onClick={handleSimulate}
            disabled={isSimulating}
          >
            <PlayIcon className="size-3 mr-1" />
            {isSimulating ? "Simulating..." : "Simulate"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={handleReset}
          >
            <RotateCcwIcon className="size-3 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <SandboxTabs value={activeTab} onValueChange={setActiveTab}>
        <SandboxTabsBar>
          <SandboxTabsList>
            <SandboxTabsTrigger value="simulation">
              Simulation
            </SandboxTabsTrigger>
            <SandboxTabsTrigger value="metrics">
              Metrics
            </SandboxTabsTrigger>
            <SandboxTabsTrigger value="warnings">
              Warnings
              {actions.filter((a) => a.warnings).length > 0 && (
                <Badge variant="destructive" className="ml-1 text-[9px] px-1">
                  {actions.filter((a) => a.warnings).length}
                </Badge>
              )}
            </SandboxTabsTrigger>
          </SandboxTabsList>
        </SandboxTabsBar>

        <ScrollArea className="flex-1">
          <SandboxTabContent value="simulation">
            <div className="p-3 space-y-1">
              {actions.map((action) => (
                <div
                  key={action.id}
                  id={`action-${action.id}`}
                  className="flex items-center gap-3 rounded-md border p-2 text-xs"
                >
                  <div className="flex items-center justify-center size-6 shrink-0">
                    {action.type === "api_call" && (
                      <TerminalIcon className="size-3.5 text-blue-500" />
                    )}
                    {action.type === "document" && (
                      <BeakerIcon className="size-3.5 text-purple-500" />
                    )}
                    {action.type === "database" && (
                      <DatabaseIcon className="size-3.5 text-green-500" />
                    )}
                    {action.type === "notification" && (
                      <BellIcon className="size-3.5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs">{action.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {action.detail}
                    </p>
                    {action.warnings && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <AlertTriangleIcon className="size-2.5 text-amber-500" />
                        <span className="text-[9px] text-amber-500">
                          {action.warnings[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground shrink-0">
                    <span className="flex items-center gap-0.5">
                      <ClockIcon className="size-2.5" />
                      {action.duration}
                    </span>
                    {action.cost && (
                      <span className="flex items-center gap-0.5">
                        <DollarSignIcon className="size-2.5" />
                        {action.cost}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SandboxTabContent>

          <SandboxTabContent value="metrics">
            <div className="p-6 space-y-4">
              <h3 className="text-sm font-medium">Simulation Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <ClockIcon className="size-3" />
                    Total Duration
                  </div>
                  <p className="text-lg font-semibold">{totalDuration}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <DollarSignIcon className="size-3" />
                    Estimated Cost
                  </div>
                  <p className="text-lg font-semibold">RM {totalCost}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <TerminalIcon className="size-3" />
                    API Calls
                  </div>
                  <p className="text-lg font-semibold">
                    {actions.filter((a) => a.type === "api_call").length}
                  </p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                    <DatabaseIcon className="size-3" />
                    DB Operations
                  </div>
                  <p className="text-lg font-semibold">
                    {actions.filter((a) => a.type === "database").length}
                  </p>
                </div>
              </div>
            </div>
          </SandboxTabContent>

          <SandboxTabContent value="warnings">
            <div className="p-3 space-y-2">
              {actions
                .filter((a) => a.warnings)
                .map((action) => (
                  <div
                    key={`warn-${action.id}`}
                    className="flex items-start gap-2 rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 p-2"
                  >
                    <AlertTriangleIcon className="size-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">{action.label}</p>
                      {action.warnings?.map((w, i) => (
                        <p
                          key={i}
                          className="text-[10px] text-amber-600 dark:text-amber-400"
                        >
                          {w}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              {actions.filter((a) => a.warnings).length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <CheckCircle2Icon className="size-6 mb-1" />
                  <p className="text-sm">No warnings</p>
                  <p className="text-xs">All simulation steps look clean</p>
                </div>
              )}
            </div>
          </SandboxTabContent>
        </ScrollArea>
      </SandboxTabs>
    </div>
  );
}

