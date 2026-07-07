import { streamText, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { NextRequest } from 'next/server'
import { payrollAgent } from '@/server/agents/payroll'
import { leaveAgent } from '@/server/agents/leave'
import { immigrationAgent } from '@/server/agents/immigration'
import { fomemaAgent } from '@/server/agents/fomema'
import { levyAgent } from '@/server/agents/levy'
import { talentAcquisitionAgent } from '@/server/agents/talent-acquisition'
import { compensationBenefitsAgent } from '@/server/agents/compensation-benefits'
import { employeeRelationsAgent } from '@/server/agents/employee-relations'
import { learningDevelopmentAgent } from '@/server/agents/learning-development'
import { industrialRelationsAgent } from '@/server/agents/industrial-relations'
import { hrAnalyticsAgent } from '@/server/agents/hr-analytics'
import { successionPlanningAgent } from '@/server/agents/succession-planning'
import { hrComplianceAgent } from '@/server/agents/hr-compliance'
import { employerBrandingAgent } from '@/server/agents/employer-branding'
import { AGENT_PROMPTS } from '@/server/agents/prompts'
import { runHrOrchestrator } from '@/lib/orchestrator/hr-orchestrator'
import type { ClaudeHooksConfig, ClaudeHookContext } from '@/types/ai'

export const runtime = 'nodejs'

const empInput    = z.object({ employeeId: z.string().optional() })
const tenantInput = z.object({ tenantId: z.string().optional() })

function buildTools(employeeId?: string) {
  return {
    // ── HR Operations ──────────────────────────────────────────────────────────
    getPayroll: tool({
      description: `[HR Operations] ${AGENT_PROMPTS.hrOperations} — Fetch salary, payslip, and payroll records.`,
      inputSchema: empInput,
      execute: async ({ employeeId }) => payrollAgent('', employeeId ?? ''),
    }),
    getLeave: tool({
      description: `[HR Operations] ${AGENT_PROMPTS.hrOperations} — Fetch leave balances, annual leave, sick leave, and holiday entitlements.`,
      inputSchema: empInput,
      execute: async ({ employeeId }) => leaveAgent('', employeeId ?? ''),
    }),

    // ── Foreign Workers ────────────────────────────────────────────────────────
    getImmigration: tool({
      description: `[Foreign Workers] ${AGENT_PROMPTS.foreignWorkers} — Fetch work permit, visa, and PLKS status.`,
      inputSchema: empInput,
      execute: async ({ employeeId: eid }) => immigrationAgent('', eid ?? employeeId),
    }),
    getFomema: tool({
      description: `[Foreign Workers] ${AGENT_PROMPTS.foreignWorkers} — Fetch FOMEMA medical examination status and certificate validity.`,
      inputSchema: empInput,
      execute: async ({ employeeId: eid }) => fomemaAgent('', eid ?? employeeId),
    }),
    getLevy: tool({
      description: `[Foreign Workers] ${AGENT_PROMPTS.foreignWorkers} — Calculate foreign worker levy by sector and nationality.`,
      inputSchema: empInput,
      execute: async ({ employeeId: eid }) => levyAgent('', eid ?? employeeId),
    }),

    // ── Talent Acquisition ─────────────────────────────────────────────────────
    getTalentAcquisition: tool({
      description: `[Talent Acquisition] ${AGENT_PROMPTS.talentAcquisition} — Fetch open roles, hiring context, and recruitment data.`,
      inputSchema: z.object({}),
      execute: async () => talentAcquisitionAgent(''),
    }),

    // ── Compensation & Benefits ────────────────────────────────────────────────
    getCompensationBenefits: tool({
      description: `[Compensation & Benefits] ${AGENT_PROMPTS.compensationBenefits} — Fetch salary benchmarks, EPF/SOCSO/EIS rates, and benefits packages.`,
      inputSchema: empInput,
      execute: async ({ employeeId: eid }) => compensationBenefitsAgent('', eid ?? employeeId),
    }),

    // ── Employee Relations ─────────────────────────────────────────────────────
    getEmployeeRelations: tool({
      description: `[Employee Relations] ${AGENT_PROMPTS.employeeRelations} — Fetch employee data for HR letters, conflict resolution, and misconduct handling.`,
      inputSchema: empInput,
      execute: async ({ employeeId: eid }) => employeeRelationsAgent('', eid ?? employeeId),
    }),

    // ── Learning & Development ─────────────────────────────────────────────────
    getLearningDevelopment: tool({
      description: `[Learning & Development] ${AGENT_PROMPTS.learningDevelopment} — Fetch training recommendations, career paths, and HRDC claim guidance.`,
      inputSchema: empInput,
      execute: async ({ employeeId: eid }) => learningDevelopmentAgent('', eid ?? employeeId),
    }),

    // ── Industrial Relations ───────────────────────────────────────────────────
    getIndustrialRelations: tool({
      description: `[Industrial Relations] ${AGENT_PROMPTS.industrialRelations} — Fetch IR data: domestic inquiry steps, notice periods, legal references, misconduct categories.`,
      inputSchema: empInput,
      execute: async ({ employeeId: eid }) => industrialRelationsAgent('', eid ?? employeeId),
    }),

    // ── HR Analytics ───────────────────────────────────────────────────────────
    getHrAnalytics: tool({
      description: `[HR Analytics] ${AGENT_PROMPTS.hrAnalytics} — Fetch headcount, attendance rate, absenteeism, compliance metrics, and HR insights.`,
      inputSchema: tenantInput,
      execute: async ({ tenantId }) => hrAnalyticsAgent('', tenantId),
    }),

    // ── Succession Planning ────────────────────────────────────────────────────
    getSuccessionPlanning: tool({
      description: `[Succession Planning] ${AGENT_PROMPTS.successionPlanning} — Fetch talent map, 9-box grid, high-potential employees, and retention risks.`,
      inputSchema: tenantInput,
      execute: async ({ tenantId }) => successionPlanningAgent('', tenantId),
    }),

    // ── HR Compliance ──────────────────────────────────────────────────────────
    getHrCompliance: tool({
      description: `[HR Compliance] ${AGENT_PROMPTS.hrCompliance} — Fetch compliance score, expired documents, policy audit checklist, and risk summary.`,
      inputSchema: tenantInput,
      execute: async ({ tenantId }) => hrComplianceAgent('', tenantId),
    }),

    // ── Employer Branding ──────────────────────────────────────────────────────
    getEmployerBranding: tool({
      description: `[Employer Branding] ${AGENT_PROMPTS.employerBranding} — Fetch EVP pillars, campaign KPIs, content calendar, and engagement initiatives.`,
      inputSchema: tenantInput,
      execute: async ({ tenantId }) => employerBrandingAgent('', tenantId),
    }),
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { messages, employeeId } = body

  // Server-side default hooks for orchestrator (subagents/tools)
  const defaultHooks: ClaudeHooksConfig = {
    subAgentStart: async (agentId, ctx) => console.log('[Orchestrator ClaudeHook] Subagent start:', agentId, ctx),
    subAgentStop: async (agentId) => console.log('[Orchestrator ClaudeHook] Subagent stop:', agentId),
    notification: async (type, msg) => console.log(`[Orchestrator ClaudeHook ${type.toUpperCase()}] ${msg}`),
  };

  const ctx: ClaudeHookContext = { employeeId, input: messages };
  await defaultHooks.subAgentStart('hr-orchestrator', ctx);


  if (!process.env.OPENAI_API_KEY) {
    const lastMessage = messages.at(-1)?.content ?? ''
    const results = await runHrOrchestrator(lastMessage, employeeId)
    const text = results
      .map((r: any) => `**${r.type}**: ${r.data}`)
      .join('\n\n')

    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(text)}\n`))
          controller.close()
        },
      }),
      { headers: { 'Content-Type': 'text/event-stream' } }
    )
  }

  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const result = streamText({
    model: openai('gpt-4o-mini'),
    system: AGENT_PROMPTS.orchestrator,
    messages,
    tools: buildTools(employeeId), // Each tool can be wrapped with hooks
  })

  await defaultHooks.subAgentStop('hr-orchestrator', ctx);

  return result.toUIMessageStreamResponse()
}
