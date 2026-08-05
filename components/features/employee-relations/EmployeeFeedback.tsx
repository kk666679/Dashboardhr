import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Feedback {
  id: string;
  employee: string;
  category: string;
  content: string;
  date: string;
  rating: number;
}

interface EmployeeFeedbackProps {
  feedbacks: Feedback[];
  onSubmit?: (data: unknown) => void;
}

export function EmployeeFeedback({ feedbacks, onSubmit }: EmployeeFeedbackProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: "",
    content: "",
    rating: 3,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
    toast({ title: "Feedback submitted" });
    setFormData({ category: "", content: "", rating: 3 });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Employee Feedback</h2>

      <Card>
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Workplace">Workplace</SelectItem>
                  <SelectItem value="Culture">Culture</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Benefits">Benefits</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <Button
                    key={r}
                    type="button"
                    variant={formData.rating === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFormData({ ...formData, rating: r })}
                  >
                    {r}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Share your feedback..."
                required
              />
            </div>
            <Button type="submit">Submit Feedback</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feedbacks.map((f) => (
              <div key={f.id} className="border-b last:border-0 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium">{f.employee}</span>
                    <span className="text-sm text-muted-foreground ml-2">{f.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < f.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm mt-1">{f.content}</p>
                <span className="text-xs text-muted-foreground">{new Date(f.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
