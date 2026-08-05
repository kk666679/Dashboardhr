# 08 — Test Generation

Unit and integration test templates for the AIFWMS API. The project uses **Vitest** (`vitest.config.ts` present).

---

## Test Setup

### Install test utilities

```bash
# Already included via vitest in devDependencies
# Add testing utilities if not present:
pnpm add -D @vitest/coverage-v8 msw supertest
```

### Vitest configuration (existing `vitest.config.ts`)

```typescript
// vitest.config.ts — extend with coverage
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    coverage: {
      provider: "v8",
      include: ["server/routers/**", "lib/**", "app/api/**"],
      thresholds: { lines: 70, functions: 70 },
    },
    setupFiles: ["./test/setup.ts"],
  },
});
```

### Test setup file

```typescript
// test/setup.ts
import { beforeAll, afterAll, vi } from "vitest";

// Mock Prisma for unit tests
vi.mock("@/lib/prisma", () => ({
  prisma: {
    employee: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    leaveBalance: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
    attendance: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    auditTrail: {
      findMany: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    $queryRawUnsafe: vi.fn(),
    $transaction: vi.fn((fn) => fn(prisma)),
  },
}));

// Mock Redis session
vi.mock("@/lib/server/auth", () => ({
  getCurrentSession: vi.fn().mockResolvedValue(null),
}));
```

---

## Unit Tests: tRPC Routers

### Helper: create test caller

```typescript
// test/helpers/trpc-caller.ts
import { createCallerFactory } from "@trpc/server";
import { appRouter } from "@/server/root";
import type { Context } from "@/server/trpc";

const createCaller = createCallerFactory(appRouter);

export function makeContext(overrides?: Partial<Context>): Context {
  return {
    tenantId: "tenant-test-001",
    userId:   "user-test-001",
    userRole: "HR",
    ...overrides,
  };
}

export function makeCaller(ctx?: Partial<Context>) {
  return createCaller(makeContext(ctx));
}
```

---

### Leave Router Tests

```typescript
// test/routers/leave.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { makeCaller } from "../helpers/trpc-caller";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

describe("leave.request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a leave application when balance is sufficient", async () => {
    const caller = makeCaller();

    // Mock balance: 10 days available
    vi.mocked(prisma.leaveBalance.findFirst).mockResolvedValueOnce({
      id: "bal-1", tenantId: "tenant-test-001", employeeId: "emp-1",
      leaveType: "ANNUAL", year: 2026,
      entitlement: 14, used: 2, pending: 2, carryForward: 0,
    } as any);

    // Mock insert
    vi.mocked(prisma.$queryRawUnsafe).mockResolvedValueOnce([{
      id: "leave-1", tenant_id: "tenant-test-001",
      employee_id: "emp-1", leave_type: "ANNUAL",
      start_date: new Date("2026-08-10"), end_date: new Date("2026-08-14"),
      days: 5, status: "PENDING",
    }]);

    vi.mocked(prisma.leaveBalance.update).mockResolvedValueOnce({} as any);

    const result = await caller.leave.request({
      employeeId: "emp-1",
      leaveType: "ANNUAL",
      startDate: new Date("2026-08-10"),
      endDate:   new Date("2026-08-14"),
      reason:    "Family vacation",
    });

    expect(result.status).toBe("PENDING");
    expect(prisma.leaveBalance.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { pending: { increment: 5 } } })
    );
  });

  it("throws BAD_REQUEST when balance is insufficient", async () => {
    const caller = makeCaller();

    vi.mocked(prisma.leaveBalance.findFirst).mockResolvedValueOnce({
      id: "bal-1", tenantId: "tenant-test-001", employeeId: "emp-1",
      leaveType: "ANNUAL", year: 2026,
      entitlement: 3, used: 2, pending: 1, carryForward: 0,
    } as any);

    await expect(
      caller.leave.request({
        employeeId: "emp-1",
        leaveType: "ANNUAL",
        startDate: new Date("2026-08-10"),
        endDate:   new Date("2026-08-14"), // 5 days
      })
    ).rejects.toThrow("Insufficient leave balance");
  });

  it("throws BAD_REQUEST when endDate is before startDate", async () => {
    const caller = makeCaller();

    await expect(
      caller.leave.request({
        employeeId: "emp-1",
        leaveType:  "ANNUAL",
        startDate:  new Date("2026-08-14"),
        endDate:    new Date("2026-08-10"),
      })
    ).rejects.toThrow("End date must be on or after start date");
  });
});

describe("leave.approve", () => {
  it("approves a pending leave and updates balance", async () => {
    const caller = makeCaller();

    // Mock find pending app
    vi.mocked(prisma.$queryRawUnsafe)
      .mockResolvedValueOnce([{
        id: "leave-1", employee_id: "emp-1", leave_type: "ANNUAL",
        start_date: "2026-08-10", days: 5, status: "PENDING"
      }])
      .mockResolvedValueOnce([]);  // update

    vi.mocked(prisma.leaveBalance.update).mockResolvedValueOnce({} as any);

    const result = await caller.leave.approve({ leaveId: "leave-1" });
    expect(result.success).toBe(true);
  });
});
```

---

### Attendance Router Tests

```typescript
// test/routers/attendance.test.ts
import { describe, it, expect, vi } from "vitest";
import { makeCaller } from "../helpers/trpc-caller";
import { prisma } from "@/lib/prisma";

describe("attendance.clockOut — Property 10: Overtime invariant", () => {
  it("calculates overtime correctly (worked > standard)", async () => {
    const caller = makeCaller();
    const checkInTime = new Date();
    checkInTime.setHours(checkInTime.getHours() - 10); // 10 hours ago

    vi.mocked(prisma.attendance.findFirst).mockResolvedValueOnce({
      id: "att-1",
      tenantId: "tenant-test-001",
      employeeId: "emp-1",
      date: new Date(),
      checkIn: checkInTime,
      checkOut: null,
      status: "PRESENT",
    } as any);

    vi.mocked(prisma.attendance.update).mockResolvedValueOnce({
      id: "att-1",
      checkOut: new Date(),
      hoursWorked: 10,
      status: "PRESENT",
    } as any);

    const result = await caller.attendance.clockOut({ employeeId: "emp-1" });

    const overtime = parseFloat(result.overtime);
    expect(overtime).toBeGreaterThanOrEqual(0);  // Property 10: never negative
    expect(overtime).toBeCloseTo(2, 0);          // 10h worked - 8h standard = ~2h OT
  });

  it("returns 0 overtime when worked <= standard hours", async () => {
    const caller = makeCaller();
    const checkInTime = new Date();
    checkInTime.setHours(checkInTime.getHours() - 7); // 7 hours ago

    vi.mocked(prisma.attendance.findFirst).mockResolvedValueOnce({
      id: "att-1",
      tenantId: "tenant-test-001",
      employeeId: "emp-1",
      date: new Date(),
      checkIn: checkInTime,
      checkOut: null,
      status: "PRESENT",
    } as any);

    vi.mocked(prisma.attendance.update).mockResolvedValueOnce({
      id: "att-1",
      checkOut: new Date(),
      hoursWorked: 7,
      status: "PRESENT",
    } as any);

    const result = await caller.attendance.clockOut({ employeeId: "emp-1" });

    const overtime = parseFloat(result.overtime);
    expect(overtime).toBe(0);  // Property 10: max(0, 7-8) = 0, never negative
  });
});

describe("attendance.clockIn", () => {
  it("prevents double clock-in on same day", async () => {
    const caller = makeCaller();

    // Existing clock-in record
    vi.mocked(prisma.attendance.findFirst).mockResolvedValueOnce({
      id: "att-1", checkIn: new Date(), tenantId: "tenant-test-001",
    } as any);

    await expect(
      caller.attendance.clockIn({ employeeId: "emp-1" })
    ).rejects.toThrow("already clocked in today");
  });
});
```

---

### Workflow Engine Tests

```typescript
// test/routers/workflowEngine.test.ts
import { describe, it, expect } from "vitest";
import { makeCaller } from "../helpers/trpc-caller";

describe("workflowEngine.saveDefinition — graph validation", () => {
  const validGraph = {
    nodes: [
      { id: "start", type: "start" as const, data: { label: "Start" }, position: { x: 0, y: 0 } },
      { id: "approve", type: "approval" as const, data: { label: "Approve", assigneeRole: "HR" }, position: { x: 200, y: 0 } },
      { id: "end", type: "end" as const, data: { label: "End" }, position: { x: 400, y: 0 } },
    ],
    edges: [
      { id: "e1", source: "start", target: "approve" },
      { id: "e2", source: "approve", target: "end", label: "approved" as const },
    ],
  };

  it("rejects graph with no start node", async () => {
    const caller = makeCaller({ userRole: "ADMIN" });
    const graph = {
      nodes: validGraph.nodes.filter(n => n.type !== "start"),
      edges: validGraph.edges,
    };

    await expect(
      caller.workflowEngine.saveDefinition({
        name: "Test", module: "leave", graphJson: graph as any
      })
    ).rejects.toThrow("exactly one start node");
  });

  it("rejects graph with cycles", async () => {
    const caller = makeCaller({ userRole: "ADMIN" });
    const cyclicGraph = {
      nodes: validGraph.nodes,
      edges: [
        { id: "e1", source: "start", target: "approve" },
        { id: "e2", source: "approve", target: "end", label: "approved" as const },
        { id: "e3", source: "end", target: "approve" },  // cycle
      ],
    };

    await expect(
      caller.workflowEngine.saveDefinition({
        name: "Test", module: "leave", graphJson: cyclicGraph as any
      })
    ).rejects.toThrow("cycle");
  });
});
```

---

### Security Router Tests

```typescript
// test/routers/security.test.ts
import { describe, it, expect, vi } from "vitest";
import { makeCaller } from "../helpers/trpc-caller";
import { prisma } from "@/lib/prisma";

describe("security.changePassword", () => {
  it("rejects incorrect current password", async () => {
    const caller = makeCaller({ userRole: "EMPLOYEE" });

    vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
      id: "user-test-001",
      password: "correctpass",
    } as any);

    await expect(
      caller.security.changePassword({
        currentPassword: "wrongpass",
        newPassword: "newSecurePass123!",
      })
    ).rejects.toThrow("Current password is incorrect");
  });

  it("enforces minimum 8-character new password (Zod validation)", async () => {
    const caller = makeCaller({ userRole: "EMPLOYEE" });

    await expect(
      caller.security.changePassword({
        currentPassword: "oldpass",
        newPassword: "short",  // 5 chars
      })
    ).rejects.toThrow(); // Zod validation error
  });
});
```

---

## Integration Tests: REST Endpoints

```typescript
// test/api/auth.test.ts
import { describe, it, expect, vi } from "vitest";
import { createRequest, createResponse } from "node-mocks-http";
import { POST } from "@/app/api/auth/[...nextauth]/route";

// Note: Next.js route handler testing requires a fetch-compatible environment.
// Use the native fetch mock or a test server setup.

describe("POST /api/auth/login", () => {
  it("returns 400 when email is missing", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "test123" }),
    });

    // Provide nextauth segments via params
    const res = await POST(req as any, {
      params: Promise.resolve({ nextauth: ["login"] }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Email and password are required");
  });
});
```

---

## Integration Tests: Biometric Webhook

```typescript
// test/api/webhooks/biometric.test.ts
import { describe, it, expect, vi } from "vitest";
import { createHmac } from "crypto";
import { POST } from "@/app/api/webhooks/biometric/route";

const SECRET = "dev-biometric-secret";

function signBody(body: string): string {
  const sig = createHmac("sha256", SECRET).update(body).digest("hex");
  return `sha256=${sig}`;
}

describe("POST /api/webhooks/biometric", () => {
  it("accepts valid event with high confidence", async () => {
    const event = {
      deviceId: "term-001",
      deviceEmployeeId: "EMP-123",
      tenantId: "tenant-001",
      timestamp: new Date().toISOString(),
      eventType: "CLOCK_IN",
      confidenceScore: 92,
    };
    const body = JSON.stringify(event);
    const sig = signBody(body);

    const req = new Request("http://localhost/api/webhooks/biometric", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-biometric-signature": sig,
      },
      body,
    });

    // Mock BullMQ queue
    vi.mock("@/lib/queues", () => ({
      attendanceQueue: vi.fn().mockResolvedValue({
        add: vi.fn().mockResolvedValue({ id: "job-1" }),
      }),
    }));

    const res = await POST(req as any);
    expect(res.status).toBe(202);
    const data = await res.json();
    expect(data.accepted).toBe(true);
  });

  it("rejects invalid HMAC signature", async () => {
    const body = JSON.stringify({ eventType: "CLOCK_IN", confidenceScore: 95 });
    const req = new Request("http://localhost/api/webhooks/biometric", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-biometric-signature": "sha256=invalidsig",
      },
      body,
    });

    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });

  it("rejects low confidence score", async () => {
    const event = {
      deviceId: "term-001",
      deviceEmployeeId: "EMP-123",
      tenantId: "tenant-001",
      timestamp: new Date().toISOString(),
      eventType: "CLOCK_IN",
      confidenceScore: 50,  // below threshold of 75
    };
    const body = JSON.stringify(event);
    const sig = signBody(body);

    const req = new Request("http://localhost/api/webhooks/biometric", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-biometric-signature": sig,
      },
      body,
    });

    const res = await POST(req as any);
    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.accepted).toBe(false);
    expect(data.reason).toContain("Low confidence");
  });
});
```

---

## Test Coverage Targets

| Module | Target | Focus |
|--------|--------|-------|
| `leave` router | 90% | Balance conservation (Property 2) |
| `attendance` router | 90% | Overtime invariant (Property 10) |
| `workflowEngine` router | 85% | Graph validation, decision authorization |
| `security` router | 85% | Password, role changes, session invalidation |
| `auditTrail` router | 80% | Read filters |
| `auth` REST route | 85% | Login, MFA, OIDC flows |
| `webhooks/biometric` | 95% | HMAC verification, threshold logic |
| `compliance` router | 70% | CRUD operations |

---

## Running Tests

```bash
# Run all tests once
pnpm test

# Run with coverage
pnpm vitest run --coverage

# Watch mode (development)
pnpm vitest

# Run specific file
pnpm vitest test/routers/leave.test.ts

# Filter by name
pnpm vitest -t "Property 10"
```
