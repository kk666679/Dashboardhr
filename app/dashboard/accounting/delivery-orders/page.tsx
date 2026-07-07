"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  Filter,
  Download,
  Eye,
  Edit,
  MoreHorizontal,
  Truck,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Mock data for delivery orders
const deliveryOrders = [
  {
    id: "DO-2025-001",
    customer: "Tech Solutions Malaysia",
    recipient: "Kuala Lumpur Office",
    items: 3,
    totalAmount: 2850.0,
    deliveryDate: "2025-01-15",
    status: "pending",
    deliveryStatus: "scheduled",
    createdAt: "2025-01-10",
  },
  {
    id: "DO-2025-002",
    customer: "Manufacturing Plus Sdn Bhd",
    recipient: "Johor Factory",
    items: 5,
    totalAmount: 4200.0,
    deliveryDate: "2025-01-12",
    status: "confirmed",
    deliveryStatus: "in_transit",
    createdAt: "2025-01-08",
  },
  {
    id: "DO-2025-003",
    customer: "Construction Corp",
    recipient: "Penang Site Office",
    items: 2,
    totalAmount: 1650.0,
    deliveryDate: "2025-01-10",
    status: "completed",
    deliveryStatus: "delivered",
    createdAt: "2025-01-05",
  },
  {
    id: "DO-2025-004",
    customer: "Retail Chain Sdn Bhd",
    recipient: "Selangor Warehouse",
    items: 8,
    totalAmount: 6750.0,
    deliveryDate: "2025-01-18",
    status: "draft",
    deliveryStatus: "pending",
    createdAt: "2025-01-12",
  },
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    draft: { label: "Draft", variant: "secondary" as const },
    pending: { label: "Pending", variant: "outline" as const },
    confirmed: { label: "Confirmed", variant: "default" as const },
    completed: { label: "Completed", variant: "default" as const },
  };
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
  );
};

const getDeliveryStatusBadge = (status: string) => {
  const statusConfig = {
    pending: { label: "Pending", variant: "secondary" as const, icon: Clock },
    scheduled: {
      label: "Scheduled",
      variant: "outline" as const,
      icon: Package,
    },
    in_transit: {
      label: "In Transit",
      variant: "default" as const,
      icon: Truck,
    },
    delivered: {
      label: "Delivered",
      variant: "default" as const,
      icon: CheckCircle,
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      icon: AlertCircle,
    },
  };
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  );
};

export default function DeliveryOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");

  const filteredOrders = deliveryOrders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesDeliveryStatus =
      deliveryStatusFilter === "all" ||
      order.deliveryStatus === deliveryStatusFilter;

    return matchesSearch && matchesStatus && matchesDeliveryStatus;
  });

  // Statistics
  const stats = {
    total: deliveryOrders.length,
    pending: deliveryOrders.filter(
      (o) => o.deliveryStatus === "pending" || o.deliveryStatus === "scheduled",
    ).length,
    inTransit: deliveryOrders.filter((o) => o.deliveryStatus === "in_transit")
      .length,
    delivered: deliveryOrders.filter((o) => o.deliveryStatus === "delivered")
      .length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery Orders</h1>
          <p className="text-muted-foreground">
            Manage delivery orders and track shipment status
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/accounting/delivery-orders/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Delivery Order
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All delivery orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting dispatch</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Currently shipping</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.delivered}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Orders</CardTitle>
          <CardDescription>
            View and manage all delivery orders with tracking information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer, DO number, or recipient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={deliveryStatusFilter}
              onValueChange={setDeliveryStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by delivery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Delivery Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Orders Table */}
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
              {filteredOrders.map((order) => {
                const statusBadge = getStatusBadge(order.status);
                const deliveryBadge = getDeliveryStatusBadge(
                  order.deliveryStatus,
                );
                const DeliveryIcon = deliveryBadge.icon;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.recipient}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>RM {order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(order.deliveryDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={deliveryBadge.variant} className="gap-1">
                        <DeliveryIcon className="h-3 w-3" />
                        {deliveryBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dashboard/accounting/delivery-orders/${order.id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Truck className="mr-2 h-4 w-4" />
                            Track Delivery
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
