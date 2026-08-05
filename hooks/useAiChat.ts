"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { AgentPersona } from "@/server/agents/prompts";
import { useClaudeConfig } from "./useClaudeConfig";

interface ClaudeHookContext {
  sessionId: string;
  employeeId?: string;
  persona?: AgentPersona;
  provider?: "claude" | "openai" | "ollama";
}

interface UseAiChatOptions {
  persona?: AgentPersona;
  employeeId?: string;
  provider?: "claude" | "openai" | "ollama";
  onError?: (error: Error) => void;
}

export function useAiChat({
  persona = "orchestrator",
  employeeId,
  provider,
  onError,
}: UseAiChatOptions = {}) {
  const sessionId = useId();
  const claudeConfig = useClaudeConfig();
  const [isClearing, setIsClearing] = useState(false);
  const claudeConfigRef = useRef(claudeConfig);

  // Update ref when config changes
  useEffect(() => {
    claudeConfigRef.current = claudeConfig;
  }, [claudeConfig]);

  // Session lifecycle hooks
  useEffect(() => {
    const ctx: ClaudeHookContext = {
      sessionId,
      employeeId,
      persona,
      provider,
    };

    (claudeConfigRef.current as any).sessionStart?.(ctx);
    return () => {
      (claudeConfigRef.current as any).sessionEnd?.(ctx);
    };
  }, [sessionId, employeeId, persona, provider]);

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/chat",
      body: {
        sessionId,
        persona,
        employeeId,
        provider,
        claudeHooks: {
          configKeys: Object.keys((claudeConfigRef.current as any).config ?? {}),
        }
      },
    }),
    onError: (error) => {
      console.error("Chat error:", error);
      onError?.(error);
    },
  });

  const clearHistory = useCallback(async () => {
    if (isClearing) return;

    setIsClearing(true);
    try {
      chat.setMessages([]);
      const response = await fetch(
        `/api/ai/chat/history?sessionId=${encodeURIComponent(sessionId)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Failed to clear history: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error clearing history:", error);
      onError?.(error instanceof Error ? error : new Error("Unknown error"));
    } finally {
      setIsClearing(false);
    }
  }, [sessionId, chat, isClearing, onError]);

  return useMemo(() => ({
    ...chat,
    sessionId,
    clearHistory,
    isClearing,
    claudeConfig: claudeConfigRef.current,
  }), [chat, sessionId, clearHistory, isClearing]);
}

