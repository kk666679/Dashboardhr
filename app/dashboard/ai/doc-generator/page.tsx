import { AIDocGenerator } from "@/components/features/ai/ai-doc-generator";

export const dynamic = "force-dynamic";

export default function AIDocGeneratorPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Document Generator</h1>
      <AIDocGenerator />
    </div>
  );
}
