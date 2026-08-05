import React from 'react';
import { SopAuditEvent } from '@/types/sop';

interface SopAuditEventListProps {
  events: SopAuditEvent[];
  title?: string;
  maxHeight?: string;
}

const formatDate = (date: Date) => date.toLocaleString();

export const SopAuditEventList: React.FC<SopAuditEventListProps> = ({
  events,
  title = 'Audit Trail',
  maxHeight = 'max-h-48',
}) => {
  if (events.length === 0) {
    return (
      <div className="mt-2">
        <h5 className="font-medium text-sm text-gray-700">{title}</h5>
        <p className="text-sm text-gray-400 italic">No audit events</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h5 className="font-medium text-sm text-gray-700">{title}</h5>
      <ul
        className={`border rounded-md p-2 bg-white overflow-y-auto ${maxHeight} divide-y divide-gray-100`}
      >
        {events.map((event, idx) => (
          <li key={idx} className="py-2 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">
                {event.actor}
              </span>
              <span className="text-sm font-medium text-gray-700">
                {event.action}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(event.createdAt)}
              </span>
            </div>
            {event.evidence && (
              <details className="mt-1">
                <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                  Show evidence
                </summary>
                <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto border">
                  {JSON.stringify(event.evidence, null, 2)}
                </pre>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};