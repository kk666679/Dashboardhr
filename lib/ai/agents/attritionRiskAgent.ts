/**
 * Attrition Risk Agent — Sprint 12+, Task per design doc
 *
 * Scores employees on attrition risk (0.0–1.0) using features from
 * the design's attrition risk model inputs table.
 *
 * Threshold ≥ 0.75 surfaces employee on HR Director dashboard.
 *
 * Requirements: 23.3
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export interface AttritionFeatures {
  employeeId: string;
  tenureMonths: number;
  performanceTrend: number[];      // last 3 cycles, 1–5 scale
  leaveUtilisationRatio: number;   // used / entitlement, 0–1
  absenceFrequency: number;        // absences in last 12M
  daysSinceLastPromotion: number;
  salaryCompaRatio: number;        // salary / pay band midpoint
  deptAttritionRate12M: number;    // 0–1 fraction
  engagementScore?: number;        // 0–100 if available
}

export interface AttritionScore {
  employeeId: string;
  score: number;         // 0.0 – 1.0
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  topFactors: string[];
  recommendation: string;
}

// ─── Heuristic baseline (no AI needed for simple scoring) ────────────────────

function heuristicScore(f: AttritionFeatures): number {
  let score = 0;

  // Tenure: high risk in first 12M and after 36M without promotion
  if (f.tenureMonths < 12) score += 0.15;
  else if (f.tenureMonths > 36 && f.daysSinceLastPromotion > 730) score += 0.1;

  // Performance declining
  if (f.performanceTrend.length >= 2) {
    const last = f.performanceTrend[f.performanceTrend.length - 1]!;
    const prev = f.performanceTrend[f.performanceTrend.length - 2]!;
    if (last < prev) score += 0.1;
    if (last <= 2) score += 0.15;
  }

  // Leave utilisation
  if (f.leaveUtilisationRatio > 0.9) score += 0.1;
  if (f.leaveUtilisationRatio < 0.2) score += 0.05; // under-utilisation can signal disengagement

  // Absence frequency
  if (f.absenceFrequency > 10) score += 0.15;
  else if (f.absenceFrequency > 5) score += 0.08;

  // Salary compa-ratio below 0.85 = underpaid
  if (f.salaryCompaRatio < 0.85) score += 0.15;

  // Department attrition rate is high
  if (f.deptAttritionRate12M > 0.2) score += 0.1;

  // Engagement score
  if (f.engagementScore !== undefined) {
    if (f.engagementScore < 40) score += 0.15;
    else if (f.engagementScore < 60) score += 0.05;
  }

  return Math.min(score, 1.0);
}

function riskLevel(score: number): AttritionScore["riskLevel"] {
  if (score >= 0.75) return "CRITICAL";
  if (score >= 0.5)  return "HIGH";
  if (score >= 0.25) return "MEDIUM";
  return "LOW";
}

function topFactors(f: AttritionFeatures, score: number): string[] {
  const factors: string[] = [];
  if (f.salaryCompaRatio < 0.85) factors.push("Below-market compensation");
  if (f.absenceFrequency > 10) factors.push("High absence frequency");
  if (f.performanceTrend.length > 0 && f.performanceTrend[f.performanceTrend.length - 1]! <= 2)
    factors.push("Low recent performance rating");
  if (f.daysSinceLastPromotion > 730) factors.push("No promotion in 2+ years");
  if (f.deptAttritionRate12M > 0.2) factors.push("High department attrition rate");
  if (f.engagementScore !== undefined && f.engagementScore < 40)
    factors.push("Low engagement score");
  if (f.tenureMonths < 12) factors.push("Short tenure — flight risk period");
  return factors.slice(0, 3);
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function scoreAttritionRisk(
  features: AttritionFeatures
): Promise<AttritionScore> {
  const score = heuristicScore(features);
  const level = riskLevel(score);
  const factors = topFactors(features, score);

  // For CRITICAL scores, get an AI recommendation
  let recommendation = "Monitor via standard HR check-ins.";
  if (level === "CRITICAL" || level === "HIGH") {
    recommendation = await getAiRecommendation(features, score, factors);
  }

  return {
    employeeId: features.employeeId,
    score: Math.round(score * 100) / 100,
    riskLevel: level,
    topFactors: factors,
    recommendation,
  };
}

export async function scoreBatch(
  featuresList: AttritionFeatures[]
): Promise<AttritionScore[]> {
  return Promise.all(featuresList.map(scoreAttritionRisk));
}

async function getAiRecommendation(
  features: AttritionFeatures,
  score: number,
  factors: string[]
): Promise<string> {
  const prompt = `An employee has an attrition risk score of ${(score * 100).toFixed(0)}% with these risk factors: ${factors.join(", ")}. 
Their tenure is ${features.tenureMonths} months, salary compa-ratio ${features.salaryCompaRatio.toFixed(2)}, department attrition rate ${(features.deptAttritionRate12M * 100).toFixed(0)}%.
In 1-2 sentences, what specific HR action should be taken to retain this employee? Be direct and practical.`;

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
    });
    return result.text.trim();
  } catch {
    try {
      const result = await generateText({
        model: anthropic("claude-3-haiku-20240307"),
        prompt,
      });
      return result.text.trim();

    } catch {
      return `Immediate manager meeting recommended to discuss career development and compensation review.`;
    }
  }
}
