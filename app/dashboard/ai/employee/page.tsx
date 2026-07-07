import { AIEmployeeAgent } from "@/components/features/ai/ai-employee-agent";

export default function AIEmployeePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Agent</h1>
      <AIEmployeeAgent />
    </div>
  );
}
