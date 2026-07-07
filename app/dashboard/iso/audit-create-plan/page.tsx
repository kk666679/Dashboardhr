'use client';

import { AuditCreatePlan } from '@/components/features/compliance/iso/audit-create-plan';

export default function AuditCreatePlanPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create ISO Audit Plan</h1>
      <AuditCreatePlan />
    </div>
  );
}