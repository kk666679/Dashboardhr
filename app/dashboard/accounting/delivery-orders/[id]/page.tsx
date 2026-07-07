"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DeliveryTracking } from "@/components/features/accounting/delivery-tracking";
import {
  ArrowLeft,
  Download,
  Edit,
  Truck,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";

type DeliveryOrderItem = {
  serviceType: string;
  description: string;
  workerName?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

type DeliveryOrder = {
  id: string;
  createdAt: string;
  status: string;
  deliveryStatus: string;
  items: DeliveryOrderItem[];
  subtotal: number;
  sst: number;
  total: number;
  customer: {
    id: string;
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  recipient: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  delivery: {
    date: string;
    time: string;
    method: string;
    priority: string;
    instructions?: string;
  };
};

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

const getDeliveryOrderById = (_id: string): DeliveryOrder | null => {
  return null;
};

export default function DeliveryOrderDetailsPage() {
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const deliveryOrder = getDeliveryOrderById(String(params.id ?? ""));

  if (!deliveryOrder) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/accounting/delivery-orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Delivery Orders
          </Link>
        </Button>
        <p className="text-muted-foreground">Delivery order not found.</p>
      </div>
    );
  }

  const statusBadge = getStatusBadge(deliveryOrder.status);

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // removed console.log
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/accounting/delivery-orders">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Delivery Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {deliveryOrder.id}
            </h1>
            <p className="text-muted-foreground">
              Created on{" "}
              {new Date(deliveryOrder.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Download PDF"}
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Tracking */}
          <DeliveryTracking
            deliveryOrderId={deliveryOrder.id}
            status={deliveryOrder.deliveryStatus as any}
          />

          {/* Delivery Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Delivery Items
              </CardTitle>
              <CardDescription>
                Items included in this delivery order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deliveryOrder.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-start p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{item.description}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Service Type:{" "}
                        {item.serviceType.replace("_", " ").toUpperCase()}
                      </p>
                      {item.workerName && item.workerName !== "N/A" && (
                        <p className="text-sm text-muted-foreground">
                          Worker: {item.workerName}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span>Qty: {item.quantity}</span>
                        <span>Unit Price: RM {item.unitPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        RM {item.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>RM {deliveryOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SST (6%):</span>
                    <span>RM {deliveryOrder.sst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>RM {deliveryOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{deliveryOrder.customer.name}</h4>
                <p className="text-sm text-muted-foreground">
                  ID: {deliveryOrder.customer.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Address:</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryOrder.customer.address}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact:</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryOrder.customer.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {deliveryOrder.customer.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recipient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Recipient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">{deliveryOrder.recipient.name}</h4>
              </div>
              <div>
                <p className="text-sm font-medium">Address:</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryOrder.recipient.address}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact:</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryOrder.recipient.phone}
                </p>
                <p className="text-sm text-muted-foreground">
                  {deliveryOrder.recipient.email}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(deliveryOrder.delivery.date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{deliveryOrder.delivery.time}</span>
              </div>
              <div>
                <p className="text-sm font-medium">Method:</p>
                <p className="text-sm text-muted-foreground">
                  {deliveryOrder.delivery.method}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Priority:</p>
                <Badge variant="outline">
                  {deliveryOrder.delivery.priority}
                </Badge>
              </div>
              {deliveryOrder.delivery.instructions && (
                <div>
                  <p className="text-sm font-medium">Special Instructions:</p>
                  <p className="text-sm text-muted-foreground">
                    {deliveryOrder.delivery.instructions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
