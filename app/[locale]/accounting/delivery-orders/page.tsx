"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search, Plus, Filter, Download, Eye, Edit, MoreHorizontal,
  Truck, Package, Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { trpc } from "@/lib/trpc";
import type { DeliveryOrder } from "@/types/accounting";

const STATUS_CONFIG: Record<string, { label: string; variant: "secondary" | "outline" | "default" | "destructive" }> = {
  draft:     { label: "Draft",     variant: "secondary" },
  pending:   { label: "Pending",   variant: "outline" },
  confirmed: { label: "Confirmed", variant: "default" },
  completed: { label: "Completed", variant: "default" },
};

const DELIVERY_CONFIG: Record<string, { label: string; variant: "secondary" | "outline" | "default" | "destructive"; icon: React.ElementType }> = {
  pending:    { label: "Pending",    variant: "secondary", icon: Clock },
  scheduled:  { label: "Scheduled",  variant: "outline",   icon: Package },
  in_transit: { label: "In Transit", variant: "default",   icon: Truck },
  delivered:  { label: "Delivered",  variant: "default",   icon: CheckCircle },
  failed:     { label: "Failed",     variant: "destructive", icon: AlertCircle },
};

export default function DeliveryOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryFilter, setDeliveryFilter] = useState("all");

  const { data: orders = [], isLoading } = trpc.accounting.listDeliveryOrders.useQuery(
    undefined,
    { refetchOnWindowFocus: false },
  );

  const filtered = orders.filter((o: DeliveryOrder) => {
    if (search && !o.customer?.toLowerCase().includes(search.toLowerCase()) && !o.id?.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (deliveryFilter !== "all" && o.deliveryStatus !== deliveryFilter) return false;
    return true;
  });

  const stats = {
    total:      orders.length,
    pending:    orders.filter((o: DeliveryOrder) => o.deliveryStatus === "pending" || o.deliveryStatus === "scheduled").length,
    inTransit:  orders.filter((o: DeliveryOrder) => o.deliveryStatus === "in_transit").length,
    delivered:  orders.filter((o: DeliveryOrder) => o.deliveryStatus === "delivered").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Orders</h1>
          <p className="text-muted-foreground">Manage delivery orders and track shipment status</p>
        </div>
        <Button asChild>
          <Link href="/accounting/delivery-orders/create">
            <Plus className="mr-2 h-4 w-4" /> Create Delivery Order
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Orders", value: stats.total, sub: "All delivery orders", icon: Package },
          { label: "Pending", value: stats.pending, sub: "Awaiting dispatch", icon: Clock },
          { label: "In Transit", value: stats.inTransit, sub: "Currently shipping", icon: Truck },
          { label: "Delivered", value: stats.delivered, sub: "Successfully delivered", icon: CheckCircle },
        ].map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Orders</CardTitle>
          <CardDescription>View and manage all delivery orders with tracking information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, DO number, or recipient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={deliveryFilter} onValueChange={setDeliveryFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filter by delivery" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Delivery Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> More Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DO Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Delivery Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>{Array.from({ length: 9 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}</TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">No delivery orders found</TableCell></TableRow>
              ) : (
                filtered.map((order: DeliveryOrder) => {
                  const s = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.draft;
                  const d = DELIVERY_CONFIG[order.deliveryStatus] ?? DELIVERY_CONFIG.pending;
                  const DIcon = d.icon;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.recipient}</TableCell>
                      <TableCell>{order.items} items</TableCell>
                      <TableCell>RM {order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</TableCell>
                      <TableCell>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "—"}</TableCell>
                      <TableCell><Badge variant={s.variant}>{s.label}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={d.variant} className="gap-1">
                          <DIcon className="h-3 w-3" />{d.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/accounting/delivery-orders/${order.id}`}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Order</DropdownMenuItem>
                            <DropdownMenuItem><Download className="mr-2 h-4 w-4" /> Download PDF</DropdownMenuItem>
                            <DropdownMenuItem><Truck className="mr-2 h-4 w-4" /> Track Delivery</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
