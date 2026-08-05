import React from 'react';
import { SopComplianceItem } from '@/types/sop';

interface SopComplianceItemListProps {
  items: SopComplianceItem[];
  title?: string;
}

const statusColorMap: Record<string, string> = {
  compliant: 'bg-green-100 text-green-800',
  non_compliant: 'bg-red-100 text-red-800',
  pending: 'bg-yellow-100 text-yellow-800',
  'not_applicable': 'bg-gray-100 text-gray-600',
};

export const SopComplianceItemList: React.FC<SopComplianceItemListProps> = ({
  items,
  title = 'Compliance Items',
}) => {
  if (!items || items.length === 0) {
    return (
      <div className="mt-2">
        <h5 className="font-medium text-sm text-gray-700">{title}</h5>
        <p className="text-sm text-gray-400 italic">No compliance data</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h5 className="font-medium text-sm text-gray-700">{title}</h5>
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm bg-white">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2 text-left">Requirement</th>
              <th className="px-3 py-2 text-left">Regulation</th>
              <th className="px-3 py-2 text-left">Control</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item, idx) => {
              const status = item.status?.toLowerCase() || 'unknown';
              const badgeColor = statusColorMap[status] || 'bg-gray-100 text-gray-600';
              return (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2 font-mono text-xs">
                    {item.requirement || '—'}
                  </td>
                  <td className="px-3 py-2">{item.regulation || '—'}</td>
                  <td className="px-3 py-2 font-mono text-xs">{item.control || '—'}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${badgeColor}`}
                    >
                      {item.status || 'N/A'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};