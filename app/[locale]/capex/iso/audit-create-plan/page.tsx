"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import AuditCreatePlanPage from "@/app/[locale]/iso/audit-create-plan/page";

export default function CapexAuditCreatePlanPage() {
  return (
    <ProductLayout productId="capex">
      <AuditCreatePlanPage />
    </ProductLayout>
  );
}

