"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Calculator, Download, FileText } from "lucide-react";
import { MalaysianTaxCalculator } from "@/utils/malaysian-tax/tax-calculator-enhanced";

export function PayrollCalculator() {
  const [grossSalary, setGrossSalary] = useState<number>(0);
  const [isResident, setIsResident] = useState(true);
  const [workerCategory, setWorkerCategory] = useState("");
  const [calculation, setCalculation] = useState<any>(null);

  const handleCalculate = () => {
    if (grossSalary <= 0) return;

    const result = MalaysianTaxCalculator.calculatePayroll(
      grossSalary,
      isResident,
    );
    const levy =
      MalaysianTaxCalculator.calculateForeignWorkerLevy(workerCategory);

    setCalculation({
      ...result,
      levy,
      netSalaryAfterLevy: result.netSalary - levy,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Payroll Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grossSalary">Gross Monthly Salary (MYR)</Label>
            <Input
              id="grossSalary"
              type="number"
              value={grossSalary || ""}
              onChange={(e) => setGrossSalary(Number(e.target.value))}
              placeholder="Enter gross salary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="workerCategory">Worker Category</Label>
            <Select value={workerCategory} onValueChange={setWorkerCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="plantation">Plantation</SelectItem>
                <SelectItem value="agriculture">Agriculture</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="domestic">Domestic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isResident"
              checked={isResident}
              onCheckedChange={(checked) => setIsResident(checked as boolean)}
            />
            <Label htmlFor="isResident">Malaysian Tax Resident</Label>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full"
            disabled={!grossSalary || !workerCategory}
          >
            Calculate Payroll
          </Button>
        </CardContent>
      </Card>

      {calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Calculation Results</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Payslip
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Gross Salary</p>
                <p className="font-semibold">
                  {formatCurrency(calculation.grossSalary)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Net Salary</p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(calculation.netSalary)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Employee Deductions</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>EPF (11%)</span>
                  <span>{formatCurrency(calculation.epfEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCSO</span>
                  <span>{formatCurrency(calculation.socsoEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>EIS (0.2%)</span>
                  <span>{formatCurrency(calculation.eisEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PCB Tax</span>
                  <span>{formatCurrency(calculation.pcbTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Foreign Worker Levy</span>
                  <span>{formatCurrency(calculation.levy)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Employer Contributions</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>EPF (12%)</span>
                  <span>{formatCurrency(calculation.epfEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCSO (1.75%)</span>
                  <span>{formatCurrency(calculation.socsoEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>EIS (0.2%)</span>
                  <span>{formatCurrency(calculation.eisEmployer)}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Employer Cost</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(calculation.totalEmployerCost)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Net After Levy</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(calculation.netSalaryAfterLevy)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
