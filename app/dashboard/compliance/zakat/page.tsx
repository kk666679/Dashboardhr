"use client";

import dynamic from "next/dynamic";

const ZakatCalculatorWidget = dynamic(
  () =>
    import("@/components/features/zakat/ZakatCalculatorWidget").then(
      (m) => m.ZakatCalculatorWidget
    ),
  { ssr: false }
);

export default function ZakatPage() {
  return <ZakatCalculatorWidget />;
}
