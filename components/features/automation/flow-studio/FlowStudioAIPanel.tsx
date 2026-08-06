"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Send,
  Wand2,
  X,
  Check,
  Lightbulb,
  Loader2,
  Plus,
  Workflow as WorkflowIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAI } from "@/hooks/useAI";
import { useWorkflowStore } from "@/lib/zustand/workflow-store";
import { useToast } from "@/components/ui/use-toast";

interface FlowStudioAIPanelProps {
  endpoint?: string;
  onClose?: () => void;
  className?: string;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  apply: () => void;
}

/**
 * AI Workflow Copilot panel.
 *
 * Features:
 *  - Natural Language Builder: "Create employee onboarding workflow"
 *    → generates a node graph and loads it onto the canvas.
 *  - AI Suggestions while editing (contextual hints).
 *  - Streaming-style response UI with typing animation, suggestion cards,
 *    apply + dismiss buttons.
 */
export function FlowStudioAIPanel({
  endpoint = "/api/ai/chat",
  onClose,
  className,
}: FlowStudioAIPanelProps) {
  const { toast } = useToast();
  const { messages, sendMessage, isThinking, clearMessages } = useAI({
    endpoint,
    context: {
      nodes: useWorkflowStore.getState().nodes,
      edges: useWorkflowStore.getState().edges,
    },
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Simulate streaming text effect
  useEffect(() => {
    if (!isThinking) return;
    const demo = "Analyzing your workflow… Generating recommended nodes and connections…";
    let i = 0;
    setStreaming("");
    const id = setInterval(() => {
      i += 1;
      setStreaming(demo.slice(0, i));
      if (i >= demo.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [isThinking]);

  const handleGenerateWorkflow = () => {
    const store = useWorkflowStore.getState();
    if (store.nodes.length > 0) {
      setSuggestions([
        {
          id: "gen-1",
          title: "Replace current canvas?",
          description: "You already have a workflow open. Generate a new one will replace it.",
          apply: () => {
            const started = generateOnboarding(useWorkflowStore.getState());
            setSuggestions([]);
            if (started) toast({ title: "Workflow generated ✨" });
          },
        },
      ]);
      return;
    }
    const started = generateOnboarding(store);
    if (started) toast({ title: "Workflow generated ✨" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isThinking) return;
    setInput("");

    // Local intent handling for common phrases
    const lower = prompt.toLowerCase();
    if (lower.includes("onboarding")) {
      const started = generateOnboarding(useWorkflowStore.getState());
      if (started) {
        toast({ title: "Onboarding workflow generated ✨" });
        return;
      }
    }
    if (lower.includes("approval") || lower.includes("leave")) {
      const started = generateApproval(useWorkflowStore.getState());
      if (started) {
        toast({ title: "Approval workflow generated ✨" });
        return;
      }
    }
    if (lower.includes("payroll")) {
      const started = generatePayroll(useWorkflowStore.getState());
      if (started) {
        toast({ title: "Payroll workflow generated ✨" });
        return;
      }
    }

    // Fall through to remote AI endpoint
    await sendMessage(prompt);
  };

  // Contextual suggestions while editing
  useEffect(() => {
    const nodes = useWorkflowStore.getState().nodes;
    if (nodes.length === 0) return;
    const hasApproval = nodes.some((n) => n.type === "approval" || n.type === "decision");
    const hasPayroll = nodes.some((n) => n.data?.actionType === "payroll" || /payroll/i.test(String(n.data?.label ?? "")));
    const list: Suggestion[] = [];

    if (hasApproval) {
      list.push({
        id: "sug-approval",
        title: "Approval node has no rejection path",
        description: "Consider adding a rejection branch to handle declined requests.",
        apply: () => {
          useWorkflowStore.getState().addNode("decision", {
            label: "Rejected?",
            description: "Handle rejection branch",
            condition: "status === rejected",
          });
          toast({ title: "Added rejection path node" });
          setSuggestions((s) => s.filter((x) => x.id !== "sug-approval"));
        },
      });
      list.push({
        id: "sug-sla",
        title: "Add SLA escalation",
        description: "Approvals may stall. Add a timeout + escalation step.",
        apply: () => {
          useWorkflowStore.getState().addNode("wait", {
            label: "SLA Timeout",
            description: "Escalate after deadline",
            waitType: "time",
            duration: 24,
          });
          toast({ title: "Added SLA escalation node" });
          setSuggestions((s) => s.filter((x) => x.id !== "sug-sla"));
        },
      });
    }
    if (hasPayroll) {
      list.push({
        id: "sug-compliance",
        title: "Payroll step missing compliance check",
        description: "Add EPF/SOCSO/EIS compliance verification.",
        apply: () => {
          useWorkflowStore.getState().addNode("action", {
            label: "Compliance Check",
            description: "Verify EPF/SOCSO/EIS contributions",
            actionType: "compliance-check",
          });
          toast({ title: "Added compliance check" });
          setSuggestions((s) => s.filter((x) => x.id !== "sug-compliance"));
        },
      });
    }

    setSuggestions((prev) => {
      const ids = new Set(list.map((s) => s.id));
      return [...list, ...prev.filter((p) => !ids.has(p.id))];
    });
  }, [messages, toast]);

  return (
    <div className={cn("flex flex-col h-full bg-background/95 backdrop-blur-md border rounded-xl shadow-lg", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-violet-500" />
          <span className="text-sm font-semibold">AI Copilot</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={clearMessages} title="Clear">
            <X className="h-3.5 w-3.5" />
          </Button>
          {onClose && (
            <Button variant="ghost" size="icon-sm" onClick={onClose} title="Close">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="p-3 border-b space-y-2">
        <div className="flex items-center gap-2">
          <Wand2 className="h-4 w-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">Natural Language Builder</span>
        </div>
        <Button variant="outline" size="sm" className="w-full justify-start text-xs" onClick={handleGenerateWorkflow}>
          <WorkflowIcon className="h-3.5 w-3.5 mr-1" />
          Create employee onboarding workflow
        </Button>
      </div>

      {/* AI Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 border-b space-y-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-medium text-muted-foreground">Suggestions</span>
          </div>
          {suggestions.map((s) => (
            <div key={s.id} className="rounded-lg border bg-muted/40 p-2 space-y-1.5">
              <p className="text-xs font-medium">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
              <div className="flex gap-1.5">
                <Button size="xs" variant="outline" className="gap-1" onClick={s.apply}>
                  <Check className="h-3 w-3" /> Apply
                </Button>
                <Button
                  size="xs"
                  variant="ghost"
                  className="gap-1"
                  onClick={() => setSuggestions((prev) => prev.filter((x) => x.id !== s.id))}
                >
                  <X className="h-3 w-3" /> Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

{/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                m.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {m.content}
            </div>
          ))}
          {streaming && (
            <div className="max-w-[85%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
              {streaming}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a workflow…"
            className="h-9 text-sm"
          />
          <Button type="submit" size="icon" disabled={isThinking || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-1 mt-2 flex-wrap">
          <Badge variant="secondary" className="text-[10px]">Generate</Badge>
          <Badge variant="secondary" className="text-[10px]">Explain</Badge>
          <Badge variant="secondary" className="text-[10px]">Optimize</Badge>
        </div>
      </form>
    </div>
  );
}

// ─── Local workflow generators ───────────────────────────────────────────────

function generateOnboarding(store: ReturnType<typeof useWorkflowStore.getState>): boolean {
  store.clearFlow();
  const s = useWorkflowStore.getState();
  s.addNode("start", { label: "Offer Accepted", description: "Workflow start", trigger: "manual" }, { x: 80, y: 200 });
  s.addNode("action", { label: "Send Welcome Email", description: "Docs checklist", actionType: "send-email" }, { x: 320, y: 200 });
  s.addNode("action", { label: "Create Employee Record", description: "HR system", actionType: "create-record" }, { x: 560, y: 200 });
  s.addNode("action", { label: "Assign Manager", description: "Set reporting line", actionType: "assign" }, { x: 800, y: 200 });
  s.addNode("email", { label: "Send Welcome Email", description: "Intro + next steps", subject: "Welcome to the team", to: "employee@company.com" }, { x: 1040, y: 200 });
  s.addNode("action", { label: "Schedule Training", description: "Day-one orientation", actionType: "schedule" }, { x: 1280, y: 200 });
  s.addNode("end", { label: "Complete", description: "Onboarding done", result: "success" }, { x: 1520, y: 200 });

  const nodes = useWorkflowStore.getState().nodes;
  // Connect sequentially
  const edges = nodes.slice(0, -1).map((n, i) => ({
    id: `gen-e-${i}`,
    source: n.id,
    target: nodes[i + 1].id,
    type: "smoothstep" as const,
  }));
useWorkflowStore.setState((state) => ({ edges, isDirty: true }));
  useWorkflowStore.getState().pushHistory();
  return true;
}

function generateApproval(store: ReturnType<typeof useWorkflowStore.getState>): boolean {
  store.clearFlow();
  const s = useWorkflowStore.getState();
  s.addNode("start", { label: "Request Submitted", trigger: "manual" }, { x: 80, y: 200 });
  s.addNode("action", { label: "Validate Request", actionType: "validate" }, { x: 320, y: 200 });
  s.addNode("approval", { label: "Manager Approval", assigneeRole: "Line_Manager" }, { x: 560, y: 200 });
  s.addNode("decision", { label: "Approved?", condition: "approved === true" }, { x: 800, y: 200 });
  s.addNode("email", { label: "Approved Notification", subject: "Request approved" }, { x: 1040, y: 80 });
  s.addNode("email", { label: "Rejected Notification", subject: "Request rejected" }, { x: 1040, y: 320 });
  s.addNode("end", { label: "Complete", result: "success" }, { x: 1280, y: 160 });

  const nodes = useWorkflowStore.getState().nodes;
  const edges = [
    { id: "a1", source: nodes[0].id, target: nodes[1].id, type: "smoothstep" as const },
    { id: "a2", source: nodes[1].id, target: nodes[2].id, type: "smoothstep" as const },
    { id: "a3", source: nodes[2].id, target: nodes[3].id, type: "smoothstep" as const },
    { id: "a4", source: nodes[3].id, target: nodes[4].id, type: "smoothstep" as const, label: "Approved" },
    { id: "a5", source: nodes[3].id, target: nodes[5].id, type: "smoothstep" as const, label: "Rejected" },
    { id: "a6", source: nodes[4].id, target: nodes[6].id, type: "smoothstep" as const },
    { id: "a7", source: nodes[5].id, target: nodes[6].id, type: "smoothstep" as const },
  ];
useWorkflowStore.setState((state) => ({ edges, isDirty: true }));
  useWorkflowStore.getState().pushHistory();
  return true;
}

function generatePayroll(store: ReturnType<typeof useWorkflowStore.getState>): boolean {
  store.clearFlow();
  const s = useWorkflowStore.getState();
  s.addNode("trigger", { label: "Monthly Payroll Trigger", event: "schedule.monthly" }, { x: 80, y: 200 });
  s.addNode("action", { label: "Fetch Attendance & OT", actionType: "fetch" }, { x: 320, y: 200 });
  s.addNode("action", { label: "Calculate Gross Pay", actionType: "calculate" }, { x: 560, y: 200 });
  s.addNode("action", { label: "Compute EPF/SOCSO/EIS/PCB", actionType: "statutory" }, { x: 800, y: 200 });
  s.addNode("approval", { label: "CFO Approval", assigneeRole: "CFO" }, { x: 1040, y: 200 });
  s.addNode("action", { label: "Generate Payslips", actionType: "generate" }, { x: 1280, y: 200 });
  s.addNode("end", { label: "Complete", result: "success" }, { x: 1520, y: 200 });

  const nodes = useWorkflowStore.getState().nodes;
  const edges = nodes.slice(0, -1).map((n, i) => ({
    id: `pay-e-${i}`,
    source: n.id,
    target: nodes[i + 1].id,
    type: "smoothstep" as const,
  }));
useWorkflowStore.setState((state) => ({ edges, isDirty: true }));
  useWorkflowStore.getState().pushHistory();
  return true;
}
