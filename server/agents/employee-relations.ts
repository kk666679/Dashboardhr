import { prisma } from "@/lib/prisma";

const LETTER_TEMPLATES = {
  warning: "Warning Letter (First/Second/Final)",
  showcause: "Show Cause Letter",
  confirmation: "Employment Confirmation Letter",
  termination: "Termination Letter (with notice)",
  offer: "Offer Letter",
};

export async function employeeRelationsAgent(
  input: string,
  employeeId?: string,
) {
  try {
    const employee = employeeId
      ? await prisma.employee.findUnique({ where: { id: employeeId } })
      : await prisma.employee.findFirst();

    const contract = employee
      ? await prisma.contract.findFirst({
          where: { employeeId: employee.id, status: "ACTIVE" },
          orderBy: { startDate: "desc" },
        })
      : null;

    return {
      type: "EMPLOYEE_RELATIONS",
      data: JSON.stringify({
        employee: employee
          ? {
              name: employee.name,
              position: employee.position,
              department: employee.department,
              hireDate: employee.hireDate,
            }
          : null,
        contract: contract
          ? {
              type: contract.type,
              startDate: contract.startDate,
              salary: `RM${parseFloat(contract.salary.toString()).toLocaleString()}`,
            }
          : null,
        availableLetters: LETTER_TEMPLATES,
        legalReferences: {
          employmentAct: "Employment Act 1955 (Act 265)",
          industrialRelations: "Industrial Relations Act 1967 (Act 177)",
          noticePeriod:
            "S.12 Employment Act — 4 weeks (< 2 yrs service), 6 weeks (2–5 yrs), 8 weeks (> 5 yrs)",
          misconduct:
            "S.14 Employment Act — domestic inquiry required before dismissal",
        },
      }),
    };
  } catch (error) {
    console.error("Employee relations agent error:", error);
    return {
      type: "EMPLOYEE_RELATIONS",
      data: JSON.stringify({
        employee: null,
        contract: null,
        availableLetters: LETTER_TEMPLATES,
        legalReferences: {
          employmentAct: "Employment Act 1955 (Act 265)",
          industrialRelations: "Industrial Relations Act 1967 (Act 177)",
          noticePeriod:
            "S.12 Employment Act — 4 weeks (< 2 yrs service), 6 weeks (2–5 yrs), 8 weeks (> 5 yrs)",
          misconduct:
            "S.14 Employment Act — domestic inquiry required before dismissal",
        },
        guidance: [
          "Document facts, dates, witnesses, and prior counselling before issuing any letter.",
          "Use progressive discipline unless the misconduct is serious enough for immediate investigation.",
          "Follow the domestic inquiry process before dismissal for misconduct cases.",
        ],
      }),
    };
  }
}
