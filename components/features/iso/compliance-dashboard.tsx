'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ComplianceDashboardProps {
  standard: string;
  data: {
    totalRequirements: number;
    implementedRequirements: number;
    compliancePercentage: number;
    maturityLevel: { level: number; label: string };
    gaps: string[];
  };
}

export function ComplianceDashboard({ standard, data }: ComplianceDashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{standard} Compliance Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold">{data.totalRequirements}</div>
              <div className="text-sm text-gray-600">Total Requirements</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{data.implementedRequirements}</div>
              <div className="text-sm text-gray-600">Implemented</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{data.gaps.length}</div>
              <div className="text-sm text-gray-600">Gaps</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Compliance Rate</span>
              <span className="text-sm font-bold">{data.compliancePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={data.compliancePercentage} />
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Maturity Level</div>
            <Badge variant="outline" className="text-lg">
              Level {data.maturityLevel.level} - {data.maturityLevel.label}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {data.gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Identified Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.gaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-orange-600">•</span>
                  <span className="text-sm">{gap}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}