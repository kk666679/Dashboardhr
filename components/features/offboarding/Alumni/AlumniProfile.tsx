"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AlumniProfileData {
  id: string;
  employee: { name: string; email: string };
  status: string;
  alumniStatus?: string;
  lifecycle?: string | null;
  personalEmail?: string | null;
  linkedInUrl?: string | null;
  currentCompany?: string | null;
  [key: string]: unknown;
}

interface AlumniProfileProps {
  profile: AlumniProfileData;
}

export function AlumniProfile({ profile }: AlumniProfileProps) {
  const status = (profile as any).alumniStatus ?? profile.status;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alumni Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium">Employee</span>
            <p>{profile.employee.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Email</span>
            <p>{profile.employee.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium">Status</span>
            <Badge variant={status === "ACTIVE" ? "success" as "default" : "secondary"}>
              {status}
            </Badge>
          </div>
          <div>
            <span className="text-sm font-medium">Lifecycle</span>
            <p>{(profile as any).lifecycle ?? "-"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

