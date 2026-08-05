"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PerformanceReviewViewProps {
  review: {
    id: string;
    employee: string;
    reviewer: string;
    date: string;
    rating: number;
    status: string;
    strengths?: string;
    weaknesses?: string;
    goals?: string;
  };
}

export function PerformanceReviewView({ review }: PerformanceReviewViewProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Performance Review</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant="secondary">{review.employee}</Badge>
            <Badge variant="outline">{review.reviewer}</Badge>
            <Badge variant={review.status === "Completed" ? "success" : "warning"}>
              {review.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/performance/${review.id}/edit`)}>
            Edit
          </Button>
          <Button variant="outline" size="sm">Export PDF</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rating: {review.rating} / 5</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {review.strengths && (
            <div>
              <h3 className="font-medium">Strengths</h3>
              <p className="text-sm text-muted-foreground">{review.strengths}</p>
            </div>
          )}
          {review.weaknesses && (
            <div>
              <h3 className="font-medium">Areas for Improvement</h3>
              <p className="text-sm text-muted-foreground">{review.weaknesses}</p>
            </div>
          )}
          {review.goals && (
            <div>
              <h3 className="font-medium">Goals</h3>
              <p className="text-sm text-muted-foreground">{review.goals}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
