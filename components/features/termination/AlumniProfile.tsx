import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AlumniProfileProps {
  employee: {
    name: string;
    email: string;
    department: string;
  };
  alumniStatus: "Active" | "Inactive" | "Archived";
  lifecycle: string;
  onUpdateStatus?: (status: string) => void;
}

export function AlumniProfile({ employee, alumniStatus, lifecycle, onUpdateStatus }: AlumniProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Alumni Profile</CardTitle>
          <Badge variant={alumniStatus === "Active" ? "success" : alumniStatus === "Archived" ? "secondary" : "warning"}>
            {alumniStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium">Name</span>
            <p>{employee.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Email</span>
            <p>{employee.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Department</span>
            <p>{employee.department}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Lifecycle</span>
            <p>{lifecycle}</p>
          </div>
        </div>
        {onUpdateStatus && (
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm" onClick={() => onUpdateStatus("Active")}>Set Active</Button>
            <Button variant="outline" size="sm" onClick={() => onUpdateStatus("Inactive")}>Set Inactive</Button>
            <Button variant="outline" size="sm" onClick={() => onUpdateStatus("Archived")}>Archive</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
