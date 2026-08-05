'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import type { ISOStandard, ComplianceStatus } from '@/types/iso';

interface ComplianceCheckProps {
  standard?: ISOStandard;
  /** Pre-loaded DB findings — used to seed initial clause status. */
  liveFindings?: Array<{ clauseRef?: string; severity?: string; title?: string }>;
}

interface Finding {
  clause: string;
  title: string;
  status: ComplianceStatus;
  evidence: string;
  notes: string;
}

export function ComplianceCheck({ standard = 'ISO9001', liveFindings = [] }: ComplianceCheckProps) {
  const [selectedClause, setSelectedClause] = useState('');
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const clauses = [
    { number: '4.1', title: 'Understanding the organization and its context' },
    { number: '4.2', title: 'Understanding the needs and expectations of interested parties' },
    { number: '4.3', title: 'Determining the scope of the quality management system' },
    { number: '5.1', title: 'Leadership and commitment' },
    { number: '5.2', title: 'Quality policy' },
    { number: '5.3', title: 'Organizational roles, responsibilities and authorities' },
    { number: '6.1', title: 'Actions to address risks and opportunities' },
    { number: '6.2', title: 'Quality objectives and planning to achieve them' },
    { number: '7.1', title: 'Resources' },
    { number: '7.2', title: 'Competence' },
    { number: '7.3', title: 'Awareness' },
    { number: '7.4', title: 'Communication' },
    { number: '7.5', title: 'Documented information' },
    { number: '8.1', title: 'Operational planning and control' },
    { number: '8.2', title: 'Requirements for products and services' },
    { number: '8.3', title: 'Design and development of products and services' },
    { number: '8.4', title: 'Control of externally provided processes' },
    { number: '8.5', title: 'Production and service provision' },
    { number: '8.6', title: 'Release of products and services' },
    { number: '8.7', title: 'Control of nonconforming outputs' },
    { number: '9.1', title: 'Monitoring, measurement, analysis and evaluation' },
    { number: '9.2', title: 'Internal audit' },
    { number: '9.3', title: 'Management review' },
    { number: '10.1', title: 'General (Improvement)' },
    { number: '10.2', title: 'Nonconformity and corrective action' },
    { number: '10.3', title: 'Continual improvement' },
  ];

  const getStatusIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'non-compliant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
      case 'not-applicable':
        return <HelpCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: ComplianceStatus) => {
    const variants: Record<ComplianceStatus, 'default' | 'destructive' | 'secondary' | 'outline'> = {
      'compliant': 'default',
      'non-compliant': 'destructive',
      'partial': 'secondary',
      'not-applicable': 'outline',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const handleCheck = () => {
    if (!selectedClause) return;
    setIsChecking(true);

    // Derive status from live DB findings if available
    const matchingFindings = liveFindings.filter(
      f => f.clauseRef && f.clauseRef.startsWith(selectedClause)
    );
    let status: ComplianceStatus = 'not-applicable';
    if (matchingFindings.length > 0) {
      const hasCritical = matchingFindings.some(f => f.severity === 'CRITICAL' || f.severity === 'MAJOR');
      const hasMinor    = matchingFindings.some(f => f.severity === 'MINOR');
      status = hasCritical ? 'non-compliant' : hasMinor ? 'partial' : 'compliant';
    }

    const newFinding: Finding = {
      clause: selectedClause,
      title:  clauses.find(c => c.number === selectedClause)?.title || '',
      status,
      evidence: '',
      notes: matchingFindings.length > 0
        ? `${matchingFindings.length} DB finding(s) detected for this clause.`
        : 'No DB findings — status pending manual evidence.',
    };
    setFindings(prev => [...prev, newFinding]);
    setIsChecking(false);
  };

  const compliantCount = findings.filter(f => f.status === 'compliant').length;
  const nonCompliantCount = findings.filter(f => f.status === 'non-compliant').length;
  const partialCount = findings.filter(f => f.status === 'partial').length;
  const progress = findings.length > 0 ? (compliantCount / findings.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{standard} Compliance Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {liveFindings.length > 0 && (
            <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
              {liveFindings.length} open finding{liveFindings.length !== 1 ? 's' : ''} loaded from database — clause status pre-seeded.
            </div>
          )}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="clause">Select Clause</Label>
              <select
                id="clause"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedClause}
                onChange={(e) => setSelectedClause(e.target.value)}
              >
                <option value="">Select a clause...</option>
                {clauses.map((clause) => (
                  <option key={clause.number} value={clause.number}>
                    {clause.number} - {clause.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={handleCheck} disabled={!selectedClause || isChecking}>
                {isChecking ? 'Checking...' : 'Check Compliance'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {findings.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Compliance Results</CardTitle>
              <Badge variant="outline">{standard}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{compliantCount}</div>
                <div className="text-sm text-gray-600">Compliant</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{partialCount}</div>
                <div className="text-sm text-gray-600">Partial</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{nonCompliantCount}</div>
                <div className="text-sm text-gray-600">Non-Compliant</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">{findings.length}</div>
                <div className="text-sm text-gray-600">Total Checked</div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Overall Compliance</span>
                <span className="text-sm font-bold">{progress.toFixed(1)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {findings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {findings.map((finding, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  {getStatusIcon(finding.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{finding.clause}</span>
                      {getStatusBadge(finding.status)}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{finding.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

