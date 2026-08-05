"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import AuditChecklistPage from "@/app/[locale]/iso/audit-checklist/page";

export default function CapexAuditChecklistPage() {
  return (
    <ProductLayout productId="capex">
      <AuditChecklistPage />
    </ProductLayout>
  );
}

