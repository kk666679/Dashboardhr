"use client";
/**
 * Security Dashboard — Sprint 3
 * User management, role assignment, session revocation.
 * Requirements: 28.1–28.8
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Users, Key, LogOut } from "lucide-react";

const HCM_ROLES = [
  "Super_Admin", "Group_HR", "HR_Director", "HR_Manager", "HR_Executive",
  "Payroll_Manager", "Payroll_Executive", "Finance", "Recruiter", "Department_Head",
  "Manager", "Team_Lead", "Employee", "Contractor", "Auditor", "Compliance_Officer",
  "ADMIN", "HR",
];

export default function SecurityPage() {
  const [search, setSearch]     = useState("");
  const [editUserId, setEditUserId] = useState("");
  const [newRole, setNewRole]   = useState("");

  const { data: dashboard }            = trpc.security.getDashboard.useQuery({});
  const { data: users, refetch }       = trpc.security.listUsers.useQuery({ take: 100 });
  const updateRole    = trpc.security.updateRole.useMutation({ onSuccess: () => { refetch(); setEditUserId(""); } });
  const revokeSessions = trpc.security.revokeAllSessions.useMutation({ onSuccess: () => refetch() });

  const filtered = users?.filter((u: { email: string; role: string }) =>
    !search || u.email.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Security Management</h1>
          <p className="text-sm text-muted-foreground">Users · Roles · Sessions · MFA</p>
        </div>
      </div>

      {/* Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{dashboard.totalUsers}</div>
                <div className="text-xs text-muted-foreground">Total Users</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{dashboard.adminCount}</div>
                <div className="text-xs text-muted-foreground">Admins</div>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{dashboard.recentAuditEvents}</div>
                <div className="text-xs text-muted-foreground">Audit Events (7d)</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* MFA required roles */}
      {dashboard?.mfaEnabledRoles && (
        <Card>
          <CardHeader><CardTitle className="text-base">MFA-Required Roles</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {dashboard.mfaEnabledRoles.map((r: string) => (
              <Badge key={r} className="bg-blue-100 text-blue-800">{r}</Badge>
            ))}
          </CardContent>
        </Card>
      )}

      {/* User list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Search by email or role…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
          <div className="space-y-2">
            {!filtered?.length ? (
              <p className="text-sm text-muted-foreground text-center py-4">No users found</p>
            ) : filtered.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between border rounded p-2 flex-wrap gap-2">
                <div>
                  <div className="text-sm font-medium">{user.email}</div>
                  <div className="text-xs text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{user.role}</Badge>
                  {editUserId === user.id ? (
                    <div className="flex items-center gap-1">
                      <Select value={newRole} onValueChange={setNewRole}>
                        <SelectTrigger className="h-7 text-xs w-40"><SelectValue placeholder="Select role" /></SelectTrigger>
                        <SelectContent>{HCM_ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
                      </Select>
                      <Button size="sm" className="h-7 text-xs"
                        onClick={() => updateRole.mutate({ userId: user.id, role: newRole })}
                        disabled={!newRole || updateRole.isPending}>Save</Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditUserId("")}>✕</Button>
                    </div>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" className="h-7 text-xs"
                        onClick={() => { setEditUserId(user.id); setNewRole(user.role); }}>
                        Change Role
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-red-600"
                        onClick={() => revokeSessions.mutate({ userId: user.id })}
                        title="Revoke all sessions">
                        <LogOut className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
