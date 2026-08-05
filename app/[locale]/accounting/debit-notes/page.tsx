"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, Plus, ArrowLeft, Search } from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import type { AdjustmentNote } from "@/types/accounting";

const STATUS_BADGE: Record<string, string> = {
  PROCESSED: "bg-green-100 text-green-800",
  PENDING:   "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" }).format(n);

export default function DebitNotesPage() {
  const [search, setSearch] = useState("");
  const { data: notes = [], isLoading } = trpc.accounting.listDebitNotes.useQuery(
    undefined,
    { refetchOnWindowFocus: false },
  );

  const totalProcessed = notes.filter((n: AdjustmentNote) => n.status === "PROCESSED").reduce((s, n) => s + n.amount, 0);
  const totalPending   = notes.filter((n: AdjustmentNote) => n.status === "PENDING").reduce((s, n) => s + n.amount, 0);

  const filtered = search
    ? notes.filter((n: AdjustmentNote) =>
        n.customer?.toLowerCase().includes(search.toLowerCase()) ||
        n.id?.toLowerCase().includes(search.toLowerCase())
      )
    : notes;

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/accounting"><ArrowLeft className="h-4 w-4 mr-1" /> Accounting</Link>
          </Button>
          <div className="flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Debit Notes</h1>
              <p className="text-sm text-muted-foreground">Manage additional charges and billing adjustments</p>
            </div>
          </div>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Debit Note</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-600">{fmt(totalProcessed)}</div>
            <div className="text-xs text-muted-foreground">Total Processed</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{fmt(totalPending)}</div>
            <div className="text-xs text-muted-foreground">Pending Processing</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold">{notes.length}</div>
            <div className="text-xs text-muted-foreground">Total Debit Notes</div>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Debit Note Register</CardTitle>
          <CardDescription>Additional charges and billing adjustments issued to customers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by customer or DN number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No debit notes found</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((dn: AdjustmentNote) => (
                <div key={dn.id} className="flex items-center justify-between border rounded-lg p-3 gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-sm font-medium">{dn.id}</span>
                      <Badge className={STATUS_BADGE[dn.status] ?? ""}>{dn.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-0.5">{dn.customer}</p>
                    <p className="text-xs text-muted-foreground">
                      {dn.reason}{dn.originalInvoice ? ` - Ref: ${dn.originalInvoice}` : ""}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-orange-600">+{fmt(dn.amount)}</p>
                    <p className="text-xs text-muted-foreground">{dn.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
