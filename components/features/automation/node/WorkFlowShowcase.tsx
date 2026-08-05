"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { getLocaleFromPath, setLocaleInPath } from "@/lib/locale-utils";
import { WorkflowNode } from "./WorkflowNodes";

const sampleNodes = [
  { id: "1", type: "workflow", position: { x: 100, y: 100 }, data: { label: "Approval", description: "Manager review", status: "running" } },
  { id: "2", type: "workflow", position: { x: 300, y: 100 }, data: { label: "Task", description: "Complete form", assignee: "John" } },
];

export function WorkFlowShowcase() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(setLocaleInPath("/dashboard/automation/designer", getLocaleFromPath(pathname)))}>
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-medium">Approval Flow</h3>
              <p className="text-xs text-muted-foreground">Manager → HR → Finance</p>
            </div>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(setLocaleInPath("/dashboard/automation/designer", getLocaleFromPath(pathname)))}>
            <div className="text-center">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-medium">Onboarding</h3>
              <p className="text-xs text-muted-foreground">New employee process</p>
            </div>
          </Card>
          <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(setLocaleInPath("/dashboard/automation/designer", getLocaleFromPath(pathname)))}>
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-medium">Report Generation</h3>
              <p className="text-xs text-muted-foreground">Monthly reports</p>
            </div>
          </Card>
        </div>
        <Button variant="outline" className="w-full" onClick={() => router.push(setLocaleInPath("/dashboard/automation", getLocaleFromPath(pathname)))}>
          View All Workflows
        </Button>
      </CardContent>
    </Card>
  );
}
