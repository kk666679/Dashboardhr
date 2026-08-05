import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const AIEmployeeAgent = dynamic(
  () => import("@/components/features/ai/ai-employee-agent").then((m) => m.AIEmployeeAgent),
  { loading: () => <div className="flex items-center justify-center py-16 text-muted-foreground gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading…</span></div> }
);

export default function AIEmployeePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee AI Agent</h1>
      <AIEmployeeAgent />
    </div>
  );
}
