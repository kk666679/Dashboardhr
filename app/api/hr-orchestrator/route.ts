/**
 * POST /api/hr-orchestrator
 *
 * Unified multi-agent HR orchestration endpoint.
 * Routes queries to the correct OpenClaw agent via AGENT_REGISTRY,
 * with RAG context retrieval and streaming output.
 *
 * Auth: required (getCurrentSession)
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentSession } from "@/lib/server/auth";
import { ragQuery } from "@/lib/rag";
import { sanitizePrompt } from "@/lib/security/prompt";

export const runtime = "nodejs";

const BodySchema = z.object({
  message:    z.string().min(1).max(8_000),
  employeeId: z.string().optional(),
  tenantId:   z.string().optional(),
  sessionId:  z.string().optional().default("default"),
  agentId:    z.string().optional(), // force-route to a specific agent
});

export async function POST(req: NextRequest) {
  // Auth guard
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { message, employeeId, sessionId } = body;
  const tenantId = body.tenantId ?? session.tenantId;
  const sanitizedMessage = sanitizePrompt(message);

  // Lazy-import the agent registry to avoid build-time side effects
  const { AGENT_REGISTRY, orchestratorAgent } = await import(
    "@/.openclaw/agents/orchestrator.agent"
  );

  const agentContext = {
    sessionId,
    tenantId,
    userId: session.userId,
  };

  const agentInput = {
    query:      sanitizedMessage,
    employeeId: employeeId ?? session.employeeId,
    tenantId,
  };

  // If caller requests a specific agent, dispatch directly
  const targetAgent = body.agentId
    ? AGENT_REGISTRY.get(body.agentId)
    : orchestratorAgent;

  if (!targetAgent) {
    return NextResponse.json(
      { error: `Agent '${body.agentId}' not found in registry` },
      { status: 404 }
    );
  }

  try {
    const result = await targetAgent.process(agentInput, agentContext);

    return NextResponse.json({
      agent:   targetAgent.id,
      type:    result.type,
      summary: result.summary,
      data:    result.data,
      actions: result.actions,
      confidence:          result.confidence,
      requiresApproval:    result.requiresHumanApproval,
      complianceScore:     result.complianceScore ?? null,
      citations:           result.citations ?? [],
    });
  } catch (err) {
    console.error("[hr-orchestrator]", err);
    // Fallback: plain RAG answer
    try {
      const rag = await ragQuery(message, { tenantId });
      return NextResponse.json({
        agent:    "rag-fallback",
        type:     "RAG",
        summary:  rag.answer,
        data:     { chunks: rag.chunks.length },
        actions:  [],
        confidence: 0.5,
        requiresApproval: false,
        citations: rag.chunks.map((c) => c.source),
      });
    } catch {
      return NextResponse.json({ error: "Orchestration failed" }, { status: 500 });
    }
  }
}

/**
 * GET /api/hr-orchestrator
 * Returns the list of available agents and their domains.
 */
export async function GET(_req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { AGENT_REGISTRY } = await import("@/.openclaw/agents/orchestrator.agent");

  const agents = Array.from(AGENT_REGISTRY.values()).map((a) => ({
    id:     a.id,
    name:   a.name,
    domain: a.domain,
  }));

  return NextResponse.json({ agents, total: agents.length });
}
