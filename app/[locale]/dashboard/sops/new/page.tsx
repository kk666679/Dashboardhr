"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";

export default function CreateSOPPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create New SOP</h1>
          <p className="text-sm text-muted-foreground">
            Define a new Standard Operating Procedure
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">SOP Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">SOP Title</label>
              <Input placeholder="Enter SOP title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Input placeholder="e.g. HR, Payroll, Compliance" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea placeholder="Describe the purpose and scope of this SOP" rows={4} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Procedure Steps</label>
            <Textarea placeholder="List the step-by-step procedure (one step per line)" rows={6} />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.push("/dashboard/sops")}>
              Cancel
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save SOP
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

