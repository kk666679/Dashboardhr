/**
 * Regulatory Change Detector
 *
 * Compares old vs. new regulatory content, summarises the diff, and maps
 * affected workflows/policies. Feeds the 10-step change pipeline
 * (`change-pipeline.ts`).
 */
import { prisma } from "@/lib/prisma";

export interface RegulationDiff {
  /** Human-readable summary of what changed. */
  diffSummary: string;
  /** Old vs new content hash comparison. */
  changed: boolean;
  /** Key sections that changed (best-effort extraction). */
  changedSections: string[];
  /** Regulatory impact level estimate. */
  impactLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

/**
 * Simple line-based diff between old and new regulatory text.
 * Returns added/removed lines and a summary.
 */
export function diffRegulation(oldContent: string, newContent: string): RegulationDiff {
  if (oldContent.trim() === newContent.trim()) {
    return {
      diffSummary: "No change detected",
      changed: false,
      changedSections: [],
      impactLevel: "LOW",
    };
  }

  const oldLines = new Set(oldContent.split("\n").map((l) => l.trim()).filter(Boolean));
  const newLines = newContent.split("\n").map((l) => l.trim()).filter(Boolean);

  const added = newLines.filter((l) => !oldLines.has(l));
  const removed = Array.from(oldLines).filter((l) => !newLines.includes(l));

  const changedSections = [...new Set([...added, ...removed].map((l) => l.slice(0, 80)))]
    .slice(0, 20);

  const summaryParts: string[] = [];
  if (added.length > 0) summaryParts.push(`+${added.length} new lines`);
  if (removed.length > 0) summaryParts.push(`-${removed.length} removed lines`);

  const impactLevel = estimateImpact(added, removed);

  return {
    diffSummary: summaryParts.length ? `Change detected: ${summaryParts.join(", ")}` : "Content changed",
    changed: true,
    changedSections,
    impactLevel,
  };
}

/** Heuristic impact estimation based on change volume + keywords. */
function estimateImpact(added: string[], removed: string[]): RegulationDiff["impactLevel"] {
  const highSignal = [
    "must", "shall", "mandatory", "penalty", "fine", "imprisonment",
    "new rate", "increase", "decrease", "deadline", "effective date",
    "gazette", "wage", "levy", "contribution", "permit", "visa",
  ];
  const combined = [...added, ...removed].join(" ").toLowerCase();
  const hits = highSignal.filter((k) => combined.includes(k)).length;

  if (hits >= 6 || added.length > 200) return "CRITICAL";
  if (hits >= 4 || added.length > 80) return "HIGH";
  if (hits >= 2 || added.length > 20) return "MEDIUM";
  return "LOW";
}

/** Maps a regulatory change to affected business workflows/policies by keyword. */
export function mapAffectedWorkflows(
  sourceName: string,
  diff: RegulationDiff
): { affectedWorkflows: string[]; affectedPolicies: string[] } {
  const text = `${sourceName} ${diff.diffSummary} ${diff.changedSections.join(" ")}`.toLowerCase();

  const workflowRules: Array<[RegExp, string]> = [
    [/payroll|epf|socso|eis|pcb|tax|levy/i, "PAYROLL_RUN"],
    [/immigration|permit|visa|pass|quota|e.?kad/i, "PERMIT_APPLICATION"],
    [/fomema|medical|health/i, "FOMEMA_SCREENING"],
    [/accommodation|hostel|ema/i, "ACCOMMODATION_INSPECTION"],
    [/hrd|training|levy|grant/i, "TRAINING_GRANT"],
    [/esg|sustainability|bursa|reporting/i, "ESG_REPORTING"],
    [/labour|employment|wage|termination|dismissal/i, "EMPLOYMENT_TERMINATION"],
    [/foreign.?worker|quota|recruitment/i, "FOREIGN_WORKER_RECRUITMENT"],
    [/expat|employment pass|professional visit/i, "EXPATRIATE_MANAGEMENT"],
    [/pdp|personal data|privacy/i, "DATA_GOVERNANCE"],
    [/cyber|security|ncsi/i, "CYBER_SECURITY"],
  ];

  const affectedWorkflows = new Set<string>();
  for (const [re, wf] of workflowRules) {
    if (re.test(text)) affectedWorkflows.add(wf);
  }
  if (affectedWorkflows.size === 0) affectedWorkflows.add("GENERAL_COMPLIANCE");

  const affectedPolicies = new Set<string>();
  for (const wf of affectedWorkflows) {
    affectedPolicies.add(`POLICY_${wf}`);
  }

  return {
    affectedWorkflows: Array.from(affectedWorkflows),
    affectedPolicies: Array.from(affectedPolicies),
  };
}

/** Persists a detected regulatory change into the `regulatory_changes` table. */
export async function persistRegulatoryChange(params: {
  tenantId: string;
  sourceId?: string;
  title: string;
  description?: string;
  referenceNo?: string;
  oldContent?: string;
  newContent?: string;
  diffSummary?: string;
  sourceUrl?: string;
  impactLevel?: RegulationDiff["impactLevel"];
}): Promise<string> {
  const record = await prisma.regulatory_changes.create({
    data: {
      tenantId: params.tenantId,
      sourceId: params.sourceId ?? null,
      title: params.title,
      description: params.description ?? null,
      referenceNo: params.referenceNo ?? null,
      oldContent: params.oldContent ?? null,
      newContent: params.newContent ?? null,
      diffSummary: params.diffSummary ?? null,
      sourceUrl: params.sourceUrl ?? null,
      impactLevel: (params.impactLevel ?? "MEDIUM") as any,
      status: "DETECTED",
      affectedWorkflows: [],
      affectedPolicies: [],
    },
  });
  return record.id;
}

