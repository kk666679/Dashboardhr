import { Badge } from "@/components/ui/badge";
"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface Contribution {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  date: string;
  type: "MONTHLY" | "VOLUNTARY";
  status: "PAID" | "PENDING" | "FAILED";
}

export function TabungHajiContribution() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    type: "MONTHLY" as "MONTHLY" | "VOLUNTARY",
  });

  const contributions: Contribution[] = [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Ahmad Bin Ali",
      amount: 200,
      date: "2025-03-01",
      type: "MONTHLY",
      status: "PAID",
    },
    {
      id: "2",
      employeeId: "EMP003",
      employeeName: "Fatimah Abdullah",
      amount: 500,
      date: "2025-03-15",
      type: "VOLUNTARY",
      status: "PENDING",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Contribution recorded" });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contributions</h2>
        <Button onClick={() => setOpen(true)}>Add Contribution</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contributions.map((c) => (
            <TableRow key={c.id}>
              <TableCell>{c.employeeName}</TableCell>
              <TableCell>RM {c.amount}</TableCell>
              <TableCell>{new Date(c.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Badge variant={c.type === "MONTHLY" ? "secondary" : "outline"}>{c.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={c.status === "PAID" ? "success" : c.status === "PENDING" ? "warning" : "destructive"}>
                  {c.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">Receipt</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Contribution</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cont-employeeId">Employee ID</Label>
              <Input
                id="cont-employeeId"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cont-amount">Amount (RM)</Label>
              <Input
                id="cont-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cont-date">Date</Label>
              <Input
                id="cont-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="cont-type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(v) => setFormData({ ...formData, type: v as "MONTHLY" | "VOLUNTARY" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="VOLUNTARY">Voluntary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
