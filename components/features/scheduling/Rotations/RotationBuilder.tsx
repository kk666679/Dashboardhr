"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc";

interface RotationBuilderProps {
  groupId?: string;
  onSuccess?: () => void;
}

export function RotationBuilder({ groupId, onSuccess }: RotationBuilderProps) {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const [selectedPattern, setSelectedPattern] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const { data: patterns } = trpc.shiftPattern.getAll.useQuery();
  const { data: employees } = trpc.employee.list.useQuery();

  const { mutate: generate, isPending } = trpc.rotation.generate.useMutation({
    onSuccess: () => {
      toast({ title: "Rotation generated" });
      utils.rotation.getByGroup.invalidate({ groupId });
      onSuccess?.();
    },
    onError: (err) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });

  const handleGenerate = () => {
    if (!selectedPattern || selectedEmployees.length === 0) {
      toast({ title: "Please select pattern and employees" });
      return;
    }
    generate({ groupId, patternId: selectedPattern, employeeIds: selectedEmployees });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rotation Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Shift Pattern</label>
            <Select onValueChange={setSelectedPattern} value={selectedPattern}>
              <SelectTrigger>
                <SelectValue placeholder="Select pattern" />
              </SelectTrigger>
              <SelectContent>
                {patterns?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Employees (multi-select)</label>
            <Select onValueChange={(v) => setSelectedEmployees(prev => prev.includes(v) ? prev.filter(e => e !== v) : [...prev, v])}>
              <SelectTrigger>
                <SelectValue placeholder="Select employees" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((e: { id: string; name: string }) => (
                  <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedEmployees.map(id => {
                const emp = employees?.find((e: { id: string; name: string }) => e.id === id);
                return emp ? <span key={id} className="bg-muted px-2 py-0.5 rounded text-xs">{emp.name}</span> : null;
              })}
            </div>
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={isPending}>
          {isPending ? "Generating..." : "Generate Rotation"}
        </Button>
      </CardContent>
    </Card>
  );
}
