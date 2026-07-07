"use client";

import { useRouter } from "next/navigation";
import { PayrollAdjustmentForm } from "@/components/features/documents/payroll-adjustment-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PayrollAdjustmentPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/accounting/payroll">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Payroll Adjustment</h1>
          <p className="text-muted-foreground">
            Submit allowance or deduction adjustments
          </p>
        </div>
      </div>
      <PayrollAdjustmentForm
        onSuccess={() => router.push("/dashboard/accounting/payroll")}
        employeeOptions={[]}
        approverOptions={[]}
      />
    </div>
  );
}
