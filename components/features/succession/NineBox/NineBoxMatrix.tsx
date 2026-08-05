"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NineBoxMatrixProps {
  assessments: { id: string; employee: string; performance: number; potential: number; readiness: number }[];
  onDrop?: (employeeId: string, x: number, y: number) => void;
}

export function NineBoxMatrix({ assessments, onDrop }: NineBoxMatrixProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // 3x3 grid coordinates: performance (x) 1-3, potential (y) 1-3
  const getBox = (perf: number, pot: number) => {
    const x = perf >= 4 ? 2 : perf >= 3 ? 1 : 0;
    const y = pot >= 4 ? 2 : pot >= 3 ? 1 : 0;
    return { x, y };
  };

  const boxes = [
    { label: "Low Performer", x: 0, y: 0 },
    { label: "Moderate Performer", x: 1, y: 0 },
    { label: "High Performer", x: 2, y: 0 },
    { label: "Enigma", x: 0, y: 1 },
    { label: "Core Player", x: 1, y: 1 },
    { label: "Future Star", x: 2, y: 1 },
    { label: "Underutilized", x: 0, y: 2 },
    { label: "Solid Contributor", x: 1, y: 2 },
    { label: "High Potential", x: 2, y: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nine Box Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {boxes.map((box) => {
            const employees = assessments.filter(
              (a) => getBox(a.performance, a.potential).x === box.x && getBox(a.performance, a.potential).y === box.y
            );
            return (
              <div
                key={box.label}
                className="border p-2 rounded min-h-[100px] bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                onClick={() => onDrop?.(selected || "", box.x, box.y)}
              >
                <div className="text-sm font-medium">{box.label}</div>
                <div className="mt-1 space-y-1">
                  {employees.map((e) => (
                    <div
                      key={e.id}
                      className={`text-xs p-1 rounded ${selected === e.id ? 'bg-blue-200' : 'bg-background'} cursor-pointer hover:bg-blue-100`}
                      onClick={() => setSelected(e.id)}
                    >
                      {e.employee}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
