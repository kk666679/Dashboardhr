/**
 * POST /api/ai/rag
 *
 * Body: { query: string; tenantId?: string; persona?: AgentPersona }
 * Returns: { answer: string; chunks: RagChunk[]; provider: 'ollama' }
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { AGENT_PROMPTS, type AgentPersona } from "@/server/agents/prompts";
import { ragQuery } from "@/lib/rag";

export const runtime = "nodejs";

const BodySchema = z.object({
  query: z.string().min(1).max(8_000),
  tenantId: z.string().optional(),
  persona: z
    .enum(Object.keys(AGENT_PROMPTS) as [AgentPersona, ...AgentPersona[]])
    .optional()
    .default("orchestrator"),
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  try {
    const result = await ragQuery(body.query, {
      tenantId: body.tenantId,
      persona: body.persona,
    });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/ai/rag]", err);
    return NextResponse.json({ error: "RAG pipeline failed" }, { status: 503 });
  }
}
