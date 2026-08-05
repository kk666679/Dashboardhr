'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc';
import { ComplianceScore } from '@/components/features/iso/compliance-score';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ISO9001_CLAUSES = [
  { id: '4.1', label: '4.1 Context of the organization' },
  { id: '4.2', label: '4.2 Interested parties' },
  { id: '4.3', label: '4.3 Scope of QMS' },
  { id: '4.4', label: '4.4 QMS processes' },
  { id: '5.1', label: '5.1 Leadership commitment' },
  { id: '5.2', label: '5.2 Quality policy' },
  { id: '5.3', label: '5.3 Roles and responsibilities' },
  { id: '6.1', label: '6.1 Risks and opportunities' },
  { id: '6.2', label: '6.2 Quality objectives' },
  { id: '7.1', label: '7.1 Resources' },
  { id: '7.2', label: '7.2 Competence' },
  { id: '7.3', label: '7.3 Awareness' },
  { id: '7.4', label: '7.4 Communication' },
  { id: '7.5', label: '7.5 Documented information' },
  { id: '8.1', label: '8.1 Operational planning' },
  { id: '8.2', label: '8.2 Customer requirements' },
  { id: '8.3', label: '8.3 Design and development' },
  { id: '8.4', label: '8.4 External providers' },
  { id: '8.5', label: '8.5 Production provision' },
  { id: '8.6', label: '8.6 Release of products' },
  { id: '8.7', label: '8.7 Nonconforming outputs' },
  { id: '9.1', label: '9.1 Monitoring & measurement' },
  { id: '9.2', label: '9.2 Internal audit' },
  { id: '9.3', label: '9.3 Management review' },
  { id: '10.2', label: '10.2 Nonconformity & CAPA' },
  { id: '10.3', label: '10.3 Continual improvement' },
];

export default function ComplianceScorePage() {
  const [implemented, setImplemented] = useState<Set<string>>(new Set());
  const [serverScore, setServerScore] = useState<any | null>(null);

  const scoreMutation = api.iso.compliance.score.useMutation({
    onSuccess: (data) => setServerScore(data),
  });

  const toggle = (id: string) =>
    setImplemented(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const runScore = () => {
    scoreMutation.mutate({
      standard: 'ISO9001',
      requirements: ISO9001_CLAUSES.map(c => ({
        requirement: c.label,
        implemented: implemented.has(c.id),
        evidence: [],
      })),
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Compliance Score</h1>

      {!serverScore ? (
        <Card>
          <CardHeader>
            <CardTitle>Mark implemented clauses (ISO 9001:2015)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ISO9001_CLAUSES.map(c => (
                <div key={c.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`c-${c.id}`}
                    checked={implemented.has(c.id)}
                    onCheckedChange={() => toggle(c.id)}
                  />
                  <label htmlFor={`c-${c.id}`} className="text-sm cursor-pointer">{c.label}</label>
                </div>
              ))}
            </div>

            <Button className="w-full" onClick={runScore} disabled={scoreMutation.isPending}>
              {scoreMutation.isPending ? 'Calculating…' : `Calculate Score (${implemented.size}/${ISO9001_CLAUSES.length} marked)`}
            </Button>

            {scoreMutation.isError && (
              <p className="text-sm text-destructive">{scoreMutation.error.message}</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <ComplianceScore
            standard="ISO9001"
            prefillScore={{
              overallScore:        serverScore.compliancePercentage,
              complianceRate:      serverScore.compliancePercentage,
              totalClauses:        serverScore.totalRequirements,
              compliantClauses:    serverScore.implementedRequirements,
              nonCompliantClauses: serverScore.totalRequirements - serverScore.implementedRequirements - 0,
              partialClauses:      0,
              grade:               gradeFromPct(serverScore.compliancePercentage),
            }}
          />
          <Button variant="outline" className="mt-4" onClick={() => setServerScore(null)}>
            ← Recalculate
          </Button>
        </>
      )}
    </div>
  );
}

function gradeFromPct(pct: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (pct >= 90) return 'A';
  if (pct >= 80) return 'B';
  if (pct >= 70) return 'C';
  if (pct >= 60) return 'D';
  return 'F';
}
