-- =============================================================================
-- Migration: Add Audit Trail Immutability
-- =============================================================================
-- 
-- CRITICAL-3: Enforces append-only semantics on the `audit_trail` table.
-- 
-- Layer 1 — PostgreSQL Trigger:
--   Prevents UPDATE and DELETE operations at the database level.
--   This is the last line of defense; even if the application layer
--   (Prisma middleware) fails, the database will reject modifications.
-- 
-- Requirement: SOC 2 / ISO 27001 — Audit log immutability
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Create the trigger function that rejects UPDATE/DELETE
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_prevent_audit_trail_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'audit_trail is append-only: UPDATE/DELETE are not permitted (SOC 2 / ISO 27001)'
        USING HINT = 'Audit records are immutable. Create a new record instead.';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. Create the trigger on the audit_trail table
-- -----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS trg_audit_trail_immutable ON "audit_trail";
CREATE TRIGGER trg_audit_trail_immutable
    BEFORE UPDATE OR DELETE ON "audit_trail"
    FOR EACH ROW
    EXECUTE FUNCTION fn_prevent_audit_trail_modification();

-- -----------------------------------------------------------------------------
-- 3. Verify the trigger was created (optional documentation)
-- -----------------------------------------------------------------------------
-- To verify, run: 
--   SELECT tgname FROM pg_trigger WHERE tgname = 'trg_audit_trail_immutable';
-- To test the trigger, run:
--   UPDATE "audit_trail" SET "entityType" = 'test' WHERE "id" = 'nonexistent';
--   -- Expected: ERROR: audit_trail is append-only
</｜DSML｜parameter>
