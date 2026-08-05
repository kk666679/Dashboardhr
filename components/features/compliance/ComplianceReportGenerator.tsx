import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface ReportFilters {
  period: string;
  regulation: string;
  status: string;
}

interface ComplianceReportGeneratorProps {
  onGenerate?: (filters: ReportFilters) => void;
}

export function ComplianceReportGenerator({ onGenerate }: ComplianceReportGeneratorProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<ReportFilters>({
    period: "this-month",
    regulation: "all",
    status: "all",
  });

  const handleGenerate = () => {
    toast({ title: "Generating report..." });
    onGenerate?.(filters);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compliance Report Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Period</Label>
          <Select
            value={filters.period}
            onValueChange={(v) => setFilters({ ...filters, period: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Regulation</Label>
          <Select
            value={filters.regulation}
            onValueChange={(v) => setFilters({ ...filters, regulation: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regulations</SelectItem>
              <SelectItem value="iso9001">ISO 9001</SelectItem>
              <SelectItem value="iso45001">ISO 45001</SelectItem>
              <SelectItem value="gdpr">GDPR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select
            value={filters.status}
            onValueChange={(v) => setFilters({ ...filters, status: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="compliant">Compliant</SelectItem>
              <SelectItem value="non-compliant">Non-Compliant</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleGenerate}>Generate Report</Button>
        <div className="mt-4 p-4 border rounded bg-muted/20 text-sm text-muted-foreground">
          Report will include: compliance metrics, outstanding actions, risk summary.
        </div>
      </CardContent>
    </Card>
  );
}
