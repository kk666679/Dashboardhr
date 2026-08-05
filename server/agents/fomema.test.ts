import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { employeeMock, documentMock } = vi.hoisted(() => ({
  employeeMock: vi.fn(),
  documentMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: {
      findUnique: employeeMock,
      findFirst: employeeMock,
    },
    document: {
      findFirst: documentMock,
    },
  },
}));

import { fomemaAgent } from "./fomema";

describe("fomemaAgent", () => {
  beforeEach(() => {
    employeeMock.mockReset();
    documentMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns guidance when no employee exists in the tenant", async () => {
    employeeMock.mockResolvedValue(null);

    const result = await fomemaAgent("status", "tenant-a");

    expect(result.type).toBe("FOMEMA");
    expect(result.data).toContain("FOMEMA guidance");
  });

  it("scopes employee lookup by tenantId", async () => {
    employeeMock.mockResolvedValue(null);

    await fomemaAgent("status", "tenant-a");

    expect(employeeMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { tenantId: "tenant-a" } }),
    );
  });

  it("returns no-certificate message when employee exists but no document", async () => {
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Ali",
      tenantId: "tenant-a",
    });
    documentMock.mockResolvedValue(null);

    const result = await fomemaAgent("status", "tenant-a");

    expect(result.data).toContain("No FOMEMA certificate on record for Ali");
  });

  it("returns valid status when certificate is far from expiry", async () => {
    const future = new Date(Date.now() + 90 * 86400000);
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Ali",
      tenantId: "tenant-a",
    });
    documentMock.mockResolvedValue({
      status: "VALID",
      expiryDate: future,
    });

    const result = await fomemaAgent("status", "tenant-a");

    expect(result.data).toContain("✅ Valid");
  });

  it("returns expiring-soon status when certificate expires within 30 days", async () => {
    const near = new Date(Date.now() + 10 * 86400000);
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Ali",
      tenantId: "tenant-a",
    });
    documentMock.mockResolvedValue({
      status: "VALID",
      expiryDate: near,
    });

    const result = await fomemaAgent("status", "tenant-a");

    expect(result.data).toContain("⚠️ Expiring soon");
  });

  it("uses the provided employeeId in findUnique", async () => {
    employeeMock.mockResolvedValue(null);

    await fomemaAgent("status", "tenant-a", "emp-9");

    expect(employeeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "emp-9", tenantId: "tenant-a" },
      }),
    );
  });
});
