"use client";

import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";

export interface OrchestratorOptions {
  /** Employee ID for context – if provided, the orchestrator will fetch user-specific data */
  employeeId?: string;
  /** Session ID – if not provided, a new one will be created by the server */
  sessionId?: string;
  /** Which specialist agents to include in the orchestration (default: all) */
  agents?: string[];
  /** Provider override for the underlying LLM */
  provider?: "claude" | "openai" | "ollama";
  /** Tenant ID (auto‑inferred from session, but can be overridden) */
  tenantId?: string;
}

export type OrchestratorMessage = UIMessage;

/**
 * Low‑level hook to communicate with the HR Orchestrator API.
 * This is the foundation for all conversational AI in the system.
 *
 * @see server/api/hr-orchestrator/route.ts for the endpoint implementation.
 */
export function useHrOrchestrator(options: OrchestratorOptions = {}) {
  const { employeeId, sessionId, agents, provider, tenantId } = options;

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/hr-orchestrator",
      body: {
        employeeId,
        sessionId,
        agents,
        provider,
        tenantId,
      },
    }),
    // We keep the default onError handler; consumers can override via the returned error state
  });

  return {
    ...chat,
    /** Send a message with optional context attachments */
    sendMessage: (content: string, attachments?: File[]) => {
      // The `append` method from useChat sends a user message.
      // For now, we send text only; file attachments can be extended in the future.
      chat.setMessages([...chat.messages, { id: Date.now().toString(), role: "user", content } as any]);
    },
    /** Clear the current conversation history */
    clear: () => chat.setMessages([]),
  };
}