"use client";

interface CriticalPositionData {
  id: string;
  title: string;
  department?: string;
  riskLevel?: string;
  incumbent?: { name: string } | null;
  status?: string;
  [key: string]: unknown;
}

interface PositionListProps {
  positions: CriticalPositionData[];
  onSelect?: (position: CriticalPositionData) => void;
}

export function PositionList({ positions, onSelect }: PositionListProps) {
  return (
    <div className="space-y-2">
      {positions.map((position) => (
        <div
          key={position.id}
          className="flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-accent"
          onClick={() => onSelect?.(position)}
        >
          <div>
            <p className="font-medium">{position.title}</p>
            <p className="text-sm text-muted-foreground">{position.department || "-"}</p>
          </div>
          <span className="text-sm">{position.riskLevel || position.status || "Active"}</span>
        </div>
      ))}
    </div>
  );
}

