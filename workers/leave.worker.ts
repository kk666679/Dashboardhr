/**
 * Leave Worker — Sprint 6, Task 6.3
 *
 * Two cron-style BullMQ jobs:
 * 1. Monthly accrual (1st of month 02:00) — applies entitlement policy
 * 2. Year-end (Jan 1 03:00) — apply carry-forward cap + encashment
 *
 * Requirements: 6.4, 6.8
 */

import { Worker, Queue } from "bullmq";
import { Decimal } from "decimal.js";
import IORedis from "ioredis";
import { prisma } from "@/lib/prisma";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

export const leaveQueue = new Queue("leave", { connection });

type LeaveJobType = "monthly-accrual" | "year-end-close";

interface LeaveJob {
  type: LeaveJobType;
  tenantId: string;
  year?: number;
  month?: number;
}

export const leaveWorker = new Worker<LeaveJob>(
  "leave",
  async (job) => {
    const { type, tenantId } = job.data;

    if (type === "monthly-accrual") {
      await runMonthlyAccrual(tenantId);
    }

    if (type === "year-end-close") {
      await runYearEnd(tenantId, job.data.year ?? new Date().getFullYear());
    }
  },
  { connection, concurrency: 2 }
);

/**
 * Req 6.4: Monthly accrual — calculate monthly entitlement for every active employee
 */
async function runMonthlyAccrual(tenantId: string): Promise<void> {
  const year = new Date().getFullYear();

  // Get all active employees with their legal entity
  const employees = await prisma.employee.findMany({
    where: { tenantId, isDeleted: false, employmentStatus: "ACTIVE" },
    select: { id: true, legalEntityId: true, hireDate: true },
  });

  for (const emp of employees) {
    const legalEntityId = emp.legalEntityId ?? "default";

    // Get all leave policies for this legal entity
    const policies = await prisma.leavePolicy.findMany({
      where: { tenantId, legalEntityId, isDeleted: false },
    });

    for (const policy of policies) {
      // Monthly accrual = annualEntitlement / 12 (prorated on hire month)
      const monthlyAccrual = new Decimal(policy.annualEntitlement).div(12).toDecimalPlaces(2);

      await prisma.leaveBalance.upsert({
        where: {
          tenantId_employeeId_leaveType_year: {
            tenantId,
            employeeId: emp.id,
            leaveType: policy.leaveType,
            year,
          },
        },
        update: {
          entitlement: { increment: monthlyAccrual as any },
        },
        create: {
          tenantId,
          employeeId: emp.id,
          leaveType: policy.leaveType,
          year,
          entitlement: monthlyAccrual,
          used: 0,
          pending: 0,
          carryForward: 0,
        },
      });
    }
  }

  console.log(`[leave-worker] Monthly accrual complete for tenant ${tenantId}`);
}

/**
 * Req 6.8: Year-end — apply carry-forward cap + calculate encashment
 */
async function runYearEnd(tenantId: string, closingYear: number): Promise<void> {
  const nextYear = closingYear + 1;

  const balances = await prisma.leaveBalance.findMany({
    where: { tenantId, year: closingYear },
    include: {
      employee: { select: { id: true, legalEntityId: true } },
    },
  });

  for (const balance of balances) {
    const legalEntityId = balance.employee.legalEntityId ?? "default";

    const policy = await prisma.leavePolicy.findUnique({
      where: {
        tenantId_legalEntityId_leaveType: {
          tenantId,
          legalEntityId,
          leaveType: balance.leaveType,
        },
      },
    });

    if (!policy) continue;

    const used = new Decimal(balance.used);
    const entitlement = new Decimal(balance.entitlement).add(balance.carryForward);
    const remaining = entitlement.sub(used).sub(balance.pending);

    // Apply carry-forward cap
    const carryForward = Decimal.min(remaining, policy.carryForwardMax).toDecimalPlaces(2);
    const excessDays = remaining.sub(carryForward);

    // Encashment amount
    const encashmentAmount = excessDays.mul(policy.encashmentRate).toDecimalPlaces(2);

    await prisma.$transaction(async (tx) => {
      // Update closing year balance
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: { carryForward },
      });

      // Create next year balance with carry-forward
      await tx.leaveBalance.upsert({
        where: {
          tenantId_employeeId_leaveType_year: {
            tenantId,
            employeeId: balance.employeeId,
            leaveType: balance.leaveType,
            year: nextYear,
          },
        },
        update: { carryForward: carryForward as any },
        create: {
          tenantId,
          employeeId: balance.employeeId,
          leaveType: balance.leaveType,
          year: nextYear,
          entitlement: 0,
          used: 0,
          pending: 0,
          carryForward,
        },
      });

      // Post encashment to payroll queue if > 0
      if (encashmentAmount.gt(0)) {
        // TODO: enqueue payrollQueue.add('encashment', { employeeId, amount, tenantId })
        console.log(
          `[leave-worker] Encashment: ${balance.employeeId} ${balance.leaveType} = ${encashmentAmount}`
        );
      }
    });
  }

  console.log(`[leave-worker] Year-end close complete for tenant ${tenantId}, year ${closingYear}`);
}

leaveWorker.on("failed", (job, err) => {
  console.error(`[leave-worker] Job failed: ${job?.id}`, err.message);
});

console.log("[leave-worker] Started");
