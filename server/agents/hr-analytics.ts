import { prisma } from "@/lib/prisma";

export async function hrAnalyticsAgent(input: string, tenantId?: string) {
  try {
    const where = tenantId ? { tenantId } : {};

    const [
      totalEmployees,
      foreignWorkers,
      activeContracts,
      expiringVisas,
      pendingPayrolls,
      attendanceThisMonth,
    ] = await Promise.all([
      prisma.employee.count({ where }),
      prisma.employee.count({ where: { ...where, isForeign: true } }),
      prisma.contract.count({ where: { ...where, status: "ACTIVE" } }),
      prisma.visa.count({
        where: {
          ...where,
          status: "ACTIVE",
          expiryDate: { lte: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.payroll.count({ where: { ...where, status: "PENDING" } }),
      prisma.attendance.findMany({
        where: {
          ...where,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        select: { status: true },
      }),
    ]);

    const presentCount = attendanceThisMonth.filter(
      (a) => a.status === "PRESENT",
    ).length;
    const absentCount = attendanceThisMonth.filter(
      (a) => a.status === "ABSENT",
    ).length;
    const lateCount = attendanceThisMonth.filter(
      (a) => a.status === "LATE",
    ).length;
    const totalRecords = attendanceThisMonth.length;
    const attendanceRate =
      totalRecords > 0
        ? ((presentCount / totalRecords) * 100).toFixed(1)
        : "N/A";
    const absenteeismRate =
      totalRecords > 0
        ? ((absentCount / totalRecords) * 100).toFixed(1)
        : "N/A";

    return {
      type: "HR_ANALYTICS",
      data: JSON.stringify({
        headcount: {
          total: totalEmployees,
          foreign: foreignWorkers,
          local: totalEmployees - foreignWorkers,
          activeContracts,
        },
        compliance: {
          expiringVisas60Days: expiringVisas,
          pendingPayrolls,
        },
        attendance: {
          recordsThisMonth: totalRecords,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          attendanceRate: `${attendanceRate}%`,
          absenteeismRate: `${absenteeismRate}%`,
        },
        insights: [
          expiringVisas > 0
            ? `⚠️ ${expiringVisas} visa(s) expiring within 60 days — action required`
            : "✅ No visas expiring soon",
          pendingPayrolls > 0
            ? `⚠️ ${pendingPayrolls} payroll(s) pending processing`
            : "✅ All payrolls processed",
          parseFloat(absenteeismRate) > 5
            ? `⚠️ Absenteeism rate ${absenteeismRate}% exceeds 5% threshold`
            : `✅ Absenteeism rate ${absenteeismRate}% within acceptable range`,
        ],
      }),
    };
  } catch (error) {
    console.error("HR Analytics agent error:", error);
    return {
      type: "HR_ANALYTICS",
      data: JSON.stringify({
        headcount: {
          total: "N/A",
          foreign: "Review headcount report manually",
          local: "Review headcount report manually",
          activeContracts: "Review active contract list manually",
        },
        compliance: {
          expiringVisas60Days: "Review visa renewal tracker manually",
          pendingPayrolls: "Review payroll queue manually",
        },
        attendance: {
          recordsThisMonth: "N/A",
          attendanceRate: "Review attendance dashboard manually",
          absenteeismRate: "Review absenteeism trend manually",
        },
        insights: [
          "Check visa renewals due in the next 60 days.",
          "Confirm there are no pending payroll batches before cutoff.",
          "Track absenteeism weekly and escalate if it exceeds 5%.",
        ],
      }),
    };
  }
}
