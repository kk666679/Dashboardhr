"use client";

import { useState } from "react";
import {
  Artifact,
  ArtifactHeader,
  ArtifactTitle,
  ArtifactDescription,
  ArtifactActions,
  ArtifactAction,
  ArtifactContent,
  ArtifactClose,
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
  ConversationTypingIndicator,
  ConversationHeader,
} from "../../ai-elements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Save,
  Play,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

// -----------------------------------------------------------------------------
// Mock Data
// -----------------------------------------------------------------------------
interface WorkStep {
  id: string;
  description: string;
  tools: string[];
  qualityCheck: string;
  cycleTime: number; // seconds
}

const initialSteps: WorkStep[] = [
  {
    id: "1",
    description: "Place raw material on feed conveyor",
    tools: ["Conveyor", "Forklift"],
    qualityCheck: "Check material type matches work order",
    cycleTime: 45,
  },
  {
    id: "2",
    description: "Align part using fixture",
    tools: ["Fixture", "Calipers"],
    qualityCheck: "Verify alignment within ±0.5mm",
    cycleTime: 60,
  },
  {
    id: "3",
    description: "Start automated welding cycle",
    tools: ["Welding robot", "Control panel"],
    qualityCheck: "Visual weld inspection",
    cycleTime: 120,
  },
  {
    id: "4",
    description: "Remove part and inspect for defects",
    tools: ["Inspection table", "Magnifying glass"],
    qualityCheck: "No cracks or porosity",
    cycleTime: 30,
  },
];

const mockConversationMessages = [
  {
    role: "assistant",
    content:
      "I can help you draft or update standard work instructions. What would you like to do?",
  },
];

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
export default function StandardWork() {
  const [steps, setSteps] = useState<WorkStep[]>(initialSteps);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [conversationMessages, setConversationMessages] = useState<
    { role: string; content: string }[]
  >(mockConversationMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Conversation handler
  const handleSend = (message: string) => {
    // Add user message
    const userMsg = { role: "user", content: message };
    setConversationMessages((prev) => [...prev, userMsg]);

    // Simulate AI response after a delay
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = {
        role: "assistant",
        content:
          "I've noted your request. Would you like me to update the standard work steps accordingly?",
      };
      setConversationMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Edit handlers
  const startEditing = (step: WorkStep) => {
    setEditingStepId(step.id);
    setEditedDescription(step.description);
  };

  const saveEdit = (id: string) => {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, description: editedDescription } : s
      )
    );
    setEditingStepId(null);
  };

  const cancelEdit = () => {
    setEditingStepId(null);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header with Artifact */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            <ArtifactTitle>Standard Work Sheet – Line B</ArtifactTitle>
            <Badge variant="secondary">v2.3</Badge>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Save" label="Save" icon={Save} />
            <ArtifactAction tooltip="Start work" label="Start" icon={Play} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>

        <ArtifactDescription className="px-4 pb-2 text-sm text-muted-foreground">
          Process: Welding & Assembly · Effective: Aug 1, 2026 · Approved by: QA
        </ArtifactDescription>

        <ArtifactContent>
          <div className="space-y-4">
            {/* Steps table */}
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Step</th>
                    <th className="p-2 text-left">Tools</th>
                    <th className="p-2 text-left">Quality Check</th>
                    <th className="p-2 text-left">Cycle Time</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {steps.map((step) => (
                    <tr key={step.id} className="border-b">
                      <td className="p-2">
                        {editingStepId === step.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editedDescription}
                              onChange={(e) =>
                                setEditedDescription(e.target.value)
                              }
                              className="h-8 text-sm"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => saveEdit(step.id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <span>{step.description}</span>
                        )}
                      </td>
                      <td className="p-2">
                        {step.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="mr-1">
                            {tool}
                          </Badge>
                        ))}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="size-3 text-green-500" />
                          <span className="text-xs">{step.qualityCheck}</span>
                        </div>
                      </td>
                      <td className="p-2">
                        <span className="font-mono text-xs">{step.cycleTime}s</span>
                      </td>
                      <td className="p-2">
                        {editingStepId !== step.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(step)}
                          >
                            Edit
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border p-2 text-center">
                <div className="text-xs text-muted-foreground">Total Steps</div>
                <div className="text-lg font-bold">{steps.length}</div>
              </div>
              <div className="rounded-lg border p-2 text-center">
                <div className="text-xs text-muted-foreground">
                  Total Cycle Time
                </div>
                <div className="text-lg font-bold">
                  {steps.reduce((acc, s) => acc + s.cycleTime, 0)}s
                </div>
              </div>
              <div className="rounded-lg border p-2 text-center">
                <div className="text-xs text-muted-foreground">Operators</div>
                <div className="text-lg font-bold">2</div>
              </div>
            </div>
          </div>
        </ArtifactContent>
      </Artifact>

      {/* Conversation Panel */}
      <Artifact>
        <ArtifactHeader>
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <ArtifactTitle>Standard Work Assistant</ArtifactTitle>
          </div>
          <ArtifactActions>
            <ArtifactAction tooltip="Clear conversation" label="Clear" icon={AlertCircle} />
            <ArtifactClose />
          </ArtifactActions>
        </ArtifactHeader>
        <ArtifactContent>
          <Conversation>
            <ConversationContent>
              {conversationMessages.length === 0 ? (
                <ConversationEmptyState
                  title="No messages yet"
                  description="Ask about standard work updates or clarifications."
                />
              ) : (
                <div className="space-y-4">
                  {conversationMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
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
          <div className="border-t p-2">
            <div className="flex gap-2">
              <Input
                placeholder="Ask about standard work..."
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleSend(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                size="sm"
                onClick={(e) => {
                  const input = e.currentTarget
                    .previousElementSibling as HTMLInputElement;
                  if (input?.value.trim()) {
                    handleSend(input.value);
                    input.value = "";
                  }
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </ArtifactContent>
      </Artifact>
    </div>
  );
}