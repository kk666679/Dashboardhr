"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import AuditGeneratePage from "@/app/[locale]/iso/audit-generate/page";

export default function CapexAuditGeneratePage() {
  return (
    <ProductLayout productId="capex">
      <AuditGeneratePage />
    </ProductLayout>
  );
}

