import { prisma } from "@/lib/prisma";

// Foreign Worker & Expatriate agent: PLKS/FWCMS/MYEG/EPLKS/FOMEMA/levy/repatriation (Malaysia 2026)
const PERMIT_TYPES = {
  PLKS: "PLKS (Foreign Worker)",
  EPLKS: "EPLKS (Renewal)",
  EP: "Employment Pass (Expat)",
  DP: "Dependent Pass",
  VP: "Visitor Pass",
} as const;

const PORTALS = {
  FWCMS: "https://fwcms.esd.imi.gov.my",
  MYEG: "https://levy.myeg.com.my",
  JTK: "https://jtksm.mohr.gov.my",
  FOMEMA: "https://fomema.eservices.my",
} as const;

function getPermitStatus(
  permitExpiry: string | null,
  levyPaidUntil: string | null,
): string {
  const now = new Date();
  const expiry = permitExpiry ? new Date(permitExpiry) : null;
  const levyDate = levyPaidUntil ? new Date(levyPaidUntil) : null;

  if (!expiry || !levyDate) return "MISSING";
  if (expiry < now || levyDate < now) return "EXPIRED";
  const monthsToExpiry =
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30);
  return monthsToExpiry < 2 ? "URGENT_RENEWAL" : "ACTIVE";
}

function getComplianceRisks(foreignCount: number, totalEmployees?: number): string[] {
  const total = totalEmployees || foreignCount;
  const ratio = foreignCount / Math.max(total, 1);
  if (ratio > 0.1) return ["EXCEED_10PCT_CAP: Reduce foreign ratio (13th Malaysia Plan 2026)"];
  if (ratio > 0.08) return ["NEAR_10PCT_CAP: Monitor hiring"];
  return ["OK"];
}

export async function foreignWorkerExpatriateAgent(
  input: string,
  tenantId: string,
  employeeId?: string,
) {
  try {
    const where: any = {
      tenantId,
      isForeign: true,
    };
    if (employeeId) {
      where.id = employeeId;
    }

    const employees = await prisma.employee.findMany({
      where,
      take: employeeId ? 1 : 20,
    });

    if (!employees.length) {
      return {
        type: "FOREIGN_WORKER_EXPATRIATE",
        data: JSON.stringify({
          message: "No foreign workers/expatriates found.",
          next_steps: ["hire_foreign_worker", "import_plks_data"],
          notes: ["2026: Max 10% foreign workforce cap enforced."],
        }),
        summary: "No data.",
        actions: ["add_foreign_employee"],
      };
    }

    const breakdown = (employees as any[]).map((emp: any) => {
      const permit = (emp as any).permit ?? {};
      const status = getPermitStatus(
        permit.expiryDate ?? null,
        permit.levyPaidUntil ?? null,
      );
      return {
        name: emp.name,
        nationality: emp.nationality || "Unknown",
        permitType: permit.type || "Unknown",
        permitNumber: permit.permitNumber || "N/A",
        status,
        fomemaDue:
          (emp as any).medicalExpiry &&
          new Date((emp as any).medicalExpiry) <
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            ? "URGENT"
            : "OK",
        levyStatus:
          (permit.levyPaidAmount ?? 0) >= (permit.levyAmount ?? 0)
            ? "PAID"
            : "OVERDUE",
        actions:
          status !== "ACTIVE"
            ? ["renew_plks", "pay_levy_myeg", "fomema_exam"]
            : [],
        portals: ["FWCMS quota check", "MYEG levy pay"],
      };
    });

    const risks = getComplianceRisks(employees.length);
    const urgentCount = (breakdown as Array<{ status: string }>).filter((b) => b.status !== "ACTIVE").length;
    const repatriationPending = (breakdown as Array<{ status: string }>).filter(
      (b) => b.status === "EXPIRED",
    ).length;

    return {
      type: "FOREIGN_WORKER_EXPATRIATE",
      data: JSON.stringify({
        employees_count: employees.length,
        urgent_count: urgentCount,
        repatriation_pending: repatriationPending,
        compliance_risks: risks,
        permit_types: PERMIT_TYPES,
        portals: PORTALS,
        breakdown,
        notes: [
          "PLKS/FWCMS: Primary foreign worker system.",
          "EPLKS: Renewal (30-60 days pre-expiry).",
          "Expat EP: RM5K+ salary min, 2-5yr validity.",
          "2026: MTLM levy +RM300-500 high-ratio employers.",
          "Sources: imi.gov.my, fwcms.esd.imi.gov.my, myeg.com.my",
        ],
      }),
      summary: `${employees.length} foreign/expat records: ${urgentCount} urgent (${risks[0] || "Compliant"}).`,
      actions: urgentCount
        ? ["batch_renewals_fwcms", "pay_levies", "fomema_batch"]
        : ["view_dashboard"],
    };
  } catch (error) {
    console.error("Foreign Worker Expat agent error:", error);
    return {
      type: "FOREIGN_WORKER_EXPATRIATE",
      data: JSON.stringify({
        error: "DB query failed",
        example_plks: {
          permit: "A1234567",
          status: "EXPIRED",
          actions: ["renew_eplks", "fomema", "levy"],
        },
        quick_links: PORTALS,
      }),
      summary: "Example shown due to error.",
      actions: ["check_db", "retry"],
    };
  }
}
