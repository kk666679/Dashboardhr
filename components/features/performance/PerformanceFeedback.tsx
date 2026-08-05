"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type FeedbackType = "Peer" | "Manager" | "Self";

interface Feedback {
  id: string;
  from: string;
  to: string;
  type: FeedbackType;
  content: string;
  date: string;
}

export function PerformanceFeedback({ employeeId }: { employeeId?: string }) {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<Feedback[]>([
    { id: "1", from: "Manager A", to: "Ahmad", type: "Manager", content: "Great job on the project!", date: "2025-03-01" },
  ]);
  const [newFeedback, setNewFeedback] = useState({ to: "", type: "Peer" as FeedbackType, content: "" });

  const handleSubmit = () => {
    if (!newFeedback.content.trim()) return;
    setFeedback([
      ...feedback,
      { id: String(Date.now()), from: "Current User", to: newFeedback.to || employeeId || "", type: newFeedback.type, content: newFeedback.content, date: new Date().toISOString() }
    ]);
    toast({ title: "Feedback submitted" });
    setNewFeedback({ to: "", type: "Peer", content: "" });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Feedback</h2>

      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Recipient</label>
            <Input
              value={newFeedback.to}
              onChange={(e) => setNewFeedback({ ...newFeedback, to: e.target.value })}
              placeholder="Employee ID"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Type</label>
            <Select
              value={newFeedback.type}
              onValueChange={(v: FeedbackType) => setNewFeedback({ ...newFeedback, type: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Peer">Peer</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Self">Self</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            value={newFeedback.content}
            onChange={(e) => setNewFeedback({ ...newFeedback, content: e.target.value })}
            placeholder="Write your feedback..."
          />
          <Button onClick={handleSubmit}>Submit</Button>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {feedback.map((f) => (
          <Card key={f.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{f.from} → {f.to}</p>
                  <p className="text-sm text-muted-foreground">{f.type} · {new Date(f.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="secondary">{f.type}</Badge>
              </div>
              <p className="mt-2">{f.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

