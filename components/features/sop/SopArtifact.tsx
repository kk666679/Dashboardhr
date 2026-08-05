import React from 'react';
import { SopArtifact } from '@/types/sop';

interface SopArtifactListProps {
  artifacts: SopArtifact[];
  title?: string;
}

const formatDate = (date: Date) => date.toLocaleString();

export const SopArtifactList: React.FC<SopArtifactListProps> = ({
  artifacts,
  title = 'Artifacts',
}) => {
  if (artifacts.length === 0) {
    return (
      <div className="mt-2">
        <h5 className="font-medium text-sm text-gray-700">{title}</h5>
        <p className="text-sm text-gray-400 italic">No artifacts available</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      <h5 className="font-medium text-sm text-gray-700">{title}</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {artifacts.map((artifact, idx) => (
          <div
            key={idx}
            className="border rounded-md p-3 bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex justify-between items-start">
              <span className="font-semibold text-sm uppercase tracking-wide text-blue-700">
                {artifact.type}
              </span>
              <span className="text-xs text-gray-400">
                {formatDate(artifact.generatedAt)}
              </span>
            </div>
            <div className="mt-1 text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
              <pre className="whitespace-pre-wrap break-words">
                {JSON.stringify(artifact.payload, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};