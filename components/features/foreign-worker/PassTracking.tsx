import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PassStatus {
  worker: string;
  passType: string;
  status: "Active" | "Pending" | "Expired";
  daysRemaining: number;
}

interface PassTrackingProps {
  passes: PassStatus[];
}

export function PassTracking({ passes }: PassTrackingProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Worker</TableHead>
          <TableHead>Pass Type</TableHead>
          <TableHead>Days Remaining</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {passes.map((p, i) => {
          const progress = Math.min((p.daysRemaining / 365) * 100, 100);
          return (
            <TableRow key={i}>
              <TableCell>{p.worker}</TableCell>
              <TableCell>{p.passType}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-24" />
                  <span className="text-sm">{p.daysRemaining} days</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={p.status === "Active" ? "success" : p.status === "Pending" ? "warning" : "destructive"}>
                  {p.status}
                </Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
