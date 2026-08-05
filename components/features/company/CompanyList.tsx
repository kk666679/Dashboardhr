"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Company {
  id: string;
  name: string;
  registrationNumber: string;
  industry: string;
  size: string;
  status: "Active" | "Inactive" | "Pending";
  employees: number;
}

interface CompanyListProps {
  companies: Company[];
  onDelete?: (id: string) => void;
}

export function CompanyList({ companies, onDelete }: CompanyListProps) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Registration</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Employees</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((c) => (
          <TableRow key={c.id}>
            <TableCell>{c.name}</TableCell>
            <TableCell className="font-mono text-xs">{c.registrationNumber}</TableCell>
            <TableCell>{c.industry}</TableCell>
            <TableCell>{c.size}</TableCell>
            <TableCell>{c.employees}</TableCell>
            <TableCell>
              <Badge variant={c.status === "Active" ? "success" : c.status === "Pending" ? "warning" : "secondary"}>
                {c.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/company/${c.id}`)}>View</Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/company/${c.id}/edit`)}>Edit</Button>
              {onDelete && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(c.id)}>Delete</Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
