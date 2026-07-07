"use client";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

export default function MssPerformancePage() {
  const { data: cycles } = trpc.performance.getCycles.useQuery({ status: "OPEN" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2"><TrendingUp className="h-5 w-5 text-teal-600" /> Team Performance</h1>
        <Link href="/dashboard/performance">
          <Button size="sm" variant="outline">Full View</Button>
        </Link>
      </div>

      {!cycles?.length ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground text-sm">
            No open review cycles. Start one from the Performance dashboard.
          </CardContent>
        </Card>
      ) : (
        cycles.map(cycle => (
          <Card key={cycle.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{cycle.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Opened: {new Date(cycle.openDate).toLocaleDateString()}</div>
                <div>Deadline: {new Date(cycle.submissionDeadline).toLocaleDateString()}</div>
                <div>Reviews: {cycle.reviewForms?.length ?? 0} form(s)</div>
              </div>
              <Button size="sm" variant="outline" className="mt-3">
                View Forms
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
