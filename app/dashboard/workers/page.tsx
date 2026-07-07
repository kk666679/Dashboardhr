"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EnhancedAnimatedWorkers } from "@/components/workers";

export default function WorkersPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workers Dashboard</h1>
          <p className="text-muted-foreground">
            Manage foreign workers and compliance
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/workers/add">Add New Worker</Link>
        </Button>
      </div>
      <EnhancedAnimatedWorkers />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Button variant="outline" asChild className="w-full">
          <Link href="/dashboard/performance/new">New Performance Review</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/dashboard/termination/new">Process Termination</Link>
        </Button>
        <Button variant="outline" asChild className="w-full">
          <Link href="/dashboard/compliance/audit/new">
            New Compliance Audit
          </Link>
        </Button>
      </div>
    </div>
  );
}
