"use client";

import { ProductLayout } from "@/components/platform/ProductLayout";
import KanbanPage from "@/app/[locale]/opex/kanban/page";

export default function CapexKanbanPage() {
  return (
    <ProductLayout productId="capex">
      <KanbanPage />
    </ProductLayout>
  );
}

