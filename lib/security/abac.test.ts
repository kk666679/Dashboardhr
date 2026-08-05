/** Unit tests — lib/security/abac.ts */
import { describe, it, expect } from "vitest";
import { evaluatePolicy, evaluateLegacyPolicy, type PolicyContext } from "./abac";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ctx = (overrides: Partial<PolicyContext> = {}): PolicyContext => ({
  user: {
    id: "u-1",
    role: "HR_Manager",
    tenantId: "tenant-a",
    departments: ["dept-eng"],
    employeeId: "emp-1",
  },
  resource: {
    tenantId: "tenant-a",
    module: "employee",
    departmentId: "dept-eng",
    employeeId: "emp-99",
  },
  action: "read",
  ...overrides,
});

// ─── Tenant isolation ─────────────────────────────────────────────────────────

describe("evaluatePolicy — tenant isolation", () => {
  it("rejects when user tenant differs from resource tenant", () => {
    const result = evaluatePolicy(ctx({
      resource: { tenantId: "tenant-b", module: "employee" },
    }));
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("TENANT_MISMATCH");
  });

  it("allows when tenant IDs match", () => {
    expect(evaluatePolicy(ctx()).allowed).toBe(true);
  });
});

// ─── Super_Admin bypass ───────────────────────────────────────────────────────

describe("evaluatePolicy — Super_Admin / ADMIN bypass", () => {
  it("Super_Admin always allowed regardless of module or action", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "a", role: "Super_Admin", tenantId: "tenant-a" },
      action: "delete",
    }));
    expect(result.allowed).toBe(true);
  });

  it("ADMIN always allowed", () => {
    expect(evaluatePolicy(ctx({
      user: { id: "a", role: "ADMIN", tenantId: "tenant-a" },
      action: "delete",
    })).allowed).toBe(true);
  });
});

// ─── Read ─────────────────────────────────────────────────────────────────────

describe("evaluatePolicy — read", () => {
  it("HR_Manager can read employee in own department", () => {
    expect(evaluatePolicy(ctx({ action: "read" })).allowed).toBe(true);
  });

  it("HR_Executive (DEPT scope) cannot read employee in another department", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "u-3", role: "HR_Executive", tenantId: "tenant-a", departments: ["dept-eng"] },
      resource: { tenantId: "tenant-a", module: "employee", departmentId: "dept-other" },
      action: "read",
    }));
    expect(result.allowed).toBe(false);
  });

  it("Employee can read own record (SELF scope)", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "u-2", role: "Employee", tenantId: "tenant-a", employeeId: "emp-5" },
      resource: { tenantId: "tenant-a", module: "employee", employeeId: "emp-5" },
      action: "read",
    }));
    expect(result.allowed).toBe(true);
  });

  it("Employee cannot read another employee's record", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "u-2", role: "Employee", tenantId: "tenant-a", employeeId: "emp-5" },
      resource: { tenantId: "tenant-a", module: "employee", employeeId: "emp-99" },
      action: "read",
    }));
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("own records");
  });

  it("Recruiter has NONE scope on payroll — blocked", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "r-1", role: "Recruiter", tenantId: "tenant-a" },
      resource: { tenantId: "tenant-a", module: "payroll" },
      action: "read",
    }));
    expect(result.allowed).toBe(false);
  });
});

// ─── Write ────────────────────────────────────────────────────────────────────

describe("evaluatePolicy — write", () => {
  it("HR_Director can write employee records (FULL scope)", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "hd-1", role: "HR_Director", tenantId: "tenant-a" },
      resource: { tenantId: "tenant-a", module: "employee" },
      action: "write",
    }));
    expect(result.allowed).toBe(true);
  });

  it("Payroll_Manager cannot write employee (READ scope → blocked)", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "pm-1", role: "Payroll_Manager", tenantId: "tenant-a" },
      resource: { tenantId: "tenant-a", module: "employee" },
      action: "write",
    }));
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("read-only");
  });

  it("Finance cannot write payroll (READ scope)", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "f-1", role: "Finance", tenantId: "tenant-a" },
      resource: { tenantId: "tenant-a", module: "payroll" },
      action: "write",
    }));
    expect(result.allowed).toBe(false);
  });
});

// ─── Delete ───────────────────────────────────────────────────────────────────

describe("evaluatePolicy — delete", () => {
  it("HR_Director (FULL) can delete", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "hd-1", role: "HR_Director", tenantId: "tenant-a" },
      resource: { tenantId: "tenant-a", module: "employee" },
      action: "delete",
    }));
    expect(result.allowed).toBe(true);
  });

  it("HR_Executive (DEPT scope, not FULL) cannot delete", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "he-1", role: "HR_Executive", tenantId: "tenant-a", departments: ["dept-eng"] },
      resource: { tenantId: "tenant-a", module: "employee", departmentId: "dept-eng" },
      action: "delete",
    }));
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("FULL scope");
  });
});

// ─── Approve ─────────────────────────────────────────────────────────────────

describe("evaluatePolicy — approve", () => {
  it("HR_Manager can approve leave in own department", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "hm-1", role: "HR_Manager", tenantId: "tenant-a", departments: ["dept-eng"] },
      resource: { tenantId: "tenant-a", module: "leave", departmentId: "dept-eng" },
      action: "approve",
    }));
    expect(result.allowed).toBe(true);
  });

  it("Employee cannot approve anything (SELF scope)", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "e-1", role: "Employee", tenantId: "tenant-a", employeeId: "emp-1" },
      resource: { tenantId: "tenant-a", module: "leave", employeeId: "emp-1" },
      action: "approve",
    }));
    expect(result.allowed).toBe(false);
  });
});

// ─── Unknown role ─────────────────────────────────────────────────────────────

describe("evaluatePolicy — unknown / missing role", () => {
  it("unknown role is denied by default", () => {
    const result = evaluatePolicy(ctx({
      user: { id: "x", role: "GhostRole", tenantId: "tenant-a" },
      resource: { tenantId: "tenant-a", module: "employee" },
      action: "read",
    }));
    expect(result.allowed).toBe(false);
  });
});

// ─── evaluateLegacyPolicy ─────────────────────────────────────────────────────

describe("evaluateLegacyPolicy", () => {
  it("blocks when tenantId is missing", () => {
    expect(evaluateLegacyPolicy({ tenantId: "", permission: "read:employee" }).allowed).toBe(false);
  });

  it("blocks Employee from write:org", () => {
    const result = evaluateLegacyPolicy({
      tenantId: "t-1", userRole: "Employee", permission: "write:org",
    });
    expect(result.allowed).toBe(false);
  });

  it("allows other roles by default", () => {
    const result = evaluateLegacyPolicy({
      tenantId: "t-1", userRole: "HR_Manager", permission: "read:employee",
    });
    expect(result.allowed).toBe(true);
  });
});
