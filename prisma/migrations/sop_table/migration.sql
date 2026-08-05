-- ----------------------------
-- Enums (optional, for clarity)
-- ----------------------------
CREATE TYPE sop_status AS ENUM ('draft', 'in_review', 'approved', 'rejected', 'archived');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');

-- ----------------------------
-- Table: SopVersion
-- ----------------------------
CREATE TABLE sop_version (
    id              BIGSERIAL PRIMARY KEY,
    sop_id          TEXT NOT NULL,                     -- external identifier for the SOP
    version         TEXT NOT NULL,                     -- e.g., "1.0", "2.1"
    status          sop_status NOT NULL DEFAULT 'draft',
    content         JSONB NOT NULL,                    -- full SOP structure
    scores          JSONB,                             -- aggregated scores
    findings        JSONB,                             -- audit/assessment findings
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (sop_id, version)                          -- one version per SOP
);

-- Indexes for SopVersion
CREATE INDEX idx_sop_version_sop_id ON sop_version(sop_id);
CREATE INDEX idx_sop_version_status ON sop_version(status);

-- ----------------------------
-- Table: SopApproval
-- ----------------------------
CREATE TABLE sop_approval (
    id              BIGSERIAL PRIMARY KEY,
    version_id      BIGINT NOT NULL REFERENCES sop_version(id) ON DELETE CASCADE,
    approver_role   TEXT NOT NULL,                     -- e.g., "quality_manager", "regulatory"
    "order"         INTEGER NOT NULL,                  -- approval sequence
    status          approval_status NOT NULL DEFAULT 'pending',
    decided_by      TEXT,                              -- user/actor who decided
    decided_at      TIMESTAMPTZ,
    comment         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- ensure order is unique per version (optional)
    UNIQUE (version_id, "order")
);

CREATE INDEX idx_sop_approval_version_id ON sop_approval(version_id);
CREATE INDEX idx_sop_approval_status ON sop_approval(status);

-- ----------------------------
-- Table: SopArtifact
-- ----------------------------
CREATE TABLE sop_artifact (
    id              BIGSERIAL PRIMARY KEY,
    version_id      BIGINT NOT NULL REFERENCES sop_version(id) ON DELETE CASCADE,
    type            TEXT NOT NULL,                     -- e.g., "pdf", "spreadsheet", "screenshot"
    payload         JSONB NOT NULL,                    -- actual artifact data/metadata
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sop_artifact_version_id ON sop_artifact(version_id);

-- ----------------------------
-- Table: SopAuditEvent
-- ----------------------------
CREATE TABLE sop_audit_event (
    id              BIGSERIAL PRIMARY KEY,
    version_id      BIGINT NOT NULL REFERENCES sop_version(id) ON DELETE CASCADE,
    actor           TEXT NOT NULL,                     -- user/system that performed action
    action          TEXT NOT NULL,                     -- e.g., "create", "update", "approve"
    evidence        JSONB,                             -- additional context (diff, metadata)
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sop_audit_event_version_id ON sop_audit_event(version_id);
CREATE INDEX idx_sop_audit_event_created_at ON sop_audit_event(created_at);

-- ----------------------------
-- Table: SopComplianceItem (optional)
-- ----------------------------
CREATE TABLE sop_compliance_item (
    id              BIGSERIAL PRIMARY KEY,
    version_id      BIGINT NOT NULL REFERENCES sop_version(id) ON DELETE CASCADE,
    requirement     TEXT,                              -- e.g., "ISO 13485:2016 4.2.3"
    regulation      TEXT,                              -- e.g., "FDA 21 CFR Part 11"
    control         TEXT,                              -- internal control reference
    status          TEXT,                              -- e.g., "compliant", "non_compliant", "pending"
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sop_compliance_version_id ON sop_compliance_item(version_id);


-- ----------------------------
-- Automatic updated_at triggers (optional)
-- ----------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_sop_version_updated_at
    BEFORE UPDATE ON sop_version
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_sop_approval_updated_at
    BEFORE UPDATE ON sop_approval
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_sop_compliance_item_updated_at
    BEFORE UPDATE ON sop_compliance_item
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();