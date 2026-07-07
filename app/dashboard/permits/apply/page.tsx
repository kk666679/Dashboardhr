"use client";

import { useRouter } from "next/navigation";
import { PermitApplicationForm } from "@/components/features/documents/permit-application-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PermitApplicationPage() {
  const router = useRouter();
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/permits">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Permits
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Permit Application</h1>
          <p className="text-muted-foreground">Apply for a new work permit</p>
        </div>
      </div>
      <PermitApplicationForm
        onSuccess={() => router.push("/dashboard/permits")}
      />
    </div>
  );
}
