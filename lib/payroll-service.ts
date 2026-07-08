import { prisma } from "@/lib/prisma";
import { Decimal } from "decimal.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _PrismaDecimal = { toNumber: () => number };

export interface PayrollConfig {
  tenantId: string;
  basicSalary: number;
  allowances?: {
    housing?: number;
    transportation?: number;
    education?: number;
    hardship?: number;
    cola?: number; // Cost of Living Allowance
  };
  deductions?: {
    socialSecurity?: number;
    tax?: number;
    insurance?: number;
    loanRecovery?: number;
  };
}

export interface PayslipData {
  employeeId: string;
  periodStart: Date;
  periodEnd: Date;
  basicSalary: number;
  grossAllowances: number;
  totalGross: number;
  totalDeductions: number;
  netSalary: number;
  currency: string;
  generatedAt: Date;
}

export async function calculateSalary(config: PayrollConfig): Promise<{
  basicSalary: number;
  totalAllowances: number;
  totalGross: number;
  totalDeductions: number;
  netSalary: number;
}> {
  const basic = new Decimal(config.basicSalary);

  const allowances = config.allowances || {};
  let totalAllowances = new Decimal(0);
  totalAllowances = totalAllowances.add(allowances.housing || 0);
  totalAllowances = totalAllowances.add(allowances.transportation || 0);
  totalAllowances = totalAllowances.add(allowances.education || 0);
  totalAllowances = totalAllowances.add(allowances.hardship || 0);
  totalAllowances = totalAllowances.add(allowances.cola || 0);

  const totalGross = basic.add(totalAllowances);

  const deductions = config.deductions || {};
  let totalDeductions = new Decimal(0);
  totalDeductions = totalDeductions.add(deductions.socialSecurity || 0);
  totalDeductions = totalDeductions.add(deductions.tax || 0);
  totalDeductions = totalDeductions.add(deductions.insurance || 0);
  totalDeductions = totalDeductions.add(deductions.loanRecovery || 0);

  const netSalary = totalGross.sub(totalDeductions);

  return {
    basicSalary: +basic.toString(),
    totalAllowances: +totalAllowances.toString(),
    totalGross: +totalGross.toString(),
    totalDeductions: +totalDeductions.toString(),
    netSalary: +netSalary.toString(),
  };
}

export async function createPayroll(data: {
  employeeId: string;
  tenantId: string;
  periodStart: Date;
  periodEnd: Date;
  basicSalary: number;
  allowances?: number;
  deductions?: number;
}) {
  const calculation = await calculateSalary({
    tenantId: data.tenantId,
    basicSalary: data.basicSalary,
    allowances: {
      housing: data.allowances ? Math.floor(data.allowances / 2) : 0,
      transportation: data.allowances ? Math.ceil(data.allowances / 2) : 0,
    },
    deductions: {
      socialSecurity: data.deductions ? Math.floor(data.deductions * 0.4) : 0,
      tax: data.deductions ? Math.floor(data.deductions * 0.3) : 0,
      insurance: data.deductions ? Math.ceil(data.deductions * 0.3) : 0,
    },
  });

  return await prisma.payroll.create({
    data: {
      employeeId: data.employeeId,
      tenantId: data.tenantId,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      basicSalary: new Decimal(calculation.basicSalary),
      allowances: new Decimal(calculation.totalAllowances),
      deductions: new Decimal(calculation.totalDeductions),
      netSalary: new Decimal(calculation.netSalary),
      status: "PENDING",
    },
  });
}

export async function processPayroll(payrollId: string) {
  return await prisma.payroll.update({
    where: { id: payrollId },
    data: {
      status: "PROCESSED",
      updatedAt: new Date(),
    },
  });
}

export async function generatePayslip(
  payrollId: string,
): Promise<PayslipData | null> {
  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    include: {
      employee: true,
    },
  });

  if (!payroll) return null;

  return {
    employeeId: payroll.employeeId,
    periodStart: payroll.periodStart,
    periodEnd: payroll.periodEnd,
    basicSalary: +payroll.basicSalary.toString(),
    grossAllowances: 0,
    totalGross: +payroll.basicSalary.add(payroll.deductions).toString(),
    totalDeductions: +payroll.deductions.toString(),
    netSalary: +payroll.netSalary.toString(),
    currency: "MYR", // Default to Malaysian Ringgit
    generatedAt: new Date(),
  };
}

export async function getPayrollsByEmployee(
  employeeId: string,
  tenantId: string,
  limit: number = 12,
) {
  return await prisma.payroll.findMany({
    where: { employeeId, tenantId },
    orderBy: { periodEnd: "desc" },
    take: limit,
  });
}

export async function getPayrollById(payrollId: string, tenantId: string) {
  return await prisma.payroll.findFirst({
    where: { id: payrollId, tenantId },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getPayrollsByTenant(
  tenantId: string,
  filters?: {
    status?: "PENDING" | "PROCESSED" | "PAID";
    periodStart?: Date;
    periodEnd?: Date;
  },
) {
  return await prisma.payroll.findMany({
    where: {
      tenantId,
      ...(filters?.status && { status: filters.status }),
      ...(filters?.periodStart && {
        periodEnd: { gte: filters.periodStart },
      }),
      ...(filters?.periodEnd && {
        periodStart: { lte: filters.periodEnd },
      }),
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { periodEnd: "desc" },
  });
}
