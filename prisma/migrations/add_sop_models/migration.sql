-- ============================================================
-- SOP Database Schema – Full Migration
-- ============================================================

-- Enable UUID generation (idempotent)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Table: sops
-- ============================================================
CREATE TABLE IF NOT EXISTS sops (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    department      TEXT NOT NULL,
    category        TEXT NOT NULL,
    status          TEXT NOT NULL DEFAULT 'DRAFT',
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by      TEXT NOT NULL
);

-- ============================================================
-- Table: sop_versions
-- ============================================================
CREATE TABLE IF NOT EXISTS sop_versions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version     INTEGER NOT NULL,
    content     JSONB NOT NULL,
    summary     TEXT,
    status      TEXT NOT NULL DEFAULT 'DRAFT',
    sop_id      UUID NOT NULL REFERENCES sops(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  TEXT NOT NULL,
    UNIQUE (sop_id, version)
);

-- ============================================================
-- Table: sop_approvals
-- ============================================================
CREATE TABLE IF NOT EXISTS sop_approvals (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_id       UUID NOT NULL REFERENCES sops(id) ON DELETE CASCADE,
    role         TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'PENDING',
    comments     TEXT,
    approved_by  TEXT,
    approved_at  TIMESTAMPTZ,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: sop_risks
-- ============================================================
CREATE TABLE IF NOT EXISTS sop_risks (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id   UUID NOT NULL REFERENCES sop_versions(id) ON DELETE CASCADE,
    risk_type    TEXT NOT NULL,
    severity     TEXT NOT NULL,
    description  TEXT NOT NULL,
    mitigation   TEXT,
    status       TEXT NOT NULL DEFAULT 'identified',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: sop_compliance
-- ============================================================
CREATE TABLE IF NOT EXISTS sop_compliance (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id   UUID NOT NULL REFERENCES sop_versions(id) ON DELETE CASCADE,
    regulation   TEXT NOT NULL,
    requirement  TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'UNASSESSED',
    evidence     TEXT,
    assessed_by  TEXT,
    assessed_at  TIMESTAMPTZ
);

-- ============================================================
-- Table: sop_audit_events
-- ============================================================
CREATE TABLE IF NOT EXISTS sop_audit_events (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sop_id       UUID NOT NULL REFERENCES sops(id) ON DELETE CASCADE,
    action       TEXT NOT NULL,
    user_id      TEXT NOT NULL,
    details      JSONB,
    ip_address   TEXT,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: sop_artifacts
-- ============================================================
CREATE TABLE IF NOT EXISTS sop_artifacts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id   UUID NOT NULL REFERENCES sop_versions(id) ON DELETE CASCADE,
    type         TEXT NOT NULL,
    url          TEXT,
    content      TEXT,
    metadata     JSONB,
    uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_by  TEXT NOT NULL
);

-- ============================================================
-- Indexes (for performance)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_sops_status ON sops (status);
CREATE INDEX IF NOT EXISTS idx_sops_department ON sops (department);
CREATE INDEX IF NOT EXISTS idx_sop_versions_sop_id ON sop_versions (sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_approvals_sop_id ON sop_approvals (sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_risks_version_id ON sop_risks (version_id);
CREATE INDEX IF NOT EXISTS idx_sop_compliance_version_id ON sop_compliance (version_id);
CREATE INDEX IF NOT EXISTS idx_sop_audit_events_sop_id ON sop_audit_events (sop_id);
CREATE INDEX IF NOT EXISTS idx_sop_artifacts_version_id ON sop_artifacts (version_id);

-- ============================================================
-- Auto‑update `updated_at` on the `sops` table
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sops_updated_at ON sops;
CREATE TRIGGER trg_sops_updated_at
    BEFORE UPDATE ON sops
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();