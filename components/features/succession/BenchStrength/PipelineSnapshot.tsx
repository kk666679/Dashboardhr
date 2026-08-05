"use client";

interface PipelineData {
  ready: number;
  developing: number;
  potential: number;
  gap: number;
  [key: string]: unknown;
}

interface PipelineSnapshotProps {
  data: PipelineData;
}

export function PipelineSnapshot({ data }: PipelineSnapshotProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="p-3 border rounded text-center">
        <p className="text-2xl font-bold text-green-600">{data.ready || 0}</p>
        <p className="text-xs text-muted-foreground">Ready Now</p>
      </div>
      <div className="p-3 border rounded text-center">
        <p className="text-2xl font-bold text-blue-600">{data.developing || 0}</p>
        <p className="text-xs text-muted-foreground">Developing</p>
      </div>
      <div className="p-3 border rounded text-center">
        <p className="text-2xl font-bold text-yellow-600">{data.potential || 0}</p>
        <p className="text-xs text-muted-foreground">Potential</p>
      </div>
      <div className="p-3 border rounded text-center">
        <p className="text-2xl font-bold text-red-600">{data.gap || 0}</p>
        <p className="text-xs text-muted-foreground">Gap</p>
      </div>
    </div>
  );
}

