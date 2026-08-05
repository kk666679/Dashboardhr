"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  FileText,
  Receipt,
  CreditCard,
  BarChart3,
  Download,
  Bot,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { AIDocType } from "@/types/ai-docs";
import dynamic from "next/dynamic";
import { KbChat } from "@/components/dashboard-sidebar/kb-chat";
const PDFPreview = dynamic(
  () => import("@/components/features/pdf/pdf-preview").then((m) => m.PDFPreview),
  { ssr: false }
);


const DOC_TYPES: Array<{
  value: AIDocType;
  label: string;
  icon: React.ReactNode;
}> = [
  { value: "invoice", label: "Invoice", icon: <Receipt className="h-4 w-4" /> },
  {
    value: "payslip",
    label: "Payslip",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    value: "permit",
    label: "Work Permit",
    icon: <CreditCard className="h-4 w-4" />,
  },
  { value: "report", label: "Report", icon: <BarChart3 className="h-4 w-4" /> },
  {
    value: "delivery-order",
    label: "Delivery Order",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    value: "handbook",
    label: "Employee Handbook",
    icon: <BookOpen className="h-4 w-4" />,
  },
];

export function AIDocGenerator() {
  const [docType, setDocType] = useState<AIDocType>("invoice");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const { toast } = useToast();

  const generateDocument = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ai/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          docType,
          context: {
            workerName: context || "John Doe",
            employerName: "ABC Construction Sdn Bhd",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      const result = await response.json();
      setPdfData(result.data);
      setPdfUrl(result.pdfUrl);

      toast({
        title: "Document Generated!",
        description: `AI generated ${docType} ready for preview/download.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: (error as Error).message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [docType, context, toast]);

  const downloadPDF = useCallback(() => {
    if (pdfUrl) {
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = `${docType}-ai-generated.pdf`;
      a.click();
    }
  }, [pdfUrl, docType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Document Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Document Type
              </label>
              <Select
                value={docType}
                onValueChange={(value) => setDocType(value as AIDocType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map(({ value, label, icon }) => (
                    <SelectItem key={value} value={value}>
                      <div className="flex items-center gap-2">
                        {icon}
                        {label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Context (e.g. worker name)
              </label>
              <Input
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Enter worker name, period, etc."
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateDocument}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Generate {docType.toUpperCase()}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {pdfData && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated Document</CardTitle>
            <Badge variant="secondary" className="text-xs">
              AI Generated
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {pdfUrl ? (
              <>
                <PDFPreview
                  documentType={docType}
                  data={pdfData}
                  className="w-full h-96 bg-gray-50 rounded-lg border"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={downloadPDF}
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => {
                      setPdfData(null);
                      setPdfUrl("");
                      setContext("");
                    }}
                    variant="ghost"
                  >
                    New Document
                  </Button>
                </div>
              </>
            ) : (
              <p>No preview available. Use "Generate" button.</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pro Tip */}
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Bot className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Powered by AI</h3>
          <p className="text-sm text-muted-foreground">
            Enter context like "worker John Doe, January 2024" and generate
            compliant Malaysian HR documents instantly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
