-- ============================================================
-- Enable UUID generation (idempotent)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- Enums – created conditionally (works on all PostgreSQL versions)
-- ============================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SopApprovalStatus') THEN
        -- Create enum without the VOID value first, so later migrations can safely add it.
        CREATE TYPE "SopApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN');
    END IF;
END $$;

-- Ensure VOID exists for this migration chain.
ALTER TYPE "SopApprovalStatus" ADD VALUE IF NOT EXISTS 'VOID';


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
-- Table: sop_approvals (now per version, with sort_order)
-- NOTE: This migration must be resilient to earlier migration variants
-- (id types + table naming differences). We therefore create the table
-- and then conditionally add the `version_id` column / constraints / indexes.
-- ============================================================
DO $$ BEGIN
    -- Ensure table exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'sop_approvals'
    ) THEN
        CREATE TABLE sop_approvals (
            id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            version_id   UUID NOT NULL REFERENCES sop_versions(id) ON DELETE CASCADE,
            role         TEXT NOT NULL,
            status       sop_approval_status NOT NULL DEFAULT 'PENDING',
            sort_order   INTEGER NOT NULL DEFAULT 1,          -- avoids reserved keyword
            comments     TEXT,
            approved_by  TEXT,
            approved_at  TIMESTAMPTZ,
            created_at   TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (version_id, sort_order)                   -- unique ordering per version
        );
    END IF;
END $$;

-- Conditionally add version_id column if it doesn't exist.
DO $$ BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'sop_approvals'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'sop_approvals' AND column_name = 'version_id'
    ) THEN
        ALTER TABLE sop_approvals
            ADD COLUMN version_id UUID;

        -- If sop_versions exists, backfill/constraint may fail if data is incompatible;
        -- we only add the FK constraint if the referenced table exists.
        IF EXISTS (
            SELECT 1 FROM information_schema.tables
            WHERE table_schema = 'public' AND table_name = 'sop_versions'
        ) THEN
            ALTER TABLE sop_approvals
                ADD CONSTRAINT sop_approvals_version_id_fkey
                FOREIGN KEY (version_id) REFERENCES sop_versions(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- Ensure sort_order / unique / status default exist.
-- (These are safe to re-run and will be no-ops if already present.)
ALTER TABLE sop_approvals
    ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 1;

ALTER TABLE sop_approvals
    ALTER COLUMN status SET DEFAULT 'PENDING';

DO $$ BEGIN
    -- Unique ordering per version_id (only if version_id column exists)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'sop_approvals' AND column_name = 'version_id'
    ) THEN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'sop_approvals_version_id_sort_order_unique'
        ) THEN
            ALTER TABLE sop_approvals
                ADD CONSTRAINT sop_approvals_version_id_sort_order_unique
                UNIQUE (version_id, sort_order);
        END IF;
    END IF;
END $$;


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
-- Indexes (including the new one for version_id + sort_order)
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_sops_status ON sops (status);
CREATE INDEX IF NOT EXISTS idx_sops_department ON sops (department);

CREATE INDEX IF NOT EXISTS idx_sop_versions_sop_id ON sop_versions (sop_id);

CREATE INDEX IF NOT EXISTS idx_sop_approvals_version_id ON sop_approvals (version_id);
CREATE INDEX IF NOT EXISTS idx_sop_approvals_status ON sop_approvals (status);
CREATE INDEX IF NOT EXISTS idx_sop_approvals_version_sort ON sop_approvals (version_id, sort_order);  -- your new index

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