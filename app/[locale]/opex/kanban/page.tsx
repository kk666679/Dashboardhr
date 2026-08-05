"use client";

import dynamic from "next/dynamic";

const KanbanBoard = dynamic(() => import("@/components/lean/kanban/KanbanBoard"), {
  ssr: false,
  loading: () => (
    <div className="p-6 space-y-5">
      <div className="h-8 w-48 rounded-lg bg-[#161820] animate-pulse" />
      <div className="h-4 w-72 rounded-lg bg-[#161820] animate-pulse" />
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-[#161820] animate-pulse" />
        ))}
      </div>
      <div className="flex gap-3 overflow-x-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-60 h-96 rounded-xl bg-[#161820] animate-pulse shrink-0" />
        ))}
      </div>
    </div>
  ),
});

export default function KanbanPage() {
  return <KanbanBoard />;
}

