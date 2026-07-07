'use client';

import { Fishbone } from '@/components/features/compliance/iso/fishbone';

export default function FishbonePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Fishbone Analysis</h1>
      <Fishbone />
    </div>
  );
}