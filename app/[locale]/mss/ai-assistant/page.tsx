import { AIManagerAssistant } from "@/components/features/mss/AIManagerAssistant";

export default function MssAIAssistantPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">AI Manager Assistant</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Natural language workforce intelligence powered by OpenClaw</p>
      </div>
      <AIManagerAssistant />
    </div>
  );
}
