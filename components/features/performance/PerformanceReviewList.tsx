"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { setLocaleInPath, getLocaleFromPath } from "@/lib/locale-utils";

interface Review {
  id: string;
  employee: string;
  reviewer: string;
  date: string;
  rating: number;
  status: "Completed" | "In Progress" | "Draft";
}

interface PerformanceReviewListProps {
  reviews: Review[];
  onDelete?: (id: string) => void;
}

export function PerformanceReviewList({ reviews, onDelete }: PerformanceReviewListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = reviews.filter((r) => {
    const matchesSearch = r.employee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => router.push(setLocaleInPath("/dashboard/performance/new", getLocaleFromPath(pathname)))}>New Review</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.employee}</TableCell>
              <TableCell>{r.reviewer}</TableCell>
              <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
              <TableCell>{r.rating}</TableCell>
              <TableCell>
                <Badge variant={r.status === "Completed" ? "success" : r.status === "In Progress" ? "warning" : "secondary"}>
                  {r.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/performance/${r.id}`)}>
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={() => router.push(`/performance/${r.id}/edit`)}>
                  Edit
                </Button>
                {onDelete && (
                  <Button variant="destructive" size="sm" onClick={() => onDelete(r.id)}>
                    Delete
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
