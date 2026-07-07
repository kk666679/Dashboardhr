"use client";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, CheckCircle } from "lucide-react";

const DEMO_EMP = "demo-employee-id";

export default function EssTrainingPage() {
  const { data: courses } = trpc.lms.listCourses.useQuery({});
  const { data: progress } = trpc.lms.getProgress.useQuery({ employeeId: DEMO_EMP });
  const enrolMut = trpc.lms.enrolEmployee.useMutation();

  const enrolledIds = new Set(progress?.map(p => p.courseId));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-600" /> Training</h1>

      {/* My progress */}
      {(progress?.length ?? 0) > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">My Enrolments</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {progress?.map(p => (
              <div key={p.id} className="flex items-center justify-between border rounded-lg p-2.5">
                <div>
                  <div className="text-sm font-medium">{p.course?.title}</div>
                  <div className="text-xs text-muted-foreground">{p.course?.deliveryMode}</div>
                </div>
                {p.status === "COMPLETED"
                  ? <CheckCircle className="h-4 w-4 text-green-600" />
                  : <Badge variant="secondary" className="text-xs">{p.status}</Badge>}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Course catalogue */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Available Courses</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {!courses?.length && <p className="text-sm text-muted-foreground text-center py-4">No courses available</p>}
          {courses?.map(course => (
            <div key={course.id} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="text-sm font-medium">{course.title}</div>
                <div className="text-xs text-muted-foreground">
                  {course.deliveryMode} · {course.durationHours ? `${course.durationHours}h` : "Self-paced"}
                </div>
              </div>
              {enrolledIds.has(course.id) ? (
                <Button size="sm" variant="outline" className="text-green-700 border-green-200">
                  <Play className="h-3.5 w-3.5 mr-1" /> Resume
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => enrolMut.mutate({ courseId: course.id, employeeId: DEMO_EMP })}>
                  Enrol
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
