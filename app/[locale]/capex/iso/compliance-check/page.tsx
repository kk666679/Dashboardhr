"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import ComplianceCheckPage from "@/app/[locale]/iso/compliance-check/page";

export default function CapexComplianceCheckPage() {
  return (
    <ProductLayout productId="capex">
      <ComplianceCheckPage />
    </ProductLayout>
  );
}

