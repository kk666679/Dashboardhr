'use client';

import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import SopMetricsChart from '@/components/features/sop/SopMetricsChart';
import { ROUTE } from '@dashboard-sidebar/route-mapping';
import { useTranslation } from '@/hooks/useTranslation';

export default function SopList() {
  const { currentLanguage } = useTranslation();
  const [query, setQuery] = useState('');
  const { data, isLoading } = trpc.sop.list.useQuery({ limit: 20, query });
  const sops = data?.items ?? [];

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">SOPs</h1>
          <p className="text-sm text-muted-foreground">Browse generated SOPs and open a draft for review.</p>
        </div>
        <Button asChild>
          <Link href={ROUTE.dashboard.withLocale(currentLanguage, '/automation/sops/new')}>Create SOP</Link>
        </Button>
      </div>

      <Input
        placeholder="Search SOPs"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <SopMetricsChart />

      <div className="grid gap-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading SOPs…</p> : null}
        {!isLoading && sops.length === 0 ? <p className="text-sm text-muted-foreground">No SOPs found yet.</p> : null}
        {sops.map((sop: { id: string; title: string; status?: string; code?: string; department?: string; category?: string }) => (
          <Card key={sop.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span>{sop.title}</span>
                <span className="text-sm font-normal text-muted-foreground">{sop.status}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span>Code: {sop.code}</span>
                <span>Department: {sop.department}</span>
                <span>Category: {sop.category}</span>
              </div>
              <Button variant="outline" className="w-fit" asChild>
                <Link href={`/automation/sops/${sop.id}`}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

