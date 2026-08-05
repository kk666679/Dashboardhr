"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

interface Enrollment {
  id: string;
  employeeId: string;
  employeeName: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  startDate: string;
  monthlyDeduction: number;
}

export function TabungHajiEnrollment() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    monthlyDeduction: 0,
    startDate: new Date().toISOString().split("T")[0],
  });

  // Mock data – replace with real API calls
  const enrollments: Enrollment[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Ahmad Bin Ali",
      status: "ACTIVE",
      startDate: "2025-01-01",
      monthlyDeduction: 200,
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Siti Aisyah",
      status: "PENDING",
      startDate: "2025-02-15",
      monthlyDeduction: 150,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Enrollment submitted" });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tabung Haji Enrollments</h2>
        <Button onClick={() => setOpen(true)}>Enroll Employee</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Monthly Deduction</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enrollments.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.employeeName}</TableCell>
              <TableCell>{new Date(e.startDate).toLocaleDateString()}</TableCell>
              <TableCell>RM {e.monthlyDeduction}</TableCell>
              <TableCell>
                <Badge variant={e.status === "ACTIVE" ? "success" : e.status === "PENDING" ? "warning" : "secondary"}>
                  {e.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll Employee for Tabung Haji</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="employeeId">Employee ID</Label>
              <Input
                id="employeeId"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="monthlyDeduction">Monthly Deduction (RM)</Label>
              <Input
                id="monthlyDeduction"
                type="number"
                value={formData.monthlyDeduction}
                onChange={(e) => setFormData({ ...formData, monthlyDeduction: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Enroll</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
