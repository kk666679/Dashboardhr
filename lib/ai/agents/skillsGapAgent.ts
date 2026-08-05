/**
 * Skills Gap Agent — Sprint 24, Task 24.2
 * Compares current skill inventory vs future capability requirements.
 * Recommends specific learning paths to close gaps (Req 23.6).
 */
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export interface SkillGap {
  skill: string;
  currentCoverage: number; // 0–100%
  requiredCoverage: number;
  gap: number;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  recommendedCourses: string[];
}

export interface SkillsGapReport {
  departmentId: string;
  analysisDate: string;
  totalEmployees: number;
  gaps: SkillGap[];
  summary: string;
  topPriorities: string[];
}

export async function analyseSkillsGap(params: {
  departmentId: string;
  currentSkills: Record<string, number>; // skill -> coverage %
  requiredSkills: Record<string, number>; // skill -> required coverage %
  employeeCount: number;
  availableCourses: string[];
}): Promise<SkillsGapReport> {
  const gaps: SkillGap[] = Object.entries(params.requiredSkills).map(([skill, required]) => {
    const current = params.currentSkills[skill] ?? 0;
    const gap = Math.max(0, required - current);
    const severity = gap >= 50 ? "CRITICAL" : gap >= 30 ? "HIGH" : gap >= 15 ? "MEDIUM" : "LOW";
    return { skill, currentCoverage: current, requiredCoverage: required, gap, severity, recommendedCourses: [] };
  });

  // Get AI recommendations for top gaps
  const criticalGaps = gaps.filter(g => g.severity === "CRITICAL" || g.severity === "HIGH").slice(0, 5);

  if (criticalGaps.length > 0) {
    const prompt = `Given these skill gaps and available courses, recommend up to 3 courses per gap.
Gaps: ${JSON.stringify(criticalGaps.map(g => ({ skill: g.skill, gap: g.gap })))}
Available courses: ${params.availableCourses.slice(0, 20).join(", ")}
Return JSON: { "recommendations": { "skillName": ["course1", "course2"] } }`;

    try {
      const result = await generateText({ model: openai("gpt-4o-mini"), prompt });

      const clean = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      const rec = JSON.parse(clean) as { recommendations: Record<string, string[]> };
      for (const gap of gaps) {
        if (rec.recommendations[gap.skill]) {
          gap.recommendedCourses = rec.recommendations[gap.skill]!;
        }
      }
    } catch {}
  }

  const topPriorities = criticalGaps.slice(0, 3).map(g => g.skill);

  return {
    departmentId: params.departmentId,
    analysisDate: new Date().toISOString(),
    totalEmployees: params.employeeCount,
    gaps: gaps.sort((a, b) => b.gap - a.gap),
    summary: `${criticalGaps.length} critical skill gaps identified across ${gaps.length} required competencies.`,
    topPriorities,
  };
}
