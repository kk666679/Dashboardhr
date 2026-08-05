'use client';

import { api } from '@/lib/trpc';
import { ComplianceCheck } from '@/components/features/iso/compliance-check';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { ISOStandard } from '@/types/iso';

export default function ComplianceCheckPage() {
  const { data: liveData, isLoading, error } = api.iso.compliance.check.useQuery(
    { standard: 'ISO9001' },
    { refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <h1 className="text-2xl font-bold">ISO Compliance Check</h1>
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">ISO Compliance Check</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Compliance Check</h1>
      <ComplianceCheck
        standard={'ISO9001' as ISOStandard}
        liveFindings={liveData?.findings ?? []}
      />
    </div>
  );
}
