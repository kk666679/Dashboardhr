import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ChartCard } from "@/components/charts";

interface FOMEMAComplianceReportProps {
  complianceData: { month: string; compliant: number; nonCompliant: number }[];
  overall: { total: number; compliant: number; nonCompliant: number };
}

export function FOMEMAComplianceReport({ complianceData, overall }: FOMEMAComplianceReportProps) {
  const complianceRate = overall.total ? Math.round((overall.compliant / overall.total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compliance Report</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm">Overall Compliance:</span>
          <span className="font-bold text-lg text-green-600">{complianceRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overall.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overall.compliant}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Non-Compliant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overall.nonCompliant}</div>
          </CardContent>
        </Card>
      </div>

      <ChartCard title="Monthly Compliance Trend">
        <BarChart data={complianceData} xKey="month" yKey={["compliant", "nonCompliant"]} stacked />
      </ChartCard>
    </div>
  );
}
