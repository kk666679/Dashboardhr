'use client';

import { GapAnalysis } from '@/components/features/compliance/iso/gap-analysis';

export default function GapAnalysisPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Gap Analysis</h1>
      <GapAnalysis />
    </div>
  );
}