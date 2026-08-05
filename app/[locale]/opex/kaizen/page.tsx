"use client";

import dynamic from "next/dynamic";

const Kaizen = dynamic(() => import("@/components/lean/kaizen/Kaizen"), {
  ssr: false,
  loading: () => (
    <div className="p-6 space-y-5">
      <div className="h-8 w-48 rounded-lg bg-[#161820] animate-pulse" />
      <div className="h-4 w-72 rounded-lg bg-[#161820] animate-pulse" />
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[#161820] animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 h-96 rounded-xl bg-[#161820] animate-pulse" />
        <div className="h-96 rounded-xl bg-[#161820] animate-pulse" />
      </div>
    </div>
  ),
});

export default function KaizenPage() {
  return <Kaizen />;
}

