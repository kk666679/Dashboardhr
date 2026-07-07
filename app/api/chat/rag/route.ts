/**
 * app/api/chat/rag/route.ts
 * Streaming RAG chat endpoint (Next.js 15+ optimized)
 */

import { NextRequest } from 'next/server';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

import { ragQuery } from '@/lib/rag';
import { AGENT_PROMPTS } from '@/server/agents/prompts';
import type { AgentPersona } from '@/server/agents/prompts';
import { getChatSession, setChatSession } from '@/lib/chat-sessions';

export const runtime = 'nodejs';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

function buildSystemPrompt(persona: AgentPersona, context: string) {
  return `${AGENT_PROMPTS[persona]}

CONTEXT FROM KB + HR DB:
${context}`;
}

function selectProvider() {
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'ollama';
}

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId = 'kb-rag', persona = 'orchestrator' as AgentPersona } =
      await req.json();

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 });
    }

    const history = getChatSession(sessionId) as ChatMessage[];

    const messages: ChatMessage[] = [
      ...history,
      { role: 'user', content: message },
    ];

    // RAG lookup
    const ragResult = await ragQuery(message, { persona });

    const context = ragResult.context ?? 'No context found.';
    const system = buildSystemPrompt(persona, context);

    const provider = selectProvider();

    const saveSession = (assistantText: string) => {
      setChatSession(sessionId, [
        ...messages,
        { role: 'assistant', content: assistantText },
      ]);
    };

    if (provider === 'anthropic') {
      const client = createAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY!,
      });

      const result = streamText({
        model: client('claude-3-5-sonnet-20241022'),
        system,
        messages,
        onFinish: ({ text }) => saveSession(text),
      });

      return result.toUIMessageStreamResponse();
    }

    if (provider === 'openai') {
      const client = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
      });

      const result = streamText({
        model: client('gpt-4o-mini'),
        system,
        messages,
        onFinish: ({ text }) => saveSession(text),
      });

      return result.toUIMessageStreamResponse();
    }

    // Ollama fallback (non-streaming)
    const answer = ragResult.answer ?? 'No response available.';

    saveSession(answer);

    return Response.json({
      answer,
      chunks: ragResult.chunks,
    });
  } catch (err) {
    console.error('[RAG API ERROR]', err);

    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}