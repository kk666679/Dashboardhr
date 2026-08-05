export type AuditAction = "CREATE" | "CREATE_BACKDATED" | "UPDATE" | "DELETE" | "READ";

export interface AuditEntry {
  id?: string;
  tenantId: string;
  /** HCM module name, e.g. "payroll", "leave", "workflow" */
  module?: string | null;
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorId?: string | null;
  /** Free-form role string — supports all 20 HCM roles beyond the legacy 3 */
  actorRole?: string | null;
  ipAddress?: string | null;
  previousValue?: unknown;
  newValue?: unknown;
  /** Names of changed fields for UPDATE actions */
  changedFields?: string[];
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
}

export interface AuditContext {
  tenantId: string;
  userId?: string;
  userRole?: string;
}
