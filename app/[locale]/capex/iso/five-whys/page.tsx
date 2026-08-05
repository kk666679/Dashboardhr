"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import FiveWhysPage from "@/app/[locale]/iso/five-whys/page";

export default function CapexFiveWhysPage() {
  return (
    <ProductLayout productId="capex">
      <FiveWhysPage />
    </ProductLayout>
  );
}

