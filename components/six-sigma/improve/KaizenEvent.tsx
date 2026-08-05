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
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationTypingIndicator,
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactContent,
  ArtifactActions,
  ArtifactAction,
  ArtifactClose,
  Suggestion,
  Suggestions,
  Sources,
  SourcesTrigger,
  SourcesContent,
  Source,
  Agent,
  AgentHeader,
  AgentStatusDot,
} from "../../ai-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Clock,
  Users,
  Target,
  FileText,
  BarChart3,
  Plus,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------
interface Metric {
  name: string;
  before: number;
  after: number;
  unit: string;
  target: number;
}

interface ActionItem {
  id: string;
  description: string;
  owner: string;
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
}

interface KaizenEvent {
  id: string;
  title: string;
  description: string;
  status: "planning" | "doing" | "checking" | "acting" | "completed";
  startDate: string;
  endDate: string;
  team: string[];
  metrics: Metric[];
  actions: ActionItem[];
}

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
const mockEvent: KaizenEvent = {
  id: "kz-001",
  title: "Reduce setup time on Press #3",
  description:
    "Kaizen event focused on reducing changeover time from 45 minutes to under 15 minutes using SMED methodology.",
  status: "doing",
  startDate: "2026-07-20",
  endDate: "2026-07-24",
  team: ["Tom B", "Aiko T", "Maria S", "James O"],
  metrics: [
    { name: "Setup Time (min)", before: 45, after: 22, unit: "min", target: 15 },
    { name: "Changeover Defects", before: 8, after: 3, unit: "defects", target: 2 },
    { name: "OEE", before: 65, after: 78, unit: "%", target: 85 },
  ],
  actions: [
    {
      id: "a1",
      description: "Create visual work instructions for changeover",
      owner: "Tom B",
      status: "in-progress",
      dueDate: "2026-07-25",
    },
    {
      id: "a2",
      description: "Implement quick-release clamps on die holder",
      owner: "James O",
      status: "completed",
      dueDate: "2026-07-22",
    },
    {
      id: "a3",
      description: "Standardize tool cart layout",
      owner: "Maria S",
      status: "pending",
      dueDate: "2026-07-28",
    },
  ],
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function KaizenEvent() {
  const [event, setEvent] = useState<KaizenEvent>(mockEvent);
  const [conversationMessages, setConversationMessages] = useState<
    { role: string; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Welcome to the Kaizen facilitation session. I can help you track progress, suggest improvements, and document outcomes. What would you like to focus on today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Compute improvement status
  const improvedMetrics = event.metrics.filter(
    (m) => m.after < m.before || m.after > m.before
  );
  const totalImprovement =
    event.metrics.reduce((acc, m) => acc + (m.before - m.after), 0);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleSendMessage = (msg: string) => {
    const userMsg = { role: "user", content: msg };
    setConversationMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let response = "";
      if (msg.toLowerCase().includes("metric")) {
        response =
          "Let's review the metrics. Setup time has improved from 45 to 22 minutes, but we're still above the 15-minute target. Consider focusing on internal vs external setup separation.";
      } else if (msg.toLowerCase().includes("action")) {
        response =
          "You have 3 action items. 'Create visual work instructions' is in progress, 'Quick-release clamps' is completed, and 'Standardize tool cart' is pending. I recommend prioritizing the tool cart layout as it enables other improvements.";
      } else if (msg.toLowerCase().includes("status")) {
        response = `The event is currently in the "Doing" phase. You've completed 1 of 3 actions. Metrics show improvement but not yet at target. Next step: complete remaining actions and plan for the "Check" phase.`;
      } else {
        response =
          "I'm here to support your Kaizen. You can ask about metrics, action items, or next steps. I can also provide suggestions based on lean principles.";
      }
      setConversationMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  // Update metric (mock)
  const updateMetric = (index: number, field: "before" | "after", value: number) => {
    setEvent((prev) => {
      const newMetrics = [...prev.metrics];
      newMetrics[index][field] = value;
      return { ...prev, metrics: newMetrics };
    });
  };

  // Toggle action status
  const toggleActionStatus = (id: string) => {
    setEvent((prev) => {
      const newActions = prev.actions.map((a): ActionItem =>
        a.id === id
          ? {
              ...a,
              status: a.status === "pending" ? "in-progress" as const : a.status === "in-progress" ? "completed" as const : "pending" as const,
            }
          : a
      );
      return { ...prev, actions: newActions };
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <p className="text-sm text-muted-foreground">
            {event.description} · {event.startDate} – {event.endDate}
          </p>
        </div>
        <Badge
          variant={
            event.status === "completed"
              ? "default"
              : event.status === "doing"
              ? "outline"
              : "secondary"
          }
        >
          {event.status.toUpperCase()}
        </Badge>
      </div>

      {/* PDCA Plan */}
      <Plan defaultOpen>
        <PlanHeader>
          <div>
            <PlanTitle>PDCA Cycle</PlanTitle>
            <PlanDescription>Plan → Do → Check → Act</PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {["Plan", "Do", "Check", "Act"].map((phase) => {
              const isActive = phase.toLowerCase() === event.status;
              const isDone =
                ["Plan", "Do", "Check", "Act"].indexOf(phase) <
                ["Plan", "Do", "Check", "Act"].indexOf(event.status.toUpperCase());
              return (
                <div
                  key={phase}
                  className={`rounded-lg border p-3 text-center ${
                    isActive ? "border-primary bg-primary/5" : ""
                  } ${isDone ? "border-green-500/50" : ""}`}
                >
                  <div className="text-sm font-medium">{phase}</div>
                  <div className="text-xs text-muted-foreground">
                    {isActive ? "In progress" : isDone ? "Completed" : "Pending"}
                  </div>
                  {isDone && <CheckCircle className="mx-auto mt-1 size-4 text-green-500" />}
                </div>
              );
            })}
          </div>
        </PlanContent>
      </Plan>

      {/* Main content: Conversation + Artifact */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Conversation Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Facilitator Chat</CardTitle>
            <CardDescription>
              Discuss progress, ask for suggestions, or get AI‑assisted insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-80 overflow-y-auto border rounded-md p-2">
              <Conversation>
                <ConversationContent>
                  {conversationMessages.length === 0 ? (
                    <ConversationEmptyState
                      title="No messages yet"
                      description="Start a conversation about this Kaizen event."
                    />
                  ) : (
                    <div className="space-y-3">
                      {conversationMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <ConversationTypingIndicator label="Assistant is thinking..." />
                      )}
                    </div>
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask about metrics, actions, next steps..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  const input = (e.target as HTMLElement)
                    .previousElementSibling as HTMLInputElement;
                  if (input?.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = "";
                  }
                }}
              >
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Artifact: Metrics & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Before / After Metrics</CardTitle>
            <CardDescription>Track improvements from baseline.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead className="text-right">Before</TableHead>
                  <TableHead className="text-right">After</TableHead>
                  <TableHead className="text-right">Target</TableHead>
                  <TableHead className="text-right">Δ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {event.metrics.map((metric, idx) => {
                  const diff = metric.after - metric.before;
                  const improved =
                    (metric.unit === "%" && diff > 0) ||
                    (metric.unit !== "%" && diff < 0);
                  return (
                    <TableRow key={metric.name}>
                      <TableCell>{metric.name}</TableCell>
                      <TableCell className="text-right font-mono">
                        <Input
                          type="number"
                          value={metric.before}
                          onChange={(e) =>
                            updateMetric(idx, "before", parseFloat(e.target.value) || 0)
                          }
                          className="h-7 w-16 text-right text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        <Input
                          type="number"
                          value={metric.after}
                          onChange={(e) =>
                            updateMetric(idx, "after", parseFloat(e.target.value) || 0)
                          }
                          className="h-7 w-16 text-right text-sm"
                        />
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {metric.target}
                      </TableCell>
                      <TableCell
                        className={`text-right font-mono ${
                          improved ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {diff > 0 ? "+" : ""}
                        {diff.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="size-3" /> Team: {event.team.join(", ")}
              </div>
              <Badge variant="outline">
                {improvedMetrics.length} of {event.metrics.length} improved
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Action Items</CardTitle>
          <CardDescription>Tasks to implement improvements.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]">Toggle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {event.actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>{action.description}</TableCell>
                  <TableCell>{action.owner}</TableCell>
                  <TableCell>{action.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        action.status === "completed"
                          ? "default"
                          : action.status === "in-progress"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {action.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7"
                      onClick={() => toggleActionStatus(action.id)}
                    >
                      <Clock className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Suggestions>
        <Suggestion
          suggestion={
            event.metrics.some((m) => m.after < m.target)
              ? "ℹ️ Some metrics are still below target. Consider adjusting the action plan."
              : "✅ All metrics are on or above target. Great work!"
          }
        />
        <Suggestion
          suggestion={
            event.actions.some((a) => a.status === "pending")
              ? "⏳ You have pending actions. Prioritize completing them to sustain improvements."
              : "All actions completed. Ready for the 'Check' phase."
          }
        />
      </Suggestions>

      {/* Sources */}
      <Sources>
        <SourcesTrigger count={2} />
        <SourcesContent>
          <Source title="Kaizen Event Worksheet" href="/dashboard/documents/templates" />
          <Source title="SMED Training Material" href="/dashboard/learning-development/courses" />
        </SourcesContent>
      </Sources>
    </div>
  );
}