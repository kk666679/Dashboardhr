// types/audit.ts
export type AuditAction = 
  | "CREATE" 
  | "UPDATE" 
  | "DELETE" 
  | "BULK_CREATE"
  | "BULK_UPDATE"
  | "BULK_DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "EXPORT"
  | "IMPORT"
  | "APPROVE"
  | "REJECT"
  | "ASSIGN"
  | "UNASSIGN"
  | "ACTIVATE"
  | "DEACTIVATE"
  | "ARCHIVE"
  | "RESTORE";

export interface AuditEntry {
  id?: string;
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface DispatchOptions {
  channel: string;
  data: Record<string, unknown>;
  priority?: "low" | "medium" | "high";
}