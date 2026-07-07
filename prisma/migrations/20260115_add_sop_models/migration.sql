-- Create SOP tables migration
CREATE TABLE "sops" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cuid',
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL
);

CREATE TABLE "sop_versions" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cuid',
    "version" INTEGER NOT NULL,
    "content" JSON NOT NULL,
    "summary" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "sopId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT NOT NULL,
    FOREIGN KEY ("sopId") REFERENCES "sops"("id") ON DELETE CASCADE,
    UNIQUE("sopId", "version")
);

CREATE TABLE "sop_approvals" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cuid',
    "sopId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "approvedBy" TEXT,
    "approvedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sopId") REFERENCES "sops"("id") ON DELETE CASCADE
);

CREATE TABLE "sop_risks" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cuid',
    "versionId" TEXT NOT NULL,
    "riskType" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mitigation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'identified',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE
);

CREATE TABLE "sop_compliance" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cuid',
    "versionId" TEXT NOT NULL,
    "regulation" TEXT NOT NULL,
    "requirement" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'UNASSESSED',
    "evidence" TEXT,
    "assessedBy" TEXT,
    "assessedAt" DATETIME,
    FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE
);

CREATE TABLE "sop_audit_events" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cuid',
    "sopId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "details" JSON,
    "ipAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("sopId") REFERENCES "sops"("id") ON DELETE CASCADE
);

CREATE TABLE "sop_artifacts" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'cuid',
    "versionId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT,
    "content" TEXT,
    "metadata" JSON,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploadedBy" TEXT NOT NULL,
    FOREIGN KEY ("versionId") REFERENCES "sop_versions"("id") ON DELETE CASCADE
);

CREATE INDEX "idx_sops_status" ON "sops"("status");
CREATE INDEX "idx_sops_department" ON "sops"("department");
CREATE INDEX "idx_sop_versions_sop_id" ON "sop_versions"("sopId");
CREATE INDEX "idx_sop_audit_events_sop_id" ON "sop_audit_events"("sopId");
