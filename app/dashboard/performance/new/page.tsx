"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { trpc } from "@/lib/trpc";


export default function NewPerformanceReview() {
  const [employeeId, setEmployeeId] = useState("");
  const createReview = trpc.performance.createReview.useMutation();

const performanceCreateSchema = z.object({
  employeeId: z.string().min(1),
  reviewPeriod: z.enum(["q1", "q2", "q3", "q4", "annual", "semi_annual"]),
  reviewDate: z.coerce.date(),
  overallPerformance: z.coerce.number().min(1).max(5),
  teamwork: z.coerce.number().min(1).max(5),
  productivity: z.coerce.number().min(1).max(5),
  qualityWork: z.coerce.number().min(1).max(5),
  initiative: z.coerce.number().min(1).max(5),
  strengths: z.string(),
  areasImprovement: z.string(),
  nextQuarterGoals: z.string(),
  approverId: z.string().min(1, "Approver required"),
});

const handleSubmit = async (formData: FormData) => {
  const rawData = Object.fromEntries(formData);
  const data = performanceCreateSchema.parse(rawData);
  createReview.mutate({ employeeId, ...data });
};

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/dashboard/performance">
          <Button variant="outline">← Back</Button>
        </Link>
        <h1 className="text-3xl font-bold">New Performance Review</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review Details</CardTitle>
          <CardDescription>
            Complete the form to create a new performance review.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                name="employeeId"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="period">Review Period</Label>
              <Input id="period" name="period" placeholder="2024-Q1" />
            </div>
            <div>
              <Label htmlFor="rating">Overall Rating (1-5)</Label>
              <Input id="rating" name="rating" type="number" min={1} max={5} />
            </div>
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                placeholder="Strengths, areas for improvement..."
              />
            </div>
            <Button type="submit" className="w-full">
              Create Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

