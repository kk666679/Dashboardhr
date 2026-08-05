import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const AIComplianceAgent = dynamic(
  () => import("@/components/features/ai/ai-compliance-agent").then((m) => m.AIComplianceAgent),
  { loading: () => <div className="flex items-center justify-center py-16 text-muted-foreground gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading…</span></div> }
);

export default function AICompliancePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Compliance AI Agent</h1>
      <AIComplianceAgent />
    </div>
  );
}
