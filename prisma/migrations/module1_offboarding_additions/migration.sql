-- =============================================================================
-- Migration: Multi-tenant HR, SOP & RAG / Hybrid Search Schema
-- =============================================================================

-- Enable pgvector (if not already)
CREATE EXTENSION IF NOT EXISTS vector;

-- -----------------------------------------------------------------------------
-- 1. Create Enums
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

-- SopApprovalStatus (replace old enum, if any)
DROP TYPE IF EXISTS "SopApprovalStatus";
CREATE TYPE "SopApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'VOID');

-- -----------------------------------------------------------------------------
-- 2. Drop old (legacy) tables (if they exist)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS "sop_approval" CASCADE;
DROP TABLE IF EXISTS "sop_artifact" CASCADE;
DROP TABLE IF EXISTS "sop_audit_event" CASCADE;
DROP TABLE IF EXISTS "sop_compliance" CASCADE;
DROP TABLE IF EXISTS "sop_compliance_item" CASCADE;
DROP TABLE IF EXISTS "sop_version" CASCADE;
DROP TYPE IF EXISTS "approval_status";
DROP TYPE IF EXISTS "sop_status";

-- -----------------------------------------------------------------------------
-- 3. Create Tables (all with TEXT primary keys)
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
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'employees'
      AND column_name = 'tenantId'
  ) THEN
    CREATE INDEX IF NOT EXISTS "employees_tenantId_idx" ON "employees"("tenantId");
    CREATE INDEX IF NOT EXISTS "employees_tenantId_name_idx" ON "employees"("tenantId", "name");
  END IF;
END $$;

-- ---------- Documents (with RAG / hybrid search support) ----------
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
    "contentEmbedding" vector(1536),          -- matches the 1536‑dim embeddings
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

-- Indexes for vector similarity & FTS
CREATE INDEX "documents_hnsw_idx" ON "documents" USING hnsw ("contentEmbedding" vector_cosine_ops);
CREATE INDEX "documents_fts_idx" ON "documents" USING GIN ("searchVector");
CREATE INDEX "documents_hash_idx" ON "documents" ("contentHash");
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'documents'
      AND column_name = 'tenantId'
  ) THEN
    CREATE INDEX IF NOT EXISTS "documents_tenant_idx" ON "documents" ("tenantId");
    CREATE INDEX IF NOT EXISTS "documents_tenantId_employeeId_idx" ON "documents"("tenantId", "employeeId");
  END IF;
END $$;
CREATE INDEX "documents_status_expiryDate_idx" ON "documents"("status", "expiryDate");
CREATE UNIQUE INDEX "documents_weaviateId_key" ON "documents"("weaviateId") WHERE "weaviateId" IS NOT NULL;

-- ---------- SOP Tables ----------
-- sops
CREATE TABLE IF NOT EXISTS "sops" (
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
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'sops'
      AND column_name = 'tenantId'
  ) THEN
    CREATE INDEX IF NOT EXISTS "sops_tenantId_department_idx" ON "sops"("tenantId", "department");
    CREATE UNIQUE INDEX IF NOT EXISTS "sops_tenantId_code_key" ON "sops"("tenantId", "code");
  END IF;
END $$;

-- sop_versions
CREATE TABLE IF NOT EXISTS "sop_versions" (
    "id" TEXT NOT NULL,
    "sopId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT,
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

-- sop_risks
CREATE TABLE "sop_risks" (
    "id" TEXT NOT NULL,
    "versionId" TEXT NOT NULL,
    "risk" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "impact" TEXT,
    "likelihood" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sop_risks_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "sop_risks_versionId_idx" ON "sop_risks"("versionId");

-- ---------- Other tables (compliance, org nodes, audit trail) ----------
-- These are minimal definitions; adjust to your actual requirements.
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
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'compliance_rules'
      AND column_name = 'tenantId'
  ) THEN
    CREATE INDEX IF NOT EXISTS "compliance_rules_tenantId_idx" ON "compliance_rules"("tenantId");
  END IF;
END $$;

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
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'org_nodes'
      AND column_name = 'tenantId'
  ) THEN
    CREATE INDEX IF NOT EXISTS "org_nodes_tenantId_parentId_idx" ON "org_nodes"("tenantId", "parentId");
  END IF;
END $$;

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
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'audit_trail'
      AND column_name = 'tenantId'
  ) THEN
    CREATE INDEX IF NOT EXISTS "audit_trail_tenantId_createdAt_idx" ON "audit_trail"("tenantId", "createdAt" DESC);
  END IF;
END $$;

-- (Add any other tables here, e.g., payroll, attendance, etc.)

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

-- SOP foreign keys
ALTER TABLE "sop_versions" ADD CONSTRAINT "sop_versions_sopId_fkey" FOREIGN KEY ("sopId") REFERENCES "sops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_approvals" ADD CONSTRAINT "sop_approvals_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_artifacts" ADD CONSTRAINT "sop_artifacts_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_audit_events" ADD CONSTRAINT "sop_audit_events_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sop_risks" ADD CONSTRAINT "sop_risks_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
-- End of Migration
-- =============================================================================