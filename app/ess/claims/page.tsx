"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Plus, X } from "lucide-react";

const DEMO_EMP = "demo-employee-id";
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function EssClaimsPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle]       = useState("");
  const [category, setCat]      = useState("MEDICAL");
  const [amount, setAmount]     = useState("");
  const [submitting, setSub]    = useState(false);

  const { data: claims, refetch } = trpc.claims.listClaims.useQuery({ employeeId: DEMO_EMP });
  const submitMut = trpc.claims.submitClaim.useMutation({
    onSuccess: () => { refetch(); setShowForm(false); setTitle(""); setAmount(""); },
  });

  async function handleSubmit() {
    if (!title || !amount) return;
    setSub(true);
    try {
      await submitMut.mutateAsync({
        employeeId: DEMO_EMP,
        title,
        items: [{ category, amount: Number(amount), date: new Date() }],
      });
    } finally { setSub(false); }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2"><Receipt className="h-5 w-5 text-purple-600" /> Claims</h1>
        <Button size="sm" onClick={() => setShowForm(true)}><Plus className="h-4 w-4 mr-1" /> New Claim</Button>
      </div>

      {showForm && (
        <Card className="border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              Submit Claim
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}><X className="h-4 w-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input className="w-full border rounded px-2 py-1.5 text-sm" placeholder="Title (e.g. Medical visit)" value={title} onChange={e => setTitle(e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <select className="border rounded px-2 py-1.5 text-sm" value={category} onChange={e => setCat(e.target.value)}>
                {["MEDICAL","TRAVEL","MILEAGE","ENTERTAINMENT","MISCELLANEOUS"].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="number" className="border rounded px-2 py-1.5 text-sm" placeholder="Amount (MYR)" value={amount} onChange={e => setAmount(e.target.value)} />
            </div>
            <Button size="sm" onClick={handleSubmit} disabled={submitting}>{submitting ? "Submitting…" : "Submit"}</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-2 pt-4">
          {!claims?.length && <p className="text-sm text-muted-foreground text-center py-4">No claims yet</p>}
          {claims?.map(c => (
            <div key={c.id} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-xs text-muted-foreground">MYR {Number(c.totalAmount).toFixed(2)} · {new Date(c.createdAt).toLocaleDateString()}</div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[c.status] ?? "bg-gray-100"}`}>{c.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
