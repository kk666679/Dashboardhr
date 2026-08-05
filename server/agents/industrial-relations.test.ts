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

import { industrialRelationsAgent } from "./industrial-relations";

describe("industrialRelationsAgent", () => {
  beforeEach(() => {
    employeeMock.mockReset();
    contractMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("computes notice period from service years", async () => {
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Mei",
      position: "Operator",
      department: "Factory",
      hireDate: new Date("2015-01-01"),
      tenantId: "tenant-a",
    });
    contractMock.mockResolvedValue({
      type: "PERMANENT",
      startDate: new Date("2015-01-01"),
      status: "ACTIVE",
      salary: 3000,
    });

    const result = await industrialRelationsAgent(
      "dismissal",
      "tenant-a",
      "emp-1",
    );
    const data = JSON.parse(result.data);

    expect(result.type).toBe("INDUSTRIAL_RELATIONS");
    expect(data.noticePeriod).toContain("8 weeks");
  });

  it("scopes contract query by tenant", async () => {
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Mei",
      position: "Operator",
      department: "Factory",
      hireDate: new Date("2015-01-01"),
      tenantId: "tenant-a",
    });
    contractMock.mockResolvedValue(null);

    await industrialRelationsAgent("dispute", "tenant-a", "emp-1");

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

  it("returns fallback when employee not found", async () => {
    employeeMock.mockResolvedValue(null);

    const result = await industrialRelationsAgent("union", "tenant-a");
    const data = JSON.parse(result.data);

    expect(data.employee).toBeNull();
    expect(data.domesticInquirySteps.length).toBeGreaterThan(0);
  });
});
