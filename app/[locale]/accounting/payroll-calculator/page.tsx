import { PayrollCalculator } from "@/components/features/accounting/payroll/payroll-calculator";

export default function PayrollCalculatorPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Payroll Calculator</h1>
      <PayrollCalculator />
    </div>
  );
}
