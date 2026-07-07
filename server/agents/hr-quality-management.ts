import { prisma } from "@/lib/prisma";

const QUALITY_STANDARDS = [
  {
    area: "Employee Master Data",
    standard:
      "Employee records should include department, position, hire date, and required identity details.",
    target: "≥ 98% completeness",
  },
  {
    area: "Document Control",
    standard:
      "Workers should have current supporting documents with timely renewal tracking.",
    target: "0 critical gaps",
  },
  {
    area: "Payroll Timeliness",
    standard: "Payroll should be processed on time with minimal pending items.",
    target: "100% on schedule",
  },
  {
    area: "Attendance Discipline",
    standard:
      "Late and absent exceptions should stay within operational thresholds.",
    target: "< 5% exception rate",
  },
  {
    area: "Continuous Improvement",
    standard: "Compliance rules and HR controls should be reviewed regularly.",
    target: "Quarterly review cadence",
  },
] as const;

export async function hrQualityManagementAgent(
  input: string,
  tenantId?: string,
) {
  try {
    const where = tenantId ? { tenantId } : {};
    const now = new Date();
    const in30Days = new Date(Date.now() + 30 * 86400000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalEmployees,
      incompleteProfiles,
      employeesWithoutDocuments,
      foreignWorkersWithoutActiveVisa,
      pendingPayrolls,
      attendanceThisMonth,
      expiringDocuments,
      activeComplianceRules,
    ] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.count({
        where: {
          ...where,
          OR: [
            { department: null },
            { position: null },
            { hireDate: null },
            { isForeign: true, nationality: null },
          ],
        },
      }),
      prisma.employee.count({
        where: {
          ...where,
          documents: { none: {} },
        },
      }),
      prisma.employee.count({
        where: {
          ...where,
          isForeign: true,
          visas: { none: { status: "ACTIVE" } },
        },
      }),
      prisma.payroll.count({ where: { ...where, status: "PENDING" } }),
      prisma.attendance.findMany({
        where: {
          ...where,
          date: { gte: monthStart },
        },
        select: { status: true },
      }),
      prisma.document.count({
        where: {
          ...where,
          expiryDate: { gte: now, lte: in30Days },
          status: { not: "EXPIRED" },
        },
      }),
      prisma.complianceRule.count({ where: { ...where, active: true } }),
    ]);

    const lateCount = attendanceThisMonth.filter(
      (record: { status: string }) => record.status === "LATE",
    ).length;
    const absentCount = attendanceThisMonth.filter(
      (record: { status: string }) => record.status === "ABSENT",
    ).length;
    const totalAttendanceRecords = attendanceThisMonth.length;
    const exceptionRate =
      totalAttendanceRecords > 0
        ? Number(
            (
              ((lateCount + absentCount) / totalAttendanceRecords) *
              100
            ).toFixed(1),
          )
        : 0;

    const criticalFindings: string[] = [];
    const improvementAreas: string[] = [];

    if (foreignWorkersWithoutActiveVisa > 0) {
      criticalFindings.push(
        `${foreignWorkersWithoutActiveVisa} foreign worker profile(s) have no active visa on record.`,
      );
    }

    if (pendingPayrolls > 0) {
      criticalFindings.push(
        `${pendingPayrolls} payroll record(s) are still pending processing.`,
      );
    }

    if (incompleteProfiles > 0) {
      improvementAreas.push(
        `${incompleteProfiles} employee profile(s) are missing key HR data fields.`,
      );
    }

    if (employeesWithoutDocuments > 0) {
      improvementAreas.push(
        `${employeesWithoutDocuments} employee record(s) have no supporting documents attached.`,
      );
    }

    if (expiringDocuments > 0) {
      improvementAreas.push(
        `${expiringDocuments} document(s) will expire within the next 30 days.`,
      );
    }

    if (exceptionRate > 5) {
      improvementAreas.push(
        `Attendance exception rate is ${exceptionRate}% which is above the 5% quality threshold.`,
      );
    }

    const qualityScore = Math.max(
      0,
      100 -
        criticalFindings.length * 15 -
        improvementAreas.length * 6 -
        (activeComplianceRules === 0 ? 10 : 0),
    );

    const status =
      qualityScore >= 85
        ? "✅ Controlled"
        : qualityScore >= 70
          ? "⚠️ Improvement Needed"
          : "🚨 Escalate Review";

    return {
      type: "HR_QUALITY_MANAGEMENT",
      data: JSON.stringify({
        qualityScore: `${qualityScore}/100`,
        status,
        processHealth: {
          totalEmployees,
          pendingPayrolls,
          attendanceExceptionRate: `${exceptionRate}%`,
          activeComplianceRules,
        },
        dataQuality: {
          incompleteProfiles,
          employeesWithoutDocuments,
          foreignWorkersWithoutActiveVisa,
          expiringDocuments30Days: expiringDocuments,
        },
        criticalFindings,
        improvementAreas,
        standards: QUALITY_STANDARDS,
        recommendedActions: [
          "Run a monthly HR data completeness review for employee master records.",
          "Track document renewals with 30/60/90-day alerts and clear ownership.",
          "Escalate pending payroll items before payroll cutoff to avoid service delays.",
          "Use CAPA reviews for recurring attendance or documentation issues.",
        ],
      }),
    };
  } catch (error) {
    console.error("HR Quality Management agent error:", error);
    return {
      type: "HR_QUALITY_MANAGEMENT",
      data: JSON.stringify({
        qualityScore: "Advisory mode",
        status:
          "⚠️ Live HR quality metrics are unavailable, showing the standard scorecard.",
        processHealth: {
          totalEmployees: "N/A",
          pendingPayrolls: "Review payroll queue manually",
          attendanceExceptionRate: "Review attendance dashboard manually",
          activeComplianceRules: "N/A",
        },
        dataQuality: {
          incompleteProfiles: "Review employee master data completeness",
          employeesWithoutDocuments: "Review document-control backlog",
          foreignWorkersWithoutActiveVisa:
            "Verify immigration records manually",
          expiringDocuments30Days: "Review 30-day document expiry list",
        },
        criticalFindings: [
          "Confirm visa validity, payroll cutoff items, and document renewals in the next review cycle.",
        ],
        improvementAreas: [
          "Run a monthly HR data completeness review.",
          "Set 30/60/90-day document renewal alerts with clear owners.",
          "Use CAPA reviews for recurring attendance or documentation exceptions.",
        ],
        standards: QUALITY_STANDARDS,
        recommendedActions: [
          "Review SOP adherence for onboarding, payroll, leave, and document control.",
          "Track service turnaround time and error recurrence by process owner.",
          "Escalate repeated exceptions through CAPA before the next audit.",
        ],
      }),
    };
  }
}
