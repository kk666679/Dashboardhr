import type { ReactNode } from "react";
import { ProductLayout } from "@/components/platform/ProductLayout";

export default function AutomationLayout({ children }: { children: ReactNode }) {
  return (
    <ProductLayout productId="automation">
      {children}
    </ProductLayout>
  );
}

