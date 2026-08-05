"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import FishbonePage from "@/app/[locale]/iso/fishbone/page";

export default function CapexFishbonePage() {
  return (
    <ProductLayout productId="capex">
      <FishbonePage />
    </ProductLayout>
  );
}

