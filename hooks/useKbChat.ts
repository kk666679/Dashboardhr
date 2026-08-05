"use client";

import { useState, useCallback, useMemo } from "react";
import { useHrOrchestrator, type OrchestratorOptions } from "./useHrOrchestrator";
import type { UIMessage } from "ai";

// ─── Types ─────────────────────────────────────────────────────────────

export interface KbSource {
  id: string;
  title: string;
  url?: string;
  content?: string;
  score?: number;
}

export interface KbAction {
  description: string;
  status: "completed" | "pending" | "failed";
  details?: string;
}

export interface KbPendingTask {
  description: string;
  requiredAction?: string;
}

export interface KbSuggestion {
  label: string;
  action?: string;
}

export interface KbResponse {
  /** The main natural language answer */
  answer: string;
  /** Supporting evidence or sources */
  sources?: KbSource[];
  /** Business actions that were performed (if any) */
  actions?: KbAction[];
  /** Steps still pending (e.g., approvals) */
  pendingTasks?: KbPendingTask[];
  /** Suggested follow‑up questions or actions */
  suggestions?: KbSuggestion[];
  /** Confidence score from the orchestrator (0–1) */
  confidence?: number;
}

export interface KbMessage extends UIMessage {
  /** Extracted structured response (if the assistant message contains it) */
  structured?: KbResponse;
}

export interface UseKbChatOptions extends OrchestratorOptions {
  /** Automatically load a suggested prompt after a response */
  autoSuggest?: boolean;
}

/**
 * Helper: extract plain text content from a UIMessage by reading its parts.
 */
function getMessageContent(msg: UIMessage): string {
  const parts = msg.parts as Array<{ type: string; text?: string }> | undefined;
  if (!Array.isArray(parts)) return "";
  return parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .filter(Boolean)
    .join("");
}

// ─── Hook ──────────────────────────────────────────────────────────────

/**
 * Unified Knowledge Base Chat hook.
 *
 * This is the primary conversational entry point for all enterprise modules.
 * It orchestrates multi‑agent collaboration, RAG retrieval, and business actions,
 * returning a single, structured natural language response.
 *
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, sources } = useKbChat({ employeeId: 'emp-123' });
 * ```
 */
export function useKbChat(options: UseKbChatOptions = {}) {
  const { autoSuggest = true, ...orchestratorOptions } = options;

  const hrOrchestrator = useHrOrchestrator(orchestratorOptions);
  const { messages: rawMessages, error, clear, setMessages } = hrOrchestrator;
  // `sendMessage` is provided by useHrOrchestrator (wraps append)
  const rawSend = hrOrchestrator.sendMessage;
  const isLoading = hrOrchestrator.status === "submitted" || hrOrchestrator.status === "streaming";

  const [structuredResponses, setStructuredResponses] = useState<
    Record<string, KbResponse>
  >({});

  // ─── Parse assistant messages into structured responses ──────────────

  const parseStructuredResponse = useCallback(
    (content: string): KbResponse | null => {
      // The orchestrator is expected to return JSON with the unified format.
      // We look for a JSON block in the response.
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return null;
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate minimal structure
        if (typeof parsed.answer === "string") {
          return parsed as KbResponse;
        }
        return null;
      } catch {
        return null;
      }
    },
    [],
  );

  // Process messages to add structured data
  const messages: KbMessage[] = useMemo(() => {
    return rawMessages.map((msg) => {
      if (msg.role === "assistant") {
        const textContent = getMessageContent(msg);
        const structured = structuredResponses[msg.id] ?? parseStructuredResponse(textContent);
        if (structured) {
          // Store for future reference
          if (!structuredResponses[msg.id]) {
            setStructuredResponses((prev) => ({ ...prev, [msg.id]: structured }));
          }
          return { ...msg, structured };
        }
      }
      return msg as KbMessage;
    });
  }, [rawMessages, structuredResponses, parseStructuredResponse]);

  // ─── Send message with automatic suggestion generation ──────────────

  const sendMessage = useCallback(
    async (content: string, attachments?: File[]) => {
      // In the future, we could send attachments with the request.
      await rawSend(content);
    },
    [rawSend],
  );

  // ─── Extract the latest suggestions ──────────────────────────────────

  const latestSuggestions = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === "assistant" && msg.structured?.suggestions) {
        return msg.structured.suggestions;
      }
    }
    return [];
  }, [messages]);

  // ─── Aggregate sources from all messages ────────────────────────────

  const allSources = useMemo(() => {
    const sources: KbSource[] = [];
    const seen = new Set<string>();
    for (const msg of messages) {
      if (msg.role === "assistant" && msg.structured?.sources) {
        for (const src of msg.structured.sources) {
          if (!seen.has(src.id)) {
            seen.add(src.id);
            sources.push(src);
          }
        }
      }
    }
    return sources;
  }, [messages]);

  // ─── Return enhanced interface ───────────────────────────────────────

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    clear,
    setMessages,
    // Convenience getters
    latestSuggestions,
    sources: allSources,
    /** Get the structured response of the latest assistant message, if any */
    latestResponse: useMemo(() => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg.role === "assistant" && msg.structured) {
          return msg.structured;
        }
      }
      return null;
    }, [messages]),
  };
}

