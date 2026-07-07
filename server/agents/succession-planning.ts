import { prisma } from "@/lib/prisma";

// 9-box grid classification based on service years and position level
function classify9Box(
  serviceYears: number,
  position: string | null,
): { box: string; label: string; action: string } {
  const pos = (position ?? "").toLowerCase();
  const isLeadership = [
    "manager",
    "director",
    "head",
    "supervisor",
    "lead",
  ].some((k) => pos.includes(k));
  const isSenior = serviceYears >= 5;

  if (isLeadership && isSenior)
    return {
      box: "9",
      label: "Star — High Potential / High Performance",
      action: "Accelerate development, succession candidate",
    };
  if (isLeadership && !isSenior)
    return {
      box: "8",
      label: "High Potential — Developing Leader",
      action: "Mentoring, stretch assignments",
    };
  if (!isLeadership && isSenior)
    return {
      box: "6",
      label: "Solid Performer — High Performance",
      action: "Retain, consider promotion path",
    };
  if (serviceYears >= 2)
    return {
      box: "5",
      label: "Core Contributor",
      action: "Develop skills, monitor growth",
    };
  return {
    box: "2",
    label: "New / Developing",
    action: "Onboarding support, early assessment",
  };
}

export async function successionPlanningAgent(
  input: string,
  tenantId?: string,
) {
  try {
    const where = tenantId ? { tenantId } : {};

    const employees = await prisma.employee.findMany({
      where,
      include: {
        contracts: { where: { status: "ACTIVE" }, take: 1 },
      },
      take: 20,
      orderBy: { hireDate: "asc" },
    });

    const talentMap = employees.map((emp) => {
      const serviceYears = emp.hireDate
        ? Math.floor(
            (Date.now() - emp.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365),
          )
        : 0;
      const grid = classify9Box(serviceYears, emp.position);
      const retentionRisk =
        serviceYears < 1 ? "High" : serviceYears < 3 ? "Medium" : "Low";

      return {
        name: emp.name,
        position: emp.position ?? "Unknown",
        department: emp.department ?? "Unknown",
        serviceYears,
        talentGrid: grid,
        retentionRisk,
      };
    });

    const highPotential = talentMap.filter((e) =>
      ["8", "9"].includes(e.talentGrid.box),
    );
    const highRisk = talentMap.filter((e) => e.retentionRisk === "High");

    return {
      type: "SUCCESSION_PLANNING",
      data: JSON.stringify({
        summary: {
          totalMapped: talentMap.length,
          highPotentialCount: highPotential.length,
          highRetentionRiskCount: highRisk.length,
        },
        highPotentialEmployees: highPotential.map((e) => ({
          name: e.name,
          position: e.position,
          department: e.department,
          gridLabel: e.talentGrid.label,
          recommendedAction: e.talentGrid.action,
        })),
        retentionRisks: highRisk.map((e) => ({
          name: e.name,
          position: e.position,
          serviceYears: e.serviceYears,
          risk: e.retentionRisk,
        })),
        fullTalentMap: talentMap,
      }),
    };
  } catch (error) {
    console.error("Succession planning agent error:", error);
    return {
      type: "SUCCESSION_PLANNING",
      data: JSON.stringify({
        summary: {
          totalMapped: "N/A",
          highPotentialCount: "Review leadership bench manually",
          highRetentionRiskCount:
            "Review employees with < 1 year service or critical roles",
        },
        highPotentialEmployees: [],
        retentionRisks: [],
        fullTalentMap: [],
        recommendedActions: [
          "Review critical roles and assign at least one ready-now successor.",
          "Use a 9-box review during talent calibration sessions.",
          "Monitor retention risk for new joiners and key specialists quarterly.",
        ],
      }),
    };
  }
}
