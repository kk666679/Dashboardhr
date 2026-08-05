"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import SixSigmaPage from "@/app/[locale]/opex/six-sigma/page";

export default function CapexSixSigmaPage() {
  return (
    <ProductLayout productId="capex">
      <SixSigmaPage />
    </ProductLayout>
  );
}

