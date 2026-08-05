"use client";

import { INTEGRATION_REGISTRY } from "@/lib/integrations/integration-registry";
import type { IntegrationDefinition } from "@/components/features/integrations/integration-center-types";
import { useMemo } from "react";

export default function GovernmentIntegrationsPage() {
  const governmentIntegrations = useMemo(() => {
    return INTEGRATION_REGISTRY.filter((i) =>
      ["GOV_HR", "GOV_SAFETY", "GOV_CORPORATE", "GOV_IMMIGRATION", "GOV_FINANCE"].includes(i.category)
    );
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Government Integrations</h1>
        <p className="text-muted-foreground">
          Malaysian government integrations available in the Integration Center.
        </p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-1)] p-4">
// AUTO-FLAG: TODO - needs implementation
        <div className="text-sm font-semibold">TODO: government integrations detail view</div>
        <p className="mt-1 text-xs text-muted-foreground">
          This page currently lists the configured government integrations and links back to the Integration Center.
          In a subsequent iteration, wire provider-specific configuration UI and actions using the config-driven integration framework.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {governmentIntegrations.map((integ) => (
          <div
            key={integ.id}
            className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-2)] p-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={integ.logo?.src ?? "/logo.svg"}
                  alt={integ.logo?.alt ?? integ.platformName}
                  className="h-6 w-6"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{integ.platformName}</div>
                <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {integ.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

