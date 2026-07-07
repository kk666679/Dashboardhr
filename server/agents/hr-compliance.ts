import { prisma } from "@/lib/prisma";

const COMPLIANCE_POLICIES = [
  {
    policy: "Employment Act 1955 Compliance",
    area: "Labour Law",
    status: "Required",
  },
  {
    policy: "Industrial Relations Act 1967",
    area: "Labour Law",
    status: "Required",
  },
  { policy: "OSHA 1994 Safety Policy", area: "Safety", status: "Required" },
  {
    policy: "PDPA 2010 Data Protection Policy",
    area: "Data Privacy",
    status: "Required",
  },
  {
    policy: "Foreign Worker Management Policy",
    area: "Immigration",
    status: "Required",
  },
  {
    policy: "Anti-Sexual Harassment Policy",
    area: "Employee Relations",
    status: "Required",
  },
  {
    policy: "Whistleblower Protection Policy",
    area: "Governance",
    status: "Recommended",
  },
  {
    policy: "Code of Conduct & Ethics",
    area: "Governance",
    status: "Required",
  },
  {
    policy: "Leave & Attendance Policy",
    area: "HR Operations",
    status: "Required",
  },
  {
    policy: "Recruitment & Selection Policy",
    area: "Talent Acquisition",
    status: "Required",
  },
];

export async function hrComplianceAgent(input: string, tenantId?: string) {
  try {
    const where = tenantId ? { tenantId } : {};
    const now = new Date();
    const in30Days = new Date(Date.now() + 30 * 86400000);
    const in60Days = new Date(Date.now() + 60 * 86400000);
    const in90Days = new Date(Date.now() + 90 * 86400000);

    const [
      expiredDocs,
      expiringDocs30,
      expiredVisas,
      expiringVisas60,
      expiredContracts,
      complianceRules,
    ] = await Promise.all([
      prisma.document.count({ where: { ...where, status: "EXPIRED" } }),
      prisma.document.count({
        where: { ...where, expiryDate: { gte: now, lte: in30Days } },
      }),
      prisma.visa.count({ where: { ...where, status: "EXPIRED" } }),
      prisma.visa.count({
        where: {
          ...where,
          status: "ACTIVE",
          expiryDate: { gte: now, lte: in60Days },
        },
      }),
      prisma.contract.count({ where: { ...where, status: "EXPIRED" } }),
      prisma.complianceRule.findMany({ where: { ...where, active: true } }),
    ]);

    const criticalIssues = [];
    const warnings = [];

    if (expiredDocs > 0)
      criticalIssues.push(
        `${expiredDocs} expired document(s) — immediate renewal required`,
      );
    if (expiredVisas > 0)
      criticalIssues.push(
        `${expiredVisas} expired visa(s) — immigration violation risk`,
      );
    if (expiredContracts > 0)
      criticalIssues.push(
        `${expiredContracts} expired contract(s) — legal exposure`,
      );
    if (expiringDocs30 > 0)
      warnings.push(`${expiringDocs30} document(s) expiring within 30 days`);
    if (expiringVisas60 > 0)
      warnings.push(`${expiringVisas60} visa(s) expiring within 60 days`);

    const complianceScore = Math.max(
      0,
      100 - criticalIssues.length * 20 - warnings.length * 5,
    );

    return {
      type: "HR_COMPLIANCE",
      data: JSON.stringify({
        complianceScore: `${complianceScore}/100`,
        status:
          complianceScore >= 80
            ? "✅ Compliant"
            : complianceScore >= 60
              ? "⚠️ Needs Attention"
              : "🚨 Non-Compliant",
        criticalIssues,
        warnings,
        activeComplianceRules: complianceRules.length,
        requiredPolicies: COMPLIANCE_POLICIES,
        auditChecklist: [
          {
            item: "All employee documents valid",
            status: expiredDocs === 0 ? "✅" : "❌",
          },
          {
            item: "All visas/permits active",
            status: expiredVisas === 0 ? "✅" : "❌",
          },
          {
            item: "All contracts current",
            status: expiredContracts === 0 ? "✅" : "❌",
          },
          {
            item: "Compliance rules configured",
            status: complianceRules.length > 0 ? "✅" : "⚠️",
          },
          {
            item: "No documents expiring within 30 days",
            status: expiringDocs30 === 0 ? "✅" : "⚠️",
          },
          {
            item: "No visas expiring within 60 days",
            status: expiringVisas60 === 0 ? "✅" : "⚠️",
          },
        ],
      }),
    };
  } catch (error) {
    console.error("HR Compliance agent error:", error);
    return {
      type: "HR_COMPLIANCE",
      data: JSON.stringify({
        complianceScore: "Advisory mode",
        status:
          "⚠️ Live compliance records are unavailable, showing the standard checklist.",
        criticalIssues: [
          "Validate expired documents, visas, contracts, and rule ownership once the database is online.",
        ],
        warnings: [
          "Review items due within the next 30–60 days.",
          "Confirm policy owners and audit cadence for each HR control area.",
        ],
        activeComplianceRules: "N/A",
        requiredPolicies: COMPLIANCE_POLICIES,
        auditChecklist: [
          { item: "All employee documents valid", status: "Review manually" },
          { item: "All visas/permits active", status: "Review manually" },
          { item: "All contracts current", status: "Review manually" },
          { item: "Compliance rules configured", status: "Review manually" },
        ],
      }),
    };
  }
}
