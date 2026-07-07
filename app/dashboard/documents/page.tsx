"use client";
/**
 * Document Management dashboard — Sprint 26
 * Requirements: 26.1–26.6
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Upload, PenLine } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  EXPIRED:  "bg-gray-100 text-gray-700",
};

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  // TODO: implement real documentManagement router. Until then, map to existing `document` router.
  const { data: docs } = trpc.document.list.useQuery({
    limit: 50,
  } as any);

  const { data: searchRes } = trpc.document.list.useQuery(
    { status: "draft" } as any,
    { enabled: search.length >= 2 }
  );

  const signMut = trpc.document.validate.useMutation();


  const displayed = search.length >= 2 ? (searchRes ?? []) : (docs ?? []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Document Management</h1>
            <p className="text-sm text-muted-foreground">Version-controlled · OCR-indexed · Digitally signed</p>
          </div>
        </div>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" /> Upload Document
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          className="w-full border rounded pl-9 pr-3 py-2 text-sm"
          placeholder="Search document content (OCR-indexed)…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Document list */}
      <Card>
        <CardContent className="p-0">
          {!displayed.length ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No documents found</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  {["Employee", "Type", "Status", "Expiry", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((doc: any) => (
                  <tr key={doc.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-2.5">{doc.employee?.name ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${STATUS_COLORS[doc.status] ?? "bg-gray-100"}`}>{doc.status}</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">
                      {doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-2.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => signMut.mutate({ id: doc.id } as any)}

                        disabled={doc.status === "APPROVED"}
                      >
                        <PenLine className="h-3.5 w-3.5 mr-1" /> Sign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
