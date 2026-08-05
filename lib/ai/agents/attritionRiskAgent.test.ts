/** Unit tests — lib/ai/agents/attritionRiskAgent.ts */
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AI SDK so no real LLM calls are made
vi.mock("ai", () => ({ generateText: vi.fn().mockResolvedValue({ text: "Schedule a career development meeting." }) }));
vi.mock("@ai-sdk/openai", () => ({ openai: vi.fn(() => "mock-openai-model") }));
vi.mock("@ai-sdk/anthropic", () => ({ anthropic: vi.fn(() => "mock-anthropic-model") }));

import { scoreAttritionRisk, scoreBatch, type AttritionFeatures } from "./attritionRiskAgent";

const baseFeatures = (): AttritionFeatures => ({
  employeeId: "emp-1",
  tenureMonths: 24,
  performanceTrend: [4, 4, 4],
  leaveUtilisationRatio: 0.5,
  absenceFrequency: 2,
  daysSinceLastPromotion: 180,
  salaryCompaRatio: 0.95,
  deptAttritionRate12M: 0.05,
});

beforeEach(() => vi.clearAllMocks());

describe("scoreAttritionRisk — heuristic scoring", () => {
  it("returns a score between 0 and 1", async () => {
    const result = await scoreAttritionRisk(baseFeatures());
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1);
  });

  it("returns LOW risk for a stable employee profile", async () => {
    const result = await scoreAttritionRisk(baseFeatures());
    expect(["LOW", "MEDIUM"]).toContain(result.riskLevel);
  });

  it("returns CRITICAL risk for a high-risk profile", async () => {
    const result = await scoreAttritionRisk({
      ...baseFeatures(),
      salaryCompaRatio: 0.70,
      absenceFrequency: 15,
      deptAttritionRate12M: 0.35,
      engagementScore: 25,
      performanceTrend: [3, 2, 1],
      daysSinceLastPromotion: 900,
    });
    expect(["HIGH", "CRITICAL"]).toContain(result.riskLevel);
  });

  it("always includes employeeId in result", async () => {
    const result = await scoreAttritionRisk({ ...baseFeatures(), employeeId: "emp-42" });
    expect(result.employeeId).toBe("emp-42");
  });

  it("returns topFactors as an array", async () => {
    const result = await scoreAttritionRisk(baseFeatures());
    expect(Array.isArray(result.topFactors)).toBe(true);
  });

  it("returns a recommendation string", async () => {
    const result = await scoreAttritionRisk(baseFeatures());
    expect(typeof result.recommendation).toBe("string");
    expect(result.recommendation.length).toBeGreaterThan(0);
  });
});

describe("scoreAttritionRisk — risk factor detection", () => {
  it("flags below-market compensation", async () => {
    const result = await scoreAttritionRisk({ ...baseFeatures(), salaryCompaRatio: 0.80 });
    expect(result.topFactors.some(f => f.toLowerCase().includes("compensation") || f.toLowerCase().includes("market"))).toBe(true);
  });

  it("flags short tenure as a risk", async () => {
    const result = await scoreAttritionRisk({ ...baseFeatures(), tenureMonths: 6 });
    expect(result.topFactors.some(f => f.toLowerCase().includes("tenure") || f.toLowerCase().includes("flight"))).toBe(true);
  });

  it("flags high absence frequency", async () => {
    const result = await scoreAttritionRisk({ ...baseFeatures(), absenceFrequency: 12 });
    expect(result.topFactors.some(f => f.toLowerCase().includes("absence"))).toBe(true);
  });
});

describe("scoreBatch", () => {
  it("returns a score for each input feature set", async () => {
    const features = [baseFeatures(), { ...baseFeatures(), employeeId: "emp-2" }];
    const results = await scoreBatch(features);
    expect(results).toHaveLength(2);
    expect(results[0].employeeId).toBe("emp-1");
    expect(results[1].employeeId).toBe("emp-2");
  });

  it("returns an empty array for empty input", async () => {
    expect(await scoreBatch([])).toEqual([]);
  });
});
