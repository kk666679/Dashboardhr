import type { PolicyResult, PermissionScope } from "@/lib/shared-kernel/security/permission-types";
import { ROLE_PERMISSIONS } from "@/lib/shared-kernel/security/permission-types";

export interface PolicyContext {
  user: {
    id: string;
    role: string;
    tenantId: string;
    departments?: string[];
    legalEntities?: string[];
    employeeId?: string;
  };
  resource: {
    tenantId: string;
    legalEntityId?: string;
    departmentId?: string;
    employeeId?: string;
    module: string; // e.g. "employee", "payroll", "org"
  };
  action: "read" | "write" | "delete" | "approve";
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveRoleScope(role: string, module: string): PermissionScope {
  const map = ROLE_PERMISSIONS[role as keyof typeof ROLE_PERMISSIONS];
  if (!map) return "NONE";
  return (map[module] as PermissionScope) ?? "NONE";
}

function evaluateAttributeScope(ctx: PolicyContext, scope: PermissionScope): PolicyResult {
  const { user, resource } = ctx;

  switch (scope) {
    case "FULL":
    case "READ":
    case "APPROVE":
      return { allowed: true };

    case "MASKED":
      // masked = readable but data will be redacted downstream
      return { allowed: true };

    case "DEPT": {
      if (!resource.departmentId) return { allowed: true }; // no dept constraint on resource
      if (!user.departments?.length) return { allowed: false, reason: "No department scope" };
      if (user.departments.includes(resource.departmentId)) return { allowed: true };
      return { allowed: false, reason: "Outside department scope" };
    }

    case "TEAM": {
      // Team scope: manager must be in same department
      if (!resource.departmentId) return { allowed: true };
      if (!user.departments?.length) return { allowed: false, reason: "No team scope" };
      if (user.departments.includes(resource.departmentId)) return { allowed: true };
      return { allowed: false, reason: "Outside team scope" };
    }

    case "SELF": {
      if (!resource.employeeId) return { allowed: false, reason: "No employee context" };
      if (resource.employeeId === user.employeeId) return { allowed: true };
      return { allowed: false, reason: "Can only access own records" };
    }

    case "NONE":
    default:
      return { allowed: false, reason: "Role does not have this permission" };
  }
}

// ─── Main policy evaluator ────────────────────────────────────────────────────

export function evaluatePolicy(ctx: PolicyContext): PolicyResult {
  const { user, resource, action } = ctx;

  // 1. Tenant isolation — hard reject on tenant mismatch
  if (user.tenantId !== resource.tenantId) {
    return { allowed: false, reason: "TENANT_MISMATCH" };
  }

  // 2. Super_Admin bypass
  if (user.role === "Super_Admin" || user.role === "ADMIN") {
    return { allowed: true };
  }

  // 3. Map action to module scope
  const scope = resolveRoleScope(user.role, resource.module);

  // 4. Handle action-specific overrides
  if (action === "approve") {
    const approveScope = resolveRoleScope(user.role, resource.module);
    if (approveScope === "APPROVE" || approveScope === "FULL" || approveScope === "DEPT") {
      return evaluateAttributeScope(ctx, approveScope);
    }
    return { allowed: false, reason: "Role cannot approve in this module" };
  }

  if (action === "delete") {
    if (scope === "FULL") return { allowed: true };
    if (scope === "NONE") return { allowed: false, reason: "Role cannot delete" };
    // Only FULL scope allows delete
    return { allowed: false, reason: "Delete requires FULL scope" };
  }

  if (action === "write") {
    if (scope === "READ" || scope === "MASKED") {
      return { allowed: false, reason: "Role has read-only access" };
    }
  }

  // 5. Evaluate attribute scope
  return evaluateAttributeScope(ctx, scope);
}

// ─── Legacy shim (used by existing middleware) ────────────────────────────────

/** @deprecated Use PolicyContext-based evaluatePolicy instead */
export function evaluateLegacyPolicy(ctx: {
  tenantId: string;
  userRole?: string;
  userId?: string;
  departmentId?: string;
  legalEntityId?: string;
  permission: string;
}): PolicyResult {
  if (!ctx.tenantId) {
    return { allowed: false, reason: "Tenant context is required" };
  }

  if ((ctx.userRole === "EMPLOYEE" || ctx.userRole === "Employee") && ctx.permission === "write:org") {
    return { allowed: false, reason: "Employees cannot write organisation data" };
  }

  return { allowed: true };
}
