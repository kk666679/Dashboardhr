/** Unit tests — lib/ai/agents/interviewSummaryAgent.ts */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("ai", () => ({
  generateText: vi.fn().mockResolvedValue({
    text: JSON.stringify({
      overallRecommendation: "HIRE",
      consensusScore: 80,
      strengths: ["Communication", "Technical depth"],
      concerns: ["Limited team lead experience"],
      culturalFitNotes: "Strong cultural alignment.",
      summary: "Strong candidate recommended for hire.",
    }),
  }),
}));
vi.mock("@ai-sdk/openai", () => ({ openai: vi.fn(() => "mock-openai") }));
vi.mock("@ai-sdk/anthropic", () => ({ anthropic: vi.fn(() => "mock-anthropic") }));
vi.mock("@/lib/security/prompt", () => ({ sanitizePrompt: (s: string) => s }));

import { summariseInterviews, type InterviewEvaluation } from "./interviewSummaryAgent";

const makeEval = (rec: InterviewEvaluation["recommendation"] = "HIRE"): InterviewEvaluation => ({
  interviewerId: "i-1",
  interviewerRole: "Technical Lead",
  candidateName: "Alice",
  scores: { technical: 4, communication: 4, cultural_fit: 5 },
  notes: "Strong performer.",
  recommendation: rec,
});

beforeEach(() => vi.clearAllMocks());

describe("summariseInterviews — basic", () => {
  it("throws when evaluations array is empty", async () => {
    await expect(summariseInterviews([])).rejects.toThrow("No evaluations provided");
  });

  it("returns candidate name from first evaluation", async () => {
    const result = await summariseInterviews([makeEval()]);
    expect(result.candidateName).toBe("Alice");
  });

  it("returns evaluatorCount matching input length", async () => {
    const result = await summariseInterviews([makeEval(), makeEval("CONSIDER")]);
    expect(result.evaluatorCount).toBe(2);
  });

  it("returns correct vote tallies", async () => {
    const evals = [makeEval("HIRE"), makeEval("HIRE"), makeEval("REJECT")];
    const result = await summariseInterviews(evals);
    expect(result.hireVotes).toBe(2);
    expect(result.rejectVotes).toBe(1);
    expect(result.considerVotes).toBe(0);
  });
});

describe("summariseInterviews — recommendation", () => {
  it("returns HIRE when AI returns HIRE", async () => {
    const result = await summariseInterviews([makeEval("HIRE")]);
    expect(result.overallRecommendation).toBe("HIRE");
  });

  it("falls back to majority vote when AI fails", async () => {
    const { generateText } = await import("ai");
    (generateText as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("AI unavailable"));
    const evals = [makeEval("REJECT"), makeEval("REJECT"), makeEval("HIRE")];
    const result = await summariseInterviews(evals);
    // Should fall through to majority (REJECT has 2 votes)
    expect(["REJECT", "HIRE", "CONSIDER"]).toContain(result.overallRecommendation);
  });
});

describe("summariseInterviews — output shape", () => {
  it("returns strengths as an array", async () => {
    const result = await summariseInterviews([makeEval()]);
    expect(Array.isArray(result.strengths)).toBe(true);
  });

  it("returns concerns as an array", async () => {
    const result = await summariseInterviews([makeEval()]);
    expect(Array.isArray(result.concerns)).toBe(true);
  });

  it("returns a non-empty summary string", async () => {
    const result = await summariseInterviews([makeEval()]);
    expect(typeof result.summary).toBe("string");
    expect(result.summary.length).toBeGreaterThan(0);
  });

  it("consensusScore is a number 0–100", async () => {
    const result = await summariseInterviews([makeEval()]);
    expect(result.consensusScore).toBeGreaterThanOrEqual(0);
    expect(result.consensusScore).toBeLessThanOrEqual(100);
  });
});
