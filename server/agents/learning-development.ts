import { prisma } from "@/lib/prisma";

const TRAINING_CATALOG: Record<string, string[]> = {
  "Human Resources": [
    "Employment Act 1955 Compliance",
    "HRMS Operations",
    "Payroll Processing",
    "Foreign Worker Management",
  ],
  Manufacturing: [
    "OSH Act Compliance",
    "Lean Manufacturing",
    "Quality Management (ISO 9001)",
    "Machine Safety",
  ],
  Finance: [
    "SST Filing",
    "LHDN e-Filing",
    "Financial Reporting",
    "Budget Planning",
  ],
  Operations: [
    "Project Management",
    "SOP Development",
    "Supply Chain Basics",
    "KPI Setting",
  ],
  default: [
    "Communication Skills",
    "Microsoft Office",
    "Time Management",
    "Customer Service",
  ],
};

export async function learningDevelopmentAgent(
  input: string,
  employeeId?: string,
) {
  try {
    const employee = employeeId
      ? await prisma.employee.findUnique({ where: { id: employeeId } })
      : await prisma.employee.findFirst();

    const dept = employee?.department ?? "default";
    const catalog = TRAINING_CATALOG[dept] ?? TRAINING_CATALOG.default;

    return {
      type: "LEARNING_DEVELOPMENT",
      data: JSON.stringify({
        employee: employee
          ? {
              name: employee.name,
              position: employee.position,
              department: employee.department,
            }
          : null,
        recommendedTraining: catalog,
        careerPath: {
          current: employee?.position ?? "Unknown",
          nextLevel: "Senior / Supervisory role (12–24 months)",
          keyCompetencies: [
            "Leadership",
            "Technical expertise",
            "Cross-functional collaboration",
          ],
        },
        hrdc: {
          eligible: true,
          note: "Training costs claimable via HRDC (Human Resources Development Corporation) levy fund",
          portal: "https://www.hrdc.com.my",
        },
      }),
    };
  } catch (error) {
    console.error("L&D agent error:", error);
    return {
      type: "LEARNING_DEVELOPMENT",
      data: JSON.stringify({
        employee: null,
        recommendedTraining: TRAINING_CATALOG.default,
        careerPath: {
          current: "Current role not available",
          nextLevel: "Senior / Supervisory role (12–24 months)",
          keyCompetencies: [
            "Leadership",
            "Technical expertise",
            "Cross-functional collaboration",
          ],
        },
        hrdc: {
          eligible: true,
          note: "Training costs are typically claimable via HRDC levy subject to employer eligibility and course approval.",
          portal: "https://www.hrdc.com.my",
        },
        actionPlan: [
          "Prioritize compliance, payroll, communication, and supervisory training first.",
          "Review skill gaps with line managers each quarter.",
          "Track attendance and post-training impact before the next appraisal cycle.",
        ],
      }),
    };
  }
}
