"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import ComplianceScorePage from "@/app/[locale]/iso/compliance-score/page";

export default function CapexComplianceScorePage() {
  return (
    <ProductLayout productId="capex">
      <ComplianceScorePage />
    </ProductLayout>
  );
}

