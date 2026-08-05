import React from 'react';
import { SopStatus, ApprovalStatus } from '@/types/sop';

interface StatusBadgeProps {
  status: SopStatus | ApprovalStatus;
}

const statusColorMap: Record<string, string> = {
  draft: 'bg-gray-200 text-gray-800',
  in_review: 'bg-yellow-200 text-yellow-800',
  approved: 'bg-green-200 text-green-800',
  rejected: 'bg-red-200 text-red-800',
  archived: 'bg-blue-200 text-blue-800',
  pending: 'bg-gray-300 text-gray-700',
  withdrawn: 'bg-purple-200 text-purple-800',
};

export const SopStatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const colorClass = statusColorMap[status] || 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
    >
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};