"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Risk {
  id: string;
  description: string;
  likelihood: number;
  impact: number;
  riskScore: number;
  mitigation: string;
}

export function RiskAssessmentTool() {
  const [risks, setRisks] = useState<Risk[]>([
    { id: "1", description: "Data breach", likelihood: 3, impact: 5, riskScore: 15, mitigation: "Encrypt data" },
  ]);

  const addRisk = () => {
    const newRisk: Risk = {
      id: Date.now().toString(),
      description: "New risk",
      likelihood: 3,
      impact: 3,
      riskScore: 9,
      mitigation: "",
    };
    setRisks([...risks, newRisk]);
  };

  const updateRisk = (id: string, field: keyof Risk, value: unknown) => {
    setRisks(
      risks.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          updated.riskScore = updated.likelihood * updated.impact;
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRisk = (id: string) => {
    setRisks(risks.filter((r) => r.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Likelihood (1-5)</TableHead>
              <TableHead>Impact (1-5)</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Mitigation</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Input
                    value={r.description}
                    onChange={(e) => updateRisk(r.id, "description", e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={String(r.likelihood)}
                    onValueChange={(v) => updateRisk(r.id, "likelihood", parseInt(v))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    value={String(r.impact)}
                    onValueChange={(v) => updateRisk(r.id, "impact", parseInt(v))}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <span className={r.riskScore > 15 ? "text-destructive font-bold" : r.riskScore > 8 ? "text-yellow-600" : "text-green-600"}>
                    {r.riskScore}
                  </span>
                </TableCell>
                <TableCell>
                  <Input
                    value={r.mitigation}
                    onChange={(e) => updateRisk(r.id, "mitigation", e.target.value)}
                    placeholder="Mitigation plan"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteRisk(r.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button variant="outline" className="mt-4" onClick={addRisk}>
          Add Risk
        </Button>
      </CardContent>
    </Card>
  );
}
