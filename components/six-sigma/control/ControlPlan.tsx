"use client";

import { useState } from "react";
import {
  Plan,
  PlanHeader,
  PlanTitle,
  PlanDescription,
  PlanContent,
  PlanTrigger,
  PlanAction,
  Task,
  TaskTrigger,
  TaskContent,
  TaskItem,
  Controls,
} from "../../ai-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface ControlStep {
  id: string;
  name: string;
  owner: string;
  frequency: string;
  status: "active" | "review" | "completed";
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const initialSteps: ControlStep[] = [
  {
    id: "1",
    name: "Monitor process mean",
    owner: "John Doe",
    frequency: "Hourly",
    status: "active",
  },
  {
    id: "2",
    name: "Check calibration of gauge",
    owner: "Jane Smith",
    frequency: "Daily",
    status: "review",
  },
  {
    id: "3",
    name: "Review control charts",
    owner: "Mike Johnson",
    frequency: "Weekly",
    status: "completed",
  },
];

const taskList = [
  { id: "t1", label: "Update control limits based on latest data", priority: "high" },
  { id: "t2", label: "Schedule training on new control procedures", priority: "medium" },
  { id: "t3", label: "Audit compliance with control plan", priority: "low" },
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function ControlPlan() {
  const [steps, setSteps] = useState<ControlStep[]>(initialSteps);
  const [newStepName, setNewStepName] = useState("");

  const addStep = () => {
    if (!newStepName.trim()) return;
    const newStep: ControlStep = {
      id: Date.now().toString(),
      name: newStepName,
      owner: "Unassigned",
      frequency: "Daily",
      status: "active",
    };
    setSteps([...steps, newStep]);
    setNewStepName("");
  };

  return (
    <div className="space-y-4 p-4">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Control Plan</h2>
        <div className="flex items-center gap-2">
          <Controls className="scale-75" />
          <Button variant="outline" size="sm">
            <Plus className="mr-1 size-4" /> Add Step
          </Button>
        </div>
      </div>

      {/* Plan Component */}
      <Plan defaultOpen>
        <PlanHeader>
          <div>
            <PlanTitle>Process Control Plan</PlanTitle>
            <PlanDescription>
              Documented procedures for monitoring and maintaining process
              stability.
            </PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent className="space-y-4">
          {/* Stats cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Steps</div>
              <div className="text-2xl font-bold">{steps.length}</div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Active</div>
              <div className="text-2xl font-bold">
                {steps.filter((s) => s.status === "active").length}
              </div>
            </div>
            <div className="rounded-lg border p-3">
              <div className="text-sm text-muted-foreground">Review</div>
              <div className="text-2xl font-bold">
                {steps.filter((s) => s.status === "review").length}
              </div>
            </div>
          </div>

          {/* Steps table */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input
                placeholder="New control step name..."
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addStep} size="sm">
                Add
              </Button>
            </div>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Step</th>
                    <th className="p-2 text-left">Owner</th>
                    <th className="p-2 text-left">Frequency</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step) => (
                    <tr key={step.id} className="border-b">
                      <td className="p-2">{step.name}</td>
                      <td className="p-2">{step.owner}</td>
                      <td className="p-2">{step.frequency}</td>
                      <td className="p-2">
                        <Badge
                          variant={
                            step.status === "active"
                              ? "default"
                              : step.status === "review"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {step.status}
                        </Badge>
                      </td>
                      <td className="p-2">
                        <Button variant="ghost" size="icon" className="size-6">
                          <Pencil className="size-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-6">
                          <Trash2 className="size-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </PlanContent>
      </Plan>

      {/* Task Component */}
      <Task defaultOpen>
        <TaskTrigger title="Action Items" />
        <TaskContent>
          {taskList.map((task) => (
            <TaskItem key={task.id}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{task.label}</span>
                <Badge
                  variant={
                    task.priority === "high" ? "destructive" : "outline"
                  }
                >
                  {task.priority}
                </Badge>
              </div>
            </TaskItem>
          ))}
        </TaskContent>
      </Task>
    </div>
  );
}