'use client';

import { AuditGenerate } from '@/components/features/compliance/iso/audit-generate';

export default function AuditGeneratePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Generate ISO Audit</h1>
      <AuditGenerate />
    </div>
  );
}