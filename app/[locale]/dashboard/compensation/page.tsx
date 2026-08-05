"use client";
/**
 * Compensation Management Dashboard — Sprint 15
 * Salary bands, compa-ratio report, compensation history.
 * Requirements: 15.1–15.7
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DollarSign, BarChart3, Plus } from "lucide-react";

// ─── Type Definitions ────────────────────────────────────────────────────────

interface SalaryBand {
  id: string;
  jobGrade: string;
  title: string | null;
  minSalary: number | string;
  midSalary: number | string;
  maxSalary: number | string;
  currency: string;
  effectiveDate: Date | string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CompaRatioReport {
  employeeId: string;
  jobGrade: string | null;
  compaRatio: number | string;
  basicSalary: number;
  currency: string;
  [key: string]: unknown;
}

interface CompensationHistory {
  id: string;
  employeeId: string;
  basicSalary: number | string;
  jobGrade: string | null;
  currency: string;
  effectiveDate: Date | string;
  reason: string | null;
  createdAt: Date;
}

interface BandFormData {
  jobGrade: string;
  title: string;
  minSalary: string;
  midSalary: string;
  maxSalary: string;
  currency: string;
  effectiveDate: string;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function CompensationPage() {
  const [empId, setEmpId] = useState<string>("");
  const [showBandForm, setShowBandForm] = useState<boolean>(false);
  const [bandForm, setBandForm] = useState<BandFormData>({
    jobGrade: "",
    title: "",
    minSalary: "",
    midSalary: "",
    maxSalary: "",
    currency: "MYR",
    effectiveDate: new Date().toISOString().slice(0, 10),
  });

  const { data: bands, refetch: refetchBands } = trpc.compensation.listBands.useQuery({ isActive: true });
  const { data: compaReport } = trpc.compensation.getCompaRatioReport.useQuery({});
  const { data: history } = trpc.compensation.getHistory.useQuery(
    { employeeId: empId },
    { enabled: !!empId }
  );

  const upsertBand = trpc.compensation.upsertBand.useMutation({
    onSuccess: () => {
      refetchBands();
      setShowBandForm(false);
      // Reset form
      setBandForm({
        jobGrade: "",
        title: "",
        minSalary: "",
        midSalary: "",
        maxSalary: "",
        currency: "MYR",
        effectiveDate: new Date().toISOString().slice(0, 10),
      });
    },
  });

  const compaColor = (ratio: number): string => {
    if (ratio >= 1.10) return "text-red-600";
    if (ratio >= 0.90) return "text-green-600";
    return "text-yellow-600";
  };

  const handleBandFormChange = (key: keyof BandFormData, value: string) => {
    setBandForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveBand = () => {
    const { jobGrade, title, minSalary, midSalary, maxSalary, currency, effectiveDate } = bandForm;
    
    if (!jobGrade) return;
    
    upsertBand.mutate({
      jobGrade,
      title: title || undefined,
      minSalary: Number(minSalary),
      midSalary: Number(midSalary),
      maxSalary: Number(maxSalary),
      currency,
      effectiveDate: new Date(effectiveDate),
    });
  };

  const formatCurrency = (amount: number | string): string => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Compensation Management</h1>
            <p className="text-sm text-muted-foreground">Salary bands · Compa-ratio · Merit review cycles</p>
          </div>
        </div>
        <Button onClick={() => setShowBandForm(!showBandForm)}>
          <Plus className="h-4 w-4 mr-2" /> New Band
        </Button>
      </div>

      {showBandForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Create Salary Band</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 md:grid-cols-6">
            {[
              { key: "jobGrade" as const, label: "Job Grade" },
              { key: "title" as const, label: "Title" },
              { key: "minSalary" as const, label: "Min (MYR)", type: "number" },
              { key: "midSalary" as const, label: "Mid (MYR)", type: "number" },
              { key: "maxSalary" as const, label: "Max (MYR)", type: "number" },
              { key: "effectiveDate" as const, label: "Effective", type: "date" },
            ].map(({ key, label, type }) => (
              <Input
                key={key}
                type={type ?? "text"}
                placeholder={label}
                value={bandForm[key]}
                onChange={(e) => handleBandFormChange(key, e.target.value)}
              />
            ))}
            <div className="sm:col-span-3 md:col-span-6 flex gap-2">
              <Button 
                onClick={handleSaveBand}
                disabled={!bandForm.jobGrade || upsertBand.isPending}
              >
                {upsertBand.isPending ? "Saving…" : "Save Band"}
              </Button>
              <Button variant="outline" onClick={() => setShowBandForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Salary bands */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Salary Bands</CardTitle>
          </CardHeader>
          <CardContent>
            {!bands?.length ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No salary bands configured
              </p>
            ) : (
              <div className="space-y-2">
                {(bands as SalaryBand[]).map((band: SalaryBand) => (
                  <div key={band.id} className="border rounded p-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">
                        {band.jobGrade}
                        {band.title && ` — ${band.title}`}
                      </span>
                      <Badge variant="outline">{band.currency}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Min: {formatCurrency(band.minSalary)} · 
                      Mid: {formatCurrency(band.midSalary)} · 
                      Max: {formatCurrency(band.maxSalary)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compa-ratio report */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> Compa-Ratio Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!compaReport?.length ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No compensation data yet
              </p>
            ) : (
              <div className="space-y-1">
                {(compaReport as CompaRatioReport[]).slice(0, 10).map((report: CompaRatioReport) => {
                  const ratio = typeof report.compaRatio === "string" 
                    ? parseFloat(report.compaRatio) 
                    : report.compaRatio;
                  return (
                    <div 
                      key={report.employeeId} 
                      className="flex items-center justify-between text-sm border-b pb-1 last:border-0"
                    >
                      <div className="font-mono text-xs">
                        {report.employeeId.slice(0, 10)}…
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {report.jobGrade ?? "—"}
                        </span>
                        <span className={`font-bold ${compaColor(ratio)}`}>
                          {ratio.toFixed(2)}x
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employee history lookup */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compensation History Lookup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Employee ID"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className="max-w-xs"
            />
          </div>
          {history && history.length > 0 && (
            <div className="space-y-1">
              {(history as CompensationHistory[]).map((record: CompensationHistory) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between border rounded p-2 text-sm"
                >
                  <div>
                    <span className="font-semibold">
                      {record.currency} {formatCurrency(record.basicSalary)}
                    </span>
                    {record.jobGrade && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        {record.jobGrade}
                      </Badge>
                    )}
                    {record.reason && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {record.reason}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(record.effectiveDate)}
                  </span>
                </div>
              ))}
            </div>
          )}
          {history && history.length === 0 && empId && (
            <p className="text-sm text-muted-foreground text-center py-2">
              No compensation history found for this employee
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}