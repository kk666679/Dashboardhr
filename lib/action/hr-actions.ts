"use server";

import { prisma } from "@/lib/prisma";

function getPayrollFallback(employeeName = "this employee") {
  return `Payroll guidance for ${employeeName}: verify the payroll cutoff, approved attendance/overtime claims, EPF 11%, SOCSO, EIS, PCB deductions, and bank file release status. If a live payslip is unavailable, payroll may still be pending final approval.`;
}

function getImmigrationFallback(employeeName = "this employee") {
  return `${employeeName} immigration guidance: confirm passport validity (minimum 18 months), active PLKS/EP/pass details, FOMEMA fit status, levy payment, insurance cover, and submit renewals 30–60 days before expiry.`;
}

export async function getPayrollInfo(employeeId?: string) {
  try {
    const employee = employeeId
      ? await prisma.employee.findUnique({ where: { id: employeeId } })
      : await prisma.employee.findFirst();

    if (!employee) {
      return getPayrollFallback();
    }

    const latestPayroll = await prisma.payroll.findFirst({
      where: { employeeId: employee.id },
      orderBy: { periodEnd: "desc" },
      include: {
        employee: {
          select: { name: true },
        },
      },
    });

    if (!latestPayroll) {
      return `No payroll records were found for ${employee.name}. Salary processing may still be pending. ${getPayrollFallback(employee.name)}`;
    }

    const netSalary = parseFloat(latestPayroll.netSalary.toString());
    const status = latestPayroll.status;
    const periodEnd = latestPayroll.periodEnd.toLocaleDateString();

    return `Latest payroll for ${employee.name}: RM${netSalary.toFixed(2)} (${status}) - Processed on ${periodEnd}`;
  } catch (error) {
    console.error("Payroll server action error:", error);
    return getPayrollFallback();
  }
}

export async function getLeaveInfo(employeeId?: string) {
  try {
    const empId = employeeId || "default-employee-id";

    // Import here to avoid client-side issues
    const { getLeaveBalance } =
      await import("@/components/features/employee/ess/ess-service");

    const leaveBalances = await getLeaveBalance(empId);

    if (!leaveBalances || leaveBalances.length === 0) {
      return "No leave balance information available.";
    }

    const summary = leaveBalances
      .map(
        (lb) =>
          `${lb.leaveType}: ${lb.available} days available (${lb.used} used, ${lb.pending} pending)`,
      )
      .join(" | ");

    return `Leave balances: ${summary}`;
  } catch (error) {
    console.error("Leave server action error:", error);
    return "Unable to retrieve leave information. Please try again later.";
  }
}

export async function getImmigrationInfo(employeeId?: string) {
  try {
    const employee = employeeId
      ? await prisma.employee.findUnique({ where: { id: employeeId } })
      : await prisma.employee.findFirst();

    if (!employee) {
      return getImmigrationFallback();
    }

    const visas = await prisma.visa.findMany({
      where: {
        employeeId: employee.id,
        status: "ACTIVE",
      },
      orderBy: { expiryDate: "desc" },
    });

    if (!visas || visas.length === 0) {
      return `${employee.name} has no active permits or visas on record. ${getImmigrationFallback(employee.name)}`;
    }

    const visaInfo = visas
      .map((visa) => {
        const expiryDate = visa.expiryDate.toLocaleDateString();
        const daysUntilExpiry = Math.ceil(
          (visa.expiryDate.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24),
        );
        const status = daysUntilExpiry < 30 ? "⚠️ Expires soon" : "✅ Valid";

        return `${visa.type} (${visa.country}): ${status} - Expires ${expiryDate} (${daysUntilExpiry} days)`;
      })
      .join(" | ");

    return `${employee.name}'s permits: ${visaInfo}`;
  } catch (error) {
    console.error("Immigration server action error:", error);
    return getImmigrationFallback();
  }
}

export async function getRecruitmentInfo() {
  try {
    const openPositions = [
      { title: "Software Engineer", department: "IT", count: 3 },
      { title: "Project Manager", department: "Operations", count: 1 },
      { title: "HR Specialist", department: "Human Resources", count: 2 },
      { title: "Accountant", department: "Finance", count: 1 },
      { title: "Marketing Coordinator", department: "Marketing", count: 1 },
    ];

    const totalPositions = openPositions.reduce(
      (sum, pos) => sum + pos.count,
      0,
    );
    const summary = openPositions
      .map((pos) => `${pos.title} (${pos.department}): ${pos.count}`)
      .join(" | ");

    return `Open positions: ${totalPositions} total - ${summary}`;
  } catch (error) {
    console.error("Recruitment server action error:", error);
    return "Unable to retrieve recruitment information. Please try again later.";
  }
}
