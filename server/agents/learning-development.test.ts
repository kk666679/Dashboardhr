import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { employeeMock } = vi.hoisted(() => ({
  employeeMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: {
      findUnique: employeeMock,
      findFirst: employeeMock,
    },
  },
}));

import { learningDevelopmentAgent } from "./learning-development";

describe("learningDevelopmentAgent", () => {
  beforeEach(() => {
    employeeMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("recommends department-specific training when employee exists", async () => {
    employeeMock.mockResolvedValue({
      id: "emp-1",
      name: "Raj",
      position: "Engineer",
      department: "Manufacturing",
      tenantId: "tenant-a",
    });

    const result = await learningDevelopmentAgent(
      "training",
      "tenant-a",
      "emp-1",
    );
    const data = JSON.parse(result.data);

    expect(result.type).toBe("LEARNING_DEVELOPMENT");
    expect(data.employee.department).toBe("Manufacturing");
    expect(data.recommendedTraining).toContain("OSH Act Compliance");
  });

  it("uses default catalog when no employee found", async () => {
    employeeMock.mockResolvedValue(null);

    const result = await learningDevelopmentAgent("training", "tenant-a");
    const data = JSON.parse(result.data);

    expect(data.employee).toBeNull();
    expect(data.recommendedTraining).toContain("Communication Skills");
  });

  it("scopes employee lookup by tenantId", async () => {
    employeeMock.mockResolvedValue(null);

    await learningDevelopmentAgent("training", "tenant-x");

    expect(employeeMock).toHaveBeenCalledWith(
      expect.objectContaining({ where: { tenantId: "tenant-x" } }),
    );
  });

  it("uses employeeId when provided", async () => {
    employeeMock.mockResolvedValue(null);

    await learningDevelopmentAgent("training", "tenant-a", "emp-42");

    expect(employeeMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "emp-42", tenantId: "tenant-a" },
      }),
    );
  });
});
