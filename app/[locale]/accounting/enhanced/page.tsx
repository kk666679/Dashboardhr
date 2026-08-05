"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FinancialDashboard = dynamic(
  () => import("@/components/features/accounting/financial-dashboard").then((m) => m.FinancialDashboard),
  { ssr: false }
);
const PayrollCalculator = dynamic(
  () => import("@/components/features/accounting/payroll/payroll-calculator").then((m) => m.PayrollCalculator),
  { ssr: false }
);
const GovernmentSubmissions = dynamic(
  () => import("@/components/features/accounting/government-submissions").then((m) => m.GovernmentSubmissions),
  { ssr: false }
);
const EInvoiceManager = dynamic(
  () => import("@/components/features/accounting/einvoice-manager").then((m) => m.EInvoiceManager),
  { ssr: false }
);

export default function EnhancedAccountingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enhanced Accounting Module</h1>
        <p className="text-gray-600">
          Malaysian-compliant accounting with payroll, tax, and government
          integration
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="government">Government</TabsTrigger>
          <TabsTrigger value="einvoice">E-Invoice</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <FinancialDashboard />
        </TabsContent>

        <TabsContent value="payroll">
          <PayrollCalculator />
        </TabsContent>

        <TabsContent value="government">
          <GovernmentSubmissions />
        </TabsContent>

        <TabsContent value="einvoice">
          <EInvoiceManager />
        </TabsContent>

        <TabsContent value="reports">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Financial Reports</h3>
            <p className="text-gray-600">
              Advanced reporting features coming soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
