import type { ReactNode } from "react";
import { ProductLayout } from "@/components/platform/ProductLayout";

export default function EmployeesLayout({ children }: { children: ReactNode }) {
  return (
    <ProductLayout productId="employees">
      {children}
    </ProductLayout>
  );
}

