import { AIPayrollAgent } from "@/components/features/ai/ai-payroll-agent";

export default function AIPayrollPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payroll Agent</h1>
      <AIPayrollAgent />
    </div>
  );
}
