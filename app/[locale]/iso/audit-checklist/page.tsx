'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc';
import { AuditChecklist } from '@/components/features/iso/audit-checklist';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ALL_CLAUSES = ['4', '5', '6', '7', '8', '9', '10'];

type Standard = 'ISO9001' | 'ISO14001' | 'ISO45001';

export default function AuditChecklistPage() {
  const [standard, setStandard] = useState<Standard>('ISO9001');
  const [selectedClauses, setSelectedClauses] = useState<string[]>(['4', '5', '9', '10']);
  const [generated, setGenerated] = useState<any[] | null>(null);

  const generateMutation = api.iso.audit.generate.useMutation({
    onSuccess: (data) => setGenerated(data.checklist),
  });

  const toggle = (clause: string) =>
    setSelectedClauses(prev =>
      prev.includes(clause) ? prev.filter(c => c !== clause) : [...prev, clause]
    );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Audit Checklist</h1>

      {!generated ? (
        <Card>
          <CardHeader>
            <CardTitle>Configure Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Standard</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={standard}
                onChange={e => setStandard(e.target.value as Standard)}
              >
                <option value="ISO9001">ISO 9001:2015 — Quality Management</option>
                <option value="ISO14001">ISO 14001:2015 — Environmental Management</option>
                <option value="ISO45001">ISO 45001:2018 — Occupational Health & Safety</option>
              </select>
            </div>

            <div>
              <Label>Clauses to include</Label>
              <div className="flex flex-wrap gap-4 mt-2">
                {ALL_CLAUSES.map(c => (
                  <div key={c} className="flex items-center gap-2">
                    <Checkbox
                      id={`clause-${c}`}
                      checked={selectedClauses.includes(c)}
                      onCheckedChange={() => toggle(c)}
                    />
                    <label htmlFor={`clause-${c}`} className="text-sm cursor-pointer">
                      Clause {c}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              disabled={selectedClauses.length === 0 || generateMutation.isPending}
              onClick={() => generateMutation.mutate({ standard, clauses: selectedClauses })}
            >
              {generateMutation.isPending ? 'Generating…' : 'Generate Checklist'}
            </Button>

            {generateMutation.isError && (
              <p className="text-sm text-destructive">{generateMutation.error.message}</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <AuditChecklist standard={standard} checklist={generated} />
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setGenerated(null)}
          >
            ← Back to configuration
          </Button>
        </>
      )}
    </div>
  );
}
