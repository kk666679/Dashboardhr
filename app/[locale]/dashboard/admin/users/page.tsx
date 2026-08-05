"use client";

import { useState } from "react";
import { UserList, UserForm } from "@/components/features/admin/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const MOCK_USERS = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" as const, lastActive: "2024-01-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Manager", status: "Active" as const, lastActive: "2024-01-14" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", role: "Employee", status: "Inactive" as const, lastActive: "2024-01-10" },
];

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState(MOCK_USERS);

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast({ title: "User deleted" });
  };

  const handleEdit = (id: string) => {
    toast({ title: "Edit user", description: `Editing user ${id}...` });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage platform users and their roles</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Users</TabsTrigger>
          <TabsTrigger value="add">Add User</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>View and manage all registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <UserList users={users} onDelete={handleDelete} onEdit={handleEdit} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>New User</CardTitle>
              <CardDescription>Create a new platform user</CardDescription>
            </CardHeader>
            <CardContent>
              <UserForm onSuccess={() => toast({ title: "User created" })} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
