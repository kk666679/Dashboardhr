"use client";

import dynamic from "next/dynamic";

const SixSigma = dynamic(() => import("@/components/six-sigma/sixSigma"), {
  ssr: false,
  loading: () => (
    <div className="p-6 space-y-5">
      <div className="h-8 w-48 rounded-lg bg-[#161820] animate-pulse" />
      <div className="h-4 w-72 rounded-lg bg-[#161820] animate-pulse" />
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[#161820] animate-pulse" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-[#161820] animate-pulse" />
    </div>
  ),
});

export default function SixSigmaPage() {
  return <SixSigma />;
}

