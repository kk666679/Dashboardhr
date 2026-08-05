// Enums
export enum SopStatus {
  DRAFT = 'draft',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ARCHIVED = 'archived',
}

export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

// ------------------------------------------------------------
// SopApproval
// ------------------------------------------------------------
export interface SopApproval {
  versionId: string;
  approverRole: string;
  order: number;
  status: ApprovalStatus;
  decidedBy?: string;
  decidedAt?: Date;
  comment?: string;
}

// ------------------------------------------------------------
// SopArtifact
// ------------------------------------------------------------
export interface SopArtifact {
  versionId: string;
  type: string;                 // e.g. 'pdf', 'spreadsheet', 'screenshot'
  payload: Record<string, any>; // flexible metadata/content
  generatedAt: Date;
}

// ------------------------------------------------------------
// SopAuditEvent
// ------------------------------------------------------------
export interface SopAuditEvent {
  versionId: string;
  actor: string;
  action: string;               // 'create', 'update', 'approve', etc.
  evidence?: Record<string, any>;
  createdAt: Date;
}

// ------------------------------------------------------------
// SopComplianceItem (optional)
// ------------------------------------------------------------
export interface SopComplianceItem {
  versionId: string;
  requirement?: string;         // e.g. 'ISO 13485:2016 4.2.3'
  regulation?: string;          // e.g. 'FDA 21 CFR Part 11'
  control?: string;
  status?: string;              // 'compliant', 'non_compliant', 'pending'
}

// ------------------------------------------------------------
// SopVersion (main entity)
// ------------------------------------------------------------
export interface SopVersion {
  id: string;                   // internal primary key (or versionId)
  sopId: string;                // external SOP identifier
  version: string;              // '1.0', '2.1', etc.
  status: SopStatus;
  content: Record<string, any>; // full SOP structure (JSON)
  scores?: Record<string, any>;
  findings?: any[];

  // Aggregated/related arrays
  approvals: SopApproval[];
  artifacts: SopArtifact[];
  auditEvents: SopAuditEvent[];
  complianceItems?: SopComplianceItem[];
}