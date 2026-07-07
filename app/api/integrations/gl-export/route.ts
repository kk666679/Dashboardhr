/**
 * GL Journal Export — Design doc REST route
 * Generates payroll journal entries for General Ledger system.
 * Requirements: 8.1 (separate GL entries per legal entity)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "decimal.js";

export async function GET(request: NextRequest) {
  const url     = new URL(request.url);
  const runId   = url.searchParams.get("runId");
  const tenantId = url.searchParams.get("tenantId");

  if (!runId || !tenantId) {
    return NextResponse.json({ error: "runId and tenantId are required" }, { status: 400 });
  }

  const run = await prisma.payrollRun.findFirst({
    where: { id: runId, tenantId, status: "FINALIZED" },
    include: { lineItems: true },
  });

  if (!run) return NextResponse.json({ error: "Finalized payroll run not found" }, { status: 404 });

  // Aggregate totals by component type
  const totals: Record<string, Decimal> = {};
  for (const item of run.lineItems) {
    const key = item.componentType;
    totals[key] = (totals[key] ?? new Decimal(0)).add(item.amount);
  }

  // Build GL journal entry (double-entry bookkeeping)
  const journalEntries = [
    { account: "Salary Expense",        debit: totals["BASIC"]?.toFixed(2) ?? "0.00",     credit: "0.00" },
    { account: "Allowance Expense",     debit: totals["ALLOWANCE"]?.toFixed(2) ?? "0.00", credit: "0.00" },
    { account: "EPF Employer Expense",  debit: totals["EPF_ER"]?.toFixed(2) ?? "0.00",    credit: "0.00" },
    { account: "SOCSO Employer",        debit: "0.00",   credit: totals["SOCSO"]?.toFixed(2) ?? "0.00" },
    { account: "EPF Employee Payable",  debit: "0.00",   credit: totals["EPF_EE"]?.toFixed(2) ?? "0.00" },
    { account: "PCB Payable",           debit: "0.00",   credit: totals["PCB"]?.toFixed(2) ?? "0.00" },
    { account: "Net Salary Payable",    debit: "0.00",   credit: totals["NET"]?.toFixed(2) ?? "0.00" },
  ];

  const totalDebits  = journalEntries.reduce((s, e) => s.add(new Decimal(e.debit)), new Decimal(0));
  const totalCredits = journalEntries.reduce((s, e) => s.add(new Decimal(e.credit)), new Decimal(0));

  return NextResponse.json({
    runId,
    legalEntityId: run.legalEntityId,
    periodStart: run.periodStart,
    periodEnd: run.periodEnd,
    currency: "MYR",
    journalEntries,
    totals: {
      debits: totalDebits.toFixed(2),
      credits: totalCredits.toFixed(2),
      balanced: totalDebits.equals(totalCredits),
    },
  });
}
