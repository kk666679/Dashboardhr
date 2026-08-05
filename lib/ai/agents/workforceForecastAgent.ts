/**
 * Workforce Forecast Agent — Sprint 24, Task 24.2
 * 12-month workforce demand forecast combining historical trends,
 * business growth targets, and seasonal patterns (Req 23.7).
 * Monthly refresh cron (1st of month 05:00) via `ai` BullMQ queue.
 */
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export interface MonthlyForecast {
  month: string;        // "Jan 2026"
  projected: number;
  attritionEstimate: number;
  hiringRequired: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export interface WorkforceForecast {
  tenantId: string;
  generatedAt: string;
  currentHeadcount: number;
  forecastedHeadcount12M: number;
  netChange: number;
  months: MonthlyForecast[];
  insights: string[];
  assumptions: string[];
}

export async function generateWorkforceForecast(params: {
  tenantId: string;
  currentHeadcount: number;
  historicalAttritionRate: number;   // 0–1, annual
  plannedHeadcountGrowth: number;    // 0–1, annual target
  seasonalityFactors?: number[];     // 12 values, multiplier per month
}): Promise<WorkforceForecast> {
  const {
    currentHeadcount,
    historicalAttritionRate,
    plannedHeadcountGrowth,
    seasonalityFactors = Array(12).fill(1),
  } = params;

  const monthlyAttrition = historicalAttritionRate / 12;
  const monthlyGrowth    = plannedHeadcountGrowth / 12;
  const months: MonthlyForecast[] = [];
  let current = currentHeadcount;

  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now);
    d.setMonth(d.getMonth() + i + 1);
    const label = d.toLocaleDateString("en-MY", { month: "short", year: "numeric" });
    const seasonality = seasonalityFactors[i] ?? 1;

    const attritionEstimate = Math.round(current * monthlyAttrition * seasonality);
    const growthTarget      = Math.round(current * monthlyGrowth);
    const hiringRequired    = attritionEstimate + growthTarget;
    const projected         = current - attritionEstimate + growthTarget;

    months.push({
      month: label,
      projected,
      attritionEstimate,
      hiringRequired,
      confidence: i < 3 ? "HIGH" : i < 6 ? "MEDIUM" : "LOW",
    });

    current = projected;
  }

  // Get AI insights
  let insights: string[] = [];
  let assumptions: string[] = [
    `Annual attrition rate: ${(historicalAttritionRate * 100).toFixed(1)}%`,
    `Planned headcount growth: ${(plannedHeadcountGrowth * 100).toFixed(1)}% per year`,
    "Forecast based on linear extrapolation with seasonal adjustments",
  ];

  try {
    const prompt = `Given a workforce forecast showing headcount moving from ${currentHeadcount} to ${months[11]?.projected ?? 0} over 12 months, with ${Math.round(historicalAttritionRate * 100)}% annual attrition and ${Math.round(plannedHeadcountGrowth * 100)}% growth target, provide 3 concise insights for the HR Director. Return JSON: { "insights": ["insight1", "insight2", "insight3"] }`;

    const result = await generateText({ model: openai("gpt-4o-mini"), prompt });

    const clean  = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(clean) as { insights: string[] };
    insights = parsed.insights ?? [];
  } catch {
    insights = [
      `${Math.round(historicalAttritionRate * 12 * currentHeadcount / 12)} hires needed monthly to maintain headcount`,
      `Net headcount change of ${months[11]!.projected - currentHeadcount} expected over 12 months`,
      "Review recruitment pipeline capacity against monthly hiring requirements",
    ];
  }

  return {
    tenantId: params.tenantId,
    generatedAt: new Date().toISOString(),
    currentHeadcount,
    forecastedHeadcount12M: months[11]!.projected,
    netChange: months[11]!.projected - currentHeadcount,
    months,
    insights,
    assumptions,
  };
}
