"use client";

interface ReadinessData {
  id: string;
  assessmentDate?: string | Date;
  score?: number;
  level?: string;
  assessedBy?: string;
  notes?: string;
  [key: string]: unknown;
}

interface ReadinessHistoryProps {
  assessments: ReadinessData[];
}

export function ReadinessHistory({ assessments }: ReadinessHistoryProps) {
  return (
    <div className="space-y-2">
      {assessments.map((a) => (
        <div key={a.id} className="p-3 border rounded">
          <div className="flex justify-between">
            <span className="font-medium">{a.level || "Assessment"}</span>
            <span className="text-sm text-muted-foreground">
              {a.assessmentDate ? new Date(a.assessmentDate).toLocaleDateString() : "-"}
            </span>
          </div>
          {a.score && <p className="text-sm">Score: {a.score}</p>}
          {a.notes && <p className="text-sm text-muted-foreground">{a.notes}</p>}
        </div>
      ))}
    </div>
  );
}

