'use client';

import { FiveWhys } from '@/components/features/compliance/iso/five-whys';

export default function FiveWhysPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">5 Whys Analysis</h1>
      <FiveWhys />
    </div>
  );
}