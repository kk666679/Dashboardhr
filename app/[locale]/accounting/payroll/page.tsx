"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Calculator, DollarSign, FileText, Download, CheckCircle, AlertTriangle, Users, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-02");
  const [processing, setProcessing] = useState(false);

  const { data: payrollRecords = [], isLoading } = trpc.accounting.payrollRecords.useQuery({});
  const { data: summary } = trpc.accounting.accountingSummary.useQuery();

  // Derive per-row display data from the real Payroll model
  const rows = payrollRecords.map((r: any) => {
    const gross     = Number(r.basicSalary) + Object.values((r.allowances as Record<string, number>) ?? {}).reduce((a: number, v: any) => a + Number(v), 0);
    const epfEmp    = gross * 0.11;
    const epfEmployer = gross <= 5000 ? gross * 0.13 : gross * 0.12;
    const socso     = Math.min(gross, 4000) * 0.005;
    const eis       = Math.min(gross, 4000) * 0.002;
    const net       = Number(r.netSalary);
    return { ...r, grossSalary: gross, epfEmployee: epfEmp, epfEmployer, socso, eis, net };
  });

  const totalGross = rows.reduce((s: number, r: any) => s + r.grossSalary, 0);
  const totalNet   = rows.reduce((s: number, r: any) => s + r.net, 0);
  const totalEPF   = rows.reduce((s: number, r: any) => s + r.epfEmployee + r.epfEmployer, 0);

  const handleProcessPayroll = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payroll Processing</h1>
          <p className="text-muted-foreground">Process monthly payroll with automated deductions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2023-12">December 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Employees",    value: summary?.employeeCount ?? 0,          icon: Users,          color: "" },
          { label: "Gross Salary", value: `RM ${totalGross.toLocaleString()}`,  icon: DollarSign,     color: "text-green-600" },
          { label: "Net Salary",   value: `RM ${totalNet.toLocaleString()}`,    icon: DollarSign,     color: "text-blue-600" },
          { label: "EPF Total",    value: `RM ${totalEPF.toLocaleString()}`,    icon: FileText,       color: "text-purple-600" },
          { label: "Pending",      value: summary?.pendingPayrolls ?? 0,        icon: AlertTriangle,  color: "text-orange-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold">{value}</div>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Details</CardTitle>
          <CardDescription>Monthly salary calculation with statutory deductions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>EPF (11%/13%)</TableHead>
                <TableHead>SOCSO + EIS</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No payroll records found for this period</TableCell></TableRow>
              ) : (
                rows.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium">{r.employeeId}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.periodStart).toLocaleDateString()} – {new Date(r.periodEnd).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">RM {r.grossSalary.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">Emp: RM {r.epfEmployee.toFixed(0)}</div>
                      <div className="text-xs text-muted-foreground">Empr: RM {r.epfEmployer.toFixed(0)}</div>
                    </TableCell>
                    <TableCell>
                      <div>RM {r.socso.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">+EIS: RM {r.eis.toFixed(2)}</div>
                    </TableCell>
                    <TableCell className="font-medium text-green-600">RM {r.net.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "PAID" ? "default" : r.status === "PROCESSED" ? "default" : "secondary"}>
                        {r.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Actions</CardTitle>
          <CardDescription>Process payroll and generate statutory reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { Icon: Calculator, label: "Auto-calculate Deductions", sub: "EPF, SOCSO, EIS, Levy", color: "text-blue-600" },
              { Icon: FileText,   label: "Generate e-Invoice",         sub: "MyInvois compliant",  color: "text-green-600" },
              { Icon: Calendar,   label: "Submit to Authorities",      sub: "EPF, SOCSO, LHDN",    color: "text-purple-600" },
            ].map(({ Icon, label, sub, color }) => (
              <div key={label} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Icon className={`h-8 w-8 ${color}`} />
                <div>
                  <div className="font-medium">{label}</div>
                  <div className="text-sm text-muted-foreground">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing payroll…</span>
                <span>Calculating deductions</span>
              </div>
              <Progress value={65} />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <div className="text-lg font-semibold">Total Payout: RM {totalNet.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{rows.length} employees · {selectedMonth}</div>
            </div>
            <Button onClick={handleProcessPayroll} disabled={processing} size="lg">
              {processing
                ? <><Calculator className="mr-2 h-4 w-4 animate-spin" />Processing…</>
                : <><CheckCircle className="mr-2 h-4 w-4" />Process Payroll</>
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
