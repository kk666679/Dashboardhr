-- =============================================================================
-- Migration: Full HR, SOP, Offboarding & RAG / Hybrid Search Schema
-- =============================================================================

-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;
-- Enable UUID generation (for fallback, though we use TEXT ids)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Drop legacy SOP tables if they exist (clean start)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS "sop_approval" CASCADE;
DROP TABLE IF EXISTS "sop_artifact" CASCADE;
DROP TABLE IF EXISTS "sop_audit_event" CASCADE;
DROP TABLE IF EXISTS "sop_compliance" CASCADE;
DROP TABLE IF EXISTS "sop_compliance_item" CASCADE;
DROP TABLE IF EXISTS "sop_version" CASCADE;
DROP TABLE IF EXISTS "sop_risks" CASCADE;          -- in case old version
DROP TABLE IF EXISTS "sop_approvals" CASCADE;
DROP TABLE IF EXISTS "sop_versions" CASCADE;
DROP TABLE IF EXISTS "sops" CASCADE;
DROP TYPE IF EXISTS "approval_status";
DROP TYPE IF EXISTS "sop_status";

-- -----------------------------------------------------------------------------
-- 2. Create Enums
-- -----------------------------------------------------------------------------
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR', 'EMPLOYEE');
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'READ');
CREATE TYPE "OrgNodeLevel" AS ENUM ('GROUP', 'LEGAL_ENTITY', 'BUSINESS_UNIT', 'DEPARTMENT', 'BRANCH', 'COST_CENTER');
CREATE TYPE "DocumentType" AS ENUM ('PASSPORT', 'VISA', 'CONTRACT', 'PERMIT', 'CERTIFICATE');
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE "VisaStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'RENEWING', 'CANCELLED');
CREATE TYPE "ExpatStatus" AS ENUM ('ONBOARDING', 'ACTIVE', 'RELOCATION', 'RENEWAL_PENDING', 'TERMINATING', 'TERMINATED');
CREATE TYPE "ContractStatus" AS ENUM ('ACTIVE', 'TERMINATED', 'EXPIRED');
CREATE TYPE "PayrollStatus" AS ENUM ('PENDING', 'PROCESSED', 'PAID');
CREATE TYPE "AllowanceType" AS ENUM ('HOUSING', 'EDUCATION', 'HARDSHIP', 'COLA', 'TRANSPORT');
CREATE TYPE "AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY');
CREATE TYPE "RuleType" AS ENUM ('VISA', 'MEDICAL', 'PASSPORT', 'CONTRACT');
CREATE TYPE "ExitInterviewStatus" AS ENUM ('PENDING', 'SCHEDULED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "ClearanceTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'WAIVED');
CREATE TYPE "KnowledgeTransferStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE "AssetReturnStatus" AS ENUM ('PENDING', 'PARTIAL', 'COMPLETED');
CREATE TYPE "SettlementStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'PAID');
CREATE TYPE "AccessRevocationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');
CREATE TYPE "RevocationSystem" AS ENUM ('EMAIL', 'ACTIVE_DIRECTORY', 'VPN', 'GITHUB', 'GITLAB', 'SLACK', 'JIRA', 'CONFLUENCE', 'HRMS', 'CUSTOM');
CREATE TYPE "AlumniStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "PayrollRunStatus" AS ENUM ('DRAFT', 'LOCKED', 'CALCULATING', 'CALCULATED', 'FINALIZED', 'CANCELLED');
CREATE TYPE "TerminationType" AS ENUM ('RESIGNATION', 'VOLUNTARY', 'REDUNDANCY', 'DISCIPLINARY', 'RETIREMENT', 'CONTRACT_END');
CREATE TYPE "HandoverStatus" AS ENUM ('COMPLETE', 'IN_PROGRESS', 'PENDING');
CREATE TYPE "LocationSource" AS ENUM ('GPS', 'NETWORK', 'MANUAL');
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
CREATE TYPE "AlertType" AS ENUM ('UNAUTHORIZED_EXIT', 'RESTRICTED_ENTRY', 'SOS', 'OFFLINE', 'GEO_FENCE_VIOLATION');
CREATE TYPE "EmergencyType" AS ENUM ('SOS', 'PANIC', 'MEDICAL', 'ACCIDENT');
CREATE TYPE "SopCategory" AS ENUM ('POLICY', 'OPERATIONAL', 'COMPLIANCE', 'EMERGENCY');
CREATE TYPE "SopStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "SopArtifactType" AS ENUM ('MARKDOWN', 'HTML', 'DOCX', 'PDF', 'MERMAID');
CREATE TYPE "CandidateStatus" AS ENUM ('NEW', 'SHORTLISTED', 'SCREENING', 'CONSIDER', 'SUSPENDED', 'HIRED');

-- SopApprovalStatus (replaces old)
DROP TYPE IF EXISTS "SopApprovalStatus";
CREATE TYPE "SopApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'VOID');

-- -----------------------------------------------------------------------------
-- 3. Create Tables (all with TEXT primary keys, camelCase)
-- -----------------------------------------------------------------------------

-- ---------- Tenants ----------
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "tenants_domain_key" ON "tenants"("domain");

-- ---------- Users ----------
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ---------- Employees ----------
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "country" TEXT,
    "isForeign" BOOLEAN NOT NULL DEFAULT false,
    "position" TEXT,
    "department" TEXT,
    "hireDate" TIMESTAMP(3),
    "nameEmbedding" vector(384),
    "tags" TEXT[],
    "weaviateId" TEXT,
    "vectorScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "employees_userId_key" ON "employees"("userId");
CREATE UNIQUE INDEX "employees_weaviateId_key" ON "employees"("weaviateId");
CREATE INDEX "employees_tenantId_idx" ON "employees"("tenantId");
CREATE INDEX "employees_tenantId_name_idx" ON "employees"("tenantId", "name");

-- ---------- Documents (with RAG / hybrid search) ----------
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "type" "DocumentType" NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "fileUrl" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "tags" TEXT[] DEFAULT '{}',
    "weaviateId" TEXT,

    -- RAG / vector fields
    "contentText" TEXT,
    "contentEmbedding" vector(1536),
    "metadata" JSONB DEFAULT '{}',
    "contentHash" TEXT,

    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- FTS vector (generated column)
ALTER TABLE "documents"
ADD COLUMN "searchVector" tsvector
GENERATED ALWAYS AS (to_tsvector('english', COALESCE("contentText", ''))) STORED;

-- Indexes for vector & FTS
CREATE INDEX "documents_hnsw_idx" ON "documents" USING hnsw ("contentEmbedding" vector_cosine_ops);
CREATE INDEX "documents_fts_idx" ON "documents" USING GIN ("searchVector");
CREATE INDEX "documents_hash_idx" ON "documents" ("contentHash");
CREATE INDEX "documents_tenant_idx" ON "documents" ("tenantId");
CREATE INDEX "documents_tenantId_employeeId_idx" ON "documents"("tenantId", "employeeId");
CREATE INDEX "documents_status_expiryDate_idx" ON "documents"("status", "expiryDate");
CREATE UNIQUE INDEX "documents_weaviateId_key" ON "documents"("weaviateId") WHERE "weaviateId" IS NOT NULL;

-- ---------- SOP Tables ----------
-- sops
CREATE TABLE "sops" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "department" TEXT,
    "category" "SopCategory" NOT NULL,
    "status" "SopStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currentVersion" INTEGER DEFAULT 1,
    CONSTRAINT "sops_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sops_tenantId_department_idx" ON "sops"("tenantId", "department");
CREATE UNIQUE INDEX "sops_tenantId_code_key" ON "sops"("tenantId", "code");

-- sop_versions
CREATE TABLE "sop_versions" (
    "id" TEXT NOT NULL,
    "sopId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" JSONB NOT NULL,                    -- full SOP structure (JSON)
    "summary" TEXT,
    "status" "SopStatus" NOT NULL DEFAULT 'DRAFT',
    "changes" TEXT,
    "outline" JSONB,
    "sla" JSONB,
    "riskFindings" JSONB,
    "complianceFindings" JSONB,
    "auditFindings" JSONB,
    "riskScore" INTEGER,
    "complianceScore" INTEGER,
    "auditReadinessScore" INTEGER,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sop_versions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sop_versions_sopId_version_idx" ON "sop_versions"("sopId", "version");
CREATE UNIQUE INDEX "sop_versions_sopId_version_key" ON "sop_versions"("sopId", "version");

-- sop_approvals
CREATE TABLE "sop_approvals" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "approverName" TEXT,
    "approverRole" TEXT NOT NULL,
    "status" "SopApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comment" TEXT,
    "order" INTEGER DEFAULT 1,
    "decidedBy" TEXT,
    "decidedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sop_approvals_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sop_approvals_versionId_status_idx" ON "sop_approvals"("versionId", "status");
CREATE INDEX "sop_approvals_versionId_order_idx" ON "sop_approvals"("versionId", "order");

-- sop_artifacts
CREATE TABLE "sop_artifacts" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "title" TEXT,
    "type" "SopArtifactType" NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sop_artifacts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sop_artifacts_versionId_type_idx" ON "sop_artifacts"("versionId", "type");

-- sop_audit_events
CREATE TABLE "sop_audit_events" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "evidence" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sop_audit_events_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sop_audit_events_versionId_createdAt_idx" ON "sop_audit_events"("versionId", "createdAt" DESC);

-- sop_risks (per version)
CREATE TABLE "sop_risks" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "impact" TEXT,
    "likelihood" TEXT,
    "mitigation" TEXT,                            -- added from new scripts
    "status" TEXT DEFAULT 'identified',           -- added from new scripts
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sop_risks_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sop_risks_versionId_idx" ON "sop_risks"("versionId");

-- sop_compliance_items (new table from SOP snippets)
CREATE TABLE "sop_compliance_items" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "regulation" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "status" TEXT DEFAULT 'UNASSESSED',
    "evidence" TEXT,
    "assessedBy" TEXT,
    "assessedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "sop_compliance_items_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sop_compliance_items_versionId_idx" ON "sop_compliance_items"("versionId");

-- ---------- Offboarding Tables ----------
-- ExitInterview
CREATE TABLE "exit_interviews" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "terminationId" TEXT NOT NULL,
    "interviewerId" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "feedback" TEXT,
    "rating" INT,
    "status" "ExitInterviewStatus" DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "exit_interviews_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "exit_interviews_terminationId_key" UNIQUE ("terminationId")
);

-- ClearanceChecklist
CREATE TABLE "clearance_checklists" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "clearance_checklists_pkey" PRIMARY KEY ("id")
);

-- ClearanceItem
CREATE TABLE "clearance_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INT DEFAULT 0,
    "required" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "clearance_items_pkey" PRIMARY KEY ("id")
);

-- ClearanceInstance
CREATE TABLE "clearance_instances" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "terminationId" TEXT NOT NULL,
    "checklistId" TEXT NOT NULL,
    "completed" BOOLEAN DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "clearance_instances_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "clearance_instances_terminationId_key" UNIQUE ("terminationId")
);

-- ClearanceTask
CREATE TABLE "clearance_tasks" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "status" "ClearanceTaskStatus" DEFAULT 'PENDING',
    "remarks" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "clearance_tasks_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "clearance_tasks_instanceId_itemId_key" UNIQUE ("instanceId", "itemId")
);

-- KnowledgeTransfer
CREATE TABLE "knowledge_transfers" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "terminationId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "recipientId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "documentationUrl" TEXT,
    "status" "KnowledgeTransferStatus" DEFAULT 'DRAFT',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "knowledge_transfers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "knowledge_transfers_terminationId_key" UNIQUE ("terminationId")
);

-- AssetReturn
CREATE TABLE "asset_returns" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "terminationId" TEXT NOT NULL,
    "status" "AssetReturnStatus" DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "asset_returns_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "asset_returns_terminationId_key" UNIQUE ("terminationId")
);

-- AssetReturnItem
CREATE TABLE "asset_return_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "assetReturnId" TEXT NOT NULL,
    "assetName" TEXT NOT NULL,
    "assetTag" TEXT,
    "serialNumber" TEXT,
    "returned" BOOLEAN DEFAULT false,
    "returnedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "asset_return_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "asset_return_items_assetReturnId_assetTag_key" UNIQUE ("assetReturnId", "assetTag")
);

-- FinalSettlement
CREATE TABLE "final_settlements" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "terminationId" TEXT NOT NULL,
    "status" "SettlementStatus" DEFAULT 'DRAFT',
    "locked" BOOLEAN DEFAULT false,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "total" DECIMAL(18,2) DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "final_settlements_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "final_settlements_terminationId_key" UNIQUE ("terminationId")
);

-- FinalSettlementLineItem
CREATE TABLE "final_settlement_line_items" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "settlementId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "taxable" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "final_settlement_line_items_pkey" PRIMARY KEY ("id")
);

-- AccessRevocation
CREATE TABLE "access_revocations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "terminationId" TEXT NOT NULL,
    "status" "AccessRevocationStatus" DEFAULT 'PENDING',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "access_revocations_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "access_revocations_terminationId_key" UNIQUE ("terminationId")
);

-- AccessRevocationRequest
CREATE TABLE "access_revocation_requests" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "accessRevocationId" TEXT NOT NULL,
    "system" "RevocationSystem" NOT NULL,
    "systemName" TEXT,
    "completed" BOOLEAN DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "access_revocation_requests_pkey" PRIMARY KEY ("id")
);

-- AlumniProfile
CREATE TABLE "alumni_profiles" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "terminationId" TEXT NOT NULL,
    "personalEmail" TEXT,
    "linkedInUrl" TEXT,
    "currentCompany" TEXT,
    "notes" TEXT,
    "status" "AlumniStatus" DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "alumni_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "alumni_profiles_employeeId_key" UNIQUE ("employeeId"),
    CONSTRAINT "alumni_profiles_terminationId_key" UNIQUE ("terminationId")
);

-- ---------- Other Tables (Compliance, Org, Audit, Payroll, etc.) ----------
-- compliance_rules
CREATE TABLE "compliance_rules" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ruleType" "RuleType" NOT NULL,
    "condition" JSONB,
    "action" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "compliance_rules_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "compliance_rules_tenantId_idx" ON "compliance_rules"("tenantId");

-- org_nodes
CREATE TABLE "org_nodes" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "parentId" TEXT,
    "level" "OrgNodeLevel" NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "org_nodes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "org_nodes_tenantId_parentId_idx" ON "org_nodes"("tenantId", "parentId");

-- audit_trail
CREATE TABLE "audit_trail" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "userId" TEXT,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "ipAddress" INET,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "audit_trail_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "audit_trail_tenantId_createdAt_idx" ON "audit_trail"("tenantId", "createdAt" DESC);

-- payroll related tables (minimal)
CREATE TABLE "payrolls" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "basicSalary" DECIMAL NOT NULL,
    "allowances" JSONB,
    "deductions" DECIMAL NOT NULL DEFAULT 0,
    "netSalary" DECIMAL NOT NULL,
    "status" "PayrollStatus" DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payrolls_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "payroll_runs" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "legalEntityId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "PayrollRunStatus" DEFAULT 'DRAFT',
    "lockedAt" TIMESTAMP(3),
    "finalizedAt" TIMESTAMP(3),
    "checksum" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "payroll_runs_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "payroll_runs_tenantId_legalEntityId_period_key" UNIQUE ("tenantId", "legalEntityId", "periodStart", "periodEnd")
);

CREATE TABLE "payroll_line_items" (
    "id" TEXT NOT NULL,
    "runId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "componentType" TEXT NOT NULL,
    "amount" DECIMAL NOT NULL,
    "currency" TEXT DEFAULT 'MYR',
    "isTaxable" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payroll_line_items_pkey" PRIMARY KEY ("id")
);

-- (Other tables like leave, attendance, location, etc. can be added similarly)

-- ---------- Terminations (central offboarding) ----------
CREATE TABLE "terminations" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "approverId" TEXT,
    "terminationType" "TerminationType" NOT NULL,
    "lastWorkingDay" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "noticePeriodServed" BOOLEAN DEFAULT false,
    "finalSalaryAmount" DECIMAL DEFAULT 0,
    "pendingLeave" FLOAT,
    "otherPayments" FLOAT,
    "exitInterviewNotes" TEXT,
    "handoverStatus" "HandoverStatus" DEFAULT 'PENDING',
    "status" TEXT DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "terminations_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "terminations_tenantId_idx" ON "terminations"("tenantId");
CREATE INDEX "terminations_employeeId_idx" ON "terminations"("employeeId");

-- -----------------------------------------------------------------------------
-- 4. Foreign Key Constraints
-- -----------------------------------------------------------------------------
ALTER TABLE "users" ADD CONSTRAINT "users_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employees" ADD CONSTRAINT "employees_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "employees" ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "documents" ADD CONSTRAINT "documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "compliance_rules" ADD CONSTRAINT "compliance_rules_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "org_nodes" ADD CONSTRAINT "org_nodes_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "org_nodes" ADD CONSTRAINT "org_nodes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "org_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "audit_trail" ADD CONSTRAINT "audit_trail_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "audit_trail" ADD CONSTRAINT "audit_trail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- SOP FKs
ALTER TABLE "sop_versions" ADD CONSTRAINT "sop_versions_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "sops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_approvals" ADD CONSTRAINT "sop_approvals_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_artifacts" ADD CONSTRAINT "sop_artifacts_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_audit_events" ADD CONSTRAINT "sop_audit_events_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_risks" ADD CONSTRAINT "sop_risks_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_compliance_items" ADD CONSTRAINT "sop_compliance_items_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Offboarding FKs
ALTER TABLE "exit_interviews" ADD CONSTRAINT "exit_interviews_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exit_interviews" ADD CONSTRAINT "exit_interviews_terminationId_fkey" FOREIGN KEY ("terminationId") REFERENCES "terminations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exit_interviews" ADD CONSTRAINT "exit_interviews_interviewerId_fkey" FOREIGN KEY ("interviewerId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "clearance_checklists" ADD CONSTRAINT "clearance_checklists_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_items" ADD CONSTRAINT "clearance_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_items" ADD CONSTRAINT "clearance_items_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "clearance_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_instances" ADD CONSTRAINT "clearance_instances_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_instances" ADD CONSTRAINT "clearance_instances_terminationId_fkey" FOREIGN KEY ("terminationId") REFERENCES "terminations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_instances" ADD CONSTRAINT "clearance_instances_checklistId_fkey" FOREIGN KEY ("checklistId") REFERENCES "clearance_checklists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_tasks" ADD CONSTRAINT "clearance_tasks_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_tasks" ADD CONSTRAINT "clearance_tasks_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "clearance_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_tasks" ADD CONSTRAINT "clearance_tasks_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "clearance_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "clearance_tasks" ADD CONSTRAINT "clearance_tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "knowledge_transfers" ADD CONSTRAINT "knowledge_transfers_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "knowledge_transfers" ADD CONSTRAINT "knowledge_transfers_terminationId_fkey" FOREIGN KEY ("terminationId") REFERENCES "terminations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "knowledge_transfers" ADD CONSTRAINT "knowledge_transfers_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "knowledge_transfers" ADD CONSTRAINT "knowledge_transfers_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "asset_returns" ADD CONSTRAINT "asset_returns_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "asset_returns" ADD CONSTRAINT "asset_returns_terminationId_fkey" FOREIGN KEY ("terminationId") REFERENCES "terminations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "asset_return_items" ADD CONSTRAINT "asset_return_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "asset_return_items" ADD CONSTRAINT "asset_return_items_assetReturnId_fkey" FOREIGN KEY ("assetReturnId") REFERENCES "asset_returns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "final_settlements" ADD CONSTRAINT "final_settlements_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "final_settlements" ADD CONSTRAINT "final_settlements_terminationId_fkey" FOREIGN KEY ("terminationId") REFERENCES "terminations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "final_settlements" ADD CONSTRAINT "final_settlements_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "final_settlement_line_items" ADD CONSTRAINT "final_settlement_line_items_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "final_settlement_line_items" ADD CONSTRAINT "final_settlement_line_items_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "final_settlements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "access_revocations" ADD CONSTRAINT "access_revocations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "access_revocations" ADD CONSTRAINT "access_revocations_terminationId_fkey" FOREIGN KEY ("terminationId") REFERENCES "terminations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "access_revocation_requests" ADD CONSTRAINT "access_revocation_requests_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "access_revocation_requests" ADD CONSTRAINT "access_revocation_requests_accessRevocationId_fkey" FOREIGN KEY ("accessRevocationId") REFERENCES "access_revocations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "alumni_profiles" ADD CONSTRAINT "alumni_profiles_terminationId_fkey" FOREIGN KEY ("terminationId") REFERENCES "terminations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "terminations" ADD CONSTRAINT "terminations_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "terminations" ADD CONSTRAINT "terminations_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "terminations" ADD CONSTRAINT "terminations_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Payroll FKs
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payrolls" ADD CONSTRAINT "payrolls_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payroll_runs" ADD CONSTRAINT "payroll_runs_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "payroll_line_items" ADD CONSTRAINT "payroll_line_items_runId_fkey" FOREIGN KEY ("runId") REFERENCES "payroll_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- -----------------------------------------------------------------------------
-- 5. Hybrid Search Function (RRF)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION hybrid_search(
  query_embedding vector(1536),
  query_text TEXT,
  tenant_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  id TEXT,
  contentText TEXT,
  metadata JSONB,
  vector_rank INTEGER,
  fts_rank INTEGER,
  rrf_score DOUBLE PRECISION
) AS $$
BEGIN
  RETURN QUERY
  WITH vector_search AS (
    SELECT 
      id, "contentText", "metadata",
      ROW_NUMBER() OVER (ORDER BY "contentEmbedding" <=> query_embedding) AS rank
    FROM documents
    WHERE (tenant_filter IS NULL OR "tenantId" = tenant_filter)
      AND "contentEmbedding" IS NOT NULL
    ORDER BY "contentEmbedding" <=> query_embedding
    LIMIT 100
  ),
  keyword_search AS (
    SELECT 
      id, "contentText", "metadata",
      ROW_NUMBER() OVER (ORDER BY ts_rank_cd("searchVector", plainto_tsquery('english', query_text)) DESC) AS rank
    FROM documents
    WHERE "searchVector" @@ plainto_tsquery('english', query_text)
      AND (tenant_filter IS NULL OR "tenantId" = tenant_filter)
    LIMIT 100
  )
  SELECT
    COALESCE(v.id, k.id) AS id,
    COALESCE(v."contentText", k."contentText") AS "contentText",
    COALESCE(v."metadata", k."metadata") AS "metadata",
    v.rank AS vector_rank,
    k.rank AS fts_rank,
    (COALESCE(1.0/(60 + v.rank), 0) + COALESCE(1.0/(60 + k.rank), 0)) AS rrf_score
  FROM vector_search v FULL OUTER JOIN keyword_search k ON v.id = k.id
  ORDER BY rrf_score DESC;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 6. Auto-update triggers for updatedAt
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables that have updatedAt
DO $$ 
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_name IN (
            'tenants','users','employees','documents','sops','sop_versions',
            'sop_approvals','sop_artifacts','sop_audit_events','sop_risks','sop_compliance_items',
            'exit_interviews','clearance_checklists','clearance_items','clearance_instances',
            'clearance_tasks','knowledge_transfers','asset_returns','asset_return_items',
            'final_settlements','final_settlement_line_items','access_revocations',
            'access_revocation_requests','alumni_profiles','terminations','compliance_rules',
            'org_nodes','payrolls','payroll_runs'
          )
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%I_updated_at ON %I;', tbl, tbl);
        EXECUTE format('CREATE TRIGGER trg_%I_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();', tbl, tbl);
    END LOOP;
END $$;

-- =============================================================================
-- End of Migration
-- =============================================================================
