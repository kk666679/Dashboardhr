import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface CourseViewerProps {
  course: {
    id: string;
    title: string;
    description: string;
    category: string;
    duration: string;
    status: string;
    instructor?: string;
    maxParticipants?: number;
    enrolled?: number;
    progress?: number;
  };
}

export function CourseViewer({ course }: CourseViewerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{course.category}</Badge>
            <Badge variant={course.status === "Published" ? "success" : "warning"}>
              {course.status}
            </Badge>
            {course.instructor && <Badge variant="outline">{course.instructor}</Badge>}
          </div>
        </div>
        <Button>Enroll</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium">Duration:</span>
            <span className="ml-2">{course.duration}</span>
          </div>
          {course.maxParticipants && (
            <div>
              <span className="text-sm font-medium">Max Participants:</span>
              <span className="ml-2">{course.maxParticipants}</span>
            </div>
          )}
          {course.enrolled !== undefined && (
            <div>
              <span className="text-sm font-medium">Enrolled:</span>
              <span className="ml-2">{course.enrolled}</span>
            </div>
          )}
          {course.progress !== undefined && (
            <div>
              <span className="text-sm font-medium">Your Progress:</span>
              <div className="flex items-center gap-2 mt-1">
                <Progress value={course.progress} className="w-48" />
                <span className="text-sm">{course.progress}%</span>
              </div>
            </div>
          )}
          <div>
            <span className="text-sm font-medium">Description:</span>
            <p className="mt-1 text-sm">{course.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
