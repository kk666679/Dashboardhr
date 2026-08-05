import { prisma } from "@/lib/prisma";
import {
  BASE_LEVY_SECTOR,
  NATIONALITY_FEES,
  getSectorKey,
  getNationalityKey,
} from "@/lib/constants/levy-rates";

export async function levyAgent(
  input: string,
  employeeId?: string,
 tenantId?: string,
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
      const baseLevy = BASE_LEVY_SECTOR[sectorKey] || 0;

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
     (sum: number, b: { totalAnnual: string }) => sum + parseFloat(b.totalAnnual.replace(/,/g, "")),
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

// ── HR Quality Management Agent ───────────────────────────────────────────────

const QMS_STANDARDS = [
  { standard: "ISO 9001:2015", area: "Quality Management System", status: "Core" },
  { standard: "MS ISO 9001:2015", area: "Malaysian Standard Equivalent", status: "Core" },
  { standard: "OSHA 1994 / Act 514", area: "Occupational Safety & Health", status: "Required" },
  { standard: "Employment Act 1955", area: "HR Compliance Baseline", status: "Required" },
  { standard: "HRDC/PSMB Act 2001", area: "Training Quality Assurance", status: "Recommended" },
];

const CAPA_CATEGORIES = [
  "Recruitment Process Deviation",
  "Onboarding Checklist Gap",
  "Payroll Processing Error",
  "Document Control Failure",
  "Training Record Incomplete",
  "Attendance Record Discrepancy",
  "Permit/Visa Expiry Missed",
  "Policy Non-Compliance",
];

const KPIs = [
  { kpi: "HR Process SOP Completion Rate", target: "≥ 95%", frequency: "Monthly" },
  { kpi: "CAPA Closure Rate (within 30 days)", target: "≥ 90%", frequency: "Monthly" },
  { kpi: "Document Control Compliance", target: "100% current docs", frequency: "Quarterly" },
  { kpi: "Audit Finding Resolution Time", target: "≤ 14 days avg", frequency: "Per audit" },
  { kpi: "Employee Data Completeness", target: "≥ 98%", frequency: "Monthly" },
  { kpi: "Training Records Accuracy", target: "100%", frequency: "Monthly" },
];

export async function hrQualityManagementAgent(input: string, tenantId?: string) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const where = tenantId ? { tenantId } : {};

    const [
      totalEmployees,
      expiredDocs,
      activeComplianceRules,
    ] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.document.count({ where: { ...where, status: "EXPIRED" } }),
      prisma.complianceRule.count({ where: { ...where, active: true } }),
    ]);

    const dataCompleteness = totalEmployees > 0
      ? Math.max(80, 100 - Math.round((expiredDocs / Math.max(totalEmployees, 1)) * 20))
      : 100;

    const openIssues = expiredDocs;
    const qmsScore = Math.max(0, 100 - openIssues * 5);

    return {
      type: "HR_QUALITY_MANAGEMENT",
      data: JSON.stringify({
        qmsScore: `${qmsScore}/100`,
        status:
          qmsScore >= 85 ? "✅ Controlled"
          : qmsScore >= 65 ? "⚠️ Improvement Needed"
          : "🚨 Critical — Immediate Action Required",
        dataCompleteness: `${dataCompleteness}%`,
        openIssues,
        activeComplianceRules,
        standards: QMS_STANDARDS,
        capaCategories: CAPA_CATEGORIES,
        kpis: KPIs,
        recommendations: [
          openIssues > 0
            ? `Close ${openIssues} expired document(s) to restore QMS control.`
            : "All documents are current — maintain renewal schedule.",
          activeComplianceRules === 0
            ? "Configure compliance rules to enable automated monitoring."
            : `${activeComplianceRules} active compliance rule(s) in place.`,
          "Schedule quarterly internal audits aligned to ISO 9001 clause 9.2.",
          "Ensure CAPA records are linked to root-cause evidence.",
          "Review SOP version control monthly — superseded versions must be archived.",
        ],
        continuousImprovement: [
          "Run monthly data completeness checks against all HR records.",
          "Track CAPA closure rate — target ≥ 90% within 30 days.",
          "Hold quarterly management review covering QMS KPIs.",
          "Integrate Kaizen cycles for high-frequency HR processes (onboarding, payroll).",
        ],
      }),
      summary: `HR QMS Score: ${qmsScore}/100. ${openIssues} open issue(s) requiring attention.`,
      actions: ["review_capa", "schedule_internal_audit", "check_document_control"],
    };
  } catch (error) {
    console.error("HR Quality Management agent error:", error);
    return {
      type: "HR_QUALITY_MANAGEMENT",
      data: JSON.stringify({
        qmsScore: "Advisory mode",
        status: "⚠️ Live data unavailable — showing standard QMS framework.",
        standards: QMS_STANDARDS,
        capaCategories: CAPA_CATEGORIES,
        kpis: KPIs,
        recommendations: [
          "Conduct a baseline HR process audit against ISO 9001 requirements.",
          "Map all HR SOPs and identify gaps in document control.",
          "Establish a CAPA register for recurring HR process deviations.",
          "Define data completeness thresholds for all employee records.",
        ],
      }),
      summary: "Standard HR QMS framework shown (DB unavailable).",
      actions: ["check_db", "retry"],
    };
  }
}
