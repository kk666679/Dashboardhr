import { prisma } from "@/lib/prisma";

// Malaysian foreign worker levy & statutory fees 2026 (IMI/MYEG data)
const BASE_LEVY_SECTOR: Record<string, number> = {
  manufacturing: 1850,
  construction: 1850,
  plantation: 640,
  agriculture: 640,
  services: 1850,
  domestic: 1850,
};

const NATIONALITY_FEES: Record<
  string,
  { visa: number; bond: number; total: number }
> = {
  vietnam: { visa: 13, bond: 1500, total: 1513 },
  philippines: { visa: 36, bond: 1000, total: 1036 },
  india: { visa: 50, bond: 750, total: 800 },
  myanmar: { visa: 19.5, bond: 750, total: 769.5 },
  bangladesh: { visa: 20, bond: 500, total: 520 },
  cambodia: { visa: 20, bond: 250, total: 270 },
  indonesia: { visa: 15, bond: 250, total: 265 },
  thailand: { visa: 0, bond: 250, total: 250 },
};

function getSectorKey(department: string): string {
  const sector = department?.toLowerCase() || "";
  return (
    Object.keys(BASE_LEVY_SECTOR).find((k) => sector.includes(k)) || "services"
  );
}

function getNationalityKey(nationality: string): string {
  return (nationality || "").toLowerCase().replace(/\s/g, "");
}

export async function levyAgent(input: string, employeeId?: string) {
  try {
    const where = employeeId
      ? { id: employeeId, isForeign: true }
      : { isForeign: true };
    const employees = employeeId
      ? await prisma.employee.findMany({ where, take: 1 })
      : await prisma.employee.findMany({ where, take: 10 });

    if (!employees.length) {
      return {
        type: "LEVY",
        data: JSON.stringify({
          message: "No foreign workers found.",
          next_steps: ["hire_foreign_worker", "check_quota"],
          notes: ["2026: 10% foreign workforce cap enforced."],
        }),
        summary: "No data.",
        actions: ["add_foreign_employee"],
      };
    }

    const breakdown = employees.map((emp) => {
      const sectorKey = getSectorKey(emp.department || "");
      const natKey = getNationalityKey(emp.nationality || "");
      const baseLevy = BASE_LEVY_SECTOR[sectorKey];

      const natFees = NATIONALITY_FEES[natKey] || {
        visa: 0,
        bond: 0,
        total: 0,
      };
      const annual = baseLevy + natFees.total;
      const monthly = (annual / 12).toFixed(2);
      return {
        name: emp.name,
        nationality: emp.nationality || "Unknown",
        department: emp.department || "General",
        sectorKey,
        baseLevy: baseLevy.toLocaleString(),
        visa: `RM${natFees.visa.toFixed(2)}`,
        bond: `RM${natFees.bond.toLocaleString()}`,
        totalAdditional: `RM${natFees.total.toFixed(2)}`,
        totalAnnual: annual.toLocaleString(),
        monthly: `RM${monthly}`,
      };
    });

    const totalAnnual = breakdown.reduce(
      (sum, b) => sum + parseInt(b.totalAnnual.replace(/,/g, "")),
      0,
    );
    const totalMonthly = (totalAnnual / 12).toFixed(2);

    return {
      type: "LEVY",
      data: JSON.stringify({
        employees_count: employees.length,
        total_annual_myr: totalAnnual.toLocaleString(),
        total_monthly_myr: totalMonthly,
        breakdown,
        base_levy_table: BASE_LEVY_SECTOR,
        nationality_fees: NATIONALITY_FEES,
        notes: [
          "2026: 10% foreign workforce cap (13th Malaysia Plan).",
          "MTLM: +RM300-500/worker for high-ratio employers (Bangladesh/Indonesia).",
          "Portals: MYEG (payments), FWCMS (quota)",
        ],
        sources: ["imi.gov.my", "foreignworkers.com.my"],
      }),
      summary: `Total levy for ${employees.length} workers: RM${totalAnnual.toLocaleString()}/year (base + statutory).`,
      actions: ["pay_levy_myeg", "check_quota_fwcms", "renew_permits"],
    };
  } catch (error) {
    console.error("Levy agent error:", error);
    return {
      type: "LEVY",
      data: JSON.stringify({
        error: "DB query failed",
        example_vietnam_construction: {
          base: 1850,
          visa: 13,
          bond: 1500,
          total: 1850 + 1513,
        },
        notes: ["Use MYEG/FWCMS for latest quotas."],
      }),
      summary: "Example shown due to error.",
      actions: ["check_db", "retry"],
    };
  }
}
