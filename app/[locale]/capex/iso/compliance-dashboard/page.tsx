"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import ComplianceDashboardPage from "@/app/[locale]/iso/compliance-dashboard/page";

export default function CapexComplianceDashboardPage() {
  return (
    <ProductLayout productId="capex">
      <ComplianceDashboardPage />
    </ProductLayout>
  );
}

