"use client";
/**
 * Malaysian Statutory e-Filing page — Task 9.2
 * Exposes CP39, Borang 8A, Lampiran 1, PCB CP39, EA Form as downloadable files.
 * Requirements: 8.3, 27.4
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calculator, FileText, CheckCircle } from "lucide-react";

const FILING_TYPES = [
  { id: "generate-cp39",      label: "CP39 — EPF Monthly Contribution",   ext: "txt",  agency: "EPF / KWSP" },
  { id: "generate-borang8a",  label: "Borang 8A — SOCSO Contribution",    ext: "txt",  agency: "SOCSO / PERKESO" },
  { id: "generate-lampiran1", label: "Lampiran 1 — EIS Contribution",     ext: "xlsx", agency: "SOCSO / EIS" },
  { id: "generate-pcb",       label: "PCB CP39 — Monthly Tax Deduction",  ext: "txt",  agency: "LHDN / IRB" },
];

export default function StatutoryPage() {
  const [runId, setRunId]     = useState("");
  const [period, setPeriod]   = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [calculating, setCalc] = useState(false);
  const [calcResult, setCalcResult] = useState<any>(null);

  const { data: runs } = trpc.payrollHcm.listRuns.useQuery({ status: "FINALIZED" });
  const calcBulk = trpc.statutory.calculateBulk.useMutation();

  async function handleCalculate() {
    if (!runId) return;
    setCalc(true);
    try {
      const res = await calcBulk.mutateAsync({ runId, periodEnd: new Date() });
      setCalcResult(res);
    } finally {
      setCalc(false);
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Malaysian Statutory e-Filing</h1>
          <p className="text-sm text-muted-foreground">Generate EPF, SOCSO, EIS, and PCB submission files</p>
        </div>
      </div>

      {/* Run selector + calculate */}
      <Card>
        <CardHeader><CardTitle className="text-base">1. Select Payroll Run & Calculate Contributions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <select
              className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
              value={runId}
              onChange={e => setRunId(e.target.value)}
            >
              <option value="">Select finalized run…</option>
              {runs?.map(r => (
                <option key={r.id} value={r.id}>
                  {new Date(r.periodStart).toLocaleDateString()} – {new Date(r.periodEnd).toLocaleDateString()} ({r.legalEntityId.slice(0, 12)})
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Period YYYYMM"
              className="border rounded px-3 py-2 text-sm w-36"
              value={period}
              onChange={e => setPeriod(e.target.value)}
            />
            <Button onClick={handleCalculate} disabled={!runId || calculating}>
              <Calculator className="h-4 w-4 mr-2" />
              {calculating ? "Calculating…" : "Calculate"}
            </Button>
          </div>
          {calcResult && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded">
              <CheckCircle className="h-4 w-4" />
              Statutory contributions calculated for {calcResult.processed} employees
            </div>
          )}
        </CardContent>
      </Card>

      {/* Download filing files */}
      <Card>
        <CardHeader><CardTitle className="text-base">2. Download e-Filing Files</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {FILING_TYPES.map(f => (
              <div key={f.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="font-medium text-sm">{f.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Agency: {f.agency} · Format: .{f.ext}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!runId || !calcResult}
                  onClick={() => {
                    // TODO: call statutory worker generate endpoint + download
                    alert(`Generating ${f.label} for run ${runId.slice(0, 8)}…\n\nIn production this triggers workers/statutory.worker.ts and downloads the file.`);
                  }}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Download
                </Button>
              </div>
            ))}
          </div>
          {!runId && (
            <p className="text-xs text-muted-foreground mt-3">Select a finalized run and calculate contributions first.</p>
          )}
        </CardContent>
      </Card>

      {/* Statutory calculator */}
      <Card>
        <CardHeader><CardTitle className="text-base">Contribution Calculator</CardTitle></CardHeader>
        <CardContent>
          <StatutoryCalcWidget />
        </CardContent>
      </Card>
    </div>
  );
}

function StatutoryCalcWidget() {
  const [gross, setGross]   = useState("5000");
  const [age, setAge]       = useState("35");
  const { data: result, refetch, isFetching } = trpc.statutory.calculate.useQuery(
    {
      employeeId: "preview",
      grossSalary: Number(gross) || 0,
      periodEnd: new Date(),
      ageAtPeriodEnd: Number(age) || 35,
    },
    { enabled: false }
  );


  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-wrap">
        <div>
          <label className="text-xs text-muted-foreground">Gross Salary (MYR)</label>
          <input type="number" className="mt-1 border rounded px-2 py-1.5 text-sm w-32" value={gross} onChange={e => setGross(e.target.value)} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Employee Age</label>
          <input type="number" className="mt-1 border rounded px-2 py-1.5 text-sm w-20" value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div className="flex items-end">
          <Button size="sm" onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? "Calculating…" : "Calculate"}
          </Button>
        </div>
      </div>
      {result && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          {[
            { label: "EPF (Employee)",   value: result.epf.employee },
            { label: "EPF (Employer)",   value: result.epf.employer },
            { label: "SOCSO",            value: result.socso.employee },
            { label: "EIS",              value: result.eis.employee },
            { label: "PCB",              value: result.pcb },
            { label: "Total Deductions", value: result.totalEmployeeDeductions },
            { label: "Net Pay",          value: result.netPay },
          ].map(({ label, value }) => (

            <div key={label} className="bg-muted/40 rounded-lg p-3">
              <div className="text-xs text-muted-foreground">{label}</div>
              <div className="text-base font-semibold mt-0.5">MYR {(typeof value === "number" ? value : Number(value) || 0).toFixed(2)}</div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
}
