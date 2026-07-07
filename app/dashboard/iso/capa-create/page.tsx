'use client';

import { CAPACreate } from '@/components/features/compliance/iso/capa-create';

export default function CAPACreatePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create CAPA</h1>
      <CAPACreate />
    </div>
  );
}