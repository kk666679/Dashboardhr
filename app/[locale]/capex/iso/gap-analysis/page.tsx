"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import GapAnalysisPage from "@/app/[locale]/iso/gap-analysis/page";

export default function CapexGapAnalysisPage() {
  return (
    <ProductLayout productId="capex">
      <GapAnalysisPage />
    </ProductLayout>
  );
}

