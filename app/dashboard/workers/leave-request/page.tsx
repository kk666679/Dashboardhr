"use client";

import { useRouter } from "next/navigation";
import { LeaveRequestForm } from "@/components/features/documents/leave-request-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LeaveRequestPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/workers">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Leave Request</h1>
          <p className="text-muted-foreground">
            Submit a new leave application
          </p>
        </div>
      </div>
      <LeaveRequestForm
        onSuccess={() => router.push("/dashboard/workers")}
        employeeOptions={[]}
        approverOptions={[]}
      />
    </div>
  );
}
