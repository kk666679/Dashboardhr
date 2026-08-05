import { prisma } from "@/lib/prisma";
import {
  BASE_LEVY_SECTOR,
  NATIONALITY_FEES,
  getSectorKey,
  getNationalityKey,
} from "@/lib/constants/levy-rates";

/**
 * Levy agent – calculates foreign worker levy for a given tenant.
 *
 * @param input - The user's input prompt (unused but kept for consistency).
 * @param employeeId - Optional employee ID to filter a single worker.
 * @param tenantId - **Required** – tenant ID for multi‑tenancy isolation.
 * @returns An object with levy breakdown and actions.
 */
export async function levyAgent(
  input: string,
  employeeId?: string,
  tenantId?: string,
) {
  // Guard against missing tenantId
  if (!tenantId) {
    throw new Error("levyAgent: tenantId is required");
  }

  try {
    // Build a type‑safe where clause
    const where: Record<string, unknown> = {
      tenantId,
      isForeign: true,
    };
    if (employeeId) {
      where.id = employeeId;
    }

    const employees = await prisma.employee.findMany({
      where,
      take: employeeId ? 1 : 10,
    });

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

    const breakdown = (employees as any[]).map((emp: any) => {
      const sectorKey = getSectorKey(emp.department || "");
      const natKey = getNationalityKey(emp.nationality || "");
      const baseLevy = BASE_LEVY_SECTOR[sectorKey] ?? 0;

      const natFees = NATIONALITY_FEES[natKey] ?? {
        visa: 0,
        bond: 0,
        total: 0,
      };
      const annual = baseLevy + natFees.total;
      const monthly = annual / 12;

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
        monthly: `RM${monthly.toFixed(2)}`,
      };
    });

    // Safely sum total annual amounts (remove commas, parse as float)
    const totalAnnual = breakdown.reduce((sum: number, b: { totalAnnual: string }) => {
      const numeric = parseFloat(b.totalAnnual.replace(/,/g, ""));
      return sum + (isNaN(numeric) ? 0 : numeric);
    }, 0);

    const totalMonthly = totalAnnual / 12;

    return {
      type: "LEVY",
      data: JSON.stringify({
        employees_count: employees.length,
        total_annual_myr: totalAnnual.toLocaleString(),
        total_monthly_myr: totalMonthly.toFixed(2),
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
          base: BASE_LEVY_SECTOR.construction,
          visa: NATIONALITY_FEES.vietnam?.visa ?? 13,
          bond: NATIONALITY_FEES.vietnam?.bond ?? 1500,
          total: (BASE_LEVY_SECTOR.construction ?? 0) + (NATIONALITY_FEES.vietnam?.total ?? 1513),
        },
        notes: ["Use MYEG/FWCMS for latest quotas."],
      }),
      summary: "Example shown due to error.",
      actions: ["check_db", "retry"],
    };
  }
}