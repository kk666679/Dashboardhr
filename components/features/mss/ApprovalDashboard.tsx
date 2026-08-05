import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ApprovalRequest {
  id: string;
  employee: string;
  type: "Leave" | "Timesheet" | "Expense" | "Other";
  date: string;
  details: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface ApprovalDashboardProps {
  requests: ApprovalRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function ApprovalDashboard({ requests, onApprove, onReject }: ApprovalDashboardProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");

  const pending = requests.filter(r => r.status === "Pending");
  const approved = requests.filter(r => r.status === "Approved");
  const rejected = requests.filter(r => r.status === "Rejected");

  const renderTable = (list: ApprovalRequest[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Employee</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((r) => (
          <TableRow key={r.id}>
            <TableCell>{r.employee}</TableCell>
            <TableCell>
              <Badge variant="secondary">{r.type}</Badge>
            </TableCell>
            <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
            <TableCell>{r.details}</TableCell>
            <TableCell>
              <Badge variant={r.status === "Approved" ? "success" : r.status === "Rejected" ? "destructive" : "warning"}>
                {r.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              {r.status === "Pending" && (
                <>
                  <Button size="sm" onClick={() => onApprove(r.id)}>Approve</Button>
                  <Button size="sm" variant="destructive" className="ml-2" onClick={() => onReject(r.id)}>Reject</Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Approvals</h2>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">{renderTable(pending)}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved">
          <Card>
            <CardContent className="p-0">{renderTable(approved)}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-0">{renderTable(rejected)}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
