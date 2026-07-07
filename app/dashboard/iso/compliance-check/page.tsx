'use client';

import { ComplianceCheck } from '@/components/features/compliance/iso/compliance-check';

export default function ComplianceCheckPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Compliance Check</h1>
      <ComplianceCheck />
    </div>
  );
}