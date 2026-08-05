"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EnhancedAnimatedWorkers } from "@/components/features/employee/workers";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Plus, ClipboardCheck, UserX, ShieldAlert } from "lucide-react";

export default function WorkersPage() {
  return (
    <PageShell>
      <PageHeader
        title="Workers Dashboard"
        description="Manage foreign workers, compliance, and permits."
        actions={
          <Button asChild size="sm">
            <Link href="/dashboard/workers/add">
              <Plus className="size-3.5" />
              Add Worker
            </Link>
          </Button>
        }
      />

      <EnhancedAnimatedWorkers />

      <div className="grid gap-3 md:grid-cols-3">
        <Button variant="outline" asChild className="w-full justify-start gap-2">
          <Link href="/dashboard/performance/new">
            <ClipboardCheck className="size-4" />
            New Performance Review
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full justify-start gap-2">
          <Link href="/dashboard/termination/new">
            <UserX className="size-4" />
            Process Termination
          </Link>
        </Button>
        <Button variant="outline" asChild className="w-full justify-start gap-2">
          <Link href="/dashboard/compliance/audit/new">
            <ShieldAlert className="size-4" />
            New Compliance Audit
          </Link>
        </Button>
      </div>
    </PageShell>
  );
}
