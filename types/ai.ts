import { Tool } from 'ai';

export interface ClaudeHookContext {
  sessionId?: string;
  employeeId?: string;
  persona?: string;
  provider?: 'claude' | 'openai' | 'ollama';
  input?: any;
}



export interface ClaudeHooksConfig {
  // Tool lifecycle
  preToolUse?: (toolName: string, parameters: any, ctx: ClaudeHookContext) => Promise<boolean | void>;
  postToolUse?: (toolName: string, result: any, ctx: ClaudeHookContext) => Promise<void>;
  postToolUseFailure?: (toolName: string, error: Error, ctx: ClaudeHookContext) => Promise<void>;

  // Permission & prompts
  permissionRequest?: (action: string, ctx: ClaudeHookContext) => Promise<boolean>;
  usePromptSubmit?: (prompt: string, ctx: ClaudeHookContext) => Promise<string | void>;

  // Session lifecycle
  sessionStart?: (ctx: ClaudeHookContext) => Promise<void>;
  sessionEnd?: (ctx: ClaudeHookContext) => Promise<void>;

  // Agent lifecycle
  subAgentStart?: (agentId: string, ctx: ClaudeHookContext) => Promise<void>;
  subAgentStop?: (agentId: string, ctx: ClaudeHookContext) => Promise<void>;

  // Other
  preCompact?: (messages: any[], ctx: ClaudeHookContext) => Promise<any[] | void>;
  stop?: (reason: string, ctx: ClaudeHookContext) => Promise<void>;
  notification?: (type: 'info' | 'warning' | 'error', message: string, ctx: ClaudeHookContext) => Promise<void>;
}

export type ClaudeHookFn = (ctx: ClaudeHookContext, ...args: any[]) => Promise<any>;

