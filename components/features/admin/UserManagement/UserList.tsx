import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
  lastActive: string;
}

interface UserListProps {
  users: User[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function UserList({ users, onDelete, onEdit }: UserListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Active</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{u.name}</span>
              </div>
            </TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>
              <Badge variant="secondary">{u.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={u.status === "Active" ? "success" : u.status === "Suspended" ? "destructive" : "secondary"}>
                {u.status}
              </Badge>
            </TableCell>
            <TableCell>{new Date(u.lastActive).toLocaleDateString()}</TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit?.(u.id)}>Edit</Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete?.(u.id)}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
