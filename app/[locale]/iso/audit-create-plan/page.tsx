'use client';

import { api } from '@/lib/trpc';
import { AuditCreatePlan } from '@/components/features/iso/audit-create-plan';

export default function AuditCreatePlanPage() {
  const createMutation = api.iso.audit.createPlan.useMutation();
  const listQuery      = api.iso.audit.list.useQuery({ take: 20 });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Audit Plan</h1>
      <AuditCreatePlan
        onPersist={async (plan) => {
          await createMutation.mutateAsync({
            standard: (plan.standard ?? 'ISO9001') as any,
            scope:    plan.scope ?? 'Full QMS',
            duration: plan.startDate && plan.endDate
              ? Math.max(1, Math.ceil((plan.endDate.getTime() - plan.startDate.getTime()) / (24 * 60 * 60 * 1000)))
              : 3,
          });
          listQuery.refetch();
        }}
        isPersisting={createMutation.isPending}
        persistError={createMutation.error?.message}
      />
    </div>
  );
}
