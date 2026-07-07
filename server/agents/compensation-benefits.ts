import { prisma } from "@/lib/prisma";

// Malaysian statutory contribution rates (2024)
const STATUTORY = {
  epf: { employee: 0.11, employer: 0.13 },
  socso: { employee: 0.005, employer: 0.0175 }, // capped at RM4,000/mo
  eis: { employee: 0.002, employer: 0.002 }, // capped at RM4,000/mo
};

// PCB/MTD monthly tax estimate (simplified progressive brackets)
function estimatePCB(annualSalary: number): number {
  const chargeable = Math.max(0, annualSalary - 9000); // basic personal relief
  let tax = 0;
  const brackets = [
    [5000, 0.01],
    [15000, 0.03],
    [15000, 0.08],
    [15000, 0.13],
    [20000, 0.21],
    [30000, 0.24],
    [Infinity, 0.26],
  ];
  let remaining = chargeable;
  for (const [band, rate] of brackets) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band as number);
    tax += taxable * (rate as number);
    remaining -= taxable;
  }
  return +(tax / 12).toFixed(2);
}

// Salary benchmarks by position keyword (MYR/month)
const BENCHMARKS: Record<string, { min: number; mid: number; max: number }> = {
  executive: { min: 3500, mid: 5000, max: 7000 },
  manager: { min: 6000, mid: 8500, max: 12000 },
  director: { min: 12000, mid: 16000, max: 25000 },
  operator: { min: 1800, mid: 2200, max: 2800 },
  engineer: { min: 3500, mid: 5500, max: 8000 },
  supervisor: { min: 3000, mid: 4000, max: 5500 },
  clerk: { min: 1800, mid: 2500, max: 3200 },
};

function getBenchmark(position: string | null) {
  if (!position) return BENCHMARKS.executive;
  const key = Object.keys(BENCHMARKS).find((k) =>
    position.toLowerCase().includes(k),
  );
  return key ? BENCHMARKS[key] : BENCHMARKS.executive;
}

function getIncrementRecommendation(
  salary: number,
  benchmark: { min: number; mid: number; max: number },
) {
  if (salary < benchmark.min)
    return {
      action: "Immediate adjustment required",
      pct: "10–15%",
      reason: "Below market minimum",
    };
  if (salary < benchmark.mid)
    return {
      action: "Merit increment recommended",
      pct: "5–10%",
      reason: "Below market midpoint",
    };
  if (salary <= benchmark.max)
    return {
      action: "Retention increment",
      pct: "3–5%",
      reason: "At or near market midpoint",
    };
  return {
    action: "No increment needed",
    pct: "0–3% (cost-of-living only)",
    reason: "Above market maximum",
  };
}

export async function compensationBenefitsAgent(
  input: string,
  employeeId?: string,
) {
  try {
    const employee = employeeId
      ? await prisma.employee.findUnique({ where: { id: employeeId } })
      : await prisma.employee.findFirst();

    const contract = employee
      ? await prisma.contract.findFirst({
          where: { employeeId: employee.id, status: "ACTIVE" },
          orderBy: { startDate: "desc" },
        })
      : null;

    const benchmark = getBenchmark(employee?.position ?? null);
    const baseSalary = contract
      ? parseFloat(contract.salary.toString())
      : benchmark.mid;

    const statutory = {
      epfEmployee: +(baseSalary * STATUTORY.epf.employee).toFixed(2),
      epfEmployer: +(baseSalary * STATUTORY.epf.employer).toFixed(2),
      socsoEmployee: +(
        Math.min(baseSalary, 4000) * STATUTORY.socso.employee
      ).toFixed(2),
      socsoEmployer: +(
        Math.min(baseSalary, 4000) * STATUTORY.socso.employer
      ).toFixed(2),
      eisEmployee: +(
        Math.min(baseSalary, 4000) * STATUTORY.eis.employee
      ).toFixed(2),
      eisEmployer: +(
        Math.min(baseSalary, 4000) * STATUTORY.eis.employer
      ).toFixed(2),
      pcbMTD: estimatePCB(baseSalary * 12),
    };

    const totalEmployerCost = +(
      baseSalary +
      statutory.epfEmployer +
      statutory.socsoEmployer +
      statutory.eisEmployer
    ).toFixed(2);

    const netTakeHome = +(
      baseSalary -
      statutory.epfEmployee -
      statutory.socsoEmployee -
      statutory.eisEmployee -
      statutory.pcbMTD
    ).toFixed(2);

    const increment = getIncrementRecommendation(baseSalary, benchmark);

    return {
      type: "COMPENSATION_BENEFITS",
      data: JSON.stringify({
        employee: employee
          ? {
              name: employee.name,
              position: employee.position,
              department: employee.department,
            }
          : null,
        currentSalary: contract
          ? `RM${baseSalary.toLocaleString()}`
          : "No active contract",
        netTakeHome: `RM${netTakeHome.toLocaleString()}`,
        totalEmployerCost: `RM${totalEmployerCost.toLocaleString()}`,
        marketBenchmark: {
          min: `RM${benchmark.min.toLocaleString()}`,
          mid: `RM${benchmark.mid.toLocaleString()}`,
          max: `RM${benchmark.max.toLocaleString()}`,
        },
        incrementRecommendation: increment,
        bonusScheme: {
          performanceBonus: "1–3 months salary (based on KPI achievement)",
          festivalBonus: "0.5–1 month (Hari Raya / CNY / Deepavali)",
          contractualBonus: "As per employment contract",
          exGratia: "Discretionary — management approval required",
        },
        statutory,
        benefits: {
          statutory: ["EPF", "SOCSO", "EIS", "PCB (MTD)"],
          recommended: [
            "Medical coverage (RM3,000–5,000/yr)",
            "Annual leave 14 days (< 2 yrs) / 16 days (2–5 yrs) / 18 days (> 5 yrs)",
            "Sick leave 14 days / Hospitalization 60 days",
            "Group personal accident insurance",
            "Outpatient panel clinic",
          ],
          optional: [
            "Flexible working arrangement",
            "Professional development allowance (RM1,000–3,000/yr)",
            "Meal / transport allowance",
            "Dental & optical (RM500–1,000/yr)",
          ],
        },
        complianceChecklist: [
          "Minimum wage compliance: RM1,700/mo (2024)",
          "EPF registration & monthly contribution",
          "SOCSO registration & contribution",
          "EIS registration & contribution",
          "PCB/MTD monthly remittance to LHDN",
          "EA Form submission by 28 Feb annually",
        ],
      }),
    };
  } catch (error) {
    console.error("Compensation agent error:", error);
    const benchmark = BENCHMARKS.executive;

    return {
      type: "COMPENSATION_BENEFITS",
      data: JSON.stringify({
        employee: null,
        currentSalary: "Live contract data unavailable",
        netTakeHome:
          "Estimate after EPF/SOCSO/EIS/PCB depends on actual salary",
        totalEmployerCost: "Estimate depends on salary and allowances",
        marketBenchmark: {
          min: `RM${benchmark.min.toLocaleString()}`,
          mid: `RM${benchmark.mid.toLocaleString()}`,
          max: `RM${benchmark.max.toLocaleString()}`,
        },
        statutory: {
          epfEmployee: "11%",
          epfEmployer: "13%",
          socsoEmployee: "0.5% (capped)",
          socsoEmployer: "1.75% (capped)",
          eisEmployee: "0.2% (capped)",
          eisEmployer: "0.2% (capped)",
          pcbMTD: "Based on chargeable annual income",
        },
        benefits: {
          statutory: ["EPF", "SOCSO", "EIS", "PCB (MTD)"],
          recommended: [
            "Medical coverage",
            "Annual leave",
            "Sick leave",
            "Insurance",
          ],
          optional: [
            "Flexible working arrangement",
            "Training allowance",
            "Meal / transport allowance",
          ],
        },
        complianceChecklist: [
          "Confirm minimum wage compliance.",
          "Verify EPF, SOCSO, EIS, and PCB remittances are current.",
          "Validate benefits against approved policy and employment contract.",
        ],
      }),
    };
  }
}
