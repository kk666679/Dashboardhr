"use client";

import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface EmployeeCalendarProps {
  employeeId: string;
  assignments: { date: string; type: string }[];
}

export function EmployeeCalendar({ employeeId, assignments }: EmployeeCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Highlight dates with assignments
  const modifiers = {
    assigned: assignments.map(a => new Date(a.date)),
  };
  const modifiersStyles = {
    assigned: { backgroundColor: "#3b82f6", color: "white", borderRadius: "50%" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
        />
        <div className="mt-4">
          <h4 className="font-medium">Assignments</h4>
          <ul className="list-disc list-inside">
            {assignments.map((a, i) => (
              <li key={i}>
                {new Date(a.date).toLocaleDateString()} – <Badge variant="secondary">{a.type}</Badge>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
