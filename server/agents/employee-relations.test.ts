import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { employeeMock, contractMock } = vi.hoisted(() => ({
  employeeMock: vi.fn(),
  contractMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: {
      findUnique: employeeMock,
      findFirst: employeeMock,
    },
    contract: {
      findFirst: contractMock,
    },
  },
}));

import { employeeRelationsAgent } from "./employee-relations";

describe("employeeRelationsAgent", () => {
  beforeEach(() => {
    employeeMock.mockReset();
    contractMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns employee and contract data when present", async () => {
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Siti",
      position: "HR Executive",
      department: "HR",
      hireDate: new Date("2020-01-01"),
      tenantId: "tenant-a",
    });
    contractMock.mockResolvedValue({
      type: "PERMANENT",
      startDate: new Date("2020-01-01"),
      salary: 5000,
    });

    const result = await employeeRelationsAgent(
      "warning letter",
      "tenant-a",
      "emp-1",
    );
    const data = JSON.parse(result.data);

    expect(result.type).toBe("EMPLOYEE_RELATIONS");
    expect(data.employee.name).toBe("Siti");
    expect(data.contract.salary).toContain("5,000");
  });

  it("scopes contract query by employee and tenant", async () => {
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Siti",
      position: "HR",
      department: "HR",
      hireDate: new Date("2020-01-01"),
      tenantId: "tenant-a",
    });
    contractMock.mockResolvedValue(null);

    await employeeRelationsAgent("termination", "tenant-a", "emp-1");

    expect(contractMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          employeeId: "emp-1",
          tenantId: "tenant-a",
          status: "ACTIVE",
        },
      }),
    );
  });

  it("returns null contract fields when no contract exists", async () => {
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Siti",
      position: "HR",
      department: "HR",
      hireDate: new Date("2020-01-01"),
      tenantId: "tenant-a",
    });
    contractMock.mockResolvedValue(null);

    const result = await employeeRelationsAgent("letter", "tenant-a");
    const data = JSON.parse(result.data);

    expect(data.contract).toBeNull();
    expect(data.availableLetters.warning).toContain("Warning Letter");
  });

  it("returns null employee fields when no employee found", async () => {
    employeeMock.mockResolvedValue(null);

    const result = await employeeRelationsAgent("termination", "tenant-a");
    const data = JSON.parse(result.data);

    expect(data.employee).toBeNull();
    expect(data.contract).toBeNull();
    expect(data.availableLetters.termination).toContain("Termination Letter");
  });
});
