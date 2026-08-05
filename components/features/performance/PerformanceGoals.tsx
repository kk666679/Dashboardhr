"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";

interface Goal {
  id: string;
  employee: string;
  description: string;
  dueDate: string;
  status: "Not Started" | "In Progress" | "Completed";
  progress: number;
}

export function PerformanceGoals({ employeeId }: { employeeId?: string }) {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", employee: "Ahmad", description: "Complete project X", dueDate: "2025-04-15", status: "In Progress", progress: 70 },
    { id: "2", employee: "Siti", description: "Complete certification", dueDate: "2025-05-01", status: "Not Started", progress: 0 },
  ]);

  const handleUpdateProgress = (id: string, progress: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress, status: progress === 100 ? "Completed" : "In Progress" } : g));
    toast({ title: "Goal updated" });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Goals</h2>
        <Button>Add Goal</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((g) => (
            <TableRow key={g.id}>
              <TableCell>{g.employee}</TableCell>
              <TableCell>{g.description}</TableCell>
              <TableCell>{new Date(g.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={g.progress} className="w-20" />
                  <span className="text-sm">{g.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={g.status === "Completed" ? "success" : g.status === "In Progress" ? "warning" : "secondary"}>
                  {g.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(g.id, Math.min(100, g.progress + 10))}>
                  +10%
                </Button>
                <Button variant="outline" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
