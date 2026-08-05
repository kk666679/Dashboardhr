/**
 * Payroll Explainer Agent — Sprint 24, Task 24.4
 * Explains any payroll line item in plain language, referencing
 * the applicable rate table and configuration (Req 23.5).
 */
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

export interface PayrollLineItemExplanation {
  componentType: string;
  amount: string;
  currency: string;
  explanation: string;
  rateReference?: string;
  calculationSteps?: string[];
}

const COMPONENT_DESCRIPTIONS: Record<string, string> = {
  BASIC:    "Basic salary is your fixed monthly pay as per your employment contract.",
  ALLOWANCE: "Allowances are additional payments on top of basic salary (e.g. housing, transport).",
  OVERTIME: "Overtime pay is calculated at 1.5× hourly rate for hours worked beyond scheduled hours.",
  EPF_EE:   "EPF (Employees Provident Fund) — employee contribution deducted from your salary (11% or 5.5% for age ≥ 60).",
  EPF_ER:   "EPF employer contribution paid by your employer on your behalf (13% or 12%).",
  SOCSO:    "SOCSO (Social Security Organisation) — workplace injury and illness insurance contribution.",
  EIS:      "EIS (Employment Insurance System) — unemployment benefit contribution (0.2% of salary, capped at MYR 4,000).",
  PCB:      "PCB (Potongan Cukai Berjadual) — monthly income tax deduction calculated based on your annual taxable income bracket.",
  DEDUCTION: "A deduction from your gross pay (e.g. loan repayment, advance recovery).",
  BONUS:    "A one-time performance or contractual bonus payment.",
  NET:      "Net pay is your take-home amount after all deductions.",
};

export async function explainLineItem(item: {
  componentType: string;
  amount: string;
  currency: string;
  employeeGross?: string;
}): Promise<PayrollLineItemExplanation> {
  const baseExplanation = COMPONENT_DESCRIPTIONS[item.componentType] ?? `This is a payroll component of type ${item.componentType}.`;

  // For statutory components, use AI to generate a personalised explanation
  const isStatutory = ["EPF_EE", "EPF_ER", "SOCSO", "EIS", "PCB"].includes(item.componentType);

  let aiExplanation = baseExplanation;
  let rateReference: string | undefined;
  let calculationSteps: string[] | undefined;

  if (isStatutory && item.employeeGross) {
    const prompt = `Explain this Malaysian payroll deduction to an employee in simple terms.
Component: ${item.componentType}
Amount: ${item.currency} ${item.amount}
Gross Salary: ${item.currency} ${item.employeeGross}
Provide: 1) Plain language explanation, 2) Rate reference, 3) Calculation steps.
Return JSON: { "explanation": "", "rateReference": "", "calculationSteps": ["step1", "step2"] }`;

    try {
      for (const call of [
        () => generateText({ model: openai("gpt-4o-mini"), prompt }),
        () => generateText({ model: anthropic("claude-3-haiku-20240307"), prompt }),
      ]) {
        const result = await call();
        const clean = result.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(clean) as PayrollLineItemExplanation;
        aiExplanation     = parsed.explanation || baseExplanation;
        rateReference     = parsed.rateReference;
        calculationSteps  = parsed.calculationSteps;
        break;
      }
    } catch {}
  }

  return {
    componentType: item.componentType,
    amount: item.amount,
    currency: item.currency,
    explanation: aiExplanation,
    rateReference,
    calculationSteps,
  };
}
