/**
 * ConversationPanel — Natural language interaction panel.
 *
 * Uses the existing Conversation component from ai-elements.
 * Displays messages, handles input, and dispatches to the HR orchestrator
 * via the real AHROS business event pipeline.
 *
 * Every user message triggers the full pipeline:
 * Conversation → Planning → Workflow → Reasoning → Execution → Compliance → Knowledge → Memory
 * All panels update in real-time via EventBus synchronization.
 */

"use client";

import { useState, useCallback, useRef, type FormEvent } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationTypingIndicator,
  ConversationHeader,
} from "@/components/ai-elements/conversation";
import { PromptInput, type PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useAhrosStore } from "@/lib/zustand/ahros-store";
import { useBusinessEventPipeline } from "@/lib/ahros/wiring/use-business-event-pipeline";
import type { BusinessEventType } from "@/lib/ahros/types";
import { BotIcon } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Intent parser — maps natural language to business event types
function parseIntent(
  input: string,
): { type: BusinessEventType; title: string; description: string; priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" } | null {
  const lower = input.toLowerCase();

  if (lower.includes("work permit") || lower.includes("permit renewal") || lower.includes("renew permit")) {
    return {
      type: "WORK_PERMIT_RENEWAL",
      title: "Work Permit Renewal",
      description: input,
      priority: "HIGH",
    };
  }
  if (lower.includes("onboard") || lower.includes("new hire") || lower.includes("new employee")) {
    return {
      type: "EMPLOYEE_ONBOARDING",
      title: "Employee Onboarding",
      description: input,
      priority: "MEDIUM",
    };
  }
  if (lower.includes("offboard") || lower.includes("terminate") || lower.includes("resign")) {
    return {
      type: "EMPLOYEE_OFFBOARDING",
      title: "Employee Offboarding",
      description: input,
      priority: "HIGH",
    };
  }
  if (lower.includes("contract") || lower.includes("renew")) {
    return {
      type: "CONTRACT_RENEWAL",
      title: "Contract Renewal",
      description: input,
      priority: "MEDIUM",
    };
  }
  if (lower.includes("leave") || lower.includes("vacation") || lower.includes("annual leave")) {
    return {
      type: "LEAVE_REQUEST",
      title: "Leave Request",
      description: input,
      priority: "LOW",
    };
  }
  if (lower.includes("compliance") || lower.includes("audit") || lower.includes("regulation")) {
    return {
      type: "COMPLIANCE_AUDIT",
      title: "Compliance Audit",
      description: input,
      priority: "HIGH",
    };
  }
  if (lower.includes("visa") || lower.includes("immigration") || lower.includes("pass")) {
    return {
      type: "VISA_APPLICATION",
      title: "Visa Application",
      description: input,
      priority: "CRITICAL",
    };
  }
  if (lower.includes("payroll") || lower.includes("salary") || lower.includes("payment")) {
    return {
      type: "PAYROLL_PROCESSING",
      title: "Payroll Processing",
      description: input,
      priority: "HIGH",
    };
  }
  if (lower.includes("training") || lower.includes("course") || lower.includes("development")) {
    return {
      type: "TRAINING_REQUEST",
      title: "Training Request",
      description: input,
      priority: "LOW",
    };
  }
  if (lower.includes("recruit") || lower.includes("hire") || lower.includes("job")) {
    return {
      type: "RECRUITMENT_REQUEST",
      title: "Recruitment Request",
      description: input,
      priority: "MEDIUM",
    };
  }
  if (lower.includes("medical") || lower.includes("health") || lower.includes("examination")) {
    return {
      type: "MEDICAL_EXAMINATION",
      title: "Medical Examination",
      description: input,
      priority: "MEDIUM",
    };
  }

  return null;
}

export function ConversationPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to AHROS — Autonomous HR Operations System. How can I help you today?\n\nI can handle requests like:\n• **Work permit renewal** for employees\n• **Employee onboarding** and offboarding\n• **Contract renewals**\n• **Leave requests**\n• **Compliance audits**\n• **Visa applications**\n• **Payroll processing**\n• **Training requests**\n• **Recruitment** and more.\n\nTry saying: *\"Renew Ahmed's work permit\"* or *\"Onboard a new employee\"*",
      timestamp: new Date(),
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const { processEvent } = useBusinessEventPipeline();

  const handleSubmit = useCallback(
    async (message: PromptInputMessage, _event: FormEvent<HTMLFormElement>) => {
      const content = message.text;
      if (!content.trim()) return;

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      try {
        // Parse intent from natural language
        const intent = parseIntent(content);

        if (intent) {
          // Run through the full AHROS pipeline
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: `## Processing: ${intent.title}\n\nI've identified this as a **${intent.type}** request (Priority: ${intent.priority}).\n\nI'm now running it through the AHROS pipeline:\n\n1. ✅ Intent analyzed — *${intent.description.slice(0, 60)}...*\n2. 🔄 Generating execution plan...\n3. ⏳ Building workflow blueprint...\n4. ⏳ Running AI reasoning...\n5. ⏳ Executing steps...\n6. ⏳ Validating compliance...\n7. ⏳ Generating documentation...\n\nPlease check the **Planning**, **Workflow**, **Reasoning**, **Timeline**, and **Compliance** panels for real-time updates.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);

          // Fire the pipeline (non-blocking for UI responsiveness)
          processEvent({
            type: intent.type,
            title: intent.title,
            description: intent.description,
            initiatedBy: "user",
            priority: intent.priority,
          });
        } else {
          // General query — provide guidance
          const assistantMsg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: `I understand you're asking about: *"${content}"*\n\nI can help with specific HR operations such as:\n\n• **Work permit renewals** — *"Renew John's work permit"*\n• **Employee onboarding** — *"Onboard Maria as a new engineer"*\n• **Compliance audits** — *"Run a compliance check for our foreign workers"*\n• **Visa applications** — *"Apply for a new employment pass"*\n• **Leave requests** — *"Process annual leave for Sarah"*\n• **Payroll** — *"Process payroll for this month"*\n• **Contracts** — *"Renew David's contract"*\n\nCould you rephrase your request as one of these operations? I'll then execute it through the full AHROS pipeline with planning, execution, compliance validation, and documentation.`,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }
      } catch (error) {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: `I encountered an error processing your request: ${error instanceof Error ? error.message : "Unknown error"}\n\nPlease try again or contact support.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsThinking(false);
      }
    },
    [processEvent],
  );

  return (
    <div className="flex flex-col h-full">
      <ConversationHeader
        title="AI Conversation"
        messageCount={messages.length}
      />
      <Conversation>
        <ConversationContent>
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-start gap-2 px-4 py-2">
              {msg.role === "assistant" && (
                <BotIcon className="size-5 mt-0.5 shrink-0 text-primary" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {msg.role === "assistant" ? "AHROS AI" : "You"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          {isThinking && (
            <ConversationTypingIndicator label="AHROS is processing..." />
          )}
        </ConversationContent>
      </Conversation>
      <div className="border-t p-2">
        <PromptInput
          onSubmit={handleSubmit}
          placeholder="Ask about HR operations..."
        />
      </div>
    </div>
  );
}

