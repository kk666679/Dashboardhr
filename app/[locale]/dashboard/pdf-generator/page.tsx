
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  Receipt,
  CreditCard,
  BarChart3,
  Bot,
  BookOpen,
  Eye,
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  Users,
  Clock,
  Download,
  FileJson,
  FileSpreadsheet,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Share2,
  GitBranch,
  CheckCircle,
  AlertCircle,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  MessageSquare,
  Lightbulb,
  Layers,
  History,
  Undo,
  Redo,
  Save,
  Cloud,
  CloudOff,
} from "lucide-react";
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewNavigationButton,
} from "@/components/ai-elements/web-preview";
import { Conversation, ConversationContent, ConversationEmptyState, ConversationTypingIndicator } from "@/components/ai-elements/conversation";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Agent, AgentHeader, AgentStatusDot, AgentContent, AgentMetrics } from "@/components/ai-elements/agent";
import { Timeline, TimelineEventItem, TimelineHeader } from "@/components/ai-elements/timeline";
import { Sources, SourcesTrigger, SourcesContent, Source } from "@/components/ai-elements/sources";
import { useKbChat } from "@/hooks/useKbChat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getAllLevyRates } from "@/lib/constants/levy-rates";
// ─── Dynamic imports ──────────────────────────────────────────────────────────

const PDFPreview = dynamic(
  () =>
    import("@/components/features/pdf/pdf-preview").then((m) => ({
      default: m.PDFPreview,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        Loading PDF viewer...
      </div>
    ),
  }
);

const AIDocGenerator = dynamic(
  () =>
    import("@/components/features/ai/ai-doc-generator").then((m) => ({
      default: m.AIDocGenerator,
    })),
  { ssr: false }
);

const HandbookGenerator = dynamic(
  () =>
    import("@/components/features/handbook/handbook-generator").then((m) => ({
      default: m.HandbookGenerator,
    })),
  { ssr: false }
);

// ─── Comprehensive HTML document generator ──────────────────────────────────

function generateDocumentHTML(type: string, data: any): string {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: data.currency || "MYR",
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-MY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f3f4f6;
      padding: 40px 20px;
      color: #1f2937;
    }
    .document {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05);
      padding: 48px 56px;
      position: relative;
    }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px; }
    .company { display: flex; flex-direction: column; gap: 4px; }
    .company-name { font-size: 22px; font-weight: 700; color: #111827; }
    .company-detail { font-size: 13px; color: #4b5563; }
    .doc-title { font-size: 28px; font-weight: 700; color: #111827; }
    .doc-subtitle { font-size: 14px; color: #6b7280; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .field { display: flex; flex-direction: column; gap: 2px; }
    .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; color: #6b7280; }
    .value { font-size: 15px; font-weight: 500; color: #111827; }
    .table-wrap { margin: 20px 0; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { background: #f9fafb; text-align: left; padding: 10px 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
    td { padding: 10px 14px; border-bottom: 1px solid #e5e7eb; }
    .text-right { text-align: right; }
    .total-row td { font-weight: 600; border-top: 2px solid #d1d5db; }
    .total-amount { font-size: 18px; font-weight: 700; color: #111827; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-warning { background: #fef3c7; color: #92400e; }
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-info { background: #dbeafe; color: #1e40af; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; display: flex; justify-content: space-between; }
    .terms { font-size: 13px; color: #6b7280; margin-top: 16px; line-height: 1.5; }
    .signature { display: flex; justify-content: space-between; margin-top: 32px; }
    .signature-box { border-top: 1px solid #d1d5db; padding-top: 8px; min-width: 180px; }
    .signature-box span { font-size: 13px; color: #6b7280; }
    @media print { body { background: white; padding: 0; } .document { box-shadow: none; border-radius: 0; padding: 40px; } }
  `;

  let body = "";

  switch (type) {
    case "invoice": {
      const items = data.items || [];
      const subtotal = data.subtotal || 0;
      const taxRate = data.taxRate || 0;
      const taxAmount = data.taxAmount || 0;
      const total = data.total || 0;
      const statusBadge =
        data.status === "paid" ? "badge-success" : data.status === "overdue" ? "badge-danger" : "badge-warning";

      body = `
        <div class="document">
          <div class="header">
            <div class="company">
              <div class="company-name">${data.companyName || "ABC Construction Sdn Bhd"}</div>
              <div class="company-detail">${data.companyAddress || "123 Business Street, Kuala Lumpur 50450"}</div>
              <div class="company-detail">${data.companyPhone || "03-8886 3000"} · ${data.companyEmail || "info@abcconstruction.com.my"}</div>
              <div class="company-detail">SST Reg: ${data.companySst || "00123456789"}</div>
            </div>
            <div style="text-align:right;">
              <div class="doc-title">INVOICE</div>
              <div class="doc-subtitle">#${data.invoiceNumber || "INV-2024-001"}</div>
              <div style="margin-top:8px;"><span class="badge ${statusBadge}">${data.status || "Pending"}</span></div>
            </div>
          </div>
          <div class="grid-2">
            <div class="field">
              <span class="label">Bill To</span>
              <span class="value">${data.customerName || "Customer"}</span>
              <span class="value" style="font-weight:400;color:#4b5563;">${data.customerAddress || ""}</span>
              <span class="value" style="font-weight:400;color:#4b5563;">${data.customerPhone || ""}</span>
              <span class="value" style="font-weight:400;color:#4b5563;">${data.customerEmail || ""}</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end;">
              <div class="field"><span class="label">Invoice Date</span><span class="value">${formatDate(data.issueDate)}</span></div>
              <div class="field"><span class="label">Due Date</span><span class="value">${formatDate(data.dueDate)}</span></div>
              <div class="field"><span class="label">Terms</span><span class="value">${data.terms || "Net 30"}</span></div>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Description</th><th class="text-right">Qty</th><th class="text-right">Unit Price</th><th class="text-right">Total</th></tr></thead>
              <tbody>
                ${items.map((item: any) => `
                  <tr><td>${item.description}</td><td class="text-right">${item.quantity || 0}</td><td class="text-right">${formatCurrency(item.unitPrice || 0)}</td><td class="text-right">${formatCurrency(item.total || 0)}</td></tr>
                `).join('')}
                <tr class="total-row"><td colspan="3" class="text-right">Subtotal</td><td class="text-right">${formatCurrency(subtotal)}</td></tr>
                ${taxRate > 0 ? `<tr><td colspan="3" class="text-right">SST (${(taxRate * 100).toFixed(0)}%)</td><td class="text-right">${formatCurrency(taxAmount)}</td></tr>` : ''}
                <tr class="total-row"><td colspan="3" class="text-right total-amount">Total</td><td class="text-right total-amount">${formatCurrency(total)}</td></tr>
              </tbody>
            </table>
          </div>
          ${data.notes ? `<div class="terms">${data.notes}</div>` : ''}
          <div class="terms">Payment instructions: Please transfer to bank account XYZ-1234-5678 (Maybank). Reference: ${data.invoiceNumber}</div>
          <div class="signature"><div class="signature-box"><span>Authorized Signature</span></div><div class="signature-box"><span>Date</span></div></div>
          <div class="footer"><span>Thank you for your business!</span><span>Page 1/1</span></div>
        </div>
      `;
      break;
    }

    case "payslip": {
      const basic = data.basicSalary || 0;
      const overtime = data.overtimePay || 0;
      const allowances = data.allowances || 0;
      const gross = data.grossPay || 0;
      const epfEmp = data.epfEmployee || 0;
      const socsoEmp = data.socsoEmployee || 0;
      const eisEmp = data.eisEmployee || 0;
      const pcb = data.pcbTax || 0;
      const levy = data.levyAmount || 0;
      const net = data.netPay || 0;

      body = `
        <div class="document">
          <div class="header">
            <div class="company">
              <div class="company-name">${data.companyName || "ABC Construction Sdn Bhd"}</div>
              <div class="company-detail">${data.companyAddress || "123 Business Street, Kuala Lumpur 50450"}</div>
            </div>
            <div style="text-align:right;">
              <div class="doc-title">PAYSLIP</div>
              <div class="doc-subtitle">${data.payPeriod || "January 2024"}</div>
            </div>
          </div>
          <div class="grid-2">
            <div class="field"><span class="label">Employee</span><span class="value">${data.workerName || "Ahmad Rahman"}</span></div>
            <div class="field"><span class="label">Employee ID</span><span class="value">${data.workerId || "FW-2024-001"}</span></div>
            <div class="field"><span class="label">Position</span><span class="value">${data.position || "Construction Worker"}</span></div>
            <div class="field"><span class="label">Department</span><span class="value">${data.department || "Operations"}</span></div>
            <div class="field"><span class="label">Payment Date</span><span class="value">${formatDate(data.paymentDate)}</span></div>
            <div class="field"><span class="label">Days Worked</span><span class="value">${data.daysWorked || 26}</span></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:30px;margin:20px 0;">
            <div>
              <h4 style="font-size:14px;font-weight:600;margin-bottom:8px;color:#374151;">Earnings</h4>
              <table style="font-size:14px;width:100%;">
                <tbody>
                  <tr><td>Basic Salary</td><td class="text-right">${formatCurrency(basic)}</td></tr>
                  <tr><td>Overtime</td><td class="text-right">${formatCurrency(overtime)}</td></tr>
                  <tr><td>Allowances</td><td class="text-right">${formatCurrency(allowances)}</td></tr>
                  <tr style="font-weight:600;border-top:2px solid #d1d5db;"><td>Gross Pay</td><td class="text-right">${formatCurrency(gross)}</td></tr>
                </tbody>
              </table>
            </div>
            <div>
              <h4 style="font-size:14px;font-weight:600;margin-bottom:8px;color:#374151;">Deductions</h4>
              <table style="font-size:14px;width:100%;">
                <tbody>
                  <tr><td>EPF (Employee)</td><td class="text-right">${formatCurrency(epfEmp)}</td></tr>
                  <tr><td>SOCSO</td><td class="text-right">${formatCurrency(socsoEmp)}</td></tr>
                  <tr><td>EIS</td><td class="text-right">${formatCurrency(eisEmp)}</td></tr>
                  <tr><td>PCB</td><td class="text-right">${formatCurrency(pcb)}</td></tr>
                  <tr><td>Levy</td><td class="text-right">${formatCurrency(levy)}</td></tr>
                  <tr style="font-weight:600;border-top:2px solid #d1d5db;"><td>Total Deductions</td><td class="text-right">${formatCurrency(epfEmp + socsoEmp + eisEmp + pcb + levy)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;background:#f9fafb;padding:16px;border-radius:8px;margin:16px 0;">
            <div><div style="font-size:13px;color:#6b7280;">Net Pay</div><div style="font-size:24px;font-weight:700;color:#111827;">${formatCurrency(net)}</div></div>
            <div style="text-align:right;font-size:13px;color:#6b7280;">
              <div>EPF Employer: ${formatCurrency(data.epfEmployer || 0)}</div>
              <div>SOCSO Employer: ${formatCurrency(data.socsoEmployer || 0)}</div>
              <div>EIS Employer: ${formatCurrency(data.eisEmployer || 0)}</div>
            </div>
          </div>
          <div class="footer"><span>This is a computer-generated payslip. No signature required.</span><span>Page 1/1</span></div>
        </div>
      `;
      break;
    }

    case "permit": {
      body = `
        <div class="document">
          <div style="text-align:center;border-bottom:2px solid #e5e7eb;padding-bottom:16px;margin-bottom:24px;">
            <div style="font-size:14px;color:#6b7280;">GOVERNMENT OF MALAYSIA</div>
            <div style="font-size:18px;font-weight:700;margin:4px 0;">WORK PERMIT</div>
            <div style="font-size:14px;color:#6b7280;">Immigration Department of Malaysia</div>
          </div>
          <div style="display:flex;justify-content:space-between;margin-bottom:20px;">
            <div style="font-size:14px;font-weight:600;">Permit No: ${data.permitNumber || "WP-2024-001"}</div>
            <div style="font-size:14px;color:#6b7280;">Status: <span class="badge badge-success">${data.status || "Active"}</span></div>
          </div>
          <div class="grid-2">
            <div class="field"><span class="label">Full Name</span><span class="value">${data.workerName || "Ahmad Rahman"}</span></div>
            <div class="field"><span class="label">Passport Number</span><span class="value">${data.passportNumber || "A12345678"}</span></div>
            <div class="field"><span class="label">Nationality</span><span class="value">${data.nationality || "Bangladesh"}</span></div>
            <div class="field"><span class="label">Date of Birth</span><span class="value">${formatDate(data.dateOfBirth)}</span></div>
            <div class="field"><span class="label">Gender</span><span class="value">${data.gender || "Male"}</span></div>
            <div class="field"><span class="label">Job Category</span><span class="value">${data.jobCategory || "Construction Worker"}</span></div>
          </div>
          <div style="margin:20px 0;padding:16px;background:#f9fafb;border-radius:8px;">
            <div class="field"><span class="label">Employer</span><span class="value">${data.employerName || "ABC Construction Sdn Bhd"}</span></div>
            <div class="field" style="margin-top:8px;"><span class="label">Work Location</span><span class="value">${data.workLocation || "Kuala Lumpur"}</span></div>
          </div>
          <div style="display:flex;justify-content:space-between;margin:20px 0;padding:16px 0;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;">
            <div class="field"><span class="label">Issue Date</span><span class="value">${formatDate(data.issueDate)}</span></div>
            <div class="field"><span class="label">Expiry Date</span><span class="value">${formatDate(data.expiryDate)}</span></div>
            <div class="field"><span class="label">Duration</span><span class="value">${data.duration || "12 months"}</span></div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;">
            <div class="signature-box"><span>Authorized Officer</span></div>
            <div><div style="font-size:12px;color:#9ca3af;">QR Code / Barcode</div><div style="width:80px;height:80px;background:#f3f4f6;border:1px solid #e5e7eb;display:flex;align-items:center;justify-content:center;font-size:10px;color:#9ca3af;">[Barcode]</div></div>
          </div>
          <div class="footer"><span>This permit is subject to the Immigration Act 1959/63.</span><span>Page 1/1</span></div>
        </div>
      `;
      break;
    }

    case "report": {
      const headers = data.headers || [];
      const rows = data.rows || [];
      body = `
        <div class="document">
          <div class="header">
            <div class="company">
              <div class="company-name">${data.companyName || "ABC Construction Sdn Bhd"}</div>
              <div class="company-detail">${data.companyAddress || "123 Business Street, Kuala Lumpur 50450"}</div>
            </div>
            <div style="text-align:right;">
              <div class="doc-title">${data.reportType || "Monthly Report"}</div>
              <div class="doc-subtitle">${data.reportId || "RPT-2024-001"} · ${data.period || "January 2024"}</div>
            </div>
          </div>
          <div style="display:flex;gap:30px;margin:16px 0;flex-wrap:wrap;">
            <div><span class="label">Generated By</span><div class="value">${data.generatedBy || "System"}</div></div>
            <div><span class="label">Total Records</span><div class="value">${data.totalRecords || 0}</div></div>
            <div><span class="label">Total Workers</span><div class="value">${data.totalWorkers || 0}</div></div>
            <div><span class="label">Total Amount</span><div class="value">${formatCurrency(data.totalAmount || 0)}</div></div>
            <div><span class="label">Status</span><div><span class="badge badge-success">${data.complianceStatus || "Compliant"}</span></div></div>
          </div>
          ${headers.length > 0 && rows.length > 0 ? `
            <div class="table-wrap">
              <table>
                <thead><tr>${headers.map((h: string) => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${rows.map((row: any[]) => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
              </table>
            </div>
          ` : ''}
          ${data.summary ? `<div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;"><div style="font-weight:600;margin-bottom:4px;">Summary</div><div style="font-size:14px;color:#4b5563;">${data.summary}</div></div>` : ''}
          <div class="footer"><span>This report is for internal use only.</span><span>Page 1/1</span></div>
        </div>
      `;
      break;
    }

    case "handbook": {
      const sections = data.sections || [];
      body = `
        <div class="document">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="font-size:28px;font-weight:700;color:#111827;">${data.companyName || "Employee Handbook"}</div>
            <div style="font-size:16px;color:#6b7280;margin-top:8px;">Employee Handbook</div>
            ${data.employeeName ? `<div style="font-size:15px;font-weight:500;margin-top:8px;">Prepared for: ${data.employeeName}</div>` : ''}
            <div style="font-size:14px;color:#6b7280;">Effective: ${formatDate(data.effectiveDate)}</div>
          </div>
          <div style="border-top:2px solid #e5e7eb;padding-top:24px;">
            ${sections.map((section: any, idx: number) => `
              <div style="margin-bottom:32px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                  <span style="font-weight:700;color:#6b7280;font-size:18px;">${String(idx + 1).padStart(2, '0')}.</span>
                  <h2 style="font-size:18px;font-weight:700;color:#111827;">${section.title}</h2>
                </div>
                <div style="font-size:15px;color:#4b5563;line-height:1.7;padding-left:30px;">${section.content}</div>
              </div>
            `).join('')}
          </div>
          <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280;text-align:center;">This handbook is a guide to company policies. For the latest version, please consult HR.</div>
          <div class="footer"><span>Confidential</span><span>Page 1/1</span></div>
        </div>
      `;
      break;
    }

    default:
      body = `<div class="document"><p>No preview available for this document type.</p></div>`;
  }

  return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document Preview</title>
        <style>${styles}</style>
      </head>
      <body>${body}</body>
    </html>`;
}

// ─── Mock data for version history ──────────────────────────────────────────

const mockVersions = [
  { id: "v1", date: "2026-07-26 10:30", author: "Jane Doe", comment: "Initial draft", type: "draft" },
  { id: "v2", date: "2026-07-26 11:15", author: "John Smith", comment: "Added SST details", type: "review" },
  { id: "v3", date: "2026-07-26 13:45", author: "Jane Doe", comment: "Final for approval", type: "approved" },
];

const mockCollaborators = [
  { name: "Alice Tan", initials: "AT", online: true },
  { name: "Bob Lee", initials: "BL", online: false },
  { name: "Carol Wong", initials: "CW", online: true },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PDFGeneratorPage() {
  const { toast } = useToast();

  // ─── State ──────────────────────────────────────────────────────────────

  const [selectedDocument, setSelectedDocument] = useState<
    "invoice" | "payslip" | "permit" | "report" | "handbook"
  >("invoice");
  const [documentData, setDocumentData] = useState<any>({});
  const [previewMode, setPreviewMode] = useState<"pdf" | "web">("web");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCloudSynced, setIsCloudSynced] = useState(true);
  const [activeTab, setActiveTab] = useState("generator");
  const [searchQuery, setSearchQuery] = useState("");

  // ─── AI Chat (KBChat) ──────────────────────────────────────────────────

  const kbChat = useKbChat({
    employeeId: "system",
    tenantId: "default",
  });

  const { messages, sendMessage, isLoading: isChatLoading, latestSuggestions } = kbChat;

  // ─── Sample data ──────────────────────────────────────────────────────

  const sampleData = {
    invoice: {
      companyName: "ABC Construction Sdn Bhd",
      companyAddress: "123 Business Street, Kuala Lumpur 50450",
      companyPhone: "03-8886 3000",
      companyEmail: "info@abcconstruction.com.my",
      companySst: "00123456789",
      invoiceNumber: "INV-2024-001",
      issueDate: "2024-01-15",
      dueDate: "2024-02-15",
      customerName: "DEF Development Sdn Bhd",
      customerAddress: "456 Jalan Utama, Petaling Jaya 47301",
      customerPhone: "03-7777 8888",
      customerEmail: "accounts@defdev.com.my",
      currency: "MYR",
      status: "pending",
      terms: "Net 30",
      items: [
        { description: "Foreign Worker Services - January 2024", quantity: 10, unitPrice: 500, total: 5000 },
        { description: "Permit Processing Fee", quantity: 10, unitPrice: 150, total: 1500 },
        { description: "Accommodation Charges", quantity: 10, unitPrice: 200, total: 2000 },
      ],
      subtotal: 8500,
      taxRate: 0.06,
      taxAmount: 510,
      total: 9010,
      notes: "Please make payment by the due date. Late payment may incur additional charges.",
    },
    payslip: {
      companyName: "ABC Construction Sdn Bhd",
      companyAddress: "123 Business Street, Kuala Lumpur 50450",
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
      duration: "12 months",
    },
    report: {
      companyName: "ABC Construction Sdn Bhd",
      companyAddress: "123 Business Street, Kuala Lumpur 50450",
      reportType: "EPF Monthly Report",
      reportId: "EPF-2024-01",
      period: "January 2024",
      generatedBy: "System Administrator",
      totalRecords: 25,
      totalAmount: 17250,
      totalWorkers: 25,
      complianceStatus: "Compliant",
      headers: ["Worker Name", "EPF Number", "Basic Salary", "Employee Contribution", "Employer Contribution"],
      rows: [
        ["Ahmad Rahman", "12345678", "2500.00", "275.00", "300.00"],
        ["Siti Aminah", "12345679", "2800.00", "308.00", "336.00"],
        ["Kumar Patel", "12345680", "3000.00", "330.00", "360.00"],
        ["Tan Wei Ming", "12345681", "2600.00", "286.00", "312.00"],
        ["Rosli bin Ahmad", "12345682", "2400.00", "264.00", "288.00"],
      ],
      summary: "All employee contributions have been submitted on time. No discrepancies detected.",
    },
    handbook: {
      companyName: "ABC Construction Sdn Bhd",
      employeeName: "",
      effectiveDate: new Date().toISOString().split('T')[0],
      sections: [
        { title: "Welcome to Our Company", content: "Welcome to ABC Construction Sdn Bhd! This handbook serves as your guide to our policies, procedures, and expectations. We are committed to providing a safe, productive, and respectful workplace for all employees." },
        { title: "Code of Conduct", content: "All employees are expected to maintain professional behavior and adhere to ethical standards. This includes respect for colleagues, clients, and company property. Any violation may result in disciplinary action." },
        { title: "Employee Benefits", content: "We offer competitive benefits including health insurance, paid annual leave (14 days), sick leave (14 days), and public holidays (11 days). Details are available from the HR department." },
        { title: "Safety Policy", content: "Safety is our top priority. All employees must follow safety protocols, wear required PPE, and report any hazards immediately. Regular safety training is mandatory." },
      ],
    },
  };

  // ─── Handlers ──────────────────────────────────────────────────────────

  const handleDocumentChange = (
    type: "invoice" | "payslip" | "permit" | "report" | "handbook"
  ) => {
    setSelectedDocument(type);
    setDocumentData(sampleData[type]);
  };

  const handleDataChange = (field: string, value: unknown) => {
    setDocumentData((prev: Record<string, unknown>) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsCloudSynced(true);
      toast({ title: "Document saved", description: "All changes have been synced to the cloud." });
    }, 1200);
  };

  const handleExport = (format: "pdf" | "docx" | "html") => {
    toast({ title: `Exporting as ${format.toUpperCase()}`, description: "Your document is being prepared..." });
  };

  const handleAIAssist = (field: string) => {
    const prompt = `Suggest content for the ${field} field in a ${selectedDocument} document.`;
    sendMessage(prompt);
  };

  // ─── Effect: regenerate HTML ──────────────────────────────────────────

  useEffect(() => {
    const html = generateDocumentHTML(selectedDocument, documentData);
    setHtmlContent(html);
  }, [selectedDocument, documentData]);

  const webPreviewSrc = useMemo(() => {
    return `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
  }, [htmlContent]);

  // ─── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 p-6">
      {/* ─── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            PDF Generator
          </h1>
          <p className="text-muted-foreground">
            AI‑powered document creation with collaborative preview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isCloudSynced ? (
              <Cloud className="h-4 w-4 text-green-500" />
            ) : (
              <CloudOff className="h-4 w-4 text-yellow-500" />
            )}
            {isSaving ? "Saving..." : isCloudSynced ? "Synced" : "Offline"}
          </Button>
          <Button size="sm" onClick={() => handleExport("pdf")} className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleExport("docx")} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            DOCX
          </Button>
        </div>
      </div>

      {/* ─── Tabs ──────────────────────────────────────────────────────── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="generator">
            <FileText className="h-4 w-4 mr-2" />
            Generator
          </TabsTrigger>
          <TabsTrigger value="handbook">
            <BookOpen className="h-4 w-4 mr-2" />
            Handbook
          </TabsTrigger>
          <TabsTrigger value="ai">
            <Bot className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Layers className="h-4 w-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="versions">
            <History className="h-4 w-4 mr-2" />
            Versions
          </TabsTrigger>
          <TabsTrigger value="collaborate">
            <Users className="h-4 w-4 mr-2" />
            Collaborate
          </TabsTrigger>
        </TabsList>

        {/* ─── GENERATOR TAB ──────────────────────────────────────────── */}
        <TabsContent value="generator" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Configuration */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Document Configuration</CardTitle>
                <Badge variant="outline" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI‑assisted
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: "invoice", icon: FileText, label: "Invoice" },
                    { type: "payslip", icon: Receipt, label: "Payslip" },
                    { type: "permit", icon: CreditCard, label: "Work Permit" },
                    { type: "report", icon: BarChart3, label: "Report" },
                    { type: "handbook", icon: BookOpen, label: "Handbook" },
                  ].map(({ type, icon: Icon, label }) => (
                    <Button
                      key={type}
                      variant={selectedDocument === type ? "default" : "outline"}
                      onClick={() => handleDocumentChange(type as any)}
                      className="h-20 flex-col gap-2"
                    >
                      <Icon className="h-6 w-6" />
                      {label}
                    </Button>
                  ))}
                </div>

                <ScrollArea className="h-[400px] pr-4">
                  {/* Dynamic fields based on document type */}
                  {selectedDocument === "invoice" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="invoiceNumber">Invoice Number</Label>
                          <Input
                            id="invoiceNumber"
                            value={documentData.invoiceNumber || ""}
                            onChange={(e) => handleDataChange("invoiceNumber", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="customerName">Customer Name</Label>
                          <Input
                            id="customerName"
                            value={documentData.customerName || ""}
                            onChange={(e) => handleDataChange("customerName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="issueDate">Issue Date</Label>
                          <Input
                            id="issueDate"
                            type="date"
                            value={documentData.issueDate || ""}
                            onChange={(e) => handleDataChange("issueDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={documentData.dueDate || ""}
                            onChange={(e) => handleDataChange("dueDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="total">Total Amount</Label>
                        <div className="flex gap-2">
                          <Input
                            id="total"
                            type="number"
                            value={documentData.total || ""}
                            onChange={(e) => handleDataChange("total", parseFloat(e.target.value))}
                            className="flex-1"
                          />
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => handleAIAssist("total")}>
                                <Sparkles className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>AI suggest amount</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={documentData.status || "pending"}
                          onValueChange={(value) => handleDataChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                          </SelectContent>
                        </Select>
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
                            onChange={(e) => handleDataChange("workerName", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="payPeriod">Pay Period</Label>
                          <Input
                            id="payPeriod"
                            value={documentData.payPeriod || ""}
                            onChange={(e) => handleDataChange("payPeriod", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="basicSalary">Basic Salary</Label>
                          <Input
                            id="basicSalary"
                            type="number"
                            value={documentData.basicSalary || ""}
                            onChange={(e) => handleDataChange("basicSalary", parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="netPay">Net Pay</Label>
                          <Input
                            id="netPay"
                            type="number"
                            value={documentData.netPay || ""}
                            onChange={(e) => handleDataChange("netPay", parseFloat(e.target.value))}
                          />
                        </div>
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
                            onChange={(e) => handleDataChange("permitNumber", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="workerName">Worker Name</Label>
                          <Input
                            id="workerName"
                            value={documentData.workerName || ""}
                            onChange={(e) => handleDataChange("workerName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nationality">Nationality</Label>
                          <Input
                            id="nationality"
                            value={documentData.nationality || ""}
                            onChange={(e) => handleDataChange("nationality", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="passportNumber">Passport Number</Label>
                          <Input
                            id="passportNumber"
                            value={documentData.passportNumber || ""}
                            onChange={(e) => handleDataChange("passportNumber", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="employerName">Employer Name</Label>
                        <Input
                          id="employerName"
                          value={documentData.employerName || ""}
                          onChange={(e) => handleDataChange("employerName", e.target.value)}
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
                          onValueChange={(value) => handleDataChange("reportType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="EPF Monthly Report">EPF Monthly Report</SelectItem>
                            <SelectItem value="SOCSO Report">SOCSO Report</SelectItem>
                            <SelectItem value="PCB Report">PCB Report</SelectItem>
                            <SelectItem value="Levy Report">Foreign Worker Levy Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="period">Period</Label>
                        <Input
                          id="period"
                          value={documentData.period || ""}
                          onChange={(e) => handleDataChange("period", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalRecords">Total Records</Label>
                        <Input
                          id="totalRecords"
                          type="number"
                          value={documentData.totalRecords || ""}
                          onChange={(e) => handleDataChange("totalRecords", parseInt(e.target.value))}
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
                            onChange={(e) => handleDataChange("companyName", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="employeeName">Employee Name (Optional)</Label>
                          <Input
                            id="employeeName"
                            value={documentData.employeeName || ""}
                            onChange={(e) => handleDataChange("employeeName", e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input
                          id="effectiveDate"
                          type="date"
                          value={documentData.effectiveDate || ""}
                          onChange={(e) => handleDataChange("effectiveDate", e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Right: Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === "pdf" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("pdf")}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant={previewMode === "web" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("web")}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Live
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-mono w-12 text-center">{zoomLevel}%</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => {
                      setHtmlContent(generateDocumentHTML(selectedDocument, documentData));
                      toast({ title: "Preview refreshed" });
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                className={cn(
                  "border rounded-lg overflow-hidden bg-white transition-all",
                  isFullscreen ? "fixed inset-0 z-50 rounded-none" : "h-[600px]"
                )}
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top left" }}
              >
                {previewMode === "pdf" ? (
                  <PDFPreview
                    documentType={selectedDocument}
                    data={documentData}
                    onGenerate={() => {}}
                  />
                ) : (
                  <WebPreview>
                    <WebPreviewNavigation>
                      <WebPreviewNavigationButton tooltip="Back">
                        <ArrowLeft className="h-4 w-4" />
                      </WebPreviewNavigationButton>
                      <WebPreviewNavigationButton tooltip="Forward">
                        <ArrowRight className="h-4 w-4" />
                      </WebPreviewNavigationButton>
                      <WebPreviewUrl value={webPreviewSrc} readOnly className="text-xs" />
                      <WebPreviewNavigationButton
                        tooltip="Refresh"
                        onClick={() => setHtmlContent(generateDocumentHTML(selectedDocument, documentData))}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </WebPreviewNavigationButton>
                    </WebPreviewNavigation>
                    <WebPreviewBody
                      src={webPreviewSrc}
                      loading={<div className="flex items-center justify-center h-full text-muted-foreground">Loading preview...</div>}
                    />
                  </WebPreview>
                )}
              </div>

              {/* AI Suggestions */}
              <div className="flex flex-wrap gap-2">
                {latestSuggestions.slice(0, 3).map((s, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent gap-1"
                    onClick={() => sendMessage(s.label)}
                  >
                    <Lightbulb className="h-3 w-3" />
                    {s.label}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ─── HANDBOOK TAB ────────────────────────────────────────────── */}
        <TabsContent value="handbook" className="space-y-4">
          <HandbookGenerator />
        </TabsContent>

        {/* ─── AI ASSISTANT TAB ────────────────────────────────────────── */}
        <TabsContent value="ai" className="space-y-4">
          <AIDocGenerator />
        </TabsContent>

        {/* ─── TEMPLATES TAB ───────────────────────────────────────────── */}
        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(sampleData)
              .filter(([type]) => type.toLowerCase().includes(searchQuery.toLowerCase()) || searchQuery === "")
              .map(([type, data]) => (
                <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{type} Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground mb-3">
                      Professional {type} template with Malaysian compliance
                    </p>
                    <Button size="sm" className="w-full" onClick={() => handleDocumentChange(type as any)}>
                      Use Template
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        {/* ─── VERSIONS TAB ────────────────────────────────────────────── */}
        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document History</CardTitle>
              <CardDescription>Track changes and restore previous versions</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline>
                <TimelineHeader title="Version History" eventCount={mockVersions.length} />
                {mockVersions.map((v, idx) => (
                  <TimelineEventItem
                    key={v.id}
                    event={{
                      id: v.id,
                      title: v.comment,
                      description: `By ${v.author} · ${v.date}`,
                      status: v.type === "approved" ? "completed" : v.type === "review" ? "running" : "pending",
                    }}
                    isLast={idx === mockVersions.length - 1}
                    showTimestamp
                  />
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── COLLABORATE TAB ─────────────────────────────────────────── */}
        <TabsContent value="collaborate" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Active Collaborators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockCollaborators.map((c) => (
                    <div key={c.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{c.initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.online ? <span className="text-green-500">● Online</span> : "Offline"}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">Viewing</Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Share2 className="h-4 w-4" />
                    Invite Collaborators
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Live Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 overflow-y-auto space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">Jane Doe</div>
                      <div className="text-sm">Please update the SST registration number.</div>
                      <div className="text-xs text-muted-foreground">2 min ago</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>BL</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">Bob Lee</div>
                      <div className="text-sm">The total matches the breakdown.</div>
                      <div className="text-xs text-muted-foreground">5 min ago</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Input placeholder="Add a comment..." className="flex-1" />
                  <Button size="sm">Post</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}