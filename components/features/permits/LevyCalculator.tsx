"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calculator, Download } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const levySchema = z.object({
  workerCount: z.number().min(1),
  levyRate: z.number().min(0),
}).refine((data) => data.levyRate > 0, {
  message: "Levy rate must be greater than 0",
  path: ["levyRate"],
});

type LevyForm = z.infer<typeof levySchema>;

export function LevyCalculator() {
  const [result, setResult] = useState({ basic: 0, surcharge: 0, admin: 0, total: 0 });
  const form = useForm<z.infer<typeof levySchema>>({
    resolver: zodResolver(levySchema),
    defaultValues: { workerCount: 1, levyRate: 1850 },
  });

  const calculateLevy = (data: z.infer<typeof levySchema>) => {
    const basic = data.workerCount * data.levyRate;
    const surcharge = basic * 0.2; // Example
    const admin = 50 * data.workerCount;
    const total = basic + surcharge + admin;
    setResult({ basic, surcharge, admin, total });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Foreign Worker Levy Calculator
        </CardTitle>
        <CardDescription>Calculate levy payments per Malaysian regulations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={form.handleSubmit(calculateLevy)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Number of Workers</Label>
            <Input type="number" {...form.register("workerCount", { valueAsNumber: true })} />
            </div>
            <div>
              <Label>Levy Rate (MYR)</Label>
              <Input type="number" {...form.register("levyRate", { valueAsNumber: true })} />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Calculate Levy
          </Button>
        </form>
        {result.total > 0 && (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Amount (MYR)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Basic Levy</TableCell>
                  <TableCell className="font-medium">RM {result.basic.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Surcharge (20%)</TableCell>
                  <TableCell>RM {result.surcharge.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Admin Fee</TableCell>
                  <TableCell>RM {result.admin.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow className="border-t-2 border-primary/20">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="font-bold text-2xl text-primary">RM {result.total.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Button variant="outline" className="mt-4 w-full">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

