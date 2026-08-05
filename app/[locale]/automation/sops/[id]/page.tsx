"use client";

import SopDetail from "@/components/features/sop/SopDetail";
import { use } from "react";

export default function SopDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <SopDetail sopId={id} />;
}
