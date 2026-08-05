"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Receipt, Plus, X, Loader2 } from "lucide-react";

const CLAIM_CATEGORIES = ["MEDICAL", "TRAVEL", "MILEAGE", "ENTERTAINMENT", "MISCELLANEOUS"];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function EssClaimsPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCat] = useState("MEDICAL");
  const [amount, setAmount] = useState("");
  const [submitting, setSub] = useState(false);

  const { data: claims, isLoading, refetch } = trpc.claims.listClaims.useQuery(
    { employeeId: "me" },
    { enabled: true }
  );
  const submitMut = trpc.claims.submitClaim.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      setTitle("");
      setAmount("");
      setCat("MEDICAL");
    },
  });

  async function handleSubmit() {
    if (!title || !amount) return;
    setSub(true);
    try {
      await submitMut.mutateAsync({
        employeeId: "me",
        title,
        items: [{ category, amount: Number(amount), date: new Date() }],
      });
    } finally {
      setSub(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Receipt className="h-5 w-5 text-purple-600" /> Claims
        </h1>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-1" /> {showForm ? "Cancel" : "New Claim"}
        </Button>
      </div>

      {showForm && (
        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Submit Claim
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                className="mt-1"
                placeholder="e.g. Medical visit"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Category</Label>
                <Select value={category} onValueChange={setCat}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CLAIM_CATEGORIES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Amount (MYR)</Label>
                <Input
                  type="number"
                  className="mt-1"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Claim History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {!claims?.length ? (
            <p className="text-sm text-muted-foreground text-center py-4">No claims yet</p>
          ) : (
            claims.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <div className="text-sm font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">
                    MYR {Number(c.totalAmount).toFixed(2)} · {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status] ?? "bg-gray-100 text-gray-700"}`}>
                  {c.status}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
