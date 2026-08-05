"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import CAPACreatePage from "@/app/[locale]/iso/capa-create/page";

export default function CapexCAPACreatePage() {
  return (
    <ProductLayout productId="capex">
      <CAPACreatePage />
    </ProductLayout>
  );
}

