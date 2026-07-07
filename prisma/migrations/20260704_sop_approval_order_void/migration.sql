ALTER TYPE "SopApprovalStatus" ADD VALUE IF NOT EXISTS 'VOID';

ALTER TABLE "sop_approvals"
  ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS "sop_approvals_versionId_order_idx"
  ON "sop_approvals"("versionId", "order");
