import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface IndustrialRelationsViewerProps {
  caseData: {
    id: string;
    title: string;
    type: string;
    status: string;
    priority: string;
    employeeId: string;
    description: string;
    resolution: string;
    filedDate: string;
    closedDate?: string;
  };
}

export function IndustrialRelationsViewer({ caseData }: IndustrialRelationsViewerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{caseData.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{caseData.type}</Badge>
            <Badge variant={caseData.status === "Resolved" || caseData.status === "Closed" ? "success" : "warning"}>
              {caseData.status}
            </Badge>
            <Badge variant={caseData.priority === "High" ? "destructive" : "secondary"}>
              {caseData.priority}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium">Employee:</span>
            <span className="ml-2">{caseData.employeeId}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Filed Date:</span>
            <span className="ml-2">{new Date(caseData.filedDate).toLocaleDateString()}</span>
          </div>
          {caseData.closedDate && (
            <div>
              <span className="text-sm font-medium">Closed Date:</span>
              <span className="ml-2">{new Date(caseData.closedDate).toLocaleDateString()}</span>
            </div>
          )}
          <div>
            <span className="text-sm font-medium">Description:</span>
            <p className="mt-1 text-sm whitespace-pre-wrap">{caseData.description}</p>
          </div>
          {caseData.resolution && (
            <div>
              <span className="text-sm font-medium">Resolution:</span>
              <p className="mt-1 text-sm whitespace-pre-wrap">{caseData.resolution}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
