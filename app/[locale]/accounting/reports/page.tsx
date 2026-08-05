"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Download,
  ArrowLeft,
  FileText,
  DollarSign,
  BarChart3,
  PieChart,
} from "lucide-react";
import Link from "next/link";

const REPORT_TYPES = [
  {
    id: "profit-loss",
    title: "Profit & Loss",
    description: "Monthly income statement with revenue, costs, and net profit",
    icon: TrendingUp,
    color: "bg-green-100 text-green-700",
  },
  {
    id: "balance-sheet",
    title: "Balance Sheet",
    description: "Assets, liabilities, and equity snapshot",
    icon: DollarSign,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: "cash-flow",
    title: "Cash Flow",
    description: "Operating, investing, and financing cash movements",
    icon: BarChart3,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: "aging-receivables",
    title: "Aging Receivables",
    description: "Outstanding invoices grouped by aging period",
    icon: FileText,
    color: "bg-orange-100 text-orange-700",
  },
  {
    id: "sst-summary",
    title: "SST Summary",
    description: "Malaysian Sales & Service Tax monthly summary for LHDN filing",
    icon: PieChart,
    color: "bg-red-100 text-red-700",
  },
  {
    id: "payroll-cost",
    title: "Payroll Cost Report",
    description: "Salary, EPF, SOCSO, EIS, and HRDC levy breakdown",
    icon: DollarSign,
    color: "bg-yellow-100 text-yellow-700",
  },
] as const;

const PERIODS = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "q1_2024", label: "Q1 2024" },
  { value: "q2_2024", label: "Q2 2024" },
  { value: "q3_2024", label: "Q3 2024" },
  { value: "q4_2024", label: "Q4 2024" },
  { value: "ytd", label: "Year to Date" },
];

export default function AccountingReportsPage() {
  const [period, setPeriod] = useState("this_month");
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = (reportId: string) => {
    setGenerating(reportId);
    setTimeout(() => setGenerating(null), 1500);
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/accounting">
              <ArrowLeft className="h-4 w-4 mr-1" /> Accounting
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Financial Reports</h1>
              <p className="text-sm text-muted-foreground">
                Generate and export accounting reports for any period
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {PERIODS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Report cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORT_TYPES.map((report) => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          return (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{report.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardDescription>{report.description}</CardDescription>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => handleGenerate(report.id)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating…" : "Preview"}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleGenerate(report.id)}
                    disabled={isGenerating}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {isGenerating ? "…" : "Export PDF"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Compliance note */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Badge className="bg-blue-100 text-blue-800 shrink-0 mt-0.5">
              Malaysian Compliance
            </Badge>
            <p className="text-sm text-blue-900">
              SST returns are due by the last day of the following month. EA Forms
              must be submitted to employees by 28 February each year. All reports
              are generated in MYR and comply with LHDN requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
