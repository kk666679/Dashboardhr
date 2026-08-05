'use client';

import { api } from '@/lib/trpc';
import { AuditGenerate } from '@/components/features/iso/audit-generate';
import type { ISOStandard } from '@/types/iso';

export default function AuditGeneratePage() {
  const generateMutation = api.iso.audit.generate.useMutation();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Generate Audit Checklist</h1>
      <AuditGenerate
        onGenerate={async (standard: ISOStandard, clauses: string[]) => {
          const result = await generateMutation.mutateAsync({ standard, clauses });
          return result.checklist;
        }}
        isGenerating={generateMutation.isPending}
        apiError={generateMutation.error?.message}
      />
    </div>
  );
}
