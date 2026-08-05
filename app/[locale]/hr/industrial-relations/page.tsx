"use client";

import dynamic from "next/dynamic";

const IndustrialRelations = dynamic(
  () =>
    import("@/components/features/industrial-relations/IndustrialRelations").then(
      (m) => m.IndustrialRelations
    ),
  { ssr: false }
);

export default function IndustrialRelationsPage() {
  return <IndustrialRelations />;
}
