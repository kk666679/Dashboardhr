import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, Clock, FileText } from "lucide-react";

interface CaseViewerProps {
  caseData: {
    id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    employeeId: string;
    description: string;
    filedDate: string;
    closedDate?: string;
    resolution?: string;
    timeline?: { date: string; event: string }[];
  };
}

export function CaseViewer({ caseData }: CaseViewerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{caseData.type}</Badge>
            <Badge variant={caseData.priority === "Critical" ? "destructive" : caseData.priority === "High" ? "warning" : "secondary"}>
              {caseData.priority}
            </Badge>
            <Badge variant={caseData.status === "Resolved" || caseData.status === "Closed" ? "success" : caseData.status === "Pending" ? "warning" : "secondary"}>
              {caseData.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Print</Button>
          <Button variant="outline" size="sm">Export PDF</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Employee:</span>
              <span className="text-sm">{caseData.employeeId}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filed:</span>
              <span className="text-sm">{new Date(caseData.filedDate).toLocaleDateString()}</span>
            </div>
            {caseData.closedDate && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Closed:</span>
                <span className="text-sm">{new Date(caseData.closedDate).toLocaleDateString()}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{caseData.description}</p>
          </CardContent>
        </Card>
      </div>

      {caseData.resolution && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{caseData.resolution}</p>
          </CardContent>
        </Card>
      )}

      {caseData.timeline && caseData.timeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {caseData.timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-3 border-b pb-2 last:border-0">
                  <div className="text-xs text-muted-foreground min-w-[100px]">
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm">{item.event}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
