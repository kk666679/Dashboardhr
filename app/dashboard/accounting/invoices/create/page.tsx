"use client";

import { useRouter } from "next/navigation";
import { InvoiceForm } from "@/components/features/accounting/payroll/invoice-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateInvoicePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/accounting/invoices">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="text-muted-foreground">
            Generate a new Malaysian-compliant invoice with SST
          </p>
        </div>
      </div>
      <InvoiceForm
        onSubmit={(_data) => {
          router.push("/dashboard/accounting/invoices");
        }}
      />
    </div>
  );
}
