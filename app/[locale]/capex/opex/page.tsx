"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import OpexOverviewPage from "@/app/[locale]/opex/page";

export default function CapexOpexOverviewPage() {
  return (
    <ProductLayout productId="capex">
      <OpexOverviewPage />
    </ProductLayout>
  );
}

