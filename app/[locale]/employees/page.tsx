"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus, Users, Search, Globe, Briefcase, MoreHorizontal,
  Eye, Edit, UserX, Download, Filter, ChevronLeft, ChevronRight,
  AlertTriangle, RefreshCw, UserCheck, FileText, Stethoscope,
  Plane, Building2, GraduationCap, TrendingUp, Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  nationality?: string;
  isForeign: boolean;
  hireDate?: string;
  createdAt?: string;
  status?: "active" | "inactive";
}

// ── Sub-module quick links ────────────────────────────────────────────────────

const MODULE_LINKS = [
  { href: "/employees/foreign-workers", label: "Foreign Workers", icon: Globe, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/20" },
  { href: "/employees/expatriates", label: "Expatriates", icon: Plane, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-950/20" },
  { href: "/employees/permits", label: "Permits & Visas", icon: FileText, color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-950/20" },
  { href: "/employees/onboarding", label: "Onboarding", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/20" },
  { href: "/employees/offboarding", label: "Offboarding", icon: UserX, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-950/20" },
  { href: "/employees/medical", label: "Medical / FOMEMA", icon: Stethoscope, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-950/20" },
];

// ── Loading skeleton ──────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

// ── Employee card (grid view) ─────────────────────────────────────────────────

function EmpCard({ emp, onTerminate }: { emp: EmployeeRow; onTerminate: (id: string) => void }) {
  const router = useRouter();
  return (
    <Card className="hover:shadow-md transition-shadow group">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{emp.name}</p>
            <p className="text-xs text-muted-foreground truncate">{emp.email}</p>
          </div>
          {emp.isForeign && (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 text-[10px] shrink-0">
              Foreign
            </Badge>
          )}
        </div>
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Briefcase className="h-3 w-3 shrink-0" />
            <span className="truncate">{emp.position || "—"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 shrink-0" />
            <span className="truncate">{emp.department || "—"}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 h-7 text-xs" onClick={() => router.push(`/employees/${emp.id}`)}>
            <Eye className="h-3 w-3 mr-1" /> View
          </Button>
          <Button size="sm" variant="ghost" className="flex-1 h-7 text-xs" onClick={() => router.push(`/employees/${emp.id}/edit`)}>
            <Edit className="h-3 w-3 mr-1" /> Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function EmployeesPage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const [terminateId, setTerminateId] = useState<string | null>(null);

  const { data: employees = [], isLoading, error, refetch } = trpc.employee.list.useQuery(
    undefined,
    { retry: 2, retryDelay: 1000 }
  );

  const deleteMutation = trpc.employee.delete.useMutation({
    onSuccess: () => {
      toast.success("Employee terminated successfully");
      utils.employee.list.invalidate();
      setTerminateId(null);
    },
    onError: (err) => toast.error(`Failed: ${err.message}`),
  });

  // Normalise rows
  const rows: EmployeeRow[] = useMemo(() =>
    (employees as any[]).map(e => ({
      id: e.id,
      name: e.name ?? "",
      email: e.email ?? "",
      phone: e.phone ?? undefined,
      position: e.position ?? "",
      department: e.department ?? "",
      nationality: e.nationality ?? "Unknown",
      isForeign: Boolean(e.isForeign),
      hireDate: e.hireDate ? String(e.hireDate).split("T")[0] : "",
      createdAt: e.createdAt ?? "",
      status: "active" as const,
    })),
    [employees]
  );

  const departments = useMemo(() =>
    Array.from(new Set(rows.map(r => r.department).filter(Boolean))).sort() as string[],
    [rows]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return rows.filter(r => {
      const matchSearch = !q ||
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.position ?? "").toLowerCase().includes(q) ||
        (r.department ?? "").toLowerCase().includes(q);
      const matchDept = deptFilter === "all" || r.department === deptFilter;
      const matchType = typeFilter === "all" ||
        (typeFilter === "foreign" && r.isForeign) ||
        (typeFilter === "local" && !r.isForeign);
      return matchSearch && matchDept && matchType;
    });
  }, [rows, search, deptFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange() { setPage(1); }

  function exportCSV() {
    const headers = ["Name", "Email", "Position", "Department", "Nationality", "Foreign", "Hire Date"];
    const csvRows = filtered.map(r => [r.name, r.email, r.position ?? "", r.department ?? "", r.nationality ?? "", r.isForeign ? "Yes" : "No", r.hireDate ?? ""]);
    const csv = [headers, ...csvRows].map(row => row.map(c => `"${c}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: `employees-${new Date().toISOString().split("T")[0]}.csv`,
    });
    a.click();
  }

  // ── Stats ──
  const foreignCount = rows.filter(r => r.isForeign).length;
  const deptCount = new Set(rows.map(r => r.department).filter(Boolean)).size;

  // ── Error state ──
  if (error) {
    return (
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Employees</h1>
        </div>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex items-center gap-4 py-6">
            <AlertTriangle className="h-8 w-8 text-destructive shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Failed to load employees</p>
              <p className="text-sm text-muted-foreground mt-0.5">{error.message}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
            </Button>
          </CardContent>
        </Card>
        {/* Still show module links even on error */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MODULE_LINKS.map(({ href, label, icon: Icon, color, bg }) => (
            <Link key={href} href={href}>
              <Card className={cn("hover:shadow-md transition-shadow cursor-pointer p-3 flex items-center gap-2.5 border-0", bg)}>
                <Icon className={cn("h-4 w-4 shrink-0", color)} />
                <span className="text-sm font-medium">{label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Employees</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your workforce · {rows.length} total employees
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Refresh
          </Button>
          <Button size="sm" asChild>
            <Link href="/employees/new">
              <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Employees", value: rows.length, icon: Users, color: "text-blue-600" },
          { label: "Foreign Workers", value: foreignCount, sub: rows.length ? `${((foreignCount / rows.length) * 100).toFixed(0)}% of workforce` : "—", icon: Globe, color: "text-indigo-600" },
          { label: "Departments", value: deptCount, icon: Building2, color: "text-violet-600" },
          { label: "Permit Renewals", value: 12, sub: "due within 30 days", icon: AlertTriangle, color: "text-amber-600" },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Icon className={cn("h-4 w-4", color)} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
            <div className={cn("text-2xl font-bold", color)}>{value}</div>
            {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
          </Card>
        ))}
      </div>

      {/* ── Module Quick Links ── */}
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Modules</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {MODULE_LINKS.map(({ href, label, icon: Icon, color, bg }) => (
            <Link key={href} href={href}>
              <div className={cn("rounded-lg p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity text-center border-0", bg)}>
                <Icon className={cn("h-5 w-5", color)} />
                <span className="text-xs font-medium leading-tight">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Employee Directory ── */}
      <Tabs defaultValue="table" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <TabsList className="h-9 shrink-0">
            <TabsTrigger value="table" className="text-xs">
              <Users className="h-3.5 w-3.5 mr-1.5" /> Table
            </TabsTrigger>
            <TabsTrigger value="cards" className="text-xs">
              Cards ({filtered.length})
            </TabsTrigger>
          </TabsList>

          {/* Search + Filters */}
          <div className="flex flex-1 gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search name, email, position…"
                value={search}
                onChange={e => { setSearch(e.target.value); handleFilterChange(); }}
                className="pl-8 h-9 text-sm"
              />
            </div>
            <Select value={deptFilter} onValueChange={v => { setDeptFilter(v); handleFilterChange(); }}>
              <SelectTrigger className="w-[140px] h-9 text-xs">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); handleFilterChange(); }}>
              <SelectTrigger className="w-[130px] h-9 text-xs">
                <Globe className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Workers</SelectItem>
                <SelectItem value="local">Local Only</SelectItem>
                <SelectItem value="foreign">Foreign Only</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="h-9" onClick={exportCSV}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Showing {paginated.length} of {filtered.length} employees
          {filtered.length !== rows.length && ` (${rows.length} total)`}
        </p>

        {/* ── Table View ── */}
        <TabsContent value="table" className="mt-0">
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">Employee</TableHead>
                  <TableHead className="text-xs">Position</TableHead>
                  <TableHead className="text-xs">Department</TableHead>
                  <TableHead className="text-xs">Nationality</TableHead>
                  <TableHead className="text-xs">Hire Date</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
                      {search || deptFilter !== "all" || typeFilter !== "all"
                        ? "No employees match your filters"
                        : "No employees found. Add your first employee to get started."}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map(emp => (
                    <TableRow key={emp.id} className="group hover:bg-muted/30">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-bold">
                              {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <Link href={`/employees/${emp.id}`} className="text-sm font-medium hover:underline truncate block">
                              {emp.name}
                            </Link>
                            <p className="text-xs text-muted-foreground truncate">{emp.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{emp.position || "—"}</TableCell>
                      <TableCell className="text-sm">{emp.department || "—"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {emp.isForeign && <Globe className="h-3 w-3 text-blue-500 shrink-0" />}
                          <span className="text-sm">{emp.nationality || "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{emp.hireDate || "—"}</TableCell>
                      <TableCell>
                        <Badge className={cn("text-[10px] border-0", emp.isForeign ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300")}>
                          {emp.isForeign ? "Foreign" : "Local"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/employees/${emp.id}`)}>
                              <Eye className="h-4 w-4 mr-2" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/employees/${emp.id}/edit`)}>
                              <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setTerminateId(emp.id)}>
                              <UserX className="h-4 w-4 mr-2" /> Terminate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ── Cards View ── */}
        <TabsContent value="cards" className="mt-0">
          {paginated.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground text-sm">
                No employees match your filters.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginated.map(emp => (
                <EmpCard key={emp.id} emp={emp} onTerminate={setTerminateId} />
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </Button>
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                  Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ── Quick Actions ── */}
      <div className="flex flex-wrap gap-2 pt-4 border-t">
        <Button variant="outline" size="sm" asChild>
          <Link href="/ai/employee"><Bot className="h-3.5 w-3.5 mr-1.5" /> AI Assistant</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/employees/onboarding"><UserCheck className="h-3.5 w-3.5 mr-1.5" /> Onboarding</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/employees/permits"><FileText className="h-3.5 w-3.5 mr-1.5" /> Permits</Link>
        </Button>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="h-3.5 w-3.5 mr-1.5" /> Export CSV
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/employees/offboarding"><UserX className="h-3.5 w-3.5 mr-1.5" /> Offboarding</Link>
        </Button>
      </div>

      {/* ── Terminate Dialog ── */}
      <AlertDialog open={!!terminateId} onOpenChange={open => !open && setTerminateId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate Employee</AlertDialogTitle>
            <AlertDialogDescription>
              This will archive the employee record for compliance purposes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={() => terminateId && deleteMutation.mutate({ id: terminateId })}
            >
              {deleteMutation.isPending ? "Terminating…" : "Terminate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
