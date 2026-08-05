'use client';

import { api } from '@/lib/trpc';
import { FiveWhys } from '@/components/features/iso/five-whys';

export default function FiveWhysPage() {
  const fiveWhysMutation = api.iso.capa.fiveWhys.useMutation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">5 Whys Root Cause Analysis</h1>
      <FiveWhys
        onAnalyze={async (problem) => {
          const result = await fiveWhysMutation.mutateAsync({ problem });
          return result.whys.map((w: string, i: number) => ({
            level: i + 1,
            question: w,
            answer: '',
          }));
        }}
        isAnalyzing={fiveWhysMutation.isPending}
        apiError={fiveWhysMutation.error?.message}
      />
    </div>
  );
}
