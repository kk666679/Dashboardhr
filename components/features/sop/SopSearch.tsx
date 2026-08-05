'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trpc } from '@/lib/trpc';
import { useDebounce } from '@/hooks/use-debounce';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROUTE } from '@dashboard-sidebar/route-mapping';
import { useTranslation } from '@/hooks/useTranslation';

const categories = ['POLICY', 'OPERATIONAL', 'COMPLIANCE', 'EMERGENCY'] as const;
const statuses = ['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'] as const;

export default function SopSearch() {
  const { currentLanguage } = useTranslation();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('ALL');
  const [status, setStatus] = useState<string>('ALL');
  const debouncedQuery = useDebounce(query.trim(), 300);

  const hasQuery = debouncedQuery.length > 0;
  const { data: results = [], isLoading } = trpc.sop.search.useQuery(
    {
      query: debouncedQuery,
      limit: 10,
      category: category === 'ALL' ? undefined : category as any,
      status: status === 'ALL' ? undefined : status as any,
    },
    { enabled: hasQuery },
  );

  return (
    <div className="space-y-4 p-6">
      <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search SOPs" />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            {statuses.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {!hasQuery ? <p className="text-sm text-muted-foreground">Start typing to search SOPs.</p> : null}
      {hasQuery && isLoading ? <p className="text-sm text-muted-foreground">Searching...</p> : null}
      {hasQuery && !isLoading && results.length === 0 ? (
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>No matching SOPs were found.</span>
          <Button asChild variant="outline" size="sm">
            <Link href={ROUTE.dashboard.withLocale(currentLanguage, ROUTE.dashboard.sops.new)}>Create SOP</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-3">
        {results.map((item: { id: string; title: string; code?: string; department?: string; category?: string; status?: string }) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4 text-sm">
              <span>{item.code} | {item.department} | {item.category} | {item.status}</span>
              <Button asChild variant="outline">
                <Link href={`/dashboard/sops/${item.id}`}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
