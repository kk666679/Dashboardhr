import React from 'react';
import { SopApproval, ApprovalStatus } from '@/types/sop';
import { SopStatusBadge } from './SopStatusBadge';

interface SopApprovalListProps {
  approvals: SopApproval[];
  title?: string;
}

const formatDate = (date?: Date) => (date ? date.toLocaleString() : '—');

export const SopApprovalList: React.FC<SopApprovalListProps> = ({
  approvals,
  title = 'Approvals',
}) => {
  if (approvals.length === 0) {
    return (
      <div className="mt-2">
        <h5 className="font-medium text-sm text-gray-700">{title}</h5>
        <p className="text-sm text-gray-400 italic">No approvals recorded</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h5 className="font-medium text-sm text-gray-700">{title}</h5>
      <ul className="divide-y divide-gray-100 border rounded-md p-2 bg-white">
        {approvals.map((approval, idx) => (
          <li key={idx} className="py-2 first:pt-0 last:pb-0 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                {approval.approverRole}
              </span>
              <span className="text-xs text-gray-400">Order {approval.order}</span>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <SopStatusBadge status={approval.status} />
              {approval.decidedBy && (
                <span className="text-xs text-gray-500">
                  by {approval.decidedBy}
                </span>
              )}
              {approval.decidedAt && (
                <span className="text-xs text-gray-400">
                  {formatDate(approval.decidedAt)}
                </span>
              )}
              {approval.comment && (
                <span className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                  “{approval.comment}”
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};