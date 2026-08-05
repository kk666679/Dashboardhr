'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface AuditChecklistProps {
  standard: string;
  checklist: Array<{
    clause: string;
    questions: string[];
  }>;
}

export function AuditChecklist({ standard, checklist }: AuditChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{standard} Audit Checklist</CardTitle>
          <Badge>Internal Audit</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {checklist.map((item) => (
            <div key={item.clause} className="space-y-3">
              <div className="font-semibold text-sm bg-gray-100 p-2 rounded">
                Clause {item.clause}
              </div>
              <div className="space-y-2 pl-4">
                {item.questions.map((question, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Checkbox id={`${item.clause}-${idx}`} className="mt-1" />
                    <label
                      htmlFor={`${item.clause}-${idx}`}
                      className="text-sm cursor-pointer"
                    >
                      {question}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}