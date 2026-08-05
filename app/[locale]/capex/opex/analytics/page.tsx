"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import OpexAnalyticsPage from "@/app/[locale]/opex/analytics/page";

export default function CapexOpexAnalyticsPage() {
  return (
    <ProductLayout productId="capex">
      <OpexAnalyticsPage />
    </ProductLayout>
  );
}

