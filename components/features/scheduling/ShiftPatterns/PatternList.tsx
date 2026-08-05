"use client";

interface ShiftPatternData {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration?: number;
  daysOfWeek?: number[];
  isFlexible?: boolean;
  isNightShift?: boolean;
  color?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface PatternListProps {
  patterns: ShiftPatternData[];
  onEdit?: (pattern: ShiftPatternData) => void;
  onDelete?: (id: string) => void;
}

export function PatternList({ patterns, onEdit, onDelete }: PatternListProps) {
  return (
    <div className="space-y-2">
      {patterns.map((pattern) => (
        <div key={pattern.id} className="flex items-center justify-between p-3 border rounded">
          <div>
            <p className="font-medium">{pattern.name}</p>
            <p className="text-sm text-muted-foreground">
              {pattern.startTime} - {pattern.endTime}
            </p>
          </div>
          <div className="flex gap-2">
            {onEdit && <button onClick={() => onEdit(pattern)}>Edit</button>}
            {onDelete && <button onClick={() => onDelete(pattern.id)}>Delete</button>}
          </div>
        </div>
      ))}
    </div>
  );
}

