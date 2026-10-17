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
import { runHrOrchestrator } from "@/lib/orchestrator/hr-orchestrator";
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

  if (body.agentId) {
    return NextResponse.json(
      { error: "Direct agent routing is not supported by the current orchestrator" },
      { status: 400 },
    );
  }

  try {
    const results = await runHrOrchestrator(
      sanitizedMessage,
      tenantId,
      employeeId ?? session.employeeId,
    );
    const result = results[0] as Record<string, unknown> | undefined;

    return NextResponse.json({
      agent: "hr-orchestrator",
      type: result?.type ?? "SYSTEM",
      summary: result?.summary ?? result?.data ?? "No result returned",
      data: result?.data ?? null,
      actions: result?.actions ?? [],
      confidence: result?.confidence ?? 0.5,
      requiresApproval: result?.requiresHumanApproval ?? false,
      complianceScore: result?.complianceScore ?? null,
      citations: result?.citations ?? [],
      sessionId,
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

  const agents = [
    { id: "PAYROLL", name: "Payroll", domain: "Payroll and statutory deductions" },
    { id: "LEAVE", name: "Leave", domain: "Leave and time off" },
    { id: "IMMIGRATION", name: "Immigration", domain: "Permits and immigration" },
    { id: "FOMEMA", name: "FOMEMA", domain: "Medical examinations" },
    { id: "LEVY", name: "Levy", domain: "Foreign worker levy" },
    { id: "TALENT_ACQUISITION", name: "Talent Acquisition", domain: "Recruitment and hiring" },
    { id: "COMPENSATION_BENEFITS", name: "Compensation and Benefits", domain: "Pay and benefits" },
    { id: "EMPLOYEE_RELATIONS", name: "Employee Relations", domain: "Employee relations" },
    { id: "LEARNING_DEVELOPMENT", name: "Learning and Development", domain: "Training and development" },
    { id: "INDUSTRIAL_RELATIONS", name: "Industrial Relations", domain: "Industrial relations" },
    { id: "HR_ANALYTICS", name: "HR Analytics", domain: "People analytics" },
    { id: "SUCCESSION_PLANNING", name: "Succession Planning", domain: "Succession planning" },
    { id: "HR_COMPLIANCE", name: "HR Compliance", domain: "Compliance and policy" },
    { id: "HR_QUALITY_MANAGEMENT", name: "HR Quality Management", domain: "Quality management" },
    { id: "EMPLOYER_BRANDING", name: "Employer Branding", domain: "Employer brand" },
    { id: "FOREIGN_WORKER_EXPATRIATE", name: "Foreign Worker and Expatriate", domain: "Foreign worker management" },
  ];

  return NextResponse.json({ agents, total: agents.length });
}
