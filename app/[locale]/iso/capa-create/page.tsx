'use client';

import { CAPACreate } from '@/components/features/iso/capa-create';
import { api } from '@/lib/trpc';

/**
 * The CAPACreate component manages its own local form state.
 * We provide it with an onSubmit prop that calls the real tRPC mutation
 * so every created CAPA is persisted to the DB with audit trail.
 */
export default function CAPACreatePage() {
  const createMutation = api.iso.capa.create.useMutation();
  const listQuery = api.iso.capa.list.useQuery({ take: 20 });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">CAPA Management</h1>
      <CAPACreate
        onPersist={async (capa) => {
          await createMutation.mutateAsync({
            title:          capa.title,
            description:    capa.description,
            type:           capa.type,
            source:         capa.source,
            rootCause:      capa.rootCause,
            proposedAction: capa.proposedAction,
            owner:          capa.owner,
            dueDate:        capa.dueDate,
            priority:       capa.priority,
          });
          listQuery.refetch();
        }}
        persistedCapas={listQuery.data ?? []}
        isPersisting={createMutation.isPending}
      />
    </div>
  );
}
