'use client';

import { api } from '@/lib/trpc';
import { Fishbone } from '@/components/features/iso/fishbone';

export default function FishbonePage() {
  const fishboneMutation = api.iso.capa.fishbone.useMutation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Fishbone (Ishikawa) Analysis</h1>
      <Fishbone
        onAnalyze={async (problem) => {
          const result = await fishboneMutation.mutateAsync({ problem });
          return result.categories as Record<string, string[]>;
        }}
        isAnalyzing={fishboneMutation.isPending}
        apiError={fishboneMutation.error?.message}
      />
    </div>
  );
}
