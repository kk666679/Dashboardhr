"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import ISODashboard from "@/app/[locale]/iso/page";

export default function CapexISODashboardPage() {
  return (
    <ProductLayout productId="capex">
      <ISODashboard />
    </ProductLayout>
  );
}

