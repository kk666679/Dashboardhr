import type { ReactNode } from "react";
import { ProductLayout } from "@/components/platform/ProductLayout";

export default function AILayout({ children }: { children: ReactNode }) {
  return (
    <ProductLayout productId="ai">
      {children}
    </ProductLayout>
  );
}

