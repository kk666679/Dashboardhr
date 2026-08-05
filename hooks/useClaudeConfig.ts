"use client"

import { useCallback } from 'react';
import type { ClaudeHooksConfig, ClaudeHookContext } from '@/types/ai';

const defaultHooks: ClaudeHooksConfig = {
  // Default no-op implementations with correct signatures
  preToolUse: async (_toolName: string, _parameters: unknown, _ctx?: ClaudeHookContext) => true,
  postToolUse: async (_toolName: string, _result: unknown, _ctx?: ClaudeHookContext) => {},
  postToolUseFailure: async (_toolName: string, _error: Error, _ctx?: ClaudeHookContext) => {},
  permissionRequest: async (_action: string, _ctx?: ClaudeHookContext) => true,
  usePromptSubmit: async (_prompt: string, _ctx?: ClaudeHookContext) => _prompt,
  stop: async (_reason: string, _ctx?: ClaudeHookContext) => {},
  subAgentStart: async (_agentId: string, _ctx?: ClaudeHookContext) => {},
  subAgentStop: async (_agentId: string, _ctx?: ClaudeHookContext) => {},
  preCompact: async (_messages: unknown[], _ctx?: ClaudeHookContext) => _messages,
  sessionStart: async (_ctx?: ClaudeHookContext) => {},
  sessionEnd: async (_ctx?: ClaudeHookContext) => {},
  notification: async (_type: 'info' | 'warning' | 'error', _message: string, _ctx?: ClaudeHookContext) => {},
};

export function useClaudeConfig(overrides?: Partial<ClaudeHooksConfig>) {
  const config = { ...defaultHooks, ...overrides };

  return {
    config,
    ...config,
  };
}

