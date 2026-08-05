"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  UserX,
  Globe,
  Briefcase,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { EmployeeRow as EmployeeRowType } from "@/types";

// Re-export the type for backwards compatibility
export type EmployeeRow = EmployeeRowType & {
  nationality?: string;
  status?: "active" | "inactive";
};

interface EmployeeCardProps {
  employee: EmployeeRow;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function EmployeeCard({ employee, onView, onEdit }: EmployeeCardProps) {
  const router = useRouter();

  const handleView = () => {
    if (onView) {
      onView(employee.id);
    } else {
      router.push(`/dashboard/employees/${employee.id}`);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(employee.id);
    } else {
      router.push(`/dashboard/employees/${employee.id}/edit`);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">{employee.name}</CardTitle>
            <p className="text-xs text-muted-foreground truncate">
              {employee.email}
            </p>
          </div>
          {employee.isForeign && (
            <Tooltip>
              <TooltipTrigger>
                <Globe className="h-4 w-4 text-blue-500 shrink-0" />
              </TooltipTrigger>
              <TooltipContent>Foreign worker</TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Briefcase className="h-3 w-3" />
          <span className="truncate">
            {employee.position || "No position"} · {employee.department || "No department"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {employee.nationality || "Unknown"}
          </Badge>
          <Badge
            variant={employee.status === "active" ? "default" : "secondary"}
            className="text-xs"
          >
            {employee.status ?? "active"}
          </Badge>
        </div>
        <Separator />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-7 text-xs"
            onClick={handleView}
          >
            <Eye className="h-3 w-3 mr-1" /> View
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex-1 h-7 text-xs"
            onClick={handleEdit}
          >
            <Edit className="h-3 w-3 mr-1" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface EmployeeTableProps {
  employees: EmployeeRow[];
  loading?: boolean;
  onView?: (id: string) => void | string;
  onEdit?: (id: string) => void | string;
  onTerminate?: (id: string) => void;
  showFilters?: boolean;
  pageSize?: number;
}

export function EmployeeTable({
  employees,
  loading,
  onView,
  onEdit,
  onTerminate,
  showFilters = true,
  pageSize = 10,
}: EmployeeTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [foreignFilter, setForeignFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique departments for filter
  const departments = useMemo(() => {
    const depts = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(depts).sort();
  }, [employees]);

  // Filter employees
  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        (e.position?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        (e.department?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
        e.email.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        departmentFilter === "all" || e.department === departmentFilter;

      const matchesForeign =
        foreignFilter === "all" ||
        (foreignFilter === "foreign" && e.isForeign) ||
        (foreignFilter === "local" && !e.isForeign);

      return matchesSearch && matchesDepartment && matchesForeign;
    });
  }, [employees, search, departmentFilter, foreignFilter]);

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleView = (id: string) => {
    if (onView) {
      const result = onView(id);
      if (typeof result === "string") {
        router.push(result);
      }
    } else {
      router.push(`/dashboard/employees/${id}`);
    }
  };

  const handleEdit = (id: string) => {
    if (onEdit) {
      const result = onEdit(id);
      if (typeof result === "string") {
        router.push(result);
      }
    } else {
      router.push(`/dashboard/employees/${id}/edit`);
    }
  };

  const handleTerminate = (id: string) => {
    if (onTerminate) {
      onTerminate(id);
    }
  };

  const handleExport = () => {
    // Export filtered employees as CSV
    const headers = ["Name", "Email", "Position", "Department", "Nationality", "Foreign Worker", "Status", "Hire Date"];
    const rows = filtered.map((e) => [
      e.name,
      e.email,
      e.position || "",
      e.department || "",
      e.nationality || "",
      e.isForeign ? "Yes" : "No",
      e.status || "active",
      e.hireDate || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `employees-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, position, or department..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            className="pl-8"
          />
        </div>

        {showFilters && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={departmentFilter}
              onValueChange={(v) => {
                setDepartmentFilter(v);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[140px]">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept!}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={foreignFilter}
              onValueChange={(v) => {
                setForeignFilter(v);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[130px]">
                <Globe className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Worker Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workers</SelectItem>
                <SelectItem value="local">Local Only</SelectItem>
                <SelectItem value="foreign">Foreign Only</SelectItem>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export to CSV</TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {paginatedEmployees.length} of {filtered.length} employees
          {filtered.length !== employees.length && ` (${employees.length} total)`}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.map((emp) => (
                <TableRow key={emp.id} className="group">
                  <TableCell>
                    <Link
                      href={`/dashboard/employees/${emp.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                          {emp.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{emp.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {emp.email}
                        </div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{emp.position || "—"}</TableCell>
                  <TableCell className="text-sm">{emp.department || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {emp.isForeign && (
                        <Tooltip>
                          <TooltipTrigger>
                            <Globe className="h-3 w-3 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>Foreign Worker</TooltipContent>
                        </Tooltip>
                      )}
                      <span className="text-sm">{emp.nationality || "—"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.status === "active" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {emp.status ?? "active"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(emp.id)}>
                          <Eye className="h-4 w-4 mr-2" /> View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(emp.id)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleTerminate(emp.id)}
                        >
                          <UserX className="h-4 w-4 mr-2" /> Terminate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedEmployees.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    {search || departmentFilter !== "all" || foreignFilter !== "all"
                      ? "No employees match your filters"
                      : "No employees found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
