"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DollarSign,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface PayrollEntry {
  id: string;
  employeeName: string;
  employeeId: string;
  period: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: "PENDING" | "PROCESSED" | "PAID";
}

const statusConfig = {
  PENDING: { label: "Pending", variant: "secondary" as const, icon: Clock },
  PROCESSED: {
    label: "Processed",
    variant: "default" as const,
    icon: CheckCircle,
  },
  PAID: { label: "Paid", variant: "default" as const, icon: CheckCircle },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(
    n,
  );

interface PayrollTableProps {
  entries: PayrollEntry[];
  loading?: boolean;
  onDownload?: (id: string) => void;
}

export function PayrollTable({
  entries,
  loading,
  onDownload,
}: PayrollTableProps) {
  if (loading)
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 rounded-lg" />
        ))}
      </div>
    );

  const totalNet = entries.reduce((s, e) => s + e.netSalary, 0);
  const totalGross = entries.reduce(
    (s, e) => s + e.basicSalary + e.allowances,
    0,
  );

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Total Gross",
            value: fmt(totalGross),
            icon: TrendingUp,
            color: "text-blue-600",
          },
          {
            label: "Total Deductions",
            value: fmt(entries.reduce((s, e) => s + e.deductions, 0)),
            icon: AlertTriangle,
            color: "text-orange-600",
          },
          {
            label: "Total Net",
            value: fmt(totalNet),
            icon: DollarSign,
            color: "text-green-600",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-4 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className={`text-lg font-bold ${color}`}>{value}</p>
                </div>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Period</TableHead>
              <TableHead className="text-right">Basic</TableHead>
              <TableHead className="text-right">Allowances</TableHead>
              <TableHead className="text-right">Deductions</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => {
              const cfg = statusConfig[entry.status];
              const Icon = cfg.icon;
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="font-medium text-sm">
                      {entry.employeeName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {entry.employeeId}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{entry.period}</TableCell>
                  <TableCell className="text-right text-sm">
                    {fmt(entry.basicSalary)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-green-600">
                    +{fmt(entry.allowances)}
                  </TableCell>
                  <TableCell className="text-right text-sm text-red-600">
                    -{fmt(entry.deductions)}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm">
                    {fmt(entry.netSalary)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={cfg.variant} className="gap-1 text-xs">
                      <Icon className="h-3 w-3" />
                      {cfg.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDownload?.(entry.id)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download payslip</TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface PayslipCardProps {
  entry: PayrollEntry;
  onDownload?: () => void;
}

export function PayslipCard({ entry, onDownload }: PayslipCardProps) {
  const gross = entry.basicSalary + entry.allowances;
  const netPct = Math.round((entry.netSalary / gross) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{entry.employeeName}</CardTitle>
          <Badge
            variant={statusConfig[entry.status].variant}
            className="text-xs"
          >
            {statusConfig[entry.status].label}
          </Badge>
        </div>
        <CardDescription>{entry.period}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Basic Salary</span>
            <span>{fmt(entry.basicSalary)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Allowances</span>
            <span className="text-green-600">+{fmt(entry.allowances)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Deductions</span>
            <span className="text-red-600">-{fmt(entry.deductions)}</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold">
          <span>Net Salary</span>
          <span className="text-green-600">{fmt(entry.netSalary)}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Take-home ratio</span>
            <span>{netPct}%</span>
          </div>
          <Progress value={netPct} className="h-1.5" />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full h-7 text-xs"
          onClick={onDownload}
        >
          <Download className="h-3 w-3 mr-1" /> Download Payslip
        </Button>
      </CardContent>
    </Card>
  );
}
