export type HCMRole = string;

export const MFA_REQUIRED_ROLES: HCMRole[] = [
  "Super_Admin",
  "HR_Director",
  "HR_Manager",
  "Payroll_Manager",
  "Compliance_Officer",
];

export type PermissionScope = "FULL" | "READ" | "APPROVE" | "MASKED" | "DEPT" | "TEAM" | "SELF" | "NONE";

export const ROLE_PERMISSIONS: Record<string, Record<string, PermissionScope>> = {
  Super_Admin:        { employee: "FULL", payroll: "FULL", org: "FULL", leave: "FULL", performance: "FULL", recruitment: "FULL", analytics: "FULL", config: "FULL" },
  Group_HR:           { employee: "FULL", payroll: "READ", org: "READ", leave: "FULL", performance: "FULL", recruitment: "FULL", analytics: "FULL" },
  HR_Director:        { employee: "FULL", payroll: "FULL", org: "READ", leave: "FULL", performance: "FULL", recruitment: "FULL", analytics: "FULL" },
  HR_Manager:         { employee: "FULL", payroll: "APPROVE", org: "DEPT", leave: "APPROVE", performance: "FULL", recruitment: "FULL", analytics: "DEPT" },
  HR_Executive:       { employee: "DEPT", payroll: "NONE", org: "NONE", leave: "APPROVE", performance: "READ", recruitment: "READ" },
  Payroll_Manager:    { employee: "READ", payroll: "FULL", org: "NONE", leave: "READ", analytics: "MASKED" },
  Payroll_Executive:  { employee: "READ", payroll: "FULL", org: "NONE", leave: "READ" },
  Finance:            { employee: "MASKED", payroll: "READ", org: "NONE", analytics: "READ" },
  Recruiter:          { employee: "READ", payroll: "NONE", org: "NONE", recruitment: "FULL", analytics: "READ" },
  Department_Head:    { employee: "DEPT", payroll: "NONE", org: "DEPT", leave: "APPROVE", performance: "APPROVE", recruitment: "APPROVE", analytics: "DEPT" },
  Manager:            { employee: "TEAM", payroll: "NONE", org: "TEAM", leave: "APPROVE", performance: "APPROVE", analytics: "TEAM" },
  Team_Lead:          { employee: "TEAM", payroll: "NONE", org: "TEAM", leave: "READ", performance: "READ" },
  Employee:           { employee: "SELF", payroll: "SELF", org: "NONE", leave: "SELF", performance: "SELF" },
  Contractor:         { employee: "SELF", payroll: "NONE", org: "NONE", leave: "SELF" },
  Auditor:            { employee: "MASKED", payroll: "MASKED", org: "NONE", leave: "READ", performance: "READ", analytics: "FULL" },
  Compliance_Officer: { employee: "MASKED", payroll: "MASKED", org: "NONE", analytics: "READ" },
  ADMIN:              { employee: "FULL", payroll: "FULL", org: "FULL", leave: "FULL", performance: "FULL", recruitment: "FULL", analytics: "FULL", config: "FULL" },
  HR:                 { employee: "FULL", payroll: "READ", org: "READ", leave: "FULL", performance: "FULL", recruitment: "FULL", analytics: "FULL" },
};

export type Permission =
  | "read:employee"
  | "write:employee"
  | "read:payroll"
  | "write:payroll"
  | "read:org"
  | "write:org";

export interface PolicyResult {
  allowed: boolean;
  reason?: string;
}

export interface RolePermissionMap {
  [role: string]: Permission[];
}
