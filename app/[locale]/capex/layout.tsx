import type { ReactNode } from "react";
import { ProductLayout } from "@/components/platform/ProductLayout";

export default function CapexLayout({ children }: { children: ReactNode }) {
  return (
    <ProductLayout productId="capex">
      {children}
    </ProductLayout>
  );
}

