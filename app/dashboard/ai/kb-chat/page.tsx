import { KbAssistantWidget } from "@/components/features/ai/kb-assistant-widget";

export default function KbChatPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <KbAssistantWidget variant="alwaysOpen" />
    </div>
  );
}
