"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Receipt, CreditCard, BarChart3, Bot, BookOpen } from "lucide-react";

const PDFPreview = dynamic(
  () =>
    import("@/components/features/documents/pdf/pdf-preview").then((m) => ({
      default: m.PDFPreview,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        Loading PDF viewer...
      </div>
    ),
  },
);

const AIDocGenerator = dynamic(
  () =>
    import("@/components/features/ai/ai-doc-generator").then((m) => ({
      default: m.AIDocGenerator,
    })),
  { ssr: false },
);

const HandbookGenerator = dynamic(
  () =>
    import("@/components/features/documents/handbook/handbook-generator").then((m) => ({
      default: m.HandbookGenerator,
    })),
  { ssr: false },
);

export default function PDFGeneratorPage() {
  const [selectedDocument, setSelectedDocument] = useState<
    "invoice" | "payslip" | "permit" | "report" | "handbook"
  >("invoice");
  const [documentData, setDocumentData] = useState<any>({});

  // Sample data for different document types
  const sampleData = {
    invoice: {
      invoiceNumber: "INV-2024-001",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      customerName: "ABC Construction Sdn Bhd",
      customerAddress: "123 Business Street, Kuala Lumpur 50450",
      customerEmail: "billing@abcconstruction.com.my",
      currency: "MYR",
      status: "pending",
      terms: "Net 30",
      items: [
        {
          description: "Foreign Worker Services - January 2024",
          quantity: 10,
          unitPrice: 500,
          total: 5000,
        },
        {
          description: "Permit Processing Fee",
          quantity: 10,
          unitPrice: 150,
          total: 1500,
        },
      ],
      subtotal: 6500,
      taxRate: 0.06,
      taxAmount: 390,
      total: 6890,
    },
    payslip: {
      workerName: "Ahmad Rahman",
      workerId: "FW-2024-001",
      position: "Construction Worker",
      department: "Operations",
      payPeriod: "January 2024",
      paymentDate: "2024-01-31",
      daysWorked: 26,
      basicSalary: 2500,
      overtimePay: 300,
      allowances: 200,
      grossPay: 3000,
      epfEmployee: 330,
      socsoEmployee: 37.5,
      eisEmployee: 6,
      pcbTax: 45,
      levyAmount: 154.17,
      netPay: 2427.33,
      epfEmployer: 360,
      socsoEmployer: 52.5,
      eisEmployer: 6,
    },
    permit: {
      permitNumber: "WP-2024-001",
      workerName: "Ahmad Rahman",
      passportNumber: "A12345678",
      nationality: "Bangladesh",
      dateOfBirth: "1990-05-15",
      gender: "Male",
      employerName: "ABC Construction Sdn Bhd",
      jobCategory: "Construction Worker",
      workLocation: "Kuala Lumpur",
      issueDate: "2024-01-01",
      expiryDate: "2024-12-31",
      status: "Active",
    },
    report: {
      reportType: "EPF Monthly Report",
      reportId: "EPF-2024-01",
      period: "January 2024",
      generatedBy: "System Administrator",
      totalRecords: 25,
      totalAmount: 17250,
      totalWorkers: 25,
      complianceStatus: "Compliant",
      headers: [
        "Worker Name",
        "EPF Number",
        "Basic Salary",
        "Employee Contribution",
        "Employer Contribution",
      ],
      rows: [
        ["Ahmad Rahman", "12345678", "2500.00", "275.00", "300.00"],
        ["Siti Aminah", "12345679", "2800.00", "308.00", "336.00"],
        ["Kumar Patel", "12345680", "3000.00", "330.00", "360.00"],
      ],
    },
    handbook: {
      companyName: "ABC Construction Sdn Bhd",
      employeeName: "",
      effectiveDate: new Date().toISOString().split('T')[0],
      sections: [
        {
          title: "Welcome to Our Company",
          content: "Welcome to ABC Construction! This handbook serves as your guide to our policies, procedures, and expectations.",
        },
        {
          title: "Code of Conduct",
          content: "All employees are expected to maintain professional behavior and adhere to ethical standards.",
        },
        {
          title: "Employee Benefits",
          content: "We offer competitive benefits including health insurance and paid leave.",
        },
      ],
    },
  };

  const handleDocumentChange = (
    type: "invoice" | "payslip" | "permit" | "report" | "handbook",
  ) => {
    setSelectedDocument(type);
    setDocumentData(sampleData[type]);
  };

  const handleDataChange = (field: string, value: any) => {
    setDocumentData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">PDF Generator</h1>
        <p className="text-gray-600">
          Generate professional PDF documents for FWMS
        </p>
      </div>

      <Tabs defaultValue="generator" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generator">Manual Generator</TabsTrigger>
          <TabsTrigger value="handbook">📖 Handbook</TabsTrigger>
          <TabsTrigger value="ai">🤖 AI Generator</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={
                      selectedDocument === "invoice" ? "default" : "outline"
                    }
                    onClick={() => handleDocumentChange("invoice")}
                    className="h-20 flex-col gap-2"
                  >
                    <FileText className="h-6 w-6" />
                    Invoice
                  </Button>
                  <Button
                    variant={
                      selectedDocument === "payslip" ? "default" : "outline"
                    }
                    onClick={() => handleDocumentChange("payslip")}
                    className="h-20 flex-col gap-2"
                  >
                    <Receipt className="h-6 w-6" />
                    Payslip
                  </Button>
                  <Button
                    variant={
                      selectedDocument === "permit" ? "default" : "outline"
                    }
                    onClick={() => handleDocumentChange("permit")}
                    className="h-20 flex-col gap-2"
                  >
                    <CreditCard className="h-6 w-6" />
                    Work Permit
                  </Button>
                  <Button
                    variant={
                      selectedDocument === "report" ? "default" : "outline"
                    }
                    onClick={() => handleDocumentChange("report")}
                    className="h-20 flex-col gap-2"
                  >
                    <BarChart3 className="h-6 w-6" />
                    Report
                  </Button>
                  <Button
                    variant={
                      selectedDocument === "handbook" ? "default" : "outline"
                    }
                    onClick={() => handleDocumentChange("handbook")}
                    className="h-20 flex-col gap-2"
                  >
                    <BookOpen className="h-6 w-6" />
                    Handbook
                  </Button>
                </div>

                {selectedDocument === "invoice" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input
                          id="invoiceNumber"
                          value={documentData.invoiceNumber || ""}
                          onChange={(e) =>
                            handleDataChange("invoiceNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="customerName">Customer Name</Label>
                        <Input
                          id="customerName"
                          value={documentData.customerName || ""}
                          onChange={(e) =>
                            handleDataChange("customerName", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="total">Total Amount</Label>
                      <Input
                        id="total"
                        type="number"
                        value={documentData.total || ""}
                        onChange={(e) =>
                          handleDataChange("total", parseFloat(e.target.value))
                        }
                      />
                    </div>
                  </div>
                )}

                {selectedDocument === "payslip" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="workerName">Worker Name</Label>
                        <Input
                          id="workerName"
                          value={documentData.workerName || ""}
                          onChange={(e) =>
                            handleDataChange("workerName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="payPeriod">Pay Period</Label>
                        <Input
                          id="payPeriod"
                          value={documentData.payPeriod || ""}
                          onChange={(e) =>
                            handleDataChange("payPeriod", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="basicSalary">Basic Salary</Label>
                      <Input
                        id="basicSalary"
                        type="number"
                        value={documentData.basicSalary || ""}
                        onChange={(e) =>
                          handleDataChange(
                            "basicSalary",
                            parseFloat(e.target.value),
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {selectedDocument === "permit" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="permitNumber">Permit Number</Label>
                        <Input
                          id="permitNumber"
                          value={documentData.permitNumber || ""}
                          onChange={(e) =>
                            handleDataChange("permitNumber", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="workerName">Worker Name</Label>
                        <Input
                          id="workerName"
                          value={documentData.workerName || ""}
                          onChange={(e) =>
                            handleDataChange("workerName", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="employerName">Employer Name</Label>
                      <Input
                        id="employerName"
                        value={documentData.employerName || ""}
                        onChange={(e) =>
                          handleDataChange("employerName", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {selectedDocument === "report" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reportType">Report Type</Label>
                      <Select
                        value={documentData.reportType || ""}
                        onValueChange={(value) =>
                          handleDataChange("reportType", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EPF Monthly Report">
                            EPF Monthly Report
                          </SelectItem>
                          <SelectItem value="SOCSO Report">
                            SOCSO Report
                          </SelectItem>
                          <SelectItem value="PCB Report">PCB Report</SelectItem>
                          <SelectItem value="Levy Report">
                            Foreign Worker Levy Report
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="period">Period</Label>
                      <Input
                        id="period"
                        value={documentData.period || ""}
                        onChange={(e) =>
                          handleDataChange("period", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}

                {selectedDocument === "handbook" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={documentData.companyName || ""}
                          onChange={(e) =>
                            handleDataChange("companyName", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="employeeName">Employee Name (Optional)</Label>
                        <Input
                          id="employeeName"
                          value={documentData.employeeName || ""}
                          onChange={(e) =>
                            handleDataChange("employeeName", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="effectiveDate">Effective Date</Label>
                      <Input
                        id="effectiveDate"
                        type="date"
                        value={documentData.effectiveDate || ""}
                        onChange={(e) =>
                          handleDataChange("effectiveDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <PDFPreview
              documentType={selectedDocument}
              data={documentData}
              onGenerate={() => {}}
            />
          </div>
        </TabsContent>

        <TabsContent value="handbook" className="space-y-4">
          <HandbookGenerator />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AIDocGenerator />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(sampleData).map(([type, data]) => (
              <Card
                key={type}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-sm capitalize">
                    {type} Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 mb-3">
                    Professional {type} template with Malaysian compliance
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleDocumentChange(type as any)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent PDF Generations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No PDF generation history available</p>
                <p className="text-sm">Generated PDFs will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
