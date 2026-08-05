"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Printer } from "lucide-react";
import { PDFGenerator } from "@/utils/pdf/pdf-generator";
import {
  DeliveryOrderPDFGenerator,
  type DeliveryOrderPDFData,
} from "@/utils/pdf/delivery-order-pdf";
import { pdfjs, Document as PDFDocument, Page as PDFPage } from "react-pdf";

interface PDFPreviewProps {
  documentType: "invoice" | "payslip" | "permit" | "report" | "delivery-order" | "handbook";
  data: unknown;
  onGenerate?: (blob: Blob) => void;
  className?: string;
}

export function PDFPreview({
  documentType,
  data,
  onGenerate,
}: PDFPreviewProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<"A4" | "Letter">("A4");

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let blob: Blob;

      switch (documentType) {
        case "invoice":
          blob = await PDFGenerator.generatePDF({ docType: "invoice", data: data as any });
          break;
        case "payslip":
          blob = await PDFGenerator.generatePDF({ docType: "payslip", data: data as any });
          break;
        case "permit":
          blob = await PDFGenerator.generatePDF({ docType: "permit", data: data as any });
          break;
        case "report":
          blob = await PDFGenerator.generatePDF({ docType: "report", data: data as any });
          break;
        case "delivery-order":
          blob = await DeliveryOrderPDFGenerator.generatePDF(
            data as DeliveryOrderPDFData,
          );
          break;
        case "handbook":
          blob = await PDFGenerator.generatePDF({ docType: "handbook", data: data as any });
          break;
        default:
          throw new Error("Unsupported document type");
      }

      const url = await PDFGenerator.previewPDF(blob);
      setPreviewUrl(url);
      onGenerate?.(blob);
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!previewUrl) return;

    const response = await fetch(previewUrl);
    const blob = await response.blob();
    const filename = `${documentType}-${Date.now()}.pdf`;
    await PDFGenerator.downloadPDF(blob, filename);
  };

  const getDocumentTitle = () => {
    const d = data as Record<string, unknown>;
    switch (documentType) {
      case "invoice":
        return `Invoice #${(d.invoiceNumber as string) || "Draft"}`;
      case "payslip":
        return `Payslip - ${(d.workerName as string) || "Worker"}`;
      case "permit":
        return `Work Permit - ${(d.permitNumber as string) || "Draft"}`;
      case "report":
        return `${(d.reportType as string) || "Government"} Report`;
      case "delivery-order":
        return `Delivery Order #${(d.orderNumber as string) || "Draft"}`;
      default:
        return "Document";
    }
  };

  const getDocumentIcon = () => {
    return <FileText className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getDocumentIcon()}
            {getDocumentTitle()}
          </div>
          <Badge variant="outline">{documentType.toUpperCase()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Select
            value={format}
            onValueChange={(value: "A4" | "Letter") => setFormat(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A4">A4</SelectItem>
              <SelectItem value="Letter">Letter</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Generate Preview
              </>
            )}
          </Button>
        </div>

        {previewUrl && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden h-96 p-2">
              <PDFDocument
                file={previewUrl}
                loading={
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Loading PDF...
                  </div>
                }
              >
                <PDFPage pageNumber={1} width={600} />
              </PDFDocument>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={() => window.open(previewUrl, "_blank")}
                variant="outline"
                className="flex-1"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>Document Details:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            {documentType === "invoice" && (() => {
              const d = data as Record<string, unknown>;
              return (<>
                <li>Customer: {String(d.customerName ?? "")}</li>
                <li>
                  Amount: {String(d.currency ?? "")} {(d.total as number)?.toFixed(2)}
                </li>
                <li>Due Date: {String(d.dueDate ?? "")}</li>
              </>);
            })()}
            {documentType === "payslip" && (() => {
              const d = data as Record<string, unknown>;
              return (<>
                <li>Worker: {String(d.workerName ?? "")}</li>
                <li>Period: {String(d.payPeriod ?? "")}</li>
                <li>Net Pay: RM {(d.netPay as number)?.toFixed(2)}</li>
              </>);
            })()}
            {documentType === "permit" && (() => {
              const d = data as Record<string, unknown>;
              return (<>
                <li>Worker: {String(d.workerName ?? "")}</li>
                <li>Permit No: {String(d.permitNumber ?? "")}</li>
                <li>Expiry: {String(d.expiryDate ?? "")}</li>
              </>);
            })()}
            {documentType === "report" && (() => {
              const d = data as Record<string, unknown>;
              return (<>
                <li>Type: {String(d.reportType ?? "")}</li>
                <li>Period: {String(d.period ?? "")}</li>
                <li>Records: {String(d.totalRecords ?? "")}</li>
              </>);
            })()}
            {documentType === "delivery-order" && (() => {
              const d = data as Record<string, unknown>;
              const customer = d.customer as Record<string, unknown> | undefined;
              const total = d.total as number | undefined;
              return (<>
                <li>Order No: {String(d.orderNumber ?? "")}</li>
                <li>Customer: {String(customer?.name ?? "")}</li>
                <li>Total: RM {total?.toFixed?.(2) ?? String(d.total ?? "")}</li>
              </>);
            })()}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
