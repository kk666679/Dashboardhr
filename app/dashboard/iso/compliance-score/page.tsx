'use client';

import { ComplianceScore } from '@/components/features/compliance/iso/compliance-score';

export default function ComplianceScorePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Compliance Score</h1>
      <ComplianceScore />
    </div>
  );
}