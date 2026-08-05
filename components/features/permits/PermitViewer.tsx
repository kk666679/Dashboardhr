import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PermitViewerProps {
  permit: {
    id: string;
    employeeId: string;
    type: string;
    number: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    notes?: string;
  };
}

export function PermitViewer({ permit }: PermitViewerProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">Permit #{permit.number}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{permit.type}</Badge>
            <Badge variant={permit.status === "Active" ? "success" : permit.status === "Pending" ? "warning" : "destructive"}>
              {permit.status}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permit Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium">Employee:</span>
            <span className="ml-2">{permit.employeeId}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Issue Date:</span>
            <span className="ml-2">{new Date(permit.issueDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="text-sm font-medium">Expiry Date:</span>
            <span className="ml-2">{new Date(permit.expiryDate).toLocaleDateString()}</span>
          </div>
          {permit.notes && (
            <div>
              <span className="text-sm font-medium">Notes:</span>
              <p className="mt-1 text-sm">{permit.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
