'use client';

import { api } from '@/lib/trpc';
import { ComplianceDashboard } from '@/components/features/iso/compliance-dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// ISO 9001:2015 — all 26 clauses, seeded as "pending" until user performs a real check
const ISO9001_REQUIREMENTS = [
  { requirement: '4.1 Context of the organization', implemented: false, evidence: [] },
  { requirement: '4.2 Interested parties', implemented: false, evidence: [] },
  { requirement: '4.3 Scope of QMS', implemented: false, evidence: [] },
  { requirement: '4.4 QMS processes', implemented: false, evidence: [] },
  { requirement: '5.1 Leadership commitment', implemented: false, evidence: [] },
  { requirement: '5.2 Quality policy', implemented: false, evidence: [] },
  { requirement: '5.3 Roles and responsibilities', implemented: false, evidence: [] },
  { requirement: '6.1 Risks and opportunities', implemented: false, evidence: [] },
  { requirement: '6.2 Quality objectives', implemented: false, evidence: [] },
  { requirement: '7.1 Resources', implemented: false, evidence: [] },
  { requirement: '7.2 Competence', implemented: false, evidence: [] },
  { requirement: '7.3 Awareness', implemented: false, evidence: [] },
  { requirement: '7.4 Communication', implemented: false, evidence: [] },
  { requirement: '7.5 Documented information', implemented: false, evidence: [] },
  { requirement: '8.1 Operational planning', implemented: false, evidence: [] },
  { requirement: '8.2 Customer requirements', implemented: false, evidence: [] },
  { requirement: '8.3 Design and development', implemented: false, evidence: [] },
  { requirement: '8.4 External providers', implemented: false, evidence: [] },
  { requirement: '8.5 Production/service provision', implemented: false, evidence: [] },
  { requirement: '8.6 Release of products', implemented: false, evidence: [] },
  { requirement: '8.7 Nonconforming outputs', implemented: false, evidence: [] },
  { requirement: '9.1 Monitoring and measurement', implemented: false, evidence: [] },
  { requirement: '9.2 Internal audit', implemented: false, evidence: [] },
  { requirement: '9.3 Management review', implemented: false, evidence: [] },
  { requirement: '10.2 Nonconformity and CAPA', implemented: false, evidence: [] },
  { requirement: '10.3 Continual improvement', implemented: false, evidence: [] },
];

export default function ComplianceDashboardPage() {
  const scoreMutation = api.iso.compliance.score.useMutation();

  // Auto-load score on mount
  const { data, isLoading, error } = api.iso.compliance.check.useQuery({ standard: 'ISO9001' });

  const scoreData = data
    ? {
        totalRequirements: data.totalClauses,
        implementedRequirements: data.compliant,
        compliancePercentage: data.totalClauses > 0
          ? (data.compliant / data.totalClauses) * 100
          : 0,
        maturityLevel: computeMaturity(data.compliant, data.totalClauses),
        gaps: (data.openFindings > 0)
          ? data.findings.slice(0, 5).map((f: any) => f.clauseRef ?? f.title ?? 'Open finding')
          : ['No current findings — run compliance check to identify gaps'],
      }
    : null;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <h1 className="text-2xl font-bold">ISO Compliance Dashboard</h1>
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">ISO Compliance Dashboard</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load compliance data: {error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Compliance Dashboard</h1>
      <ComplianceDashboard
        standard="ISO 9001:2015"
        data={scoreData ?? {
          totalRequirements: 26,
          implementedRequirements: 0,
          compliancePercentage: 0,
          maturityLevel: { level: 0, label: 'Not Assessed' },
          gaps: ['Run a compliance check to see your gap analysis'],
        }}
      />
    </div>
  );
}

function computeMaturity(implemented: number, total: number) {
  if (total === 0) return { level: 0, label: 'Not Assessed' };
  const pct = (implemented / total) * 100;
  if (pct < 20) return { level: 0, label: 'Not Implemented' };
  if (pct < 40) return { level: 1, label: 'Initial' };
  if (pct < 60) return { level: 2, label: 'Managed' };
  if (pct < 80) return { level: 3, label: 'Defined' };
  if (pct < 95) return { level: 4, label: 'Quantitatively Managed' };
  return { level: 5, label: 'Optimized' };
}
