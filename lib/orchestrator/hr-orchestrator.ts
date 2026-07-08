/**
 * lib/orchestrator/hr-orchestrator.ts
 *
 * Intent detection upgraded from keyword string-matching to
 * embedding-based semantic similarity via @xenova/transformers.
 *
 * Each intent has a set of representative phrases. The user query
 * is embedded and compared against all intent embeddings; the
 * top-scoring intents above a threshold are dispatched.
 */

import { embed, cosineSimilarity } from "@/lib/embeddings";
import { payrollAgent } from "@/server/agents/payroll";
import { leaveAgent } from "@/server/agents/leave";
import { immigrationAgent } from "@/server/agents/immigration";
import { fomemaAgent } from "@/server/agents/fomema";
import { levyAgent } from "@/server/agents/levy";
import { talentAcquisitionAgent } from "@/server/agents/talent-acquisition";
import { compensationBenefitsAgent } from "@/server/agents/compensation-benefits";
import { employeeRelationsAgent } from "@/server/agents/employee-relations";
import { learningDevelopmentAgent } from "@/server/agents/learning-development";
import { industrialRelationsAgent } from "@/server/agents/industrial-relations";
import { hrAnalyticsAgent } from "@/server/agents/hr-analytics";
import { successionPlanningAgent } from "@/server/agents/succession-planning";
import { hrComplianceAgent } from "@/server/agents/hr-compliance";
import { hrQualityManagementAgent } from "@/server/agents/hr-quality-management";
import { employerBrandingAgent } from "@/server/agents/employer-branding";
import { foreignWorkerExpatriateAgent } from "@/server/agents/foreign-worker-expatriate";

// ── Intent definitions ─────────────────────────────────────────────────────────
// Each intent has representative phrases that capture its semantic space.
// These are embedded once and cached for the process lifetime.

type AgentKey =
  | "PAYROLL"
  | "LEAVE"
  | "IMMIGRATION"
  | "FOMEMA"
  | "LEVY"
  | "TALENT_ACQUISITION"
  | "COMPENSATION_BENEFITS"
  | "EMPLOYEE_RELATIONS"
  | "LEARNING_DEVELOPMENT"
  | "INDUSTRIAL_RELATIONS"
  | "HR_ANALYTICS"
  | "SUCCESSION_PLANNING"
  | "HR_COMPLIANCE"
  | "HR_QUALITY_MANAGEMENT"
  | "EMPLOYER_BRANDING"
  | "FOREIGN_WORKER_EXPATRIATE";

const INTENT_PHRASES: Record<AgentKey, string> = {
  PAYROLL:
    "salary payroll payslip wages EPF SOCSO PCB income deductions net pay",
  LEAVE: "annual leave sick leave vacation days off holiday leave balance cuti",
  IMMIGRATION:
    "work permit visa PLKS EPLKS passport expiry renewal immigration status",
  FOMEMA:
    "FOMEMA medical examination health certificate clinic fitness checkup",
  LEVY: "foreign worker levy levi quota payment annual levy rate",
  TALENT_ACQUISITION:
    "hiring recruitment job description vacancy interview candidate shortlist",
  COMPENSATION_BENEFITS:
    "compensation benefits salary benchmark bonus increment allowance package",
  EMPLOYEE_RELATIONS:
    "warning letter show cause misconduct termination discipline grievance conflict",
  LEARNING_DEVELOPMENT:
    "training development skill gap career HRDC course upskill learning plan",
  INDUSTRIAL_RELATIONS:
    "domestic inquiry union dismissal labour court industrial relations misconduct",
  HR_ANALYTICS:
    "analytics report headcount turnover absenteeism attendance metrics dashboard",
  SUCCESSION_PLANNING:
    "succession talent high potential leadership pipeline 9-box retention promotion",
  HR_COMPLIANCE:
    "compliance audit policy PDPA OSHA expired document legal risk violation",
  HR_QUALITY_MANAGEMENT:
    "quality management SOP audit CAPA root cause continuous improvement service quality data completeness",
  EMPLOYER_BRANDING:
    "employer brand EVP job ad campaign culture engagement glassdoor jobstreet",
  FOREIGN_WORKER_EXPATRIATE:
    "foreign worker expatriate employment pass EP PLKS FWCMS MYEG EPLKS FOMEMA levy repatriation dependent pass visa permit quota",
};

const INTENT_KEYWORDS: Record<AgentKey, string[]> = {
  PAYROLL: ["payroll", "salary", "payslip", "epf", "socso", "pcb", "deduction"],
  LEAVE: [
    "leave",
    "annual leave",
    "sick leave",
    "vacation",
    "cuti",
    "time off",
  ],
  IMMIGRATION: [
    "immigration",
    "visa",
    "work permit",
    "permit renewal",
    "plks",
    "eplks",
    "passport",
  ],
  FOMEMA: [
    "fomema",
    "medical exam",
    "medical examination",
    "fit status",
    "clinic",
  ],
  LEVY: ["levy", "quota payment"],
  TALENT_ACQUISITION: [
    "recruitment",
    "hiring",
    "vacancy",
    "candidate",
    "interview",
    "job description",
  ],
  COMPENSATION_BENEFITS: [
    "compensation",
    "benefits",
    "bonus",
    "increment",
    "allowance",
    "benchmark",
  ],
  EMPLOYEE_RELATIONS: [
    "employee relations",
    "grievance",
    "misconduct",
    "show cause",
    "warning letter",
    "termination",
    "conflict",
  ],
  LEARNING_DEVELOPMENT: [
    "training",
    "learning",
    "development",
    "upskill",
    "course",
    "hrdc",
    "career path",
  ],
  INDUSTRIAL_RELATIONS: [
    "industrial relations",
    "domestic inquiry",
    "union",
    "labour court",
    "dismissal",
    "retrenchment",
  ],
  HR_ANALYTICS: [
    "analytics",
    "headcount",
    "turnover",
    "absenteeism",
    "attendance report",
    "dashboard",
  ],
  SUCCESSION_PLANNING: [
    "succession",
    "9-box",
    "high potential",
    "leadership pipeline",
    "retention plan",
  ],
  HR_COMPLIANCE: [
    "compliance",
    "policy",
    "audit",
    "pdpa",
    "osha",
    "legal risk",
  ],
  HR_QUALITY_MANAGEMENT: [
    "quality",
    "quality management",
    "sop",
    "capa",
    "root cause",
    "continuous improvement",
    "service quality",
  ],
  EMPLOYER_BRANDING: [
    "employer brand",
    "evp",
    "job ad",
    "glassdoor",
    "jobstreet",
    "culture campaign",
  ],
  FOREIGN_WORKER_EXPATRIATE: [
    "foreign worker",
    "expatriate",
    "employment pass",
    "dependent pass",
    "fwcms",
    "myeg",
    "repatriation",
  ],
};

// Cache: intent key → embedding vector
const _intentCache = new Map<AgentKey, number[]>();

async function getIntentEmbeddings(): Promise<Map<AgentKey, number[]>> {
  if (_intentCache.size === Object.keys(INTENT_PHRASES).length)
    return _intentCache;

  await Promise.all(
    (Object.entries(INTENT_PHRASES) as [AgentKey, string][]).map(
      async ([key, phrase]) => {
        _intentCache.set(key, await embed(phrase));
      },
    ),
  );
  return _intentCache;
}

/**
 * Detect which intents are semantically relevant to the user input.
 * Returns intents with cosine similarity above the threshold, sorted desc.
 */
async function detectIntents(
  input: string,
  threshold = 0.3,
  maxIntents = 5,
): Promise<AgentKey[]> {
  const normalizedInput = input.toLowerCase();

  const keywordMatches = (
    Object.entries(INTENT_KEYWORDS) as [AgentKey, string[]][]
  )
    .filter(([, keywords]) =>
      keywords.some((keyword) => normalizedInput.includes(keyword)),
    )
    .map(([key]) => key);

  const matchedIntents = new Set<AgentKey>(keywordMatches);

  const [queryVec, intentEmbeddings] = await Promise.all([
    embed(input),
    getIntentEmbeddings(),
  ]);

  const scored = (
    await Promise.all(
      Array.from(intentEmbeddings.entries()).map(async ([key, vec]) => ({
        key,
        score: await cosineSimilarity(queryVec, vec),
      })),
    ) as Array<{ key: AgentKey; score: number }>
  )
    .filter(
      (entry) => entry.score >= threshold && !matchedIntents.has(entry.key),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(0, maxIntents - matchedIntents.size));

  for (const { key } of scored) {
    matchedIntents.add(key);
  }

  return Array.from(matchedIntents).slice(0, maxIntents);
}

// ── Dispatcher ─────────────────────────────────────────────────────────────────

function dispatch(intent: AgentKey, input: string, employeeId?: string) {
  switch (intent) {
    case "PAYROLL":
      return payrollAgent(input, employeeId);
    case "LEAVE":
      return leaveAgent(input, employeeId);
    case "IMMIGRATION":
      return immigrationAgent(input, employeeId);
    case "FOMEMA":
      return fomemaAgent(input, employeeId);
    case "LEVY":
      return levyAgent(input, employeeId);
    case "TALENT_ACQUISITION":
      return talentAcquisitionAgent(input);
    case "COMPENSATION_BENEFITS":
      return compensationBenefitsAgent(input, employeeId);
    case "EMPLOYEE_RELATIONS":
      return employeeRelationsAgent(input, employeeId);
    case "LEARNING_DEVELOPMENT":
      return learningDevelopmentAgent(input, employeeId);
    case "INDUSTRIAL_RELATIONS":
      return industrialRelationsAgent(input, employeeId);
    case "HR_ANALYTICS":
      return hrAnalyticsAgent(input);
    case "SUCCESSION_PLANNING":
      return successionPlanningAgent(input);
    case "HR_COMPLIANCE":
      return hrComplianceAgent(input);
    case "HR_QUALITY_MANAGEMENT":
      return hrQualityManagementAgent(input);
    case "EMPLOYER_BRANDING":
      return employerBrandingAgent(input);
    case "FOREIGN_WORKER_EXPATRIATE":
      return foreignWorkerExpatriateAgent(input, employeeId);
  }
}

export async function runHrOrchestrator(input: string, employeeId?: string) {
  const intents = await detectIntents(input);

  if (!intents.length) {
    return [
      {
        type: "SYSTEM",
        data: "I could not find a relevant HR domain for your query. Try asking about: payroll, leave, permits, FOMEMA, levy, hiring, compensation, HR letters, training, IR, analytics, succession, compliance, quality management, or employer branding.",
      },
    ];
  }

  const results = await Promise.all(
    intents.map((intent) => dispatch(intent, input, employeeId)),
  );
  return results.filter(Boolean);
}
