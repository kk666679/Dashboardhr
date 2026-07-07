/**
 * POST /api/ai/chat
 *
 * Streaming chat for AIChatbot.
 * Body: { message: string; sessionId?: string; employeeId?: string; persona?: AgentPersona; provider?: 'claude'|'openai'|'ollama' }
 * Supports Claude, OpenAI, and Ollama with fallbacks.
 */

import { NextRequest } from "next/server";
import { streamText, stepCountIs } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { z } from "zod";
import { AGENT_PROMPTS, type AgentPersona } from "@/server/agents/prompts";
import { getChatSession, setChatSession } from "@/lib/chat-sessions";
import { reasonWithOllama } from "@/server/agents/ollama";
import { ragQuery } from "@/lib/rag";
import type { ClaudeHooksConfig, ClaudeHookContext } from "@/types/ai";

export const runtime = "nodejs";

const BodySchema = z.object({
  message: z.string().min(1).max(8_000),
  sessionId: z.string().optional().default("default"),
  employeeId: z.string().optional(),
  persona: z
    .enum(Object.keys(AGENT_PROMPTS) as [AgentPersona, ...AgentPersona[]])
    .optional()
    .default("orchestrator"),
  provider: z.enum(["claude", "openai", "ollama"]).optional(),
  claudeHooks: z.record(z.string(), z.string()).optional(),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }

  const { message, sessionId, persona, provider, claudeHooks } = body;

  const history = getChatSession(sessionId);
  const messages = [...history, { role: "user" as const, content: message }];

  const claudeKey = process.env.ANTHROPIC_API_KEY?.trim();
  const hasClaude = Boolean(claudeKey?.startsWith("sk-ant-"));

  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const hasOpenAi = Boolean(openAiKey?.startsWith("sk-"));

  // Server-side default hooks
  const defaultHooks: ClaudeHooksConfig = {
    sessionStart: async (ctx) => console.log('[Server ClaudeHook] Session start:', ctx),
    notification: async (type, msg, ctx) => console.log(`[Server ClaudeHook ${type.toUpperCase()}] ${msg}`, ctx),
    preCompact: async (msgs) => {
      if (msgs.length > 10) console.log('[Server ClaudeHook] Compacting messages from', msgs.length);
      return msgs;
    },
  };

  const ctx: ClaudeHookContext = { sessionId, employeeId: body.employeeId, persona, provider };

  await defaultHooks.sessionStart(ctx);

  // Determine provider priority: explicit > Claude > OpenAI > Ollama
  const selectedProvider = provider || (hasClaude ? "claude" : hasOpenAi ? "openai" : "ollama");

  // Claude path — streaming
  if (selectedProvider === "claude" && hasClaude) {
    try {
      const compactMessages = await defaultHooks.preCompact(messages, ctx) || messages;

      const claude = createAnthropic({ apiKey: claudeKey });
      const result = streamText({
        model: claude("claude-3-5-sonnet-20241022"),
        system: AGENT_PROMPTS[persona],
        messages: compactMessages,
        onFinish: async ({ text }) => {
          setChatSession(sessionId, [
            ...history,
            { role: "user" as const, content: message },
            { role: "assistant" as const, content: text },
          ]);
          await defaultHooks.sessionEnd?.(ctx);
        },
      });
      return result.toUIMessageStreamResponse();
    } catch (err) {
      console.error("[/api/ai/chat] Claude error:", err);
      await defaultHooks.notification('error', `Claude error: ${err}`, ctx);
      if (provider === "claude") {
        return new Response(JSON.stringify({ error: "Claude unavailable" }), {
          status: 503,
        });
      }
    }
  }

  // OpenAI path — streaming
  if (selectedProvider === "openai" && hasOpenAi) {
    try {
      const openai = createOpenAI({ apiKey: openAiKey });
      const result = streamText({
        model: openai("gpt-4o-mini"),
        system: AGENT_PROMPTS[persona],
        messages,
        stopWhen: stepCountIs(3),
        onFinish: ({ text }) => {
          setChatSession(sessionId, [
            ...history,
            { role: "user" as const, content: message },
            { role: "assistant" as const, content: text },
          ]);
        },
      });
      return result.toUIMessageStreamResponse();
    } catch (err) {
      console.error("[/api/ai/chat] OpenAI error:", err);
      if (provider === "openai") {
        return new Response(JSON.stringify({ error: "OpenAI unavailable" }), {
          status: 503,
        });
      }
    }
  }

  // Ollama + RAG fallback — non-streaming
  try {
    const { answer } = await ragQuery(message, { persona });
    setChatSession(sessionId, [
      ...history,
      { role: "user" as const, content: message },
      { role: "assistant" as const, content: answer },
    ]);
    return new Response(JSON.stringify({ answer }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[/api/ai/chat] Ollama+RAG error:", err);
    return new Response(JSON.stringify({ error: "LLM unavailable" }), {
      status: 503,
    });
  }
}
