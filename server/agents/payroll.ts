import { prisma } from "@/lib/prisma";
type PrismaDecimal = { toNumber: () => number };

// Malaysian statutory rates 2024
const STATUTORY_RATES = {
  epf: { employee: 0.11, employer: 0.13 },
  socso: { employee: 0.005, employer: 0.0175, cap: 4000 },
  eis: { employee: 0.002, employer: 0.002 },
  minWage: 1700,
};

function calcDeductions(gross: number) {
  const socsoBase = Math.min(+gross, STATUTORY_RATES.socso.cap);
  return {
    epfEmployee: +(+gross * STATUTORY_RATES.epf.employee).toFixed(2),
    epfEmployer: +(+gross * STATUTORY_RATES.epf.employer).toFixed(2),
    socsoEmployee: +(socsoBase * STATUTORY_RATES.socso.employee).toFixed(2),
    socsoEmployer: +(socsoBase * STATUTORY_RATES.socso.employer).toFixed(2),
    eisEmployee: +(+gross * STATUTORY_RATES.eis.employee).toFixed(2),
    eisEmployer: +(+gross * STATUTORY_RATES.eis.employer).toFixed(2),
  };
}

export async function payrollAgent(input: string, employeeId?: string) {
  try {
    const payrolls = await prisma.payroll.findMany({
      where: employeeId ? { employeeId } : {},
      include: {
        employee: { select: { name: true, email: true, department: true } },
      },
      orderBy: { periodEnd: "desc" },
      take: 12,
    });

    if (!payrolls.length) {
      return {
        type: "PAYROLL",
        data: JSON.stringify({
          message: "No payroll records found.",
          statutory_rates: STATUTORY_RATES,
          portals: {
            LHDN: "hasil.gov.my",
            EPF: "kwsp.gov.my",
            SOCSO: "perkeso.gov.my",
          },
        }),
        summary: "No payroll records. Statutory rates provided.",
        actions: ["create_payroll", "check_employee_id"],
      };
    }

    const records = payrolls.map((p) => {
      const gross = +p.basicSalary.toString();
      const deductions = calcDeductions(gross);
      const net = +(
        gross -
        deductions.epfEmployee -
        deductions.socsoEmployee -
        deductions.eisEmployee
      ).toFixed(2);
      return {
        id: p.id,
        employee: p.employee?.name ?? p.employeeId,
        period: `${p.periodStart.toISOString().slice(0, 7)}`,
        basicSalary: gross,
        allowances: +(p.allowances || "0").toString(),
        deductions: +p.deductions.toString(),
        netSalary: +p.netSalary.toString(),
        status: p.status,
        statutory: deductions,
        calculatedNet: net,
      };
    });

    const totalNet = records.reduce((s, r) => s + r.netSalary, 0);
    const anomalies = records
      .filter((r) => r.netSalary < STATUTORY_RATES.minWage)
      .map((r) => `${r.employee}: net RM${r.netSalary} below minimum wage`);

    return {
      type: "PAYROLL",
      data: JSON.stringify({
        count: records.length,
        total_net_myr: totalNet.toFixed(2),
        records,
        anomalies,
        statutory_rates: STATUTORY_RATES,
        submissions_due: {
          EPF: "15th of following month",
          SOCSO: "15th of following month",
          LHDN_CP39: "10th of following month",
          EA_Form: "28 Feb annually",
        },
        portals: {
          LHDN: "hasil.gov.my",
          EPF: "kwsp.gov.my",
          SOCSO: "perkeso.gov.my",
        },
      }),
      summary: `${records.length} payroll records. Total net: RM${totalNet.toFixed(2)}. ${anomalies.length} anomalies.`,
      actions: anomalies.length
        ? ["review_anomalies", "generate_payslips", "submit_epf"]
        : ["generate_payslips", "submit_epf", "file_ea_form"],
    };
  } catch (error) {
    console.error("Payroll agent error:", error);
    return {
      type: "PAYROLL",
      data: JSON.stringify({
        error: "Payroll fetch failed.",
        statutory_rates: STATUTORY_RATES,
        compliance_note: "Verify EA Form filed by 28 Feb annually.",
      }),
      summary: "Fallback statutory info due to error.",
      actions: ["check_db", "retry"],
    };
  }
}
