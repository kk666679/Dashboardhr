"use client";

import React, { useState } from 'react';
import { SopVersion, SopStatus, ApprovalStatus } from '@/types/sop';
import { SopVersionCard } from './SopVersionCard';

// ----- MOCK DATA (examples) -----
const mockApprovals = (versionId: string): any[] => [
  {
    versionId,
    approverRole: 'Quality Manager',
    order: 1,
    status: ApprovalStatus.APPROVED,
    decidedBy: 'alice@corp.com',
    decidedAt: new Date('2026-07-01T10:00:00'),
    comment: 'Looks good',
  },
  {
    versionId,
    approverRole: 'Regulatory Officer',
    order: 2,
    status: ApprovalStatus.PENDING,
  },
];

const mockArtifacts = (versionId: string): any[] => [
  {
    versionId,
    type: 'pdf',
    payload: { url: '/sops/sop-001-v1.pdf', pages: 12 },
    generatedAt: new Date('2026-07-02T08:30:00'),
  },
];

const mockAuditEvents = (versionId: string): any[] => [
  {
    versionId,
    actor: 'system',
    action: 'create',
    evidence: { source: 'import' },
    createdAt: new Date('2026-06-30T09:00:00'),
  },
  {
    versionId,
    actor: 'bob@corp.com',
    action: 'update_status',
    evidence: { from: 'draft', to: 'in_review' },
    createdAt: new Date('2026-07-01T08:00:00'),
  },
];

const mockCompliance = (versionId: string): any[] => [
  {
    versionId,
    requirement: 'ISO 13485:2016 4.2.3',
    regulation: 'FDA 21 CFR Part 11',
    control: 'DOC-001',
    status: 'compliant',
  },
];

// Generate 3 sample versions
const mockVersions: SopVersion[] = [
  {
    id: 'v1',
    sopId: 'SOP-001',
    version: '1.0',
    status: SopStatus.IN_REVIEW,
    content: { title: 'Sample SOP', sections: [{ heading: 'Purpose', text: '...' }] },
    scores: { overall: 85 },
    findings: [{ id: 'f1', severity: 'low', description: 'Minor wording' }],
    approvals: mockApprovals('v1'),
    artifacts: mockArtifacts('v1'),
    auditEvents: mockAuditEvents('v1'),
    complianceItems: mockCompliance('v1'),
  },
  {
    id: 'v2',
    sopId: 'SOP-001',
    version: '2.0',
    status: SopStatus.APPROVED,
    content: { title: 'Sample SOP v2', sections: [{ heading: 'Purpose', text: 'Updated' }] },
    scores: { overall: 92 },
    findings: [],
    approvals: mockApprovals('v2').map((a) => ({ ...a, status: ApprovalStatus.APPROVED })),
    artifacts: mockArtifacts('v2'),
    auditEvents: mockAuditEvents('v2'),
    complianceItems: mockCompliance('v2'),
  },
  {
    id: 'v3',
    sopId: 'SOP-002',
    version: '1.0',
    status: SopStatus.DRAFT,
    content: { title: 'New SOP', sections: [] },
    scores: {},
    findings: [],
    approvals: [],
    artifacts: [],
    auditEvents: [
      {
        versionId: 'v3',
        actor: 'charlie@corp.com',
        action: 'create',
        evidence: {},
        createdAt: new Date('2026-07-07T11:00:00'),
      },
    ],
    complianceItems: [],
  },
];

// ----- Dashboard Component -----
export const SopDashboard: React.FC = () => {
  const [versions] = useState<SopVersion[]>(mockVersions);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">SOP Management Dashboard</h1>
        <p className="text-gray-500">{versions.length} versions loaded</p>
      </header>

      <div className="space-y-4">
        {versions.map((version) => (
          <SopVersionCard key={version.id} version={version} />
        ))}
      </div>
    </div>
  );
};