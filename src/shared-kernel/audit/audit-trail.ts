export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "READ";

export interface AuditEntry {
  id?: string;
  tenantId: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  actorId?: string | null;
  actorRole?: string | null;
  previousValue?: unknown;
  newValue?: unknown;
  metadata?: Record<string, unknown> | null;
  createdAt?: Date;
}

export interface AuditContext {
  tenantId: string;
  userId?: string;
  userRole?: string;
}
