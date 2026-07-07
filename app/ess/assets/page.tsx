"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, CheckCircle } from "lucide-react";

const DEMO_EMP = "demo-employee-id";

export default function EssAssetsPage() {
  const { data: assets } = trpc.assets.listAssets.useQuery({ assignedTo: DEMO_EMP });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2"><Package className="h-5 w-5 text-orange-600" /> My Assets</h1>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Assigned Equipment</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {!assets?.length && <p className="text-sm text-muted-foreground text-center py-4">No assets assigned</p>}
          {assets?.map(asset => (
            <div key={asset.id} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="text-sm font-medium">{asset.name}</div>
                <div className="text-xs text-muted-foreground">
                  {asset.category}
                  {asset.serialNumber ? ` · S/N: ${asset.serialNumber}` : ""}
                </div>
                {asset.assignedDate && (
                  <div className="text-xs text-muted-foreground">
                    Assigned: {new Date(asset.assignedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{asset.status}</span>
                <Button size="sm" variant="ghost" className="text-xs">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" /> Acknowledge
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        All assigned assets must be returned on your last working day. Unreturned assets will be escalated to HR.
      </p>
    </div>
  );
}
