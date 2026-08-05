"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import LeanPage from "@/app/[locale]/opex/lean/page";

export default function CapexLeanPage() {
  return (
    <ProductLayout productId="capex">
      <LeanPage />
    </ProductLayout>
  );
}

