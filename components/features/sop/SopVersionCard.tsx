"use client";

import React, { useState } from 'react';
import { SopVersion, SopApproval, SopArtifact, SopAuditEvent, SopComplianceItem } from '@/types/sop';
import { SopStatusBadge } from './SopStatusBadge';

interface SopVersionCardProps {
  version: SopVersion;
}

const formatDate = (date: Date) => date.toLocaleString();

const ApprovalList: React.FC<{ approvals: SopApproval[] }> = ({ approvals }) => (
  <div className="mt-2">
    <h5 className="font-medium text-sm text-gray-700">Approvals</h5>
    {approvals.length === 0 ? (
      <p className="text-sm text-gray-400">No approvals</p>
    ) : (
      <ul className="divide-y divide-gray-100 border rounded-md p-2">
        {approvals.map((a, idx) => (
          <li key={idx} className="py-1 text-sm flex justify-between">
            <span>
              <span className="font-mono">{a.approverRole}</span> (order {a.order})
            </span>
            <span className="flex items-center gap-2">
              <SopStatusBadge status={a.status} />
              {a.decidedBy && <span className="text-gray-500">by {a.decidedBy}</span>}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const ArtifactList: React.FC<{ artifacts: SopArtifact[] }> = ({ artifacts }) => (
  <div className="mt-2">
    <h5 className="font-medium text-sm text-gray-700">Artifacts</h5>
    {artifacts.length === 0 ? (
      <p className="text-sm text-gray-400">No artifacts</p>
    ) : (
      <ul className="grid grid-cols-2 gap-2">
        {artifacts.map((a, idx) => (
          <li key={idx} className="border rounded p-2 text-sm">
            <span className="font-semibold">{a.type}</span>
            <span className="text-gray-500 ml-2">({formatDate(a.generatedAt)})</span>
            <pre className="text-xs bg-gray-50 p-1 mt-1 overflow-x-auto">
              {JSON.stringify(a.payload, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AuditEventList: React.FC<{ events: SopAuditEvent[] }> = ({ events }) => (
  <div className="mt-2">
    <h5 className="font-medium text-sm text-gray-700">Audit Trail</h5>
    {events.length === 0 ? (
      <p className="text-sm text-gray-400">No events</p>
    ) : (
      <ul className="space-y-1 max-h-40 overflow-y-auto border rounded p-2">
        {events.map((e, idx) => (
          <li key={idx} className="text-sm border-b border-gray-50 pb-1">
            <span className="font-mono">{e.actor}</span> <span className="text-gray-500">→</span>{' '}
            <span className="font-medium">{e.action}</span>
            <span className="text-gray-400 ml-2">({formatDate(e.createdAt)})</span>
            {e.evidence && (
              <pre className="text-xs bg-gray-50 p-1 mt-1">
                {JSON.stringify(e.evidence)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const ComplianceList: React.FC<{ items?: SopComplianceItem[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-2">
      <h5 className="font-medium text-sm text-gray-700">Compliance</h5>
      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-1 text-left">Requirement</th>
            <th className="p-1 text-left">Regulation</th>
            <th className="p-1 text-left">Control</th>
            <th className="p-1 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((c, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-1">{c.requirement || '-'}</td>
              <td className="p-1">{c.regulation || '-'}</td>
              <td className="p-1">{c.control || '-'}</td>
              <td className="p-1">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                  {c.status || 'N/A'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SopVersionCard: React.FC<SopVersionCardProps> = ({ version }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg shadow-sm p-4 mb-4 bg-white">
      {/* Header */}
      <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div>
          <h3 className="text-lg font-bold">
            {version.sopId} <span className="font-normal text-gray-500">v{version.version}</span>
          </h3>
          <div className="flex gap-2 items-center mt-1">
            <SopStatusBadge status={version.status} />
            <span className="text-xs text-gray-400">ID: {version.id}</span>
          </div>
        </div>
        <button className="text-sm text-blue-600 hover:underline focus:outline-none">
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Collapsible details */}
      {expanded && (
        <div className="mt-3 border-t pt-3 space-y-3">
          {/* Content preview */}
          <div>
            <h4 className="font-medium text-sm text-gray-700">Content (preview)</h4>
            <pre className="text-xs bg-gray-50 p-2 rounded max-h-40 overflow-y-auto">
              {JSON.stringify(version.content, null, 2)}
            </pre>
          </div>

          {/* Scores & Findings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-700">Scores</h4>
              <pre className="text-xs bg-gray-50 p-2 rounded">
                {version.scores ? JSON.stringify(version.scores, null, 2) : '–'}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-700">Findings</h4>
              <pre className="text-xs bg-gray-50 p-2 rounded">
                {version.findings ? JSON.stringify(version.findings, null, 2) : '–'}
              </pre>
            </div>
          </div>

          {/* Sub-lists */}
          <ApprovalList approvals={version.approvals} />
          <ArtifactList artifacts={version.artifacts} />
          <AuditEventList events={version.auditEvents} />
          <ComplianceList items={version.complianceItems} />
        </div>
      )}
    </div>
  );
};