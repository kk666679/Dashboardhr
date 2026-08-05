"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface CalculationResult {
  grossIncome: number;
  zakatRate: number;
  zakatAmount: number;
  deductions: number;
  netZakat: number;
}

export function ZakatCalculator() {
  const { toast } = useToast();
  const [income, setIncome] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [deductions, setDeductions] = useState<number>(0);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const nisab = 45000; // Approximate nisab in MYR (based on gold price)

  const calculate = () => {
    if (income < nisab && savings < nisab) {
      toast({ title: "Zakat not applicable", description: "Income and savings are below nisab threshold." });
      setResult(null);
      return;
    }

    const taxableIncome = Math.max(0, income - savings); // Simplified: use income after savings
    const zakatRate = 0.025; // 2.5%
    const zakatAmount = taxableIncome * zakatRate;
    const netZakat = Math.max(0, zakatAmount - deductions);

    setResult({
      grossIncome: income,
      zakatRate,
      zakatAmount,
      deductions,
      netZakat,
    });

    toast({ title: "Zakat calculation complete" });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Zakat Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="income">Annual Income (RM)</Label>
            <Input
              id="income"
              type="number"
              value={income}
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              placeholder="Enter annual income"
            />
          </div>
          <div>
            <Label htmlFor="savings">Savings (RM)</Label>
            <Input
              id="savings"
              type="number"
              value={savings}
              onChange={(e) => setSavings(parseFloat(e.target.value) || 0)}
              placeholder="Enter total savings"
            />
          </div>
          <div>
            <Label htmlFor="deductions">Deductions (RM)</Label>
            <Input
              id="deductions"
              type="number"
              value={deductions}
              onChange={(e) => setDeductions(parseFloat(e.target.value) || 0)}
              placeholder="Enter deductions"
            />
          </div>
          <Button onClick={calculate}>Calculate Zakat</Button>

          {result && (
            <div className="mt-6 p-4 border rounded bg-muted/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Gross Income</span>
                  <p className="text-lg font-bold">RM {result.grossIncome}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Zakat Rate</span>
                  <p className="text-lg font-bold">{result.zakatRate * 100}%</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Zakat Amount</span>
                  <p className="text-lg font-bold">RM {result.zakatAmount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Deductions</span>
                  <p className="text-lg font-bold">RM {result.deductions}</p>
                </div>
                <div className="col-span-2 border-t pt-2">
                  <span className="text-sm font-medium">Net Zakat Payable</span>
                  <p className="text-2xl font-bold text-green-600">RM {result.netZakat.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nisab Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            The current Nisab threshold is approximately <strong>RM {nisab}</strong> (based on gold price).
            Zakat is obligatory on wealth that exceeds this threshold.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
