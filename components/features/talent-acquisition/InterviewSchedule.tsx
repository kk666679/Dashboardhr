"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Interview {
  id: string;
  candidate: string;
  job: string;
  date: string;
  time: string;
  interviewer: string;
  type: "Phone" | "Video" | "In-person";
  status: "Scheduled" | "Completed" | "Cancelled" | "No Show";
}

interface InterviewScheduleProps {
  interviews: Interview[];
  onSchedule?: (data: unknown) => void;
  onCancel?: (id: string) => void;
}

export function InterviewSchedule({ interviews, onSchedule, onCancel }: InterviewScheduleProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    candidate: "",
    job: "",
    date: "",
    time: "",
    interviewer: "",
    type: "Video",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule?.(formData);
    toast({ title: "Interview scheduled" });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Interview Schedule</h2>
        <Button onClick={() => setOpen(true)}>Schedule Interview</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Interviewer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((i) => (
            <TableRow key={i.id}>
              <TableCell>{i.candidate}</TableCell>
              <TableCell>{i.job}</TableCell>
              <TableCell>{new Date(i.date).toLocaleDateString()}</TableCell>
              <TableCell>{i.time}</TableCell>
              <TableCell>{i.interviewer}</TableCell>
              <TableCell>
                <Badge variant="secondary">{i.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={i.status === "Scheduled" ? "warning" : i.status === "Completed" ? "success" : "destructive"}>
                  {i.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {i.status === "Scheduled" && onCancel && (
                  <Button variant="destructive" size="sm" onClick={() => onCancel(i.id)}>
                    Cancel
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="candidate">Candidate</Label>
              <Input
                id="candidate"
                value={formData.candidate}
                onChange={(e) => setFormData({ ...formData, candidate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="job">Job Position</Label>
              <Input
                id="job"
                value={formData.job}
                onChange={(e) => setFormData({ ...formData, job: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="interviewer">Interviewer</Label>
              <Input
                id="interviewer"
                value={formData.interviewer}
                onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Interview Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="In-person">In-person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Schedule</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
