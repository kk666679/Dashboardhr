"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TeamCalendarProps {
  teamId: string;
  assignments: { employee: string; date: string; shift: string }[];
}

export function TeamCalendar({ teamId, assignments }: TeamCalendarProps) {
  const [weekStart, setWeekStart] = useState(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  // Group assignments by employee
  const grouped = assignments.reduce((acc, a) => {
    if (!acc[a.employee]) acc[a.employee] = [];
    acc[a.employee].push(a);
    return acc;
  }, {} as Record<string, typeof assignments>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              {days.map(d => (
                <TableHead key={d.toISOString()}>{d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(grouped).map(([employee, employeeAssignments]) => (
              <TableRow key={employee}>
                <TableCell>{employee}</TableCell>
                {days.map(d => {
                  const dayAssign = employeeAssignments.find(a => new Date(a.date).toDateString() === d.toDateString());
                  return (
                    <TableCell key={d.toISOString()}>
                      {dayAssign ? (
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs">
                          {dayAssign.shift}
                        </span>
                      ) : "-"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
