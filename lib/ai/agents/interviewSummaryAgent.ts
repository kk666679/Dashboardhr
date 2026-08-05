/**
 * Interview Summary Agent — Sprint 11, Task 11.3
 *
 * Aggregates multiple interviewer evaluations into a coherent summary:
 * - Strengths, concerns, cultural fit
 * - Overall recommendation (HIRE / CONSIDER / REJECT)
 * Uses provider fallback chain (OpenAI → Anthropic → Ollama).
 *
 * Requirements: 23.2
 */

import { generateText } from "ai";
import { sanitizePrompt } from "@/lib/security/prompt";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export interface InterviewEvaluation {
  interviewerId: string;
  interviewerRole: string;
  candidateName: string;
  scores: Record<string, number>; // e.g. { technical: 4, communication: 3, cultural_fit: 5 }
  notes: string;
  recommendation: "HIRE" | "CONSIDER" | "REJECT";
}

export interface InterviewSummary {
  candidateName: string;
  overallRecommendation: "HIRE" | "CONSIDER" | "REJECT";
  consensusScore: number;           // 0–100
  strengths: string[];
  concerns: string[];
  culturalFitNotes: string;
  summary: string;
  evaluatorCount: number;
  hireVotes: number;
  considerVotes: number;
  rejectVotes: number;
}

const SUMMARY_PROMPT = (evals: InterviewEvaluation[]) => `
You are an expert HR recruiter aggregating ${evals.length} interviewer evaluations for candidate "${evals[0]?.candidateName ?? "Unknown"}".

EVALUATIONS:
${evals.map((e, i) => `
Interviewer ${i + 1} (${e.interviewerRole}):
- Recommendation: ${e.recommendation}
- Scores: ${JSON.stringify(e.scores)}
- Notes: ${e.notes}
`).join("\n")}

Provide a JSON summary with this exact structure:
{
  "overallRecommendation": "HIRE" | "CONSIDER" | "REJECT",
  "consensusScore": 0-100,
  "strengths": ["strength1", "strength2", "strength3"],
  "concerns": ["concern1", "concern2"],
  "culturalFitNotes": "1-2 sentence assessment",
  "summary": "2-3 sentence executive summary"
}

Base the recommendation on majority vote. Be balanced and evidence-based.
Return ONLY valid JSON, no markdown.
`;

async function callAI(prompt: string): Promise<string> {
  const providers = [
    () => generateText({ model: openai("gpt-4o-mini"), prompt }),
    () => generateText({ model: anthropic("claude-3-haiku-20240307"), prompt }),
  ] as const;

  for (const call of providers) {
    try {
      const r = await call();
      return r.text;
    } catch {}
  }

  // Ollama fallback
  try {
    const res = await fetch(
      `${process.env.OLLAMA_BASE_URL ?? "http://localhost:11434"}/api/generate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "llama3.2", prompt, stream: false }),
      }
    );
    const json = (await res.json()) as { response: string };
    return json.response;
  } catch {}

  throw new Error("All AI providers unavailable");
}

export async function summariseInterviews(
  evaluations: InterviewEvaluation[]
): Promise<InterviewSummary> {
  if (!evaluations.length) {
    throw new Error("No evaluations provided");
  }

  const votes = { HIRE: 0, CONSIDER: 0, REJECT: 0 };
  for (const e of evaluations) votes[e.recommendation]++;

  const majority =
    votes.HIRE >= votes.CONSIDER && votes.HIRE >= votes.REJECT
      ? "HIRE"
      : votes.CONSIDER >= votes.REJECT
      ? "CONSIDER"
      : "REJECT";

  let aiSummary: Partial<InterviewSummary> = {};

  try {
    const raw = await callAI(SUMMARY_PROMPT(evaluations));
    const clean = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    aiSummary = JSON.parse(clean) as Partial<InterviewSummary>;
  } catch {
    aiSummary = {
      overallRecommendation: majority,
      consensusScore: Math.round((votes.HIRE / evaluations.length) * 100),
      strengths: [],
      concerns: ["AI summary unavailable — review evaluator notes manually"],
      culturalFitNotes: "Manual review required",
      summary: "Automated summary unavailable. Please review individual evaluations.",
    };
  }

  return {
    candidateName:          evaluations[0]?.candidateName ?? "Unknown",
    overallRecommendation:  aiSummary.overallRecommendation ?? majority,
    consensusScore:         aiSummary.consensusScore ?? 0,
    strengths:              aiSummary.strengths ?? [],
    concerns:               aiSummary.concerns ?? [],
    culturalFitNotes:       aiSummary.culturalFitNotes ?? "",
    summary:                aiSummary.summary ?? "",
    evaluatorCount:         evaluations.length,
    hireVotes:              votes.HIRE,
    considerVotes:          votes.CONSIDER,
    rejectVotes:            votes.REJECT,
  };
}
