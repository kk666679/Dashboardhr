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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Calculator,
  DollarSign,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
} from "lucide-react";

export default function PayrollPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-02");
  const [processing, setProcessing] = useState(false);

  const payrollData = [
    {
      id: "W001",
      name: "Ahmad Rahman",
      basicSalary: 2500,
      overtime: 300,
      allowances: 200,
      grossSalary: 3000,
      epfEmployee: 330,
      epfEmployer: 390,
      socso: 60,
      eis: 7.8,
      levy: 1850,
      tax: 0,
      netSalary: 1752.2,
      status: "pending",
    },
    {
      id: "W002",
      name: "Siti Nurhaliza",
      basicSalary: 2200,
      overtime: 150,
      allowances: 100,
      grossSalary: 2450,
      epfEmployee: 269.5,
      epfEmployer: 318.5,
      socso: 49,
      eis: 6.37,
      levy: 1650,
      tax: 0,
      netSalary: 1475.13,
      status: "processed",
    },
  ];

  const summary = {
    totalEmployees: payrollData.length,
    totalGross: payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0),
    totalNet: payrollData.reduce((sum, emp) => sum + emp.netSalary, 0),
    totalEPF: payrollData.reduce(
      (sum, emp) => sum + emp.epfEmployee + emp.epfEmployer,
      0,
    ),
    totalSOCSO: payrollData.reduce((sum, emp) => sum + emp.socso, 0),
    totalLevy: payrollData.reduce((sum, emp) => sum + emp.levy, 0),
  };

  const handleProcessPayroll = async () => {
    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setProcessing(false);
    alert("Payroll processed successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Payroll Processing
          </h1>
          <p className="text-muted-foreground">
            Process monthly payroll with automated deductions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024-02">February 2024</SelectItem>
              <SelectItem value="2024-01">January 2024</SelectItem>
              <SelectItem value="2023-12">December 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {summary.totalGross.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {summary.totalNet.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EPF Total</CardTitle>
            <FileText className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {summary.totalEPF.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gov Levy</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              RM {summary.totalLevy.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll Details</CardTitle>
          <CardDescription>
            Monthly salary calculation with statutory deductions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Basic + OT</TableHead>
                <TableHead>Gross</TableHead>
                <TableHead>EPF (11%/13%)</TableHead>
                <TableHead>SOCSO</TableHead>
                <TableHead>Gov Levy</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>
                    <div className="font-medium">{employee.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {employee.id}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>RM {employee.basicSalary.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        +RM {employee.overtime} OT
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      RM {employee.grossSalary.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        Employee: RM {employee.epfEmployee}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Employer: RM {employee.epfEmployer}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>RM {employee.socso}</div>
                    <div className="text-xs text-muted-foreground">
                      +EIS: RM {employee.eis}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-orange-600">
                      RM {employee.levy.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-green-600">
                      RM {employee.netSalary.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.status === "processed"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {employee.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Processing Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Actions</CardTitle>
          <CardDescription>
            Process payroll and generate statutory reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Calculator className="h-8 w-8 text-blue-600" />
              <div>
                <div className="font-medium">Auto-calculate Deductions</div>
                <div className="text-sm text-muted-foreground">
                  EPF, SOCSO, EIS, Levy
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <FileText className="h-8 w-8 text-green-600" />
              <div>
                <div className="font-medium">Generate e-Invoice</div>
                <div className="text-sm text-muted-foreground">
                  MyInvois compliant
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <div className="font-medium">Submit to Authorities</div>
                <div className="text-sm text-muted-foreground">
                  EPF, SOCSO, LHDN
                </div>
              </div>
            </div>
          </div>

          {processing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing payroll...</span>
                <span>Calculating deductions</span>
              </div>
              <Progress value={65} />
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              <div className="text-lg font-semibold">
                Total Payout: RM {summary.totalNet.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {summary.totalEmployees} employees • {selectedMonth}
              </div>
            </div>
            <Button
              onClick={handleProcessPayroll}
              disabled={processing}
              size="lg"
            >
              {processing ? (
                <>
                  <Calculator className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Process Payroll
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
