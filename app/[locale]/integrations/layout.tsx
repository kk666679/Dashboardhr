import type { ReactNode } from "react";
import { ProductLayout } from "@/components/platform/ProductLayout";

export default function IntegrationsLayout({ children }: { children: ReactNode }) {
  return (
    <ProductLayout productId="integrations">
      {children}
    </ProductLayout>
  );
}

