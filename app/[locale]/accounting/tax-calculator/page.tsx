"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

function calcEpf(gross: number, isEmployer: boolean): number {
  // EPF: Employee 11%, Employer 13% (wages ≤ RM5,000) / 12% (> RM5,000)
  if (isEmployer) return gross <= 5000 ? gross * 0.13 : gross * 0.12;
  return gross * 0.11;
}

function calcSocso(gross: number, isEmployer: boolean): number {
  // SOCSO capped at RM4,000 insurable earnings
  const insurable = Math.min(gross, 4000);
  if (isEmployer) return insurable * 0.0175;
  return insurable * 0.005;
}

function calcEis(gross: number, isEmployer: boolean): number {
  // EIS capped at RM4,000
  const insurable = Math.min(gross, 4000);
  return insurable * 0.002;
}

function calcHrdc(gross: number): number {
  // HRDC levy 1% on monthly wages (employer only, for companies ≥ 10 staff)
  return gross * 0.01;
}

function calcPcb(grossAnnual: number): number {
  // Simplified PCB / MTD graduated tax (illustrative brackets)
  let tax = 0;
  if (grossAnnual <= 5000) return 0;
  if (grossAnnual <= 20000) tax = (grossAnnual - 5000) * 0.01;
  else if (grossAnnual <= 35000) tax = 150 + (grossAnnual - 20000) * 0.03;
  else if (grossAnnual <= 50000) tax = 600 + (grossAnnual - 35000) * 0.08;
  else if (grossAnnual <= 70000) tax = 1800 + (grossAnnual - 50000) * 0.13;
  else if (grossAnnual <= 100000) tax = 4400 + (grossAnnual - 70000) * 0.21;
  else if (grossAnnual <= 400000) tax = 10700 + (grossAnnual - 100000) * 0.24;
  else tax = 82700 + (grossAnnual - 400000) * 0.245;
  return tax / 12;
}

export default function TaxCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState("3000");
  const [workerType, setWorkerType] = useState<"local" | "foreign">("local");
  const [calculated, setCalculated] = useState(false);
  const calculateTaxMutation = trpc.accounting.calculateTax.useMutation();

  const gross = parseFloat(grossSalary) || 0;

  const epfEmployee = workerType === "local" ? calcEpf(gross, false) : 0;
  const epfEmployer = workerType === "local" ? calcEpf(gross, true) : 0;
  const socsoEmployee = calcSocso(gross, false);
  const socsoEmployer = calcSocso(gross, true);
  const eisEmployee = calcEis(gross, false);
  const eisEmployer = calcEis(gross, true);
  const hrdcLevy = calcHrdc(gross);
  const pcbEstimate = workerType === "local" ? calcPcb(gross * 12) : 0;

  const totalDeductions = epfEmployee + socsoEmployee + eisEmployee + pcbEstimate;
  const netSalary = gross - totalDeductions;
  const totalEmployerCost =
    gross + epfEmployer + socsoEmployer + eisEmployer + hrdcLevy;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 2,
    }).format(n);

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/accounting">
            <ArrowLeft className="h-4 w-4 mr-1" /> Accounting
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Tax & Levy Calculator</h1>
            <p className="text-sm text-muted-foreground">
              Malaysian statutory deductions — EPF, SOCSO, EIS, PCB/MTD, HRDC
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calculation Inputs</CardTitle>
            <CardDescription>
              Enter gross monthly salary to compute all statutory deductions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gross">Gross Monthly Salary (MYR)</Label>
              <Input
                id="gross"
                type="number"
                min="0"
                step="100"
                value={grossSalary}
                onChange={(e) => {
                  setGrossSalary(e.target.value);
                  setCalculated(false);
                }}
                placeholder="e.g. 3000"
              />
              {gross < 1700 && gross > 0 && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  Below minimum wage of MYR 1,700/month
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="workerType">Worker Type</Label>
              <Select
                value={workerType}
                onValueChange={(v) =>
                  setWorkerType(v as "local" | "foreign")
                }
              >
                <SelectTrigger id="workerType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Local Employee</SelectItem>
                  <SelectItem value="foreign">
                    Foreign Worker (no EPF / no PCB)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={async () => {
                setCalculated(true);
                // Also persist/validate via tRPC (PCB type for local workers)
                if (gross > 0 && workerType === "local") {
                  await calculateTaxMutation.mutateAsync({ grossIncome: gross, type: "PCB" });
                }
              }}
              disabled={!gross || gross <= 0}
            >
              <Calculator className="h-4 w-4 mr-2" /> Calculate
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Deduction Breakdown</CardTitle>
            <CardDescription>
              Monthly figures based on MYR {fmt(gross)} gross salary
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Employee deductions */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Employee Deductions
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>EPF (11%)</span>
                  <span className="font-mono">{fmt(epfEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCSO (0.5%)</span>
                  <span className="font-mono">{fmt(socsoEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>EIS (0.2%)</span>
                  <span className="font-mono">{fmt(eisEmployee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>PCB/MTD (est.)</span>
                  <span className="font-mono">{fmt(pcbEstimate)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total Deductions</span>
                  <span className="font-mono text-red-600">
                    {fmt(totalDeductions)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Net Take-Home</span>
                  <span className="font-mono text-green-600">
                    {fmt(netSalary)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Employer cost */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Employer Cost
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>Gross Salary</span>
                  <span className="font-mono">{fmt(gross)}</span>
                </div>
                <div className="flex justify-between">
                  <span>EPF (13% / 12%)</span>
                  <span className="font-mono">{fmt(epfEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SOCSO (1.75%)</span>
                  <span className="font-mono">{fmt(socsoEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>EIS (0.2%)</span>
                  <span className="font-mono">{fmt(eisEmployer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>HRDC Levy (1%)</span>
                  <span className="font-mono">{fmt(hrdcLevy)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total Employer Cost</span>
                  <span className="font-mono text-orange-600">
                    {fmt(totalEmployerCost)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                EPF Act 1991
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                SOCSO Act 1969
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                EIS 2017
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                ITA 1967 (PCB)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
