"use client";

import { useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import {
  Calculator, FileText, Truck, CreditCard, Receipt,
  TrendingUp, DollarSign, AlertTriangle, CheckCircle,
  Plus, Download, Eye, ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";

export default function AccountingDashboardPage() {
  const { data: summary, isLoading: summaryLoading } = trpc.accounting.accountingSummary.useQuery();
  const { data: creditNotes = [] } = trpc.accounting.listCreditNotes.useQuery({});
  const { data: debitNotes = [] } = trpc.accounting.listDebitNotes.useQuery({});
  const { data: deliveryOrders = [] } = trpc.accounting.listDeliveryOrders.useQuery({});

  // Document stats derived from live data
  const documentStats = {
    invoices:       { total: 0, pending: summary?.pendingPayrolls ?? 0, overdue: 0 },
    deliveryOrders: { total: deliveryOrders.length, pending: deliveryOrders.filter((o: any) => o.deliveryStatus === "pending").length, completed: deliveryOrders.filter((o: any) => o.deliveryStatus === "delivered").length },
    creditNotes:    { total: creditNotes.length, processed: creditNotes.filter((n: any) => n.status === "PROCESSED").length, pending: creditNotes.filter((n: any) => n.status === "PENDING").length },
    debitNotes:     { total: debitNotes.length, processed: debitNotes.filter((n: any) => n.status === "PROCESSED").length, pending: debitNotes.filter((n: any) => n.status === "PENDING").length },
  };

  const accountingSummary = {
    totalRevenue: 125000,
    totalExpenses: 89000,
    netProfit: 36000,
    outstandingInvoices: 45000,
    overdueInvoices: 12000,
  };

  const recentTransactions = [
    { id: "INV-2024-001", type: "invoice",        customer: "ABC Construction Sdn Bhd", amount: 15000,  status: "paid",      date: "2024-01-15", description: "Work permit processing – 25 workers" },
    { id: "DO-2024-045",  type: "delivery_order", customer: "XYZ Manufacturing",        amount: 8500,   status: "delivered", date: "2024-01-14", description: "Accommodation supplies delivery" },
    { id: "CN-2024-003",  type: "credit_note",    customer: "DEF Services",             amount: -2500,  status: "processed", date: "2024-01-13", description: "Service cancellation refund" },
  ];

  const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "info"> = {
    paid: "success", pending: "warning", overdue: "destructive",
    delivered: "info", processed: "success",
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(n);

  /* Icon and accent per document type */
  const DOC_CONFIG = {
    invoices:       { Icon: FileText,  accent: "text-[var(--brand)]",           bg: "bg-[var(--brand-muted)]",        href: "/accounting/invoices" },
    deliveryOrders: { Icon: Truck,     accent: "text-[var(--success-foreground)]", bg: "bg-[var(--success-subtle)]",  href: "/accounting/delivery-orders" },
    creditNotes:    { Icon: CreditCard,accent: "text-[var(--warning-foreground)]", bg: "bg-[var(--warning-subtle)]",  href: "/accounting/credit-notes" },
    debitNotes:     { Icon: Receipt,   accent: "text-[var(--foreground-muted)]",   bg: "bg-[var(--surface-3)]",       href: "/accounting/debit-notes" },
  } as const;

  type DocKey = keyof typeof DOC_CONFIG;

  const TXN_ICON = { invoice: FileText, delivery_order: Truck, credit_note: CreditCard };

  return (
    <PageShell>
      <PageHeader
        title="Accounting Dashboard"
        description="Financial management and Malaysian regulatory compliance"
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href="/accounting/reports">
                <Download className="size-3.5" /> Export
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/accounting/invoices/create">
                <Plus className="size-3.5" /> New Invoice
              </Link>
            </Button>
          </>
        }
      />

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : (
          [
          { label: "Total Revenue",          value: fmt(accountingSummary.totalRevenue),          sub: "+12.5% from last month",  subTrend: "up" as const,   Icon: TrendingUp  },
          { label: "Net Profit",             value: fmt(accountingSummary.netProfit),             sub: "+8.2% from last month",   subTrend: "up" as const,   Icon: DollarSign  },
          { label: "Outstanding Invoices",   value: fmt(accountingSummary.outstandingInvoices),   sub: `${documentStats.invoices.pending} pending`,         subTrend: "neutral" as const, Icon: FileText    },
          { label: "Overdue Amount",         value: fmt(accountingSummary.overdueInvoices),       sub: `${documentStats.invoices.overdue} overdue invoices`, subTrend: "down" as const, Icon: AlertTriangle },
        ].map(({ label, value, sub, subTrend, Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="size-4 text-[var(--foreground-muted)]" />
            </CardHeader>
            <CardContent>
              <div className={[
                "text-2xl font-bold tracking-tight",
                subTrend === "up"   && "text-[var(--success-foreground)]",
                subTrend === "down" && "text-[var(--destructive-foreground)]",
                subTrend === "neutral" && "text-[var(--warning-foreground)]",
              ].filter(Boolean).join(" ")}>
                {value}
              </div>
              <p className="text-xs text-[var(--foreground-muted)] mt-1">{sub}</p>
            </CardContent>
          </Card>
        ))
        )}
      </div>

      {/* Document overview + Recent transactions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Document Overview</CardTitle>
            <CardDescription>Summary of all accounting documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(Object.keys(DOC_CONFIG) as DocKey[]).map((key) => {
              const { Icon, accent, bg, href } = DOC_CONFIG[key];
              const stat = documentStats[key];
              const sub = key === "deliveryOrders"
                ? `${stat.pending} pending, ${(stat as typeof documentStats.deliveryOrders).completed} completed`
                : `${stat.pending} pending`;

              return (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--border)] p-3 hover:bg-[var(--surface-2)] transition-colors duration-150"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex size-8 items-center justify-center rounded-[var(--radius-sm)] ${bg}`}>
                      <Icon className={`size-4 ${accent}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-xs text-[var(--foreground-muted)]">{sub}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold tabular-nums">{stat.total}</span>
                    <Button variant="ghost" size="icon-sm" asChild>
                      <Link href={href} aria-label={`View ${key}`}>
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest financial activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((txn) => {
              const Icon = TXN_ICON[txn.type as keyof typeof TXN_ICON] ?? FileText;
              return (
                <div key={txn.id} className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--border)] p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
                      <Icon className="size-4 text-[var(--foreground-muted)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{txn.id}</p>
                      <p className="text-xs text-[var(--foreground-muted)] truncate">{txn.customer}</p>
                      <p className="text-[11px] text-[var(--foreground-subtle)] truncate">{txn.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold tabular-nums ${txn.amount < 0 ? "text-[var(--destructive-foreground)]" : "text-[var(--success-foreground)]"}`}>
                      {fmt(Math.abs(txn.amount))}
                    </p>
                    <Badge variant={STATUS_VARIANT[txn.status] ?? "secondary"} size="xs" className="mt-1">
                      {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </Badge>
                    <p className="text-[11px] text-[var(--foreground-subtle)] mt-0.5">{txn.date}</p>
                  </div>
                </div>
              );
            })}
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/accounting/reports">
                <Eye className="size-3.5" /> View All Transactions
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Malaysian Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Malaysian Regulatory Compliance</CardTitle>
          <CardDescription>SST compliance and e-Invoice readiness status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">SST Compliance</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--foreground-muted)]">Current Month SST</span>
                  <span className="font-medium">{fmt(7500)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--foreground-muted)]">Filing Status</span>
                  <Badge variant="success" size="xs"><CheckCircle className="size-3" /> Up to Date</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[var(--foreground-muted)]">Next Filing Due</span>
                  <span className="font-medium">Feb 28, 2024</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">e-Invoice Readiness</h4>
              <div className="space-y-2 text-sm">
                {["System Integration", "Digital Certificates", "LHDN Registration"].map(label => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[var(--foreground-muted)]">{label}</span>
                    <Badge variant="success" size="xs"><CheckCircle className="size-3" /> Ready</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Compliance Score</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--foreground-muted)]">Overall Score</span>
                  <span className="text-lg font-bold text-[var(--success-foreground)]">96%</span>
                </div>
                <Progress value={96} className="h-2" />
                <p className="text-xs text-[var(--foreground-muted)]">
                  Excellent compliance with Malaysian regulations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common accounting tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Create Invoice",      href: "/accounting/invoices/create",         Icon: FileText,  primary: true  },
              { label: "New Delivery Order",  href: "/accounting/delivery-orders/create",  Icon: Truck,     primary: false },
              { label: "Tax Calculator",      href: "/accounting/tax-calculator",           Icon: Calculator, primary: false },
              { label: "Financial Reports",   href: "/accounting/reports",                  Icon: TrendingUp, primary: false },
            ].map(({ label, href, Icon, primary }) => (
              <Button
                key={label}
                variant={primary ? "default" : "outline"}
                className="h-16 flex-col gap-1.5"
                asChild
              >
                <Link href={href}>
                  <Icon className="size-5" />
                  <span className="text-xs">{label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}
