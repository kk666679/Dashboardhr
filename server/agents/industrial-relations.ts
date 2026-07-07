import { prisma } from "@/lib/prisma";

const DOMESTIC_INQUIRY_STEPS = [
  "Issue Show Cause Letter — state alleged misconduct clearly",
  "Receive employee written explanation (5–7 working days)",
  "Evaluate explanation — if unsatisfactory, proceed to DI",
  "Form Domestic Inquiry panel (minimum 1 impartial officer)",
  "Serve Notice of Domestic Inquiry (minimum 48 hours notice)",
  "Conduct hearing — employee may be accompanied by colleague (not lawyer)",
  "Panel deliberates and issues findings",
  "Management decides penalty: warning / suspension / demotion / dismissal",
  "Issue outcome letter with right of appeal",
];

const MISCONDUCT_CATEGORIES = [
  "Absenteeism without valid reason",
  "Insubordination / refusal to follow lawful instructions",
  "Dishonesty / fraud / theft",
  "Sexual harassment",
  "Fighting / assault at workplace",
  "Breach of company policy",
  "Negligence causing loss or damage",
  "Disclosure of confidential information",
];

const LEGAL_REFERENCES = {
  employmentAct: "Employment Act 1955 (Act 265)",
  industrialRelations: "Industrial Relations Act 1967 (Act 177)",
  tradeUnions: "Trade Unions Act 1959 (Act 262)",
  osha: "Occupational Safety and Health Act 1994 (Act 514)",
  noticePeriod: {
    under2years: "4 weeks notice (S.12 Employment Act)",
    twoToFive: "6 weeks notice (S.12 Employment Act)",
    over5years: "8 weeks notice (S.12 Employment Act)",
  },
  misconductProcess:
    "S.14 Employment Act — domestic inquiry required before dismissal",
  constructiveDismissal:
    "S.20 Industrial Relations Act — employee may claim if forced to resign",
  collectiveBargaining:
    "S.13 Industrial Relations Act — employer must negotiate in good faith",
  tradeUnionRecognition:
    "S.9 Industrial Relations Act — recognition within 21 days of application",
  labourCourt:
    "Industrial Court — adjudicates unfair dismissal claims (S.20 IRA 1967)",
};

const DISPUTE_RESOLUTION_STEPS = [
  "Internal grievance procedure — direct supervisor → HR → management",
  "Conciliation via Department of Industrial Relations (DGIR) — S.18 IRA 1967",
  "Mediation — voluntary, non-binding, faster resolution",
  "Industrial Court referral — Minister of HR refers unresolved disputes",
  "Industrial Court award — binding, enforceable, no further appeal except on law",
];

const COLLECTIVE_BARGAINING_GUIDE = [
  "Verify union recognition certificate (DGIR)",
  "Employer must respond to bargaining notice within 14 days",
  "Negotiate in good faith — wages, hours, leave, benefits, grievance procedure",
  "Collective Agreement (CA) valid for 3 years minimum",
  "CA must be registered with Industrial Court within 1 month of signing",
  "Prohibited matters: promotion, transfer, hiring, firing (management prerogative)",
];

const PREVENTIVE_IR_STRATEGIES = [
  "Maintain updated Employee Handbook with clear disciplinary procedures",
  "Conduct regular HR briefings on company policies",
  "Implement structured grievance channels (open-door policy)",
  "Train supervisors on fair and consistent discipline",
  "Document all verbal warnings and counselling sessions",
  "Conduct exit interviews to identify systemic IR issues",
  "Establish Joint Consultative Committee (JCC) for union/non-union dialogue",
];

const SETTLEMENT_TEMPLATES = {
  mutualSeparation:
    "Mutual Separation Scheme (MSS) — voluntary, ex-gratia payment, full and final settlement",
  vssSeverance:
    "Voluntary Separation Scheme (VSS) — retrenchment benefit per S.60N Employment Act",
  consentAward:
    "Consent Award — Industrial Court records agreed settlement terms",
  backpay:
    "Back wages — typically 12–24 months salary (Industrial Court discretion)",
};

export async function industrialRelationsAgent(
  input: string,
  employeeId?: string,
) {
  try {
    const employee = employeeId
      ? await prisma.employee.findUnique({ where: { id: employeeId } })
      : null;

    const contract = employee
      ? await prisma.contract.findFirst({
          where: { employeeId: employee.id, status: "ACTIVE" },
          orderBy: { startDate: "desc" },
        })
      : null;

    const serviceYears = employee?.hireDate
      ? Math.floor(
          (Date.now() - employee.hireDate.getTime()) /
            (1000 * 60 * 60 * 24 * 365),
        )
      : null;

    const noticePeriod =
      serviceYears === null
        ? "Unknown — hireDate not set"
        : serviceYears < 2
          ? LEGAL_REFERENCES.noticePeriod.under2years
          : serviceYears < 5
            ? LEGAL_REFERENCES.noticePeriod.twoToFive
            : LEGAL_REFERENCES.noticePeriod.over5years;

    // Retrenchment benefit (S.60N EA): 10 days/yr (< 2 yrs), 15 days/yr (2–5 yrs), 20 days/yr (> 5 yrs)
    const retrenchmentBenefit =
      serviceYears === null || !contract
        ? null
        : (() => {
            const dailyRate = parseFloat(contract.salary.toString()) / 26;
            const daysPerYear =
              serviceYears < 2 ? 10 : serviceYears < 5 ? 15 : 20;
            return `RM${(dailyRate * daysPerYear * serviceYears).toFixed(2)} (${daysPerYear} days/yr × ${serviceYears} yrs)`;
          })();

    return {
      type: "INDUSTRIAL_RELATIONS",
      data: JSON.stringify({
        employee: employee
          ? {
              name: employee.name,
              position: employee.position,
              department: employee.department,
              serviceYears,
            }
          : null,
        contract: contract
          ? {
              type: contract.type,
              startDate: contract.startDate,
              status: contract.status,
            }
          : null,
        noticePeriod,
        retrenchmentBenefit,
        domesticInquirySteps: DOMESTIC_INQUIRY_STEPS,
        misconductCategories: MISCONDUCT_CATEGORIES,
        disputeResolutionSteps: DISPUTE_RESOLUTION_STEPS,
        collectiveBargainingGuide: COLLECTIVE_BARGAINING_GUIDE,
        preventiveStrategies: PREVENTIVE_IR_STRATEGIES,
        settlementTemplates: SETTLEMENT_TEMPLATES,
        legalReferences: LEGAL_REFERENCES,
      }),
    };
  } catch (error) {
    console.error("IR agent error:", error);
    return {
      type: "INDUSTRIAL_RELATIONS",
      data: JSON.stringify({
        employee: null,
        contract: null,
        noticePeriod: LEGAL_REFERENCES.noticePeriod.under2years,
        retrenchmentBenefit:
          "Requires active contract salary data to estimate.",
        domesticInquirySteps: DOMESTIC_INQUIRY_STEPS,
        misconductCategories: MISCONDUCT_CATEGORIES,
        disputeResolutionSteps: DISPUTE_RESOLUTION_STEPS,
        collectiveBargainingGuide: COLLECTIVE_BARGAINING_GUIDE,
        preventiveStrategies: PREVENTIVE_IR_STRATEGIES,
        settlementTemplates: SETTLEMENT_TEMPLATES,
        legalReferences: LEGAL_REFERENCES,
      }),
    };
  }
}
