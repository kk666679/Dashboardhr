"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PerformanceReviewForm,
  type PerformanceFormData,
} from "@/components/features/documents";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function NewPerformanceReviewPage() {
  const trpcUtils = trpc.useUtils();
  const employeesQuery = trpc.performance.getEmployees.useQuery();
  const approversQuery = trpc.performance.getApprovers.useQuery();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
    trpcUtils.performance.getReviews.invalidate();
    // Navigate back or to list after delay
    setTimeout(() => router.push("/dashboard/performance"), 2000);
  };

  const employeeOptions = employeesQuery.data || [];
  const approverOptions =
    approversQuery.data?.map((u) => ({ id: u.id, name: u.email })) || [];

  if (employeesQuery.isLoading || approversQuery.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8">
        <div>Loading performance data...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Review Submitted!</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/dashboard/performance")}>
              View Performance Reviews
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
        Back to Dashboard
      </Button>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>New Performance Review</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <PerformanceReviewForm
            employeeOptions={employeeOptions}
            approverOptions={approverOptions}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}
