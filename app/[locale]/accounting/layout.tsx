import type { ReactNode } from "react";
import { ProductLayout } from "@/components/platform/ProductLayout";

export default function AccountingLayout({ children }: { children: ReactNode }) {
  return (
    <ProductLayout productId="accounting">
      {children}
    </ProductLayout>
  );
}

