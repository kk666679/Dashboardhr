-- Tenant-scoped feature flag configuration for gradual, auditable rollouts.
CREATE TABLE IF NOT EXISTS "feature_flags" (
  "id" TEXT NOT NULL,
  "tenantId" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "rolloutPercentage" INTEGER NOT NULL DEFAULT 100,
  "createdBy" TEXT,
  "updatedBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "feature_flags_tenantId_fkey"
    FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "feature_flags_tenantId_key_key" UNIQUE ("tenantId", "key"),
  CONSTRAINT "feature_flags_rolloutPercentage_check"
    CHECK ("rolloutPercentage" BETWEEN 0 AND 100)
);

CREATE INDEX IF NOT EXISTS "feature_flags_tenantId_enabled_idx"
  ON "feature_flags"("tenantId", "enabled");
