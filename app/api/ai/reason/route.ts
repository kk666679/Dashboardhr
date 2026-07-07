import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { reasonWithOllama } from "@/server/agents/ollama";
import { reasonWithClaude } from "@/server/agents/claude";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import { AGENT_PROMPTS } from "@/server/agents/prompts";

export const runtime = "nodejs";

const ReasonSchema = z.object({
  input: z.string().min(1),
  context: z.string().default(""),
  persona: z
    .enum(Object.keys(AGENT_PROMPTS) as [string, ...string[]])
    .optional(),
  provider: z.enum(["claude", "openai", "ollama"]).optional(),
});

export async function POST(request: NextRequest) {
  let body: z.infer<typeof ReasonSchema>;
  try {
    body = ReasonSchema.parse(await request.json());
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { input, context, persona = "orchestrator", provider } = body;

  const claudeKey = process.env.ANTHROPIC_API_KEY?.trim();
  const hasClaude = Boolean(claudeKey?.startsWith("sk-ant-"));

  const openAiKey = process.env.OPENAI_API_KEY?.trim();
  const hasOpenAi = Boolean(openAiKey?.startsWith("sk-"));

  // Determine provider priority: explicit > Claude > OpenAI > Ollama
  const selectedProvider = provider || (hasClaude ? "claude" : hasOpenAi ? "openai" : "ollama");

  // Claude path
  if (selectedProvider === "claude" && hasClaude) {
    try {
      const answer = await reasonWithClaude(
        input,
        context,
        persona as keyof typeof AGENT_PROMPTS,
      );
      return NextResponse.json({ answer, provider: "claude" });
    } catch (error) {
      console.error("[/api/ai/reason] Claude error:", error);
      if (provider === "claude") {
        return NextResponse.json({ error: "Claude unavailable" }, { status: 503 });
      }
    }
  }

  // OpenAI path
  if (selectedProvider === "openai" && hasOpenAi) {
    try {
      const openai = createOpenAI({ apiKey: openAiKey });
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: AGENT_PROMPTS[persona as keyof typeof AGENT_PROMPTS],
        prompt: `User Question: ${input}\n\nContext from HR Systems:\n${context || "No additional context."}\n\nProvide a comprehensive, Malaysian-law-aware response.`,
      });
      return NextResponse.json({ answer: text, provider: "openai" });
    } catch (error) {
      console.error("[/api/ai/reason] OpenAI error:", error);
      if (provider === "openai") {
        return NextResponse.json({ error: "OpenAI unavailable" }, { status: 503 });
      }
    }
  }

  // Ollama path
  try {
    const answer = await reasonWithOllama(
      input,
      context,
      persona as keyof typeof AGENT_PROMPTS,
    );
    return NextResponse.json({ answer, provider: "ollama" });
  } catch (error) {
    console.error("[/api/ai/reason] Ollama error:", error);
    return NextResponse.json({ error: "LLM unavailable" }, { status: 503 });
  }
}
