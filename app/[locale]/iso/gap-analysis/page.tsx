'use client';

import { useState } from 'react';
import { api } from '@/lib/trpc';
import { GapAnalysis } from '@/components/features/iso/gap-analysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type Standard = 'ISO9001' | 'ISO14001' | 'ISO45001' | 'ISO27001';

export default function GapAnalysisPage() {
  const [standard, setStandard] = useState<Standard>('ISO9001');
  const [current, setCurrent] = useState<number>(0);
  const [target, setTarget] = useState<number>(100);
  const [apiGap, setApiGap] = useState<any | null>(null);

  const gapMutation = api.iso.compliance.gapAnalysis.useMutation({
    onSuccess: (data) => setApiGap(data),
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Gap Analysis</h1>

      {/* API-backed gap score tool */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Score-Based Gap Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Standard</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={standard}
                onChange={e => setStandard(e.target.value as Standard)}
              >
                <option value="ISO9001">ISO 9001:2015</option>
                <option value="ISO14001">ISO 14001:2015</option>
                <option value="ISO45001">ISO 45001:2018</option>
                <option value="ISO27001">ISO 27001:2022</option>
              </select>
            </div>
            <div>
              <Label>Current Score (%)</Label>
              <Input
                type="number" min={0} max={100}
                value={current}
                onChange={e => setCurrent(Number(e.target.value))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Target Score (%)</Label>
              <Input
                type="number" min={0} max={100}
                value={target}
                onChange={e => setTarget(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          </div>

          <Button
            className="w-full"
            disabled={gapMutation.isPending}
            onClick={() => gapMutation.mutate({ standard, current, target })}
          >
            {gapMutation.isPending ? 'Calculating…' : 'Calculate Gap'}
          </Button>

          {apiGap && (
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <p className="font-medium">{standard}: Current {apiGap.currentScore}% → Target {apiGap.targetScore}% = Gap {apiGap.gap}%</p>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                {apiGap.recommendations.map((r: string, i: number) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed gap analysis UI (uses local state + visual breakdown) */}
      <GapAnalysis standard={standard as any} />
    </div>
  );
}
