"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ComplianceAuditForm, type AuditFormData } from "@/components/features/documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock data
const mockApproverOptions = [
  { id: "hr1", name: "HR Manager" },
  { id: "hr2", name: "HR Supervisor" },
];

export default function NewComplianceAuditPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
    setTimeout(() => router.push("/dashboard/compliance"), 2000);
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Audit Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/dashboard/compliance")}>
              Back to Compliance
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Compliance
      </Button>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>New Compliance Audit</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <ComplianceAuditForm
            approverOptions={mockApproverOptions}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
