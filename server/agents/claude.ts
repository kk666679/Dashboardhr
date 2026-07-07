import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import type { ClaudeHooksConfig, ClaudeHookContext } from '@/types/ai';
import { z } from 'zod';
import { levyCalculator } from './tools/levyCalculator';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-20241022";

export function createClaudeClient(model = CLAUDE_MODEL) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY environment variable is required");
  }

  return createAnthropic({ apiKey: ANTHROPIC_API_KEY });
}

async function safeToolCall(
  toolName: string,
  parameters: any,
  hooks?: ClaudeHooksConfig
): Promise<any> {
  const ctx: ClaudeHookContext = { input: parameters };
  const allow = await hooks?.preToolUse?.(toolName, parameters, ctx) !== false;
  if (!allow) throw new Error(`Tool ${toolName} blocked by preToolUse hook`);

  try {
    let result: any;
    if (toolName === 'levyCalculator') {
      const { sector, workerCount } = parameters;
      result = { monthlyLevy: await levyCalculator(sector, workerCount) };
    } else {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    await hooks?.postToolUse?.(toolName, result, ctx);
    return result;
  } catch (error) {
    await hooks?.postToolUseFailure?.(toolName, error as Error, ctx);
    throw error;
  }
}

export async function reasonWithClaude(
  input: string,
  context: string = "",
  persona: string = "orchestrator",
  hooks?: ClaudeHooksConfig
): Promise<string> {
  const claude = createClaudeClient();

  const ctx: ClaudeHookContext = { input, persona };
  const submittedPrompt = await hooks?.usePromptSubmit?.(input, ctx) || input;
  const systemPrompt = `You are a Malaysian HR expert agent (${persona}). Use tools for calculations. Context: ${context}`;

  const { text } = await generateText({
    model: claude(CLAUDE_MODEL),
    system: systemPrompt,
    prompt: submittedPrompt,
    temperature: 0.7,
    tools: {
      levyCalculator: {
        description: "Calculate foreign worker levy",
        parameters: z.object({
          sector: z.enum(['construction', 'plantation', 'services']),
          workerCount: z.number(),
        }),
        execute: async (args: { sector: 'construction' | 'plantation' | 'services'; workerCount: number }) =>
          safeToolCall('levyCalculator', args, hooks),
      } as any,
    },
  });

  return text;
}


export async function ragWithClaude(
  input: string,
  context: string = "",
  persona: string = "orchestrator",
  hooks?: ClaudeHooksConfig
): Promise<string> {
  return reasonWithClaude(input, context, persona, hooks);
}
