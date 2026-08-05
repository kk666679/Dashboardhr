"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface ExitInterviewData {
  id: string;
  tenantId: string;
  terminationId: string;
  interviewerId: string | null;
  scheduledAt: string | Date | null;
  completedAt: string | Date | null;
  feedback: string | null;
  rating: number | null;
  status: string;
  interviewer: { name: string } | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ExitInterviewViewProps {
  data: ExitInterviewData;
}

export function ExitInterviewView({ data }: ExitInterviewViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exit Interview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium">Date</span>
            <p>{data.scheduledAt ? format(new Date(data.scheduledAt), "PPP") : "Not scheduled"}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Interviewer</span>
            <p>{data.interviewer?.name ?? "N/A"}</p>
          </div>
        </div>
        <div>
          <span className="text-sm font-medium">Feedback</span>
          <p className="whitespace-pre-wrap">{data.feedback ?? "No feedback recorded"}</p>
        </div>
        <div>
          <span className="text-sm font-medium">Status</span>
          <Badge variant={data.status === "COMPLETED" ? "success" : "secondary"}>
            {data.status}
          </Badge>
        </div>
        {data.rating != null && (
          <div>
            <span className="text-sm font-medium">Rating</span>
            <p>{data.rating}/5</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

