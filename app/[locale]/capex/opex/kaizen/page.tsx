"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import KaizenPage from "@/app/[locale]/opex/kaizen/page";

export default function CapexKaizenPage() {
  return (
    <ProductLayout productId="capex">
      <KaizenPage />
    </ProductLayout>
  );
}

