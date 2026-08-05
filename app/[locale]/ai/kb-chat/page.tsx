import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const KbAssistantWidget = dynamic(
  () => import("@/components/features/ai/kb-assistant-widget").then((m) => m.KbAssistantWidget),
  { loading: () => <div className="flex items-center justify-center py-16 text-muted-foreground gap-2"><Loader2 className="h-5 w-5 animate-spin" /><span>Loading…</span></div> }
);

export default function KbChatPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Knowledge Base Chat</h1>
      <KbAssistantWidget />
    </div>
  );
}
