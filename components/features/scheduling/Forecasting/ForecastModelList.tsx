"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ForecastModel {
  id: string;
  name: string;
  modelType: string;
  parameters: Record<string, unknown>;
}

interface ForecastModelListProps {
  models: ForecastModel[];
  onRun: (id: string) => void;
  isRunning: boolean;
}

export function ForecastModelList({ models, onRun, isRunning }: ForecastModelListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Parameters</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models.map((model) => (
          <TableRow key={model.id}>
            <TableCell>{model.name}</TableCell>
            <TableCell>
              <Badge variant="secondary">{model.modelType}</Badge>
            </TableCell>
            <TableCell>{JSON.stringify(model.parameters).slice(0, 50)}</TableCell>
            <TableCell className="text-right">
              <Button size="sm" onClick={() => onRun(model.id)} disabled={isRunning}>
                Run
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
