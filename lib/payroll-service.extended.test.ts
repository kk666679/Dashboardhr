/**
 * Extended payroll service tests — createPayroll, processPayroll,
 * generatePayslip, getPayrollById, getPayrollsByTenant.
 *
 * calculateSalary is already covered in payroll-service.test.ts.
 * These tests focus on the DB-interaction paths using a mocked prisma.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    payroll: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { prisma } from "@/lib/prisma";
import {
  createPayroll,
  processPayroll,
  generatePayslip,
  getPayrollById,
  getPayrollsByTenant,
  getPayrollsByEmployee,
} from "./payroll-service";
import { Decimal } from "decimal.js";

const mockCreate = prisma.payroll.create as ReturnType<typeof vi.fn>;
const mockUpdate = prisma.payroll.update as ReturnType<typeof vi.fn>;
const mockFindUnique = prisma.payroll.findUnique as ReturnType<typeof vi.fn>;
const mockFindFirst = prisma.payroll.findFirst as ReturnType<typeof vi.fn>;
const mockFindMany = prisma.payroll.findMany as ReturnType<typeof vi.fn>;

const fakePayroll = (overrides: object = {}) => ({
  id: "pr-1",
  employeeId: "emp-1",
  tenantId: "tenant-a",
  periodStart: new Date("2026-01-01"),
  periodEnd: new Date("2026-01-31"),
  basicSalary: new Decimal(3000),
  allowances: new Decimal(500),
  deductions: new Decimal(300),
  netSalary: new Decimal(3200),
  status: "PENDING",
  employee: { id: "emp-1", name: "Alice", email: "alice@test.com" },
  ...overrides,
});

beforeEach(() => vi.clearAllMocks());

// ─── createPayroll ────────────────────────────────────────────────────────────

describe("createPayroll", () => {
  it("calls prisma.payroll.create with correct tenant scoping", async () => {
    mockCreate.mockResolvedValue(fakePayroll());
    await createPayroll({
      employeeId: "emp-1",
      tenantId: "tenant-a",
      periodStart: new Date("2026-01-01"),
      periodEnd: new Date("2026-01-31"),
      basicSalary: 3000,
    });
    expect(mockCreate).toHaveBeenCalledOnce();
    const callArg = mockCreate.mock.calls[0][0].data;
    expect(callArg.tenantId).toBe("tenant-a");
    expect(callArg.employeeId).toBe("emp-1");
  });

  it("sets status to PENDING on creation", async () => {
    mockCreate.mockResolvedValue(fakePayroll());
    await createPayroll({
      employeeId: "emp-1",
      tenantId: "tenant-a",
      periodStart: new Date("2026-01-01"),
      periodEnd: new Date("2026-01-31"),
      basicSalary: 3000,
    });
    expect(mockCreate.mock.calls[0][0].data.status).toBe("PENDING");
  });

  it("stores netSalary as Decimal", async () => {
    mockCreate.mockResolvedValue(fakePayroll());
    await createPayroll({
      employeeId: "emp-1",
      tenantId: "tenant-a",
      periodStart: new Date("2026-01-01"),
      periodEnd: new Date("2026-01-31"),
      basicSalary: 3000,
      allowances: 500,
      deductions: 300,
    });
    const data = mockCreate.mock.calls[0][0].data;
    expect(data.netSalary).toBeInstanceOf(Decimal);
  });
});

// ─── processPayroll ───────────────────────────────────────────────────────────

describe("processPayroll", () => {
  it("updates status to PROCESSED", async () => {
    mockUpdate.mockResolvedValue(fakePayroll({ status: "PROCESSED" }));
    const result = await processPayroll("pr-1");
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "pr-1" },
        data: expect.objectContaining({ status: "PROCESSED" }),
      })
    );
    expect((result as any).status).toBe("PROCESSED");
  });
});

// ─── generatePayslip ─────────────────────────────────────────────────────────

describe("generatePayslip", () => {
  it("returns null when payroll not found", async () => {
    mockFindUnique.mockResolvedValue(null);
    const result = await generatePayslip("missing-id");
    expect(result).toBeNull();
  });

  it("returns a PayslipData object for a valid payroll", async () => {
    mockFindUnique.mockResolvedValue(fakePayroll());
    const result = await generatePayslip("pr-1");
    expect(result).not.toBeNull();
    expect(result!.employeeId).toBe("emp-1");
    expect(result!.currency).toBe("MYR");
    expect(typeof result!.netSalary).toBe("number");
  });

  it("queries by payrollId with include employee", async () => {
    mockFindUnique.mockResolvedValue(fakePayroll());
    await generatePayslip("pr-1");
    expect(mockFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "pr-1" },
        include: expect.objectContaining({ employee: true }),
      })
    );
  });
});

// ─── getPayrollById ───────────────────────────────────────────────────────────

describe("getPayrollById", () => {
  it("passes both payrollId and tenantId to where clause", async () => {
    mockFindFirst.mockResolvedValue(fakePayroll());
    await getPayrollById("pr-1", "tenant-a");
    expect(mockFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: "pr-1", tenantId: "tenant-a" }),
      })
    );
  });
});

// ─── getPayrollsByTenant ──────────────────────────────────────────────────────

describe("getPayrollsByTenant", () => {
  it("filters by tenantId", async () => {
    mockFindMany.mockResolvedValue([]);
    await getPayrollsByTenant("tenant-a");
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.tenantId).toBe("tenant-a");
  });

  it("adds status filter when provided", async () => {
    mockFindMany.mockResolvedValue([]);
    await getPayrollsByTenant("tenant-a", { status: "PAID" });
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where.status).toBe("PAID");
  });

  it("does not add status filter when not provided", async () => {
    mockFindMany.mockResolvedValue([]);
    await getPayrollsByTenant("tenant-a");
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where).not.toHaveProperty("status");
  });

  it("orders by periodEnd descending", async () => {
    mockFindMany.mockResolvedValue([]);
    await getPayrollsByTenant("tenant-a");
    const call = mockFindMany.mock.calls[0][0];
    expect(call.orderBy).toEqual({ periodEnd: "desc" });
  });
});

// ─── getPayrollsByEmployee ────────────────────────────────────────────────────

describe("getPayrollsByEmployee", () => {
  it("scopes by both employeeId and tenantId", async () => {
    mockFindMany.mockResolvedValue([]);
    await getPayrollsByEmployee("emp-1", "tenant-a");
    const call = mockFindMany.mock.calls[0][0];
    expect(call.where).toMatchObject({ employeeId: "emp-1", tenantId: "tenant-a" });
  });

  it("defaults limit to 12", async () => {
    mockFindMany.mockResolvedValue([]);
    await getPayrollsByEmployee("emp-1", "tenant-a");
    expect(mockFindMany.mock.calls[0][0].take).toBe(12);
  });

  it("respects custom limit", async () => {
    mockFindMany.mockResolvedValue([]);
    await getPayrollsByEmployee("emp-1", "tenant-a", 6);
    expect(mockFindMany.mock.calls[0][0].take).toBe(6);
  });
});
