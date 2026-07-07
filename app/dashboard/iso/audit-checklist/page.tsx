'use client';

import { AuditChecklist } from '@/components/features/compliance/iso/audit-checklist';

const mockChecklist = [
  {
    clause: '4.1',
    questions: [
      'Has the organization determined the boundaries and applicability of the management system?',
      'Has the organization established, implemented, maintained, and continually improved the management system?',
    ],
  },
  {
    clause: '4.2',
    questions: [
      'Has the organization determined interested parties and their requirements?',
      'Has the organization monitored and reviewed information about these interested parties?',
    ],
  },
];

export default function AuditChecklistPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ISO Audit Checklist</h1>
      <AuditChecklist standard="ISO 9001" checklist={mockChecklist} />
    </div>
  );
}