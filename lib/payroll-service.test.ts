import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {},
}));

import { calculateSalary } from "./payroll-service";

describe("calculateSalary", () => {
  it("calculates gross, deductions, and net salary", async () => {
    await expect(
      calculateSalary({
        tenantId: "tenant-a",
        basicSalary: 5000,
        allowances: {
          housing: 800,
          transportation: 200,
          education: 100,
          hardship: 50,
          cola: 150,
        },
        deductions: {
          socialSecurity: 60,
          tax: 500,
          insurance: 90,
          loanRecovery: 250,
        },
      }),
    ).resolves.toEqual({
      basicSalary: 5000,
      totalAllowances: 1300,
      totalGross: 6300,
      totalDeductions: 900,
      netSalary: 5400,
    });
  });

  it("defaults missing allowances and deductions to zero", async () => {
    await expect(
      calculateSalary({
        tenantId: "tenant-a",
        basicSalary: 2500,
      }),
    ).resolves.toMatchObject({
      totalAllowances: 0,
      totalDeductions: 0,
      netSalary: 2500,
    });
  });
});
