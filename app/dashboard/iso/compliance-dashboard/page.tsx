'use client';

import { ComplianceDashboard } from '@/components/features/compliance/iso/compliance-dashboard';

const mockData = {
  totalRequirements: 100,
  implementedRequirements: 75,
  compliancePercentage: 75,
  maturityLevel: { level: 3, label: 'Defined' },
  gaps: ['Clause 7.1 - Resources', 'Clause 8.3 - Design and Development'],
};

export default function ComplianceDashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Compliance Dashboard</h1>
      <ComplianceDashboard standard="ISO 9001" data={mockData} />
    </div>
  );
}