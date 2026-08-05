"use client";

interface SuccessorData {
  id: string;
  employee: { name: string; id: string };
  priority?: number;
  readiness?: string;
  notes?: string;
  [key: string]: unknown;
}

interface SuccessorAssignmentListProps {
  successors: SuccessorData[];
  onRemove?: (id: string) => void;
}

export function SuccessorAssignmentList({ successors, onRemove }: SuccessorAssignmentListProps) {
  return (
    <div className="space-y-2">
      {successors.map((s) => (
        <div key={s.id} className="flex items-center justify-between p-3 border rounded">
          <div>
            <p className="font-medium">{s.employee?.name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">
              Readiness: {s.readiness || "N/A"} | Priority: {s.priority ?? "-"}
            </p>
          </div>
          {onRemove && (
            <button onClick={() => onRemove(s.id)} className="text-sm text-destructive">
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

